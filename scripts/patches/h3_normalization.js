function explicitPriceCurrency(raw) {
  for (const key of ["entry_price_currency", "quote_currency", "currency"]) {
    if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
    const value = String(raw[key] ?? "").trim();
    if (value) return { key, raw: value, normalized: value.toUpperCase().replace(/[._-]+/g, " ").replace(/\s+/g, " ") };
  }
  return { key: null, raw: null, normalized: null };
}

function supportedPriceCurrency(value) {
  if (["EUR", "EURO", "EUROS", "€"].includes(value)) return "EUR";
  if (["USD", "US DOLLAR", "US DOLLARS", "DOLLAR", "DOLLARS", "$", "US$"].includes(value)) return "USD";
  return null;
}

function normalizedEntryPrice(raw, index = 0) {
  const dedicated = [
    { key: "entry_price_eur", currency: "EUR" },
    { key: "entry_price_usd", currency: "USD" },
  ];
  for (const candidate of dedicated) {
    if (!Object.prototype.hasOwnProperty.call(raw, candidate.key)) continue;
    const state = numericState(raw[candidate.key]);
    if (state.status === "missing") continue;
    if (state.status !== "valid" || !(state.value > 0)) {
      throw new TradeValidationError(index, candidate.key, "invalid");
    }
    return {
      status: "valid",
      sourceValue: state.value,
      sourceKey: candidate.key,
      sourceCurrency: candidate.currency,
      currencySourceKey: candidate.key,
      currencyProvenance: "column-name",
      conversionRequired: candidate.currency !== "EUR",
      supportedCurrency: true,
    };
  }

  if (Object.prototype.hasOwnProperty.call(raw, "entry_price")) {
    const state = numericState(raw.entry_price);
    if (state.status !== "missing") {
      if (state.status !== "valid" || !(state.value > 0)) {
        throw new TradeValidationError(index, "entry_price", "invalid");
      }
      const declared = explicitPriceCurrency(raw);
      const supported = supportedPriceCurrency(declared.normalized);
      return {
        status: supported ? "valid" : "unsupported-currency",
        sourceValue: state.value,
        sourceKey: "entry_price",
        sourceCurrency: supported || declared.raw || null,
        currencySourceKey: declared.key,
        currencyProvenance: declared.key ? (supported ? "explicit-field" : "unsupported-explicit-field") : "unspecified",
        conversionRequired: supported === "USD",
        supportedCurrency: Boolean(supported),
      };
    }
  }

  return {
    status: "missing",
    sourceValue: 0,
    sourceKey: null,
    sourceCurrency: null,
    currencySourceKey: null,
    currencyProvenance: "missing",
    conversionRequired: false,
    supportedCurrency: false,
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

  const entryPriceInfo = normalizedEntryPrice(raw, index);
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
    entryPrice: entryPriceInfo.sourceValue,
    entryPriceInfo,
    dailyVolatility,
    advEur: Math.max(0, numeric(raw.adv_eur ?? raw.average_daily_volume_eur ?? raw.adv, 0)),
    source: raw,
  };
}
