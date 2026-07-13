#!/usr/bin/env python3
"""C4 invariant: realized losses can expose negative free cash without implicit liquidation."""
import asyncio
import subprocess
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"

SCENARIO = r"""
() => {
  const row = ({ id, entry, exit, notional, pnl, rank }) => ({
    trade: { id, entryDate: entry, exitDate: exit },
    position: { notional },
    status: "keep",
    preTurnoverStatus: "keep",
    reason: "eligible",
    conservativeNetEdge: 0.1,
    expectedNetEdge: 0.1,
    realizedNetPnl: pnl,
    turnoverUnits: 1,
    turnoverDiagnostics: { rankWithinDate: rank },
  });
  const result = applyCapitalReservation([
    row({ id: "loss-exit", entry: "2024-01-01", exit: "2024-01-10", notional: 500, pnl: -700, rank: 1 }),
    row({ id: "still-open", entry: "2024-01-01", exit: "2024-01-20", notional: 500, pnl: 0, rank: 2 }),
    row({ id: "new-entry", entry: "2024-01-10", exit: "2024-01-30", notional: 1, pnl: 0, rank: 1 }),
  ], { ...DEFAULT_CONFIG, capital: 1000 });
  return {
    statuses: Object.fromEntries(result.evaluations.map((item) => [item.trade.id, {
      status: item.status,
      diagnostics: item.capitalDiagnostics,
    }])),
    minimumFree: result.minimumFree,
    events: result.realizedEvents,
    reservedAtEnd: result.reservedAtEnd,
    openPositionsAtEnd: result.openPositionsAtEnd,
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
        page = await browser.new_page()
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.set_content(HTML.read_text(encoding="utf-8"), wait_until="load")
        result = await page.evaluate(SCENARIO)
        await browser.close()

    assert not errors, errors
    new_entry = result["statuses"]["new-entry"]
    assert new_entry["status"] == "remove", new_entry
    assert new_entry["diagnostics"]["fundingDecision"] == "insufficient-capital"
    assert new_entry["diagnostics"]["realizedCapitalBefore"] == 300
    assert new_entry["diagnostics"]["reservedBefore"] == 500
    assert new_entry["diagnostics"]["freeBefore"] == -200
    assert result["minimumFree"] == -200
    assert any(event["type"] == "exit" and event["freeAfter"] == -200 for event in result["events"])
    assert result["reservedAtEnd"] == 0
    assert result["openPositionsAtEnd"] == 0
    print("C4 negative free cash test passed")


if __name__ == "__main__":
    asyncio.run(main())
