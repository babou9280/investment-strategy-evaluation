function applyCapitalReservation(evaluations, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const capitalInitial = Math.max(0, Number.isFinite(cfg.capital) ? cfg.capital : 0);
  const ordered = [...evaluations].sort((left, right) => compareReplayTrades(left.trade, right.trade));
  const dayTime = (value) => {
    if (validDate(value) === null) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value ?? "").trim());
    return match ? Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
  };
  const dayLabel = (time) => Number.isFinite(time) ? new Date(time).toISOString().slice(0, 10) : null;

  let openPositions = [];
  let reserved = 0;
  let realizedCapital = capitalInitial;
  let peakReserved = 0;
  let minimumFree = capitalInitial;
  let fundingRefused = 0;
  let sequence = 0;
  let eventSequence = 0;
  const realizedEvents = [{
    sequence: eventSequence,
    type: "initial",
    time: null,
    date: null,
    realizedCapitalBefore: capitalInitial,
    realizedCapitalAfter: capitalInitial,
    reservedBefore: 0,
    reservedAfter: 0,
    freeBefore: capitalInitial,
    freeAfter: capitalInitial,
    pnlApplied: 0,
    notionalReleased: 0,
    notionalReserved: 0,
    tradeIds: [],
  }];
  const realizedEquityCurve = [{ index: 0, time: null, date: null, value: capitalInitial, pnlApplied: 0, tradeIds: [] }];

  const freeCapital = () => realizedCapital - reserved;
  const appendEvent = ({ type, time, beforeCapital, beforeReserved, pnlApplied = 0, notionalReleased = 0, notionalReserved = 0, tradeIds = [], acceptedTradeIds = [], rejectedTradeIds = [] }) => {
    const event = {
      sequence: eventSequence += 1,
      type,
      time,
      date: dayLabel(time),
      realizedCapitalBefore: beforeCapital,
      realizedCapitalAfter: realizedCapital,
      reservedBefore: beforeReserved,
      reservedAfter: reserved,
      freeBefore: beforeCapital - beforeReserved,
      freeAfter: freeCapital(),
      pnlApplied,
      notionalReleased,
      notionalReserved,
      tradeIds: [...tradeIds],
      acceptedTradeIds: [...acceptedTradeIds],
      rejectedTradeIds: [...rejectedTradeIds],
    };
    realizedEvents.push(event);
    return event;
  };

  const diagnostics = (evaluation, values) => {
    evaluation.capitalDiagnostics = {
      sequence: sequence += 1,
      capitalInitial,
      preCapitalStatus: values.preCapitalStatus,
      decisionTime: values.decisionTime,
      decisionDate: dayLabel(values.decisionTime),
      entryDateValid: values.entryDateValid,
      exitDateValid: values.exitDateValid,
      releasedBeforeGroup: values.releasedBeforeGroup,
      realizedPnlBeforeGroup: values.realizedPnlBeforeGroup,
      realizedCapitalBefore: values.realizedCapitalBefore,
      realizedCapitalAfter: values.realizedCapitalAfter,
      reservedBefore: values.reservedBefore,
      freeBefore: values.realizedCapitalBefore - values.reservedBefore,
      requestedNotional: values.requestedNotional,
      fundingDecision: values.fundingDecision,
      reservedAfter: values.reservedAfter,
      freeAfter: values.realizedCapitalAfter - values.reservedAfter,
      releaseTime: values.releaseTime,
      releaseDate: values.releaseDate,
      rankWithinDate: evaluation.turnoverDiagnostics?.rankWithinDate ?? null,
      reason: evaluation.reason,
    };
  };

  const releaseThrough = (time) => {
    const due = openPositions
      .filter((position) => position.releaseTime <= time)
      .sort((left, right) => left.releaseTime - right.releaseTime || String(left.tradeId).localeCompare(String(right.tradeId)));
    if (!due.length) return { releasedNotional: 0, pnlApplied: 0, tradeIds: [] };

    const dueSet = new Set(due);
    openPositions = openPositions.filter((position) => !dueSet.has(position));
    let releasedNotionalTotal = 0;
    let pnlAppliedTotal = 0;
    const releasedIds = [];

    for (let offset = 0; offset < due.length;) {
      const releaseTime = due[offset].releaseTime;
      let end = offset + 1;
      while (end < due.length && due[end].releaseTime === releaseTime) end += 1;
      const group = due.slice(offset, end);
      const beforeCapital = realizedCapital;
      const beforeReserved = reserved;
      const notionalReleased = sum(group.map((position) => position.notional));
      const pnlApplied = sum(group.map((position) => position.realizedNetPnl));
      const tradeIds = group.map((position) => position.tradeId);

      reserved = Math.max(0, reserved - notionalReleased);
      realizedCapital += pnlApplied;
      minimumFree = Math.min(minimumFree, freeCapital());
      releasedNotionalTotal += notionalReleased;
      pnlAppliedTotal += pnlApplied;
      releasedIds.push(...tradeIds);
      appendEvent({
        type: "exit",
        time: releaseTime,
        beforeCapital,
        beforeReserved,
        pnlApplied,
        notionalReleased,
        tradeIds,
      });
      realizedEquityCurve.push({
        index: realizedEquityCurve.length,
        time: releaseTime,
        date: dayLabel(releaseTime),
        value: realizedCapital,
        pnlApplied,
        tradeIds,
      });
      offset = end;
    }
    return { releasedNotional: releasedNotionalTotal, pnlApplied: pnlAppliedTotal, tradeIds: releasedIds };
  };

  for (let offset = 0; offset < ordered.length;) {
    const decisionTime = dayTime(ordered[offset].trade.entryDate);
    let end = offset + 1;
    while (end < ordered.length && dayTime(ordered[end].trade.entryDate) === decisionTime) end += 1;
    const group = ordered.slice(offset, end);

    if (decisionTime === null) {
      for (const evaluation of group) {
        const preCapitalStatus = evaluation.status;
        const requestedNotional = Number.isFinite(evaluation.position?.notional)
          ? Math.max(0, evaluation.position.notional)
          : 0;
        evaluation.status = "observe";
        evaluation.reason = "Date d’entrée invalide : simulation temporelle impossible";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime: null,
          entryDateValid: false,
          exitDateValid: dayTime(evaluation.trade.exitDate) !== null,
          releasedBeforeGroup: 0,
          realizedPnlBeforeGroup: 0,
          realizedCapitalBefore: realizedCapital,
          realizedCapitalAfter: realizedCapital,
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

    const released = releaseThrough(decisionTime);
    const groupCapital = realizedCapital;
    const groupReserved = reserved;
    const eligible = [];
    const acceptedTradeIds = [];
    const rejectedTradeIds = [];
    let notionalReservedInGroup = 0;

    for (const evaluation of group) {
      const preCapitalStatus = evaluation.status;
      const requestedNotional = Number.isFinite(evaluation.position?.notional)
        ? Math.max(0, evaluation.position.notional)
        : NaN;
      const releaseTime = dayTime(evaluation.trade.exitDate);
      if (releaseTime === null || releaseTime < decisionTime) {
        evaluation.status = "observe";
        evaluation.reason = releaseTime === null
          ? "Date de sortie invalide : simulation temporelle impossible"
          : "Sortie antérieure à l’entrée : simulation temporelle impossible";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: false,
          releasedBeforeGroup: released.releasedNotional,
          realizedPnlBeforeGroup: released.pnlApplied,
          realizedCapitalBefore: realizedCapital,
          realizedCapitalAfter: realizedCapital,
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
          releasedBeforeGroup: released.releasedNotional,
          realizedPnlBeforeGroup: released.pnlApplied,
          realizedCapitalBefore: realizedCapital,
          realizedCapitalAfter: realizedCapital,
          reservedBefore: reserved,
          requestedNotional: Number.isFinite(requestedNotional) ? requestedNotional : 0,
          fundingDecision: "prefiltered",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      } else if (!Number.isFinite(requestedNotional) || requestedNotional <= EPS) {
        evaluation.status = "observe";
        evaluation.reason = "Nominal invalide : simulation temporelle impossible";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: true,
          releasedBeforeGroup: released.releasedNotional,
          realizedPnlBeforeGroup: released.pnlApplied,
          realizedCapitalBefore: realizedCapital,
          realizedCapitalAfter: realizedCapital,
          reservedBefore: reserved,
          requestedNotional: 0,
          fundingDecision: "invalid-notional",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      } else if (!Number.isFinite(evaluation.realizedNetPnl)) {
        evaluation.status = "observe";
        evaluation.reason = "P&L net invalide : simulation temporelle impossible";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: true,
          releasedBeforeGroup: released.releasedNotional,
          realizedPnlBeforeGroup: released.pnlApplied,
          realizedCapitalBefore: realizedCapital,
          realizedCapitalAfter: realizedCapital,
          reservedBefore: reserved,
          requestedNotional,
          fundingDecision: "invalid-realized-pnl",
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
      const realizedCapitalBefore = realizedCapital;
      const freeBefore = freeCapital();
      if (requestedNotional <= freeBefore + EPS) {
        reserved += requestedNotional;
        openPositions.push({
          releaseTime,
          notional: requestedNotional,
          realizedNetPnl: evaluation.realizedNetPnl,
          tradeId: evaluation.trade.id,
        });
        peakReserved = Math.max(peakReserved, reserved);
        minimumFree = Math.min(minimumFree, freeCapital());
        notionalReservedInGroup += requestedNotional;
        acceptedTradeIds.push(evaluation.trade.id);
        evaluation.status = "keep";
        evaluation.reason = "Edge prudent, turnover et trésorerie disponible compatibles";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: true,
          releasedBeforeGroup: released.releasedNotional,
          realizedPnlBeforeGroup: released.pnlApplied,
          realizedCapitalBefore,
          realizedCapitalAfter: realizedCapital,
          reservedBefore,
          requestedNotional,
          fundingDecision: "keep",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      } else {
        fundingRefused += 1;
        rejectedTradeIds.push(evaluation.trade.id);
        evaluation.status = "remove";
        evaluation.reason = "Trésorerie libre insuffisante pour financer ce nominal";
        diagnostics(evaluation, {
          preCapitalStatus,
          decisionTime,
          entryDateValid: true,
          exitDateValid: true,
          releasedBeforeGroup: released.releasedNotional,
          realizedPnlBeforeGroup: released.pnlApplied,
          realizedCapitalBefore,
          realizedCapitalAfter: realizedCapital,
          reservedBefore,
          requestedNotional,
          fundingDecision: "insufficient-capital",
          reservedAfter: reserved,
          releaseTime,
          releaseDate: evaluation.trade.exitDate || null,
        });
      }
    }

    appendEvent({
      type: "entry",
      time: decisionTime,
      beforeCapital: groupCapital,
      beforeReserved: groupReserved,
      notionalReserved: notionalReservedInGroup,
      tradeIds: group.map((evaluation) => evaluation.trade.id),
      acceptedTradeIds,
      rejectedTradeIds,
    });
    offset = end;
  }

  releaseThrough(Infinity);
  const realizedPnlTotal = realizedCapital - capitalInitial;
  return {
    evaluations: ordered,
    capitalInitial,
    realizedCapital,
    realizedPnlTotal,
    realizedEvents,
    realizedEquityCurve,
    peakReserved,
    minimumFree,
    fundingRefused,
    reservedAtEnd: reserved,
    openPositionsAtEnd: openPositions.length,
  };
}
