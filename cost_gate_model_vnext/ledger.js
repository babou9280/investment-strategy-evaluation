'use strict';

const crypto = require('crypto');

const VERSION = 'cost-ledger-engine-1-synthetic';
const SCHEMA_VERSION = 'cost-ledger-1';
const LEGACY_POLICY_VERSION = 'legacy-four-costs-1';
const TOLERANCE = 1e-12;

const ROOT_KEYS = new Set([
  'schemaVersion',
  'ledgerId',
  'operationScope',
  'accountCurrency',
  'quoteCurrency',
  'scenarioContext',
  'returnDenominator',
  'basisValues',
  'coverage',
  'components'
]);
const COMPONENT_KEYS = new Set([
  'componentId',
  'economicEventId',
  'category',
  'lifecycleScope',
  'side',
  'calculationKind',
  'calculationBasis',
  'parameters',
  'amountCurrency',
  'signConvention',
  'notionalScaling',
  'benchmark',
  'priceInclusion',
  'edgeInclusion',
  'cashSourceInclusion',
  'provenance',
  'sourceId',
  'temporalStatus',
  'observedAtUtc',
  'validUntilUtc',
  'uncertainty',
  'modelVersion',
  'dependencies',
  'inputStatus',
  'evidenceStatus',
  'limitations'
]);
const RETURN_DENOMINATOR_KEYS = new Set(['basis', 'amount', 'currency']);
const SCENARIO_CONTEXT_KEYS = new Set([
  'instrumentId',
  'venueId',
  'direction',
  'operationScope',
  'holdingHorizonDefinition',
  'accountCurrency',
  'quoteCurrency'
]);
const BASIS_VALUE_KEYS = new Set(['amount', 'currency']);
const COVERAGE_KEYS = new Set([
  'declaration',
  'policyId',
  'expectedEconomicEventIds',
  'notApplicableCategories',
  'limitations'
]);
const BENCHMARK_KEYS = new Set(['kind', 'price', 'currency', 'observedAtUtc', 'sourceId', 'status']);
const UNCERTAINTY_KEYS = new Set([
  'kind',
  'appliesTo',
  'low',
  'base',
  'high',
  'unit',
  'method',
  'coverage',
  'calibrated',
  'limitations'
]);

const OPERATION_SCOPES = new Set(['entry_leg', 'complete_round_trip']);
const BASIS_NAMES = new Set([
  'entry_notional',
  'exit_notional',
  'entry_asset_consideration'
]);
const SUPPORTED_CATEGORIES = new Set([
  'commission',
  'fx_cost',
  'spread_cost',
  'execution_cost_assumption',
  'entry_contractual_fee',
  'entry_tax'
]);
const RESERVED_CATEGORIES = new Set([
  'venue_fee',
  'clearing_or_settlement_fee',
  'market_impact',
  'delay_cost',
  'opportunity_cost',
  'financing_or_borrow_cost',
  'other_contractual_cost'
]);
const SUPPORTED_CALCULATION_KINDS = new Set(['fixed', 'proportional']);
const RESERVED_CALCULATION_KINDS = new Set([
  'externally_supplied_amount',
  'minimum_or_maximum',
  'tiered',
  'piecewise',
  'nonlinear_model',
  'observed_difference'
]);
const INCLUSION_STATES = new Set(['included', 'excluded', 'not_applicable', 'unknown']);
const SUPPORTED_PROVENANCE = new Set(['contractual_user_input', 'user_assumption', 'synthetic_demo']);
const RESERVED_PROVENANCE = new Set(['historical_observation', 'external_source', 'model_estimate']);
const TEMPORAL_STATES = new Set([
  'not_time_sensitive',
  'as_of_snapshot',
  'current_until',
  'time_not_assessed',
  'stale',
  'future_timestamp'
]);
const EVIDENCE_BY_PROVENANCE = Object.freeze({
  contractual_user_input: 'contractual_input_unverified',
  user_assumption: 'user_assumption_unverified',
  synthetic_demo: 'synthetic_demo',
  historical_observation: 'historical_observation_unverified',
  external_source: 'external_source_pending_quality_gate',
  model_estimate: 'model_estimate_pending_validation'
});
const INPUT_STATUSES = new Set(['provided', 'not_assessed', 'unsupported_component']);
const BENCHMARK_KINDS = new Set([
  'not_applicable',
  'user_assumption_without_market_benchmark',
  'decision_price',
  'arrival_mid',
  'submission_mid',
  'quoted_bid_or_ask',
  'vwap',
  'closing_price',
  'other_documented'
]);
const UNCERTAINTY_KINDS = new Set(['none_contractual', 'point_assumption', 'sensitivity_range']);
const SCENARIOS = ['low', 'base', 'high'];
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function normalizeNumber(value) {
  return Object.is(value, -0) ? 0 : value;
}

function close(left, right) {
  if (typeof left !== 'number' || typeof right !== 'number') return false;
  if (!Number.isFinite(left) || !Number.isFinite(right)) return false;
  return Math.abs(left - right) <= TOLERANCE * Math.max(1, Math.abs(left), Math.abs(right));
}

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function canonicalize(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('canonical_non_finite_number');
    return normalizeNumber(value);
  }
  if (value === undefined) return '__explicit_missing__';
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (isObject(value)) {
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

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalLedgerPayload(ledger) {
  const payload = canonicalize(ledger);
  if (Array.isArray(payload.components)) {
    payload.components = payload.components
      .map((component) => {
        const normalized = canonicalize(component);
        if (Array.isArray(normalized.dependencies)) normalized.dependencies.sort();
        if (Array.isArray(normalized.limitations)) normalized.limitations.sort();
        if (normalized.uncertainty && Array.isArray(normalized.uncertainty.limitations)) {
          normalized.uncertainty.limitations.sort();
        }
        return normalized;
      })
      .sort((left, right) => compareText(canonicalStringify(left), canonicalStringify(right)));
  }
  if (payload.coverage) {
    ['expectedEconomicEventIds', 'notApplicableCategories', 'limitations'].forEach((key) => {
      if (Array.isArray(payload.coverage[key])) payload.coverage[key].sort();
    });
  }
  return payload;
}

function sha256(value) {
  return crypto.createHash('sha256').update(canonicalStringify(value), 'utf8').digest('hex');
}

function issue(code, severity, path, details) {
  const extra = details || {};
  return {
    code,
    severity,
    path: path || null,
    componentId: extra.componentId || null,
    economicEventId: extra.economicEventId || null,
    details: Array.isArray(extra.details) ? extra.details.slice().sort() : []
  };
}

function sortIssues(issues) {
  return issues.slice().sort((left, right) => {
    const leftKey = [left.path || '', left.code, left.componentId || '', left.economicEventId || ''].join('|');
    const rightKey = [right.path || '', right.code, right.componentId || '', right.economicEventId || ''].join('|');
    return compareText(leftKey, rightKey);
  });
}

function exactKeys(value, allowed, path, issues) {
  if (!isObject(value)) {
    issues.push(issue('object_required', 'blocking', path));
    return false;
  }
  Object.keys(value).forEach((key) => {
    if (!allowed.has(key)) issues.push(issue('unknown_key', 'blocking', `${path}.${key}`));
  });
  return true;
}

function nonEmptyString(value, path, issues) {
  if (typeof value !== 'string' || !value) {
    issues.push(issue('non_empty_string_required', 'blocking', path));
    return false;
  }
  return true;
}

function finiteNonNegative(value, path, issues, options) {
  const opts = Object.assign({ positive: false }, options || {});
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    issues.push(issue('finite_number_required', 'blocking', path));
    return null;
  }
  const normalized = normalizeNumber(value);
  if (normalized < 0 || (opts.positive && normalized <= 0)) {
    issues.push(issue(opts.positive ? 'positive_number_required' : 'non_negative_number_required', 'blocking', path));
    return null;
  }
  return normalized;
}

function stringArray(value, path, issues, options) {
  const opts = Object.assign({ allowEmpty: true }, options || {});
  if (!Array.isArray(value)) {
    issues.push(issue('array_required', 'blocking', path));
    return [];
  }
  if (!opts.allowEmpty && value.length === 0) issues.push(issue('non_empty_array_required', 'blocking', path));
  const seen = new Set();
  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || !entry) {
      issues.push(issue('non_empty_string_required', 'blocking', `${path}.${index}`));
    } else if (seen.has(entry)) {
      issues.push(issue('duplicate_array_value', 'blocking', path, { details: [entry] }));
    } else {
      seen.add(entry);
    }
  });
  return Array.from(seen).sort();
}

function validUtcOrNull(value, path, issues) {
  if (value === null) return true;
  if (typeof value !== 'string' || !ISO_UTC.test(value) || !Number.isFinite(Date.parse(value))) {
    issues.push(issue('valid_utc_or_null_required', 'blocking', path));
    return false;
  }
  return true;
}

function emptyEnvelope() {
  return { low: 0, base: 0, high: 0 };
}

function addEnvelope(target, source) {
  SCENARIOS.forEach((scenario) => {
    target[scenario] = normalizeNumber(target[scenario] + source[scenario]);
  });
  return target;
}

function divideEnvelope(envelope, denominator) {
  return {
    low: normalizeNumber(envelope.low / denominator),
    base: normalizeNumber(envelope.base / denominator),
    high: normalizeNumber(envelope.high / denominator)
  };
}

function rootContext(ledger, issues) {
  if (!exactKeys(ledger, ROOT_KEYS, 'ledger', issues)) return null;
  if (ledger.schemaVersion !== SCHEMA_VERSION) issues.push(issue('unsupported_schema_version', 'blocking', 'ledger.schemaVersion'));
  nonEmptyString(ledger.ledgerId, 'ledger.ledgerId', issues);
  if (!OPERATION_SCOPES.has(ledger.operationScope)) issues.push(issue('unsupported_operation_scope', 'blocking', 'ledger.operationScope'));
  if (ledger.accountCurrency !== 'EUR') issues.push(issue('unsupported_scope', 'blocking', 'ledger.accountCurrency'));
  nonEmptyString(ledger.quoteCurrency, 'ledger.quoteCurrency', issues);

  let scenarioContext = null;
  if (exactKeys(ledger.scenarioContext, SCENARIO_CONTEXT_KEYS, 'ledger.scenarioContext', issues)) {
    ['instrumentId', 'venueId', 'holdingHorizonDefinition'].forEach((key) => {
      nonEmptyString(ledger.scenarioContext[key], `ledger.scenarioContext.${key}`, issues);
    });
    if (ledger.scenarioContext.direction !== 'long') {
      issues.push(issue('unsupported_scenario_direction', 'blocking', 'ledger.scenarioContext.direction'));
    }
    const contextMatches = (
      ledger.scenarioContext.operationScope === ledger.operationScope &&
      ledger.scenarioContext.accountCurrency === ledger.accountCurrency &&
      ledger.scenarioContext.quoteCurrency === ledger.quoteCurrency
    );
    if (!contextMatches) {
      issues.push(issue('scenario_context_root_mismatch', 'blocking', 'ledger.scenarioContext'));
    }
    scenarioContext = ledger.scenarioContext;
  }

  let denominator = null;
  let denominatorBasis = null;
  if (exactKeys(ledger.returnDenominator, RETURN_DENOMINATOR_KEYS, 'ledger.returnDenominator', issues)) {
    if (nonEmptyString(ledger.returnDenominator.basis, 'ledger.returnDenominator.basis', issues)) {
      denominatorBasis = ledger.returnDenominator.basis;
    }
    const amount = finiteNonNegative(ledger.returnDenominator.amount, 'ledger.returnDenominator.amount', issues, { positive: true });
    if (ledger.returnDenominator.currency !== ledger.accountCurrency) {
      issues.push(issue('unsupported_currency', 'blocking', 'ledger.returnDenominator.currency'));
    }
    if (amount !== null) denominator = amount;
  }

  const bases = {};
  if (isObject(ledger.basisValues)) {
    Object.keys(ledger.basisValues).forEach((basisName) => {
      const path = `ledger.basisValues.${basisName}`;
      if (!BASIS_NAMES.has(basisName)) {
        issues.push(issue('unsupported_calculation_basis', 'blocking', path));
        return;
      }
      const basis = ledger.basisValues[basisName];
      if (!exactKeys(basis, BASIS_VALUE_KEYS, path, issues)) return;
      const amount = finiteNonNegative(basis.amount, `${path}.amount`, issues);
      if (basis.currency !== ledger.accountCurrency) issues.push(issue('unsupported_currency', 'blocking', `${path}.currency`));
      if (amount !== null && basis.currency === ledger.accountCurrency) {
        bases[basisName] = { amount, currency: basis.currency };
      }
    });
  } else {
    issues.push(issue('object_required', 'blocking', 'ledger.basisValues'));
  }

  if (denominatorBasis !== null) {
    if (!BASIS_NAMES.has(denominatorBasis)) {
      issues.push(issue('unsupported_return_denominator_basis', 'blocking', 'ledger.returnDenominator.basis'));
      denominator = null;
    } else if (!bases[denominatorBasis]) {
      issues.push(issue('missing_return_denominator_basis', 'blocking', 'ledger.returnDenominator.basis'));
      denominator = null;
    } else if (denominator !== null && !close(denominator, bases[denominatorBasis].amount)) {
      issues.push(issue('return_denominator_basis_mismatch', 'blocking', 'ledger.returnDenominator.amount'));
      denominator = null;
    }
  }

  let coverage = null;
  if (exactKeys(ledger.coverage, COVERAGE_KEYS, 'ledger.coverage', issues)) {
    if (!['declared_complete', 'declared_partial', 'unknown'].includes(ledger.coverage.declaration)) {
      issues.push(issue('invalid_coverage_declaration', 'blocking', 'ledger.coverage.declaration'));
    }
    nonEmptyString(ledger.coverage.policyId, 'ledger.coverage.policyId', issues);
    const expected = stringArray(
      ledger.coverage.expectedEconomicEventIds,
      'ledger.coverage.expectedEconomicEventIds',
      issues,
      { allowEmpty: ledger.coverage.declaration !== 'declared_complete' }
    );
    const notApplicable = stringArray(ledger.coverage.notApplicableCategories, 'ledger.coverage.notApplicableCategories', issues);
    notApplicable.forEach((category) => {
      if (!SUPPORTED_CATEGORIES.has(category) && !RESERVED_CATEGORIES.has(category)) {
        issues.push(issue('unsupported_category', 'blocking', 'ledger.coverage.notApplicableCategories', { details: [category] }));
      }
    });
    const limitations = stringArray(ledger.coverage.limitations, 'ledger.coverage.limitations', issues);
    coverage = { expected, notApplicable, limitations };
  }

  if (!Array.isArray(ledger.components)) issues.push(issue('array_required', 'blocking', 'ledger.components'));
  return { denominator, bases, coverage, scenarioContext };
}

function validateBenchmark(component, path, issues) {
  if (!exactKeys(component.benchmark, BENCHMARK_KEYS, `${path}.benchmark`, issues)) return false;
  let ok = true;
  if (!BENCHMARK_KINDS.has(component.benchmark.kind)) {
    issues.push(issue('unsupported_benchmark_kind', 'blocking', `${path}.benchmark.kind`));
    ok = false;
  }
  ['price', 'currency', 'observedAtUtc', 'sourceId'].forEach((key) => {
    const value = component.benchmark[key];
    if (value !== null && value !== undefined && key === 'price') {
      if (finiteNonNegative(value, `${path}.benchmark.price`, issues, { positive: true }) === null) ok = false;
    } else if (value !== null && value !== undefined && typeof value !== 'string') {
      issues.push(issue('string_or_null_required', 'blocking', `${path}.benchmark.${key}`));
      ok = false;
    }
  });
  if (component.benchmark.observedAtUtc !== null && !validUtcOrNull(component.benchmark.observedAtUtc, `${path}.benchmark.observedAtUtc`, issues)) ok = false;
  nonEmptyString(component.benchmark.status, `${path}.benchmark.status`, issues);
  if (
    ['spread_cost', 'execution_cost_assumption'].includes(component.category) &&
    component.benchmark.kind === 'not_applicable'
  ) {
    issues.push(issue('benchmark_required', 'blocking', `${path}.benchmark.kind`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
    ok = false;
  }
  return ok;
}

function validateUncertainty(component, parameterName, parameterValue, path, issues) {
  const uncertaintyPath = `${path}.uncertainty`;
  if (!exactKeys(component.uncertainty, UNCERTAINTY_KEYS, uncertaintyPath, issues)) return null;
  const value = component.uncertainty;
  let ok = true;
  if (!UNCERTAINTY_KINDS.has(value.kind)) {
    issues.push(issue('unsupported_uncertainty_kind', 'blocking', `${uncertaintyPath}.kind`));
    ok = false;
  }
  const expectedAppliesTo = `parameters.${parameterName}`;
  if (value.appliesTo !== expectedAppliesTo) {
    issues.push(issue('uncertainty_parameter_mismatch', 'blocking', `${uncertaintyPath}.appliesTo`));
    ok = false;
  }
  const low = finiteNonNegative(value.low, `${uncertaintyPath}.low`, issues);
  const base = finiteNonNegative(value.base, `${uncertaintyPath}.base`, issues);
  const high = finiteNonNegative(value.high, `${uncertaintyPath}.high`, issues);
  if (low === null || base === null || high === null) ok = false;
  if (low !== null && base !== null && high !== null && (low > base || base > high)) {
    issues.push(issue('invalid_uncertainty_order', 'blocking', uncertaintyPath));
    ok = false;
  }
  if (base !== null && parameterValue !== null && !close(base, parameterValue)) {
    issues.push(issue('uncertainty_base_mismatch', 'blocking', `${uncertaintyPath}.base`));
    ok = false;
  }
  const expectedUnit = parameterName === 'rate' ? 'decimal_rate' : component.amountCurrency;
  if (value.unit !== expectedUnit) {
    issues.push(issue('uncertainty_unit_mismatch', 'blocking', `${uncertaintyPath}.unit`));
    ok = false;
  }
  nonEmptyString(value.method, `${uncertaintyPath}.method`, issues);
  if (typeof value.calibrated !== 'boolean') {
    issues.push(issue('boolean_required', 'blocking', `${uncertaintyPath}.calibrated`));
    ok = false;
  }
  stringArray(value.limitations, `${uncertaintyPath}.limitations`, issues);
  if (['none_contractual', 'point_assumption'].includes(value.kind) && low !== null && base !== null && high !== null) {
    if (!close(low, base) || !close(base, high)) {
      issues.push(issue('point_uncertainty_must_be_constant', 'blocking', uncertaintyPath));
      ok = false;
    }
  }
  if (value.kind === 'sensitivity_range' && (value.coverage !== 'not_applicable' || value.calibrated !== false)) {
    issues.push(issue('sensitivity_cannot_claim_coverage', 'blocking', uncertaintyPath));
    ok = false;
  }
  if (!nonEmptyString(value.coverage, `${uncertaintyPath}.coverage`, issues)) ok = false;
  return ok && low !== null && base !== null && high !== null ? { low, base, high } : null;
}

function componentResult(component, index, ledger, context, identityCounts, allComponentIds, issues) {
  const path = `ledger.components.${index}`;
  const componentIssuesStart = issues.length;
  if (!exactKeys(component, COMPONENT_KEYS, path, issues)) {
    return { componentId: null, economicEventId: null, category: null, calculationStatus: 'invalid', amountEur: null };
  }

  nonEmptyString(component.componentId, `${path}.componentId`, issues);
  nonEmptyString(component.economicEventId, `${path}.economicEventId`, issues);
  nonEmptyString(component.sourceId, `${path}.sourceId`, issues);
  nonEmptyString(component.modelVersion, `${path}.modelVersion`, issues);

  if (!SUPPORTED_CATEGORIES.has(component.category) && !RESERVED_CATEGORIES.has(component.category)) {
    issues.push(issue('unsupported_category', 'blocking', `${path}.category`));
  }
  if (!['entry', 'exit', 'full_cycle'].includes(component.lifecycleScope)) {
    issues.push(issue('invalid_lifecycle_scope', 'blocking', `${path}.lifecycleScope`));
  }
  if (!['buy', 'sell', 'both', 'not_applicable'].includes(component.side)) {
    issues.push(issue('invalid_side', 'blocking', `${path}.side`));
  }
  const expectedSide = { entry: 'buy', exit: 'sell', full_cycle: 'both' }[component.lifecycleScope];
  if (expectedSide && component.side !== expectedSide) {
    issues.push(issue('lifecycle_side_mismatch', 'blocking', path, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
  }
  if (ledger.operationScope === 'entry_leg' && ['exit', 'full_cycle'].includes(component.lifecycleScope)) {
    issues.push(issue('operation_scope_component_mismatch', 'blocking', path, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
  }
  if (['entry_contractual_fee', 'entry_tax'].includes(component.category) && component.lifecycleScope !== 'entry') {
    issues.push(issue('entry_category_scope_mismatch', 'blocking', path, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
  }
  if (!SUPPORTED_CALCULATION_KINDS.has(component.calculationKind) && !RESERVED_CALCULATION_KINDS.has(component.calculationKind)) {
    issues.push(issue('unsupported_calculation_kind', 'blocking', `${path}.calculationKind`));
  }
  if (component.amountCurrency !== ledger.accountCurrency) {
    issues.push(issue('unsupported_currency', 'blocking', `${path}.amountCurrency`));
  }
  if (component.signConvention !== 'positive_cost_is_adverse_to_investor') {
    issues.push(issue('unsupported_sign_convention', 'blocking', `${path}.signConvention`));
  }
  ['priceInclusion', 'edgeInclusion', 'cashSourceInclusion'].forEach((key) => {
    if (!INCLUSION_STATES.has(component[key])) issues.push(issue('invalid_inclusion_state', 'blocking', `${path}.${key}`));
  });
  if (component.edgeInclusion === 'not_applicable') {
    issues.push(issue('edge_inclusion_required_for_cost_component', 'blocking', `${path}.edgeInclusion`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
  }
  if (!SUPPORTED_PROVENANCE.has(component.provenance) && !RESERVED_PROVENANCE.has(component.provenance)) {
    issues.push(issue('unsupported_provenance', 'blocking', `${path}.provenance`));
  }
  if (EVIDENCE_BY_PROVENANCE[component.provenance] !== component.evidenceStatus) {
    issues.push(issue('evidence_provenance_mismatch', 'blocking', `${path}.evidenceStatus`));
  }
  if (!TEMPORAL_STATES.has(component.temporalStatus)) {
    issues.push(issue('invalid_temporal_status', 'blocking', `${path}.temporalStatus`));
  }
  validUtcOrNull(component.observedAtUtc, `${path}.observedAtUtc`, issues);
  validUtcOrNull(component.validUntilUtc, `${path}.validUntilUtc`, issues);
  if (component.temporalStatus === 'as_of_snapshot' && component.observedAtUtc === null) {
    issues.push(issue('observed_time_required', 'blocking', `${path}.observedAtUtc`));
  }
  if (component.temporalStatus === 'current_until' && (component.observedAtUtc === null || component.validUntilUtc === null)) {
    issues.push(issue('validity_window_required', 'blocking', path));
  }
  if (
    component.observedAtUtc !== null && component.validUntilUtc !== null &&
    Date.parse(component.observedAtUtc) > Date.parse(component.validUntilUtc)
  ) {
    issues.push(issue('validity_precedes_observation', 'blocking', path));
  }
  if (!INPUT_STATUSES.has(component.inputStatus)) issues.push(issue('invalid_input_status', 'blocking', `${path}.inputStatus`));
  const dependencies = stringArray(component.dependencies, `${path}.dependencies`, issues);
  stringArray(component.limitations, `${path}.limitations`, issues);
  if (dependencies.length > 0) {
    issues.push(issue('dependency_semantics_unsupported_in_v1', 'blocking', `${path}.dependencies`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId,
      details: dependencies
    }));
  }
  dependencies.forEach((dependency) => {
    if (!allComponentIds.has(dependency)) issues.push(issue('missing_dependency', 'blocking', `${path}.dependencies`, { details: [dependency] }));
    if (dependency === component.componentId) issues.push(issue('self_dependency', 'blocking', `${path}.dependencies`, { details: [dependency] }));
  });

  const duplicateComponent = typeof component.componentId === 'string' && identityCounts.component.get(component.componentId) > 1;
  const duplicateEvent = typeof component.economicEventId === 'string' && identityCounts.event.get(component.economicEventId) > 1;
  if (duplicateComponent) {
    issues.push(issue('duplicate_component_id', 'blocking', `${path}.componentId`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
  }
  if (duplicateEvent) {
    issues.push(issue('duplicate_economic_event', 'blocking', `${path}.economicEventId`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
  }

  if (context.coverage && context.coverage.notApplicable.includes(component.category)) {
    issues.push(issue('category_declared_not_applicable_but_present', 'blocking', `${path}.category`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
  }

  const benchmarkOk = validateBenchmark(component, path, issues);

  if (component.inputStatus !== 'provided') {
    issues.push(issue('component_not_calculable_by_declaration', 'material', `${path}.inputStatus`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId,
      details: [component.inputStatus]
    }));
    return {
      componentId: component.componentId || null,
      economicEventId: component.economicEventId || null,
      category: component.category || null,
      lifecycleScope: component.lifecycleScope || null,
      calculationStatus: component.inputStatus,
      evidenceStatus: component.evidenceStatus || null,
      temporalStatus: component.temporalStatus || null,
      amountEur: null,
      scalingEligible: false
    };
  }

  if (RESERVED_CATEGORIES.has(component.category)) {
    issues.push(issue('reserved_category_not_assessed', 'material', `${path}.category`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
    return {
      componentId: component.componentId,
      economicEventId: component.economicEventId,
      category: component.category,
      lifecycleScope: component.lifecycleScope,
      calculationStatus: 'not_assessed',
      evidenceStatus: component.evidenceStatus,
      temporalStatus: component.temporalStatus,
      amountEur: null,
      scalingEligible: false
    };
  }
  if (RESERVED_CALCULATION_KINDS.has(component.calculationKind)) {
    issues.push(issue('reserved_calculation_kind_not_assessed', 'material', `${path}.calculationKind`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
    return {
      componentId: component.componentId,
      economicEventId: component.economicEventId,
      category: component.category,
      lifecycleScope: component.lifecycleScope,
      calculationStatus: 'not_assessed',
      evidenceStatus: component.evidenceStatus,
      temporalStatus: component.temporalStatus,
      amountEur: null,
      scalingEligible: false
    };
  }
  if (RESERVED_PROVENANCE.has(component.provenance)) {
    issues.push(issue('provenance_not_assessed_in_v1', 'material', `${path}.provenance`, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
    return {
      componentId: component.componentId,
      economicEventId: component.economicEventId,
      category: component.category,
      lifecycleScope: component.lifecycleScope,
      calculationStatus: 'not_assessed',
      evidenceStatus: component.evidenceStatus,
      temporalStatus: component.temporalStatus,
      amountEur: null,
      scalingEligible: false
    };
  }

  let parameterName = null;
  let parameterValue = null;
  let basis = null;
  let scalingEligible = false;
  if (!isObject(component.parameters)) {
    issues.push(issue('object_required', 'blocking', `${path}.parameters`));
  } else if (component.calculationKind === 'fixed') {
    exactKeys(component.parameters, new Set(['amount']), `${path}.parameters`, issues);
    parameterName = 'amount';
    parameterValue = finiteNonNegative(component.parameters.amount, `${path}.parameters.amount`, issues);
    if (component.calculationBasis !== 'not_applicable') issues.push(issue('fixed_basis_must_be_not_applicable', 'blocking', `${path}.calculationBasis`));
    if (component.notionalScaling !== 'fixed_wrt_return_denominator') issues.push(issue('invalid_fixed_scaling', 'blocking', `${path}.notionalScaling`));
    scalingEligible = component.notionalScaling === 'fixed_wrt_return_denominator';
  } else if (component.calculationKind === 'proportional') {
    exactKeys(component.parameters, new Set(['rate']), `${path}.parameters`, issues);
    parameterName = 'rate';
    parameterValue = finiteNonNegative(component.parameters.rate, `${path}.parameters.rate`, issues);
    if (!BASIS_NAMES.has(component.calculationBasis) || !context.bases[component.calculationBasis]) {
      issues.push(issue('missing_calculation_basis', 'blocking', `${path}.calculationBasis`));
    } else {
      basis = context.bases[component.calculationBasis];
      if (basis.currency !== component.amountCurrency) issues.push(issue('basis_amount_currency_mismatch', 'blocking', path));
    }
    if (!['proportional_to_return_denominator', 'proportional_to_other_basis'].includes(component.notionalScaling)) {
      issues.push(issue('invalid_proportional_scaling', 'blocking', `${path}.notionalScaling`));
    }
    if (component.notionalScaling === 'proportional_to_return_denominator') {
      const denominator = ledger.returnDenominator || {};
      scalingEligible = Boolean(
        basis && denominator.basis === component.calculationBasis &&
        denominator.currency === basis.currency && close(denominator.amount, basis.amount)
      );
      if (!scalingEligible) {
        issues.push(issue('notional_scaling_unproven', 'limitation', `${path}.notionalScaling`, {
          componentId: component.componentId,
          economicEventId: component.economicEventId
        }));
      }
    }
  }

  if (
    component.category === 'fx_cost' && ledger.accountCurrency === ledger.quoteCurrency &&
    parameterValue !== null && parameterValue > 0
  ) {
    issues.push(issue('same_currency_fx_cost', 'blocking', path, {
      componentId: component.componentId,
      economicEventId: component.economicEventId
    }));
  }

  const uncertainty = parameterName && parameterValue !== null
    ? validateUncertainty(component, parameterName, parameterValue, path, issues)
    : null;

  const componentBlockingIssues = issues.slice(componentIssuesStart).some((item) => item.severity === 'blocking');
  if (componentBlockingIssues || !benchmarkOk || !uncertainty || duplicateComponent || duplicateEvent) {
    return {
      componentId: component.componentId || null,
      economicEventId: component.economicEventId || null,
      category: component.category || null,
      lifecycleScope: component.lifecycleScope || null,
      calculationStatus: duplicateComponent || duplicateEvent ? 'conflicted' : 'invalid',
      evidenceStatus: component.evidenceStatus || null,
      temporalStatus: component.temporalStatus || null,
      amountEur: null,
      scalingEligible: false
    };
  }

  const amountEur = {};
  SCENARIOS.forEach((scenario) => {
    const parameter = uncertainty[scenario];
    amountEur[scenario] = normalizeNumber(
      component.calculationKind === 'fixed' ? parameter : basis.amount * parameter
    );
  });

  return {
    componentId: component.componentId,
    economicEventId: component.economicEventId,
    category: component.category,
    lifecycleScope: component.lifecycleScope,
    calculationKind: component.calculationKind,
    calculationStatus: 'calculable',
    evidenceStatus: component.evidenceStatus,
    temporalStatus: component.temporalStatus,
    priceInclusion: component.priceInclusion,
    edgeInclusion: component.edgeInclusion,
    cashSourceInclusion: component.cashSourceInclusion,
    amountEur,
    scalingEligible
  };
}

function evaluate(ledgerValue) {
  const ledger = ledgerValue || {};
  const issues = [];
  const context = rootContext(ledger, issues) || { denominator: null, bases: {}, coverage: null };
  const rootIssueCount = issues.length;

  let ledgerHash = null;
  try {
    ledgerHash = sha256(canonicalLedgerPayload(ledger));
  } catch (error) {
    issues.push(issue('ledger_hash_failed', 'blocking', 'ledger', { details: [error.message] }));
  }

  const components = Array.isArray(ledger.components) ? ledger.components : [];
  const componentCounts = new Map();
  const eventCounts = new Map();
  const allComponentIds = new Set();
  components.forEach((component) => {
    if (isObject(component) && typeof component.componentId === 'string' && component.componentId) {
      componentCounts.set(component.componentId, (componentCounts.get(component.componentId) || 0) + 1);
      allComponentIds.add(component.componentId);
    }
    if (isObject(component) && typeof component.economicEventId === 'string' && component.economicEventId) {
      eventCounts.set(component.economicEventId, (eventCounts.get(component.economicEventId) || 0) + 1);
    }
  });
  const identityCounts = { component: componentCounts, event: eventCounts };
  const results = components.map((component, index) =>
    componentResult(component, index, ledger, context, identityCounts, allComponentIds, issues)
  ).sort((left, right) => {
    const leftKey = `${left.componentId || ''}|${left.economicEventId || ''}`;
    const rightKey = `${right.componentId || ''}|${right.economicEventId || ''}`;
    return compareText(leftKey, rightKey);
  });

  const calculable = results.filter((result) => result.calculationStatus === 'calculable');
  const known = emptyEnvelope();
  const fixed = emptyEnvelope();
  const proportional = emptyEnvelope();
  calculable.forEach((result) => {
    addEnvelope(known, result.amountEur);
    if (result.calculationKind === 'fixed') addEnvelope(fixed, result.amountEur);
    if (result.calculationKind === 'proportional') addEnvelope(proportional, result.amountEur);
  });

  const calculableEvents = new Set(calculable.map((result) => result.economicEventId));
  const expectedEvents = context.coverage ? context.coverage.expected : [];
  const missingEvents = expectedEvents.filter((eventId) => !calculableEvents.has(eventId));
  missingEvents.forEach((eventId) => {
    issues.push(issue('expected_economic_event_missing', 'material', 'ledger.coverage.expectedEconomicEventIds', {
      economicEventId: eventId
    }));
  });

  const unresolvedComponents = results.filter((result) => result.calculationStatus !== 'calculable');
  const rootInvalid = issues.slice(0, rootIssueCount).some((item) => item.severity === 'blocking');
  let coverageStatus = 'invalid';
  if (!rootInvalid && context.coverage && ledger.coverage) {
    if (ledger.coverage.declaration === 'declared_complete') {
      coverageStatus = missingEvents.length === 0 && unresolvedComponents.length === 0
        ? 'complete_under_declared_policy'
        : 'partial_under_declared_policy';
    } else if (ledger.coverage.declaration === 'declared_partial') {
      coverageStatus = 'partial_declared';
    } else if (ledger.coverage.declaration === 'unknown') {
      coverageStatus = 'unknown';
    }
  }

  const complete = coverageStatus === 'complete_under_declared_policy';
  const totalCostEur = complete ? Object.assign({}, known) : null;
  const breakEvenGrossRate = complete && context.denominator !== null
    ? divideEnvelope(totalCostEur, context.denominator)
    : null;
  const allProportionalScalingProven = calculable
    .filter((result) => result.calculationKind === 'proportional')
    .every((result) => result.scalingEligible);
  const variableFloorRate = complete && context.denominator !== null && allProportionalScalingProven
    ? divideEnvelope(proportional, context.denominator)
    : null;

  let edgeEligibility = complete ? 'eligible' : 'insufficient_cost_coverage';
  if (complete && calculable.some((result) => result.edgeInclusion === 'unknown')) {
    edgeEligibility = 'blocked_by_unknown_edge_inclusion';
  } else if (complete && calculable.some((result) => result.edgeInclusion === 'included')) {
    edgeEligibility = 'requires_edge_reconciliation';
  }
  const cashRelevant = calculable.filter((result) => ['entry', 'full_cycle'].includes(result.lifecycleScope));
  let cashEligibility = complete ? 'eligible_for_reconciliation' : 'insufficient_cost_coverage';
  if (complete && cashRelevant.some((result) => result.priceInclusion === 'unknown')) {
    cashEligibility = 'blocked_by_unknown_price_inclusion';
  } else if (complete && cashRelevant.some((result) => result.cashSourceInclusion === 'unknown')) {
    cashEligibility = 'blocked_by_unknown_cash_source_inclusion';
  } else if (complete && cashRelevant.some((result) =>
    result.priceInclusion === 'included' || result.cashSourceInclusion === 'included'
  )) {
    cashEligibility = 'requires_cash_reconciliation';
  }
  const currentDataClaim = calculable.length > 0 && calculable.every((result) =>
    result.temporalStatus === 'current_until' &&
    !['synthetic_demo', 'user_assumption_unverified', 'contractual_input_unverified'].includes(result.evidenceStatus)
  ) ? 'requires_data_quality_gate' : 'not_assessed';

  const orderedIssues = sortIssues(issues);
  const invalid = orderedIssues.some((item) => item.severity === 'blocking');
  const conflicted = results.some((result) => result.calculationStatus === 'conflicted');
  const status = invalid ? 'invalid' : conflicted ? 'conflicted' : coverageStatus;
  const scenarioContextHash = context.scenarioContext ? sha256(context.scenarioContext) : null;
  const output = {
    ok: !invalid && !conflicted,
    version: VERSION,
    schemaVersion: ledger.schemaVersion || null,
    ledgerHash,
    scenarioContextHash,
    status,
    coverage: {
      declaration: ledger.coverage && ledger.coverage.declaration || null,
      policyId: ledger.coverage && ledger.coverage.policyId || null,
      status: coverageStatus,
      expectedEconomicEventIds: expectedEvents,
      missingEconomicEventIds: missingEvents,
      limitations: context.coverage ? context.coverage.limitations : []
    },
    componentResults: results,
    knownCostFloorEur: known,
    knownCostSubtotalEur: Object.assign({}, known),
    fixedCostEur: fixed,
    proportionalCostEur: proportional,
    totalCostEur,
    breakEvenGrossRate,
    variableFloorRate,
    variableFloorQualification: variableFloorRate === null
      ? 'not_available'
      : 'algebraic_under_declared_scaling_without_size_domain',
    downstreamEligibility: {
      edgeSurvival: edgeEligibility,
      entryCash: cashEligibility,
      currentDataClaim
    },
    issues: orderedIssues,
    invariants: {
      componentOrderIndependentHash: ledgerHash !== null,
      knownEnvelopeOrdered: known.low <= known.base && known.base <= known.high,
      totalOnlyWhenCoverageComplete: totalCostEur === null || complete,
      noDuplicateEconomicEventAggregated: calculable.every((result) => eventCounts.get(result.economicEventId) === 1),
      finiteOutput: true
    },
    limitations: Array.from(new Set([
      'synthetic_or_manual_only',
      'coverage_source_dependent',
      'economic_event_identity_source_dependent',
      'known_floor_requires_nonnegative_cost_ontology',
      'component_sensitivities_co_moved_without_joint_model',
      'scaling_domain_not_assessed',
      'no_currency_conversion',
      'no_market_impact_model',
      'no_execution_probability',
      'no_recommendation'
    ].concat(context.coverage ? context.coverage.limitations : []))).sort()
  };
  assertFiniteTree(output);
  return output;
}

function legacyPointUncertainty(parameterName, value, unit) {
  return {
    kind: 'point_assumption',
    appliesTo: `parameters.${parameterName}`,
    low: normalizeNumber(value),
    base: normalizeNumber(value),
    high: normalizeNumber(value),
    unit,
    method: 'legacy_direct_input',
    coverage: 'not_applicable',
    calibrated: false,
    limitations: ['not_statistical', 'legacy_input']
  };
}

function legacyBenchmark(kind) {
  return {
    kind,
    price: null,
    currency: null,
    observedAtUtc: null,
    sourceId: null,
    status: kind === 'not_applicable' ? 'not_applicable' : 'benchmark_not_supplied'
  };
}

function legacyEvidence(provenance) {
  return provenance === 'synthetic_demo' ? 'synthetic_demo' : 'user_assumption_unverified';
}

function legacyTemporal(input) {
  if (typeof input.createdAtUtc === 'string' && ISO_UTC.test(input.createdAtUtc) && Number.isFinite(Date.parse(input.createdAtUtc))) {
    return { temporalStatus: 'as_of_snapshot', observedAtUtc: input.createdAtUtc };
  }
  return { temporalStatus: 'time_not_assessed', observedAtUtc: null };
}

function legacyInclusion(input, legacyCostName) {
  const exclusions = input.grossEdgeAlignment && input.grossEdgeAlignment.key && input.grossEdgeAlignment.key.costExclusions;
  if (!Array.isArray(exclusions)) return 'unknown';
  return exclusions.includes(legacyCostName) ? 'excluded' : 'included';
}

function legacyComponent(input, specification) {
  const temporal = legacyTemporal(input);
  const parameterName = specification.calculationKind === 'fixed' ? 'amount' : 'rate';
  const unit = parameterName === 'amount' ? 'EUR' : 'decimal_rate';
  return {
    componentId: `legacy-component.${specification.eventSuffix}`,
    economicEventId: `legacy.${specification.eventSuffix}`,
    category: specification.category,
    lifecycleScope: specification.lifecycleScope,
    side: specification.side,
    calculationKind: specification.calculationKind,
    calculationBasis: specification.calculationKind === 'fixed' ? 'not_applicable' : 'entry_notional',
    parameters: { [parameterName]: normalizeNumber(specification.value) },
    amountCurrency: 'EUR',
    signConvention: 'positive_cost_is_adverse_to_investor',
    notionalScaling: specification.calculationKind === 'fixed'
      ? 'fixed_wrt_return_denominator'
      : 'proportional_to_return_denominator',
    benchmark: legacyBenchmark(specification.benchmarkKind),
    priceInclusion: specification.priceInclusion,
    edgeInclusion: legacyInclusion(input, specification.legacyCostName),
    cashSourceInclusion: specification.cashSourceInclusion,
    provenance: input.provenance,
    sourceId: `legacy_input.cost.${specification.sourceField}`,
    temporalStatus: temporal.temporalStatus,
    observedAtUtc: temporal.observedAtUtc,
    validUntilUtc: null,
    uncertainty: legacyPointUncertainty(parameterName, specification.value, unit),
    modelVersion: 'not_applicable',
    dependencies: [],
    inputStatus: 'provided',
    evidenceStatus: legacyEvidence(input.provenance),
    limitations: specification.limitations || []
  };
}

function classifyLegacyNumber(value, options) {
  const opts = Object.assign({ required: false, min: 0, max: Infinity, integer: false }, options || {});
  if (value === null || value === undefined) return { ok: !opts.required, missing: true, value: null, reason: 'missing' };
  if (typeof value !== 'number' || !Number.isFinite(value)) return { ok: false, missing: false, value: null, reason: 'not_finite_number' };
  const normalized = normalizeNumber(value);
  if (opts.integer && !Number.isInteger(normalized)) return { ok: false, missing: false, value: null, reason: 'not_integer' };
  if (normalized < opts.min || normalized > opts.max) return { ok: false, missing: false, value: null, reason: 'out_of_range' };
  return { ok: true, missing: false, value: normalized, reason: null };
}

function adaptLegacy(inputValue) {
  const input = inputValue || {};
  const errors = {};
  if (!OPERATION_SCOPES.has(input.operationScope)) errors.operationScope = 'unsupported_operation_scope';
  if (input.accountCurrency !== 'EUR') errors.accountCurrency = 'unsupported_scope';
  if (typeof input.quoteCurrency !== 'string' || !input.quoteCurrency) errors.quoteCurrency = 'non_empty_string_required';
  if (typeof input.instrumentId !== 'string' || !input.instrumentId) errors.instrumentId = 'non_empty_string_required';
  if (typeof input.venueId !== 'string' || !input.venueId) errors.venueId = 'non_empty_string_required';
  if (input.side !== 'long') errors.side = 'unsupported_scenario_direction';
  if (typeof input.holdingHorizonDefinition !== 'string' || !input.holdingHorizonDefinition) {
    errors.holdingHorizonDefinition = 'non_empty_string_required';
  }
  if (!['user_assumption', 'synthetic_demo'].includes(input.provenance)) errors.provenance = 'unsupported_provenance';
  const notional = classifyLegacyNumber(input.orderNotionalEur, { required: true, min: Number.MIN_VALUE });
  if (!notional.ok) errors.orderNotionalEur = notional.reason;
  const cost = isObject(input.cost) ? input.cost : {};
  const sideCount = classifyLegacyNumber(cost.sideCount, { required: true, min: 1, max: 2, integer: true });
  if (!sideCount.ok) errors['cost.sideCount'] = sideCount.reason;
  const expectedSideCount = input.operationScope === 'entry_leg' ? 1 : input.operationScope === 'complete_round_trip' ? 2 : null;
  if (sideCount.ok && !sideCount.missing && expectedSideCount !== sideCount.value) {
    errors['cost.sideCount'] = 'operation_scope_side_count_mismatch';
  }
  const fields = {
    commissionPerSideEur: classifyLegacyNumber(cost.commissionPerSideEur, { min: 0 }),
    fxRatePerSide: classifyLegacyNumber(cost.fxRatePerSide, { min: 0, max: 1 }),
    spreadTotalRate: classifyLegacyNumber(cost.spreadTotalRate, { min: 0, max: 1 }),
    slippageTotalRate: classifyLegacyNumber(cost.slippageTotalRate, { min: 0, max: 1 })
  };
  Object.entries(fields).forEach(([field, classification]) => {
    if (!classification.ok) errors[`cost.${field}`] = classification.reason;
  });
  if (
    fields.fxRatePerSide.ok && !fields.fxRatePerSide.missing &&
    input.accountCurrency === input.quoteCurrency && fields.fxRatePerSide.value > 0
  ) {
    errors['cost.fxRatePerSide'] = 'same_currency_fx_cost_conflict';
  }
  if (Object.keys(errors).length) return { ok: false, errors, ledger: null };

  const roundTrip = input.operationScope === 'complete_round_trip';
  const expectedEconomicEventIds = [];
  const components = [];
  const priceStatus = (field) => {
    const cash = isObject(input.cash) ? input.cash : {};
    return INCLUSION_STATES.has(cash[field]) ? cash[field] : 'unknown';
  };
  const addExpected = (eventSuffix) => expectedEconomicEventIds.push(`legacy.${eventSuffix}`);
  const addComponent = (specification) => {
    addExpected(specification.eventSuffix);
    if (specification.value !== null) components.push(legacyComponent(input, specification));
  };

  addComponent({
    eventSuffix: 'commission.entry',
    category: 'commission',
    lifecycleScope: 'entry',
    side: 'buy',
    calculationKind: 'fixed',
    value: fields.commissionPerSideEur.missing ? null : fields.commissionPerSideEur.value,
    benchmarkKind: 'not_applicable',
    priceInclusion: 'excluded',
    cashSourceInclusion: 'excluded',
    legacyCostName: 'commission',
    sourceField: 'commissionPerSideEur',
    limitations: []
  });
  if (roundTrip) {
    addComponent({
      eventSuffix: 'commission.exit',
      category: 'commission',
      lifecycleScope: 'exit',
      side: 'sell',
      calculationKind: 'fixed',
      value: fields.commissionPerSideEur.missing ? null : fields.commissionPerSideEur.value,
      benchmarkKind: 'not_applicable',
      priceInclusion: 'excluded',
      cashSourceInclusion: 'not_applicable',
      legacyCostName: 'commission',
      sourceField: 'commissionPerSideEur',
      limitations: ['legacy_constant_notional']
    });
  }
  addComponent({
    eventSuffix: 'fx.entry',
    category: 'fx_cost',
    lifecycleScope: 'entry',
    side: 'buy',
    calculationKind: 'proportional',
    value: fields.fxRatePerSide.missing ? null : fields.fxRatePerSide.value,
    benchmarkKind: 'not_applicable',
    priceInclusion: 'excluded',
    cashSourceInclusion: 'excluded',
    legacyCostName: 'fx',
    sourceField: 'fxRatePerSide',
    limitations: []
  });
  if (roundTrip) {
    addComponent({
      eventSuffix: 'fx.exit',
      category: 'fx_cost',
      lifecycleScope: 'exit',
      side: 'sell',
      calculationKind: 'proportional',
      value: fields.fxRatePerSide.missing ? null : fields.fxRatePerSide.value,
      benchmarkKind: 'not_applicable',
      priceInclusion: 'excluded',
      cashSourceInclusion: 'not_applicable',
      legacyCostName: 'fx',
      sourceField: 'fxRatePerSide',
      limitations: ['legacy_constant_notional']
    });
  }
  const scopeSuffix = roundTrip ? 'full_cycle' : 'entry';
  const lifecycleScope = roundTrip ? 'full_cycle' : 'entry';
  const side = roundTrip ? 'both' : 'buy';
  addComponent({
    eventSuffix: `spread.${scopeSuffix}`,
    category: 'spread_cost',
    lifecycleScope,
    side,
    calculationKind: 'proportional',
    value: fields.spreadTotalRate.missing ? null : fields.spreadTotalRate.value,
    benchmarkKind: 'user_assumption_without_market_benchmark',
    priceInclusion: priceStatus('spreadReferencePriceStatus'),
    cashSourceInclusion: roundTrip ? 'not_applicable' : 'excluded',
    legacyCostName: 'spread',
    sourceField: 'spreadTotalRate',
    limitations: ['no_market_benchmark'].concat(roundTrip ? ['legacy_constant_notional'] : [])
  });
  addComponent({
    eventSuffix: `execution_cost.${scopeSuffix}`,
    category: 'execution_cost_assumption',
    lifecycleScope,
    side,
    calculationKind: 'proportional',
    value: fields.slippageTotalRate.missing ? null : fields.slippageTotalRate.value,
    benchmarkKind: 'user_assumption_without_market_benchmark',
    priceInclusion: priceStatus('slippageReferencePriceStatus'),
    cashSourceInclusion: roundTrip ? 'not_applicable' : 'excluded',
    legacyCostName: 'slippage',
    sourceField: 'slippageTotalRate',
    limitations: ['no_market_benchmark'].concat(roundTrip ? ['legacy_constant_notional'] : [])
  });

  const notApplicableCategories = [];
  const coverageLimitations = [
    'entry_contractual_fee_and_tax_outside_legacy_policy',
    'legacy_four_cost_policy_only',
    'policy_does_not_prove_all_real_world_costs'
  ];
  const cash = isObject(input.cash) ? input.cash : null;
  if (cash && typeof cash.entryContractualFeesEur === 'number' && cash.entryContractualFeesEur > 0) {
    expectedEconomicEventIds.push('legacy.entry_contractual_fee.entry');
  }
  if (cash && typeof cash.entryTaxEur === 'number' && cash.entryTaxEur > 0) {
    expectedEconomicEventIds.push('legacy.entry_tax.entry');
  }
  if (roundTrip) coverageLimitations.push('legacy_constant_notional');

  const N = notional.value;
  const ledger = {
    schemaVersion: SCHEMA_VERSION,
    ledgerId: 'legacy-adapter-cost-ledger',
    operationScope: input.operationScope,
    accountCurrency: input.accountCurrency,
    quoteCurrency: input.quoteCurrency,
    scenarioContext: {
      instrumentId: input.instrumentId,
      venueId: input.venueId,
      direction: input.side,
      operationScope: input.operationScope,
      holdingHorizonDefinition: input.holdingHorizonDefinition,
      accountCurrency: input.accountCurrency,
      quoteCurrency: input.quoteCurrency
    },
    returnDenominator: { basis: 'entry_notional', amount: N, currency: 'EUR' },
    basisValues: Object.assign(
      { entry_notional: { amount: N, currency: 'EUR' } },
      roundTrip ? { exit_notional: { amount: N, currency: 'EUR' } } : {}
    ),
    coverage: {
      declaration: 'declared_complete',
      policyId: LEGACY_POLICY_VERSION,
      expectedEconomicEventIds: expectedEconomicEventIds.sort(),
      notApplicableCategories: notApplicableCategories.sort(),
      limitations: coverageLimitations.sort()
    },
    components
  };
  return { ok: true, errors: {}, ledger };
}

function evaluateLegacy(input) {
  const adapted = adaptLegacy(input);
  if (!adapted.ok) return { ok: false, errors: adapted.errors, ledger: null, result: null };
  return { ok: true, errors: {}, ledger: adapted.ledger, result: evaluate(adapted.ledger) };
}

function assertFiniteTree(value, path) {
  const location = path || 'root';
  if (typeof value === 'number' && (!Number.isFinite(value) || Object.is(value, -0))) {
    throw new Error(`invalid_numeric_value:${location}`);
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertFiniteTree(item, `${location}[${index}]`));
  } else if (isObject(value)) {
    Object.keys(value).forEach((key) => assertFiniteTree(value[key], `${location}.${key}`));
  }
  return true;
}

module.exports = {
  VERSION,
  SCHEMA_VERSION,
  LEGACY_POLICY_VERSION,
  TOLERANCE,
  close,
  canonicalStringify,
  canonicalLedgerPayload,
  sha256,
  evaluate,
  adaptLegacy,
  evaluateLegacy,
  assertFiniteTree
};
