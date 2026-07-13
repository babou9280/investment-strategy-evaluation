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
vm.runInContext(source, context, { filename: 'breaktest-h3-normalization.js' });
const { DEMO_RAW, TradeBatchValidationError, normalizeTrade, normalizeTrades } = context.api;

function row(overrides = {}) {
  return {
    sample: 'live',
    ticker: 'H3',
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

const eur = normalizeTrade(row({ entry_price_eur: 100, entry_price_usd: 999 }));
assert.equal(eur.entryPrice, 100);
assert.equal(eur.entryPriceInfo.sourceKey, 'entry_price_eur');
assert.equal(eur.entryPriceInfo.sourceCurrency, 'EUR');
assert.equal(eur.entryPriceInfo.currencyProvenance, 'column-name');
assert.equal(eur.entryPriceInfo.conversionRequired, false);

const usd = normalizeTrade(row({ entry_price_usd: 100 }));
assert.equal(usd.entryPriceInfo.sourceKey, 'entry_price_usd');
assert.equal(usd.entryPriceInfo.sourceCurrency, 'USD');
assert.equal(usd.entryPriceInfo.conversionRequired, true);

const genericEur = normalizeTrade(row({ entry_price: 100, entry_price_currency: 'eur' }));
assert.equal(genericEur.entryPriceInfo.status, 'valid');
assert.equal(genericEur.entryPriceInfo.sourceCurrency, 'EUR');
assert.equal(genericEur.entryPriceInfo.currencySourceKey, 'entry_price_currency');
assert.equal(genericEur.entryPriceInfo.currencyProvenance, 'explicit-field');

const genericUsd = normalizeTrade(row({ entry_price: 100, quote_currency: 'USD' }));
assert.equal(genericUsd.entryPriceInfo.status, 'valid');
assert.equal(genericUsd.entryPriceInfo.sourceCurrency, 'USD');

const unspecified = normalizeTrade(row({ entry_price: 100 }));
assert.equal(unspecified.entryPriceInfo.status, 'unsupported-currency');
assert.equal(unspecified.entryPriceInfo.sourceCurrency, null);
assert.equal(unspecified.entryPriceInfo.currencyProvenance, 'unspecified');

const unsupported = normalizeTrade(row({ entry_price: 100, currency: 'GBP' }));
assert.equal(unsupported.entryPriceInfo.status, 'unsupported-currency');
assert.equal(unsupported.entryPriceInfo.sourceCurrency, 'GBP');
assert.equal(unsupported.entryPriceInfo.currencyProvenance, 'unsupported-explicit-field');

const blankEurFallsToUsd = normalizeTrade(row({ entry_price_eur: '', entry_price_usd: 100 }));
assert.equal(blankEurFallsToUsd.entryPriceInfo.sourceKey, 'entry_price_usd');

const missing = normalizeTrade(row());
assert.equal(missing.entryPriceInfo.status, 'missing');
assert.equal(missing.entryPrice, 0);

expectBatchError({ entry_price_eur: 'abc', entry_price_usd: 100 }, 'entry_price_eur');
expectBatchError({ entry_price_eur: 0 }, 'entry_price_eur');
expectBatchError({ entry_price_eur: -1 }, 'entry_price_eur');
expectBatchError({ entry_price_usd: 'Infinity' }, 'entry_price_usd');
expectBatchError({ entry_price: 'NaN', currency: 'USD' }, 'entry_price');
expectBatchError({ entry_price: -100, currency: 'EUR' }, 'entry_price');

const demo = normalizeTrades(DEMO_RAW);
assert.equal(demo.length, 40);
assert.equal(demo.filter((trade) => trade.entryPriceInfo.status === 'valid').length, 40);
assert.equal(demo.filter((trade) => trade.entryPriceInfo.sourceCurrency === 'USD').length, 40);
assert.equal(demo.filter((trade) => trade.entryPriceInfo.sourceKey === 'entry_price_usd').length, 40);

console.log('H3 price currency normalization tests passed');
