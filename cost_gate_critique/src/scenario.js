(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BreaktestCostGateScenario = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 'cost-gate-critique-scenario-1';
  const REQUIRED_NUMERIC_FIELDS = [
    'orderNotionalEur',
    'commissionPerSideEur',
    'fxRatePerSidePct',
    'spreadTotalPct',
    'slippageTotalPct',
    'cashSettledBeforeReserveEur',
    'strategyHeadroomEur',
    'cashReserveEur',
    'entryContractualFeesEur',
    'entryTaxEur',
    'executionCashBufferEur'
  ];

  const DEMO_FIELDS = Object.freeze({
    instrumentType: 'spot_equity',
    operationScope: 'complete_round_trip',
    quoteCurrency: 'USD',
    orderNotionalEur: '500',
    commissionPerSideEur: '1',
    fxRatePerSidePct: '0.25',
    spreadTotalPct: '0.10',
    slippageTotalPct: '0.10',
    cashSettledBeforeReserveEur: '1000',
    strategyHeadroomEur: '1000',
    cashReserveEur: '0',
    entryContractualFeesEur: '0',
    entryTaxEur: '0',
    executionCashBufferEur: '0',
    edgeMode: 'point',
    grossEdgePct: '2',
    grossEdgeLowPct: '',
    grossEdgeBasePct: '',
    grossEdgeHighPct: ''
  });

  function parseFrenchNumber(value) {
    if (value === null || value === undefined) return { ok: false, reason: 'required', value: null };
    if (typeof value === 'number') {
      return Number.isFinite(value) ? { ok: true, reason: null, value } : { ok: false, reason: 'invalid_number', value: null };
    }
    if (typeof value !== 'string') return { ok: false, reason: 'invalid_number', value: null };
    const trimmed = value.trim();
    if (!trimmed) return { ok: false, reason: 'required', value: null };
    if ((trimmed.includes(',') && trimmed.includes('.')) || !/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(trimmed)) {
      return { ok: false, reason: 'invalid_number', value: null };
    }
    const parsed = Number(trimmed.replace(',', '.'));
    if (!Number.isFinite(parsed)) return { ok: false, reason: 'invalid_number', value: null };
    return { ok: true, reason: null, value: Object.is(parsed, -0) ? 0 : parsed };
  }

  function alignedFieldStatuses(engine) {
    const out = {};
    engine.ALIGNMENT_FIELDS.forEach((field) => { out[field] = 'aligned'; });
    return out;
  }

  function alignedGrossEdge(engine, values, context) {
    const instrumentId = context.mode === 'demo' ? 'SYNTH:ABC' : 'MANUAL:SCENARIO';
    const venueId = context.mode === 'demo' ? 'SYNTH-X' : 'MANUAL';
    return {
      fieldStatuses: alignedFieldStatuses(engine),
      key: {
        instrumentId,
        venueId,
        direction: 'long',
        operationScope: values.operationScope,
        entryRuleId: context.mode === 'demo' ? 'synthetic-entry-rule' : 'user-declared-entry-rule',
        exitRuleId: values.operationScope === 'complete_round_trip'
          ? (context.mode === 'demo' ? 'synthetic-exit-rule' : 'user-declared-exit-rule')
          : 'not_applicable',
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
        strategyRuleVersion: context.mode === 'demo' ? 'synthetic-rule-1' : 'user-declared-rule-1'
      }
    };
  }

  function fieldError(errors, key, reason) {
    errors[key] = reason;
  }

  function buildScenario(engine, fields, contextValue) {
    const context = Object.assign({ mode: 'manual', instanceId: 'gate1-instance' }, contextValue || {});
    const errors = {};
    const values = {};

    REQUIRED_NUMERIC_FIELDS.forEach((key) => {
      const parsed = parseFrenchNumber(fields[key]);
      if (!parsed.ok) fieldError(errors, key, parsed.reason);
      else if (parsed.value < 0) fieldError(errors, key, 'must_be_non_negative');
      else values[key] = parsed.value;
    });

    if (!['spot_equity', 'spot_etf'].includes(fields.instrumentType)) fieldError(errors, 'instrumentType', 'required_choice');
    if (!['entry_leg', 'complete_round_trip'].includes(fields.operationScope)) fieldError(errors, 'operationScope', 'required_choice');
    if (!['EUR', 'USD'].includes(fields.quoteCurrency)) fieldError(errors, 'quoteCurrency', 'required_choice');
    if (!['none', 'point', 'range'].includes(fields.edgeMode)) fieldError(errors, 'edgeMode', 'required_choice');

    if (values.orderNotionalEur !== undefined && values.orderNotionalEur <= 0) {
      fieldError(errors, 'orderNotionalEur', 'must_be_strictly_positive');
    }
    if (values.fxRatePerSidePct !== undefined && values.fxRatePerSidePct > 100) fieldError(errors, 'fxRatePerSidePct', 'percent_out_of_range');
    if (values.spreadTotalPct !== undefined && values.spreadTotalPct > 100) fieldError(errors, 'spreadTotalPct', 'percent_out_of_range');
    if (values.slippageTotalPct !== undefined && values.slippageTotalPct > 100) fieldError(errors, 'slippageTotalPct', 'percent_out_of_range');
    if (fields.quoteCurrency === 'EUR' && values.fxRatePerSidePct > 0) fieldError(errors, 'fxRatePerSidePct', 'same_currency_fx_must_be_zero');

    const edgeValues = {};
    if (fields.edgeMode === 'point') {
      const parsed = parseFrenchNumber(fields.grossEdgePct);
      if (!parsed.ok) fieldError(errors, 'grossEdgePct', parsed.reason);
      else if (parsed.value < 0 || parsed.value > 100) fieldError(errors, 'grossEdgePct', 'percent_out_of_range');
      else edgeValues.grossEdgeRate = parsed.value / 100;
    } else if (fields.edgeMode === 'range') {
      ['grossEdgeLowPct', 'grossEdgeBasePct', 'grossEdgeHighPct'].forEach((key) => {
        const parsed = parseFrenchNumber(fields[key]);
        if (!parsed.ok) fieldError(errors, key, parsed.reason);
        else if (parsed.value < 0 || parsed.value > 100) fieldError(errors, key, 'percent_out_of_range');
        else edgeValues[key.replace('Pct', 'Rate')] = parsed.value / 100;
      });
      if (
        edgeValues.grossEdgeLowRate !== undefined && edgeValues.grossEdgeBaseRate !== undefined &&
        edgeValues.grossEdgeLowRate > edgeValues.grossEdgeBaseRate
      ) fieldError(errors, 'grossEdgeLowPct', 'range_order_invalid');
      if (
        edgeValues.grossEdgeBaseRate !== undefined && edgeValues.grossEdgeHighRate !== undefined &&
        edgeValues.grossEdgeBaseRate > edgeValues.grossEdgeHighRate
      ) fieldError(errors, 'grossEdgeHighPct', 'range_order_invalid');
    }

    if (Object.keys(errors).length) return { ok: false, version: VERSION, errors, input: null };

    const sideCount = fields.operationScope === 'entry_leg' ? 1 : 2;
    const fxRatePerSide = values.fxRatePerSidePct / 100;
    const provenance = context.mode === 'demo' ? 'synthetic_demo' : 'user_assumption';
    const instrumentId = context.mode === 'demo' ? 'SYNTH:ABC' : 'MANUAL:SCENARIO';
    const venueId = context.mode === 'demo' ? 'SYNTH-X' : 'MANUAL';
    const input = {
      accountModel: 'cash_account',
      positionModel: 'long_cash_purchase',
      instrumentType: fields.instrumentType,
      instrumentId,
      venueId,
      side: 'long',
      operationScope: fields.operationScope,
      orderType: 'manual_assumption',
      orderQuantity: null,
      referencePriceEur: null,
      orderNotionalEur: values.orderNotionalEur,
      accountCurrency: 'EUR',
      quoteCurrency: fields.quoteCurrency,
      holdingHorizonDefinition: 'user_defined',
      provenance,
      cost: {
        sideCount,
        commissionPerSideEur: values.commissionPerSideEur,
        fxRatePerSide,
        spreadTotalRate: values.spreadTotalPct / 100,
        slippageTotalRate: values.slippageTotalPct / 100
      },
      grossEdgeRate: fields.edgeMode === 'point' ? edgeValues.grossEdgeRate : null,
      grossEdgeLowRate: fields.edgeMode === 'range' ? edgeValues.grossEdgeLowRate : null,
      grossEdgeBaseRate: fields.edgeMode === 'range' ? edgeValues.grossEdgeBaseRate : null,
      grossEdgeHighRate: fields.edgeMode === 'range' ? edgeValues.grossEdgeHighRate : null,
      cash: {
        notionalBasis: 'expected_execution_consideration',
        spreadReferencePriceStatus: 'included',
        slippageReferencePriceStatus: 'included',
        entryAssetConsiderationEur: values.orderNotionalEur,
        entryCommissionEur: values.commissionPerSideEur,
        entryContractualFeesEur: values.entryContractualFeesEur,
        entryTaxEur: values.entryTaxEur,
        entryFxCashCostEur: values.orderNotionalEur * fxRatePerSide,
        userDefinedExecutionCashBufferEur: values.executionCashBufferEur,
        entrySpreadCashEur: 0,
        entrySlippageCashEur: 0,
        availableSettledCashEur: values.cashSettledBeforeReserveEur,
        availableSettledCashBasis: 'gross_before_declared_holds',
        sourceIncludedHoldIds: [],
        holds: [],
        userDefinedCashReserveEur: values.cashReserveEur,
        strategyCapitalEur: values.strategyHeadroomEur,
        strategyCapitalCommittedEur: 0
      },
      sources: [],
      snapshotInstanceId: context.instanceId,
      createdAtUtc: null,
      calculatedAtUtc: null
    };
    if (fields.edgeMode !== 'none') input.grossEdgeAlignment = alignedGrossEdge(engine, fields, context);
    return { ok: true, version: VERSION, errors: {}, input };
  }

  function demoFields() {
    return Object.assign({}, DEMO_FIELDS);
  }

  return { VERSION, DEMO_FIELDS, REQUIRED_NUMERIC_FIELDS, parseFrenchNumber, buildScenario, demoFields };
});
