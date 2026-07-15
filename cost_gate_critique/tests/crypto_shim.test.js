'use strict';

const assert = require('assert');
const crypto = require('crypto');
const shim = require('../src/crypto-shim.js');

const vectors = [
  '',
  'abc',
  'Breaktest Cost Gate',
  'économie · hypothèse basse / centrale / haute',
  '𐍈🙂EUR',
  'a'.repeat(55),
  'b'.repeat(56),
  'c'.repeat(64),
  'd'.repeat(1000)
];

for (const value of vectors) {
  const expected = crypto.createHash('sha256').update(value, 'utf8').digest('hex');
  assert.equal(shim.sha256Hex(value), expected, `SHA-256 mismatch for ${JSON.stringify(value.slice(0, 30))}`);
  assert.equal(shim.createHash('sha256').update(value).digest('hex'), expected);
}

const incremental = shim.createHash('sha256').update('Break').update('test').digest('hex');
assert.equal(incremental, crypto.createHash('sha256').update('Breaktest').digest('hex'));
assert.throws(() => shim.createHash('sha1'), /unsupported_hash_algorithm/);
assert.throws(() => shim.createHash('sha256').update('x').digest('base64'), /unsupported_digest_encoding/);

console.log('Cost Gate critique SHA-256 browser adapter tests passed');
