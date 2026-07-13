'use strict';
const assert = require('assert');
const engine = require('../engine.js');

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number', `Expected a numeric value, received ${typeof actual}`);
  assert.ok(Number.isFinite(actual), `Expected a finite value, received ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

const reference = {
  capitalEur: 5000,
  orderNotionalEur: 500,
  sideCount: 2,
  monthlyOperations: 4,
  commissionPerSideEur: 1,
  fxRatePerSide: 0.0025,
  spreadTotalRate: 0.001,
  slippageTotalRate: 0.001,
  grossEdgeRate: 0.02,
  retentionTargetRate: 0.5,
  annualDragBudgetRate: 0.03,
  targetNetRate: 0.01,
  provenance: 'synthetic_demo'
};

const r = engine.compute(reference);
assert.equal(r.ok, true);
approx(r.results.fixedCostEur.value, 2);
approx(r.results.variableFloorRate.value, 0.007);
approx(r.results.variableCostEur.value, 3.5);
approx(r.results.totalCostEur.value, 5.5);
approx(r.results.breakEvenGrossRate.value, 0.011);
approx(r.results.netEdgeRate.value, 0.009);
approx(r.results.grossEdgeEur.value, 10);
approx(r.results.netEdgeEur.value, 4.5);
approx(r.results.edgeAbsorptionRate.value, 0.55);
approx(r.results.edgeRetainedRate.value, 0.45);
approx(r.results.minimumOrderForPositiveNet.value, 153.84615384615384);
approx(r.results.minimumOrderForRetention.value, 666.6666666666666);
approx(r.results.annualCostEur.value, 264);
approx(r.results.annualDragToCapitalRate.value, 0.0528);
approx(r.results.maxMonthlyOperationsUnderBudget.value, 2.272727272727273);
approx(r.results.requiredGrossRateForTargetNet.value, 0.021);
approx(r.results.fixedCostShare.value, 0.36363636363636365);
approx(r.results.variableCostShare.value, 0.6363636363636364);
approx(r.results.fixedVariableEqualOrder.value, 285.7142857142857);
approx(r.results.annualGrossEdgeEur.value, 480);
approx(r.results.annualNetEdgeEur.value, 216);
approx(r.results.annualGrossEdgeToCapitalRate.value, 0.096);
approx(r.results.annualNetEdgeToCapitalRate.value, 0.0432);
assert.equal(r.results.primaryState, 'edge_partially_retained');
assert.equal(r.results.provenance, 'synthetic_demo');
Object.values(r.invariants).filter(v => v !== null).forEach(v => assert.equal(v, true));
engine.assertFiniteTree(r);

const thresholdOnly = engine.compute({ ...reference, grossEdgeRate: null, retentionTargetRate: null });
assert.equal(thresholdOnly.ok, true);
assert.equal(thresholdOnly.results.primaryState, 'threshold_only');
assert.equal(thresholdOnly.results.netEdgeRate.status, 'unavailable');

const simple = engine.compute({ ...reference, sideCount: 1 });
approx(simple.results.fixedCostEur.value, 1);
approx(simple.results.variableFloorRate.value, 0.0045);
assert.ok(simple.results.breakEvenGrossRate.value < r.results.breakEvenGrossRate.value);

const zeroCosts = engine.compute({
  capitalEur: 1000, orderNotionalEur: 100, sideCount: 2, monthlyOperations: 2,
  commissionPerSideEur: 0, fxRatePerSide: 0, spreadTotalRate: 0, slippageTotalRate: 0,
  grossEdgeRate: 0.01, retentionTargetRate: 1, annualDragBudgetRate: 0.01, targetNetRate: 0
});
assert.equal(zeroCosts.ok, true);
approx(zeroCosts.results.totalCostEur.value, 0);
approx(zeroCosts.results.breakEvenGrossRate.value, 0);
approx(zeroCosts.results.netEdgeRate.value, 0.01);
assert.equal(zeroCosts.results.minimumOrderForPositiveNet.status, 'available');
approx(zeroCosts.results.minimumOrderForPositiveNet.value, 0);
assert.equal(zeroCosts.results.minimumOrderForPositiveNet.boundary, 'no_positive_minimum_from_fixed_costs');
assert.equal(zeroCosts.results.minimumOrderForRetention.status, 'available');
approx(zeroCosts.results.minimumOrderForRetention.value, 0);
assert.equal(zeroCosts.results.minimumOrderForRetention.boundary, 'no_positive_minimum_from_fixed_costs');
assert.equal(zeroCosts.results.maxMonthlyOperationsUnderBudget.reason, 'unbounded_within_model');
assert.equal(zeroCosts.results.fixedCostShare.reason, 'total_cost_zero');
engine.assertFiniteTree(zeroCosts);

const zeroFixedExactRetention = engine.compute({
  ...reference,
  commissionPerSideEur: 0,
  grossEdgeRate: 0.014,
  retentionTargetRate: 0.5
});
assert.equal(zeroFixedExactRetention.results.minimumOrderForRetention.status, 'available');
approx(zeroFixedExactRetention.results.minimumOrderForRetention.value, 0);
assert.equal(zeroFixedExactRetention.results.minimumOrderForRetention.boundary, 'no_positive_minimum_from_fixed_costs');
approx(zeroFixedExactRetention.results.edgeRetainedRate.value, 0.5);

const zeroFixedUnreachableRetention = engine.compute({
  ...reference,
  commissionPerSideEur: 0,
  grossEdgeRate: 0.013,
  retentionTargetRate: 0.5
});
assert.equal(zeroFixedUnreachableRetention.results.minimumOrderForRetention.status, 'unavailable');
assert.equal(zeroFixedUnreachableRetention.results.minimumOrderForRetention.reason, 'structurally_unreachable');

const negativeEdge = engine.compute({ ...reference, grossEdgeRate: -0.01 });
assert.equal(negativeEdge.results.primaryState, 'edge_fully_absorbed');
assert.equal(negativeEdge.results.edgeRetainedRate.reason, 'gross_edge_non_positive');
assert.equal(negativeEdge.results.minimumOrderForPositiveNet.reason, 'structurally_unreachable');

const zeroEdge = engine.compute({ ...reference, grossEdgeRate: 0 });
assert.equal(zeroEdge.results.primaryState, 'edge_fully_absorbed');
assert.equal(zeroEdge.results.edgeAbsorptionRate.reason, 'gross_edge_non_positive');

const atThreshold = engine.compute({ ...reference, grossEdgeRate: 0.011 });
approx(atThreshold.results.netEdgeRate.value, 0);
assert.equal(atThreshold.results.primaryState, 'edge_fully_absorbed');

const atFloor = engine.compute({ ...reference, grossEdgeRate: 0.007 });
assert.equal(atFloor.results.minimumOrderForPositiveNet.reason, 'structurally_unreachable');

const belowFloor = engine.compute({ ...reference, grossEdgeRate: 0.006 });
assert.equal(belowFloor.results.minimumOrderForPositiveNet.reason, 'structurally_unreachable');

const unreachableRetention = engine.compute({ ...reference, retentionTargetRate: 0.8 });
assert.equal(unreachableRetention.results.minimumOrderForRetention.reason, 'structurally_unreachable');

const noCapital = engine.compute({ ...reference, capitalEur: null });
assert.equal(noCapital.ok, true);
assert.equal(noCapital.results.annualDragToCapitalRate.reason, 'capital_missing');
assert.equal(noCapital.results.maxMonthlyOperationsUnderBudget.reason, 'capital_missing');

const zeroFrequency = engine.compute({ ...reference, monthlyOperations: 0 });
approx(zeroFrequency.results.annualCostEur.value, 0);
approx(zeroFrequency.results.breakEvenGrossRate.value, r.results.breakEvenGrossRate.value);

for (const bad of [NaN, Infinity, -Infinity, '2', 'abc']) {
  const badResult = engine.compute({ ...reference, orderNotionalEur: bad });
  assert.equal(badResult.ok, false);
  assert.ok(badResult.errors.orderNotionalEur);
}

const missingRequired = engine.compute({ ...reference, orderNotionalEur: null });
assert.equal(missingRequired.ok, false);
assert.equal(missingRequired.errors.orderNotionalEur, 'required');

const invalidRate = engine.compute({ ...reference, fxRatePerSide: 1.1 });
assert.equal(invalidRate.ok, false);
assert.equal(invalidRate.errors.fxRatePerSide, 'out_of_range');

const orderPoints = r.sensitivity.order;
for (let i = 1; i < orderPoints.length; i += 1) {
  assert.ok(orderPoints[i].breakEvenGrossRate <= orderPoints[i - 1].breakEvenGrossRate + 1e-15);
}
const hugeOrder = engine.compute({ ...reference, orderNotionalEur: 1e12 });
approx(hugeOrder.results.breakEvenGrossRate.value, hugeOrder.results.variableFloorRate.value, 1e-9);

const frequencyDouble = engine.compute({ ...reference, monthlyOperations: 8 });
approx(frequencyDouble.results.breakEvenGrossRate.value, r.results.breakEvenGrossRate.value);
approx(frequencyDouble.results.annualCostEur.value, 2 * r.results.annualCostEur.value);

const frequencyHalf = engine.compute({ ...reference, monthlyOperations: 2 });
approx(frequencyHalf.results.annualCostEur.value, 0.5 * r.results.annualCostEur.value);

console.log('Capital Efficiency engine tests passed');