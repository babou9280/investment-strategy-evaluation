(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BreaktestCapitalEfficiency = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 'capital-efficiency-lab-2';
  const TOLERANCE = 1e-12;

  function classifyNumber(value, options) {
    const opts = Object.assign({ required: false, min: -Infinity, max: Infinity, integer: false }, options || {});
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      return { status: opts.required ? 'invalid' : 'missing', value: null, reason: opts.required ? 'required' : 'missing' };
    }
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return { status: 'invalid', value: null, reason: 'not_finite_number' };
    }
    if (opts.integer && !Number.isInteger(value)) {
      return { status: 'invalid', value: null, reason: 'not_integer' };
    }
    if (value < opts.min || value > opts.max) {
      return { status: 'invalid', value: null, reason: 'out_of_range' };
    }
    return { status: 'valid', value, reason: null };
  }

  function unavailable(reason) {
    return { status: 'unavailable', reason, value: null };
  }

  function available(value, extra) {
    if (!Number.isFinite(value)) throw new Error('Non-finite computed value');
    const normalized = Object.is(value, -0) ? 0 : value;
    return Object.assign({ status: 'available', reason: null, value: normalized }, extra || {});
  }

  function close(a, b, tolerance) {
    const t = tolerance == null ? TOLERANCE : tolerance;
    return Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
  }

  function compute(raw) {
    const input = raw || {};
    const classified = {
      capitalEur: classifyNumber(input.capitalEur, { required: false, min: Number.MIN_VALUE }),
      orderNotionalEur: classifyNumber(input.orderNotionalEur, { required: true, min: Number.MIN_VALUE }),
      sideCount: classifyNumber(input.sideCount, { required: true, min: 1, max: 2, integer: true }),
      monthlyOperations: classifyNumber(input.monthlyOperations, { required: true, min: 0 }),
      commissionPerSideEur: classifyNumber(input.commissionPerSideEur, { required: true, min: 0 }),
      fxRatePerSide: classifyNumber(input.fxRatePerSide, { required: true, min: 0, max: 1 }),
      spreadTotalRate: classifyNumber(input.spreadTotalRate, { required: true, min: 0, max: 1 }),
      slippageTotalRate: classifyNumber(input.slippageTotalRate, { required: true, min: 0, max: 1 }),
      grossEdgeRate: classifyNumber(input.grossEdgeRate, { required: false }),
      retentionTargetRate: classifyNumber(input.retentionTargetRate, { required: false, min: 0, max: 1 }),
      annualDragBudgetRate: classifyNumber(input.annualDragBudgetRate, { required: false, min: 0, max: 1 }),
      targetNetRate: classifyNumber(input.targetNetRate, { required: false })
    };

    const errors = {};
    for (const [key, item] of Object.entries(classified)) {
      if (item.status === 'invalid') errors[key] = item.reason;
    }
    if (Object.keys(errors).length) {
      return { ok: false, version: VERSION, classified, errors, results: null };
    }

    const N = classified.orderNotionalEur.value;
    const k = classified.sideCount.value;
    const m = classified.monthlyOperations.value;
    const C = classified.commissionPerSideEur.value;
    const F = classified.fxRatePerSide.value;
    const S = classified.spreadTotalRate.value;
    const L = classified.slippageTotalRate.value;
    const K = classified.capitalEur.status === 'valid' ? classified.capitalEur.value : null;
    const G = classified.grossEdgeRate.status === 'valid' ? classified.grossEdgeRate.value : null;
    const R = classified.retentionTargetRate.status === 'valid' ? classified.retentionTargetRate.value : null;
    const B = classified.annualDragBudgetRate.status === 'valid' ? classified.annualDragBudgetRate.value : null;
    const Q = classified.targetNetRate.status === 'valid' ? classified.targetNetRate.value : null;

    const fixedCostEur = k * C;
    const variableFloorRate = k * F + S + L;
    const variableCostEur = N * variableFloorRate;
    const totalCostEur = fixedCostEur + variableCostEur;
    const breakEvenGrossRate = totalCostEur / N;
    const annualOperations = 12 * m;
    const annualCostEur = totalCostEur * annualOperations;

    const results = {
      fixedCostEur: available(fixedCostEur),
      variableFloorRate: available(variableFloorRate),
      variableCostEur: available(variableCostEur),
      totalCostEur: available(totalCostEur),
      breakEvenGrossRate: available(breakEvenGrossRate),
      annualOperations: available(annualOperations),
      annualCostEur: available(annualCostEur),
      annualDragToCapitalRate: K == null ? unavailable('capital_missing') : available(annualCostEur / K),
      fixedCostShare: totalCostEur === 0 ? unavailable('total_cost_zero') : available(fixedCostEur / totalCostEur),
      variableCostShare: totalCostEur === 0 ? unavailable('total_cost_zero') : available(variableCostEur / totalCostEur),
      fixedVariableEqualOrder: variableFloorRate === 0 ? unavailable('variable_floor_zero') : available(fixedCostEur / variableFloorRate),
      grossEdgeRate: G == null ? unavailable('gross_edge_missing') : available(G),
      netEdgeRate: unavailable('gross_edge_missing'),
      grossEdgeEur: unavailable('gross_edge_missing'),
      netEdgeEur: unavailable('gross_edge_missing'),
      edgeAbsorptionRate: unavailable('gross_edge_missing'),
      edgeRetainedRate: unavailable('gross_edge_missing'),
      minimumOrderForPositiveNet: unavailable('gross_edge_missing'),
      minimumOrderForRetention: R == null ? unavailable('retention_target_missing') : unavailable('gross_edge_missing'),
      maxMonthlyOperationsUnderBudget: (B == null || K == null) ? unavailable(B == null ? 'budget_missing' : 'capital_missing') : unavailable('not_computed'),
      requiredGrossRateForTargetNet: Q == null ? unavailable('target_net_missing') : available(Q + breakEvenGrossRate),
      annualGrossEdgeEur: unavailable('gross_edge_missing'),
      annualNetEdgeEur: unavailable('gross_edge_missing'),
      annualGrossEdgeToCapitalRate: unavailable('gross_edge_missing'),
      annualNetEdgeToCapitalRate: unavailable('gross_edge_missing'),
      retentionTargetRate: R == null ? unavailable('retention_target_missing') : available(R),
      annualDragBudgetRate: B == null ? unavailable('budget_missing') : available(B),
      targetNetRate: Q == null ? unavailable('target_net_missing') : available(Q),
      primaryState: G == null ? 'threshold_only' : null,
      provenance: input.provenance === 'synthetic_demo' ? 'synthetic_demo' : 'user_assumption'
    };

    if (G != null) {
      const netEdgeRate = G - breakEvenGrossRate;
      const grossEdgeEur = N * G;
      const netEdgeEur = N * netEdgeRate;
      results.netEdgeRate = available(netEdgeRate);
      results.grossEdgeEur = available(grossEdgeEur);
      results.netEdgeEur = available(netEdgeEur);
      results.annualGrossEdgeEur = available(grossEdgeEur * annualOperations, { qualification: 'arithmetic_projection' });
      results.annualNetEdgeEur = available(netEdgeEur * annualOperations, { qualification: 'arithmetic_projection' });
      results.annualGrossEdgeToCapitalRate = K == null ? unavailable('capital_missing') : available((grossEdgeEur * annualOperations) / K, { qualification: 'arithmetic_projection' });
      results.annualNetEdgeToCapitalRate = K == null ? unavailable('capital_missing') : available((netEdgeEur * annualOperations) / K, { qualification: 'arithmetic_projection' });

      if (G > 0) {
        const absorption = breakEvenGrossRate / G;
        const retained = netEdgeRate / G;
        results.edgeAbsorptionRate = available(absorption);
        results.edgeRetainedRate = available(retained);
      } else {
        results.edgeAbsorptionRate = unavailable('gross_edge_non_positive');
        results.edgeRetainedRate = unavailable('gross_edge_non_positive');
      }

      const positiveDenominator = G - variableFloorRate;
      results.minimumOrderForPositiveNet = positiveDenominator <= 0
        ? unavailable('structurally_unreachable')
        : available(fixedCostEur / positiveDenominator, {
            boundary: fixedCostEur === 0 ? 'no_positive_minimum_from_fixed_costs' : 'strictly_greater_for_positive_margin'
          });

      if (R != null) {
        if (G <= 0) {
          results.minimumOrderForRetention = unavailable('gross_edge_non_positive');
        } else {
          const retentionDenominator = G * (1 - R) - variableFloorRate;
          if (retentionDenominator < -TOLERANCE) {
            results.minimumOrderForRetention = unavailable('structurally_unreachable');
          } else if (Math.abs(retentionDenominator) <= TOLERANCE) {
            results.minimumOrderForRetention = fixedCostEur === 0
              ? available(0, { boundary: 'no_positive_minimum_from_fixed_costs' })
              : unavailable('structurally_unreachable');
          } else {
            results.minimumOrderForRetention = available(fixedCostEur / retentionDenominator, {
              boundary: fixedCostEur === 0 ? 'no_positive_minimum_from_fixed_costs' : 'at_least_for_target'
            });
          }
        }
      }

      if (netEdgeRate <= 0) {
        results.primaryState = 'edge_fully_absorbed';
      } else if (R != null && G > 0) {
        results.primaryState = results.edgeRetainedRate.value >= R - TOLERANCE
          ? 'retention_target_met'
          : 'edge_partially_retained';
      }
    }

    if (B != null && K != null) {
      results.maxMonthlyOperationsUnderBudget = totalCostEur === 0
        ? unavailable('unbounded_within_model')
        : available((B * K) / (12 * totalCostEur), { boundary: 'maximum_arithmetic_frequency' });
    }

    const invariants = {
      breakEvenAboveFloor: breakEvenGrossRate + TOLERANCE >= variableFloorRate,
      costReconciliation: close(fixedCostEur + variableCostEur, totalCostEur),
      pnlReconciliation: G == null ? null : close((N * G) - totalCostEur, results.netEdgeEur.value),
      edgeSharesReconciliation: G == null || G <= 0 ? null : close(results.edgeAbsorptionRate.value + results.edgeRetainedRate.value, 1),
      costSharesReconciliation: totalCostEur === 0 ? null : close(results.fixedCostShare.value + results.variableCostShare.value, 1)
    };

    const orderFactors = [0.5, 1, 2, 5];
    const orderSensitivity = orderFactors.map(function (factor) {
      const order = N * factor;
      const threshold = fixedCostEur / order + variableFloorRate;
      return { orderNotionalEur: order, breakEvenGrossRate: Object.is(threshold, -0) ? 0 : threshold };
    });

    const frequencyFactors = [0.5, 1, 2];
    const frequencySensitivity = frequencyFactors.map(function (factor) {
      const monthly = m * factor;
      return { monthlyOperations: monthly, annualCostEur: totalCostEur * monthly * 12 };
    });

    return {
      ok: true,
      version: VERSION,
      classified,
      errors: {},
      inputs: { K, N, k, m, C, F, S, L, G, R, B, Q },
      results,
      invariants,
      sensitivity: { order: orderSensitivity, frequency: frequencySensitivity }
    };
  }

  function assertFiniteTree(value, path) {
    const location = path || 'root';
    if (typeof value === 'number' && (!Number.isFinite(value) || Object.is(value, -0))) {
      throw new Error('Invalid numeric value at ' + location);
    }
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { assertFiniteTree(item, location + '[' + index + ']'); });
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) { assertFiniteTree(value[key], location + '.' + key); });
    }
    return true;
  }

  return { VERSION, TOLERANCE, classifyNumber, compute, close, assertFiniteTree };
});