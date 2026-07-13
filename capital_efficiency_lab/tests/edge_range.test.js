'use strict';
const assert = require('assert');
const engine = require('../engine.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

const base = {
  capitalEur: 5000,
  orderNotionalEur: 500,
  sideCount: 2,
  monthlyOperations: 4,
  commissionPerSideEur: 1,
  fxRatePerSide: 0.0025,
  spreadTotalRate: 0.001,
  slippageTotalRate: 0.001,
  grossEdgeRate: null,
  retentionTargetRate: null,
  annualDragBudgetRate: null,
  targetNetRate: null,
  provenance: 'synthetic_demo'
};

assert.equal(engine.VERSION, 'capital-efficiency-lab-4-optional-annual');

const threshold = engine.compute(base);
assert.equal(threshold.ok, true);
assert.equal(threshold.edgeMode, 'threshold_only');
assert.equal(threshold.results.primaryState, 'threshold_only');
assert.equal(threshold.results.edgeRange.status, 'unavailable');
engine.assertFiniteTree(threshold);

const point = engine.compute({ ...base, grossEdgeRate: 0.02 });
assert.equal(point.ok, true);
assert.equal(point.edgeMode, 'point_estimate');
approx(point.results.netEdgeRate.value, 0.009);
assert.equal(point.results.edgeRange.reason, 'point_mode_selected');

const crossed = engine.compute({
  ...base,
  grossEdgeLowRate: 0.008,
  grossEdgeBaseRate: 0.02,
  grossEdgeHighRate: 0.03
});
assert.equal(crossed.ok, true);
assert.equal(crossed.edgeMode, 'range_estimate');
assert.equal(crossed.results.primaryState, 'crosses_break_even');
assert.equal(crossed.results.edgeRange.status, 'available');
assert.equal(crossed.results.edgeRange.rangeShape, 'ordered');
assert.equal(crossed.results.edgeRange.rangeState, 'crosses_break_even');
assert.equal(crossed.results.edgeRange.variableFloorState, 'above_variable_floor_full_range');
approx(crossed.results.edgeRange.low.netEdgeRate.value, -0.003);
approx(crossed.results.edgeRange.base.netEdgeRate.value, 0.009);
approx(crossed.results.edgeRange.high.netEdgeRate.value, 0.019);
approx(crossed.results.edgeRange.low.netEdgeEur.value, -1.5);
approx(crossed.results.edgeRange.base.netEdgeEur.value, 4.5);
approx(crossed.results.edgeRange.high.netEdgeEur.value, 9.5);
approx(crossed.results.edgeRange.low.minimumOrderForPositiveNet.value, 2000);
approx(crossed.results.edgeRange.base.minimumOrderForPositiveNet.value, 153.84615384615384);
approx(crossed.results.edgeRange.high.minimumOrderForPositiveNet.value, 86.95652173913044);
assert.equal(crossed.results.edgeRange.provenance, 'synthetic_demo');
Object.values(crossed.invariants).filter(value => value !== null).forEach(value => assert.equal(value, true));
engine.assertFiniteTree(crossed);

const survives = engine.compute({
  ...base,
  grossEdgeLowRate: 0.012,
  grossEdgeBaseRate: 0.02,
  grossEdgeHighRate: 0.03
});
assert.equal(survives.results.edgeRange.rangeState, 'survives_full_range');

const failsAtThreshold = engine.compute({
  ...base,
  grossEdgeLowRate: 0.005,
  grossEdgeBaseRate: 0.01,
  grossEdgeHighRate: 0.011
});
assert.equal(failsAtThreshold.results.edgeRange.rangeState, 'fails_full_range');
approx(failsAtThreshold.results.edgeRange.high.netEdgeRate.value, 0);

const degenerate = engine.compute({
  ...base,
  grossEdgeLowRate: 0.012,
  grossEdgeBaseRate: 0.012,
  grossEdgeHighRate: 0.012
});
assert.equal(degenerate.ok, true);
assert.equal(degenerate.results.edgeRange.rangeShape, 'degenerate');
assert.equal(degenerate.results.edgeRange.rangeState, 'survives_full_range');

const degenerateAtThreshold = engine.compute({
  ...base,
  grossEdgeLowRate: 0.011,
  grossEdgeBaseRate: 0.011,
  grossEdgeHighRate: 0.011
});
assert.equal(degenerateAtThreshold.results.edgeRange.rangeShape, 'degenerate');
assert.equal(degenerateAtThreshold.results.edgeRange.rangeState, 'fails_full_range');

const underFloor = engine.compute({
  ...base,
  grossEdgeLowRate: -0.01,
  grossEdgeBaseRate: 0,
  grossEdgeHighRate: 0.007
});
assert.equal(underFloor.results.edgeRange.rangeState, 'fails_full_range');
assert.equal(underFloor.results.edgeRange.variableFloorState, 'structurally_unreachable_full_range');
assert.equal(underFloor.results.edgeRange.low.edgeRetainedRate.reason, 'gross_edge_non_positive');
assert.equal(underFloor.results.edgeRange.base.edgeAbsorptionRate.reason, 'gross_edge_non_positive');
assert.equal(underFloor.results.edgeRange.high.minimumOrderForPositiveNet.reason, 'structurally_unreachable');

const floorCrossing = engine.compute({
  ...base,
  grossEdgeLowRate: 0.006,
  grossEdgeBaseRate: 0.007,
  grossEdgeHighRate: 0.008
});
assert.equal(floorCrossing.results.edgeRange.variableFloorState, 'variable_floor_crossing');
assert.equal(floorCrossing.results.edgeRange.low.minimumOrderForPositiveNet.reason, 'structurally_unreachable');
assert.equal(floorCrossing.results.edgeRange.base.minimumOrderForPositiveNet.reason, 'structurally_unreachable');
assert.equal(floorCrossing.results.edgeRange.high.minimumOrderForPositiveNet.status, 'available');

const zeroFixed = engine.compute({
  ...base,
  commissionPerSideEur: 0,
  grossEdgeLowRate: 0.008,
  grossEdgeBaseRate: 0.014,
  grossEdgeHighRate: 0.02
});
for (const key of ['low', 'base', 'high']) {
  assert.equal(zeroFixed.results.edgeRange[key].minimumOrderForPositiveNet.status, 'available');
  approx(zeroFixed.results.edgeRange[key].minimumOrderForPositiveNet.value, 0);
  assert.equal(zeroFixed.results.edgeRange[key].minimumOrderForPositiveNet.boundary, 'no_positive_minimum_from_fixed_costs');
}
engine.assertFiniteTree(zeroFixed);

const partial = engine.compute({ ...base, grossEdgeLowRate: 0.01 });
assert.equal(partial.ok, false);
assert.equal(partial.errors.grossEdgeBaseRate, 'range_incomplete');
assert.equal(partial.errors.grossEdgeHighRate, 'range_incomplete');

const conflict = engine.compute({
  ...base,
  grossEdgeRate: 0.02,
  grossEdgeLowRate: 0.01,
  grossEdgeBaseRate: 0.02,
  grossEdgeHighRate: 0.03
});
assert.equal(conflict.ok, false);
assert.equal(conflict.errors.grossEdgeRate, 'edge_mode_conflict');
assert.equal(conflict.errors.grossEdgeLowRate, 'edge_mode_conflict');

const invalidOrderLow = engine.compute({
  ...base,
  grossEdgeLowRate: 0.021,
  grossEdgeBaseRate: 0.02,
  grossEdgeHighRate: 0.03
});
assert.equal(invalidOrderLow.ok, false);
assert.equal(invalidOrderLow.errors.grossEdgeLowRate, 'range_order_invalid');

const invalidOrderHigh = engine.compute({
  ...base,
  grossEdgeLowRate: 0.01,
  grossEdgeBaseRate: 0.03,
  grossEdgeHighRate: 0.02
});
assert.equal(invalidOrderHigh.ok, false);
assert.equal(invalidOrderHigh.errors.grossEdgeHighRate, 'range_order_invalid');

for (const bad of [NaN, Infinity, -Infinity, '0.01']) {
  const result = engine.compute({
    ...base,
    grossEdgeLowRate: 0.01,
    grossEdgeBaseRate: bad,
    grossEdgeHighRate: 0.03
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.grossEdgeBaseRate);
}

const toleranceCross = engine.compute({
  ...base,
  grossEdgeLowRate: 0.011 + 5e-13,
  grossEdgeBaseRate: 0.012,
  grossEdgeHighRate: 0.013
});
assert.equal(toleranceCross.results.edgeRange.rangeState, 'crosses_break_even');

const toleranceFail = engine.compute({
  ...base,
  grossEdgeLowRate: 0.005,
  grossEdgeBaseRate: 0.01,
  grossEdgeHighRate: 0.011 + 5e-13
});
assert.equal(toleranceFail.results.edgeRange.rangeState, 'fails_full_range');

const negativeZero = engine.compute({
  ...base,
  grossEdgeLowRate: -0,
  grossEdgeBaseRate: 0,
  grossEdgeHighRate: 0
});
assert.equal(negativeZero.ok, true);
engine.assertFiniteTree(negativeZero);
assert.equal(Object.is(negativeZero.inputs.GLow, -0), false);

console.log('Edge Survival Envelope tests passed');
