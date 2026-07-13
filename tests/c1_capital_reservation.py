#!/usr/bin/env python3
"""Browser invariants for C1 chronological capital reservation."""
import asyncio
import subprocess
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"

SCENARIO = r"""
() => {
  const evaluation = ({
    id,
    entry = "2024-01-01",
    exit = "2024-02-01",
    notional = 700,
    status = "keep",
    rank = 1,
    edge = 0.1,
    pnl = 0,
    turnoverUnits = 1,
  }) => ({
    trade: { id, entryDate: entry, exitDate: exit },
    position: { notional },
    status,
    preTurnoverStatus: status,
    reason: status === "keep" ? "eligible" : "prefiltered",
    conservativeNetEdge: edge,
    expectedNetEdge: edge,
    realizedNetPnl: pnl,
    turnoverUnits,
    turnoverDiagnostics: { rankWithinDate: rank },
  });
  const run = (rows, capital = 1000) => applyCapitalReservation(rows, { ...DEFAULT_CONFIG, capital });
  const compact = (result) => result.evaluations.map((item) => ({
    id: item.trade.id,
    status: item.status,
    reason: item.reason,
    diagnostics: item.capitalDiagnostics,
  }));

  const simultaneous = run([
    evaluation({ id: "first", rank: 1 }),
    evaluation({ id: "second", rank: 2 }),
  ]);
  const nonOverlapping = run([
    evaluation({ id: "early", entry: "2024-01-01", exit: "2024-01-02" }),
    evaluation({ id: "later", entry: "2024-01-02", exit: "2024-01-03" }),
  ]);
  const sameDateRelease = run([
    evaluation({ id: "leaving", entry: "2024-01-01", exit: "2024-01-10" }),
    evaluation({ id: "arriving", entry: "2024-01-10", exit: "2024-01-20" }),
  ]);
  const exactlyFunded = run([evaluation({ id: "exact", notional: 1000 })]);
  const zeroCapital = run([evaluation({ id: "zero", notional: 100 })], 0);
  const invalidEntry = run([evaluation({ id: "bad-entry", entry: "2024-02-30" })]);
  const invalidExit = run([evaluation({ id: "bad-exit", exit: "not-a-date" })]);
  const exitBeforeEntry = run([evaluation({ id: "reversed", entry: "2024-02-02", exit: "2024-02-01" })]);
  const prefiltered = run([
    evaluation({ id: "removed", status: "remove", notional: 1000, rank: null }),
    evaluation({ id: "kept", notional: 1000, rank: 1 }),
  ]);
  const priority = run([
    evaluation({ id: "alpha-low", rank: 2, edge: 0.1 }),
    evaluation({ id: "zeta-high", rank: 1, edge: 0.9 }),
  ]);
  const sameDayNoRecycling = run([
    evaluation({ id: "day-first", entry: "2024-03-01", exit: "2024-03-01", rank: 1 }),
    evaluation({ id: "day-second", entry: "2024-03-01", exit: "2024-03-01", rank: 2 }),
  ]);

  const pastOnly = run([
    evaluation({ id: "past", entry: "2024-01-01", exit: "2024-03-01", pnl: 0 }),
  ]);
  const withFuture = run([
    evaluation({ id: "past", entry: "2024-01-01", exit: "2024-03-01", pnl: 0 }),
    evaluation({ id: "future", entry: "2024-04-01", exit: "2024-05-01", pnl: 1e12 }),
  ]);
  const futureChanged = run([
    evaluation({ id: "past", entry: "2024-01-01", exit: "2024-03-01", pnl: 0 }),
    evaluation({ id: "future", entry: "2024-04-01", exit: "2024-05-01", pnl: -1e12 }),
  ]);

  const fundedTurnover = summarizeFundedTurnover(simultaneous.evaluations);
  const demo = window.__BREAKTEST__.result;
  return {
    simultaneous: { rows: compact(simultaneous), aggregates: simultaneous },
    nonOverlapping: { rows: compact(nonOverlapping), aggregates: nonOverlapping },
    sameDateRelease: compact(sameDateRelease),
    exactlyFunded: compact(exactlyFunded),
    zeroCapital: compact(zeroCapital),
    invalidEntry: compact(invalidEntry),
    invalidExit: compact(invalidExit),
    exitBeforeEntry: compact(exitBeforeEntry),
    prefiltered: compact(prefiltered),
    priority: compact(priority),
    sameDayNoRecycling: compact(sameDayNoRecycling),
    pastOnly: compact(pastOnly),
    withFuture: compact(withFuture),
    futureChanged: compact(futureChanged),
    fundedTurnover,
    demo: {
      capitalInitial: demo.capitalInitial,
      peakCapitalReserved: demo.peakCapitalReserved,
      minimumCapitalFree: demo.minimumCapitalFree,
      capitalFundingRefused: demo.capitalFundingRefused,
      allHaveDiagnostics: demo.evaluations.every((item) => item.capitalDiagnostics),
      allKeptFunded: demo.kept.every((item) => item.capitalDiagnostics.fundingDecision === "keep"),
      keptTurnoverPeakAnnual: demo.keptTurnoverPeakAnnual,
      turnoverCapAnnual: demo.turnoverCapAnnual,
    },
    labels: {
      eyebrow: document.querySelector("#capital-view .signal-card .eyebrow")?.textContent,
      peak: document.querySelector("#mini-turnover")?.previousElementSibling?.textContent,
      free: document.querySelector("#mini-budget")?.previousElementSibling?.textContent,
      equityCaption: document.querySelector("#equity-caption")?.textContent,
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
        await page.wait_for_timeout(250)
        result = await page.evaluate(SCENARIO)
        await browser.close()

    assert not errors, errors

    simultaneous = by_id(result["simultaneous"]["rows"])
    assert simultaneous["first"]["status"] == "keep", simultaneous
    assert simultaneous["second"]["status"] == "remove", simultaneous
    assert simultaneous["second"]["diagnostics"]["fundingDecision"] == "insufficient-capital"
    assert result["simultaneous"]["aggregates"]["peakReserved"] == 700
    assert result["simultaneous"]["aggregates"]["minimumFree"] == 300
    assert result["simultaneous"]["aggregates"]["fundingRefused"] == 1

    non_overlapping = by_id(result["nonOverlapping"]["rows"])
    assert non_overlapping["early"]["status"] == "keep", non_overlapping
    assert non_overlapping["later"]["status"] == "keep", non_overlapping
    assert non_overlapping["later"]["diagnostics"]["releasedBeforeGroup"] == 700
    assert result["nonOverlapping"]["aggregates"]["peakReserved"] == 700

    same_date_release = by_id(result["sameDateRelease"])
    assert same_date_release["leaving"]["status"] == "keep"
    assert same_date_release["arriving"]["status"] == "keep"
    assert same_date_release["arriving"]["diagnostics"]["releasedBeforeGroup"] == 700

    exact = by_id(result["exactlyFunded"])["exact"]
    assert exact["status"] == "keep"
    assert exact["diagnostics"]["freeAfter"] == 0

    zero = by_id(result["zeroCapital"])["zero"]
    assert zero["status"] == "remove"
    assert zero["diagnostics"]["fundingDecision"] == "insufficient-capital"
    assert zero["diagnostics"]["reservedAfter"] == 0

    bad_entry = by_id(result["invalidEntry"])["bad-entry"]
    assert bad_entry["status"] == "observe"
    assert bad_entry["diagnostics"]["fundingDecision"] == "invalid-entry-date"

    bad_exit = by_id(result["invalidExit"])["bad-exit"]
    assert bad_exit["status"] == "observe"
    assert bad_exit["diagnostics"]["fundingDecision"] == "invalid-exit-date"

    reversed_trade = by_id(result["exitBeforeEntry"])["reversed"]
    assert reversed_trade["status"] == "observe"
    assert reversed_trade["diagnostics"]["fundingDecision"] == "exit-before-entry"

    prefiltered = by_id(result["prefiltered"])
    assert prefiltered["removed"]["status"] == "remove"
    assert prefiltered["removed"]["diagnostics"]["fundingDecision"] == "prefiltered"
    assert prefiltered["removed"]["diagnostics"]["reservedAfter"] == 0
    assert prefiltered["kept"]["status"] == "keep"

    priority = by_id(result["priority"])
    assert priority["zeta-high"]["status"] == "keep", priority
    assert priority["alpha-low"]["status"] == "remove", priority

    same_day = by_id(result["sameDayNoRecycling"])
    assert same_day["day-first"]["status"] == "keep", same_day
    assert same_day["day-second"]["status"] == "remove", same_day
    assert same_day["day-second"]["diagnostics"]["releasedBeforeGroup"] == 0

    past = by_id(result["pastOnly"])["past"]
    past_with_future = by_id(result["withFuture"])["past"]
    past_future_changed = by_id(result["futureChanged"])["past"]
    assert past_with_future == past, (past_with_future, past)
    assert past_future_changed == past, (past_future_changed, past)

    assert result["fundedTurnover"]["totalAcceptedUnits"] == 1
    assert result["fundedTurnover"]["peakRollingUnits"] == 1

    demo = result["demo"]
    assert demo["capitalInitial"] >= 0
    assert 0 <= demo["peakCapitalReserved"] <= demo["capitalInitial"] + 1e-9, demo
    assert 0 <= demo["minimumCapitalFree"] <= demo["capitalInitial"] + 1e-9, demo
    assert demo["capitalFundingRefused"] >= 0
    assert demo["allHaveDiagnostics"] is True
    assert demo["allKeptFunded"] is True
    assert demo["keptTurnoverPeakAnnual"] <= demo["turnoverCapAnnual"] + 1e-12

    labels = result["labels"]
    assert labels["eyebrow"] == "CAPITAL RESERVATION", labels
    assert labels["peak"] == "Pic capital réservé", labels
    assert labels["free"] == "Capital libre minimum", labels
    assert "courbe encore non temporelle" in labels["equityCaption"], labels

    print("C1 capital reservation tests passed")


if __name__ == "__main__":
    asyncio.run(main())
