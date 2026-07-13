'use strict';

const assert = require('assert');
const engine = require('../engine.js');

const base = {
  capitalEur: null,
  orderNotionalEur: 500,
  sideCount: 2,
  monthlyOperations: null,
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
  provenance: 'user_assumption'
};

// The UI describes capital and frequency as optional. The threshold must be
// calculable without either value and the engine must expose unavailable annual
// outputs rather than inventing a zero or requiring a hidden default.
const thresholdWithoutAnnualInputs = engine.compute(base);
assert.equal(thresholdWithoutAnnualInputs.ok, true);
assert.equal(thresholdWithoutAnnualInputs.edgeMode, 'threshold_only');
assert.equal(thresholdWithoutAnnualInputs.results.breakEvenGrossRate.status, 'available');
assert.equal(thresholdWithoutAnnualInputs.results.annualOperations.status, 'unavailable');
assert.equal(thresholdWithoutAnnualInputs.results.annualOperations.reason, 'frequency_missing');
assert.equal(thresholdWithoutAnnualInputs.results.annualCostEur.status, 'unavailable');
assert.equal(thresholdWithoutAnnualInputs.results.annualCostEur.reason, 'frequency_missing');
assert.equal(thresholdWithoutAnnualInputs.results.annualDragToCapitalRate.status, 'unavailable');
assert.equal(thresholdWithoutAnnualInputs.results.annualDragToCapitalRate.reason, 'frequency_missing');
assert.deepEqual(thresholdWithoutAnnualInputs.sensitivity.frequency, []);
engine.assertFiniteTree(thresholdWithoutAnnualInputs);

// Adding frequency restores annual cost, but the ratio to capital remains
// unavailable until capital is explicitly provided.
const frequencyOnly = engine.compute({ ...base, monthlyOperations: 4 });
assert.equal(frequencyOnly.ok, true);
assert.equal(frequencyOnly.results.annualCostEur.status, 'available');
assert.equal(frequencyOnly.results.annualCostEur.value, 264);
assert.equal(frequencyOnly.results.annualDragToCapitalRate.reason, 'capital_missing');
assert.equal(frequencyOnly.sensitivity.frequency.length, 3);

// Adding capital without frequency does not silently create an annual horizon.
const capitalOnly = engine.compute({ ...base, capitalEur: 5000 });
assert.equal(capitalOnly.ok, true);
assert.equal(capitalOnly.results.annualCostEur.reason, 'frequency_missing');
assert.equal(capitalOnly.results.annualDragToCapitalRate.reason, 'frequency_missing');

// The inverse frequency frontier depends on capital and a budget, not on an
// already-entered current frequency. It remains calculable when current
// frequency is absent.
const budgetWithoutCurrentFrequency = engine.compute({
  ...base,
  capitalEur: 5000,
  annualDragBudgetRate: 0.03
});
assert.equal(budgetWithoutCurrentFrequency.ok, true);
assert.equal(budgetWithoutCurrentFrequency.results.maxMonthlyOperationsUnderBudget.status, 'available');
assert.ok(Number.isFinite(budgetWithoutCurrentFrequency.results.maxMonthlyOperationsUnderBudget.value));

// Point mode remains available without annual inputs; annual projections are
// explicitly unavailable while per-operation Edge Survival is calculated.
const pointWithoutAnnualInputs = engine.compute({ ...base, grossEdgeRate: 0.02 });
assert.equal(pointWithoutAnnualInputs.ok, true);
assert.equal(pointWithoutAnnualInputs.results.netEdgeRate.status, 'available');
assert.equal(pointWithoutAnnualInputs.results.annualGrossEdgeEur.reason, 'frequency_missing');
assert.equal(pointWithoutAnnualInputs.results.annualNetEdgeEur.reason, 'frequency_missing');
assert.equal(pointWithoutAnnualInputs.results.annualGrossEdgeToCapitalRate.reason, 'frequency_missing');
assert.equal(pointWithoutAnnualInputs.results.annualNetEdgeToCapitalRate.reason, 'frequency_missing');
engine.assertFiniteTree(pointWithoutAnnualInputs);

console.log('Optional annual input regression tests passed');
