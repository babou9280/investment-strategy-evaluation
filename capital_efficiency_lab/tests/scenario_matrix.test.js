'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const engine = require('../engine.js');

const matrix = JSON.parse(fs.readFileSync(path.join(__dirname, 'scenarios.json'), 'utf8'));
assert.equal(matrix.schema_version, '1.0');
assert.equal(matrix.status, 'synthetic_only');
assert.ok(Array.isArray(matrix.scenarios));
assert.ok(matrix.scenarios.length >= 6);

function approx(actual, expected, tolerance = 1e-12) {
  assert.equal(typeof actual, 'number');
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)), `${actual} != ${expected}`);
}

function assertExpected(result, expected, scenarioId) {
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (key === 'primaryState') {
      assert.equal(result.results.primaryState, expectedValue, scenarioId);
      continue;
    }
    if (key.endsWith('Reason')) {
      const resultKey = key.slice(0, -6);
      assert.equal(result.results[resultKey].reason, expectedValue, `${scenarioId}:${resultKey}`);
      continue;
    }
    if (key.endsWith('Boundary')) {
      const resultKey = key.slice(0, -8);
      assert.equal(result.results[resultKey].boundary, expectedValue, `${scenarioId}:${resultKey}`);
      continue;
    }
    const item = result.results[key];
    assert.ok(item, `${scenarioId}: missing ${key}`);
    assert.equal(item.status, 'available', `${scenarioId}:${key} not available`);
    approx(item.value, expectedValue);
  }
}

const ids = new Set();
for (const scenario of matrix.scenarios) {
  assert.ok(scenario.id && scenario.question);
  assert.equal(ids.has(scenario.id), false, `Duplicate scenario id ${scenario.id}`);
  ids.add(scenario.id);
  assert.equal(scenario.inputs.provenance, 'synthetic_demo');
  const result = engine.compute(scenario.inputs);
  assert.equal(result.ok, true, scenario.id);
  engine.assertFiniteTree(result);
  assertExpected(result, scenario.expected, scenario.id);
  Object.values(result.invariants).filter(value => value !== null).forEach(value => assert.equal(value, true, scenario.id));
}

const fixed = matrix.scenarios.find(item => item.id === 'fixed_cost_dominated');
const fixedLarge = engine.compute({ ...fixed.inputs, orderNotionalEur: fixed.inputs.orderNotionalEur * 10 });
assert.ok(fixedLarge.results.breakEvenGrossRate.value < fixed.expected.breakEvenGrossRate);

const variable = matrix.scenarios.find(item => item.id === 'variable_floor_dominated');
const variableLarge = engine.compute({ ...variable.inputs, orderNotionalEur: variable.inputs.orderNotionalEur * 10 });
approx(variableLarge.results.breakEvenGrossRate.value, variable.expected.variableFloorRate);

const impossible = matrix.scenarios.find(item => item.id === 'gross_edge_below_variable_floor');
for (const factor of [0.1, 1, 10, 1000]) {
  const result = engine.compute({ ...impossible.inputs, orderNotionalEur: impossible.inputs.orderNotionalEur * factor });
  assert.equal(result.results.minimumOrderForPositiveNet.reason, 'structurally_unreachable');
}

console.log(`Capital Efficiency scenario matrix passed: ${matrix.scenarios.length} synthetic cases`);
