'use strict';

const engine = require('../engine.js');

function deepClone(value) {
  if (Array.isArray(value)) return value.map(deepClone);
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).forEach((key) => { out[key] = deepClone(value[key]); });
    return out;
  }
  return value;
}

function deepMerge(target, source) {
  const out = deepClone(target);
  Object.keys(source || {}).forEach((key) => {
    const value = source[key];
    if (value && typeof value === 'object' && !Array.isArray(value) && out[key] && typeof out[key] === 'object' && !Array.isArray(out[key])) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = deepClone(value);
    }
  });
  return out;
}

function alignedFieldStatuses(overrides) {
  const fields = {};
  engine.ALIGNMENT_FIELDS.forEach((field) => { fields[field] = 'aligned'; });
  return Object.assign(fields, overrides || {});
}

function alignedGrossEdge(overrides) {
  const base = {
    fieldStatuses: alignedFieldStatuses(),
    key: {
      instrumentId: 'SYNTH:ABC',
      venueId: 'SYNTH-X',
      direction: 'long',
      operationScope: 'complete_round_trip',
      entryRuleId: 'synthetic-entry-rule',
      exitRuleId: 'synthetic-exit-rule',
      signalTiming: 'user_defined',
      holdingHorizonDefinition: 'user_defined',
      returnDenominator: 'entry_notional',
      priceBasis: 'frictionless_mid_to_mid',
      currencyBasis: 'account_currency',
      accountCurrency: 'EUR',
      fxTreatment: 'excluded',
      grossOrNetBasis: 'gross_before_all_modelled_costs',
      costExclusions: ['commission', 'fx', 'spread', 'slippage'],
      estimator: 'user_assumption',
      sampleStart: 'not_applicable',
      sampleEnd: 'not_applicable',
      observationCount: 'not_applicable',
      strategyRuleVersion: 'synthetic-rule-1'
    }
  };
  return deepMerge(base, overrides || {});
}

const BASE = {
  accountModel: 'cash_account',
  positionModel: 'long_cash_purchase',
  instrumentType: 'spot_equity',
  instrumentId: 'SYNTH:ABC',
  venueId: 'SYNTH-X',
  side: 'long',
  operationScope: 'complete_round_trip',
  orderType: 'manual_assumption',
  orderQuantity: 5,
  referencePriceEur: 100,
  orderNotionalEur: 500,
  accountCurrency: 'EUR',
  quoteCurrency: 'EUR',
  holdingHorizonDefinition: 'user_defined',
  provenance: 'synthetic_demo',
  cost: {
    sideCount: 2,
    commissionPerSideEur: 1,
    fxRatePerSide: 0.0025,
    spreadTotalRate: 0.001,
    slippageTotalRate: 0.001
  },
  grossEdgeRate: 0.02,
  grossEdgeAlignment: alignedGrossEdge(),
  cash: {
    notionalBasis: 'expected_execution_consideration',
    spreadReferencePriceStatus: 'included',
    slippageReferencePriceStatus: 'included',
    entryAssetConsiderationEur: 500,
    entryCommissionEur: 1,
    entryContractualFeesEur: 0,
    entryTaxEur: 0,
    entryFxCashCostEur: 1.25,
    userDefinedExecutionCashBufferEur: 0,
    entrySpreadCashEur: 0,
    entrySlippageCashEur: 0,
    availableSettledCashEur: 1000,
    availableSettledCashBasis: 'gross_before_declared_holds',
    holds: [],
    userDefinedCashReserveEur: 0,
    strategyCapitalEur: 1000,
    strategyCapitalCommittedEur: 0
  },
  sources: [],
  snapshotInstanceId: 'fixture-instance-a',
  createdAtUtc: '2026-07-14T12:00:00Z',
  calculatedAtUtc: '2026-07-14T12:00:01Z'
};

function baseInput(overrides) {
  return deepMerge(BASE, overrides || {});
}

module.exports = {
  BASE,
  deepMerge,
  alignedFieldStatuses,
  alignedGrossEdge,
  baseInput
};
