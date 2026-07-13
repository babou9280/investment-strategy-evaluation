(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BreaktestCapitalEfficiency = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 'capital-efficiency-lab-3-edge-range';
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
    return { status: 'valid', value: Object.is(value, -0) ? 0 : value, reason: null };
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

  function strictlyAbove(a, b) {
    return a > b && !close(a, b);
  }

  function atOrBelow(a, b) {
    return a < b || close(a, b);
  }

  function addRangeValidation(classified, errors) {
    const keys = ['grossEdgeLowRate', 'grossEdgeBaseRate', 'grossEdgeHighRate'];
    const point = classified.grossEdgeRate;
    const presentRangeKeys = keys.filter(key => classified[key].status !== 'missing');
    const validRangeKeys = keys.filter(key => classified[key].status === 'valid');
    const pointPresent = point.status !== 'missing';

    if (pointPresent && presentRangeKeys.length > 0) {
      errors.grossEdgeRate = 'edge_mode_conflict';
      keys.forEach(key => { errors[key] = 'edge_mode_conflict'; });
      return 'invalid';
    }

    if (presentRangeKeys.length > 0 && validRangeKeys.length !== keys.length) {
      keys.forEach(key => {
        if (classified[key].status === 'missing') errors[key] = 'range_incomplete';
      });
      return 'invalid';
    }

    if (validRangeKeys.length === keys.length) {
      const low = classified.grossEdgeLowRate.value;
      const base = classified.grossEdgeBaseRate.value;
      const high = classified.grossEdgeHighRate.value;
      if (low > base) {
        errors.grossEdgeLowRate = 'range_order_invalid';
        errors.grossEdgeBaseRate = 'range_order_invalid';
      }
      if (base > high) {
        errors.grossEdgeBaseRate = 'range_order_invalid';
        errors.grossEdgeHighRate = 'range_order_invalid';
      }
      return Object.keys(errors).length ? 'invalid' : 'range_estimate';
    }

    return point.status === 'valid' ? 'point_estimate' : 'threshold_only';
  }

  function computeRangeHypothesis(grossEdgeRate, context) {
    const netEdgeRate = grossEdgeRate - context.breakEvenGrossRate;
    const netEdgeEur = context.N * netEdgeRate;
    const headroomToVariableFloor = grossEdgeRate - context.variableFloorRate;
    const positiveDenominator = grossEdgeRate - context.variableFloorRate;

    return {
      grossEdgeRate: available(grossEdgeRate),
      netEdgeRate: available(netEdgeRate),
      netEdgeEur: available(netEdgeEur),
      headroomToBreakEven: available(netEdgeRate),
      headroomToVariableFloor: available(headroomToVariableFloor),
      edgeAbsorptionRate: grossEdgeRate > 0
        ? available(context.breakEvenGrossRate / grossEdgeRate)
        : unavailable('gross_edge_non_positive'),
      edgeRetainedRate: grossEdgeRate > 0
        ? available(netEdgeRate / grossEdgeRate)
        : unavailable('gross_edge_non_positive'),
      minimumOrderForPositiveNet: atOrBelow(grossEdgeRate, context.variableFloorRate)
        ? unavailable('structurally_unreachable')
        : available(context.fixedCostEur / positiveDenominator, {
            boundary: context.fixedCostEur === 0
              ? 'no_positive_minimum_from_fixed_costs'
              : 'strictly_greater_for_positive_margin'
          }),
      provenance: context.provenance
    };
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
      grossEdgeLowRate: classifyNumber(input.grossEdgeLowRate, { required: false }),
      grossEdgeBaseRate: classifyNumber(input.grossEdgeBaseRate, { required: false }),
      grossEdgeHighRate: classifyNumber(input.grossEdgeHighRate, { required: false }),
      retentionTargetRate: classifyNumber(input.retentionTargetRate, { required: false, min: 0, max: 1 }),
      annualDragBudgetRate: classifyNumber(input.annualDragBudgetRate, { required: false, min: 0, max: 1 }),
      targetNetRate: classifyNumber(input.targetNetRate, { required: false })
    };

    const errors = {};
    for (const [key, item] of Object.entries(classified)) {
      if (item.status === 'invalid') errors[key] = item.reason;
    }
    const edgeMode = addRangeValidation(classified, errors);
    if (Object.keys(errors).length) {
      return { ok: false, version: VERSION, edgeMode, classified, errors, results: null };
    }

    const N = classified.orderNotionalEur.value;
    const k = classified.sideCount.value;
    const m = classified.monthlyOperations.value;
    const C = classified.commissionPerSideEur.value;
    const F = classified.fxRatePerSide.value;
    const S = classified.spreadTotalRate.value;
    const L = classified.slippageTotalRate.value;
    const K = classified.capitalEur.status === 'valid' ? classified.capitalEur.value : null;
    const G = edgeMode === 'point_estimate' ? classified.grossEdgeRate.value : null;
    const GLow = edgeMode === 'range_estimate' ? classified.grossEdgeLowRate.value : null;
    const GBase = edgeMode === 'range_estimate' ? classified.grossEdgeBaseRate.value : null;
    const GHigh = edgeMode === 'range_estimate' ? classified.grossEdgeHighRate.value : null;
    const R = classified.retentionTargetRate.status === 'valid' ? classified.retentionTargetRate.value : null;
    const B = classified.annualDragBudgetRate.status === 'valid' ? classified.annualDragBudgetRate.value : null;
    const Q = classified.targetNetRate.status === 'valid' ? classified.targetNetRate.value : null;
    const provenance = input.provenance === 'synthetic_demo' ? 'synthetic_demo' : 'user_assumption';

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
      grossEdgeRate: G == null ? unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing') : available(G),
      netEdgeRate: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      grossEdgeEur: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      netEdgeEur: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      edgeAbsorptionRate: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      edgeRetainedRate: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      minimumOrderForPositiveNet: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      minimumOrderForRetention: R == null ? unavailable('retention_target_missing') : unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      maxMonthlyOperationsUnderBudget: (B == null || K == null) ? unavailable(B == null ? 'budget_missing' : 'capital_missing') : unavailable('not_computed'),
      requiredGrossRateForTargetNet: Q == null ? unavailable('target_net_missing') : available(Q + breakEvenGrossRate),
      annualGrossEdgeEur: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      annualNetEdgeEur: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      annualGrossEdgeToCapitalRate: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      annualNetEdgeToCapitalRate: unavailable(edgeMode === 'range_estimate' ? 'range_mode_selected' : 'gross_edge_missing'),
      retentionTargetRate: R == null ? unavailable('retention_target_missing') : available(R),
      annualDragBudgetRate: B == null ? unavailable('budget_missing') : available(B),
      targetNetRate: Q == null ? unavailable('target_net_missing') : available(Q),
      edgeMode,
      edgeRange: unavailable(edgeMode === 'point_estimate' ? 'point_mode_selected' : 'range_missing'),
      primaryState: edgeMode === 'threshold_only' ? 'threshold_only' : null,
      provenance
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
        results.edgeAbsorptionRate = available(breakEvenGrossRate / G);
        results.edgeRetainedRate = available(netEdgeRate / G);
      } else {
        results.edgeAbsorptionRate = unavailable('gross_edge_non_positive');
        results.edgeRetainedRate = unavailable('gross_edge_non_positive');
      }

      const positiveDenominator = G - variableFloorRate;
      results.minimumOrderForPositiveNet = atOrBelow(G, variableFloorRate)
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

      if (atOrBelow(G, breakEvenGrossRate)) {
        results.primaryState = 'edge_fully_absorbed';
      } else if (R != null && G > 0) {
        results.primaryState = strictlyAbove(results.edgeRetainedRate.value, R) || close(results.edgeRetainedRate.value, R)
          ? 'retention_target_met'
          : 'edge_partially_retained';
      } else {
        results.primaryState = 'edge_partially_retained';
      }
    }

    let rangeLow = null;
    let rangeBase = null;
    let rangeHigh = null;
    if (edgeMode === 'range_estimate') {
      const context = { N, fixedCostEur, variableFloorRate, breakEvenGrossRate, provenance };
      rangeLow = computeRangeHypothesis(GLow, context);
      rangeBase = computeRangeHypothesis(GBase, context);
      rangeHigh = computeRangeHypothesis(GHigh, context);
      const rangeShape = close(GLow, GBase) && close(GBase, GHigh) ? 'degenerate' : 'ordered';
      const rangeState = strictlyAbove(GLow, breakEvenGrossRate)
        ? 'survives_full_range'
        : atOrBelow(GHigh, breakEvenGrossRate)
          ? 'fails_full_range'
          : 'crosses_break_even';
      const variableFloorState = atOrBelow(GHigh, variableFloorRate)
        ? 'structurally_unreachable_full_range'
        : strictlyAbove(GLow, variableFloorRate)
          ? 'above_variable_floor_full_range'
          : 'variable_floor_crossing';

      results.edgeRange = {
        status: 'available',
        reason: null,
        value: null,
        mode: edgeMode,
        rangeShape,
        rangeState,
        variableFloorState,
        thresholdRate: available(breakEvenGrossRate),
        variableFloorRate: available(variableFloorRate),
        low: rangeLow,
        base: rangeBase,
        high: rangeHigh,
        provenance
      };
      results.primaryState = rangeState;
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
      pointPrimaryStateDefined: G == null ? null : results.primaryState !== null,
      costSharesReconciliation: totalCostEur === 0 ? null : close(results.fixedCostShare.value + results.variableCostShare.value, 1),
      rangeLowReconciliation: rangeLow == null ? null : close(GLow - breakEvenGrossRate, rangeLow.netEdgeRate.value),
      rangeBaseReconciliation: rangeBase == null ? null : close(GBase - breakEvenGrossRate, rangeBase.netEdgeRate.value),
      rangeHighReconciliation: rangeHigh == null ? null : close(GHigh - breakEvenGrossRate, rangeHigh.netEdgeRate.value),
      rangeLowEurReconciliation: rangeLow == null ? null : close(N * rangeLow.netEdgeRate.value, rangeLow.netEdgeEur.value),
      rangeBaseEurReconciliation: rangeBase == null ? null : close(N * rangeBase.netEdgeRate.value, rangeBase.netEdgeEur.value),
      rangeHighEurReconciliation: rangeHigh == null ? null : close(N * rangeHigh.netEdgeRate.value, rangeHigh.netEdgeEur.value),
      rangeMarginOrder: rangeLow == null ? null : rangeLow.netEdgeRate.value <= rangeBase.netEdgeRate.value && rangeBase.netEdgeRate.value <= rangeHigh.netEdgeRate.value,
      rangeEuroMarginOrder: rangeLow == null ? null : rangeLow.netEdgeEur.value <= rangeBase.netEdgeEur.value && rangeBase.netEdgeEur.value <= rangeHigh.netEdgeEur.value,
      rangeLowSharesReconciliation: rangeLow == null || GLow <= 0 ? null : close(rangeLow.edgeAbsorptionRate.value + rangeLow.edgeRetainedRate.value, 1),
      rangeBaseSharesReconciliation: rangeBase == null || GBase <= 0 ? null : close(rangeBase.edgeAbsorptionRate.value + rangeBase.edgeRetainedRate.value, 1),
      rangeHighSharesReconciliation: rangeHigh == null || GHigh <= 0 ? null : close(rangeHigh.edgeAbsorptionRate.value + rangeHigh.edgeRetainedRate.value, 1),
      rangeFrontierOrder: rangeLow == null || fixedCostEur <= 0 || !strictlyAbove(GLow, variableFloorRate)
        ? null
        : rangeHigh.minimumOrderForPositiveNet.value <= rangeBase.minimumOrderForPositiveNet.value
          && rangeBase.minimumOrderForPositiveNet.value <= rangeLow.minimumOrderForPositiveNet.value
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
      edgeMode,
      classified,
      errors: {},
      inputs: { K, N, k, m, C, F, S, L, G, GLow, GBase, GHigh, R, B, Q, edgeMode },
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

  return { VERSION, TOLERANCE, classifyNumber, compute, close, strictlyAbove, atOrBelow, assertFiniteTree };
});