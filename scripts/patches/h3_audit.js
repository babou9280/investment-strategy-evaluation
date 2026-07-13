function auditData(trades) {
  const issues = [];
  const missingDates = trades.filter((trade) => !validDate(trade.entryDate)).length;
  const priceInfo = (trade) => trade.entryPriceInfo || {
    status: trade.entryPrice > 0 ? "valid" : "missing",
    sourceCurrency: trade.entryPrice > 0 ? "USD" : null,
    currencyProvenance: "legacy-quote-assumption",
    supportedCurrency: trade.entryPrice > 0,
  };
  const missingPrices = trades.filter((trade) => priceInfo(trade).status === "missing").length;
  const unsupportedPriceCurrencies = trades.filter((trade) => priceInfo(trade).status === "unsupported-currency").length;
  const eurPrices = trades.filter((trade) => priceInfo(trade).status === "valid" && priceInfo(trade).sourceCurrency === "EUR").length;
  const usdPrices = trades.filter((trade) => priceInfo(trade).status === "valid" && priceInfo(trade).sourceCurrency === "USD").length;
  const missingLiquidity = trades.filter((trade) => !(trade.advEur > 0)).length;
  const invalidReturns = trades.filter((trade) => !Number.isFinite(trade.grossReturn)).length;
  const duplicates = trades.length - new Set(trades.map((trade) => `${trade.sample}|${trade.ticker}|${trade.entryDate}`)).size;
  const fixedObserved = trades.filter((trade) => trade.pnlBases.fixedNet.provenance !== "fallback").length;
  const fixedFallback = trades.length - fixedObserved;
  const fullCostObserved = trades.filter((trade) => trade.pnlBases.fullCost.provenance !== "fallback").length;
  const fullCostFallback = trades.length - fullCostObserved;
  const derivedValues = sum(trades.map((trade) => [trade.pnlBases.gross, trade.pnlBases.fixedNet, trade.pnlBases.fullCost]
    .filter((basis) => basis.pnlProvenance === "derived" || basis.returnProvenance === "derived").length));
  const pairInconsistencies = sum(trades.map((trade) => [trade.pnlBases.gross, trade.pnlBases.fixedNet, trade.pnlBases.fullCost]
    .filter((basis) => basis.pairInconsistent).length));
  if (missingDates) issues.push({ level: "medium", label: "Dates d’entrée manquantes", count: missingDates });
  if (missingPrices) issues.push({ level: "medium", label: "Prix absents pour les titres entiers", count: missingPrices });
  if (unsupportedPriceCurrencies) issues.push({ level: "high", label: "Devise de prix absente ou non supportée", count: unsupportedPriceCurrencies });
  if (missingLiquidity) issues.push({ level: "info", label: "ADV absent : impact estimé par défaut", count: missingLiquidity });
  if (invalidReturns) issues.push({ level: "high", label: "Rendements invalides", count: invalidReturns });
  if (duplicates) issues.push({ level: "high", label: "Doublons potentiels", count: duplicates });
  if (pairInconsistencies) issues.push({ level: "high", label: "Paires PnL / rendement incohérentes — H4", count: pairInconsistencies });
  return {
    trades: trades.length,
    backtest: trades.filter((trade) => trade.sample === "backtest").length,
    live: trades.filter((trade) => trade.sample === "live").length,
    missingDates,
    missingPrices,
    unsupportedPriceCurrencies,
    eurPrices,
    usdPrices,
    missingLiquidity,
    invalidReturns,
    duplicates,
    fixedObserved,
    fixedFallback,
    fullCostObserved,
    fullCostFallback,
    derivedValues,
    pairInconsistencies,
    issues,
    score: clamp(100 - missingDates * 2 - missingPrices - unsupportedPriceCurrencies * 4 - invalidReturns * 8 - duplicates * 6 - pairInconsistencies * 4, 0, 100),
  };
}
