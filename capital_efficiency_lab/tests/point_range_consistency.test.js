'use strict';

const assert = require('assert');
const engine = require('../engine.js');

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
  grossEdgeLowRate: null,
  grossEdgeBaseRate: null,
  grossEdgeHighRate: null,
  retentionTargetRate: null,
  annualDragBudgetRate: null,
  targetNetRate: null,
  provenance: 'synthetic_demo'
};

const reference = engine.compute(base);
assert.equal(reference.ok, true);
const threshold = reference.results.breakEvenGrossRate.value;
const floor = reference.results.variableFloorRate.value;
const epsilonInsideTolerance = engine.TOLERANCE / 2;
const epsilonOutsideTolerance = engine.TOLERANCE * 2;

// A positive point estimate without a retention target still needs a stable,
// non-null state. Otherwise the point and range modes expose different state
// contracts for the same economically surviving hypothesis.
const positiveWithoutTarget = engine.compute({
  ...base,
  grossEdgeRate: 0.02
});
assert.equal(positiveWithoutTarget.ok, true);
assert.equal(positiveWithoutTarget.edgeMode, 'point_estimate');
assert.equal(positiveWithoutTarget.results.primaryState, 'edge_partially_retained');

// Equality is tolerance-based throughout the Edge Range contract. Point mode
// must not classify a microscopic floating residue as a positive net margin.
const pointInsideThresholdTolerance = engine.compute({
  ...base,
  grossEdgeRate: threshold + epsilonInsideTolerance
});
assert.equal(pointInsideThresholdTolerance.ok, true);
assert.equal(pointInsideThresholdTolerance.results.primaryState, 'edge_fully_absorbed');

const pointOutsideThresholdTolerance = engine.compute({
  ...base,
  grossEdgeRate: threshold + epsilonOutsideTolerance
});
assert.equal(pointOutsideThresholdTolerance.ok, true);
assert.equal(pointOutsideThresholdTolerance.results.primaryState, 'edge_partially_retained');

// The same tolerance must govern the variable-floor frontier. A value that is
// numerically equal to the floor cannot produce a finite positive-net size.
const pointInsideFloorTolerance = engine.compute({
  ...base,
  grossEdgeRate: floor + epsilonInsideTolerance
});
assert.equal(pointInsideFloorTolerance.ok, true);
assert.equal(pointInsideFloorTolerance.results.minimumOrderForPositiveNet.status, 'unavailable');
assert.equal(pointInsideFloorTolerance.results.minimumOrderForPositiveNet.reason, 'structurally_unreachable');

const pointOutsideFloorTolerance = engine.compute({
  ...base,
  grossEdgeRate: floor + epsilonOutsideTolerance
});
assert.equal(pointOutsideFloorTolerance.ok, true);
assert.equal(pointOutsideFloorTolerance.results.minimumOrderForPositiveNet.status, 'available');
assert.ok(Number.isFinite(pointOutsideFloorTolerance.results.minimumOrderForPositiveNet.value));

// Point and degenerate-range modes may expose different containers, but their
// economic classification at the threshold and floor must stay consistent.
const degenerateInsideThresholdTolerance = engine.compute({
  ...base,
  grossEdgeLowRate: threshold + epsilonInsideTolerance,
  grossEdgeBaseRate: threshold + epsilonInsideTolerance,
  grossEdgeHighRate: threshold + epsilonInsideTolerance
});
assert.equal(degenerateInsideThresholdTolerance.ok, true);
assert.equal(degenerateInsideThresholdTolerance.results.edgeRange.rangeState, 'fails_full_range');
assert.equal(pointInsideThresholdTolerance.results.primaryState, 'edge_fully_absorbed');

const degenerateInsideFloorTolerance = engine.compute({
  ...base,
  grossEdgeLowRate: floor + epsilonInsideTolerance,
  grossEdgeBaseRate: floor + epsilonInsideTolerance,
  grossEdgeHighRate: floor + epsilonInsideTolerance
});
assert.equal(degenerateInsideFloorTolerance.ok, true);
assert.equal(
  degenerateInsideFloorTolerance.results.edgeRange.low.minimumOrderForPositiveNet.reason,
  pointInsideFloorTolerance.results.minimumOrderForPositiveNet.reason
);

engine.assertFiniteTree(positiveWithoutTarget);
engine.assertFiniteTree(pointInsideThresholdTolerance);
engine.assertFiniteTree(pointOutsideThresholdTolerance);
engine.assertFiniteTree(pointInsideFloorTolerance);
engine.assertFiniteTree(pointOutsideFloorTolerance);
engine.assertFiniteTree(degenerateInsideThresholdTolerance);
engine.assertFiniteTree(degenerateInsideFloorTolerance);

console.log('Point/range consistency regression tests passed');
