function entryPriceInEur(trade, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const info = trade.entryPriceInfo || {
    status: trade.entryPrice > 0 ? "valid" : "missing",
    sourceValue: trade.entryPrice || 0,
    sourceKey: "legacy_entry_price",
    sourceCurrency: "USD",
    currencySourceKey: null,
    currencyProvenance: "legacy-quote-assumption",
    conversionRequired: true,
    supportedCurrency: trade.entryPrice > 0,
  };
  if (info.status !== "valid" || !(info.sourceValue > 0) || !info.supportedCurrency) {
    return {
      ...info,
      conversionFactor: null,
      unitPriceEur: 0,
      conversionStatus: info.status === "missing" ? "missing" : "unsupported-currency",
      convertible: false,
    };
  }
  if (info.sourceCurrency === "EUR") {
    return {
      ...info,
      conversionFactor: 1,
      unitPriceEur: info.sourceValue,
      conversionStatus: "already-eur",
      convertible: true,
    };
  }
  const factor = Number(cfg.eurPerQuoteCurrency);
  if (info.sourceCurrency === "USD" && Number.isFinite(factor) && factor > 0) {
    return {
      ...info,
      conversionFactor: factor,
      unitPriceEur: info.sourceValue * factor,
      conversionStatus: "converted-once",
      convertible: true,
    };
  }
  return {
    ...info,
    conversionFactor: null,
    unitPriceEur: 0,
    conversionStatus: "unsupported-currency",
    convertible: false,
  };
}

function positionForTrade(trade, config = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const historicalWeight = trade.invested / Math.max(EPS, cfg.referenceCapital);
  const weight = clamp(historicalWeight, 0, Math.max(0, cfg.maxPositionPct));
  const targetNotional = Math.max(0, cfg.capital * weight);
  const price = entryPriceInEur(trade, cfg);
  let units = price.convertible ? targetNotional / price.unitPriceEur : 0;
  let notional = targetNotional;
  let executable = targetNotional > EPS;
  let sizingStatus = cfg.fractionalShares ? "fractional-notional" : "integer-priced";
  if (!cfg.fractionalShares) {
    if (!price.convertible) {
      units = 0;
      notional = 0;
      executable = false;
      sizingStatus = price.conversionStatus === "missing" ? "missing-price" : "unconvertible-price";
    } else {
      units = Math.floor(units + EPS);
      notional = units * price.unitPriceEur;
      executable = notional > EPS;
      sizingStatus = executable ? "integer-priced" : "below-one-unit";
    }
  }
  return {
    historicalWeight,
    weight,
    targetNotional,
    unitPriceEur: price.unitPriceEur,
    units,
    notional,
    executable,
    unitSizingAvailable: price.convertible,
    sizingStatus,
    priceDiagnostics: price,
  };
}
