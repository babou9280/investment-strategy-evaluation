'use strict';

const assert = require('assert');
const ledgerEngine = require('../ledger.js');
const foundationEngine = require('../../cost_gate_foundation/engine.js');
const fixtures = require('./fixtures.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

function setPoint(component, value) {
  const field = component.calculationKind === 'fixed' ? 'amount' : 'rate';
  component.parameters[field] = value;
  component.uncertainty.low = value;
  component.uncertainty.base = value;
  component.uncertainty.high = value;
}

// Independent parity grid: neither engine supplies the expected formula.
const notionals = [50, 250, 500, 1000, 10000];
const commissions = [0, 0.5, 1, 7.25];
const fxRates = [0, 0.0005, 0.0025, 0.01];
const spreadRates = [0, 0.0002, 0.001, 0.02];
const executionRates = [0, 0.0001, 0.001, 0.03];
const scopes = [
  { operationScope: 'entry_leg', sideCount: 1 },
  { operationScope: 'complete_round_trip', sideCount: 2 }
];

let cases = 0;
scopes.forEach(({ operationScope, sideCount }) => {
  notionals.forEach((N, index) => {
    const commission = commissions[index % commissions.length];
    const fx = fxRates[(index + 1) % fxRates.length];
    const spread = spreadRates[(index + 2) % spreadRates.length];
    const execution = executionRates[(index + 3) % executionRates.length];
    const input = fixtures.baseLegacy({
      operationScope,
      orderNotionalEur: N,
      cost: {
        sideCount,
        commissionPerSideEur: commission,
        fxRatePerSide: fx,
        spreadTotalRate: spread,
        slippageTotalRate: execution
      },
      cash: null
    });
    const foundation = foundationEngine.compute(input);
    const ledger = ledgerEngine.evaluateLegacy(input);
    assert.equal(foundation.friction.complete, true);
    assert.equal(ledger.ok, true);
    assert.equal(ledger.result.coverage.status, 'complete_under_declared_policy');

    const independentFixed = sideCount * commission;
    const independentVariableRate = sideCount * fx + spread + execution;
    const independentVariableCost = N * independentVariableRate;
    const independentTotal = independentFixed + independentVariableCost;
    const independentThreshold = independentTotal / N;

    approx(ledger.result.fixedCostEur.base, independentFixed);
    approx(ledger.result.proportionalCostEur.base, independentVariableCost);
    approx(ledger.result.totalCostEur.base, independentTotal);
    approx(ledger.result.breakEvenGrossRate.base, independentThreshold);
    approx(ledger.result.variableFloorRate.base, independentVariableRate);
    approx(ledger.result.totalCostEur.base, foundation.friction.lifecycleFrictionEur);
    approx(ledger.result.breakEvenGrossRate.base, foundation.friction.breakEvenGrossRate);
    approx(ledger.result.fixedCostEur.base, foundation.friction.fixedCostEur);
    approx(ledger.result.variableFloorRate.base, foundation.friction.variableFloorRate);
    cases += 1;
  });
});
assert.equal(cases, 10);

// Partial parity: known components equal the independent and historical subtotal.
['commissionPerSideEur', 'fxRatePerSide', 'spreadTotalRate', 'slippageTotalRate'].forEach((missingField) => {
  const input = fixtures.baseLegacy({ cash: null });
  delete input.cost[missingField];
  const foundation = foundationEngine.compute(input);
  const ledger = ledgerEngine.evaluateLegacy(input);
  assert.equal(foundation.friction.complete, false);
  assert.equal(ledger.result.coverage.status, 'partial_under_declared_policy');
  approx(ledger.result.knownCostFloorEur.base, foundation.friction.knownCostEur);
  assert.equal(ledger.result.totalCostEur, null);
});

// Monotonicity for every calculable cost parameter.
const baseAdapted = ledgerEngine.adaptLegacy(fixtures.baseLegacy({ cash: null }));
assert.equal(baseAdapted.ok, true);
const baseResult = ledgerEngine.evaluate(baseAdapted.ledger);
baseAdapted.ledger.components.forEach((component, index) => {
  const increased = fixtures.deepClone(baseAdapted.ledger);
  const target = increased.components[index];
  const field = target.calculationKind === 'fixed' ? 'amount' : 'rate';
  const delta = target.calculationKind === 'fixed' ? 0.25 : 0.00025;
  setPoint(target, target.parameters[field] + delta);
  const result = ledgerEngine.evaluate(increased);
  assert.equal(result.ok, true);
  assert.ok(result.totalCostEur.base >= baseResult.totalCostEur.base);
  assert.ok(result.breakEvenGrossRate.base >= baseResult.breakEvenGrossRate.base);
});

// CL-29: fixed + proportional geometry and its declared floor.
[
  { N: 250, total: 3.75, threshold: 0.015 },
  { N: 500, total: 5.5, threshold: 0.011 },
  { N: 1000, total: 9, threshold: 0.009 }
].forEach(({ N, total, threshold }) => {
  const input = fixtures.baseLegacy({ orderNotionalEur: N, cash: null });
  const result = ledgerEngine.evaluateLegacy(input).result;
  approx(result.totalCostEur.base, total);
  approx(result.breakEvenGrossRate.base, threshold);
  approx(result.variableFloorRate.base, 0.007);
});

// Any unsupported scaling claim suppresses the structural floor, not the scenario total.
const unprovenScaling = fixtures.deepClone(baseAdapted.ledger);
const fxEntry = fixtures.componentByEvent(unprovenScaling, 'legacy.fx.entry');
unprovenScaling.basisValues.exit_notional = { amount: 400, currency: 'EUR' };
fxEntry.calculationBasis = 'exit_notional';
fxEntry.notionalScaling = 'proportional_to_other_basis';
const unprovenScalingResult = ledgerEngine.evaluate(unprovenScaling);
assert.equal(unprovenScalingResult.ok, true);
assert.ok(unprovenScalingResult.totalCostEur);
assert.equal(unprovenScalingResult.variableFloorRate, null);

// Envelope order is preserved for all nonnegative component sensitivities.
const envelope = fixtures.deepClone(baseAdapted.ledger);
envelope.components.forEach((component, index) => {
  const field = component.calculationKind === 'fixed' ? 'amount' : 'rate';
  const baseValue = component.parameters[field];
  const step = component.calculationKind === 'fixed' ? 0.1 * (index + 1) : 0.00001 * (index + 1);
  component.uncertainty = {
    kind: 'sensitivity_range',
    appliesTo: `parameters.${field}`,
    low: Math.max(0, baseValue - step),
    base: baseValue,
    high: baseValue + step,
    unit: component.calculationKind === 'fixed' ? 'EUR' : 'decimal_rate',
    method: 'property_sensitivity',
    coverage: 'not_applicable',
    calibrated: false,
    limitations: ['not_probabilistic']
  };
});
const envelopeResult = ledgerEngine.evaluate(envelope);
assert.equal(envelopeResult.ok, true);
assert.ok(envelopeResult.totalCostEur.low <= envelopeResult.totalCostEur.base);
assert.ok(envelopeResult.totalCostEur.base <= envelopeResult.totalCostEur.high);
assert.ok(envelopeResult.breakEvenGrossRate.low <= envelopeResult.breakEvenGrossRate.base);
assert.ok(envelopeResult.breakEvenGrossRate.base <= envelopeResult.breakEvenGrossRate.high);

// Non-finite values fail closed; negative zero is normalized out of outputs.
[NaN, Infinity, -Infinity].forEach((badValue) => {
  const input = fixtures.baseLegacy();
  input.cost.commissionPerSideEur = badValue;
  const result = ledgerEngine.evaluateLegacy(input);
  assert.equal(result.ok, false);
  assert.equal(result.errors['cost.commissionPerSideEur'], 'not_finite_number');
});
const negativeZeroInput = fixtures.baseLegacy({
  cost: {
    sideCount: 2,
    commissionPerSideEur: -0,
    fxRatePerSide: -0,
    spreadTotalRate: -0,
    slippageTotalRate: -0
  },
  cash: { entryCommissionEur: 0, entryFxCashCostEur: 0 }
});
const negativeZero = ledgerEngine.evaluateLegacy(negativeZeroInput);
assert.equal(negativeZero.ok, true);
ledgerEngine.assertFiniteTree(negativeZero.result);

console.log(`Cost Ledger v1 property tests: PASS (${cases} parity cases)`);
