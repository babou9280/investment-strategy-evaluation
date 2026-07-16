'use strict';

const ledgerEngine = require('./ledger.js');
const foundationEngine = require('../cost_gate_foundation/engine.js');

const VERSION = 'cost-survival-surface-engine-1-synthetic';
const SCHEMA_VERSION = 'cost-survival-surface-1';
const PROJECTION_POLICY = 'linear-ledger-sensitivity-1';
const TOLERANCE = 1e-12;
const SCENARIOS = ['low', 'base', 'high'];

const ROOT_KEYS = new Set([
  'schemaVersion',
  'surfaceId',
  'sourceLedgerHash',
  'sourceLedger',
  'projection',
  'edgeProfile'
]);
const PROJECTION_KEYS = new Set([
  'policyId',
  'sourceNotionalEur',
  'sizeAxisEur',
  'domain',
  'basisRules',
  'parameterStability',
  'quantityTreatment',
  'limitations'
]);
const DOMAIN_KEYS = new Set(['minNotionalEur', 'maxNotionalEur', 'currency', 'status']);
const EDGE_KEYS = new Set([
  'mode',
  'provenance',
  'alignmentContext',
  'alignmentKeyHash',
  'constantRates',
  'bySize',
  'limitations'
]);
const RATE_KEYS = new Set(SCENARIOS);
const BY_SIZE_KEYS = new Set(['sizeEur', 'rates']);
const ALIGNMENT_CONTEXT_KEYS = new Set([
  'instrumentId',
  'venueId',
  'side',
  'operationScope',
  'holdingHorizonDefinition',
  'accountCurrency',
  'grossEdgeAlignment'
]);

function normalizeNumber(value) {
  return Object.is(value, -0) ? 0 : value;
}

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function close(left, right) {
  if (typeof left !== 'number' || typeof right !== 'number') return false;
  if (!Number.isFinite(left) || !Number.isFinite(right)) return false;
  return Math.abs(left - right) <= TOLERANCE * Math.max(1, Math.abs(left), Math.abs(right));
}

function issue(code, path, details) {
  return {
    code,
    severity: 'blocking',
    path: path || null,
    details: Array.isArray(details) ? details.slice().sort() : []
  };
}

function sortIssues(issues) {
  return issues.slice().sort((left, right) => {
    const leftKey = `${left.path || ''}|${left.code}|${left.details.join('|')}`;
    const rightKey = `${right.path || ''}|${right.code}|${right.details.join('|')}`;
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });
}

function exactKeys(value, allowed, path, issues) {
  if (!isObject(value)) {
    issues.push(issue('object_required', path));
    return false;
  }
  Object.keys(value).forEach((key) => {
    if (!allowed.has(key)) issues.push(issue('unknown_key', `${path}.${key}`));
  });
  return true;
}

function nonEmptyString(value, path, issues) {
  if (typeof value !== 'string' || !value) {
    issues.push(issue('non_empty_string_required', path));
    return false;
  }
  return true;
}

function finiteNumber(value, path, issues, options) {
  const opts = Object.assign({ positive: false }, options || {});
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    issues.push(issue('finite_number_required', path));
    return null;
  }
  const normalized = normalizeNumber(value);
  if (opts.positive && normalized <= 0) {
    issues.push(issue('positive_number_required', path));
    return null;
  }
  return normalized;
}

function stringArray(value, path, issues) {
  if (!Array.isArray(value)) {
    issues.push(issue('array_required', path));
    return [];
  }
  const seen = new Set();
  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || !entry) {
      issues.push(issue('non_empty_string_required', `${path}.${index}`));
    } else if (seen.has(entry)) {
      issues.push(issue('duplicate_string', `${path}.${index}`, [entry]));
    } else {
      seen.add(entry);
    }
  });
  return value.slice();
}

function deepClone(value) {
  if (Array.isArray(value)) return value.map(deepClone);
  if (isObject(value)) {
    const output = {};
    Object.keys(value).forEach((key) => { output[key] = deepClone(value[key]); });
    return output;
  }
  return value;
}

function validateRates(value, path, issues) {
  if (!exactKeys(value, RATE_KEYS, path, issues)) return null;
  const output = {};
  SCENARIOS.forEach((scenario) => {
    output[scenario] = finiteNumber(value[scenario], `${path}.${scenario}`, issues);
  });
  if (SCENARIOS.every((scenario) => output[scenario] !== null)) {
    if (output.low > output.base || output.base > output.high) {
      issues.push(issue('invalid_edge_range_order', path));
    }
    return output;
  }
  return null;
}

function validateProjection(projection, sourceLedger, issues) {
  if (!exactKeys(projection, PROJECTION_KEYS, 'request.projection', issues)) return null;
  if (projection.policyId !== PROJECTION_POLICY) {
    issues.push(issue('unsupported_projection_policy', 'request.projection.policyId'));
  }
  const sourceNotionalEur = finiteNumber(
    projection.sourceNotionalEur,
    'request.projection.sourceNotionalEur',
    issues,
    { positive: true }
  );
  if (projection.parameterStability !== 'assumed_constant_over_declared_domain') {
    issues.push(issue('parameter_stability_declaration_required', 'request.projection.parameterStability'));
  }
  if (projection.quantityTreatment !== 'notional_only_not_executable') {
    issues.push(issue('unsupported_quantity_treatment', 'request.projection.quantityTreatment'));
  }
  const limitations = stringArray(projection.limitations, 'request.projection.limitations', issues);

  let domain = null;
  if (exactKeys(projection.domain, DOMAIN_KEYS, 'request.projection.domain', issues)) {
    const min = finiteNumber(
      projection.domain.minNotionalEur,
      'request.projection.domain.minNotionalEur',
      issues,
      { positive: true }
    );
    const max = finiteNumber(
      projection.domain.maxNotionalEur,
      'request.projection.domain.maxNotionalEur',
      issues,
      { positive: true }
    );
    if (min !== null && max !== null && min > max) {
      issues.push(issue('invalid_projection_domain_order', 'request.projection.domain'));
    }
    if (projection.domain.currency !== 'EUR') {
      issues.push(issue('unsupported_projection_currency', 'request.projection.domain.currency'));
    }
    if (projection.domain.status !== 'synthetic_sensitivity_only') {
      issues.push(issue('unsupported_projection_domain_status', 'request.projection.domain.status'));
    }
    domain = { min, max };
  }

  const sizes = [];
  if (!Array.isArray(projection.sizeAxisEur)) {
    issues.push(issue('array_required', 'request.projection.sizeAxisEur'));
  } else {
    if (projection.sizeAxisEur.length === 0 || projection.sizeAxisEur.length > 50) {
      issues.push(issue('invalid_size_axis_length', 'request.projection.sizeAxisEur'));
    }
    projection.sizeAxisEur.forEach((value, index) => {
      const size = finiteNumber(value, `request.projection.sizeAxisEur.${index}`, issues, { positive: true });
      if (size !== null) {
        if (index > 0 && !(size > sizes[index - 1])) {
          issues.push(issue('size_axis_must_be_strictly_increasing', `request.projection.sizeAxisEur.${index}`));
        }
        if (domain && domain.min !== null && domain.max !== null && (size < domain.min || size > domain.max)) {
          issues.push(issue('size_outside_declared_domain', `request.projection.sizeAxisEur.${index}`));
        }
      }
      sizes.push(size);
    });
  }

  const sourceDenominator = sourceLedger && sourceLedger.returnDenominator;
  const sourceEntry = sourceLedger && sourceLedger.basisValues && sourceLedger.basisValues.entry_notional;
  if (
    sourceNotionalEur !== null &&
    (
      !sourceDenominator || sourceDenominator.basis !== 'entry_notional' ||
      !close(sourceDenominator.amount, sourceNotionalEur) ||
      !sourceEntry || !close(sourceEntry.amount, sourceNotionalEur)
    )
  ) {
    issues.push(issue('source_notional_mismatch', 'request.projection.sourceNotionalEur'));
  }

  const basisValues = isObject(sourceLedger && sourceLedger.basisValues) ? sourceLedger.basisValues : {};
  const basisNames = Object.keys(basisValues).sort();
  const basisRules = isObject(projection.basisRules) ? projection.basisRules : null;
  if (!basisRules) {
    issues.push(issue('object_required', 'request.projection.basisRules'));
  } else {
    Object.keys(basisRules).forEach((basisName) => {
      if (!basisNames.includes(basisName)) {
        issues.push(issue('unexpected_basis_projection_rule', `request.projection.basisRules.${basisName}`));
      }
    });
    basisNames.forEach((basisName) => {
      const rule = basisRules[basisName];
      if (rule === undefined) {
        issues.push(issue('missing_basis_projection_rule', `request.projection.basisRules.${basisName}`));
      } else if (basisName === 'entry_notional' && rule !== 'axis_value') {
        issues.push(issue('entry_notional_must_follow_axis', `request.projection.basisRules.${basisName}`));
      } else if (basisName !== 'entry_notional' && rule !== 'preserve_source_ratio') {
        issues.push(issue('unsupported_basis_projection_rule', `request.projection.basisRules.${basisName}`));
      }
    });
  }

  const components = Array.isArray(sourceLedger && sourceLedger.components) ? sourceLedger.components : [];
  components.forEach((component, index) => {
    if (!['fixed', 'proportional'].includes(component.calculationKind)) {
      issues.push(issue('component_geometry_not_projectable', `request.sourceLedger.components.${index}.calculationKind`));
    }
    if (
      component.calculationKind === 'proportional' &&
      (!basisRules || !Object.prototype.hasOwnProperty.call(basisRules, component.calculationBasis))
    ) {
      issues.push(issue('component_basis_not_projectable', `request.sourceLedger.components.${index}.calculationBasis`));
    }
  });

  return {
    sourceNotionalEur,
    sizes,
    domain,
    basisRules: basisRules || {},
    limitations
  };
}

function validateEdgeProfile(edgeProfile, sizes, sourceLedger, issues) {
  if (!exactKeys(edgeProfile, EDGE_KEYS, 'request.edgeProfile', issues)) return null;
  if (!['constant_across_size', 'explicit_by_size'].includes(edgeProfile.mode)) {
    issues.push(issue('unsupported_edge_profile_mode', 'request.edgeProfile.mode'));
  }
  if (!['user_assumption', 'synthetic_demo'].includes(edgeProfile.provenance)) {
    issues.push(issue('unsupported_edge_provenance', 'request.edgeProfile.provenance'));
  }
  nonEmptyString(edgeProfile.alignmentKeyHash, 'request.edgeProfile.alignmentKeyHash', issues);
  const limitations = stringArray(edgeProfile.limitations, 'request.edgeProfile.limitations', issues);

  let alignmentContext = null;
  if (exactKeys(edgeProfile.alignmentContext, ALIGNMENT_CONTEXT_KEYS, 'request.edgeProfile.alignmentContext', issues)) {
    alignmentContext = edgeProfile.alignmentContext;
    ['instrumentId', 'venueId', 'holdingHorizonDefinition', 'accountCurrency'].forEach((key) => {
      nonEmptyString(alignmentContext[key], `request.edgeProfile.alignmentContext.${key}`, issues);
    });
    if (alignmentContext.side !== 'long') {
      issues.push(issue('unsupported_edge_direction', 'request.edgeProfile.alignmentContext.side'));
    }
    if (!isObject(alignmentContext.grossEdgeAlignment)) {
      issues.push(issue('object_required', 'request.edgeProfile.alignmentContext.grossEdgeAlignment'));
    }
    const ledgerContext = sourceLedger && sourceLedger.scenarioContext;
    if (
      !ledgerContext ||
      alignmentContext.instrumentId !== ledgerContext.instrumentId ||
      alignmentContext.venueId !== ledgerContext.venueId ||
      alignmentContext.side !== ledgerContext.direction ||
      alignmentContext.operationScope !== ledgerContext.operationScope ||
      alignmentContext.holdingHorizonDefinition !== ledgerContext.holdingHorizonDefinition ||
      alignmentContext.accountCurrency !== ledgerContext.accountCurrency
    ) {
      issues.push(issue('edge_ledger_scenario_context_mismatch', 'request.edgeProfile.alignmentContext'));
    }
    let computedAlignmentHash = null;
    try {
      computedAlignmentHash = foundationEngine.sha256(alignmentContext);
    } catch (error) {
      issues.push(issue('edge_alignment_hash_failed', 'request.edgeProfile.alignmentContext', [error.message]));
    }
    if (computedAlignmentHash !== edgeProfile.alignmentKeyHash) {
      issues.push(issue('edge_alignment_hash_mismatch', 'request.edgeProfile.alignmentKeyHash'));
    }
    const assessed = foundationEngine.assessAlignment(Object.assign({}, alignmentContext, {
      grossEdgeRate: 0,
      grossEdgeLowRate: null,
      grossEdgeBaseRate: null,
      grossEdgeHighRate: null
    }));
    if (assessed.state !== 'edge_aligned') {
      issues.push(issue('edge_alignment_required', 'request.edgeProfile.alignmentContext', assessed.reasons));
    }
  }

  let constantRates = null;
  const rows = [];
  if (edgeProfile.mode === 'constant_across_size') {
    constantRates = validateRates(edgeProfile.constantRates, 'request.edgeProfile.constantRates', issues);
    if (!Array.isArray(edgeProfile.bySize) || edgeProfile.bySize.length !== 0) {
      issues.push(issue('constant_edge_profile_requires_empty_by_size', 'request.edgeProfile.bySize'));
    }
  } else if (edgeProfile.mode === 'explicit_by_size') {
    if (edgeProfile.constantRates !== null) {
      issues.push(issue('explicit_edge_profile_requires_null_constant_rates', 'request.edgeProfile.constantRates'));
    }
    if (!Array.isArray(edgeProfile.bySize)) {
      issues.push(issue('array_required', 'request.edgeProfile.bySize'));
    } else {
      if (edgeProfile.bySize.length !== sizes.length) {
        issues.push(issue('edge_profile_size_count_mismatch', 'request.edgeProfile.bySize'));
      }
      edgeProfile.bySize.forEach((row, index) => {
        const path = `request.edgeProfile.bySize.${index}`;
        if (!exactKeys(row, BY_SIZE_KEYS, path, issues)) return;
        const size = finiteNumber(row.sizeEur, `${path}.sizeEur`, issues, { positive: true });
        if (size !== null && (sizes[index] === undefined || !close(size, sizes[index]))) {
          issues.push(issue('edge_profile_size_mismatch', `${path}.sizeEur`));
        }
        rows.push({ sizeEur: size, rates: validateRates(row.rates, `${path}.rates`, issues) });
      });
    }
  }

  return { mode: edgeProfile.mode, constantRates, rows, limitations, alignmentContext };
}

function projectLedger(sourceLedger, projection, sizeEur) {
  const projected = deepClone(sourceLedger);
  const sourceNotional = projection.sourceNotionalEur;
  Object.keys(projected.basisValues).forEach((basisName) => {
    const sourceAmount = sourceLedger.basisValues[basisName].amount;
    const rule = projection.basisRules[basisName];
    projected.basisValues[basisName].amount = rule === 'axis_value'
      ? sizeEur
      : normalizeNumber(sizeEur * (sourceAmount / sourceNotional));
  });
  projected.returnDenominator.amount = sizeEur;
  return projected;
}

function marginState(grossEdgeEur, costEur) {
  const difference = normalizeNumber(grossEdgeEur - costEur);
  const scale = Math.max(1, Math.abs(grossEdgeEur), Math.abs(costEur));
  if (Math.abs(difference) <= TOLERANCE * scale) {
    return { state: 'at_threshold_no_positive_margin', netMarginEur: 0 };
  }
  return {
    state: difference > 0 ? 'positive_margin_under_assumptions' : 'below_threshold',
    netMarginEur: difference
  };
}

function domainRelation(boundary, domain) {
  if (boundary === null || !domain || domain.min === null || domain.max === null) return 'not_applicable';
  if (boundary < domain.min && !close(boundary, domain.min)) return 'below_declared_domain';
  if (boundary > domain.max && !close(boundary, domain.max)) return 'above_declared_domain';
  return 'within_declared_domain';
}

function exactBoundaries(projectedRows, edge, projection) {
  const first = projectedRows[0];
  const last = projectedRows[projectedRows.length - 1];
  const output = [];
  SCENARIOS.forEach((costScenario) => {
    const fixed = first.result.fixedCostEur[costScenario];
    const variableRate = first.result.proportionalCostEur[costScenario] / first.sizeEur;
    const lastFixed = last.result.fixedCostEur[costScenario];
    const lastVariableRate = last.result.proportionalCostEur[costScenario] / last.sizeEur;
    SCENARIOS.forEach((edgeScenario) => {
      const grossRate = edge.constantRates[edgeScenario];
      if (!close(fixed, lastFixed) || !close(variableRate, lastVariableRate)) {
        output.push({
          costScenario,
          edgeScenario,
          method: 'unavailable',
          status: 'linear_geometry_not_proven',
          boundaryNotionalEur: null,
          domainRelation: 'not_applicable',
          fixedCostEur: fixed,
          variableCostRate: variableRate,
          grossEdgeRate: grossRate
        });
        return;
      }
      const delta = normalizeNumber(grossRate - variableRate);
      let status;
      let boundary = null;
      if (close(delta, 0)) {
        status = close(fixed, 0)
          ? 'at_threshold_for_all_positive_sizes'
          : 'positive_margin_structurally_unreachable';
      } else if (delta < 0) {
        status = 'positive_margin_structurally_unreachable';
      } else if (close(fixed, 0)) {
        status = 'positive_for_all_positive_sizes';
        boundary = 0;
      } else {
        status = 'positive_strictly_above_boundary';
        boundary = normalizeNumber(fixed / delta);
      }
      output.push({
        costScenario,
        edgeScenario,
        method: 'exact_linear_under_declared_projection',
        status,
        boundaryNotionalEur: boundary,
        domainRelation: domainRelation(boundary, projection.domain),
        fixedCostEur: fixed,
        variableCostRate: normalizeNumber(variableRate),
        grossEdgeRate: grossRate
      });
    });
  });
  return output;
}

function transitionBrackets(cells, sizes) {
  const output = [];
  SCENARIOS.forEach((costScenario) => {
    SCENARIOS.forEach((edgeScenario) => {
      const series = sizes.map((size) => cells.find((cell) =>
        close(cell.sizeEur, size) && cell.costScenario === costScenario && cell.edgeScenario === edgeScenario
      ));
      for (let index = 1; index < series.length; index += 1) {
        if (series[index - 1].state !== series[index].state) {
          output.push({
            costScenario,
            edgeScenario,
            lowerSizeEur: series[index - 1].sizeEur,
            upperSizeEur: series[index].sizeEur,
            lowerState: series[index - 1].state,
            upperState: series[index].state,
            interpolation: 'none'
          });
        }
      }
    });
  });
  return output;
}

function invalidOutput(issues, sourceResult, requestHash) {
  const output = {
    ok: false,
    version: VERSION,
    schemaVersion: SCHEMA_VERSION,
    requestHash: requestHash || null,
    sourceLedgerHash: sourceResult && sourceResult.ledgerHash || null,
    status: 'invalid_or_unsupported',
    sizesEur: [],
    projectedLedgers: [],
    cells: [],
    boundaries: {
      method: 'unavailable',
      exact: [],
      transitionBrackets: []
    },
    unassessedLayers: [],
    issues: sortIssues(issues),
    invariants: {
      cartesianCellCount: false,
      finiteOutput: true,
      noOptimization: true
    },
    limitations: ['no_surface_from_invalid_or_unsupported_request']
  };
  ledgerEngine.assertFiniteTree(output);
  return output;
}

function evaluate(requestValue) {
  const request = requestValue || {};
  const issues = [];
  exactKeys(request, ROOT_KEYS, 'request', issues);
  if (request.schemaVersion !== SCHEMA_VERSION) {
    issues.push(issue('unsupported_surface_schema', 'request.schemaVersion'));
  }
  nonEmptyString(request.surfaceId, 'request.surfaceId', issues);
  nonEmptyString(request.sourceLedgerHash, 'request.sourceLedgerHash', issues);

  let sourceResult = null;
  try {
    sourceResult = ledgerEngine.evaluate(request.sourceLedger);
  } catch (error) {
    issues.push(issue('source_ledger_evaluation_failed', 'request.sourceLedger', [error.message]));
  }
  if (sourceResult) {
    if (request.sourceLedgerHash !== sourceResult.ledgerHash) {
      issues.push(issue('source_ledger_hash_mismatch', 'request.sourceLedgerHash'));
    }
    if (sourceResult.coverage.status !== 'complete_under_declared_policy') {
      issues.push(issue('complete_cost_coverage_required', 'request.sourceLedger'));
    }
    if (sourceResult.downstreamEligibility.edgeSurvival !== 'eligible') {
      issues.push(issue('source_ledger_edge_reconciliation_required', 'request.sourceLedger'));
    }
    if (
      !request.sourceLedger || !request.sourceLedger.returnDenominator ||
      request.sourceLedger.returnDenominator.basis !== 'entry_notional' ||
      request.sourceLedger.returnDenominator.currency !== 'EUR'
    ) {
      issues.push(issue('entry_notional_eur_denominator_required', 'request.sourceLedger.returnDenominator'));
    }
  }

  const projection = validateProjection(request.projection, request.sourceLedger, issues);
  const edge = validateEdgeProfile(
    request.edgeProfile,
    projection ? projection.sizes : [],
    request.sourceLedger,
    issues
  );

  let requestHash = null;
  try {
    requestHash = ledgerEngine.sha256({
      schemaVersion: request.schemaVersion,
      surfaceId: request.surfaceId,
      sourceLedgerHash: request.sourceLedgerHash,
      projection: request.projection,
      edgeProfile: request.edgeProfile
    });
  } catch (error) {
    issues.push(issue('surface_hash_failed', 'request', [error.message]));
  }

  if (issues.length > 0 || !sourceResult || !projection || !edge) {
    return invalidOutput(issues, sourceResult, requestHash);
  }

  const projectedRows = [];
  projection.sizes.forEach((sizeEur) => {
    const projectedLedger = projectLedger(request.sourceLedger, projection, sizeEur);
    const result = ledgerEngine.evaluate(projectedLedger);
    if (
      result.coverage.status !== 'complete_under_declared_policy' ||
      result.downstreamEligibility.edgeSurvival !== 'eligible' ||
      result.totalCostEur === null
    ) {
      issues.push(issue('projected_ledger_not_eligible', `projection.size.${sizeEur}`));
    }
    projectedRows.push({ sizeEur, result });
  });
  if (issues.length > 0) return invalidOutput(issues, sourceResult, requestHash);

  const cells = [];
  projectedRows.forEach((row, sizeIndex) => {
    const edgeRates = edge.mode === 'constant_across_size'
      ? edge.constantRates
      : edge.rows[sizeIndex].rates;
    SCENARIOS.forEach((costScenario) => {
      const costEur = row.result.totalCostEur[costScenario];
      const breakEvenRate = row.result.breakEvenGrossRate[costScenario];
      SCENARIOS.forEach((edgeScenario) => {
        const grossEdgeRate = edgeRates[edgeScenario];
        const grossEdgeEur = normalizeNumber(row.sizeEur * grossEdgeRate);
        const classified = marginState(grossEdgeEur, costEur);
        const netMarginRate = classified.netMarginEur === 0
          ? 0
          : normalizeNumber(grossEdgeRate - breakEvenRate);
        const ratiosAvailable = grossEdgeEur > TOLERANCE * Math.max(1, Math.abs(costEur));
        cells.push({
          cellId: `${row.sizeEur}|${costScenario}|${edgeScenario}`,
          projectedLedgerHash: row.result.ledgerHash,
          sizeEur: row.sizeEur,
          costScenario,
          edgeScenario,
          costEur,
          breakEvenGrossRate: breakEvenRate,
          grossEdgeRate,
          grossEdgeEur,
          netMarginRate,
          netMarginEur: classified.netMarginEur,
          edgeAbsorptionRate: ratiosAvailable ? normalizeNumber(costEur / grossEdgeEur) : null,
          edgeRetainedRate: ratiosAvailable ? normalizeNumber(classified.netMarginEur / grossEdgeEur) : null,
          ratioStatus: ratiosAvailable ? 'available' : 'non_positive_gross_edge',
          state: classified.state,
          projectionStatus: 'synthetic_sensitivity_only'
        });
      });
    });
  });

  const boundaries = edge.mode === 'constant_across_size'
    ? {
        method: 'exact_linear_under_declared_projection',
        exact: exactBoundaries(projectedRows, edge, projection),
        transitionBrackets: []
      }
    : {
        method: 'discrete_profile_no_interpolation',
        exact: [],
        transitionBrackets: transitionBrackets(cells, projection.sizes)
      };

  const limitations = Array.from(new Set([
    'synthetic_sensitivity_only',
    'cost_parameters_assumed_constant_over_domain',
    'scaling_domain_synthetic_only',
    'notional_only_not_executable',
    'component_cost_scenarios_not_joint_distribution',
    'legacy_exit_notional_ratio_preserved',
    'no_market_impact_or_fill',
    'no_capital_timeline_or_frequency',
    'no_recommendation'
  ].concat(
    edge.mode === 'constant_across_size' ? ['edge_capacity_not_modelled'] : ['edge_by_size_user_supplied_unverified'],
    projection.limitations,
    edge.limitations,
    sourceResult.limitations
  ))).sort();

  const expectedCellCount = projection.sizes.length * SCENARIOS.length * SCENARIOS.length;
  const output = {
    ok: true,
    version: VERSION,
    schemaVersion: SCHEMA_VERSION,
    requestHash,
    sourceLedgerHash: sourceResult.ledgerHash,
    sourceScenarioContextHash: sourceResult.scenarioContextHash,
    status: 'computed_synthetic_sensitivity',
    sizesEur: projection.sizes.slice(),
    projectionPolicy: {
      policyId: request.projection.policyId,
      domain: deepClone(request.projection.domain),
      parameterStability: request.projection.parameterStability,
      quantityTreatment: request.projection.quantityTreatment
    },
    edgeProfileReceipt: {
      mode: request.edgeProfile.mode,
      provenance: request.edgeProfile.provenance,
      alignmentKeyHash: request.edgeProfile.alignmentKeyHash
    },
    projectedLedgers: projectedRows.map((row) => ({
      sizeEur: row.sizeEur,
      ledgerHash: row.result.ledgerHash,
      scenarioContextHash: row.result.scenarioContextHash,
      coverageStatus: row.result.coverage.status,
      totalCostEur: deepClone(row.result.totalCostEur),
      breakEvenGrossRate: deepClone(row.result.breakEvenGrossRate)
    })),
    costScenarios: SCENARIOS.slice(),
    edgeScenarios: SCENARIOS.slice(),
    cells,
    boundaries,
    unassessedLayers: [
      'capital_timeline_settlement_and_frequency',
      'edge_capacity_and_decay',
      'external_data_quality',
      'liquidity_market_impact_and_fill',
      'quantity_lot_tick_and_minimum_order',
      'taxes_or_fees_outside_declared_policy'
    ],
    issues: [],
    invariants: {
      cartesianCellCount: cells.length === expectedCellCount,
      finiteOutput: true,
      noOptimization: true,
      noInterpolationForExplicitProfile: edge.mode !== 'explicit_by_size' || boundaries.exact.length === 0
    },
    limitations
  };
  ledgerEngine.assertFiniteTree(output);
  return output;
}

module.exports = {
  VERSION,
  SCHEMA_VERSION,
  PROJECTION_POLICY,
  TOLERANCE,
  SCENARIOS,
  close,
  evaluate,
  projectLedger,
  marginState
};
