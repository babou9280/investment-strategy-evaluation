#!/usr/bin/env python3
"""Browser invariants for C4 realized-cash equity and event-driven funding."""
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
    exit = "2024-01-10",
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
  const compact = (result) => ({
    statuses: Object.fromEntries(result.evaluations.map((item) => [item.trade.id, {
      status: item.status,
      reason: item.reason,
      diagnostics: item.capitalDiagnostics,
    }])),
    realizedCapital: result.realizedCapital,
    realizedPnlTotal: result.realizedPnlTotal,
    curve: result.realizedEquityCurve,
    events: result.realizedEvents,
    reservedAtEnd: result.reservedAtEnd,
    openPositionsAtEnd: result.openPositionsAtEnd,
    peakReserved: result.peakReserved,
    minimumFree: result.minimumFree,
    fundingRefused: result.fundingRefused,
  });

  const gain = compact(run([evaluation({ id: "gain", pnl: 100 })]));
  const loss = compact(run([evaluation({ id: "loss", pnl: -100 })]));
  const changedEntry = compact(run([evaluation({ id: "gain", entry: "2024-01-05", exit: "2024-01-10", pnl: 100 })]));
  const changedExit = compact(run([evaluation({ id: "gain", exit: "2024-01-20", pnl: 100 })]));
  const sameExitA = compact(run([
    evaluation({ id: "a", notional: 400, pnl: 50 }),
    evaluation({ id: "b", notional: 400, pnl: -20, rank: 2 }),
  ]));
  const sameExitB = compact(run([
    evaluation({ id: "b", notional: 400, pnl: -20, rank: 2 }),
    evaluation({ id: "a", notional: 400, pnl: 50 }),
  ]));
  const gainFunds = compact(run([
    evaluation({ id: "old", notional: 900, pnl: 200, exit: "2024-01-10" }),
    evaluation({ id: "new", entry: "2024-01-10", exit: "2024-01-20", notional: 1100 }),
  ]));
  const lossBlocks = compact(run([
    evaluation({ id: "old", notional: 900, pnl: -200, exit: "2024-01-10" }),
    evaluation({ id: "new", entry: "2024-01-10", exit: "2024-01-20", notional: 900 }),
  ]));
  const removedObserved = compact(run([
    evaluation({ id: "removed", status: "remove", pnl: 999 }),
    evaluation({ id: "observed", status: "observe", pnl: 999, rank: 2 }),
  ]));
  const invalidExit = compact(run([evaluation({ id: "bad", exit: "2024-02-30", pnl: 100 })]));
  const pastOnly = compact(run([evaluation({ id: "past", exit: "2024-01-10", pnl: 100 })]));
  const futurePlus = compact(run([
    evaluation({ id: "past", exit: "2024-01-10", pnl: 100 }),
    evaluation({ id: "future", entry: "2024-02-01", exit: "2024-02-10", pnl: 1e9 }),
  ]));
  const futureMinus = compact(run([
    evaluation({ id: "past", exit: "2024-01-10", pnl: 100 }),
    evaluation({ id: "future", entry: "2024-02-01", exit: "2024-02-10", pnl: -1e9 }),
  ]));
  const sameDayNoRecycle = compact(run([
    evaluation({ id: "first", entry: "2024-03-01", exit: "2024-03-01", notional: 700, rank: 1 }),
    evaluation({ id: "second", entry: "2024-03-01", exit: "2024-03-01", notional: 700, rank: 2 }),
  ]));

  const demo = window.__BREAKTEST__.result;
  return {
    gain,
    loss,
    changedEntry,
    changedExit,
    sameExitA,
    sameExitB,
    gainFunds,
    lossBlocks,
    removedObserved,
    invalidExit,
    pastOnly,
    futurePlus,
    futureMinus,
    sameDayNoRecycle,
    demo: {
      curve: demo.realizedEquityCurve,
      events: demo.realizedEvents,
      realizedCapital: demo.realizedCapital,
      filteredNetPnl: demo.filteredNetPnl,
      reservedAtEnd: demo.capitalReservedAtEnd,
      caption: document.getElementById("equity-caption").textContent,
      staticCaption: document.querySelector("#capital-equity-chart + .chart-caption span")?.textContent,
      aria: document.getElementById("capital-equity-chart").getAttribute("aria-label"),
      heading: document.querySelector(".equity-card h3")?.textContent,
      legend: document.querySelector(".equity-card .legend")?.textContent,
    },
  };
}
"""


def assert_reconciled(events):
    for event in events:
        assert abs(event["freeBefore"] - (event["realizedCapitalBefore"] - event["reservedBefore"])) < 1e-9, event
        assert abs(event["freeAfter"] - (event["realizedCapitalAfter"] - event["reservedAfter"])) < 1e-9, event


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

    gain = result["gain"]
    assert gain["events"][1]["type"] == "entry"
    assert gain["events"][1]["realizedCapitalAfter"] == 1000
    assert gain["curve"][0]["value"] == 1000
    assert gain["curve"][1]["date"] == "2024-01-10"
    assert gain["curve"][1]["value"] == 1100
    assert gain["curve"][1]["pnlApplied"] == 100

    loss = result["loss"]
    assert loss["events"][1]["realizedCapitalAfter"] == 1000
    assert loss["curve"][1]["date"] == "2024-01-10"
    assert loss["curve"][1]["value"] == 900
    assert loss["curve"][1]["pnlApplied"] == -100

    assert result["changedEntry"]["curve"] == gain["curve"]
    assert result["changedExit"]["curve"][1]["date"] == "2024-01-20"

    same_exit_a = result["sameExitA"]
    same_exit_b = result["sameExitB"]
    assert same_exit_a["curve"] == same_exit_b["curve"]
    assert len(same_exit_a["curve"]) == 2
    assert same_exit_a["curve"][1]["value"] == 1030
    assert same_exit_a["curve"][1]["pnlApplied"] == 30

    gain_funds = result["gainFunds"]
    assert gain_funds["statuses"]["new"]["status"] == "keep"
    assert gain_funds["statuses"]["new"]["diagnostics"]["realizedPnlBeforeGroup"] == 200
    assert gain_funds["statuses"]["new"]["diagnostics"]["freeBefore"] == 1200

    loss_blocks = result["lossBlocks"]
    assert loss_blocks["statuses"]["new"]["status"] == "remove"
    assert loss_blocks["statuses"]["new"]["diagnostics"]["realizedPnlBeforeGroup"] == -200
    assert loss_blocks["statuses"]["new"]["diagnostics"]["freeBefore"] == 800

    removed_observed = result["removedObserved"]
    assert len(removed_observed["curve"]) == 1
    assert removed_observed["realizedCapital"] == 1000

    invalid_exit = result["invalidExit"]
    assert invalid_exit["statuses"]["bad"]["status"] == "observe"
    assert invalid_exit["statuses"]["bad"]["diagnostics"]["fundingDecision"] == "invalid-exit-date"
    assert len(invalid_exit["curve"]) == 1

    past = result["pastOnly"]
    for future in (result["futurePlus"], result["futureMinus"]):
        assert future["statuses"]["past"] == past["statuses"]["past"]
        assert future["curve"][:2] == past["curve"]

    same_day = result["sameDayNoRecycle"]
    assert same_day["statuses"]["first"]["status"] == "keep"
    assert same_day["statuses"]["second"]["status"] == "remove"
    assert same_day["statuses"]["second"]["diagnostics"]["realizedPnlBeforeGroup"] == 0

    for scenario in (
        gain,
        loss,
        same_exit_a,
        result["gainFunds"],
        result["lossBlocks"],
        result["removedObserved"],
        invalid_exit,
        same_day,
    ):
        assert scenario["reservedAtEnd"] == 0
        assert scenario["openPositionsAtEnd"] == 0
        assert abs(scenario["realizedCapital"] - (1000 + scenario["realizedPnlTotal"])) < 1e-9
        assert_reconciled(scenario["events"])

    demo = result["demo"]
    assert demo["curve"][0]["value"] == 1000
    assert demo["reservedAtEnd"] == 0
    assert abs(demo["realizedCapital"] - (1000 + demo["filteredNetPnl"])) < 1e-8, demo
    assert_reconciled(demo["events"])
    assert "non mark-to-market" in demo["caption"]
    assert "non mark-to-market" in demo["staticCaption"]
    assert "réalisée" in demo["aria"]
    assert demo["heading"] == "Capital réalisé aux sorties"
    assert "Trades financés" in demo["legend"]

    print("C4 realized equity curve tests passed")


if __name__ == "__main__":
    asyncio.run(main())
