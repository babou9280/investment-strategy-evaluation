function compareTurnoverPriority(left, right) {
  return right.conservativeNetEdge - left.conservativeNetEdge
    || right.expectedNetEdge - left.expectedNetEdge
    || String(left.trade.id).localeCompare(String(right.trade.id));
}

function applyTurnoverBudget(evaluations, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const years = sampleSpanYears(evaluations);
  const windowMs = 365.25 * 86_400_000;
  const budgetUnits = Math.max(0, cfg.turnoverCapAnnual);
  const ordered = [...evaluations].sort((a, b) => compareReplayTrades(a.trade, b.trade));
  const accepted = [];
  let totalAcceptedUnits = 0;
  let peakRollingUnits = 0;
  let sequence = 0;

  for (let offset = 0; offset < ordered.length;) {
    const decisionTime = validDate(ordered[offset].trade.entryDate);
    if (decisionTime === null) {
      for (; offset < ordered.length && validDate(ordered[offset].trade.entryDate) === null; offset += 1) {
        const evaluation = ordered[offset];
        evaluation.turnoverDiagnostics = {
          sequence: sequence += 1,
          decisionTime: null,
          decisionDateValid: false,
          windowDays: 365.25,
          budgetUnits,
          rollingUsedBefore: 0,
          requestedUnits: evaluation.turnoverUnits,
          rollingUsedAfter: 0,
          remainingAfter: budgetUnits,
          outcome: "invalid-date",
          rankWithinDate: null,
        };
      }
      continue;
    }

    let end = offset + 1;
    while (end < ordered.length && validDate(ordered[end].trade.entryDate) === decisionTime) end += 1;
    const cutoff = decisionTime - windowMs;
    while (accepted.length && accepted[0].time <= cutoff) accepted.shift();
    let rollingUsed = sum(accepted.map((item) => item.units));
    const group = ordered.slice(offset, end);
    const eligible = group.filter((evaluation) => evaluation.preTurnoverStatus === "keep").sort(compareTurnoverPriority);
    const ranks = new Map(eligible.map((evaluation, index) => [evaluation, index + 1]));

    for (const evaluation of group) {
      if (evaluation.preTurnoverStatus !== "keep") {
        evaluation.turnoverDiagnostics = {
          sequence: sequence += 1,
          decisionTime,
          decisionDateValid: true,
          windowDays: 365.25,
          budgetUnits,
          rollingUsedBefore: rollingUsed,
          requestedUnits: evaluation.turnoverUnits,
          rollingUsedAfter: rollingUsed,
          remainingAfter: Math.max(0, budgetUnits - rollingUsed),
          outcome: evaluation.preTurnoverStatus,
          rankWithinDate: null,
        };
      }
    }

    for (const evaluation of eligible) {
      const requested = Math.max(0, evaluation.turnoverUnits);
      const before = rollingUsed;
      if (before + requested <= budgetUnits + EPS) {
        rollingUsed += requested;
        totalAcceptedUnits += requested;
        accepted.push({ time: decisionTime, units: requested });
        evaluation.status = "keep";
        evaluation.reason = "Edge prudent positif et budget glissant disponible";
        peakRollingUnits = Math.max(peakRollingUnits, rollingUsed);
        evaluation.turnoverDiagnostics = {
          sequence: sequence += 1,
          decisionTime,
          decisionDateValid: true,
          windowDays: 365.25,
          budgetUnits,
          rollingUsedBefore: before,
          requestedUnits: requested,
          rollingUsedAfter: rollingUsed,
          remainingAfter: Math.max(0, budgetUnits - rollingUsed),
          outcome: "keep",
          rankWithinDate: ranks.get(evaluation),
        };
      } else {
        evaluation.status = "remove";
        evaluation.reason = "Écarté par le budget glissant de turnover";
        evaluation.turnoverDiagnostics = {
          sequence: sequence += 1,
          decisionTime,
          decisionDateValid: true,
          windowDays: 365.25,
          budgetUnits,
          rollingUsedBefore: before,
          requestedUnits: requested,
          rollingUsedAfter: before,
          remainingAfter: Math.max(0, budgetUnits - before),
          outcome: "budget",
          rankWithinDate: ranks.get(evaluation),
        };
      }
    }
    offset = end;
  }

  return {
    evaluations: ordered,
    years,
    budgetUnits,
    usedUnits: totalAcceptedUnits,
    totalAcceptedUnits,
    peakRollingUnits,
    windowDays: 365.25,
  };
}
