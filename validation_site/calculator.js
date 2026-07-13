(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.BreaktestCalculator = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CALCULATION_VERSION = "cost-intelligence-validation-1";
  const ACTIVITY_TYPES = new Set(["single_buy", "round_trip"]);
  const COMPONENT_ORDER = ["commission", "fx", "spread", "slippage"];
  const LABELS = { commission: "Commissions", fx: "Change", spread: "Spread", slippage: "Slippage" };

  function cleanZero(value) {
    if (!Number.isFinite(value)) return value;
    return Object.is(value, -0) || Math.abs(value) < 1e-12 ? 0 : value;
  }

  function parseLocalizedNumber(raw, options) {
    const settings = Object.assign({ required: true, positive: false, nonNegative: false }, options || {});
    if (raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "")) {
      return { status: "missing", value: null, message: settings.required ? "Indique une valeur." : null };
    }
    if (typeof raw === "number") {
      if (!Number.isFinite(raw)) return { status: "invalid", value: null, message: "Entre un nombre fini." };
      if (settings.positive && raw <= 0) return { status: "invalid", value: null, message: "Indique un montant supérieur à 0." };
      if (settings.nonNegative && raw < 0) return { status: "invalid", value: null, message: "La valeur ne peut pas être négative." };
      return { status: "valid", value: cleanZero(raw), message: null };
    }
    const normalized = String(raw).trim().replace(/\s+/g, "").replace(",", ".");
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return { status: "invalid", value: null, message: "Entre un nombre valide." };
    const value = Number(normalized);
    if (!Number.isFinite(value)) return { status: "invalid", value: null, message: "Entre un nombre fini." };
    if (settings.positive && value <= 0) return { status: "invalid", value: null, message: "Indique un montant supérieur à 0." };
    if (settings.nonNegative && value < 0) return { status: "invalid", value: null, message: "La valeur ne peut pas être négative." };
    return { status: "valid", value: cleanZero(value), message: null };
  }

  function normalizeScenario(raw) {
    const input = raw || {};
    const states = {
      capitalEur: parseLocalizedNumber(input.capitalEur, { required: false, nonNegative: true }),
      orderAmountEur: parseLocalizedNumber(input.orderAmountEur, { required: true, positive: true }),
      monthlyFrequency: parseLocalizedNumber(input.monthlyFrequency, { required: true, nonNegative: true }),
      commissionPerSideEur: parseLocalizedNumber(input.commissionPerSideEur, { required: true, nonNegative: true }),
      fxPerConversionPercent: parseLocalizedNumber(input.fxPerConversionPercent, { required: true, nonNegative: true }),
      spreadPercent: parseLocalizedNumber(input.spreadPercent, { required: true, nonNegative: true }),
      slippagePercent: parseLocalizedNumber(input.slippagePercent, { required: true, nonNegative: true }),
    };
    const activityType = ACTIVITY_TYPES.has(input.activityType) ? input.activityType : null;
    states.activityType = activityType ? { status: "valid", value: activityType, message: null } : { status: "invalid", value: null, message: "Choisis un type d’activité." };
    const blockingFields = ["orderAmountEur", "monthlyFrequency", "commissionPerSideEur", "fxPerConversionPercent", "spreadPercent", "slippagePercent", "activityType"];
    const errors = {};
    for (const [key, state] of Object.entries(states)) {
      if (state.status === "invalid" || (blockingFields.includes(key) && state.status === "missing")) errors[key] = state.message || "Valeur invalide.";
    }
    if (Object.keys(errors).length) return { ok: false, states, errors, values: null };
    return {
      ok: true,
      states,
      errors: {},
      values: {
        capitalEur: states.capitalEur.status === "valid" && states.capitalEur.value > 0 ? states.capitalEur.value : null,
        orderAmountEur: states.orderAmountEur.value,
        activityType,
        monthlyFrequency: states.monthlyFrequency.value,
        commissionPerSideEur: states.commissionPerSideEur.value,
        fxPerConversionRate: states.fxPerConversionPercent.value / 100,
        spreadRate: states.spreadPercent.value / 100,
        slippageRate: states.slippagePercent.value / 100,
      },
    };
  }

  function calculateNormalized(values, provenance) {
    const source = values || {};
    const sideCount = source.activityType === "round_trip" ? 2 : 1;
    const annualOperations = cleanZero(source.monthlyFrequency * 12);
    const costs = {
      commission: cleanZero(source.commissionPerSideEur * sideCount),
      fx: cleanZero(source.orderAmountEur * source.fxPerConversionRate * sideCount),
      spread: cleanZero(source.orderAmountEur * source.spreadRate),
      slippage: cleanZero(source.orderAmountEur * source.slippageRate),
    };
    const totalCostPerOperationEur = cleanZero(COMPONENT_ORDER.reduce((total, key) => total + costs[key], 0));
    const costRatePerOperation = cleanZero(totalCostPerOperationEur / source.orderAmountEur);
    const annualCostEur = cleanZero(totalCostPerOperationEur * annualOperations);
    const annualCostToCapitalRate = source.capitalEur && source.capitalEur > 0 ? cleanZero(annualCostEur / source.capitalEur) : null;
    const componentProvenance = provenance || "user_assumption";
    const inputValues = {
      commission: { value: source.commissionPerSideEur, unit: "EUR/côté" },
      fx: { value: source.fxPerConversionRate, unit: "taux/côté" },
      spread: { value: source.spreadRate, unit: "taux/scénario" },
      slippage: { value: source.slippageRate, unit: "taux/scénario" },
    };
    const components = COMPONENT_ORDER.map((key) => ({
      key, label: LABELS[key], inputValue: inputValues[key].value, inputUnit: inputValues[key].unit,
      status: "valid", provenance: componentProvenance, costEur: costs[key],
      share: totalCostPerOperationEur > 0 ? cleanZero(costs[key] / totalCostPerOperationEur) : 0,
    }));
    return {
      version: CALCULATION_VERSION, inputs: Object.assign({}, source), sideCount, annualOperations, components,
      totalCostPerOperationEur, costRatePerOperation, annualCostEur, annualCostToCapitalRate,
      breakEvenGrossRatePerOperation: costRatePerOperation, hasAnyFriction: totalCostPerOperationEur > 0,
    };
  }

  function calculate(raw, options) {
    const normalized = normalizeScenario(raw);
    if (!normalized.ok) return normalized;
    return { ok: true, states: normalized.states, errors: {}, values: normalized.values, result: calculateNormalized(normalized.values, options && options.provenance) };
  }

  function buildComparisons(result) {
    return [
      { key: "current", label: "Scénario actuel", result: calculateNormalized(result.inputs, result.components[0]?.provenance || "user_assumption") },
      { key: "double_order", label: "Ordre ×2", result: calculateNormalized(Object.assign({}, result.inputs, { orderAmountEur: result.inputs.orderAmountEur * 2 }), result.components[0]?.provenance || "user_assumption") },
      { key: "half_frequency", label: "Fréquence ÷2", result: calculateNormalized(Object.assign({}, result.inputs, { monthlyFrequency: result.inputs.monthlyFrequency / 2 }), result.components[0]?.provenance || "user_assumption") },
    ];
  }

  function finiteDisplayValue(value) { return Number.isFinite(value) ? cleanZero(value) : null; }
  function formatEur(value) {
    const safe = finiteDisplayValue(value);
    if (safe === null) return "Indisponible";
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(safe);
  }
  function formatPercent(rate, digits) {
    const safe = finiteDisplayValue(rate);
    if (safe === null) return "Indisponible";
    return new Intl.NumberFormat("fr-FR", { style: "percent", minimumFractionDigits: digits === undefined ? 2 : digits, maximumFractionDigits: digits === undefined ? 2 : digits }).format(safe);
  }
  function formatFrequency(value) {
    const safe = finiteDisplayValue(value);
    if (safe === null) return "Indisponible";
    return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(safe);
  }

  function buildSharePayload(result, options) {
    const includeCapital = Boolean(options && options.includeCapital);
    const payload = {
      version: result.version, activityType: result.inputs.activityType, orderAmountEur: result.inputs.orderAmountEur,
      monthlyFrequency: result.inputs.monthlyFrequency, commissionPerSideEur: result.inputs.commissionPerSideEur,
      fxPerConversionRate: result.inputs.fxPerConversionRate, spreadRate: result.inputs.spreadRate, slippageRate: result.inputs.slippageRate,
      totalCostPerOperationEur: result.totalCostPerOperationEur, costRatePerOperation: result.costRatePerOperation,
      annualCostEur: result.annualCostEur, annualCostToCapitalRate: includeCapital ? result.annualCostToCapitalRate : null,
    };
    if (includeCapital && result.inputs.capitalEur !== null) payload.capitalEur = result.inputs.capitalEur;
    return payload;
  }

  function shareText(result, options) {
    const payload = buildSharePayload(result, options);
    const activity = payload.activityType === "round_trip" ? "aller-retour" : "achat simple";
    const lines = [
      "Breaktest Cost Intelligence",
      `Scénario : ${activity}, ordre ${formatEur(payload.orderAmountEur)}, fréquence ${formatFrequency(payload.monthlyFrequency)}/mois`,
      `Frictions estimées : ${formatEur(payload.totalCostPerOperationEur)} par opération (${formatPercent(payload.costRatePerOperation)})`,
      `Impact annuel selon cette fréquence : ${formatEur(payload.annualCostEur)}`,
      `Version du calcul : ${payload.version}`,
      "Hypothèses saisies par l’utilisateur. Aucun conseil en investissement.",
    ];
    if (options && options.includeCapital && payload.annualCostToCapitalRate !== null) lines.splice(4, 0, `Impact annuel sur le capital indiqué : ${formatPercent(payload.annualCostToCapitalRate)}`);
    return lines.join("\n");
  }

  const DEMO_SCENARIOS = {
    small_round_trip: { label: "Très petit capital", provenance: "synthetic_demo", values: { capitalEur: 500, orderAmountEur: 100, activityType: "round_trip", monthlyFrequency: 4, commissionPerSideEur: 1, fxPerConversionPercent: 0.25, spreadPercent: 0.10, slippagePercent: 0.10 } },
    intermediate_round_trip: { label: "Capital intermédiaire", provenance: "synthetic_demo", values: { capitalEur: 5000, orderAmountEur: 500, activityType: "round_trip", monthlyFrequency: 4, commissionPerSideEur: 1, fxPerConversionPercent: 0.25, spreadPercent: 0.10, slippagePercent: 0.10 } },
    monthly_eur_buy: { label: "Achat mensuel en euros", provenance: "synthetic_demo", values: { capitalEur: 5000, orderAmountEur: 300, activityType: "single_buy", monthlyFrequency: 1, commissionPerSideEur: 1, fxPerConversionPercent: 0, spreadPercent: 0.05, slippagePercent: 0.05 } },
    zero_commission_round_trip: { label: "Commission affichée à zéro", provenance: "synthetic_demo", values: { capitalEur: 10000, orderAmountEur: 1000, activityType: "round_trip", monthlyFrequency: 2, commissionPerSideEur: 0, fxPerConversionPercent: 0.25, spreadPercent: 0.10, slippagePercent: 0.10 } },
  };

  return { CALCULATION_VERSION, COMPONENT_ORDER, DEMO_SCENARIOS, cleanZero, parseLocalizedNumber, normalizeScenario, calculateNormalized, calculate, buildComparisons, formatEur, formatPercent, formatFrequency, buildSharePayload, shareText };
});
