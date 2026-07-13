function realizedEquityPoints(result) {
  const points = Array.isArray(result.realizedEquityCurve) ? result.realizedEquityCurve : [];
  return points.length ? points : [{ index: 0, time: null, date: null, value: result.config.capital, pnlApplied: 0, tradeIds: [] }];
}
