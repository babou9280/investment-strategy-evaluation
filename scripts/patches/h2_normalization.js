function normalizeObservedBasis(raw, {
  pnlKeys,
  returnKeys,
  invested,
  index,
  field,
  fallback = null,
  required = false,
}) {
  const pnlSource = firstNumericSource(raw, pnlKeys);
  const returnSource = firstNumericSource(raw, returnKeys);
  if (pnlSource.status === "invalid") throw new TradeValidationError(index, pnlSource.key || field, "invalid");
  if (returnSource.status === "invalid") throw new TradeValidationError(index, returnSource.key || `${field}_return`, "invalid");
  if (pnlSource.status === "missing" && returnSource.status === "missing") {
    if (required || !fallback) throw new TradeValidationError(index, field, "missing");
    return {
      pnl: fallback.pnl,
      return: fallback.return,
      pnlProvenance: "fallback",
      returnProvenance: "fallback",
      provenance: "fallback",
      fallbackFrom: fallback.name,
      pnlKey: null,
      returnKey: null,
      pairDifference: 0,
      pairInconsistent: false,
      name: field,
    };
  }
  const normalizedReturn = returnSource.status === "valid"
    ? (Math.abs(returnSource.value) > 2 ? returnSource.value / 100 : returnSource.value)
    : null;
  const pnl = pnlSource.status === "valid" ? pnlSource.value : invested * normalizedReturn;
  const rate = normalizedReturn ?? pnl / invested;
  const pairDifference = pnlSource.status === "valid" && returnSource.status === "valid"
    ? pnl - invested * rate
    : 0;
  const tolerance = Math.max(0.01, Math.abs(pnl) * 1e-6);
  return {
    pnl,
    return: rate,
    pnlProvenance: pnlSource.status === "valid" ? "observed" : "derived",
    returnProvenance: returnSource.status === "valid" ? "observed" : "derived",
    provenance: pnlSource.status === "valid" && returnSource.status === "valid"
      ? "observed"
      : pnlSource.status === "valid" ? "pnl-observed" : "return-observed",
    fallbackFrom: null,
    pnlKey: pnlSource.status === "valid" ? pnlSource.key : null,
    returnKey: returnSource.status === "valid" ? returnSource.key : null,
    pairDifference,
    pairInconsistent: Math.abs(pairDifference) > tolerance,
    name: field,
  };
}

function normalizeTrade(raw, index = 0) {
  const invested = requiredNumeric(raw, ["invested_eur", "invested", "position_size"], index, "invested_eur");
  if (!(invested > 0)) throw new TradeValidationError(index, "invested_eur", "invalid");

  const gross = normalizeObservedBasis(raw, {
    pnlKeys: ["gross_pnl_eur", "gross_pnl", "pnl_eur", "pnl"],
    returnKeys: ["gross_return"],
    invested,
    index,
    field: "gross_return ou gross_pnl_eur",
    required: true,
  });
  gross.name = "gross";
  const fixedNet = normalizeObservedBasis(raw, {
    pnlKeys: ["fixed_net_pnl_eur", "fixed_net_pnl", "net_pnl_eur", "net_pnl"],
    returnKeys: ["fixed_net_return", "net_return"],
    invested,
    index,
    field: "fixed_net",
    fallback: gross,
  });
  fixedNet.name = "fixedNet";
  const fullCost = normalizeObservedBasis(raw, {
    pnlKeys: ["full_cost_net_pnl_eur", "full_cost_pnl_eur", "full_cost_net_pnl", "full_cost_pnl"],
    returnKeys: ["full_cost_net_return", "full_cost_return"],
    invested,
    index,
    field: "fullCost",
    fallback: fixedNet,
  });
  fullCost.name = "fullCost";

  const entryPrice = Math.max(0, numeric(raw.entry_price_eur ?? raw.entry_price_usd ?? raw.entry_price));
  const dailyVolatility = Math.max(0, normalizedRate(raw.daily_volatility ?? raw.volatility_daily, 0));
  return {
    id: raw.id || `${raw.sample || "sample"}-${raw.ticker || raw.symbol || "trade"}-${index}`,
    sample: String(raw.sample || "import").trim().toLowerCase(),
    strategy: String(raw.strategy || "Non classé").trim(),
    ticker: String(raw.ticker || raw.symbol || `Trade ${index + 1}`).trim().toUpperCase(),
    company: String(raw.company || "").trim(),
    sector: String(raw.sector || "Non classé").trim(),
    setup: String(raw.signal_type || raw.setup || "Non classé").trim(),
    entryDate: String(raw.entry_date || raw.signal_date || "").trim(),
    exitDate: String(raw.exit_date || raw.entry_date || "").trim(),
    invested,
    grossPnl: gross.pnl,
    grossReturn: gross.return,
    grossPnlDerived: gross.pnlProvenance === "derived",
    grossReturnDerived: gross.returnProvenance === "derived",
    fixedNetPnl: fixedNet.pnl,
    fixedNetReturn: fixedNet.return,
    fullCostNetPnl: fullCost.pnl,
    fullCostNetReturn: fullCost.return,
    pnlBases: { gross, fixedNet, fullCost },
    entryPrice,
    dailyVolatility,
    advEur: Math.max(0, numeric(raw.adv_eur ?? raw.average_daily_volume_eur ?? raw.adv, 0)),
    source: raw,
  };
}
