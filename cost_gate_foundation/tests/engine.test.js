'use strict';

const assert = require('assert');
const engine = require('../engine.js');
const fixtures = require('./fixtures.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

function finding(result, code) {
  const item = result.findings.find((candidate) => candidate.findingCode === code);
  assert.ok(item, `Missing finding ${code}`);
  return item;
}

const base = fixtures.baseInput();
const result = engine.compute(base);
assert.equal(result.ok, true);
assert.equal(result.scope.supported, true);
assert.equal(result.version, 'cost-gate-foundation-3-synthetic');

const independentFixed = 2 * 1;
const independentVariableRate = 2 * 0.0025 + 0.001 + 0.001;
const independentLifecycle = independentFixed + 500 * independentVariableRate;
const independentThreshold = independentLifecycle / 500;
const independentEntryCash = 500 + 1 + 1.25;

approx(result.friction.fixedCostEur, independentFixed);
approx(result.friction.variableFloorRate, independentVariableRate);
approx(result.friction.lifecycleFrictionEur, independentLifecycle);
approx(result.friction.breakEvenGrossRate, independentThreshold);
approx(result.friction.edgeResults.netEdgeRate.value, 0.02 - independentThreshold);
approx(result.cash.entryCashRequirementEur, independentEntryCash);
approx(result.cash.accountFreeSettledCashEur, 1000);
approx(result.cash.strategyAllocationHeadroomEur, 1000);
approx(result.cash.capitalFeasibilityCashEur, 1000);
assert.equal(result.summaryCode, 'no_incompatibility_detected_under_assumptions');
assert.equal(finding(result, 'gross_edge_survives_modelled_friction').status, 'satisfied');
assert.equal(finding(result, 'entry_cash_within_capital_feasibility_cash').status, 'satisfied');
assert.ok(result.unassessedLayers.includes('data_quality'));
assert.ok(result.unassessedLayers.includes('execution_cost'));
Object.values(result.invariants).forEach((value) => assert.equal(value, true));
engine.assertFiniteTree(result);

const exactThreshold = engine.compute(fixtures.baseInput({ grossEdgeRate: independentThreshold }));
const exactFinding = finding(exactThreshold, 'no_strictly_positive_margin');
assert.equal(exactFinding.status, 'breached');
approx(exactFinding.observedValue, 0);
assert.equal(exactThreshold.summaryCode, 'edge_not_surviving_modelled_friction');

const belowFloor = engine.compute(fixtures.baseInput({ grossEdgeRate: independentVariableRate - 0.001 }));
assert.equal(finding(belowFloor, 'gross_edge_not_above_variable_floor').status, 'structurally_unreachable');
assert.equal(belowFloor.summaryCode, 'structurally_non_viable');

const range = engine.compute(fixtures.baseInput({
  grossEdgeRate: null,
  grossEdgeLowRate: 0.008,
  grossEdgeBaseRate: 0.02,
  grossEdgeHighRate: 0.03
}));
assert.equal(range.friction.edgeMode, 'range_estimate');
assert.equal(range.friction.edgeResults.edgeRange.rangeState, 'crosses_break_even');
approx(range.friction.edgeResults.edgeRange.low.netEdgeRate.value, -0.003);
approx(range.friction.edgeResults.edgeRange.base.netEdgeRate.value, 0.009);
approx(range.friction.edgeResults.edgeRange.high.netEdgeRate.value, 0.019);
assert.equal(finding(range, 'gross_edge_range_crosses_break_even').status, 'breached');
assert.equal(range.summaryCode, 'edge_not_surviving_modelled_friction');

const explicitConstraintBreach = engine.compute(fixtures.baseInput({
  userConstraints: [{
    constraintId: 'declared_friction_budget',
    operator: 'lte',
    observedValue: 0.04,
    limitValue: 0.03,
    unit: 'decimal_rate'
  }]
}));
assert.equal(explicitConstraintBreach.summaryCode, 'constraint_breach');
assert.equal(finding(explicitConstraintBreach, 'declared_friction_budget').status, 'breached');

const partialRange = engine.compute(fixtures.baseInput({
  grossEdgeRate: null,
  grossEdgeLowRate: 0.008,
  grossEdgeBaseRate: null,
  grossEdgeHighRate: 0.03
}));
assert.equal(partialRange.ok, false);
assert.equal(partialRange.summaryCode, 'invalid_input');

const spreadCountedTwice = engine.compute(fixtures.baseInput({
  cash: { spreadReferencePriceStatus: 'included', entrySpreadCashEur: 0.5 }
}));
assert.equal(finding(spreadCountedTwice, 'cash_basis_conflicted').condition, 'spread_counted_twice');
assert.equal(spreadCountedTwice.summaryCode, 'insufficient_data');

const sourceAlreadyNetted = engine.compute(fixtures.baseInput({
  cash: {
    availableSettledCashEur: 400,
    availableSettledCashBasis: 'net_of_listed_holds',
    sourceIncludedHoldIds: ['H1'],
    holds: [{
      holdId: 'H1',
      holdType: 'pending_order',
      amountEur: 600,
      includedInAvailableSettledCash: true,
      includedInStrategyCapitalCommitted: false
    }],
    userDefinedCashReserveEur: 100,
    strategyCapitalEur: 1000,
    strategyCapitalCommittedEur: 0
  }
}));
approx(sourceAlreadyNetted.cash.deductibleHoldsEur, 0);
approx(sourceAlreadyNetted.cash.accountFreeSettledCashEur, 300);

const grossBasisWithIncludedHold = engine.compute(fixtures.baseInput({
  cash: {
    availableSettledCashBasis: 'gross_before_declared_holds',
    sourceIncludedHoldIds: ['H1'],
    holds: [{
      holdId: 'H1',
      holdType: 'pending_order',
      amountEur: 600,
      includedInAvailableSettledCash: true,
      includedInStrategyCapitalCommitted: false
    }]
  }
}));
assert.equal(grossBasisWithIncludedHold.cash.status, 'cash_basis_conflicted');
assert.equal(grossBasisWithIncludedHold.cash.reason, 'gross_cash_basis_contains_included_holds');
assert.notEqual(grossBasisWithIncludedHold.summaryCode, 'no_incompatibility_detected_under_assumptions');

const sourceIncludedIdsMismatch = engine.compute(fixtures.baseInput({
  cash: {
    availableSettledCashBasis: 'net_of_listed_holds',
    sourceIncludedHoldIds: [],
    holds: [{
      holdId: 'H1',
      holdType: 'pending_order',
      amountEur: 600,
      includedInAvailableSettledCash: true,
      includedInStrategyCapitalCommitted: false
    }]
  }
}));
assert.equal(sourceIncludedIdsMismatch.cash.status, 'cash_basis_conflicted');
assert.equal(sourceIncludedIdsMismatch.cash.reason, 'source_included_hold_ids_mismatch');

const strategyCap = engine.compute(fixtures.baseInput({
  cash: {
    availableSettledCashEur: 1000,
    strategyCapitalEur: 450,
    strategyCapitalCommittedEur: 100
  }
}));
approx(strategyCap.cash.accountFreeSettledCashEur, 1000);
approx(strategyCap.cash.strategyAllocationHeadroomEur, 350);
approx(strategyCap.cash.capitalFeasibilityCashEur, 350);
assert.equal(strategyCap.summaryCode, 'capital_not_feasible');

const quantityMismatch = engine.compute(fixtures.baseInput({ orderQuantity: 4 }));
assert.equal(finding(quantityMismatch, 'cash_basis_conflicted').condition, 'quantity_price_entry_consideration_mismatch');

const scenarioNotionalMismatch = engine.compute(fixtures.baseInput({ orderNotionalEur: 1000 }));
assert.equal(finding(scenarioNotionalMismatch, 'cash_basis_conflicted').condition, 'quantity_price_scenario_notional_mismatch');
assert.notEqual(scenarioNotionalMismatch.summaryCode, 'no_incompatibility_detected_under_assumptions');

const entryCommissionMismatch = engine.compute(fixtures.baseInput({ cash: { entryCommissionEur: 0 } }));
assert.equal(finding(entryCommissionMismatch, 'cash_basis_conflicted').condition, 'entry_commission_lifecycle_mismatch');

const missingEntryCommission = engine.compute(fixtures.baseInput({ cash: { entryCommissionEur: null } }));
assert.equal(missingEntryCommission.ok, false);
assert.equal(finding(missingEntryCommission, 'invalid_cash.entryCommissionEur').condition, 'missing');

const entryFxMismatch = engine.compute(fixtures.baseInput({ cash: { entryFxCashCostEur: 0 } }));
assert.equal(finding(entryFxMismatch, 'cash_basis_conflicted').condition, 'entry_fx_lifecycle_mismatch');

const sameCurrencyFx = engine.compute(fixtures.baseInput({ quoteCurrency: 'EUR' }));
assert.equal(finding(sameCurrencyFx, 'cash_basis_conflicted').condition, 'same_currency_fx_cost_conflict');
assert.equal(finding(sameCurrencyFx, 'invalid_cost.fxRatePerSide').condition, 'same_currency_fx_cost_conflict');
assert.equal(sameCurrencyFx.friction.complete, false);

const sameCurrencyWithoutCash = engine.compute(fixtures.baseInput({ quoteCurrency: 'EUR', cash: null }));
assert.equal(sameCurrencyWithoutCash.ok, false);
assert.equal(finding(sameCurrencyWithoutCash, 'invalid_cost.fxRatePerSide').condition, 'same_currency_fx_cost_conflict');
assert.equal(sameCurrencyWithoutCash.friction.complete, false);

const sameCurrencyWithoutFx = engine.compute(fixtures.baseInput({
  quoteCurrency: 'EUR',
  cost: { fxRatePerSide: 0 },
  cash: { entryFxCashCostEur: 0 }
}));
assert.equal(sameCurrencyWithoutFx.friction.complete, true);
assert.equal(sameCurrencyWithoutFx.cash.status, 'feasible_within_declared_strategy_cash');
assert.equal(sameCurrencyWithoutFx.summaryCode, 'no_incompatibility_detected_under_assumptions');

const unmodelledEntryTax = engine.compute(fixtures.baseInput({ cash: { entryTaxEur: 1 } }));
assert.equal(finding(unmodelledEntryTax, 'cash_basis_conflicted').condition, 'entry_fixed_costs_missing_from_lifecycle_model');
assert.equal(unmodelledEntryTax.friction.complete, false);
assert.deepEqual(unmodelledEntryTax.friction.missingComponents, ['tax_lifecycle_counterpart']);
assert.equal(finding(unmodelledEntryTax, 'friction_components_missing').status, 'insufficient_data');
assert.equal(finding(unmodelledEntryTax, 'complete_friction_required_for_edge').status, 'insufficient_data');
assert.equal(unmodelledEntryTax.findings.some((item) => item.findingCode === 'complete_friction_geometry_calculated'), false);

const unmodelledEntryFees = engine.compute(fixtures.baseInput({ cash: { entryContractualFeesEur: 1 } }));
assert.equal(unmodelledEntryFees.friction.complete, false);
assert.deepEqual(unmodelledEntryFees.friction.missingComponents, ['contractual_fees_lifecycle_counterpart']);

const duplicateHold = engine.compute(fixtures.baseInput({
  cash: {
    holds: [
      { holdId: 'H1', holdType: 'pending_order', amountEur: 10, includedInAvailableSettledCash: false, includedInStrategyCapitalCommitted: false },
      { holdId: 'H1', holdType: 'other_strategy', amountEur: 20, includedInAvailableSettledCash: false, includedInStrategyCapitalCommitted: false }
    ]
  }
}));
assert.equal(duplicateHold.ok, false);
assert.ok(duplicateHold.findings.some((item) => item.condition === 'duplicate_hold_id'));

const observedExecutionEdge = engine.compute(fixtures.baseInput({
  grossEdgeAlignment: fixtures.alignedGrossEdge({ key: { priceBasis: 'observed_execution_to_execution' } })
}));
assert.equal(observedExecutionEdge.alignment.state, 'edge_misaligned');
assert.ok(observedExecutionEdge.alignment.reasons.includes('executed_price_without_reconstruction'));
assert.equal(finding(observedExecutionEdge, 'gross_edge_basis_mismatch').status, 'invalid');
assert.equal(observedExecutionEdge.friction.complete, true);
approx(observedExecutionEdge.friction.breakEvenGrossRate, independentThreshold);

const partial = engine.compute(fixtures.baseInput({ cost: { spreadTotalRate: null } }));
assert.equal(partial.friction.complete, false);
assert.ok(partial.friction.missingComponents.includes('spreadTotalRate'));
approx(partial.friction.knownCostEur, 5);
assert.equal(finding(partial, 'friction_components_missing').status, 'insufficient_data');
assert.equal(finding(partial, 'complete_friction_required_for_edge').status, 'insufficient_data');

const invalidFrictionIndependentCash = engine.compute(fixtures.baseInput({
  cost: { commissionPerSideEur: -1 }
}));
assert.equal(invalidFrictionIndependentCash.ok, false);
assert.equal(invalidFrictionIndependentCash.summaryCode, 'invalid_input');
assert.equal(invalidFrictionIndependentCash.cash.status, 'feasible_within_declared_strategy_cash');
assert.equal(finding(invalidFrictionIndependentCash, 'entry_cash_within_capital_feasibility_cash').status, 'satisfied');

const malformedHolds = engine.compute(fixtures.baseInput({
  cash: { holds: { holdId: 'H1', amountEur: 600 } }
}));
assert.equal(malformedHolds.ok, false);
assert.equal(finding(malformedHolds, 'invalid_cash.holds').condition, 'array_required');
assert.notEqual(malformedHolds.summaryCode, 'no_incompatibility_detected_under_assumptions');

const malformedSources = engine.compute(fixtures.baseInput({
  sources: { provenance: 'external' }
}));
assert.equal(malformedSources.ok, false);
assert.equal(malformedSources.snapshot.status, 'snapshot_incomplete');
assert.equal(finding(malformedSources, 'invalid_sources').condition, 'array_required');
assert.equal(malformedSources.findings.some((item) => item.findingCode === 'synthetic_sources_current_for_evaluation_time'), false);

const malformedSourceElement = engine.compute(fixtures.baseInput({
  sources: [null],
  evaluatedAtUtc: '2026-07-14T10:00:00Z'
}));
assert.equal(malformedSourceElement.ok, false);
assert.equal(malformedSourceElement.snapshot.status, 'snapshot_incomplete');
assert.equal(finding(malformedSourceElement, 'invalid_sources.0').condition, 'object_required');
assert.equal(malformedSourceElement.findings.some((item) => item.findingCode === 'snapshot_serialization_failed'), false);
assert.equal(malformedSourceElement.findings.some((item) => item.findingCode === 'synthetic_sources_current_for_evaluation_time'), false);

const duplicateSourceIds = engine.compute(fixtures.baseInput({
  sources: [
    {
      sourceId: 'DUPLICATE', provenance: 'synthetic_demo', instrumentId: 'SYNTH:ABC', venueId: 'SYNTH-X',
      quoteCurrency: 'USD', observedAtUtc: '2026-07-14T10:00:00Z', validUntilUtc: '2026-07-14T11:00:00Z', critical: true
    },
    {
      sourceId: 'DUPLICATE', provenance: 'synthetic_demo', instrumentId: 'SYNTH:ABC', venueId: 'SYNTH-X',
      quoteCurrency: 'USD', observedAtUtc: '2026-07-14T10:00:00Z', validUntilUtc: '2026-07-14T11:00:00Z', critical: true
    }
  ],
  evaluatedAtUtc: '2026-07-14T10:30:00Z'
}));
assert.equal(duplicateSourceIds.ok, false);
assert.equal(finding(duplicateSourceIds, 'invalid_sources.1.sourceId').condition, 'duplicate_source_id');

const malformedConstraints = engine.compute(fixtures.baseInput({
  userConstraints: { constraintId: 'silently-dropped-before' }
}));
assert.equal(malformedConstraints.ok, false);
assert.equal(finding(malformedConstraints, 'invalid_userConstraints').condition, 'array_required');

const malformedConstraintElement = engine.compute(fixtures.baseInput({ userConstraints: [null] }));
assert.equal(malformedConstraintElement.ok, false);
assert.equal(finding(malformedConstraintElement, 'invalid_userConstraints.0').condition, 'object_required');

const duplicateConstraintIds = engine.compute(fixtures.baseInput({
  userConstraints: [
    { constraintId: 'same-id', operator: 'lte', observedValue: 1, limitValue: 2 },
    { constraintId: 'same-id', operator: 'lte', observedValue: 2, limitValue: 3 }
  ]
}));
assert.equal(duplicateConstraintIds.ok, false);
assert.equal(finding(duplicateConstraintIds, 'invalid_userConstraints.same-id').condition, 'duplicate_constraint_id');

const malformedCostExclusions = engine.compute(fixtures.baseInput({
  grossEdgeAlignment: fixtures.alignedGrossEdge({ key: { costExclusions: { commission: true } } })
}));
assert.equal(malformedCostExclusions.ok, false);
assert.equal(finding(malformedCostExclusions, 'invalid_grossEdgeAlignment.key.costExclusions').condition, 'array_required');

for (const malformedCollection of [null, {}, 'not-an-array', 42, true]) {
  const malformedCases = [
    engine.compute(fixtures.baseInput({ cash: { holds: malformedCollection } })),
    engine.compute(fixtures.baseInput({ cash: { sourceIncludedHoldIds: malformedCollection } })),
    engine.compute(fixtures.baseInput({ sources: malformedCollection })),
    engine.compute(fixtures.baseInput({ userConstraints: malformedCollection })),
    engine.compute(fixtures.baseInput({
      grossEdgeAlignment: fixtures.alignedGrossEdge({ key: { costExclusions: malformedCollection } })
    }))
  ];
  malformedCases.forEach((malformedResult) => {
    assert.notEqual(malformedResult.summaryCode, 'no_incompatibility_detected_under_assumptions');
    engine.assertFiniteTree(malformedResult);
  });
}

const roundTripWithOneSide = engine.compute(fixtures.baseInput({ cost: { sideCount: 1 } }));
assert.equal(roundTripWithOneSide.ok, false);
assert.equal(roundTripWithOneSide.summaryCode, 'invalid_input');
assert.equal(finding(roundTripWithOneSide, 'invalid_cost.sideCount').condition, 'operation_scope_side_count_mismatch');
assert.notEqual(roundTripWithOneSide.summaryCode, 'no_incompatibility_detected_under_assumptions');

const entryLegWithTwoSides = engine.compute(fixtures.baseInput({
  operationScope: 'entry_leg',
  grossEdgeAlignment: fixtures.alignedGrossEdge({ key: { operationScope: 'entry_leg' } }),
  cost: { sideCount: 2 }
}));
assert.equal(entryLegWithTwoSides.ok, false);
assert.equal(finding(entryLegWithTwoSides, 'invalid_cost.sideCount').condition, 'operation_scope_side_count_mismatch');

const unsupportedExitLeg = engine.compute(fixtures.baseInput({
  operationScope: 'exit_leg',
  grossEdgeAlignment: fixtures.alignedGrossEdge({ key: { operationScope: 'exit_leg' } }),
  cost: { sideCount: 1 }
}));
assert.equal(unsupportedExitLeg.summaryCode, 'unsupported_scope');
assert.ok(unsupportedExitLeg.scope.unsupportedFields.includes('operation_scope'));

const unsupported = engine.compute(fixtures.baseInput({
  accountModel: 'margin_account',
  positionModel: 'short_sale',
  instrumentType: 'option',
  side: 'short'
}));
assert.equal(unsupported.scope.supported, false);
assert.equal(unsupported.summaryCode, 'unsupported_scope');
assert.equal(finding(unsupported, 'unsupported_scope').status, 'unsupported');

for (const invalid of [NaN, Infinity, -Infinity, '500']) {
  const invalidResult = engine.compute(fixtures.baseInput({ orderNotionalEur: invalid }));
  assert.equal(invalidResult.ok, false);
  assert.equal(invalidResult.summaryCode, 'invalid_input');
}

const instanceB = fixtures.baseInput({
  snapshotInstanceId: 'fixture-instance-b',
  createdAtUtc: '2026-07-14T13:00:00Z',
  calculatedAtUtc: '2026-07-14T13:00:01Z'
});
const sameContent = engine.compute(instanceB);
assert.equal(sameContent.snapshot.snapshotId, result.snapshot.snapshotId);
assert.notEqual(sameContent.snapshot.snapshotInstanceId, result.snapshot.snapshotInstanceId);

const changed = engine.compute(fixtures.baseInput({
  orderNotionalEur: 600,
  orderQuantity: 6,
  cash: { entryAssetConsiderationEur: 600 }
}));
assert.notEqual(changed.snapshot.snapshotId, result.snapshot.snapshotId);
assert.deepEqual(engine.compareSnapshots(result, changed), {
  sameContent: false,
  oldSnapshot: 'obsolete',
  oldFindingsActive: false
});

const source = {
  sourceId: 'SYNTH-QUOTE-1',
  provenance: 'synthetic_demo',
  instrumentId: 'SYNTH:ABC',
  venueId: 'SYNTH-X',
  quoteCurrency: 'USD',
  observedAtUtc: '2026-07-14T10:00:00Z',
  validUntilUtc: '2026-07-14T10:01:00Z',
  critical: true
};
const fresh = engine.compute(fixtures.baseInput({ sources: [source], evaluatedAtUtc: '2026-07-14T10:00:30Z' }));
const stale = engine.compute(fixtures.baseInput({ sources: [source], evaluatedAtUtc: '2026-07-14T10:02:00Z' }));
assert.equal(fresh.snapshot.status, 'snapshot_current');
assert.equal(stale.snapshot.status, 'snapshot_expired');
assert.equal(fresh.snapshot.snapshotId, stale.snapshot.snapshotId);
assert.equal(stale.summaryCode, 'snapshot_unusable');
assert.deepEqual(engine.compareSnapshots(fresh, stale), {
  sameContent: true,
  oldSnapshot: 'expired',
  oldFindingsActive: false
});

const invalidEvaluationTime = engine.compute(fixtures.baseInput({
  sources: [source],
  evaluatedAtUtc: 'not-a-time'
}));
assert.equal(invalidEvaluationTime.ok, false);
assert.equal(invalidEvaluationTime.snapshot.status, 'snapshot_incomplete');
assert.equal(finding(invalidEvaluationTime, 'invalid_evaluatedAtUtc').condition, 'valid_utc_timestamp_required');
assert.equal(invalidEvaluationTime.findings.some((item) => item.findingCode === 'synthetic_sources_current_for_evaluation_time'), false);
assert.deepEqual(engine.compareSnapshots(fresh, invalidEvaluationTime), {
  sameContent: true,
  oldSnapshot: 'unusable',
  oldFindingsActive: false
});

const incompleteSourceIdentity = engine.compute(fixtures.baseInput({
  sources: [{
    sourceId: 'SYNTH-INCOMPLETE',
    provenance: 'synthetic_demo',
    observedAtUtc: '2026-07-14T10:00:00Z',
    validUntilUtc: '2026-07-14T11:00:00Z',
    critical: true
  }],
  evaluatedAtUtc: '2026-07-14T10:30:00Z'
}));
assert.equal(incompleteSourceIdentity.ok, false);
assert.equal(incompleteSourceIdentity.snapshot.status, 'snapshot_incomplete');
assert.equal(finding(incompleteSourceIdentity, 'invalid_sources.0.instrumentId').condition, 'non_empty_string_required');
assert.equal(finding(incompleteSourceIdentity, 'invalid_sources.0.venueId').condition, 'non_empty_string_required');
assert.equal(finding(incompleteSourceIdentity, 'invalid_sources.0.quoteCurrency').condition, 'non_empty_string_required');
assert.equal(incompleteSourceIdentity.findings.some((item) => item.findingCode === 'synthetic_sources_current_for_evaluation_time'), false);

const missingCriticalFlag = engine.compute(fixtures.baseInput({
  sources: [Object.assign({}, source, { critical: undefined })],
  evaluatedAtUtc: '2026-07-14T10:00:30Z'
}));
assert.equal(missingCriticalFlag.ok, false);
assert.equal(missingCriticalFlag.snapshot.status, 'snapshot_incomplete');
assert.equal(finding(missingCriticalFlag, 'invalid_sources.0.critical').condition, 'boolean_required');

const staleAndConflicted = engine.compute(fixtures.baseInput({
  sources: [Object.assign({}, source, { instrumentId: 'SYNTH:OTHER' })],
  evaluatedAtUtc: '2026-07-14T10:02:00Z'
}));
assert.equal(finding(staleAndConflicted, 'synthetic_source_stale').status, 'expired');
assert.equal(finding(staleAndConflicted, 'instrument_venue_currency_mismatch').status, 'conflicted');
assert.equal(staleAndConflicted.summaryCode, 'snapshot_unusable');

const futureSource = engine.compute(fixtures.baseInput({
  sources: [Object.assign({}, source, {
    sourceId: 'SYNTH-FUTURE',
    observedAtUtc: '2026-07-14T10:10:00Z',
    validUntilUtc: '2026-07-14T10:20:00Z'
  })],
  evaluatedAtUtc: '2026-07-14T10:00:00Z'
}));
assert.equal(futureSource.snapshot.status, 'snapshot_temporally_inconsistent');
assert.equal(finding(futureSource, 'synthetic_source_observed_after_evaluation').status, 'invalid');
assert.equal(futureSource.summaryCode, 'snapshot_unusable');

const criticalSource = Object.assign({}, source, {
  sourceId: 'SYNTH-CRITICAL',
  validUntilUtc: '2026-07-14T11:00:00Z',
  critical: true
});
const nonCriticalSource = Object.assign({}, source, {
  sourceId: 'SYNTH-NONCRITICAL',
  validUntilUtc: '2026-07-14T10:15:00Z',
  critical: false
});
const beforeNonCriticalExpiry = engine.compute(fixtures.baseInput({
  sources: [criticalSource, nonCriticalSource],
  evaluatedAtUtc: '2026-07-14T10:10:00Z'
}));
const afterNonCriticalExpiry = engine.compute(fixtures.baseInput({
  sources: [criticalSource, nonCriticalSource],
  evaluatedAtUtc: '2026-07-14T10:20:00Z'
}));
assert.equal(beforeNonCriticalExpiry.snapshot.expiresAtUtc, criticalSource.validUntilUtc);
assert.equal(afterNonCriticalExpiry.snapshot.expiresAtUtc, criticalSource.validUntilUtc);
assert.equal(afterNonCriticalExpiry.snapshot.status, 'snapshot_current');
assert.equal(finding(afterNonCriticalExpiry, 'synthetic_source_stale').status, 'expired');
assert.equal(
  afterNonCriticalExpiry.findings.some((item) => item.findingCode === 'synthetic_sources_current_for_evaluation_time'),
  false
);
assert.deepEqual(engine.compareSnapshots(beforeNonCriticalExpiry, afterNonCriticalExpiry), {
  sameContent: true,
  oldSnapshot: 'active',
  oldFindingsActive: true
});

const serialized = engine.canonicalStringify({ b: 2, a: -0 });
assert.equal(serialized, '{"a":0,"b":2}');
assert.equal(engine.sha256({ a: 1, b: 2 }), engine.sha256({ b: 2, a: 1 }));

console.log('Cost Gate foundation engine tests passed');
