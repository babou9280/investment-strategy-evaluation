'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const engine = require('../ledger.js');
const fixtures = require('./fixtures.js');

function codes(result) {
  return result.issues.map((item) => item.code);
}

const matrixPath = path.join(__dirname, '../../docs/scenarios/COST_LEDGER_V1_MATRIX.md');
const matrix = fs.readFileSync(matrixPath, 'utf8');
for (let index = 1; index <= 38; index += 1) {
  const code = `CL-${String(index).padStart(2, '0')}`;
  assert.ok(matrix.includes(`### ${code} —`), `Missing frozen scenario ${code}`);
}
assert.equal((matrix.match(/^### CL-\d{2} —/gm) || []).length, 38);

const adapted = engine.adaptLegacy(fixtures.baseLegacy());
assert.equal(adapted.ok, true);

// CL-11 is a declared automation limit, not a fake heuristic.
const base = engine.evaluate(adapted.ledger);
assert.ok(base.limitations.includes('economic_event_identity_source_dependent'));
assert.ok(matrix.includes('le moteur ne prétend pas résoudre ce cas par heuristique'));

// CL-18 exact benchmark rule.
const noSemanticBenchmark = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(noSemanticBenchmark, 'legacy.spread.full_cycle').benchmark.kind = 'not_applicable';
const noSemanticBenchmarkResult = engine.evaluate(noSemanticBenchmark);
assert.ok(codes(noSemanticBenchmarkResult).includes('benchmark_required'));
assert.equal(noSemanticBenchmarkResult.totalCostEur, null);

// CL-21 edge inclusion blocks only the dependent layer.
const includedInEdge = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(includedInEdge, 'legacy.spread.full_cycle').edgeInclusion = 'included';
const includedInEdgeResult = engine.evaluate(includedInEdge);
assert.equal(includedInEdgeResult.totalCostEur.base, 5.5);
assert.equal(includedInEdgeResult.downstreamEligibility.edgeSurvival, 'requires_edge_reconciliation');

// CL-24 reserved calculation form cannot fall back to a supported geometry.
const nonlinear = fixtures.deepClone(adapted.ledger);
const nonlinearComponent = fixtures.componentByEvent(nonlinear, 'legacy.execution_cost.full_cycle');
nonlinearComponent.calculationKind = 'nonlinear_model';
const nonlinearResult = engine.evaluate(nonlinear);
assert.ok(codes(nonlinearResult).includes('reserved_calculation_kind_not_assessed'));
assert.equal(nonlinearResult.coverage.status, 'partial_under_declared_policy');
assert.equal(nonlinearResult.totalCostEur, null);

// Strict schema: unknown keys are not silently ignored.
const unknownKey = fixtures.deepClone(adapted.ledger);
unknownKey.components[0].silentFallback = 42;
const unknownKeyResult = engine.evaluate(unknownKey);
assert.ok(codes(unknownKeyResult).includes('unknown_key'));
assert.equal(unknownKeyResult.ok, false);

// Coverage identity itself is part of the hash.
const changedPolicy = fixtures.deepClone(adapted.ledger);
changedPolicy.coverage.policyId = 'different-policy';
assert.notEqual(engine.evaluate(changedPolicy).ledgerHash, base.ledgerHash);

// CL-31: direct malformed numeric input fails closed without leaking non-finite output.
const directNaN = fixtures.deepClone(adapted.ledger);
fixtures.componentByEvent(directNaN, 'legacy.commission.entry').parameters.amount = NaN;
const directNaNResult = engine.evaluate(directNaN);
assert.equal(directNaNResult.ok, false);
assert.equal(directNaNResult.ledgerHash, null);
assert.ok(codes(directNaNResult).includes('ledger_hash_failed'));
engine.assertFiniteTree(directNaNResult);

console.log('Cost Ledger v1 frozen scenario matrix: PASS (CL-01 to CL-38 registered)');
