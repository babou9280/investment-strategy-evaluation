'use strict';

const assert = require('assert');
const surfaceEngine = require('../survival_surface.js');
const fixtures = require('./surface_fixtures.js');

function close(left, right, tolerance = 1e-12) {
  return Math.abs(left - right) <= tolerance * Math.max(1, Math.abs(left), Math.abs(right));
}

const request = fixtures.baseRequest();
request.projection.sizeAxisEur = [250, 300, 400, 500, 750, 1000];
request.projection.domain.maxNotionalEur = 1000;
const result = surfaceEngine.evaluate(request);
assert.equal(result.ok, true);
assert.equal(result.cells.length, request.projection.sizeAxisEur.length * 9);

// Every cell reconciles gross, cost, margin and threshold independently.
result.cells.forEach((cell) => {
  assert.ok(close(cell.grossEdgeEur, cell.sizeEur * cell.grossEdgeRate));
  assert.ok(close(cell.breakEvenGrossRate, cell.costEur / cell.sizeEur));
  assert.ok(close(cell.netMarginEur, cell.grossEdgeEur - cell.costEur));
  assert.ok(close(cell.netMarginRate, cell.grossEdgeRate - cell.breakEvenGrossRate));
  if (cell.state === 'positive_margin_under_assumptions') assert.ok(cell.netMarginEur > 0);
  if (cell.state === 'below_threshold') assert.ok(cell.netMarginEur < 0);
  if (cell.state === 'at_threshold_no_positive_margin') assert.equal(cell.netMarginEur, 0);
});

// Fixed plus proportional geometry is reproduced at every size and scenario.
request.projection.sizeAxisEur.forEach((size) => {
  const expected = {
    low: 2 + 0.0065 * size,
    base: 2 + 0.007 * size,
    high: 2 + 0.008 * size
  };
  ['low', 'base', 'high'].forEach((costScenario) => {
    const cells = result.cells.filter((cell) => cell.sizeEur === size && cell.costScenario === costScenario);
    cells.forEach((cell) => assert.ok(close(cell.costEur, expected[costScenario])));
  });
});

// Exact boundary classification agrees with cells on either side and at equality.
result.boundaries.exact.forEach((boundary) => {
  if (boundary.status === 'positive_strictly_above_boundary') {
    result.cells
      .filter((cell) => cell.costScenario === boundary.costScenario && cell.edgeScenario === boundary.edgeScenario)
      .forEach((cell) => {
        if (close(cell.sizeEur, boundary.boundaryNotionalEur)) {
          assert.equal(cell.state, 'at_threshold_no_positive_margin');
        } else if (cell.sizeEur > boundary.boundaryNotionalEur) {
          assert.equal(cell.state, 'positive_margin_under_assumptions');
        } else {
          assert.equal(cell.state, 'below_threshold');
        }
      });
  }
});

// Higher cost cannot improve a cell at fixed size and edge.
request.projection.sizeAxisEur.forEach((size) => {
  ['low', 'base', 'high'].forEach((edgeScenario) => {
    const low = fixtures.cell(result, size, 'low', edgeScenario);
    const base = fixtures.cell(result, size, 'base', edgeScenario);
    const high = fixtures.cell(result, size, 'high', edgeScenario);
    assert.ok(low.costEur <= base.costEur && base.costEur <= high.costEur);
    assert.ok(low.netMarginEur >= base.netMarginEur && base.netMarginEur >= high.netMarginEur);
  });
});

// Higher aligned edge cannot reduce margin at fixed size and cost.
request.projection.sizeAxisEur.forEach((size) => {
  ['low', 'base', 'high'].forEach((costScenario) => {
    const low = fixtures.cell(result, size, costScenario, 'low');
    const base = fixtures.cell(result, size, costScenario, 'base');
    const high = fixtures.cell(result, size, costScenario, 'high');
    assert.ok(low.grossEdgeRate <= base.grossEdgeRate && base.grossEdgeRate <= high.grossEdgeRate);
    assert.ok(low.netMarginEur <= base.netMarginEur && base.netMarginEur <= high.netMarginEur);
  });
});

// Equality tolerance never emits negative zero or a false positive margin.
const equality = surfaceEngine.marginState(5.5 + 1e-14, 5.5);
assert.equal(equality.state, 'at_threshold_no_positive_margin');
assert.equal(equality.netMarginEur, 0);
assert.equal(Object.is(equality.netMarginEur, -0), false);

console.log('Cost Survival Surface v1 property tests: PASS');
