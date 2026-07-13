function renderLedger(result) {
  const search = state.ledgerSearch.toLowerCase();
  const basis = resultBasisMeta(result.config.resultBasis);
  const rows = result.evaluations.filter((row) => {
    const filterMatch = state.ledgerFilter === "all" || row.status === state.ledgerFilter;
    const text = `${row.trade.ticker} ${row.trade.strategy} ${row.trade.sector} ${row.reason} ${row.resultBasisLabel} ${row.resultProvenance}`.toLowerCase();
    return filterMatch && (!search || text.includes(search));
  });
  byId("ledger-body").innerHTML = rows.length ? rows.map((row) => {
    const floor = breakEvenCapital(row.trade, row.model, result.config);
    const provenance = row.resultProvenance === "fallback"
      ? `fallback ${row.resultFallbackFrom || "précédent"}`
      : row.resultProvenance === "simulated" ? "scénario de coûts" : row.resultProvenance;
    return `<tr>
      <td>${statusMarkup(row.status)}</td>
      <td><strong>${escapeHtml(row.trade.ticker)}</strong><br>${escapeHtml(row.trade.entryDate || "—")}</td>
      <td><strong>${escapeHtml(row.trade.strategy)}</strong><br>${escapeHtml(row.trade.sector)}</td>
      <td><strong>${fmtCurrency(row.position.notional)}</strong><br>${row.position.units ? `${number.format(row.position.units)} unités` : "fractionné"}</td>
      <td class="${row.edge.conservativeEdge >= 0 ? "positive" : "negative"}">${fmtPct(row.edge.conservativeEdge, true)}</td>
      <td><strong>${fmtCurrency(row.costs.total)}</strong><br>${fmtBps(row.costs.rate)}</td>
      <td class="${row.conservativeNetEdge >= 0 ? "positive" : "negative"}">${fmtPct(row.conservativeNetEdge, true)}</td>
      <td>${fmtCapital(floor)}</td>
      <td class="${row.realizedNetPnl >= 0 ? "positive" : "negative"}"><strong>${fmtCurrency(row.realizedNetPnl, true)}</strong><br><small>${escapeHtml(basis.shortLabel)} · ${escapeHtml(provenance)}</small></td>
      <td title="${escapeHtml(row.reason)}">${escapeHtml(row.reason)}</td>
    </tr>`;
  }).join("") : `<tr><td colspan="10">Aucune ligne ne correspond au filtre.</td></tr>`;
  const audit = auditData(state.trades);
  const training = result.trainingSummary;
  byId("training-count").textContent = training.min === training.max
    ? `${training.max} trades backtest antérieurs`
    : `${training.min}–${training.max} trades backtest antérieurs`;
  byId("data-quality").textContent = `${Math.round(audit.score)} / 100`;
  const sampleLabel = result.config.analysisSample === "live" ? "Live" : result.config.analysisSample === "backtest" ? "Backtest" : "Mixte";
  byId("ledger-analysis-mode").textContent = `${sampleLabel} · ${basis.shortLabel}`;
  byId("ledger-decisions").textContent = `${rows.length} lignes`;
  byId("audit-title").textContent = `${audit.trades} lignes exploitables`;
  const chips = [
    `${audit.backtest} backtest`,
    `${audit.live} live`,
    `${audit.fixedObserved} net fixe observé`,
    `${audit.fullCostObserved} full-cost observé`,
    `${audit.fullCostFallback} full-cost fallback`,
    audit.pairInconsistencies ? `${audit.pairInconsistencies} incohérence PnL/rendement` : "0 incohérence PnL/rendement",
  ];
  byId("audit-issues").innerHTML = chips.map((chip) => `<span class="audit-chip">${chip}</span>`).join("");
}
