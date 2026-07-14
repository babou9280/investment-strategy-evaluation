'use strict';

const crypto = require('crypto');
const capitalEfficiency = require('../capital_efficiency_lab/engine.js');

const VERSION = 'cost-gate-foundation-0-synthetic';
const POLICY_VERSION = 'cost-gate-findings-1';
const SNAPSHOT_VERSION = 'cost-gate-snapshot-1';
const ALIGNMENT_VERSION = 'gross-edge-alignment-1';
const FINDINGS_CATALOG_VERSION = 'cost-gate-findings-catalog-1';
const TOLERANCE = capitalEfficiency.TOLERANCE;

const SUPPORTED_INSTRUMENTS = new Set(['spot_equity', 'spot_etf']);
const SUPPORTED_PROVENANCE = new Set(['user_assumption', 'synthetic_demo']);
const PRICE_INCLUSION = new Set(['included', 'excluded', 'unknown', 'not_applicable']);
const NOTIONAL_BASES = new Set([
  'reference_mid_price',
  'reference_ask_price',
  'user_cash_budget',
  'expected_execution_consideration',
  'observed_execution_consideration'
]);
const LAYER_ORDER = [
  'input_validity',
  'scope_limit',
  'snapshot_integrity',
  'data_quality',
  'friction_geometry',
  'edge_survival',
  'capital_feasibility',
  'execution_cost',
  'user_constraint'
];
const ALIGNMENT_FIELDS = [
  'instrument_scope',
  'venue_scope',
  'direction',
  'operation_scope',
  'entry_rule_id',
  'exit_rule_id',
  'signal_timing',
  'holding_horizon_definition',
  'return_denominator',
  'price_basis',
  'currency_basis',
  'fx_treatment',
  'gross_or_net_basis',
  'cost_exclusions',
  'estimator',
  'sample_start',
  'sample_end',
  'observation_count',
  'strategy_rule_version'
];

function normalizeNumber(value) {
  return Object.is(value, -0) ? 0 : value;
}

function close(a, b) {
  return capitalEfficiency.close(a, b);
}

function finiteNumber(value, options) {
  const opts = Object.assign({ required: true, min: -Infinity, max: Infinity, integer: false }, options || {});
  if (value === null || value === undefined) {
    return { ok: !opts.required, missing: true, value: null, reason: 'missing' };
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { ok: false, missing: false, value: null, reason: 'not_finite_number' };
  }
  if (opts.integer && !Number.isInteger(value)) {
    return { ok: false, missing: false, value: null, reason: 'not_integer' };
  }
  if (value < opts.min || value > opts.max) {
    return { ok: false, missing: false, value: null, reason: 'out_of_range' };
  }
  return { ok: true, missing: false, value: normalizeNumber(value), reason: null };
}

function canonicalize(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('canonical_non_finite_number');
    return normalizeNumber(value);
  }
  if (value === undefined) return '__explicit_missing__';
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === 'object') {
    const out = {};
    Object.keys(value).sort().forEach((key) => {
      out[key] = canonicalize(value[key]);
    });
    return out;
  }
  throw new Error('canonical_unsupported_type');
}

function canonicalStringify(value) {
  return JSON.stringify(canonicalize(value));
}

function sha256(value) {
  return crypto.createHash('sha256').update(canonicalStringify(value), 'utf8').digest('hex');
}

function omitKeys(value, keys) {
  const out = {};
  Object.keys(value || {}).forEach((key) => {
    if (!keys.has(key)) out[key] = value[key];
  });
  return out;
}

function finding(code, layer, status, materiality, details) {
  const extra = details || {};
  return {
    findingId: `${layer}:${code}`,
    findingCode: code,
    layer,
    status,
    materiality,
    condition: extra.condition || null,
    observedValue: extra.observedValue === undefined ? null : normalizeNumber(extra.observedValue),
    thresholdValue: extra.thresholdValue === undefined ? null : normalizeNumber(extra.thresholdValue),
    unit: extra.unit || null,
    basis: extra.basis || null,
    provenance: extra.provenance || null,
    snapshotId: null,
    dependsOn: Array.isArray(extra.dependsOn) ? extra.dependsOn.slice() : [],
    resolutionCondition: extra.resolutionCondition || null,
    limitations: Array.isArray(extra.limitations) ? extra.limitations.slice() : []
  };
}

function sortFindings(items) {
  return items.slice().sort((a, b) => {
    const layer = LAYER_ORDER.indexOf(a.layer) - LAYER_ORDER.indexOf(b.layer);
    return layer || a.findingCode.localeCompare(b.findingCode);
  });
}

function validateDomain(input) {
  const unsupported = [];
  if (input.accountModel !== 'cash_account') unsupported.push('account_model');
  if (input.positionModel !== 'long_cash_purchase') unsupported.push('position_model');
  if (!SUPPORTED_INSTRUMENTS.has(input.instrumentType)) unsupported.push('instrument_type');
  if (input.side !== 'long') unsupported.push('side');
  if (input.accountCurrency !== 'EUR') unsupported.push('account_currency');
  if (!SUPPORTED_PROVENANCE.has(input.provenance)) unsupported.push('provenance');
  return unsupported;
}

function assessAlignment(input) {
  const hasPoint = input.grossEdgeRate !== null && input.grossEdgeRate !== undefined;
  const rangeValues = [input.grossEdgeLowRate, input.grossEdgeBaseRate, input.grossEdgeHighRate];
  const hasRange = rangeValues.some((value) => value !== null && value !== undefined);
  if (!hasPoint && !hasRange) return { supplied: false, state: 'not_applicable', reasons: [] };

  const alignment = input.grossEdgeAlignment || {};
  const statuses = alignment.fieldStatuses || {};
  const key = alignment.key || {};
  const reasons = [];
  ALIGNMENT_FIELDS.forEach((field) => {
    if (!['aligned', 'not_applicable'].includes(statuses[field])) reasons.push(field);
  });

  if (key.instrumentId !== input.instrumentId) reasons.push('instrument_scope');
  if (key.venueId !== input.venueId) reasons.push('venue_scope');
  if (key.direction !== input.side) reasons.push('direction');
  if (key.operationScope !== input.operationScope) reasons.push('operation_scope');
  if (typeof key.entryRuleId !== 'string' || !key.entryRuleId) reasons.push('entry_rule_id');
  if (input.operationScope === 'complete_round_trip' && (typeof key.exitRuleId !== 'string' || !key.exitRuleId)) reasons.push('exit_rule_id');
  if (typeof key.signalTiming !== 'string' || !key.signalTiming) reasons.push('signal_timing');
  if (key.holdingHorizonDefinition !== input.holdingHorizonDefinition) reasons.push('holding_horizon_definition');
  if (key.returnDenominator !== 'entry_notional') reasons.push('return_denominator');
  if (!['frictionless_mid_to_mid', 'reference_mid_to_mid'].includes(key.priceBasis) && !alignment.reconstructionVersion) {
    reasons.push('price_basis');
  }
  if (key.currencyBasis !== 'account_currency' || key.accountCurrency !== input.accountCurrency) reasons.push('currency_basis');
  if (key.fxTreatment !== 'excluded' && !alignment.reconciliationVersion) reasons.push('fx_treatment');
  if (typeof key.estimator !== 'string' || !key.estimator) reasons.push('estimator');
  if (key.estimator === 'user_assumption') {
    if (key.sampleStart !== 'not_applicable' || key.sampleEnd !== 'not_applicable' || key.observationCount !== 'not_applicable') {
      reasons.push('sample_period');
    }
  } else {
    if (typeof key.sampleStart !== 'string' || typeof key.sampleEnd !== 'string') reasons.push('sample_period');
    if (!Number.isInteger(key.observationCount) || key.observationCount <= 0) reasons.push('observation_count');
  }
  if (typeof key.strategyRuleVersion !== 'string' || !key.strategyRuleVersion) reasons.push('strategy_rule_version');

  if (key.priceBasis === 'observed_execution_to_execution' && !alignment.reconstructionVersion) {
    reasons.push('executed_price_without_reconstruction');
  }
  if (key.grossOrNetBasis !== 'gross_before_all_modelled_costs' && !alignment.reconciliationVersion) {
    reasons.push('gross_or_net_basis');
  }
  const exclusions = new Set(key.costExclusions || []);
  ['commission', 'fx', 'spread', 'slippage'].forEach((cost) => {
    if (!exclusions.has(cost) && !alignment.reconciliationVersion) reasons.push(`cost_exclusion:${cost}`);
  });
  return {
    supplied: true,
    state: reasons.length ? 'edge_misaligned' : 'edge_aligned',
    reasons: Array.from(new Set(reasons)).sort()
  };
}

function computeFriction(input, alignment, errors) {
  const cost = input.cost || {};
  const classified = {
    orderNotionalEur: finiteNumber(input.orderNotionalEur, { min: Number.MIN_VALUE }),
    sideCount: finiteNumber(cost.sideCount, { min: 1, max: 2, integer: true }),
    commissionPerSideEur: finiteNumber(cost.commissionPerSideEur, { required: false, min: 0 }),
    fxRatePerSide: finiteNumber(cost.fxRatePerSide, { required: false, min: 0, max: 1 }),
    spreadTotalRate: finiteNumber(cost.spreadTotalRate, { required: false, min: 0, max: 1 }),
    slippageTotalRate: finiteNumber(cost.slippageTotalRate, { required: false, min: 0, max: 1 })
  };

  Object.entries(classified).forEach(([key, item]) => {
    if (!item.ok) errors[`cost.${key}`] = item.reason;
  });
  if (Object.keys(errors).length) return { complete: false, classified, missing: [], result: null };

  const missing = ['commissionPerSideEur', 'fxRatePerSide', 'spreadTotalRate', 'slippageTotalRate']
    .filter((key) => classified[key].missing);
  const N = classified.orderNotionalEur.value;
  const k = classified.sideCount.value;
  const knownFixed = classified.commissionPerSideEur.missing ? 0 : k * classified.commissionPerSideEur.value;
  const knownVariableRate =
    (classified.fxRatePerSide.missing ? 0 : k * classified.fxRatePerSide.value) +
    (classified.spreadTotalRate.missing ? 0 : classified.spreadTotalRate.value) +
    (classified.slippageTotalRate.missing ? 0 : classified.slippageTotalRate.value);
  const knownCostEur = knownFixed + N * knownVariableRate;

  if (missing.length) {
    return {
      complete: false,
      classified,
      missing,
      knownCostEur: normalizeNumber(knownCostEur),
      knownFixedCostEur: normalizeNumber(knownFixed),
      knownVariableRate: normalizeNumber(knownVariableRate),
      result: null
    };
  }

  const edgeInput = alignment.state === 'edge_aligned' ? {
    grossEdgeRate: input.grossEdgeRate,
    grossEdgeLowRate: input.grossEdgeLowRate,
    grossEdgeBaseRate: input.grossEdgeBaseRate,
    grossEdgeHighRate: input.grossEdgeHighRate
  } : {};
  const result = capitalEfficiency.compute(Object.assign({
    capitalEur: null,
    orderNotionalEur: N,
    sideCount: k,
    monthlyOperations: null,
    commissionPerSideEur: classified.commissionPerSideEur.value,
    fxRatePerSide: classified.fxRatePerSide.value,
    spreadTotalRate: classified.spreadTotalRate.value,
    slippageTotalRate: classified.slippageTotalRate.value,
    retentionTargetRate: null,
    annualDragBudgetRate: null,
    targetNetRate: null,
    provenance: input.provenance
  }, edgeInput));
  if (!result.ok) Object.assign(errors, result.errors);
  return { complete: result.ok, classified, missing: [], knownCostEur, result };
}

function computeCash(input, errors) {
  if (!input.cash) return { assessed: false, status: 'not_assessed' };
  const cash = input.cash;
  if (!NOTIONAL_BASES.has(cash.notionalBasis)) errors['cash.notionalBasis'] = 'unsupported_or_missing';
  if (!PRICE_INCLUSION.has(cash.spreadReferencePriceStatus)) errors['cash.spreadReferencePriceStatus'] = 'invalid';
  if (!PRICE_INCLUSION.has(cash.slippageReferencePriceStatus)) errors['cash.slippageReferencePriceStatus'] = 'invalid';
  const numericFields = [
    'entryAssetConsiderationEur',
    'entryCommissionEur',
    'entryContractualFeesEur',
    'entryTaxEur',
    'entryFxCashCostEur',
    'userDefinedExecutionCashBufferEur',
    'entrySpreadCashEur',
    'entrySlippageCashEur',
    'availableSettledCashEur',
    'userDefinedCashReserveEur',
    'strategyCapitalEur',
    'strategyCapitalCommittedEur'
  ];
  const values = {};
  numericFields.forEach((key) => {
    const required = ['entryAssetConsiderationEur', 'availableSettledCashEur', 'strategyCapitalEur', 'strategyCapitalCommittedEur'].includes(key);
    const item = finiteNumber(cash[key], { required, min: 0 });
    if (!item.ok) errors[`cash.${key}`] = item.reason;
    values[key] = item.missing ? 0 : item.value;
  });
  if (Object.keys(errors).length) return { assessed: true, status: 'invalid' };

  if (cash.spreadReferencePriceStatus === 'included' && values.entrySpreadCashEur !== 0) {
    return { assessed: true, status: 'cash_basis_conflicted', reason: 'spread_counted_twice' };
  }
  if (cash.slippageReferencePriceStatus === 'included' && values.entrySlippageCashEur !== 0) {
    return { assessed: true, status: 'cash_basis_conflicted', reason: 'slippage_counted_twice' };
  }

  const quantity = finiteNumber(input.orderQuantity, { required: false, min: Number.MIN_VALUE });
  const price = finiteNumber(input.referencePriceEur, { required: false, min: Number.MIN_VALUE });
  if (!quantity.ok) errors.orderQuantity = quantity.reason;
  if (!price.ok) errors.referencePriceEur = price.reason;
  if (quantity.missing !== price.missing) errors.quantityPrice = 'pair_incomplete';
  if (!quantity.missing && !price.missing && !close(quantity.value * price.value, values.entryAssetConsiderationEur)) {
    return { assessed: true, status: 'cash_basis_conflicted', reason: 'quantity_price_notional_mismatch' };
  }

  const holds = Array.isArray(cash.holds) ? cash.holds : [];
  const ids = new Set();
  let deductibleHoldsEur = 0;
  let strategyIncludedHoldsEur = 0;
  let userReserveHoldEur = 0;
  for (const hold of holds) {
    if (!hold || typeof hold.holdId !== 'string' || !hold.holdId) {
      errors['cash.holds'] = 'hold_id_missing';
      continue;
    }
    if (ids.has(hold.holdId)) errors[`cash.holds.${hold.holdId}`] = 'duplicate_hold_id';
    ids.add(hold.holdId);
    if (!['pending_order', 'open_position', 'other_strategy', 'user_reserve'].includes(hold.holdType)) {
      errors[`cash.holds.${hold.holdId}.holdType`] = 'unsupported_hold_type';
    }
    const amount = finiteNumber(hold.amountEur, { min: 0 });
    if (!amount.ok) errors[`cash.holds.${hold.holdId}.amountEur`] = amount.reason;
    if (typeof hold.includedInAvailableSettledCash !== 'boolean') {
      errors[`cash.holds.${hold.holdId}.includedInAvailableSettledCash`] = 'boolean_required';
    }
    if (typeof hold.includedInStrategyCapitalCommitted !== 'boolean') {
      errors[`cash.holds.${hold.holdId}.includedInStrategyCapitalCommitted`] = 'boolean_required';
    }
    if (amount.ok && hold.holdType === 'user_reserve') userReserveHoldEur += amount.value;
    if (amount.ok && hold.holdType !== 'user_reserve' && !hold.includedInAvailableSettledCash) {
      deductibleHoldsEur += amount.value;
    }
    if (amount.ok && hold.includedInStrategyCapitalCommitted) strategyIncludedHoldsEur += amount.value;
  }
  if (!['gross_before_declared_holds', 'net_of_listed_holds'].includes(cash.availableSettledCashBasis)) {
    errors['cash.availableSettledCashBasis'] = 'unsupported_or_missing';
  }
  if (userReserveHoldEur > 0 && !close(userReserveHoldEur, values.userDefinedCashReserveEur)) {
    errors['cash.userDefinedCashReserveEur'] = 'user_reserve_ledger_mismatch';
  }
  if (strategyIncludedHoldsEur > values.strategyCapitalCommittedEur && !close(strategyIncludedHoldsEur, values.strategyCapitalCommittedEur)) {
    errors['cash.strategyCapitalCommittedEur'] = 'strategy_hold_reconciliation_failed';
  }
  if (Object.keys(errors).length) return { assessed: true, status: 'invalid' };
  if (cash.spreadReferencePriceStatus === 'unknown' || cash.slippageReferencePriceStatus === 'unknown') {
    return { assessed: true, status: 'cash_basis_conflicted', reason: 'price_inclusion_unknown' };
  }

  const entryCashRequirementEur =
    values.entryAssetConsiderationEur +
    values.entryCommissionEur +
    values.entryContractualFeesEur +
    values.entryTaxEur +
    values.entryFxCashCostEur +
    values.userDefinedExecutionCashBufferEur +
    (cash.spreadReferencePriceStatus === 'excluded' ? values.entrySpreadCashEur : 0) +
    (cash.slippageReferencePriceStatus === 'excluded' ? values.entrySlippageCashEur : 0);
  const accountFreeSettledCashEur =
    values.availableSettledCashEur - deductibleHoldsEur - values.userDefinedCashReserveEur;
  const strategyAllocationHeadroomEur = values.strategyCapitalEur - values.strategyCapitalCommittedEur;
  const capitalFeasibilityCashEur = Math.min(accountFreeSettledCashEur, strategyAllocationHeadroomEur);
  const feasible = entryCashRequirementEur <= capitalFeasibilityCashEur || close(entryCashRequirementEur, capitalFeasibilityCashEur);

  return {
    assessed: true,
    status: feasible ? 'feasible_within_declared_strategy_cash' : 'insufficient_declared_strategy_cash',
    entryCashRequirementEur: normalizeNumber(entryCashRequirementEur),
    deductibleHoldsEur: normalizeNumber(deductibleHoldsEur),
    strategyIncludedHoldsEur: normalizeNumber(strategyIncludedHoldsEur),
    accountFreeSettledCashEur: normalizeNumber(accountFreeSettledCashEur),
    strategyAllocationHeadroomEur: normalizeNumber(strategyAllocationHeadroomEur),
    capitalFeasibilityCashEur: normalizeNumber(capitalFeasibilityCashEur),
    uniqueHoldIds: ids.size === holds.length,
    holds: canonicalize(holds)
  };
}

function assessSources(input, errors) {
  const sources = Array.isArray(input.sources) ? input.sources : [];
  if (!sources.length) {
    return { status: 'manual_assumptions_only', sources: [], stale: [], conflicts: [] };
  }
  const utcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
  const evaluatedAt = Date.parse(input.evaluatedAtUtc || '');
  if (!utcPattern.test(input.evaluatedAtUtc || '') || !Number.isFinite(evaluatedAt)) {
    errors.evaluatedAtUtc = 'valid_utc_timestamp_required';
  }
  const stale = [];
  const criticalStale = [];
  const conflicts = [];
  sources.forEach((source, index) => {
    if (!source || source.provenance !== 'synthetic_demo') {
      errors[`sources.${index}.provenance`] = 'external_source_forbidden';
      return;
    }
    const observed = Date.parse(source.observedAtUtc || '');
    const validUntil = Date.parse(source.validUntilUtc || '');
    if (!utcPattern.test(source.observedAtUtc || '') || !utcPattern.test(source.validUntilUtc || '') || !Number.isFinite(observed) || !Number.isFinite(validUntil)) {
      errors[`sources.${index}.timestamp`] = 'valid_utc_timestamp_required';
      return;
    }
    if (observed > validUntil) {
      errors[`sources.${index}.validUntilUtc`] = 'validity_precedes_observation';
      return;
    }
    if (Number.isFinite(evaluatedAt) && evaluatedAt > validUntil) {
      const sourceId = source.sourceId || `source-${index}`;
      stale.push(sourceId);
      if (source.critical !== false) criticalStale.push(sourceId);
    }
    if (source.instrumentId && source.instrumentId !== input.instrumentId) conflicts.push('instrument_id');
    if (source.venueId && source.venueId !== input.venueId) conflicts.push('venue_id');
    if (source.quoteCurrency && source.quoteCurrency !== input.quoteCurrency) conflicts.push('quote_currency');
  });
  return {
    status: conflicts.length ? 'snapshot_conflicted' : criticalStale.length ? 'snapshot_expired' : 'snapshot_current',
    sources: canonicalize(sources),
    stale: Array.from(new Set(stale)).sort(),
    criticalStale: Array.from(new Set(criticalStale)).sort(),
    conflicts: Array.from(new Set(conflicts)).sort()
  };
}

function buildSnapshot(input, sourceAssessment) {
  const volatile = new Set(['snapshotInstanceId', 'createdAtUtc', 'calculatedAtUtc', 'evaluatedAtUtc', 'sources']);
  const scenarioPayload = {
    accountModel: input.accountModel,
    positionModel: input.positionModel,
    instrumentType: input.instrumentType,
    instrumentId: input.instrumentId,
    venueId: input.venueId,
    side: input.side,
    operationScope: input.operationScope,
    orderType: input.orderType,
    orderQuantity: input.orderQuantity,
    referencePriceEur: input.referencePriceEur,
    orderNotionalEur: input.orderNotionalEur,
    accountCurrency: input.accountCurrency,
    quoteCurrency: input.quoteCurrency
  };
  const inputPayload = omitKeys(input, volatile);
  const scenarioHash = sha256(scenarioPayload);
  const inputHash = sha256(inputPayload);
  const sourceBundleHash = sha256(sourceAssessment.sources);
  const versions = {
    gatePolicyVersion: POLICY_VERSION,
    costEngineVersion: capitalEfficiency.VERSION,
    edgeEngineVersion: capitalEfficiency.VERSION,
    capitalEngineVersion: VERSION,
    dataQualityVersion: SNAPSHOT_VERSION,
    findingsCatalogVersion: FINDINGS_CATALOG_VERSION,
    grossEdgeAlignmentVersion: ALIGNMENT_VERSION
  };
  const snapshotContentHash = sha256({ scenarioHash, inputHash, sourceBundleHash, versions });
  return {
    snapshotId: snapshotContentHash,
    snapshotInstanceId: input.snapshotInstanceId || 'instance_not_provided',
    createdAtUtc: input.createdAtUtc || null,
    calculatedAtUtc: input.calculatedAtUtc || null,
    expiresAtUtc: sourceAssessment.sources.length
      ? sourceAssessment.sources.slice().sort((a, b) => Date.parse(a.validUntilUtc) - Date.parse(b.validUntilUtc))[0].validUntilUtc
      : 'no_automatic_expiry',
    scenarioHash,
    inputHash,
    sourceBundleHash,
    snapshotContentHash,
    status: sourceAssessment.status,
    versions
  };
}

function edgeFinding(input, alignment, friction) {
  if (!alignment.supplied) {
    return finding('gross_edge_not_provided', 'edge_survival', 'not_assessed', 'informational', {
      provenance: input.provenance,
      limitations: ['break_even_only']
    });
  }
  if (alignment.state !== 'edge_aligned') {
    return finding('gross_edge_basis_mismatch', 'edge_survival', 'invalid', 'blocking', {
      provenance: input.provenance,
      dependsOn: alignment.reasons,
      resolutionCondition: 'provide_aligned_gross_edge_definition'
    });
  }
  if (!friction.complete || !friction.result) {
    return finding('complete_friction_required_for_edge', 'edge_survival', 'insufficient_data', 'blocking', {
      dependsOn: friction.missing,
      provenance: input.provenance
    });
  }

  const results = friction.result.results;
  const floor = results.variableFloorRate.value;
  const threshold = results.breakEvenGrossRate.value;
  if (friction.result.edgeMode === 'point_estimate') {
    const gross = input.grossEdgeRate;
    const net = results.netEdgeRate.value;
    if (gross < floor || close(gross, floor)) {
      return finding('gross_edge_not_above_variable_floor', 'edge_survival', 'structurally_unreachable', 'blocking', {
        observedValue: gross,
        thresholdValue: floor,
        unit: 'decimal_rate',
        provenance: input.provenance
      });
    }
    if (gross < threshold || close(gross, threshold)) {
      return finding(close(gross, threshold) ? 'no_strictly_positive_margin' : 'gross_edge_does_not_cover_friction', 'edge_survival', 'breached', 'material', {
        observedValue: net,
        thresholdValue: 0,
        unit: 'decimal_rate',
        provenance: input.provenance
      });
    }
    return finding('gross_edge_survives_modelled_friction', 'edge_survival', 'satisfied', 'informational', {
      observedValue: net,
      thresholdValue: 0,
      unit: 'decimal_rate',
      provenance: input.provenance
    });
  }

  const range = results.edgeRange;
  if (range.variableFloorState === 'structurally_unreachable_full_range') {
    return finding('gross_edge_range_not_above_variable_floor', 'edge_survival', 'structurally_unreachable', 'blocking', {
      observedValue: input.grossEdgeHighRate,
      thresholdValue: floor,
      unit: 'decimal_rate',
      provenance: input.provenance
    });
  }
  if (range.rangeState === 'survives_full_range') {
    return finding('gross_edge_range_survives_modelled_friction', 'edge_survival', 'satisfied', 'informational', {
      observedValue: input.grossEdgeLowRate,
      thresholdValue: threshold,
      unit: 'decimal_rate',
      provenance: input.provenance
    });
  }
  return finding(range.rangeState === 'fails_full_range' ? 'gross_edge_range_has_no_positive_margin' : 'gross_edge_range_crosses_break_even', 'edge_survival', 'breached', 'material', {
    observedValue: input.grossEdgeHighRate,
    thresholdValue: threshold,
    unit: 'decimal_rate',
    provenance: input.provenance
  });
}

function constraintFindings(input) {
  const constraints = Array.isArray(input.userConstraints) ? input.userConstraints : [];
  return constraints.map((constraint, index) => {
    const observed = finiteNumber(constraint.observedValue, { required: true });
    const limit = finiteNumber(constraint.limitValue, { required: true });
    if (!observed.ok || !limit.ok || constraint.operator !== 'lte') {
      return finding(`constraint_${index}_invalid`, 'user_constraint', 'invalid', 'blocking', {
        provenance: 'user_assumption'
      });
    }
    const satisfied = observed.value < limit.value || close(observed.value, limit.value);
    return finding(constraint.constraintId || `constraint_${index}`, 'user_constraint', satisfied ? 'satisfied' : 'breached', satisfied ? 'informational' : 'material', {
      observedValue: observed.value,
      thresholdValue: limit.value,
      unit: constraint.unit || null,
      basis: 'explicit_user_constraint',
      provenance: 'user_assumption'
    });
  });
}

function deriveSummary(findings, snapshot, friction, cash) {
  const has = (predicate) => findings.some(predicate);
  if (has((item) => item.layer === 'input_validity' && item.status === 'invalid')) return 'invalid_input';
  if (has((item) => item.layer === 'scope_limit' && item.status === 'unsupported')) return 'unsupported_scope';
  if (['snapshot_expired', 'snapshot_conflicted', 'snapshot_temporally_inconsistent', 'snapshot_incomplete'].includes(snapshot.status)) {
    return 'snapshot_unusable';
  }
  if (has((item) => item.status === 'structurally_unreachable')) return 'structurally_non_viable';
  if (has((item) => item.layer === 'capital_feasibility' && item.status === 'breached')) return 'capital_not_feasible';
  if (has((item) => item.layer === 'execution_cost' && item.status === 'breached')) return 'execution_cost_risk';
  if (has((item) => item.layer === 'user_constraint' && item.status === 'breached')) return 'constraint_breach';
  if (has((item) => item.layer === 'edge_survival' && item.status === 'breached')) return 'constraint_breach';
  if (has((item) => ['invalid', 'conflicted', 'insufficient_data', 'expired', 'obsolete'].includes(item.status))) return 'insufficient_data';

  const edgeSatisfied = has((item) => item.layer === 'edge_survival' && item.status === 'satisfied');
  const capitalSatisfied = has((item) => item.layer === 'capital_feasibility' && item.status === 'satisfied');
  if (friction.complete && cash.assessed && edgeSatisfied && capitalSatisfied) {
    return 'no_incompatibility_detected_under_assumptions';
  }
  return 'insufficient_data';
}

function compute(inputValue) {
  const input = inputValue || {};
  const errors = {};
  const findings = [];
  const unsupported = validateDomain(input);
  if (unsupported.length) {
    findings.push(finding('unsupported_scope', 'scope_limit', 'unsupported', 'blocking', {
      dependsOn: unsupported,
      provenance: input.provenance || null,
      limitations: ['cash_account_long_spot_equity_or_etf_only']
    }));
  }

  const alignment = assessAlignment(input);
  const friction = unsupported.length ? { complete: false, missing: [], result: null } : computeFriction(input, alignment, errors);
  const cash = unsupported.length ? { assessed: false, status: 'unsupported_capital_model' } : computeCash(input, errors);
  const sourceAssessment = assessSources(input, errors);

  Object.entries(errors).forEach(([key, reason]) => {
    findings.push(finding(`invalid_${key}`, 'input_validity', 'invalid', 'blocking', {
      condition: reason,
      provenance: input.provenance || null
    }));
  });

  let snapshot;
  try {
    snapshot = buildSnapshot(input, sourceAssessment);
  } catch (error) {
    findings.push(finding('snapshot_serialization_failed', 'snapshot_integrity', 'invalid', 'blocking', {
      condition: error.message
    }));
    snapshot = {
      snapshotId: null,
      snapshotInstanceId: input.snapshotInstanceId || 'instance_not_provided',
      status: 'snapshot_incomplete',
      versions: {}
    };
  }

  if (sourceAssessment.status === 'manual_assumptions_only') {
    findings.push(finding('external_market_data_not_assessed', 'data_quality', 'not_assessed', 'informational', {
      provenance: input.provenance,
      limitations: ['no_current_market_claim']
    }));
  } else if (sourceAssessment.stale.length) {
    findings.push(finding('synthetic_source_stale', 'data_quality', 'expired', 'blocking', {
      dependsOn: sourceAssessment.stale,
      provenance: 'synthetic_demo'
    }));
  } else if (sourceAssessment.status === 'snapshot_conflicted') {
    findings.push(finding('instrument_venue_currency_mismatch', 'data_quality', 'conflicted', 'blocking', {
      dependsOn: sourceAssessment.conflicts,
      provenance: 'synthetic_demo'
    }));
  } else {
    findings.push(finding('synthetic_sources_current_for_evaluation_time', 'data_quality', 'satisfied', 'informational', {
      provenance: 'synthetic_demo',
      limitations: ['synthetic_only']
    }));
  }

  if (friction.complete && friction.result) {
    findings.push(finding('complete_friction_geometry_calculated', 'friction_geometry', 'satisfied', 'informational', {
      observedValue: friction.result.results.breakEvenGrossRate.value,
      unit: 'decimal_rate',
      provenance: input.provenance
    }));
  } else if (!unsupported.length) {
    findings.push(finding('friction_components_missing', 'friction_geometry', 'insufficient_data', 'blocking', {
      observedValue: friction.knownCostEur,
      unit: 'EUR_known_components_only',
      dependsOn: friction.missing || [],
      provenance: input.provenance
    }));
  }

  if (!unsupported.length) findings.push(edgeFinding(input, alignment, friction));

  if (!cash.assessed) {
    findings.push(finding('capital_not_provided', 'capital_feasibility', 'not_assessed', 'informational', {
      provenance: input.provenance
    }));
  } else if (cash.status === 'cash_basis_conflicted') {
    findings.push(finding('cash_basis_conflicted', 'capital_feasibility', 'conflicted', 'blocking', {
      condition: cash.reason,
      provenance: input.provenance
    }));
  } else if (cash.status === 'feasible_within_declared_strategy_cash') {
    findings.push(finding('entry_cash_within_capital_feasibility_cash', 'capital_feasibility', 'satisfied', 'informational', {
      observedValue: cash.entryCashRequirementEur,
      thresholdValue: cash.capitalFeasibilityCashEur,
      unit: 'EUR',
      provenance: input.provenance
    }));
  } else if (cash.status === 'insufficient_declared_strategy_cash') {
    findings.push(finding('entry_cash_requirement_exceeds_capital_feasibility_cash', 'capital_feasibility', 'breached', 'blocking', {
      observedValue: cash.entryCashRequirementEur,
      thresholdValue: cash.capitalFeasibilityCashEur,
      unit: 'EUR',
      provenance: input.provenance
    }));
  }

  findings.push(finding('execution_liquidity_not_assessed', 'execution_cost', 'not_assessed', 'informational', {
    provenance: input.provenance,
    limitations: ['no_execution_probability', 'no_current_depth']
  }));
  findings.push(...constraintFindings(input));

  const ordered = sortFindings(findings).map((item) => Object.assign({}, item, { snapshotId: snapshot.snapshotId }));
  const summaryCode = deriveSummary(ordered, snapshot, friction, cash);
  const primaryFactor = ordered.find((item) => {
    if (summaryCode === 'unsupported_scope') return item.layer === 'scope_limit';
    if (summaryCode === 'snapshot_unusable') return item.layer === 'data_quality' || item.layer === 'snapshot_integrity';
    if (summaryCode === 'structurally_non_viable') return item.status === 'structurally_unreachable';
    if (summaryCode === 'capital_not_feasible') return item.layer === 'capital_feasibility' && item.status === 'breached';
    if (summaryCode === 'constraint_breach') return item.status === 'breached';
    if (summaryCode === 'invalid_input') return item.layer === 'input_validity';
    if (summaryCode === 'insufficient_data') return ['invalid', 'conflicted', 'insufficient_data', 'not_assessed'].includes(item.status);
    return item.status === 'satisfied';
  }) || null;

  const invariants = {
    finiteOutput: true,
    snapshotIdMatchesContentHash: snapshot.snapshotId === snapshot.snapshotContentHash,
    cashCeilingNotAboveAccount: !cash.assessed || cash.capitalFeasibilityCashEur === undefined || cash.capitalFeasibilityCashEur <= cash.accountFreeSettledCashEur || close(cash.capitalFeasibilityCashEur, cash.accountFreeSettledCashEur),
    cashCeilingNotAboveStrategy: !cash.assessed || cash.capitalFeasibilityCashEur === undefined || cash.capitalFeasibilityCashEur <= cash.strategyAllocationHeadroomEur || close(cash.capitalFeasibilityCashEur, cash.strategyAllocationHeadroomEur),
    uniqueHoldIds: !cash.assessed || cash.uniqueHoldIds !== false,
    findingsStableOrder: ordered.every((item, index) => index === 0 || LAYER_ORDER.indexOf(ordered[index - 1].layer) <= LAYER_ORDER.indexOf(item.layer)),
    capitalEfficiencyInvariants: !friction.result || !friction.result.invariants || Object.values(friction.result.invariants).filter((value) => value !== null).every(Boolean)
  };

  const result = {
    ok: !ordered.some((item) => item.layer === 'input_validity' && item.status === 'invalid'),
    version: VERSION,
    policyVersion: POLICY_VERSION,
    scope: {
      supported: unsupported.length === 0,
      unsupportedFields: unsupported
    },
    snapshot,
    alignment,
    friction: friction.complete && friction.result ? {
      complete: true,
      fixedCostEur: friction.result.results.fixedCostEur.value,
      variableFloorRate: friction.result.results.variableFloorRate.value,
      lifecycleFrictionEur: friction.result.results.totalCostEur.value,
      breakEvenGrossRate: friction.result.results.breakEvenGrossRate.value,
      edgeMode: friction.result.edgeMode,
      edgeResults: friction.result.results
    } : {
      complete: false,
      knownCostEur: friction.knownCostEur === undefined ? null : friction.knownCostEur,
      missingComponents: friction.missing || []
    },
    cash,
    findings: ordered,
    primaryFactor,
    summaryCode,
    unassessedLayers: Array.from(new Set(ordered.filter((item) => item.status === 'not_assessed').map((item) => item.layer))),
    invariants,
    limitations: [
      'synthetic_or_manual_only',
      'no_market_data_claim',
      'no_execution',
      'no_recommendation',
      'cash_long_spot_equity_or_etf_only'
    ]
  };
  assertFiniteTree(result);
  return result;
}

function compareSnapshots(previousResult, currentResult) {
  const same = Boolean(
    previousResult && currentResult &&
    previousResult.snapshot && currentResult.snapshot &&
    previousResult.snapshot.snapshotId &&
    previousResult.snapshot.snapshotId === currentResult.snapshot.snapshotId
  );
  return {
    sameContent: same,
    oldSnapshot: same ? 'active' : 'obsolete',
    oldFindingsActive: same
  };
}

function assertFiniteTree(value, path) {
  const location = path || 'root';
  if (typeof value === 'number' && (!Number.isFinite(value) || Object.is(value, -0))) {
    throw new Error(`invalid_numeric_value:${location}`);
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertFiniteTree(item, `${location}[${index}]`));
  } else if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => assertFiniteTree(value[key], `${location}.${key}`));
  }
  return true;
}

module.exports = {
  VERSION,
  POLICY_VERSION,
  SNAPSHOT_VERSION,
  ALIGNMENT_VERSION,
  FINDINGS_CATALOG_VERSION,
  TOLERANCE,
  ALIGNMENT_FIELDS,
  canonicalStringify,
  sha256,
  close,
  compute,
  compareSnapshots,
  assertFiniteTree
};
