'use strict';

const ledgerEngine = require('../ledger.js');
const ledgerFixtures = require('./fixtures.js');

function deepClone(value) {
  return ledgerFixtures.deepClone(value);
}

function baseSourceLedger() {
  const adapted = ledgerEngine.adaptLegacy(ledgerFixtures.baseLegacy({ cash: null }));
  if (!adapted.ok) throw new Error(`surface_fixture_adaptation_failed:${JSON.stringify(adapted.errors)}`);
  const ledger = adapted.ledger;
  const execution = ledgerFixtures.componentByEvent(ledger, 'legacy.execution_cost.full_cycle');
  execution.uncertainty = {
    kind: 'sensitivity_range',
    appliesTo: 'parameters.rate',
    low: 0.0005,
    base: 0.001,
    high: 0.002,
    unit: 'decimal_rate',
    method: 'synthetic_surface_fixture',
    coverage: 'not_applicable',
    calibrated: false,
    limitations: ['not_probabilistic', 'not_joint_distribution']
  };
  return ledger;
}

function baseRequest() {
  const sourceLedger = baseSourceLedger();
  const sourceLedgerHash = ledgerEngine.evaluate(sourceLedger).ledgerHash;
  return {
    schemaVersion: 'cost-survival-surface-1',
    surfaceId: 'synthetic-cost-survival-surface',
    sourceLedgerHash,
    sourceLedger,
    projection: {
      policyId: 'linear-ledger-sensitivity-1',
      sourceNotionalEur: 500,
      sizeAxisEur: [250, 500, 1000],
      domain: {
        minNotionalEur: 250,
        maxNotionalEur: 1000,
        currency: 'EUR',
        status: 'synthetic_sensitivity_only'
      },
      basisRules: {
        entry_notional: 'axis_value',
        exit_notional: 'preserve_source_ratio'
      },
      parameterStability: 'assumed_constant_over_declared_domain',
      quantityTreatment: 'notional_only_not_executable',
      limitations: ['legacy_linear_sensitivity_only']
    },
    edgeProfile: {
      mode: 'constant_across_size',
      provenance: 'synthetic_demo',
      alignmentStatus: 'edge_aligned',
      alignmentKeyHash: 'synthetic-alignment-key-v1',
      constantRates: { low: 0.009, base: 0.011, high: 0.02 },
      bySize: [],
      limitations: ['not_probabilistic', 'capacity_not_evidenced']
    }
  };
}

function refreshHash(request) {
  request.sourceLedgerHash = ledgerEngine.evaluate(request.sourceLedger).ledgerHash;
  return request;
}

function cell(result, sizeEur, costScenario, edgeScenario) {
  const found = result.cells.find((candidate) =>
    candidate.sizeEur === sizeEur &&
    candidate.costScenario === costScenario &&
    candidate.edgeScenario === edgeScenario
  );
  if (!found) throw new Error(`surface_fixture_cell_missing:${sizeEur}:${costScenario}:${edgeScenario}`);
  return found;
}

function boundary(result, costScenario, edgeScenario) {
  const found = result.boundaries.exact.find((candidate) =>
    candidate.costScenario === costScenario && candidate.edgeScenario === edgeScenario
  );
  if (!found) throw new Error(`surface_fixture_boundary_missing:${costScenario}:${edgeScenario}`);
  return found;
}

module.exports = {
  deepClone,
  baseSourceLedger,
  baseRequest,
  refreshHash,
  cell,
  boundary
};
