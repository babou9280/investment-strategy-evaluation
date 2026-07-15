'use strict';

const assert = require('assert');
const engine = require('../../cost_gate_foundation/engine.js');
const adapter = require('../src/scenario.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

function build(fields, context) {
  return adapter.buildScenario(engine, fields, Object.assign({ mode: 'manual', instanceId: 'test-instance' }, context || {}));
}

assert.deepEqual(adapter.parseFrenchNumber('0,25'), { ok: true, reason: null, value: 0.25 });
assert.deepEqual(adapter.parseFrenchNumber(' 2.5 '), { ok: true, reason: null, value: 2.5 });
assert.equal(adapter.parseFrenchNumber('').reason, 'required');
assert.equal(adapter.parseFrenchNumber('1,2.3').reason, 'invalid_number');
assert.equal(adapter.parseFrenchNumber('1 000').reason, 'invalid_number');

const demo = build(adapter.demoFields(), { mode: 'demo' });
assert.equal(demo.ok, true);
assert.equal(demo.input.provenance, 'synthetic_demo');
assert.equal(demo.input.cost.sideCount, 2);
assert.equal(demo.input.orderNotionalEur, 500);
assert.equal(demo.input.cash.entryAssetConsiderationEur, 500);
assert.equal(demo.input.cash.entryCommissionEur, 1);
approx(demo.input.cash.entryFxCashCostEur, 1.25);
const demoResult = engine.compute(demo.input);
assert.equal(demoResult.summaryCode, 'no_incompatibility_detected_under_assumptions');
approx(demoResult.friction.fixedCostEur, 2);
approx(demoResult.friction.variableFloorRate, 0.007);
approx(demoResult.friction.lifecycleFrictionEur, 5.5);
approx(demoResult.friction.breakEvenGrossRate, 0.011);
approx(demoResult.friction.edgeResults.netEdgeRate.value, 0.009);
approx(demoResult.friction.edgeResults.netEdgeEur.value, 4.5);
approx(demoResult.cash.entryCashRequirementEur, 502.25);
approx(demoResult.cash.capitalFeasibilityCashEur, 1000);
engine.assertFiniteTree(demoResult);

const manual = build(adapter.demoFields(), { mode: 'manual' });
assert.equal(manual.ok, true);
assert.equal(manual.input.provenance, 'user_assumption');
assert.equal(manual.input.instrumentId, 'MANUAL:SCENARIO');
assert.equal(manual.input.venueId, 'MANUAL');

const empty = build({});
assert.equal(empty.ok, false);
for (const key of adapter.REQUIRED_NUMERIC_FIELDS) assert.equal(empty.errors[key], 'required');
assert.equal(empty.errors.instrumentType, 'required_choice');
assert.equal(empty.errors.operationScope, 'required_choice');
assert.equal(empty.errors.quoteCurrency, 'required_choice');
assert.equal(empty.errors.edgeMode, 'required_choice');

const zeroFields = adapter.demoFields();
zeroFields.commissionPerSideEur = '0';
zeroFields.fxRatePerSidePct = '0';
zeroFields.spreadTotalPct = '0';
zeroFields.slippageTotalPct = '0';
zeroFields.quoteCurrency = 'EUR';
const zero = build(zeroFields);
assert.equal(zero.ok, true);
assert.equal(zero.input.cost.commissionPerSideEur, 0);

const sameCurrencyFxFields = Object.assign(adapter.demoFields(), { quoteCurrency: 'EUR', fxRatePerSidePct: '0.01' });
const sameCurrencyFx = build(sameCurrencyFxFields);
assert.equal(sameCurrencyFx.ok, false);
assert.equal(sameCurrencyFx.errors.fxRatePerSidePct, 'same_currency_fx_must_be_zero');

const rangeFields = Object.assign(adapter.demoFields(), {
  edgeMode: 'range',
  grossEdgePct: '',
  grossEdgeLowPct: '0.8',
  grossEdgeBasePct: '2',
  grossEdgeHighPct: '3'
});
const range = build(rangeFields);
assert.equal(range.ok, true);
const rangeResult = engine.compute(range.input);
assert.equal(rangeResult.friction.edgeMode, 'range_estimate');
assert.equal(rangeResult.summaryCode, 'edge_not_surviving_modelled_friction');

const invalidRange = build(Object.assign({}, rangeFields, { grossEdgeLowPct: '4' }));
assert.equal(invalidRange.ok, false);
assert.equal(invalidRange.errors.grossEdgeLowPct, 'range_order_invalid');

const thresholdFields = Object.assign(adapter.demoFields(), {
  edgeMode: 'none', grossEdgePct: '', grossEdgeLowPct: '', grossEdgeBasePct: '', grossEdgeHighPct: ''
});
const thresholdOnly = build(thresholdFields);
assert.equal(thresholdOnly.ok, true);
assert.equal(Object.prototype.hasOwnProperty.call(thresholdOnly.input, 'grossEdgeAlignment'), false);
const thresholdResult = engine.compute(thresholdOnly.input);
assert.equal(thresholdResult.ok, true);
assert.equal(thresholdResult.friction.complete, true);
assert.equal(thresholdResult.friction.edgeMode, 'threshold_only');
assert.equal(thresholdResult.findings.some((item) => item.findingCode === 'gross_edge_not_provided'), true);

const taxFields = Object.assign(adapter.demoFields(), { entryTaxEur: '1' });
const tax = build(taxFields);
assert.equal(tax.ok, true);
const taxResult = engine.compute(tax.input);
assert.equal(taxResult.friction.complete, false);
assert.equal(taxResult.findings.some((item) => item.findingCode === 'complete_friction_required_for_edge'), true);

const entryLegFields = Object.assign(adapter.demoFields(), { operationScope: 'entry_leg' });
const entryLeg = build(entryLegFields, { mode: 'demo' });
assert.equal(entryLeg.ok, true);
assert.equal(entryLeg.input.cost.sideCount, 1);
assert.equal(entryLeg.input.grossEdgeAlignment.key.operationScope, 'entry_leg');

console.log('Cost Gate critique scenario adapter tests passed');
