#!/usr/bin/env python3
"""Browser invariants for C3 chronological rolling turnover allocation."""
import asyncio
import subprocess
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"

SCENARIO = r"""
() => {
  const evaluation = (id, date, edge, units = 1, status = "keep") => ({
    trade: { id, entryDate: date, exitDate: date },
    status,
    preTurnoverStatus: status,
    conservativeNetEdge: edge,
    expectedNetEdge: edge,
    turnoverUnits: units,
    reason: status === "keep" ? "eligible" : "pre-filtered",
  });
  const run = (rows, cap = 1) => applyTurnoverBudget(rows, { ...DEFAULT_CONFIG, turnoverCapAnnual: cap });
  const compact = (result) => result.evaluations.map((item) => ({
    id: item.trade.id,
    status: item.status,
    reason: item.reason,
    diagnostics: item.turnoverDiagnostics,
  }));

  const pastOnly = run([evaluation("past", "2024-01-01", 0.01)]);
  const withFuture = run([
    evaluation("past", "2024-01-01", 0.01),
    evaluation("future", "2024-02-01", 99),
  ]);
  const futureChanged = run([
    evaluation("past", "2024-01-01", 0.01),
    evaluation("future", "2024-02-01", -99),
  ]);

  const expiry = run([
    evaluation("first", "2023-01-01T00:00:00Z", 0.2),
    evaluation("after-window", "2024-01-02T00:00:00Z", 0.1),
  ]);
  const withinWindow = run([
    evaluation("first", "2024-01-01", 0.2),
    evaluation("within-window", "2024-12-31", 0.1),
  ]);

  const sameDate = run([
    evaluation("low", "2024-03-01", 0.1),
    evaluation("high", "2024-03-01", 0.9),
  ]);
  const sameDateTie = run([
    evaluation("zeta", "2024-03-01", 0.5),
    evaluation("alpha", "2024-03-01", 0.5),
  ]);
  const zeroBudget = run([evaluation("zero", "2024-01-01", 1)], 0);
  const invalid = run([
    evaluation("valid", "2024-01-01", 1),
    evaluation("invalid", "2024-02-30", 999, 1, "observe"),
  ]);
  const prefiltered = run([
    evaluation("removed", "2024-01-01", 999, 1, "remove"),
    evaluation("kept", "2024-01-02", 0.1),
  ]);

  const demo = window.__BREAKTEST__.result;
  return {
    pastOnly: compact(pastOnly),
    withFuture: compact(withFuture),
    futureChanged: compact(futureChanged),
    expiry: compact(expiry),
    withinWindow: compact(withinWindow),
    sameDate: compact(sameDate),
    sameDateTie: compact(sameDateTie),
    zeroBudget: compact(zeroBudget),
    invalid: compact(invalid),
    prefiltered: compact(prefiltered),
    aggregates: {
      expiryTotal: expiry.totalAcceptedUnits,
      expiryPeak: expiry.peakRollingUnits,
      demoPeak: demo.keptTurnoverPeakAnnual,
      demoAverage: demo.keptTurnoverAverageAnnual,
      demoCap: demo.turnoverCapAnnual,
      demoWindow: demo.turnoverWindowDays,
      demoAllHaveDiagnostics: demo.evaluations.every((item) => item.turnoverDiagnostics),
    },
    labels: {
      capital: document.querySelector("#mini-turnover").previousElementSibling.textContent,
      budget: document.querySelector("#mini-budget").previousElementSibling.textContent,
      comparison: document.getElementById("oos-comparison").textContent,
      bodyHasExPost: document.body.textContent.includes("turnover encore ex post"),
      bodyHasRolling: document.body.textContent.includes("turnover glissant 365 j"),
    },
  };
}
"""


def by_id(rows):
    return {row["id"]: row for row in rows}


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

    past = by_id(result["pastOnly"])["past"]
    past_with_future = by_id(result["withFuture"])["past"]
    past_future_changed = by_id(result["futureChanged"])["past"]
    assert past["status"] == "keep"
    assert past_with_future == past, (past_with_future, past)
    assert past_future_changed == past, (past_future_changed, past)
    assert by_id(result["withFuture"])["future"]["status"] == "remove"

    expiry = by_id(result["expiry"])
    assert expiry["first"]["status"] == "keep"
    assert expiry["after-window"]["status"] == "keep"
    assert expiry["after-window"]["diagnostics"]["rollingUsedBefore"] == 0
    assert result["aggregates"]["expiryTotal"] == 2
    assert result["aggregates"]["expiryPeak"] == 1

    within = by_id(result["withinWindow"])
    assert within["first"]["status"] == "keep"
    assert within["within-window"]["status"] == "remove"
    assert within["within-window"]["diagnostics"]["rollingUsedBefore"] == 1

    same = by_id(result["sameDate"])
    assert same["high"]["status"] == "keep", same
    assert same["low"]["status"] == "remove", same
    assert same["high"]["diagnostics"]["rankWithinDate"] == 1
    assert same["low"]["diagnostics"]["rankWithinDate"] == 2

    tie = by_id(result["sameDateTie"])
    assert tie["alpha"]["status"] == "keep", tie
    assert tie["zeta"]["status"] == "remove", tie

    zero = by_id(result["zeroBudget"])["zero"]
    assert zero["status"] == "remove"
    assert zero["diagnostics"]["budgetUnits"] == 0
    assert zero["diagnostics"]["rollingUsedAfter"] == 0

    invalid = by_id(result["invalid"])
    assert invalid["valid"]["status"] == "keep"
    assert invalid["invalid"]["status"] == "observe"
    assert invalid["invalid"]["diagnostics"]["decisionDateValid"] is False
    assert invalid["invalid"]["diagnostics"]["outcome"] == "invalid-date"

    prefiltered = by_id(result["prefiltered"])
    assert prefiltered["removed"]["diagnostics"]["outcome"] == "remove"
    assert prefiltered["removed"]["diagnostics"]["rollingUsedAfter"] == 0
    assert prefiltered["kept"]["status"] == "keep"

    aggregates = result["aggregates"]
    assert aggregates["demoPeak"] <= aggregates["demoCap"] + 1e-12, aggregates
    assert aggregates["demoAverage"] >= 0
    assert aggregates["demoWindow"] == 365.25
    assert aggregates["demoAllHaveDiagnostics"] is True

    labels = result["labels"]
    assert labels["capital"] == "Pic turnover 365 j", labels
    assert labels["budget"] == "Plafond glissant", labels
    assert "Pic turnover 365 j" in labels["comparison"], labels
    assert labels["bodyHasExPost"] is False, labels
    assert labels["bodyHasRolling"] is True, labels
    print("C3 chronological turnover tests passed")


if __name__ == "__main__":
    asyncio.run(main())
