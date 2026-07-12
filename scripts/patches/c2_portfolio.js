function selectReplayTrades(trades, sample) {
  if (sample === "backtest") return trades.filter((trade) => trade.sample === "backtest");
  if (sample === "all") return [...trades];
  return trades.filter((trade) => trade.sample === "live");
}

function compareReplayTrades(left, right) {
  const leftEntry = validDate(left.entryDate);
  const rightEntry = validDate(right.entryDate);
  if (leftEntry === null && rightEntry !== null) return 1;
  if (leftEntry !== null && rightEntry === null) return -1;
  if (leftEntry !== null && rightEntry !== null && leftEntry !== rightEntry) return leftEntry - rightEntry;
  return String(left.id).localeCompare(String(right.id));
}

function temporalTrainingSet(trades, decisionTrade) {
  const decisionEntry = validDate(decisionTrade.entryDate);
  const diagnostics = {
    decisionEntryValid: decisionEntry !== null,
    consideredBacktest: 0,
    eligibleCount: 0,
    excludedSelf: 0,
    excludedInvalidTrainingDates: 0,
    excludedFutureOrSame: 0,
  };
  const eligible = [];
  for (const candidate of trades) {
    if (candidate.sample !== "backtest") continue;
    if (candidate.id === decisionTrade.id) {
      diagnostics.excludedSelf += 1;
      continue;
    }
    diagnostics.consideredBacktest += 1;
    if (decisionEntry === null) continue;
    const candidateEntry = validDate(candidate.entryDate);
    const candidateExit = validDate(candidate.exitDate);
    if (candidateEntry === null || candidateExit === null || candidateEntry > candidateExit) {
      diagnostics.excludedInvalidTrainingDates += 1;
      continue;
    }
    if (candidateExit < decisionEntry) eligible.push(candidate);
    else diagnostics.excludedFutureOrSame += 1;
  }
  diagnostics.eligibleCount = eligible.length;
  return { trades: eligible, diagnostics };
}

function evaluatePortfolio(trades, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const replay = selectReplayTrades(trades, cfg.analysisSample).sort(compareReplayTrades);
  const baseEvaluations = replay.map((trade) => {
    const temporal = temporalTrainingSet(trades, trade);
    const model = fitEdgeModel(temporal.trades, cfg);
    const evaluation = evaluateTrade(trade, model, cfg);
    evaluation.model = model;
    evaluation.trainingDiagnostics = temporal.diagnostics;
    if (!temporal.diagnostics.decisionEntryValid) {
      evaluation.status = "observe";
      evaluation.preTurnoverStatus = "observe";
      evaluation.reason = "Date d’entrée invalide : entraînement temporel impossible";
    }
    return evaluation;
  });
  const turnover = applyTurnoverBudget(baseEvaluations, cfg);
  const evaluations = turnover.evaluations.sort((a, b) => compareReplayTrades(a.trade, b.trade));
  const kept = evaluations.filter((evaluation) => evaluation.status === "keep");
  const removed = evaluations.filter((evaluation) => evaluation.status === "remove");
  const observed = evaluations.filter((evaluation) => evaluation.status === "observe");
  const baselineNetPnl = sum(evaluations.map((evaluation) => evaluation.realizedNetPnl));
  const filteredNetPnl = sum(kept.map((evaluation) => evaluation.realizedNetPnl));
  const baselineCosts = sum(evaluations.map((evaluation) => evaluation.costs.total));
  const filteredCosts = sum(kept.map((evaluation) => evaluation.costs.total));
  const totalTurnoverAnnual = turnover.years > 0
    ? sum(evaluations.map((evaluation) => evaluation.turnoverUnits)) / turnover.years
    : 0;
  const keptTurnoverAnnual = turnover.years > 0 ? turnover.usedUnits / turnover.years : 0;
  const datedEvaluations = evaluations.filter((evaluation) => evaluation.trainingDiagnostics.decisionEntryValid);
  const referenceEvaluation = datedEvaluations.at(-1) || null;
  const referenceModel = referenceEvaluation?.model || fitEdgeModel([], cfg);
  const trainingCounts = evaluations.map((evaluation) => evaluation.model.trainingCount);
  const invalidDecisionDates = evaluations.filter((evaluation) => !evaluation.trainingDiagnostics.decisionEntryValid).length;
  return {
    config: cfg,
    model: referenceModel,
    referenceModel,
    referenceTradeId: referenceEvaluation?.trade.id || null,
    trainingSummary: {
      min: trainingCounts.length ? Math.min(...trainingCounts) : 0,
      max: trainingCounts.length ? Math.max(...trainingCounts) : 0,
      invalidDecisionDates,
      excludedInvalidTrainingDatesTotal: sum(evaluations.map((evaluation) => evaluation.trainingDiagnostics.excludedInvalidTrainingDates)),
    },
    evaluations,
    kept,
    removed,
    observed,
    baselineNetPnl,
    filteredNetPnl,
    deltaPnl: filteredNetPnl - baselineNetPnl,
    baselineCosts,
    filteredCosts,
    costsAvoided: baselineCosts - filteredCosts,
    baselineReturn: cfg.capital > 0 ? baselineNetPnl / cfg.capital : 0,
    filteredReturn: cfg.capital > 0 ? filteredNetPnl / cfg.capital : 0,
    retainedRate: evaluations.length ? kept.length / evaluations.length : 0,
    years: turnover.years,
    totalTurnoverAnnual,
    keptTurnoverAnnual,
    turnoverCapAnnual: cfg.turnoverCapAnnual,
  };
}

