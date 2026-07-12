#!/usr/bin/env python3
"""Browser-level invariants for C2 temporal and sample isolation."""
import asyncio
import subprocess
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"

SCENARIO = r"""
() => {
  const row = (id, sample, entry, exit, grossReturn) => ({
    id, sample, strategy: "A", ticker: id, entry_date: entry, exit_date: exit,
    invested_eur: 100, gross_return: grossReturn, gross_pnl_eur: 100 * grossReturn,
  });
  const baseRows = [
    row("past", "backtest", "2023-01-01", "2023-12-31", 0.10),
    row("future", "backtest", "2025-01-01", "2025-01-02", 9.00),
    row("same", "backtest", "2024-01-01", "2024-01-10", 8.00),
    row("bad-exit", "backtest", "2023-02-01", "not-a-date", 7.00),
    row("bad-calendar", "backtest", "2023-02-30", "2023-03-01", 6.50),
    row("prior-live", "live", "2023-01-01", "2023-01-02", 6.00),
    row("target", "live", "2024-01-10", "2024-01-11", 0.02),
  ];
  const cfg = {
    ...DEFAULT_CONFIG,
    analysisSample: "live",
    minTrainingObservations: 1,
    priorStrength: 0,
    confidence: 0.5,
    capital: 1000,
    turnoverCapAnnual: 1e9,
    fixedFeePerOrder: 0,
    minimumCommissionPerOrder: 0,
    commissionBpsPerSide: 0,
    spreadBpsRoundTrip: 0,
    slippageBpsPerSide: 0,
    fxBpsPerSide: 0,
    impactEnabled: false,
  };
  const summarize = (rows) => {
    const result = evaluatePortfolio(normalizeTrades(rows), cfg);
    const evaluation = result.evaluations.find((item) => item.trade.id === "target");
    return {
      trainingCount: evaluation.model.trainingCount,
      posteriorMean: evaluation.edge.posteriorMean,
      conservativeEdge: evaluation.edge.conservativeEdge,
      preTurnoverStatus: evaluation.preTurnoverStatus,
      diagnostics: evaluation.trainingDiagnostics,
    };
  };
  const baseline = summarize(baseRows);
  const contaminated = summarize([
    ...baseRows,
    row("extreme-future", "backtest", "2030-01-01", "2030-01-02", -99),
    row("forbidden-live", "live", "2023-03-01", "2023-03-02", -88),
  ]);

  const invalidRows = [
    row("past", "backtest", "2023-01-01", "2023-01-02", 0.10),
    row("invalid-target", "live", "2024-02-30", "2024-03-01", 0.02),
  ];
  const invalidResult = evaluatePortfolio(normalizeTrades(invalidRows), cfg);
  const invalid = invalidResult.evaluations.find((item) => item.trade.id === "invalid-target");

  const backtestRows = [
    row("past-bt", "backtest", "2022-01-01", "2022-12-31", 0.12),
    row("target-bt", "backtest", "2024-01-10", "2024-01-11", 0.01),
    row("future-bt", "backtest", "2025-01-01", "2025-01-02", -7),
    row("live-history", "live", "2023-01-01", "2023-01-02", 5),
  ];
  const backtestResult = evaluatePortfolio(normalizeTrades(backtestRows), { ...cfg, analysisSample: "backtest" });
  const backtestTarget = backtestResult.evaluations.find((item) => item.trade.id === "target-bt");

  const duplicateRows = [
    row("duplicate", "backtest", "2022-01-01", "2022-12-31", 0.11),
    row("duplicate", "live", "2024-01-10", "2024-01-11", 0.02),
  ];
  const duplicateResult = evaluatePortfolio(normalizeTrades(duplicateRows), cfg);
  const duplicateTarget = duplicateResult.evaluations.find((item) => item.trade.sample === "live");

  return {
    baseline,
    contaminated,
    invalid: {
      status: invalid.status,
      reason: invalid.reason,
      trainingCount: invalid.model.trainingCount,
      diagnostics: invalid.trainingDiagnostics,
      lastInReplay: invalidResult.evaluations.at(-1).trade.id,
    },
    backtest: {
      trainingCount: backtestTarget.model.trainingCount,
      posteriorMean: backtestTarget.edge.posteriorMean,
      diagnostics: backtestTarget.trainingDiagnostics,
    },
    duplicateId: {
      trainingCount: duplicateTarget.model.trainingCount,
      posteriorMean: duplicateTarget.edge.posteriorMean,
      diagnostics: duplicateTarget.trainingDiagnostics,
    },
    labels: {
      gate: document.getElementById("gate-mode").textContent,
      ledger: document.getElementById("ledger-analysis-mode").textContent,
      training: document.getElementById("training-count").textContent,
      bodyHasStrictOos: document.body.textContent.includes("OOS STRICT"),
      bodyHasOosLabel: /\bOOS\b/.test(document.body.textContent),
      bodyHasTurnoverDisclosure: document.body.textContent.includes("turnover encore ex post"),
    },
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
        await page.wait_for_timeout(200)
        result = await page.evaluate(SCENARIO)
        await browser.close()

    assert not errors, errors
    baseline = result["baseline"]
    contaminated = result["contaminated"]
    assert baseline["trainingCount"] == 1, baseline
    assert abs(baseline["posteriorMean"] - 0.10) < 1e-12, baseline
    assert baseline["diagnostics"] == {
        "decisionEntryValid": True,
        "consideredBacktest": 5,
        "eligibleCount": 1,
        "excludedSelf": 0,
        "excludedInvalidTrainingDates": 2,
        "excludedFutureOrSame": 2,
    }, baseline["diagnostics"]
    assert contaminated["trainingCount"] == baseline["trainingCount"]
    assert contaminated["posteriorMean"] == baseline["posteriorMean"]
    assert contaminated["conservativeEdge"] == baseline["conservativeEdge"]
    assert contaminated["preTurnoverStatus"] == baseline["preTurnoverStatus"]

    invalid = result["invalid"]
    assert invalid["status"] == "observe", invalid
    assert invalid["trainingCount"] == 0, invalid
    assert invalid["diagnostics"]["decisionEntryValid"] is False, invalid
    assert invalid["lastInReplay"] == "invalid-target", invalid
    assert "Date d’entrée invalide" in invalid["reason"], invalid

    backtest = result["backtest"]
    assert backtest["trainingCount"] == 1, backtest
    assert abs(backtest["posteriorMean"] - 0.12) < 1e-12, backtest
    assert backtest["diagnostics"]["excludedSelf"] == 1, backtest
    assert backtest["diagnostics"]["excludedFutureOrSame"] == 1, backtest

    duplicate = result["duplicateId"]
    assert duplicate["trainingCount"] == 1, duplicate
    assert abs(duplicate["posteriorMean"] - 0.11) < 1e-12, duplicate
    assert duplicate["diagnostics"]["excludedSelf"] == 0, duplicate

    labels = result["labels"]
    assert labels["gate"] == "LIVE · MODÈLE ANTÉRIEUR", labels
    assert labels["ledger"] == "Live · modèle antérieur", labels
    assert labels["bodyHasStrictOos"] is False, labels
    assert labels["bodyHasOosLabel"] is False, labels
    assert labels["bodyHasTurnoverDisclosure"] is True, labels
    print("C2 temporal isolation tests passed")


if __name__ == "__main__":
    asyncio.run(main())
