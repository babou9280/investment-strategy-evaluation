#!/usr/bin/env python3
"""Focused browser regression for H1.

Requires Python Playwright and a Chromium executable. The script compares the
modified application with the immutable pre-H1 bundle stored in app/.bundle/.
"""
import asyncio
import base64
import gzip
import hashlib
from pathlib import Path
from tempfile import TemporaryDirectory

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"
BUNDLE_PARTS = sorted((ROOT / "app" / ".bundle").glob("payload.part*"))
ORIGINAL_SHA256 = "5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00"

VALID = """sample,strategy,ticker,entry_date,exit_date,invested_eur,gross_pnl_eur,gross_return,entry_price_usd
backtest,A,B1,2024-01-01,2024-01-02,100,10,0.1,10
backtest,A,B2,2024-02-01,2024-02-02,100,8,0.08,10
backtest,A,B3,2024-03-01,2024-03-02,100,6,0.06,10
backtest,A,B4,2024-04-01,2024-04-02,100,4,0.04,10
backtest,A,B5,2024-05-01,2024-05-02,100,2,0.02,10
live,A,L1,2025-01-01,2025-01-02,100,5,,10
live,A,L2,2025-02-01,2025-02-02,100,-1,-0.01,10
"""
INVALID = """sample,strategy,ticker,entry_date,exit_date,invested_eur,gross_pnl_eur,gross_return,entry_price_usd
backtest,A,B1,2024-01-01,2024-01-02,100,10,0.1,10
backtest,A,B2,2024-02-01,2024-02-02,100,8,not-a-number,10
backtest,A,B3,2024-03-01,2024-03-02,100,6,0.06,10
backtest,A,B4,2024-04-01,2024-04-02,100,4,0.04,10
backtest,A,B5,2024-05-01,2024-05-02,100,2,0.02,10
live,A,L1,2025-01-01,2025-01-02,100,5,0.05,10
live,A,L2,2025-02-01,2025-02-02,100,-1,-0.01,10
"""


def original_html() -> str:
    if len(BUNDLE_PARTS) != 7:
        raise AssertionError(f"Expected 7 original bundle parts, found {len(BUNDLE_PARTS)}")
    encoded = "".join(part.read_text(encoding="ascii").strip() for part in BUNDLE_PARTS)
    payload = gzip.decompress(base64.b64decode(encoded, validate=True))
    actual = hashlib.sha256(payload).hexdigest()
    if actual != ORIGINAL_SHA256:
        raise AssertionError(f"Original bundle SHA mismatch: {actual}")
    return payload.decode("utf-8")


async def snapshot(page, html: str):
    await page.set_content(html, wait_until="load")
    await page.wait_for_timeout(150)
    return await page.evaluate(
        """() => ({
          trades: window.__BREAKTEST__.state.trades.map(t => ({
            id:t.id, invested:t.invested, grossPnl:t.grossPnl, grossReturn:t.grossReturn
          })),
          summary: {
            evals: window.__BREAKTEST__.result.evaluations.length,
            kept: window.__BREAKTEST__.result.kept.length,
            removed: window.__BREAKTEST__.result.removed.length,
            baselineGrossPnl: window.__BREAKTEST__.result.baselineGrossPnl,
            baselineNetPnl: window.__BREAKTEST__.result.baselineNetPnl,
            filteredNetPnl: window.__BREAKTEST__.result.filteredNetPnl,
            baselineCosts: window.__BREAKTEST__.result.baselineCosts,
            filteredCosts: window.__BREAKTEST__.result.filteredCosts,
            filteredReturn: window.__BREAKTEST__.result.filteredReturn
          }
        })"""
    )


async def main():
    page_errors = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=True,
            executable_path="/usr/bin/chromium",
            args=["--no-sandbox"],
        )
        baseline_page = await browser.new_page(viewport={"width": 1440, "height": 1000})
        modified_page = await browser.new_page(viewport={"width": 1440, "height": 1000})
        baseline_page.on("pageerror", lambda exc: page_errors.append(f"baseline: {exc}"))
        modified_page.on("pageerror", lambda exc: page_errors.append(f"modified: {exc}"))

        baseline = await snapshot(baseline_page, original_html())
        modified = await snapshot(modified_page, HTML.read_text(encoding="utf-8"))
        assert baseline == modified, "The H1 change altered the demonstration's numerical snapshot"
        assert not page_errors, page_errors
        page = modified_page

        with TemporaryDirectory() as tmp:
            valid_path = Path(tmp) / "valid_h1.csv"
            valid_path.write_text(VALID, encoding="utf-8")
            await page.set_input_files("#csv-input", str(valid_path))
            await page.wait_for_timeout(200)
            assert await page.evaluate("window.__BREAKTEST__.state.trades.length") == 7
            assert await page.evaluate(
                "window.__BREAKTEST__.state.trades.find(t=>t.ticker==='L1').grossReturn"
            ) == 0.05
            assert await page.evaluate(
                "window.__BREAKTEST__.state.trades.find(t=>t.ticker==='L1').grossReturnDerived"
            ) is True

            before = await page.evaluate("window.__BREAKTEST__.state.trades.map(t=>t.id).join('|')")
            invalid_path = Path(tmp) / "invalid_h1.csv"
            invalid_path.write_text(INVALID, encoding="utf-8")
            await page.set_input_files("#csv-input", str(invalid_path))
            await page.wait_for_timeout(200)
            after = await page.evaluate("window.__BREAKTEST__.state.trades.map(t=>t.id).join('|')")
            toast = await page.locator("#toast").inner_text()
            assert before == after, "A rejected import must preserve the previous dataset"
            assert "Ligne 2" in toast and "gross_return invalide" in toast, toast

        assert not page_errors, page_errors
        await browser.close()
    print("H1 browser smoke passed; demo numerical snapshot unchanged")


if __name__ == "__main__":
    asyncio.run(main())
