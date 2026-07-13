#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
execFileSync('python3', [path.join(root, 'scripts/build_breaktest.py')], { stdio: 'inherit' });
const html = fs.readFileSync(path.join(root, 'app/Breaktest_Studio.html'), 'utf8');

function between(source, start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(a, -1, `Missing start marker: ${start}`);
  assert.notEqual(b, -1, `Missing end marker: ${end}`);
  return source.slice(a, b);
}

const demoBlock = between(html, 'const DEMO_RAW = [', '\n\nfunction delimiterOf');
const normalizationBlock = between(html, 'class TradeValidationError', '\nfunction positionForTrade');
const source = `${demoBlock}\n${normalizationBlock}\nglobalThis.api = { DEMO_RAW, TradeBatchValidationError, normalizeTrade, normalizeTrades };`;
const context = { console };
vm.createContext(context);
vm.runInContext(source, context, { filename: 'breaktest-h2-normalization.js' });
const { DEMO_RAW, TradeBatchValidationError, normalizeTrade, normalizeTrades } = context.api;

function row(overrides = {}) {
  return {
    sample: 'live',
    ticker: 'H2',
    invested_eur: 100,
    gross_pnl_eur: 10,
    gross_return: 0.1,
    ...overrides,
  };
}

function expectBatchError(overrides, field) {
  assert.throws(
    () => normalizeTrades([row(overrides)]),
    (error) => {
      assert.ok(error instanceof TradeBatchValidationError);
      assert.equal(error.errors[0].field, field);
      assert.equal(error.errors[0].status, 'invalid');
      return true;
    },
  );
}

const exact = normalizeTrade(row({
  fixed_net_pnl_eur: 8,
  fixed_net_return: 0.08,
  full_cost_net_pnl_eur: 7,
  full_cost_net_return: 0.07,
}));
assert.equal(exact.pnlBases.gross.pnl, 10);
assert.equal(exact.pnlBases.fixedNet.pnl, 8);
assert.equal(exact.pnlBases.fixedNet.return, 0.08);
assert.equal(exact.pnlBases.fixedNet.provenance, 'observed');
assert.equal(exact.pnlBases.fullCost.pnl, 7);
assert.equal(exact.pnlBases.fullCost.return, 0.07);
assert.equal(exact.pnlBases.fullCost.provenance, 'observed');

const derived = normalizeTrade(row({
  fixed_net_pnl_eur: 8,
  full_cost_net_return: 0.07,
}));
assert.equal(derived.fixedNetReturn, 0.08);
assert.equal(derived.pnlBases.fixedNet.returnProvenance, 'derived');
assert.ok(Math.abs(derived.fullCostNetPnl - 7) < 1e-12);
assert.equal(derived.pnlBases.fullCost.pnlProvenance, 'derived');

const fallback = normalizeTrade(row());
assert.equal(fallback.fixedNetPnl, 10);
assert.equal(fallback.pnlBases.fixedNet.provenance, 'fallback');
assert.equal(fallback.pnlBases.fixedNet.fallbackFrom, 'gross');
assert.equal(fallback.fullCostNetPnl, 10);
assert.equal(fallback.pnlBases.fullCost.provenance, 'fallback');
assert.equal(fallback.pnlBases.fullCost.fallbackFrom, 'fixedNet');

const blankFallback = normalizeTrade(row({
  fixed_net_pnl_eur: '',
  fixed_net_return: '',
  full_cost_net_pnl_eur: '',
  full_cost_net_return: '',
}));
assert.equal(blankFallback.pnlBases.fixedNet.provenance, 'fallback');
assert.equal(blankFallback.pnlBases.fullCost.provenance, 'fallback');

const zero = normalizeTrade(row({ fixed_net_pnl_eur: 0, fixed_net_return: 0 }));
assert.equal(zero.fixedNetPnl, 0);
assert.equal(zero.fixedNetReturn, 0);
assert.equal(zero.pnlBases.fixedNet.provenance, 'observed');

const percentRate = normalizeTrade(row({ fixed_net_return: 8, full_cost_net_return: 7 }));
assert.equal(percentRate.fixedNetReturn, 0.08);
assert.equal(percentRate.fullCostNetReturn, 0.07);

expectBatchError({ fixed_net_pnl_eur: 'abc' }, 'fixed_net_pnl_eur');
expectBatchError({ fixed_net_return: 'NaN' }, 'fixed_net_return');
expectBatchError({ full_cost_net_pnl_eur: 'Infinity' }, 'full_cost_net_pnl_eur');
expectBatchError({ full_cost_net_return: 'not-a-number' }, 'full_cost_net_return');

const inconsistent = normalizeTrade(row({ fixed_net_pnl_eur: 8, fixed_net_return: 0.07 }));
assert.equal(inconsistent.fixedNetPnl, 8, 'H2 must preserve the supplied PnL');
assert.equal(inconsistent.fixedNetReturn, 0.07, 'H2 must preserve the supplied return');
assert.equal(inconsistent.pnlBases.fixedNet.pairInconsistent, true, 'H4 anomaly must be exposed, not silently reconciled');

const demo = normalizeTrades(DEMO_RAW);
assert.equal(demo.length, 40);
assert.equal(demo.filter((trade) => trade.pnlBases.fixedNet.provenance !== 'fallback').length, 40);
assert.equal(demo.filter((trade) => trade.pnlBases.fullCost.provenance !== 'fallback').length, 16);
assert.equal(demo.filter((trade) => trade.pnlBases.fullCost.provenance === 'fallback').length, 24);

console.log('H2 journal net bases normalization tests passed');
