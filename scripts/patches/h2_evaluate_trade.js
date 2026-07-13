const RESULT_BASIS_META = Object.freeze({
  simulated: { label: "Simulé par Breaktest", shortLabel: "Simulé", observed: false },
  gross_observed: { label: "Brut observé", shortLabel: "Brut", observed: true, tradeKey: "gross" },
  fixed_net_observed: { label: "Net fixe observé", shortLabel: "Net fixe", observed: true, tradeKey: "fixedNet" },
  full_cost_observed: { label: "Full-cost observé", shortLabel: "Full-cost", observed: true, tradeKey: "fullCost" },
});

function normalizedResultBasis(value) {
  return Object.prototype.hasOwnProperty.call(RESULT_BASIS_META, value) ? value : "simulated";
}

function resultBasisMeta(value) {
  return RESULT_BASIS_META[normalizedResultBasis(value)];
}

function scaledObservedBasis(trade, tradeKey, notional) {
  const legacyGross = {
    return: trade.grossReturn,
    provenance: tradeKey === "gross" ? "observed" : "fallback",
    pnlProvenance: trade.grossPnlDerived ? "derived" : "observed",
    returnProvenance: trade.grossReturnDerived ? "derived" : "observed",
    fallbackFrom: tradeKey === "gross" ? null : tradeKey === "fixedNet" ? "gross" : "fixedNet",
    pairDifference: 0,
    pairInconsistent: false,
  };
  const source = trade.pnlBases?.[tradeKey] || legacyGross;
  return {
    pnl: notional * source.return,
    return: source.return,
    provenance: source.provenance,
    pnlProvenance: source.pnlProvenance,
    returnProvenance: source.returnProvenance,
    fallbackFrom: source.fallbackFrom,
    pairDifference: source.pairDifference,
    pairInconsistent: source.pairInconsistent,
  };
}

function evaluateTrade(trade, model, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config, resultBasis: normalizedResultBasis(config.resultBasis ?? DEFAULT_CONFIG.resultBasis) };
  const position = positionForTrade(trade, cfg);
  const costs = executionCosts(trade, position.notional, cfg);
  const edge = edgeForTrade(trade, model, cfg);
  const minimumNetEdge = Math.max(0, cfg.minNetEdgeBps) / 10_000;
  const expectedNetEdge = edge.posteriorMean - costs.rate;
  const conservativeNetEdge = edge.conservativeEdge - costs.rate;
  const enoughTraining = model.trainingCount >= cfg.minTrainingObservations;
  let status = "keep";
  let reason = "Edge prudent supérieur au coût total";
  if (!position.executable) {
    status = "remove";
    reason = "Position non exécutable avec ce capital";
  } else if (!enoughTraining) {
    status = "observe";
    reason = "Historique insuffisant pour une décision robuste";
  } else if (conservativeNetEdge < minimumNetEdge) {
    status = "remove";
    reason = conservativeNetEdge < 0
      ? "Coût total supérieur à l’edge prudent"
      : "Marge nette inférieure au seuil de sécurité";
  }

  const observedGross = scaledObservedBasis(trade, "gross", position.notional);
  const observedFixedNet = scaledObservedBasis(trade, "fixedNet", position.notional);
  const observedFullCost = scaledObservedBasis(trade, "fullCost", position.notional);
  const simulatedNetPnl = position.executable ? observedGross.pnl - costs.total : 0;
  const resultBases = {
    simulated: {
      pnl: simulatedNetPnl,
      return: position.notional > 0 ? simulatedNetPnl / position.notional : 0,
      provenance: "simulated",
      fallbackFrom: null,
      observed: false,
    },
    gross_observed: { ...observedGross, observed: true },
    fixed_net_observed: { ...observedFixedNet, observed: true },
    full_cost_observed: { ...observedFullCost, observed: true },
  };
  const resultBasis = cfg.resultBasis;
  const selected = resultBases[resultBasis];
  const realizedNetPnl = position.executable ? selected.pnl : 0;
  return {
    trade,
    position,
    costs,
    edge,
    expectedNetEdge,
    conservativeNetEdge,
    minimumNetEdge,
    status,
    preTurnoverStatus: status,
    reason,
    realizedGrossPnl: observedGross.pnl,
    observedGrossPnl: observedGross.pnl,
    observedFixedNetPnl: observedFixedNet.pnl,
    observedFullCostPnl: observedFullCost.pnl,
    simulatedNetPnl,
    resultBases,
    resultBasis,
    resultBasisLabel: resultBasisMeta(resultBasis).label,
    resultProvenance: selected.provenance,
    resultFallbackFrom: selected.fallbackFrom,
    realizedNetPnl,
    turnoverUnits: cfg.capital > 0 ? 2 * position.notional / cfg.capital : 0,
  };
}
