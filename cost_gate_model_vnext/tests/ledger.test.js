'use strict';

const assert = require('assert');
const engine = require('../ledger.js');
const fixtures = require('./fixtures.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

function issueCodes(result) {
  return result.issues.map((item) => item.code);
}

function resultFor(ledger) {
  const result = engine.evaluate(ledger);
  engine.assertFiniteTree(result);
  return result;
}

// CL-01 — exact legacy round-trip parity.
const baseLegacy = fixtures.baseLegacy();
const adapted = engine.adaptLegacy(baseLegacy);
assert.equal(adapted.ok, true);
assert.equal(adapted.ledger.schemaVersion, 'cost-ledger-1');
assert.equal(adapted.ledger.components.length, 6);
const base = resultFor(adapted.ledger);
assert.equal(base.ok, true);
assert.equal(base.version, 'cost-ledger-engine-1-synthetic');
assert.equal(base.coverage.status, 'complete_under_declared_policy');
approx(base.knownCostFloorEur.base, 5.5);
approx(base.totalCostEur.base, 5.5);
approx(base.fixedCostEur.base, 2);
approx(base.proportionalCostEur.base, 3.5);
approx(base.breakEvenGrossRate.base, 0.011);
approx(base.variableFloorRate.base, 0.007);
assert.equal(base.downstreamEligibility.edgeSurvival, 'eligible');
assert.equal(base.downstreamEligibility.currentDataClaim, 'not_assessed');
assert.ok(base.limitations.includes('policy_does_not_prove_all_real_world_costs'));
assert.ok(base.limitations.includes('economic_event_identity_source_dependent'));

const spread = fixtures.componentByEvent(adapted.ledger, 'legacy.spread.full_cycle');
const execution = fixtures.componentByEvent(adapted.ledger, 'legacy.execution_cost.full_cycle');
assert.equal(spread.benchmark.kind, 'user_assumption_without_market_benchmark');
assert.equal(execution.benchmark.kind, 'user_assumption_without_market_benchmark');
assert.equal(execution.category, 'execution_cost_assumption');
assert.equal(execution.evidenceStatus, 'synthetic_demo');

// CL-02 — entry-leg parity.
const entryLegacy = fixtures.baseLegacy({
  operationScope: 'entry_leg',
  cost: { sideCount: 1 },
  grossEdgeAlignment: {
    key: { operationScope: 'entry_leg', exitRuleId: 'not_applicable' }
  }
});
const entry = engine.evaluateLegacy(entryLegacy);
assert.equal(entry.ok, true);
assert.equal(entry.result.coverage.status, 'complete_under_declared_policy');
assert.equal(entry.ledger.components.length, 4);
approx(entry.result.fixedCostEur.base, 1);
approx(entry.result.proportionalCostEur.base, 2.25);
approx(entry.result.totalCostEur.base, 3.25);
approx(entry.result.breakEvenGrossRate.base, 0.0065);
approx(entry.result.variableFloorRate.base, 0.0045);
assert.equal(entry.ledger.components.some((item) => item.lifecycleScope === 'exit'), false);

// CL-03 — explicit zero is still a complete set of events.
const zero = engine.evaluateLegacy(fixtures.baseLegacy({
  cost: {
    sideCount: 2,
    commissionPerSideEur: 0,
    fxRatePerSide: 0,
    spreadTotalRate: 0,
    slippageTotalRate: 0
  },
  cash: { entryCommissionEur: 0, entryFxCashCostEur: 0 }
}));
assert.equal(zero.ok, true);
assert.equal(zero.result.coverage.status, 'complete_under_declared_policy');
assert.equal(zero.ledger.components.length, 6);
assert.deepEqual(zero.result.totalCostEur, { low: 0, base: 0, high: 0 });
engine.assertFiniteTree(zero.result);

// CL-04 — missing is different from zero and only the known floor remains.
const missingCommissionInput = fixtures.baseLegacy();
delete missingCommissionInput.cost.commissionPerSideEur;
const missingCommission = engine.evaluateLegacy(missingCommissionInput);
assert.equal(missingCommission.ok, true);
assert.equal(missingCommission.result.coverage.status, 'partial_under_declared_policy');
assert.deepEqual(missingCommission.result.coverage.missingEconomicEventIds, [
  'legacy.commission.entry',
  'legacy.commission.exit'
]);
approx(missingCommission.result.knownCostFloorEur.base, 3.5);
assert.equal(missingCommission.result.totalCostEur, null);
assert.equal(missingCommission.result.breakEvenGrossRate, null);

// CL-05 — non-economic collection order does not change the hash or totals.
const reversed = fixtures.deepClone(adapted.ledger);
reversed.components.reverse();
reversed.coverage.expectedEconomicEventIds.reverse();
reversed.coverage.limitations.reverse();
const reversedResult = resultFor(reversed);
assert.equal(reversedResult.ledgerHash, base.ledgerHash);
assert.deepEqual(reversedResult.totalCostEur, base.totalCostEur);
assert.deepEqual(reversedResult.issues, base.issues);

// CL-07 — duplicate representation identity is invalid.
const duplicateComponent = fixtures.deepClone(adapted.ledger);
duplicateComponent.components[1].componentId = duplicateComponent.components[0].componentId;
const duplicateComponentResult = resultFor(duplicateComponent);
assert.equal(duplicateComponentResult.ok, false);
assert.ok(issueCodes(duplicateComponentResult).includes('duplicate_component_id'));
assert.equal(duplicateComponentResult.totalCostEur, null);

// CL-08 — distinct representations of one economic event are conflicted and excluded.
const duplicateEvent = fixtures.deepClone(adapted.ledger);
duplicateEvent.components[1].economicEventId = duplicateEvent.components[0].economicEventId;
const duplicateEventResult = resultFor(duplicateEvent);
assert.equal(duplicateEventResult.ok, false);
assert.ok(issueCodes(duplicateEventResult).includes('duplicate_economic_event'));
assert.equal(duplicateEventResult.coverage.status, 'partial_under_declared_policy');
assert.equal(duplicateEventResult.totalCostEur, null);

// CL-09 — a complete declaration cannot override a missing event.
const missingSpread = fixtures.deepClone(adapted.ledger);
missingSpread.components = missingSpread.components.filter((item) => item.economicEventId !== 'legacy.spread.full_cycle');
const missingSpreadResult = resultFor(missingSpread);
assert.equal(missingSpreadResult.coverage.status, 'partial_under_declared_policy');
assert.ok(missingSpreadResult.coverage.missingEconomicEventIds.includes('legacy.spread.full_cycle'));
assert.equal(missingSpreadResult.totalCostEur, null);

// CL-10 — a partial declaration is never promoted.
const declaredPartial = fixtures.deepClone(adapted.ledger);
declaredPartial.coverage.declaration = 'declared_partial';
const declaredPartialResult = resultFor(declaredPartial);
assert.equal(declaredPartialResult.ok, true);
assert.equal(declaredPartialResult.coverage.status, 'partial_declared');
assert.equal(declaredPartialResult.totalCostEur, null);

// CL-12 — same-currency FX cost is rejected before adaptation.
const sameCurrency = engine.evaluateLegacy(fixtures.baseLegacy({ quoteCurrency: 'EUR' }));
assert.equal(sameCurrency.ok, false);
assert.equal(sameCurrency.errors['cost.fxRatePerSide'], 'same_currency_fx_cost_conflict');

// CL-13 and CL-14 — no implicit basis or currency conversion.
const missingBasis = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(missingBasis, 'legacy.fx.entry').calculationBasis = 'fx_converted_amount';
const missingBasisResult = resultFor(missingBasis);
assert.ok(issueCodes(missingBasisResult).includes('missing_calculation_basis'));
assert.equal(missingBasisResult.totalCostEur, null);

const unsupportedCurrency = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(unsupportedCurrency, 'legacy.fx.entry').amountCurrency = 'USD';
const unsupportedCurrencyResult = resultFor(unsupportedCurrency);
assert.ok(issueCodes(unsupportedCurrencyResult).includes('unsupported_currency'));
assert.equal(unsupportedCurrencyResult.totalCostEur, null);

// CL-15 and CL-16 — lifecycle and operation scope are explicit.
const wrongSide = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(wrongSide, 'legacy.commission.entry').side = 'sell';
assert.ok(issueCodes(resultFor(wrongSide)).includes('lifecycle_side_mismatch'));

const wrongScope = fixtures.deepClone(entry.ledger);
const exitComponent = fixtures.deepClone(fixtures.componentByEvent(adapted.ledger, 'legacy.commission.exit'));
wrongScope.components.push(exitComponent);
wrongScope.coverage.expectedEconomicEventIds.push(exitComponent.economicEventId);
assert.ok(issueCodes(resultFor(wrongScope)).includes('operation_scope_component_mismatch'));

// CL-17 — the initial ledger has one adverse-cost sign convention.
const wrongSign = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(wrongSign, 'legacy.commission.entry').parameters.amount = -1;
fixtures.componentByEvent(wrongSign, 'legacy.commission.entry').uncertainty.low = -1;
fixtures.componentByEvent(wrongSign, 'legacy.commission.entry').uncertainty.base = -1;
fixtures.componentByEvent(wrongSign, 'legacy.commission.entry').uncertainty.high = -1;
assert.ok(issueCodes(resultFor(wrongSign)).includes('non_negative_number_required'));

// CL-18 — spread/execution assumptions cannot omit benchmark semantics.
const noBenchmark = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(noBenchmark, 'legacy.spread.full_cycle').benchmark = null;
const noBenchmarkResult = resultFor(noBenchmark);
assert.equal(noBenchmarkResult.totalCostEur, null);
assert.ok(issueCodes(noBenchmarkResult).includes('object_required'));

// CL-20 to CL-23 — arithmetic, inclusion and evidence remain separate.
const unknownPrice = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(unknownPrice, 'legacy.spread.full_cycle').priceInclusion = 'unknown';
const unknownPriceResult = resultFor(unknownPrice);
approx(unknownPriceResult.totalCostEur.base, 5.5);
assert.equal(unknownPriceResult.downstreamEligibility.edgeSurvival, 'eligible');
assert.equal(unknownPriceResult.downstreamEligibility.entryCash, 'blocked_by_unknown_price_inclusion');

const unknownEdge = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(unknownEdge, 'legacy.spread.full_cycle').edgeInclusion = 'unknown';
const unknownEdgeResult = resultFor(unknownEdge);
approx(unknownEdgeResult.totalCostEur.base, 5.5);
assert.equal(unknownEdgeResult.downstreamEligibility.edgeSurvival, 'blocked_by_unknown_edge_inclusion');

const unknownCashSource = fixtures.deepClone(adapted.ledger);
const entryCommission = fixtures.componentByEvent(unknownCashSource, 'legacy.commission.entry');
entryCommission.cashSourceInclusion = 'unknown';
entryCommission.priceInclusion = 'excluded';
fixtures.componentByEvent(unknownCashSource, 'legacy.spread.full_cycle').priceInclusion = 'excluded';
fixtures.componentByEvent(unknownCashSource, 'legacy.execution_cost.full_cycle').priceInclusion = 'excluded';
const unknownCashSourceResult = resultFor(unknownCashSource);
assert.equal(unknownCashSourceResult.downstreamEligibility.entryCash, 'blocked_by_unknown_cash_source_inclusion');
assert.equal(unknownCashSourceResult.downstreamEligibility.currentDataClaim, 'not_assessed');

// CL-24 — a reserved category is visible and never approximated.
const reserved = fixtures.deepClone(adapted.ledger);
const reservedComponent = fixtures.componentByEvent(reserved, 'legacy.execution_cost.full_cycle');
reservedComponent.category = 'market_impact';
const reservedResult = resultFor(reserved);
assert.equal(reservedResult.ok, true);
assert.equal(reservedResult.coverage.status, 'partial_under_declared_policy');
assert.equal(reservedResult.totalCostEur, null);
assert.ok(issueCodes(reservedResult).includes('reserved_category_not_assessed'));

// CL-25 — explicitly non-probabilistic sensitivity envelope.
const sensitivity = fixtures.deepClone(adapted.ledger);
const sensitivityComponent = fixtures.componentByEvent(sensitivity, 'legacy.execution_cost.full_cycle');
sensitivityComponent.uncertainty = {
  kind: 'sensitivity_range',
  appliesTo: 'parameters.rate',
  low: 0.0005,
  base: 0.001,
  high: 0.002,
  unit: 'decimal_rate',
  method: 'synthetic_sensitivity',
  coverage: 'not_applicable',
  calibrated: false,
  limitations: ['not_probabilistic']
};
const sensitivityResult = resultFor(sensitivity);
assert.equal(sensitivityResult.ok, true);
assert.deepEqual(sensitivityResult.totalCostEur, { low: 5.25, base: 5.5, high: 6 });
assert.deepEqual(sensitivityResult.breakEvenGrossRate, { low: 0.0105, base: 0.011, high: 0.012 });

// CL-26 and CL-27 — invalid ranges are not silently sorted or promoted.
const unordered = fixtures.deepClone(sensitivity);
fixtures.componentByEvent(unordered, 'legacy.execution_cost.full_cycle').uncertainty.low = 0.0015;
assert.ok(issueCodes(resultFor(unordered)).includes('invalid_uncertainty_order'));

const falseCoverage = fixtures.deepClone(sensitivity);
const falseCoverageUncertainty = fixtures.componentByEvent(falseCoverage, 'legacy.execution_cost.full_cycle').uncertainty;
falseCoverageUncertainty.coverage = '0.95';
falseCoverageUncertainty.calibrated = true;
assert.ok(issueCodes(resultFor(falseCoverage)).includes('sensitivity_cannot_claim_coverage'));

// CL-30 — economic mutation invalidates identity; key order does not.
const mutated = fixtures.deepClone(adapted.ledger);
const mutatedCommission = fixtures.componentByEvent(mutated, 'legacy.commission.entry');
mutatedCommission.parameters.amount = 1.01;
mutatedCommission.uncertainty.low = 1.01;
mutatedCommission.uncertainty.base = 1.01;
mutatedCommission.uncertainty.high = 1.01;
assert.notEqual(resultFor(mutated).ledgerHash, base.ledgerHash);

// Contractual nonzero cash costs remain missing from the legacy lifecycle policy.
const contractualFee = engine.evaluateLegacy(fixtures.baseLegacy({ cash: { entryContractualFeesEur: 2 } }));
assert.equal(contractualFee.ok, true);
assert.equal(contractualFee.result.coverage.status, 'partial_under_declared_policy');
assert.ok(contractualFee.result.coverage.missingEconomicEventIds.includes('legacy.entry_contractual_fee.entry'));
assert.equal(contractualFee.result.totalCostEur, null);

// CL-32 — the named return denominator must reconcile to an actual basis,
// including in a fixed-only ledger.
const denominatorMismatch = fixtures.deepClone(adapted.ledger);
denominatorMismatch.returnDenominator.amount = 501;
const denominatorMismatchResult = resultFor(denominatorMismatch);
assert.ok(issueCodes(denominatorMismatchResult).includes('return_denominator_basis_mismatch'));
assert.equal(denominatorMismatchResult.totalCostEur, null);
assert.equal(denominatorMismatchResult.breakEvenGrossRate, null);

const unknownDenominator = fixtures.deepClone(adapted.ledger);
unknownDenominator.returnDenominator.basis = 'portfolio_equity';
const unknownDenominatorResult = resultFor(unknownDenominator);
assert.ok(issueCodes(unknownDenominatorResult).includes('unsupported_return_denominator_basis'));
assert.equal(unknownDenominatorResult.breakEvenGrossRate, null);

const fixedOnly = fixtures.deepClone(adapted.ledger);
fixedOnly.components = fixedOnly.components.filter((component) => component.calculationKind === 'fixed');
fixedOnly.coverage.expectedEconomicEventIds = fixedOnly.components.map((component) => component.economicEventId).sort();
fixedOnly.returnDenominator.amount = 499;
const fixedOnlyMismatchResult = resultFor(fixedOnly);
assert.ok(issueCodes(fixedOnlyMismatchResult).includes('return_denominator_basis_mismatch'));
assert.equal(fixedOnlyMismatchResult.breakEvenGrossRate, null);

// CL-33 — dependency graphs are reserved and cannot be silently ignored in v1.
const dependency = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(dependency, 'legacy.commission.exit').dependencies = [
  fixtures.componentByEvent(dependency, 'legacy.commission.entry').componentId
];
const dependencyResult = resultFor(dependency);
assert.ok(issueCodes(dependencyResult).includes('dependency_semantics_unsupported_in_v1'));
assert.equal(dependencyResult.totalCostEur, null);

// CL-34 — every cost must be reconciled explicitly against gross edge.
const nonApplicableEdge = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(nonApplicableEdge, 'legacy.commission.entry').edgeInclusion = 'not_applicable';
const nonApplicableEdgeResult = resultFor(nonApplicableEdge);
assert.ok(issueCodes(nonApplicableEdgeResult).includes('edge_inclusion_required_for_cost_component'));
assert.equal(nonApplicableEdgeResult.totalCostEur, null);
assert.notEqual(nonApplicableEdgeResult.downstreamEligibility.edgeSurvival, 'eligible');

// CL-35 — numeric parity is preserved while extrapolation limits stay explicit.
assert.equal(base.variableFloorQualification, 'algebraic_under_declared_scaling_without_size_domain');
assert.ok(base.limitations.includes('known_floor_requires_nonnegative_cost_ontology'));
assert.ok(base.limitations.includes('component_sensitivities_co_moved_without_joint_model'));
assert.ok(base.limitations.includes('scaling_domain_not_assessed'));

// CL-36 — the cost snapshot remains bound to its economic context.
assert.deepEqual(adapted.ledger.scenarioContext, {
  instrumentId: 'SYNTH:ABC',
  venueId: 'SYNTH-X',
  direction: 'long',
  operationScope: 'complete_round_trip',
  holdingHorizonDefinition: 'user_defined',
  accountCurrency: 'EUR',
  quoteCurrency: 'USD'
});
assert.equal(typeof base.scenarioContextHash, 'string');
assert.equal(base.scenarioContextHash.length, 64);

// CL-37 — a missing or contradictory context never yields a complete threshold.
const missingContext = fixtures.deepClone(adapted.ledger);
delete missingContext.scenarioContext;
const missingContextResult = resultFor(missingContext);
assert.ok(issueCodes(missingContextResult).includes('object_required'));
assert.equal(missingContextResult.totalCostEur, null);

const contradictoryContext = fixtures.deepClone(adapted.ledger);
contradictoryContext.scenarioContext.operationScope = 'entry_leg';
const contradictoryContextResult = resultFor(contradictoryContext);
assert.ok(issueCodes(contradictoryContextResult).includes('scenario_context_root_mismatch'));
assert.equal(contradictoryContextResult.breakEvenGrossRate, null);

const missingInstrumentInput = fixtures.baseLegacy();
delete missingInstrumentInput.instrumentId;
assert.equal(engine.adaptLegacy(missingInstrumentInput).errors.instrumentId, 'non_empty_string_required');

// CL-38 — context mutation changes both identities; key order does not.
const changedVenue = fixtures.deepClone(adapted.ledger);
changedVenue.scenarioContext.venueId = 'SYNTH-Y';
const changedVenueResult = resultFor(changedVenue);
assert.notEqual(changedVenueResult.ledgerHash, base.ledgerHash);
assert.notEqual(changedVenueResult.scenarioContextHash, base.scenarioContextHash);

const reorderedContext = fixtures.deepClone(adapted.ledger);
reorderedContext.scenarioContext = {
  quoteCurrency: reorderedContext.scenarioContext.quoteCurrency,
  accountCurrency: reorderedContext.scenarioContext.accountCurrency,
  holdingHorizonDefinition: reorderedContext.scenarioContext.holdingHorizonDefinition,
  operationScope: reorderedContext.scenarioContext.operationScope,
  direction: reorderedContext.scenarioContext.direction,
  venueId: reorderedContext.scenarioContext.venueId,
  instrumentId: reorderedContext.scenarioContext.instrumentId
};
const reorderedContextResult = resultFor(reorderedContext);
assert.equal(reorderedContextResult.ledgerHash, base.ledgerHash);
assert.equal(reorderedContextResult.scenarioContextHash, base.scenarioContextHash);

console.log('Cost Ledger v1 contract tests: PASS');
