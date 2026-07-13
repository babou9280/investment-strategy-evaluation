function exportDecisions() {
  if (!state.result) return;
  const headers = [
    "decision", "ticker", "strategy", "sample", "notional_eur",
    "entry_price_source_value", "entry_price_source_key", "entry_price_source_currency",
    "entry_price_currency_source_key", "entry_price_currency_provenance", "entry_price_conversion_factor",
    "entry_price_eur", "entry_price_conversion_status", "unit_sizing_status",
    "expected_edge", "conservative_edge", "all_in_cost_eur", "all_in_cost_rate", "conservative_net_edge",
    "result_basis", "result_basis_label", "result_provenance", "result_fallback_from",
    "gross_observed_pnl_eur", "fixed_net_observed_pnl_eur", "fixed_net_provenance",
    "full_cost_observed_pnl_eur", "full_cost_provenance", "simulated_net_pnl_eur",
    "selected_result_pnl_eur", "realized_net_pnl_eur", "reason",
  ];
  const escape = (value) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const rows = state.result.evaluations.map((row) => {
    const price = row.position.priceDiagnostics || {};
    return [
      row.status, row.trade.ticker, row.trade.strategy, row.trade.sample, row.position.notional,
      price.sourceValue, price.sourceKey || "", price.sourceCurrency || "",
      price.currencySourceKey || "", price.currencyProvenance || "", price.conversionFactor ?? "",
      price.unitPriceEur, price.conversionStatus || "", row.position.sizingStatus || "",
      row.edge.posteriorMean, row.edge.conservativeEdge, row.costs.total, row.costs.rate, row.conservativeNetEdge,
      row.resultBasis, row.resultBasisLabel, row.resultProvenance, row.resultFallbackFrom || "",
      row.observedGrossPnl, row.observedFixedNetPnl, row.trade.pnlBases.fixedNet.provenance,
      row.observedFullCostPnl, row.trade.pnlBases.fullCost.provenance, row.simulatedNetPnl,
      row.realizedNetPnl, row.realizedNetPnl, row.reason,
    ];
  });
  const content = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "breaktest-capital-gate-decisions.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
