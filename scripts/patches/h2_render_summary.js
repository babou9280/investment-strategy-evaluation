function renderCapitalSummary(result) {
  const total = result.evaluations.length;
  const basis = resultBasisMeta(result.config.resultBasis);
  const sampleLabel = result.config.analysisSample === "live" ? "LIVE · MODÈLE ANTÉRIEUR" : result.config.analysisSample === "backtest" ? "BACKTEST · MODÈLE ANTÉRIEUR" : "MIXTE · MODÈLE ANTÉRIEUR";
  byId("gate-mode").textContent = `${sampleLabel} · ${basis.shortLabel.toUpperCase()}`;
  byId("gate-verdict").textContent = `${result.kept.length} trades viables`;
  byId("kpi-retained").textContent = `${result.kept.length} / ${total}`;
  byId("kpi-retained-note").textContent = `${result.removed.length} retirés avant résultat`;
  byId("kpi-filtered-pnl").textContent = fmtCurrency(result.filteredNetPnl, true);
  setTone(byId("kpi-filtered-pnl"), result.filteredNetPnl);
  byId("kpi-filtered-return").textContent = `${basis.label} · ${fmtPct(result.filteredReturn, true)} du capital`;
  byId("kpi-delta").textContent = fmtCurrency(result.deltaPnl, true);
  setTone(byId("kpi-delta"), result.deltaPnl);
  byId("kpi-delta-note").textContent = result.deltaPnl >= 0 ? `écart ${basis.shortLabel.toLowerCase()} vs tout prendre` : `le filtre a manqué des gains — ${basis.shortLabel.toLowerCase()}`;
  byId("kpi-costs-avoided").textContent = fmtCurrency(result.costsAvoided, false);
  byId("kpi-cost-burden").textContent = `${fmtCurrency(result.baselineCosts)} de coûts simulés avant filtre`;
  byId("equity-caption").textContent = `${result.realizedEquityCurve.length - 1} date${result.realizedEquityCurve.length > 2 ? "s" : ""} de sortie · ${basis.label} · capital réalisé ${fmtCapital(result.realizedCapital)} · non mark-to-market`;
  const compatibility = result.retainedRate;
  byId("capital-orb").style.setProperty("--score", compatibility.toFixed(3));
  byId("orb-value").textContent = `${Math.round(compatibility * 100)}%`;
  let title = "Nominal chronologiquement financé";
  let copy = "Les positions conservées respectent la réservation du capital entre leur entrée et leur sortie.";
  if (result.capitalFundingRefused > 0) {
    title = "Capital contraint par les chevauchements";
    copy = `${result.capitalFundingRefused} trade${result.capitalFundingRefused > 1 ? "s" : ""} refusé${result.capitalFundingRefused > 1 ? "s" : ""} faute de capital libre, sans redimensionnement implicite.`;
  } else if (compatibility < .35) {
    title = "Capital très sélectif";
    copy = "La majorité des décisions est écartée avant financement par les règles d’edge, de coûts ou de turnover.";
  } else if (compatibility < .75) {
    title = "Capital financé, sous sélection";
    copy = `${result.removed.length} trades sont écartés avant ou pendant le contrôle de financement.`;
  }
  byId("orb-title").textContent = title;
  byId("orb-copy").textContent = copy;
  byId("mini-turnover").textContent = fmtCurrency(result.peakCapitalReserved);
  byId("mini-budget").textContent = fmtCurrency(result.minimumCapitalFree);
}
