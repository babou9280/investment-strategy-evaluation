'use strict';

const assert = require('assert');
const engine = require('../engine.js');
const fixtures = require('./fixtures.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

function byCode(result, code) {
  const item = result.findings.find((candidate) => candidate.findingCode === code);
  assert.ok(item, `Missing finding ${code}`);
  return item;
}

function noNonFinite(result) {
  assert.equal(engine.assertFiniteTree(result), true);
  const serialized = JSON.stringify(result);
  assert.equal(/NaN|Infinity/.test(serialized), false);
}

const FIXED = 2;
const FLOOR = 0.007;
const LIFECYCLE = 5.5;
const THRESHOLD = 0.011;
const ENTRY_CASH = 502.25;

const scenarios = [
  {
    id: 'CG-01',
    run() {
      const result = engine.compute(fixtures.baseInput({
        grossEdgeRate: null,
        grossEdgeAlignment: null,
        cash: null
      }));
      approx(result.friction.breakEvenGrossRate, THRESHOLD);
      assert.equal(byCode(result, 'gross_edge_not_provided').status, 'not_assessed');
      assert.equal(byCode(result, 'capital_not_provided').status, 'not_assessed');
      assert.notEqual(result.summaryCode, 'no_incompatibility_detected_under_assumptions');
      return result;
    }
  },
  {
    id: 'CG-02',
    run() {
      const result = engine.compute(fixtures.baseInput());
      approx(result.friction.edgeResults.netEdgeRate.value, 0.009);
      approx(result.friction.edgeResults.edgeRetainedRate.value, 0.45);
      approx(result.cash.entryCashRequirementEur, ENTRY_CASH);
      assert.equal(result.summaryCode, 'no_incompatibility_detected_under_assumptions');
      assert.equal(byCode(result, 'external_market_data_not_assessed').status, 'not_assessed');
      return result;
    }
  },
  {
    id: 'CG-03',
    run() {
      const result = engine.compute(fixtures.baseInput({ grossEdgeRate: THRESHOLD }));
      const item = byCode(result, 'no_strictly_positive_margin');
      approx(item.observedValue, 0);
      assert.equal(item.status, 'breached');
      assert.equal(result.summaryCode, 'edge_not_surviving_modelled_friction');
      return result;
    }
  },
  {
    id: 'CG-04',
    run() {
      const result = engine.compute(fixtures.baseInput({ grossEdgeRate: 0.006 }));
      assert.equal(byCode(result, 'gross_edge_not_above_variable_floor').status, 'structurally_unreachable');
      assert.equal(result.friction.edgeResults.minimumOrderForPositiveNet.reason, 'structurally_unreachable');
      return result;
    }
  },
  {
    id: 'CG-05',
    run() {
      const result = engine.compute(fixtures.baseInput({
        cash: { availableSettledCashEur: 400, strategyCapitalEur: 400 }
      }));
      assert.equal(byCode(result, 'gross_edge_survives_modelled_friction').status, 'satisfied');
      assert.equal(byCode(result, 'entry_cash_requirement_exceeds_capital_feasibility_cash').status, 'breached');
      assert.equal(result.summaryCode, 'capital_not_feasible');
      return result;
    }
  },
  {
    id: 'CG-06',
    run() {
      const result = engine.compute(fixtures.baseInput());
      approx(result.friction.fixedCostEur, FIXED);
      approx(result.friction.variableFloorRate, FLOOR);
      approx(result.friction.lifecycleFrictionEur, LIFECYCLE);
      approx(result.cash.entryCashRequirementEur, ENTRY_CASH);
      assert.notEqual(result.cash.entryCashRequirementEur, 505);
      assert.notEqual(result.cash.entryCashRequirementEur, 505.5);
      return result;
    }
  },
  {
    id: 'CG-07',
    run() {
      const result = engine.compute(fixtures.baseInput({
        cash: {
          notionalBasis: 'reference_ask_price',
          spreadReferencePriceStatus: 'included',
          entrySpreadCashEur: 0
        }
      }));
      approx(result.cash.entryCashRequirementEur, ENTRY_CASH);
      assert.equal(result.cash.status, 'feasible_within_declared_strategy_cash');
      return result;
    }
  },
  {
    id: 'CG-08',
    run() {
      const result = engine.compute(fixtures.baseInput({
        cash: { notionalBasis: 'reference_ask_price', spreadReferencePriceStatus: 'unknown' }
      }));
      assert.equal(byCode(result, 'cash_basis_conflicted').status, 'conflicted');
      assert.equal(result.cash.reason, 'price_inclusion_unknown');
      assert.equal(result.friction.complete, true);
      return result;
    }
  },
  {
    id: 'CG-09',
    run() {
      const result = engine.compute(fixtures.baseInput({
        sources: [{
          sourceId: 'SYNTH-STALE-QUOTE',
          provenance: 'synthetic_demo',
          instrumentId: 'SYNTH:ABC',
          venueId: 'SYNTH-X',
          quoteCurrency: 'USD',
          observedAtUtc: '2026-07-14T10:00:00Z',
          validUntilUtc: '2026-07-14T10:01:00Z',
          critical: true
        }],
        evaluatedAtUtc: '2026-07-14T10:02:00Z'
      }));
      assert.equal(result.snapshot.status, 'snapshot_expired');
      assert.equal(byCode(result, 'synthetic_source_stale').status, 'expired');
      assert.equal(result.summaryCode, 'snapshot_unusable');
      return result;
    }
  },
  {
    id: 'CG-10',
    run() {
      const result = engine.compute(fixtures.baseInput({
        sources: [{
          sourceId: 'SYNTH-CONFLICT',
          provenance: 'synthetic_demo',
          instrumentId: 'SYNTH:OTHER',
          venueId: 'OTHER-X',
          quoteCurrency: 'GBP',
          observedAtUtc: '2026-07-14T10:00:00Z',
          validUntilUtc: '2026-07-14T11:00:00Z',
          critical: true
        }],
        evaluatedAtUtc: '2026-07-14T10:30:00Z'
      }));
      assert.equal(result.snapshot.status, 'snapshot_conflicted');
      assert.equal(byCode(result, 'instrument_venue_currency_mismatch').status, 'conflicted');
      assert.equal(result.summaryCode, 'snapshot_unusable');
      return result;
    }
  },
  {
    id: 'CG-11',
    run() {
      const result = engine.compute(fixtures.baseInput({
        grossEdgeAlignment: fixtures.alignedGrossEdge({
          fieldStatuses: fixtures.alignedFieldStatuses({ holding_horizon_definition: 'mismatched' })
        })
      }));
      assert.equal(result.alignment.state, 'edge_misaligned');
      assert.equal(byCode(result, 'gross_edge_basis_mismatch').status, 'invalid');
      approx(result.friction.breakEvenGrossRate, THRESHOLD);
      return result;
    }
  },
  {
    id: 'CG-12',
    run() {
      const result = engine.compute(fixtures.baseInput({
        grossEdgeRate: 0.006,
        cash: { availableSettledCashEur: 400, strategyCapitalEur: 400 },
        sources: [{
          sourceId: 'SYNTH-NONCRITICAL-DEPTH',
          provenance: 'synthetic_demo',
          instrumentId: 'SYNTH:ABC',
          venueId: 'SYNTH-X',
          quoteCurrency: 'USD',
          observedAtUtc: '2026-07-14T10:00:00Z',
          validUntilUtc: '2026-07-14T10:01:00Z',
          critical: false
        }],
        evaluatedAtUtc: '2026-07-14T10:02:00Z'
      }));
      assert.equal(byCode(result, 'synthetic_source_stale').status, 'expired');
      assert.equal(byCode(result, 'entry_cash_requirement_exceeds_capital_feasibility_cash').status, 'breached');
      assert.equal(byCode(result, 'gross_edge_not_above_variable_floor').status, 'structurally_unreachable');
      assert.equal(result.summaryCode, 'structurally_non_viable');
      return result;
    }
  },
  {
    id: 'CG-13',
    run() {
      const original = engine.compute(fixtures.baseInput());
      const changed = engine.compute(fixtures.baseInput({
        orderNotionalEur: 600,
        orderQuantity: 6,
        cash: { entryAssetConsiderationEur: 600 }
      }));
      const comparison = engine.compareSnapshots(original, changed);
      assert.equal(comparison.oldSnapshot, 'obsolete');
      assert.equal(comparison.oldFindingsActive, false);
      return changed;
    }
  },
  {
    id: 'CG-14',
    run() {
      const grossSource = engine.compute(fixtures.baseInput({
        cash: {
          holds: [{ holdId: 'H1', holdType: 'pending_order', amountEur: 600, includedInAvailableSettledCash: false, includedInStrategyCapitalCommitted: false }],
          userDefinedCashReserveEur: 100
        }
      }));
      approx(grossSource.cash.accountFreeSettledCashEur, 300);

      const netSource = engine.compute(fixtures.baseInput({
        cash: {
          availableSettledCashEur: 400,
          availableSettledCashBasis: 'net_of_listed_holds',
          sourceIncludedHoldIds: ['H1'],
          holds: [{ holdId: 'H1', holdType: 'pending_order', amountEur: 600, includedInAvailableSettledCash: true, includedInStrategyCapitalCommitted: false }],
          userDefinedCashReserveEur: 100
        }
      }));
      approx(netSource.cash.accountFreeSettledCashEur, 300);

      const strategy = engine.compute(fixtures.baseInput({
        cash: { strategyCapitalEur: 450, strategyCapitalCommittedEur: 100 }
      }));
      approx(strategy.cash.capitalFeasibilityCashEur, 350);
      assert.equal(strategy.summaryCode, 'capital_not_feasible');
      return strategy;
    }
  },
  {
    id: 'CG-15',
    run() {
      const result = engine.compute(fixtures.baseInput({
        accountModel: 'margin_account',
        positionModel: 'short_sale',
        instrumentType: 'option',
        side: 'short'
      }));
      assert.equal(byCode(result, 'unsupported_scope').status, 'unsupported');
      assert.equal(result.summaryCode, 'unsupported_scope');
      return result;
    }
  },
  {
    id: 'CG-16',
    run() {
      const result = engine.compute(fixtures.baseInput({
        userConstraints: [{
          constraintId: 'annual_friction_limit',
          operator: 'lte',
          observedValue: 0.03,
          limitValue: 0.03,
          unit: 'decimal_rate'
        }]
      }));
      assert.equal(byCode(result, 'annual_friction_limit').status, 'satisfied');
      return result;
    }
  },
  {
    id: 'CG-17',
    run() {
      const result = engine.compute(fixtures.baseInput({ cost: { spreadTotalRate: null } }));
      assert.equal(result.friction.complete, false);
      approx(result.friction.knownCostEur, 5);
      assert.equal(byCode(result, 'friction_components_missing').status, 'insufficient_data');
      assert.equal(byCode(result, 'complete_friction_required_for_edge').status, 'insufficient_data');
      return result;
    }
  },
  {
    id: 'CG-18',
    run() {
      const result = engine.compute(fixtures.baseInput());
      assert.equal(result.summaryCode, 'no_incompatibility_detected_under_assumptions');
      assert.equal(byCode(result, 'execution_liquidity_not_assessed').status, 'not_assessed');
      assert.equal(byCode(result, 'external_market_data_not_assessed').status, 'not_assessed');
      return result;
    }
  }
];

assert.equal(scenarios.length, 18);
assert.equal(new Set(scenarios.map((scenario) => scenario.id)).size, 18);

for (const scenario of scenarios) {
  const result = scenario.run();
  noNonFinite(result);
  assert.equal(result.findings.every((item) => item.snapshotId === result.snapshot.snapshotId), true, scenario.id);
  assert.equal(result.limitations.includes('no_recommendation'), true, scenario.id);
}

console.log('Cost Gate foundation scenario matrix passed: CG-01 to CG-18');
