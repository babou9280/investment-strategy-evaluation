#!/usr/bin/env python3
"""Browser invariants for per-decision temporal and sample isolation."""
import asyncio
import subprocess
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"

SCENARIO = r"""
() => {
  const trade = (id, sample, entry, exit, grossReturn, strategy = "Temporal") => ({
    id,
    sample,
    strategy,
    ticker: id.toUpperCase(),
    entryDate: entry,
    exitDate: exit,
    invested: 100,
    grossPnl: 100 * grossReturn,
    grossReturn,
    entryPrice: 10,
    dailyVolatility: 0.02,
    advEur: 1e7,
    source: {},
  });
  const baseRows = [
    trade("old", "backtest", "2023-01-01", "2023-01-10", 0.10),
    trade("eligible", "backtest", "2023-02-01", "2023-02-10", 0.12),
    trade("same-exit", "backtest", "2024-01-01", "2024-02-01", 0.9),
    trade("future", "backtest", "2024-03-01", "2024-03-10", 10),
    trade("target", "live", "2024-02-01", "2024-02-20", 0.05),
  ];
  const config = { ...DEFAULT_CONFIG, analysisSample: "live", confidence: 0.5, priorStrength: 0, minTrainingObservations: 1, turnoverCapAnnual: 100 };
  const summarize = (rows, targetId = "target", cfg = config) => {
    const result = evaluatePortfolio(rows, cfg);
    const evaluation = result.evaluations.find((item) => item.trade.id === targetId);
    return {
      status: evaluation.status,
      preTurnoverStatus: evaluation.preTurnoverStatus,
      trainingCount: evaluation.model.trainingCount,
      posteriorMean: evaluation.edge.posteriorMean,
      conservativeEdge: evaluation.edge.conservativeEdge,
      diagnostics: evaluation.trainingDiagnostics,
      reason: evaluation.reason,
      lastInReplay: result.evaluations.at(-1)?.trade.id,
    };
  };

  const baseline = summarize(baseRows);
  const futureExtreme = summarize([...baseRows, trade("later-extreme", "backtest", "2025-01-01", "2025-01-02", -999)]);
  const liveExtreme = summarize([...baseRows, trade("live-extreme", "live", "2023-01-01", "2023-01-02", 999)]);
  const invalidTraining = summarize([...baseRows, trade("invalid-train", "backtest", "2023-02-30", "2023-03-01", 999)]);
  const invalidDecision = summarize([...baseRows, trade("invalid-target", "live", "2024-02-30", "2024-03-01", 0.2)], "invalid-target");

  const backtestRows = [
    trade("past-a", "backtest", "2023-01-01", "2023-01-05", 0.12),
    trade("backtest-target", "backtest", "2023-02-01", "2023-02-05", 0.3),
    trade("past-b", "backtest", "2023-03-01", "2023-03-05", 5),
  ];
  const backtestResult = summarize(backtestRows, "backtest-target", { ...config, analysisSample: "backtest" });

  const duplicateIdRows = [
    trade("duplicate", "backtest", "2023-01-01", "2023-01-10", 0.11),
    trade("duplicate", "live", "2024-01-01", "2024-01-10", 0.2),
  ];
  const duplicateIdResult = summarize(duplicateIdRows, "duplicate");

  return {
    baseline,
    futureExtreme,
    liveExtreme,
    invalidTraining,
    invalid: invalidDecision,
    backtest: backtestResult,
    duplicateId: duplicateIdResult,
    labels: {
      gate: document.getElementById("gate-mode").textContent,
      ledger: document.getElementById("ledger-analysis-mode").textContent,
      training: document.getElementById("training-count").textContent,
      bodyHasStrictOos: document.body.textContent.includes("OOS strict"),
      bodyHasOosLabel: document.body.textContent.includes("OUT-OF-SAMPLE"),
      bodyHasTruthfulTurnoverDisclosure: document.body.textContent.includes("turnover glissant 365 j"),
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
    assert baseline["trainingCount"] == 2, baseline
    assert abs(baseline["posteriorMean"] - 0.11) < 1e-12, baseline
    assert baseline["diagnostics"]["excludedFutureOrSame"] == 2, baseline

    for key in ("futureExtreme", "liveExtreme", "invalidTraining"):
        contaminated = result[key]
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
    assert labels["gate"] == "LIVE · MODÈLE ANTÉRIEUR · SIMULÉ", labels
    assert labels["ledger"] == "Live · Simulé", labels
    assert labels["bodyHasStrictOos"] is False, labels
    assert labels["bodyHasOosLabel"] is False, labels
    assert labels["bodyHasTruthfulTurnoverDisclosure"] is True, labels
    print("C2 temporal isolation tests passed")


if __name__ == "__main__":
    asyncio.run(main())
