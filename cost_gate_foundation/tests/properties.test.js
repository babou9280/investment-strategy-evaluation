'use strict';

const assert = require('assert');
const engine = require('../engine.js');
const fixtures = require('./fixtures.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

let previousThreshold = Infinity;
for (const notional of [100, 250, 500, 1000, 5000]) {
  const quantity = notional / 100;
  const result = engine.compute(fixtures.baseInput({
    orderNotionalEur: notional,
    orderQuantity: quantity,
    cash: {
      entryAssetConsiderationEur: notional,
      availableSettledCashEur: 10000,
      strategyCapitalEur: 10000
    }
  }));
  assert.ok(result.friction.breakEvenGrossRate <= previousThreshold);
  assert.ok(result.friction.breakEvenGrossRate >= result.friction.variableFloorRate);
  previousThreshold = result.friction.breakEvenGrossRate;
}

for (const accountCash of [0, 100, 500, 1000]) {
  for (const strategyHeadroom of [0, 100, 500, 1000]) {
    const result = engine.compute(fixtures.baseInput({
      cash: {
        availableSettledCashEur: accountCash,
        strategyCapitalEur: strategyHeadroom,
        strategyCapitalCommittedEur: 0
      }
    }));
    approx(result.cash.capitalFeasibilityCashEur, Math.min(accountCash, strategyHeadroom));
    assert.ok(result.cash.capitalFeasibilityCashEur <= result.cash.accountFreeSettledCashEur);
    assert.ok(result.cash.capitalFeasibilityCashEur <= result.cash.strategyAllocationHeadroomEur);
  }
}

const holds = [
  { holdId: 'A', holdType: 'pending_order', amountEur: 100, includedInAvailableSettledCash: false, includedInStrategyCapitalCommitted: false },
  { holdId: 'B', holdType: 'other_strategy', amountEur: 50, includedInAvailableSettledCash: true, includedInStrategyCapitalCommitted: true }
];
const reconciled = engine.compute(fixtures.baseInput({
  cash: {
    holds,
    strategyCapitalCommittedEur: 50
  }
}));
approx(reconciled.cash.deductibleHoldsEur, 100);
approx(reconciled.cash.strategyIncludedHoldsEur, 50);
approx(reconciled.cash.accountFreeSettledCashEur, 900);
approx(reconciled.cash.strategyAllocationHeadroomEur, 950);
approx(reconciled.cash.capitalFeasibilityCashEur, 900);

const reorderedHolds = engine.compute(fixtures.baseInput({
  cash: {
    holds: holds.slice().reverse(),
    strategyCapitalCommittedEur: 50
  }
}));
assert.equal(reorderedHolds.snapshot.snapshotId, reconciled.snapshot.snapshotId);
assert.deepEqual(reorderedHolds.cash.holds, reconciled.cash.holds);
assert.deepEqual(reorderedHolds.findings, reconciled.findings);

const changedHold = engine.compute(fixtures.baseInput({
  cash: {
    holds: [Object.assign({}, holds[0], { amountEur: 101 }), holds[1]],
    strategyCapitalCommittedEur: 50
  }
}));
assert.notEqual(changedHold.snapshot.snapshotId, reconciled.snapshot.snapshotId);

const reserveLedger = engine.compute(fixtures.baseInput({
  cash: {
    holds: [{ holdId: 'R1', holdType: 'user_reserve', amountEur: 100, includedInAvailableSettledCash: false, includedInStrategyCapitalCommitted: false }],
    userDefinedCashReserveEur: 100
  }
}));
approx(reserveLedger.cash.deductibleHoldsEur, 0);
approx(reserveLedger.cash.accountFreeSettledCashEur, 900);

const reserveMismatch = engine.compute(fixtures.baseInput({
  cash: {
    holds: [{ holdId: 'R1', holdType: 'user_reserve', amountEur: 50, includedInAvailableSettledCash: false, includedInStrategyCapitalCommitted: false }],
    userDefinedCashReserveEur: 100
  }
}));
assert.equal(reserveMismatch.ok, false);
assert.ok(reserveMismatch.findings.some((item) => item.condition === 'user_reserve_ledger_mismatch'));

const aligned = engine.compute(fixtures.baseInput());
const actualKeyMismatch = engine.compute(fixtures.baseInput({
  grossEdgeAlignment: fixtures.alignedGrossEdge({ key: { instrumentId: 'SYNTH:OTHER' } })
}));
assert.equal(actualKeyMismatch.alignment.state, 'edge_misaligned');
assert.ok(actualKeyMismatch.alignment.reasons.includes('instrument_scope'));
assert.equal(actualKeyMismatch.friction.complete, true);
assert.notEqual(actualKeyMismatch.summaryCode, 'no_incompatibility_detected_under_assumptions');

const reordered = fixtures.baseInput();
reordered.cost = {
  slippageTotalRate: reordered.cost.slippageTotalRate,
  spreadTotalRate: reordered.cost.spreadTotalRate,
  fxRatePerSide: reordered.cost.fxRatePerSide,
  commissionPerSideEur: reordered.cost.commissionPerSideEur,
  sideCount: reordered.cost.sideCount
};
const reorderedResult = engine.compute(reordered);
assert.equal(reorderedResult.snapshot.snapshotId, aligned.snapshot.snapshotId);

const reversedExclusions = engine.compute(fixtures.baseInput({
  grossEdgeAlignment: fixtures.alignedGrossEdge({
    key: { costExclusions: ['slippage', 'spread', 'fx', 'commission'] }
  })
}));
assert.equal(reversedExclusions.snapshot.snapshotId, aligned.snapshot.snapshotId);

const sourceA = {
  sourceId: 'SYNTH-A',
  provenance: 'synthetic_demo',
  instrumentId: 'SYNTH:ABC',
  venueId: 'SYNTH-X',
  quoteCurrency: 'EUR',
  observedAtUtc: '2026-07-14T10:00:00Z',
  validUntilUtc: '2026-07-14T11:00:00Z',
  critical: true
};
const sourceB = Object.assign({}, sourceA, { sourceId: 'SYNTH-B' });
const sourceOrderA = engine.compute(fixtures.baseInput({
  sources: [sourceA, sourceB],
  evaluatedAtUtc: '2026-07-14T10:30:00Z'
}));
const sourceOrderB = engine.compute(fixtures.baseInput({
  sources: [sourceB, sourceA],
  evaluatedAtUtc: '2026-07-14T10:30:00Z'
}));
assert.equal(sourceOrderA.snapshot.snapshotId, sourceOrderB.snapshot.snapshotId);
assert.deepEqual(sourceOrderA.snapshot.sourceBundleHash, sourceOrderB.snapshot.sourceBundleHash);
assert.deepEqual(sourceOrderA.findings, sourceOrderB.findings);

const constraintA = { constraintId: 'A', operator: 'lte', observedValue: 1, limitValue: 2, unit: 'EUR' };
const constraintB = { constraintId: 'B', operator: 'lte', observedValue: 2, limitValue: 3, unit: 'EUR' };
const constraintOrderA = engine.compute(fixtures.baseInput({ userConstraints: [constraintA, constraintB] }));
const constraintOrderB = engine.compute(fixtures.baseInput({ userConstraints: [constraintB, constraintA] }));
assert.equal(constraintOrderA.snapshot.snapshotId, constraintOrderB.snapshot.snapshotId);
assert.deepEqual(constraintOrderA.findings, constraintOrderB.findings);

const anonymousConstraintA = { operator: 'lte', observedValue: 1, limitValue: 2, unit: 'EUR' };
const anonymousConstraintB = { operator: 'lte', observedValue: 2, limitValue: 3, unit: 'EUR' };
const anonymousConstraintOrderA = engine.compute(fixtures.baseInput({ userConstraints: [anonymousConstraintA, anonymousConstraintB] }));
const anonymousConstraintOrderB = engine.compute(fixtures.baseInput({ userConstraints: [anonymousConstraintB, anonymousConstraintA] }));
assert.equal(anonymousConstraintOrderA.snapshot.snapshotId, anonymousConstraintOrderB.snapshot.snapshotId);
assert.deepEqual(anonymousConstraintOrderA.findings, anonymousConstraintOrderB.findings);

const findings = aligned.findings;
assert.equal(new Set(findings.map((item) => item.findingId)).size, findings.length);
assert.equal(findings.every((item) => item.snapshotId === aligned.snapshot.snapshotId), true);
engine.assertFiniteTree(reconciled);
engine.assertFiniteTree(actualKeyMismatch);
engine.assertFiniteTree(reorderedHolds);
engine.assertFiniteTree(sourceOrderA);

console.log('Cost Gate foundation property tests passed');
