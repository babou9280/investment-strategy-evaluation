'use strict';

const assert = require('assert');
const ledgerEngine = require('../ledger.js');
const surfaceEngine = require('../survival_surface.js');
const ledgerFixtures = require('./fixtures.js');
const fixtures = require('./surface_fixtures.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

function codes(result) {
  return result.issues.map((item) => item.code);
}

// CSS-01 and CSS-02 — full Cartesian product, never diagonal pairing only.
const request = fixtures.baseRequest();
const result = surfaceEngine.evaluate(request);
assert.equal(result.ok, true);
assert.equal(result.version, 'cost-survival-surface-engine-1-synthetic');
assert.equal(result.status, 'computed_synthetic_sensitivity');
assert.equal(result.cells.length, 27);
assert.equal(result.invariants.cartesianCellCount, true);
assert.equal(result.projectedLedgers.length, 3);
assert.equal(result.sourceScenarioContextHash, ledgerEngine.evaluate(request.sourceLedger).scenarioContextHash);
result.cells.forEach((cell) => {
  const receipt = result.projectedLedgers.find((item) => item.sizeEur === cell.sizeEur);
  assert.ok(receipt);
  assert.equal(cell.projectedLedgerHash, receipt.ledgerHash);
});
[250, 500, 1000].forEach((size) => {
  const pairs = new Set(result.cells.filter((cell) => cell.sizeEur === size).map((cell) => `${cell.costScenario}|${cell.edgeScenario}`));
  assert.equal(pairs.size, 9);
  assert.ok(pairs.has('high|low'));
  assert.ok(pairs.has('low|high'));
});

// CSS-03 to CSS-07 — independent numerical oracles and strict equality state.
const equality = fixtures.cell(result, 500, 'base', 'base');
approx(equality.costEur, 5.5);
approx(equality.grossEdgeEur, 5.5);
approx(equality.netMarginEur, 0);
approx(equality.netMarginRate, 0);
assert.equal(equality.state, 'at_threshold_no_positive_margin');

const equalityAtThousand = fixtures.cell(result, 1000, 'base', 'low');
approx(equalityAtThousand.costEur, 9);
approx(equalityAtThousand.grossEdgeEur, 9);
assert.equal(equalityAtThousand.state, 'at_threshold_no_positive_margin');

const below = fixtures.cell(result, 250, 'base', 'low');
approx(below.costEur, 3.75);
approx(below.grossEdgeEur, 2.25);
approx(below.netMarginEur, -1.5);
assert.equal(below.state, 'below_threshold');

const positive = fixtures.cell(result, 250, 'base', 'high');
approx(positive.costEur, 3.75);
approx(positive.grossEdgeEur, 5);
approx(positive.netMarginEur, 1.25);
assert.equal(positive.state, 'positive_margin_under_assumptions');

const ratios = fixtures.cell(result, 500, 'base', 'high');
approx(ratios.edgeAbsorptionRate, 0.55);
approx(ratios.edgeRetainedRate, 0.45);
assert.equal(ratios.ratioStatus, 'available');

// CSS-08 — no meaningless division when gross edge is non-positive.
const nonPositiveRequest = fixtures.baseRequest();
nonPositiveRequest.edgeProfile.constantRates = { low: -0.01, base: 0, high: 0.02 };
const nonPositive = surfaceEngine.evaluate(nonPositiveRequest);
assert.equal(nonPositive.ok, true);
['low', 'base'].forEach((edgeScenario) => {
  const cell = fixtures.cell(nonPositive, 500, 'base', edgeScenario);
  assert.equal(cell.edgeAbsorptionRate, null);
  assert.equal(cell.edgeRetainedRate, null);
  assert.equal(cell.ratioStatus, 'non_positive_gross_edge');
});

// CSS-09 and CSS-10 — exact source identity and source notional reconciliation.
const wrongHash = fixtures.baseRequest();
wrongHash.sourceLedgerHash = 'wrong-hash';
const wrongHashResult = surfaceEngine.evaluate(wrongHash);
assert.equal(wrongHashResult.ok, false);
assert.ok(codes(wrongHashResult).includes('source_ledger_hash_mismatch'));
assert.equal(wrongHashResult.cells.length, 0);

const wrongNotional = fixtures.baseRequest();
wrongNotional.projection.sourceNotionalEur = 501;
const wrongNotionalResult = surfaceEngine.evaluate(wrongNotional);
assert.equal(wrongNotionalResult.ok, false);
assert.ok(codes(wrongNotionalResult).includes('source_notional_mismatch'));

// CSS-11 — explicit axis is never sorted, deduplicated or clamped.
const unsorted = fixtures.baseRequest();
unsorted.projection.sizeAxisEur = [500, 250, 1000];
assert.ok(codes(surfaceEngine.evaluate(unsorted)).includes('size_axis_must_be_strictly_increasing'));
const outside = fixtures.baseRequest();
outside.projection.sizeAxisEur = [100, 500, 1000];
assert.ok(codes(surfaceEngine.evaluate(outside)).includes('size_outside_declared_domain'));

// CSS-12 and CSS-13 — every basis and geometry must be projectable.
const missingRule = fixtures.baseRequest();
delete missingRule.projection.basisRules.exit_notional;
assert.ok(codes(surfaceEngine.evaluate(missingRule)).includes('missing_basis_projection_rule'));

const reservedGeometry = fixtures.baseRequest();
ledgerFixtures.componentByEvent(reservedGeometry.sourceLedger, 'legacy.execution_cost.full_cycle').calculationKind = 'tiered';
fixtures.refreshHash(reservedGeometry);
const reservedGeometryResult = surfaceEngine.evaluate(reservedGeometry);
assert.equal(reservedGeometryResult.ok, false);
assert.ok(codes(reservedGeometryResult).includes('component_geometry_not_projectable'));

// CSS-14 to CSS-16 — projection limitations and legacy exit ratio remain explicit.
[
  'cost_parameters_assumed_constant_over_domain',
  'scaling_domain_synthetic_only',
  'notional_only_not_executable',
  'edge_capacity_not_modelled'
].forEach((limitation) => assert.ok(result.limitations.includes(limitation)));
const projectedThousand = surfaceEngine.projectLedger(request.sourceLedger, {
  sourceNotionalEur: 500,
  basisRules: request.projection.basisRules
}, 1000);
approx(projectedThousand.basisValues.exit_notional.amount, 1000);

// CSS-17 and CSS-18 — explicit size profiles are exact and never interpolated.
const explicitRequest = fixtures.baseRequest();
explicitRequest.edgeProfile.mode = 'explicit_by_size';
explicitRequest.edgeProfile.constantRates = null;
explicitRequest.edgeProfile.bySize = [
  { sizeEur: 250, rates: { low: 0.005, base: 0.006, high: 0.007 } },
  { sizeEur: 500, rates: { low: 0.009, base: 0.011, high: 0.02 } },
  { sizeEur: 1000, rates: { low: 0.008, base: 0.009, high: 0.01 } }
];
const explicit = surfaceEngine.evaluate(explicitRequest);
assert.equal(explicit.ok, true);
assert.equal(explicit.boundaries.method, 'discrete_profile_no_interpolation');
assert.equal(explicit.boundaries.exact.length, 0);
approx(fixtures.cell(explicit, 1000, 'base', 'base').grossEdgeRate, 0.009);
const incompleteExplicit = fixtures.deepClone(explicitRequest);
incompleteExplicit.edgeProfile.bySize.pop();
assert.ok(codes(surfaceEngine.evaluate(incompleteExplicit)).includes('edge_profile_size_count_mismatch'));

// CSS-19 and CSS-20 — ordered, aligned edge is mandatory.
const unorderedEdge = fixtures.baseRequest();
unorderedEdge.edgeProfile.constantRates = { low: 0.02, base: 0.011, high: 0.009 };
assert.ok(codes(surfaceEngine.evaluate(unorderedEdge)).includes('invalid_edge_range_order'));
const misaligned = fixtures.baseRequest();
misaligned.edgeProfile.alignmentContext.grossEdgeAlignment.fieldStatuses.instrument_scope = 'mismatched';
fixtures.refreshAlignmentHash(misaligned);
assert.ok(codes(surfaceEngine.evaluate(misaligned)).includes('edge_alignment_required'));

const mismatchedContext = fixtures.baseRequest();
mismatchedContext.edgeProfile.alignmentContext.instrumentId = 'SYNTH:OTHER';
fixtures.refreshAlignmentHash(mismatchedContext);
assert.ok(codes(surfaceEngine.evaluate(mismatchedContext)).includes('edge_ledger_scenario_context_mismatch'));

// CSS-21 and CSS-22 — exact boundaries only under declared linear projection.
const highBoundary = fixtures.boundary(result, 'base', 'high');
approx(highBoundary.boundaryNotionalEur, 2 / (0.02 - 0.007));
assert.equal(highBoundary.status, 'positive_strictly_above_boundary');
assert.equal(highBoundary.domainRelation, 'below_declared_domain');
const centralBoundary = fixtures.boundary(result, 'base', 'base');
approx(centralBoundary.boundaryNotionalEur, 500);
assert.equal(centralBoundary.domainRelation, 'within_declared_domain');

// CSS-23 — no positive margin when edge cannot outrun variable costs.
const unreachableRequest = fixtures.baseRequest();
unreachableRequest.edgeProfile.constantRates = { low: 0.005, base: 0.006, high: 0.0065 };
const unreachable = surfaceEngine.evaluate(unreachableRequest);
assert.equal(fixtures.boundary(unreachable, 'base', 'base').status, 'positive_margin_structurally_unreachable');

// CSS-24 — zero fixed cost and G = V means equality at every positive size.
const allEqualityRequest = fixtures.baseRequest();
allEqualityRequest.sourceLedger.components
  .filter((component) => component.calculationKind === 'fixed')
  .forEach((component) => {
    component.parameters.amount = 0;
    component.uncertainty.low = 0;
    component.uncertainty.base = 0;
    component.uncertainty.high = 0;
  });
allEqualityRequest.edgeProfile.constantRates = { low: 0.007, base: 0.007, high: 0.007 };
fixtures.refreshHash(allEqualityRequest);
const allEquality = surfaceEngine.evaluate(allEqualityRequest);
assert.equal(fixtures.boundary(allEquality, 'base', 'base').status, 'at_threshold_for_all_positive_sizes');
allEquality.cells.filter((cell) => cell.costScenario === 'base' && cell.edgeScenario === 'base')
  .forEach((cell) => assert.equal(cell.state, 'at_threshold_no_positive_margin'));

// CSS-25 — only adjacent brackets for a non-constant profile.
assert.ok(explicit.boundaries.transitionBrackets.length > 0);
explicit.boundaries.transitionBrackets.forEach((bracket) => assert.equal(bracket.interpolation, 'none'));

// CSS-26 and CSS-27 — partial or unreconciled costs never produce a surface.
const partial = fixtures.baseRequest();
partial.sourceLedger.components = partial.sourceLedger.components.filter((component) =>
  component.economicEventId !== 'legacy.spread.full_cycle'
);
fixtures.refreshHash(partial);
assert.ok(codes(surfaceEngine.evaluate(partial)).includes('complete_cost_coverage_required'));

const included = fixtures.baseRequest();
ledgerFixtures.componentByEvent(included.sourceLedger, 'legacy.spread.full_cycle').edgeInclusion = 'included';
fixtures.refreshHash(included);
assert.ok(codes(surfaceEngine.evaluate(included)).includes('source_ledger_edge_reconciliation_required'));

// CSS-28 and CSS-29 — no optimizer language and all material omissions stay visible.
const serialized = JSON.stringify(result).toLowerCase();
['optimal', 'recommended', 'approved', 'best_size'].forEach((token) => assert.equal(serialized.includes(token), false));
[
  'quantity_lot_tick_and_minimum_order',
  'liquidity_market_impact_and_fill',
  'capital_timeline_settlement_and_frequency',
  'edge_capacity_and_decay',
  'external_data_quality'
].forEach((layer) => assert.ok(result.unassessedLayers.includes(layer)));

// CSS-30 — source component order is immaterial and economic mutation changes identity.
const reordered = fixtures.baseRequest();
reordered.sourceLedger.components.reverse();
const reorderedResult = surfaceEngine.evaluate(reordered);
assert.equal(reorderedResult.ok, true);
assert.equal(reorderedResult.requestHash, result.requestHash);
assert.deepEqual(reorderedResult.cells, result.cells);

const mutated = fixtures.baseRequest();
const commission = ledgerFixtures.componentByEvent(mutated.sourceLedger, 'legacy.commission.entry');
commission.parameters.amount = 1.1;
commission.uncertainty.low = 1.1;
commission.uncertainty.base = 1.1;
commission.uncertainty.high = 1.1;
const oldHash = mutated.sourceLedgerHash;
fixtures.refreshHash(mutated);
assert.notEqual(mutated.sourceLedgerHash, oldHash);
assert.notEqual(surfaceEngine.evaluate(mutated).requestHash, result.requestHash);
ledgerEngine.assertFiniteTree(result);

console.log('Cost Survival Surface v1 contract tests: PASS (CSS-01 to CSS-32)');
