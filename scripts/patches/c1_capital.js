function compareCapitalFundingPriority(left, right) {
  const leftRank = Number.isFinite(left.turnoverDiagnostics?.rankWithinDate)
    ? left.turnoverDiagnostics.rankWithinDate
    : Infinity;
  const rightRank = Number.isFinite(right.turnoverDiagnostics?.rankWithinDate)
    ? right.turnoverDiagnostics.rankWithinDate
    : Infinity;
  return leftRank - rightRank
    || compareTurnoverPriority(left, right)
    || compareReplayTrades(left.trade, right.trade);
}

function summarizeFundedTurnover(evaluations) {
  const windowMs = 365.25 * 86_400_000;
  const funded = evaluations
    .filter((evaluation) => evaluation.status === "keep" && validDate(evaluation.trade.entryDate) !== null)
    .sort((left, right) => compareReplayTrades(left.trade, right.trade));
  const accepted = [];
  let rollingUsed = 0;
  let totalAcceptedUnits = 0;
  let peakRollingUnits = 0;

  for (const evaluation of funded) {
    const decisionTime = validDate(evaluation.trade.entryDate);
    const cutoff = decisionTime - windowMs;
    while (accepted.length && accepted[0].time <= cutoff) {
      rollingUsed -= accepted.shift().units;
    }
    const units = Math.max(0, Number.isFinite(evaluation.turnoverUnits) ? evaluation.turnoverUnits : 0);
    accepted.push({ time: decisionTime, units });
    rollingUsed += units;
    totalAcceptedUnits += units;
    peakRollingUnits = Math.max(peakRollingUnits, rollingUsed);
  }

  return { totalAcceptedUnits, peakRollingUnits, windowDays: 365.25 };
}

function applyCapitalReservation(evaluations, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const capitalInitial = Math.max(0, Number.isFinite(cfg.capital) ? cfg.capital : 0);
  const ordered = [...evaluations].sort((left, right) => compareReplayTrades(left.trade, right.trade));
  let openPositions = [];
  let reserved = 0;
  let peakReserved = 0;
  let minimumFree = capitalInitial;
  let fundingRefused = 0;
  let sequence = 0;

  const diagnostics = (evaluation, values) => {
    evaluation.capitalDiagnostics = {
      sequence: sequence += 1,
      capitalInitial,
      preCapitalStatus: values.preCapitalStatus,
      decisionTime: values.decisionTime,
      entryDateValid: values.entryDateValid,
      exitDateValid: values.exitDateValid,
      releasedBeforeGroup: values.releasedBeforeGroup,
      reservedBefore: values.reservedBefore,
      freeBefore: Math.max(0, capitalInitial - values.reservedBefore),
      requestedNotional: values.requestedNotional,
      fundingDecision: values.fundingDecision,
      reservedAfter: values.reservedAfter,
      freeAfter: Math.max(0, capitalInitial - values.reservedAfter),
      releaseTime: values.releaseTime,
      releaseDate: values.releaseDate,
      rankWithinDate: evaluation.turnoverDiagnostics?.rankWithinDate ?? null,
      reason: evaluation.reason,
    };
  };

  for (let offset = 0; offset < ordered.length;) {
    const decisionTime = validDate(ordered[offset].trade.entryDate);
    let end = offset + 1;
    while (end < ordered.length && validDate(ordered[end].trade.entryDate) === decisionTime) end += 1;
    const group = ordered.slice(offset, end);

    if (decisionTime === null) {
      for (const evaluation of group) {
        const preCapitalStatus = evaluation.status;
        const requestedNotional = Number.isFinite(evaluation.position?.notional)
          ? Math.max(0, evaluation.position.notional)
          : 0;
        evaluation.status = "observe";
        evaluation.reason = "Date d’entrée invalide : réservation du capital impossible";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime: null,
          entryDateValid: false,
          exitDateValid: validDate(evaluation.trade.exitDate) !== null,
          releasedBeforeGroup: 0,
          reservedBefore: reserved,
          requestedNotional,
          fundingDecision: "invalid-entry-date",
          reservedAfter: reserved,
          releaseTime: null,
          releaseDate: evaluation.trade.exitDate || null,
        });
      }
      offset = end;
      continue;
    }

    let releasedBeforeGroup = 0;
    const stillOpen = [];
    for (const position of openPositions) {
      if (position.releaseTime <= decisionTime) {
        releasedBeforeGroup += position.notional;
        reserved -= position.notional;
      } else {
        stillOpen.push(position);
      }
    }
    openPositions = stillOpen;
    reserved = Math.max(0, reserved);

    const eligible = [];
    for (const evaluation of group) {
      const preCapitalStatus = evaluation.status;
      const requestedNotional = Number.isFinite(evaluation.position?.notional)
        ? Math.max(0, evaluation.position.notional)
        : NaN;
      const releaseTime = validDate(evaluation.trade.exitDate);
      if (releaseTime === null || releaseTime < decisionTime) {
        evaluation.status = "observe";
        evaluation.reason = releaseTime === null
          ? "Date de sortie invalide : réservation du capital impossible"
          : "Sortie antérieure à l’entrée : réservation du capital impossible";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: false,
          releasedBeforeGroup,
          reservedBefore: reserved,
          requestedNotional: Number.isFinite(requestedNotional) ? requestedNotional : 0,
          fundingDecision: releaseTime === null ? "invalid-exit-date" : "exit-before-entry",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      } else if (preCapitalStatus !== "keep") {
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: true,
          releasedBeforeGroup,
          reservedBefore: reserved,
          requestedNotional: Number.isFinite(requestedNotional) ? requestedNotional : 0,
          fundingDecision: "prefiltered",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      } else if (!Number.isFinite(requestedNotional) || requestedNotional <= EPS) {
        evaluation.status = "observe";
        evaluation.reason = "Nominal invalide : réservation du capital impossible";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: true,
          releasedBeforeGroup,
          reservedBefore: reserved,
          requestedNotional: 0,
          fundingDecision: "invalid-notional",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      } else {
        eligible.push({ evaluation, requestedNotional, releaseTime, preCapitalStatus });
      }
    }

    eligible.sort((left, right) => compareCapitalFundingPriority(left.evaluation, right.evaluation));
    for (const candidate of eligible) {
      const { evaluation, requestedNotional, releaseTime, preCapitalStatus } = candidate;
      const reservedBefore = reserved;
      const freeBefore = Math.max(0, capitalInitial - reservedBefore);
      if (requestedNotional <= freeBefore + EPS) {
        reserved += requestedNotional;
        openPositions.push({ releaseTime, notional: requestedNotional, tradeId: evaluation.trade.id });
        peakReserved = Math.max(peakReserved, reserved);
        minimumFree = Math.min(minimumFree, Math.max(0, capitalInitial - reserved));
        evaluation.status = "keep";
        evaluation.reason = "Edge prudent, turnover et capital disponible compatibles";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: true,
          releasedBeforeGroup,
          reservedBefore,
          requestedNotional,
          fundingDecision: "keep",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      } else {
        fundingRefused += 1;
        evaluation.status = "remove";
        evaluation.reason = "Capital libre insuffisant pour financer ce nominal";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: true,
          releasedBeforeGroup,
          reservedBefore,
          requestedNotional,
          fundingDecision: "insufficient-capital",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      }
    }

    offset = end;
  }

  return {
    evaluations: ordered,
    capitalInitial,
    peakReserved,
    minimumFree,
    fundingRefused,
    reservedAtEnd: reserved,
    openPositionsAtEnd: openPositions.length,
  };
}
