#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
execFileSync('python3', [path.join(root, 'scripts/materialize_breaktest.py')], { stdio: 'inherit' });
const htmlPath = path.join(root, 'app/Breaktest_Studio.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function between(source, start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(a, -1, `Missing start marker: ${start}`);
  assert.notEqual(b, -1, `Missing end marker: ${end}`);
  return source.slice(a, b);
}

const demoBlock = between(html, 'const DEMO_RAW = [', '\n\nfunction delimiterOf');
const normalizationBlock = between(html, 'class TradeValidationError', '\nfunction positionForTrade');
const source = `${demoBlock}\n${normalizationBlock}\nglobalThis.api = { DEMO_RAW, TradeBatchValidationError, numericState, normalizeTrade, normalizeTrades };`;
const context = { console };
vm.createContext(context);
vm.runInContext(source, context, { filename: 'breaktest-normalization.js' });
const { DEMO_RAW, TradeBatchValidationError, numericState, normalizeTrade, normalizeTrades } = context.api;

function validRow(overrides = {}) {
  return {
    sample: 'backtest',
    ticker: 'TEST',
    invested_eur: 100,
    gross_pnl_eur: 10,
    gross_return: 0.1,
    ...overrides,
  };
}

function expectBatchError(rows, field, status) {
  assert.throws(
    () => normalizeTrades(rows),
    (error) => {
      assert.ok(error instanceof TradeBatchValidationError);
      assert.equal(error.errors[0].field, field);
      assert.equal(error.errors[0].status, status);
      return true;
    },
  );
}

for (const [input, status, value] of [
  ['', 'missing', null],
  ['NaN', 'invalid', null],
  ['Infinity', 'invalid', null],
  [0, 'valid', 0],
]) {
  const state = numericState(input);
  assert.equal(state.status, status);
  assert.equal(state.value, value);
}

const demo = normalizeTrades(DEMO_RAW);
assert.equal(demo.length, 40, 'the 40-row demonstration must remain loadable');
assert.equal(demo[0].invested, 100);
assert.equal(demo[0].grossPnl, 9.09);
assert.equal(demo[0].grossReturn, 0.0909);

const nominal = normalizeTrade(validRow());
assert.equal(nominal.invested, 100);
assert.equal(nominal.grossPnl, 10);
assert.equal(nominal.grossReturn, 0.1);

const derived = normalizeTrade(validRow({ gross_return: '' }));
assert.equal(derived.grossReturn, 0.1, 'a missing return may be derived from valid PnL and nominal');
assert.equal(derived.grossReturnDerived, true);
const omittedDerived = normalizeTrade((({ gross_return, ...row }) => row)(validRow()));
assert.equal(omittedDerived.grossReturn, 0.1);
const zeroPnl = normalizeTrade(validRow({ gross_pnl_eur: 0, gross_return: '' }));
assert.equal(zeroPnl.grossReturn, 0, 'a genuine zero must not be treated as missing');
const returnOnly = normalizeTrade(validRow({ gross_pnl_eur: '' }));
assert.equal(returnOnly.grossPnl, 10, 'a missing PnL may be derived from a valid return and nominal');
assert.equal(returnOnly.grossPnlDerived, true);

expectBatchError([validRow({ gross_return: 'not-a-number' })], 'gross_return', 'invalid');
expectBatchError([validRow({ gross_return: 'NaN' })], 'gross_return', 'invalid');
expectBatchError([validRow({ gross_return: 'Infinity' })], 'gross_return', 'invalid');
expectBatchError([validRow({ invested_eur: '' })], 'invested_eur', 'missing');
expectBatchError([validRow({ invested_eur: 0 })], 'invested_eur', 'invalid');
expectBatchError([validRow({ gross_pnl_eur: 'bad' })], 'gross_pnl_eur', 'invalid');
expectBatchError([validRow({ gross_return: '', gross_pnl_eur: '' })], 'gross_return ou gross_pnl_eur', 'missing');

assert.throws(
  () => normalizeTrades([validRow(), validRow({ gross_return: 'bad' }), validRow({ invested_eur: '' })]),
  (error) => {
    assert.ok(error instanceof TradeBatchValidationError);
    assert.equal(error.errors.length, 2);
    assert.match(error.message, /Ligne 2/);
    assert.match(error.message, /\+1 autre erreur/);
    return true;
  },
  'the whole batch must be rejected instead of silently dropping bad rows',
);

console.log('H1 strict numeric validation tests passed');
