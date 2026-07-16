'use strict';

const foundationFixtures = require('../../cost_gate_foundation/tests/fixtures.js');
const ledgerEngine = require('../ledger.js');

function deepClone(value) {
  if (Array.isArray(value)) return value.map(deepClone);
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).forEach((key) => { out[key] = deepClone(value[key]); });
    return out;
  }
  return value;
}

function baseLegacy(overrides) {
  return foundationFixtures.baseInput(overrides || {});
}

function baseLedger(overrides) {
  const adapted = ledgerEngine.adaptLegacy(baseLegacy());
  if (!adapted.ok) throw new Error(`fixture_adaptation_failed:${JSON.stringify(adapted.errors)}`);
  const ledger = deepClone(adapted.ledger);
  Object.keys(overrides || {}).forEach((key) => {
    ledger[key] = deepClone(overrides[key]);
  });
  return ledger;
}

function componentByEvent(ledger, economicEventId) {
  const component = ledger.components.find((candidate) => candidate.economicEventId === economicEventId);
  if (!component) throw new Error(`missing_fixture_component:${economicEventId}`);
  return component;
}

module.exports = {
  deepClone,
  baseLegacy,
  baseLedger,
  componentByEvent
};
