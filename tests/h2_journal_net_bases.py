#!/usr/bin/env python3
"""Browser invariants for H2 observed journal result bases and scenario separation."""
import asyncio
import subprocess
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"

SCENARIO = r"""
async () => {
  const training = Array.from({ length: 6 }, (_, index) => normalizeTrade({
    id: `train-${index}`,
    sample: "backtest",
    ticker: `T${index}`,
    strategy: "H2",
    entry_date: `2023-01-0${index + 1}`,
    exit_date: `2023-01-1${index + 1}`,
    invested_eur: 100,
    gross_pnl_eur: 20,
    gross_return: 0.2,
    fixed_net_pnl_eur: 18,
    fixed_net_return: 0.18,
    full_cost_net_pnl_eur: 17,
    full_cost_net_return: 0.17,
  }, index));
  const target = normalizeTrade({
    id: "target",
    sample: "live",
    ticker: "H2LIVE",
    strategy: "H2",
    entry_date: "2024-01-01",
    exit_date: "2024-01-10",
    invested_eur: 100,
    gross_pnl_eur: 10,
    gross_return: 0.1,
    fixed_net_pnl_eur: 8,
    fixed_net_return: 0.08,
    full_cost_net_pnl_eur: 7,
    full_cost_net_return: 0.07,
  }, 6);
  const rows = [...training, target];
  const base = {
    ...DEFAULT_CONFIG,
    capital: 1000,
    referenceCapital: 1000,
    maxPositionPct: 0.1,
    fractionalShares: true,
    analysisSample: "live",
    confidence: 0.5,
    priorStrength: 0,
    minTrainingObservations: 5,
    minNetEdgeBps: 0,
    turnoverCapAnnual: 100,
    fixedFeePerOrder: 5,
    minimumCommissionPerOrder: 0,
    commissionBpsPerSide: 0,
    spreadBpsRoundTrip: 0,
    slippageBpsPerSide: 0,
    fxBpsPerSide: 0,
    impactEnabled: false,
  };
  const run = (basis, overrides = {}) => evaluatePortfolio(rows, { ...base, ...overrides, resultBasis: basis });
  const compact = (result) => {
    const row = result.evaluations.find((item) => item.trade.id === "target");
    return {
      basis: result.config.resultBasis,
      selected: row.realizedNetPnl,
      simulated: row.simulatedNetPnl,
      gross: row.observedGrossPnl,
      fixed: row.observedFixedNetPnl,
      full: row.observedFullCostPnl,
      provenance: row.resultProvenance,
      fallbackFrom: row.resultFallbackFrom,
      filteredNetPnl: result.filteredNetPnl,
      realizedCapital: result.realizedCapital,
      curve: result.realizedEquityCurve,
      kept: result.kept.length,
      costs: row.costs.total,
    };
  };
  const simulated = compact(run("simulated"));
  const gross = compact(run("gross_observed"));
  const fixed = compact(run("fixed_net_observed"));
  const full = compact(run("full_cost_observed"));
  const fixedDifferentCosts = compact(run("fixed_net_observed", { fixedFeePerOrder: 1 }));
  const simulatedDifferentCosts = compact(run("simulated", { fixedFeePerOrder: 1 }));

  const fallbackTrade = normalizeTrade({
    id: "fallback",
    sample: "live",
    ticker: "FALL",
    strategy: "H2",
    entry_date: "2024-01-01",
    exit_date: "2024-01-10",
    invested_eur: 100,
    gross_pnl_eur: 10,
    gross_return: 0.1,
  });
  const fallbackModel = fitEdgeModel(training, base);
  const fallbackEvaluation = evaluateTrade(fallbackTrade, fallbackModel, { ...base, resultBasis: "full_cost_observed" });

  const imported = normalizeTrades(parseCsv([
    "sample,ticker,strategy,entry_date,exit_date,invested_eur,gross_pnl_eur,gross_return,fixed_net_pnl_eur,fixed_net_return,full_cost_net_pnl_eur,full_cost_net_return",
    "live,CSV,H2,2024-01-01,2024-01-10,100,10,0.1,8,0.08,7,0.07",
  ].join("\n")))[0];

  byId("result-basis").value = "full_cost_observed";
  byId("result-basis").dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const ui = {
    configBasis: window.__BREAKTEST__.result.config.resultBasis,
    kpiNote: byId("kpi-filtered-return").textContent,
    gateMode: byId("gate-mode").textContent,
    ledgerMode: byId("ledger-analysis-mode").textContent,
    ledgerHeader: document.querySelector("#ledger-body")?.closest("table")?.querySelectorAll("th")[8]?.textContent,
    ledgerText: byId("ledger-body").textContent,
    auditText: byId("audit-issues").textContent,
  };

  let exported = null;
  const originalCreate = URL.createObjectURL;
  const originalClick = HTMLAnchorElement.prototype.click;
  URL.createObjectURL = (blob) => { exported = blob; return "blob:h2"; };
  HTMLAnchorElement.prototype.click = function () {};
  exportDecisions();
  const exportText = exported ? await exported.text() : "";
  URL.createObjectURL = originalCreate;
  HTMLAnchorElement.prototype.click = originalClick;

  return {
    simulated,
    gross,
    fixed,
    full,
    fixedDifferentCosts,
    simulatedDifferentCosts,
    fallback: {
      fixedProvenance: fallbackTrade.pnlBases.fixedNet.provenance,
      fullProvenance: fallbackTrade.pnlBases.fullCost.provenance,
      fullFallbackFrom: fallbackTrade.pnlBases.fullCost.fallbackFrom,
      selected: fallbackEvaluation.realizedNetPnl,
      resultProvenance: fallbackEvaluation.resultProvenance,
      resultFallbackFrom: fallbackEvaluation.resultFallbackFrom,
    },
    imported: {
      fixed: imported.fixedNetPnl,
      full: imported.fullCostNetPnl,
      fixedProvenance: imported.pnlBases.fixedNet.provenance,
      fullProvenance: imported.pnlBases.fullCost.provenance,
    },
    ui,
    exportText,
  };
}
"""


async def main():
    subprocess.run([sys.executable, str(ROOT / "scripts" / "build_breaktest.py")], cwd=ROOT, check=True)
    errors = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox"]
        )
        page = await browser.new_page(viewport={"width": 1440, "height": 1000})
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.set_content(HTML.read_text(encoding="utf-8"), wait_until="load")
        await page.wait_for_timeout(250)
        result = await page.evaluate(SCENARIO)
        await browser.close()

    assert not errors, errors
    simulated = result["simulated"]
    gross = result["gross"]
    fixed = result["fixed"]
    full = result["full"]

    assert simulated["kept"] == gross["kept"] == fixed["kept"] == full["kept"] == 1
    assert simulated["costs"] == 10
    assert simulated["gross"] == 10
    assert simulated["fixed"] == 8
    assert simulated["full"] == 7
    assert simulated["simulated"] == 0
    assert simulated["selected"] == 0
    assert simulated["realizedCapital"] == 1000

    assert gross["selected"] == 10
    assert gross["realizedCapital"] == 1010
    assert fixed["selected"] == 8
    assert fixed["realizedCapital"] == 1008
    assert full["selected"] == 7
    assert full["realizedCapital"] == 1007
    assert full["filteredNetPnl"] == 7
    assert full["curve"][-1]["pnlApplied"] == 7

    assert result["fixedDifferentCosts"]["selected"] == fixed["selected"], result
    assert result["fixedDifferentCosts"]["fixed"] == fixed["fixed"]
    assert result["simulatedDifferentCosts"]["selected"] != simulated["selected"]
    assert result["simulatedDifferentCosts"]["selected"] == 8

    fallback = result["fallback"]
    assert fallback["fixedProvenance"] == "fallback"
    assert fallback["fullProvenance"] == "fallback"
    assert fallback["fullFallbackFrom"] == "fixedNet"
    assert fallback["selected"] == 10
    assert fallback["resultProvenance"] == "fallback"
    assert fallback["resultFallbackFrom"] == "fixedNet"

    imported = result["imported"]
    assert imported["fixed"] == 8
    assert imported["full"] == 7
    assert imported["fixedProvenance"] == "observed"
    assert imported["fullProvenance"] == "observed"

    ui = result["ui"]
    assert ui["configBasis"] == "full_cost_observed"
    assert "Full-cost observé" in ui["kpiNote"]
    assert "FULL-COST" in ui["gateMode"]
    assert "Full-cost" in ui["ledgerMode"]
    assert ui["ledgerHeader"] == "Résultat retenu"
    assert "Full-cost" in ui["ledgerText"]
    assert "full-cost observé" in ui["auditText"]
    assert "full-cost fallback" in ui["auditText"]

    export_text = result["exportText"]
    for header in (
        "result_basis",
        "result_provenance",
        "gross_observed_pnl_eur",
        "fixed_net_observed_pnl_eur",
        "fixed_net_provenance",
        "full_cost_observed_pnl_eur",
        "full_cost_provenance",
        "simulated_net_pnl_eur",
        "selected_result_pnl_eur",
    ):
        assert header in export_text, header
    assert "full_cost_observed" in export_text

    print("H2 journal net bases browser tests passed")


if __name__ == "__main__":
    asyncio.run(main())
