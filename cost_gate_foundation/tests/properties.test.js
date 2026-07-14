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

const findings = aligned.findings;
assert.equal(new Set(findings.map((item) => item.findingId)).size, findings.length);
assert.equal(findings.every((item) => item.snapshotId === aligned.snapshot.snapshotId), true);
engine.assertFiniteTree(reconciled);
engine.assertFiniteTree(actualKeyMismatch);

console.log('Cost Gate foundation property tests passed');
