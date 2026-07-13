#!/usr/bin/env python3
"""Browser invariants for H3 price-currency provenance and integer sizing."""
import asyncio
import subprocess
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"

SCENARIO = r"""
async () => {
  const raw = (id, overrides = {}) => normalizeTrade({
    id,
    sample: "live",
    ticker: id.toUpperCase(),
    strategy: "H3",
    entry_date: "2024-01-01",
    exit_date: "2024-01-10",
    invested_eur: 1000,
    gross_pnl_eur: 100,
    gross_return: 0.1,
    ...overrides,
  });
  const config = {
    ...DEFAULT_CONFIG,
    capital: 1000,
    referenceCapital: 1000,
    maxPositionPct: 1,
    fractionalShares: false,
    eurPerQuoteCurrency: 0.92,
  };
  const position = (trade, overrides = {}) => positionForTrade(trade, { ...config, ...overrides });
  const compact = (value) => ({
    unitPriceEur: value.unitPriceEur,
    units: value.units,
    notional: value.notional,
    executable: value.executable,
    sizingStatus: value.sizingStatus,
    diagnostics: value.priceDiagnostics,
  });

  const eurTrade = raw("eur", { entry_price_eur: 100 });
  const usdTrade = raw("usd", { entry_price_usd: 100 });
  const genericEurTrade = raw("generic-eur", { entry_price: 100, entry_price_currency: "EUR" });
  const genericUsdTrade = raw("generic-usd", { entry_price: 100, quote_currency: "USD" });
  const unspecifiedTrade = raw("unspecified", { entry_price: 100 });
  const unsupportedTrade = raw("unsupported", { entry_price: 100, currency: "GBP" });
  const missingTrade = raw("missing");
  const expensiveTrade = raw("expensive", { entry_price_eur: 1200 });

  const eur = compact(position(eurTrade));
  const eurChangedFx = compact(position(eurTrade, { eurPerQuoteCurrency: 0.8 }));
  const usd = compact(position(usdTrade));
  const usdChangedFx = compact(position(usdTrade, { eurPerQuoteCurrency: 0.8 }));
  const genericEur = compact(position(genericEurTrade));
  const genericUsd = compact(position(genericUsdTrade));
  const unspecifiedInteger = compact(position(unspecifiedTrade));
  const unspecifiedFractional = compact(position(unspecifiedTrade, { fractionalShares: true }));
  const unsupportedInteger = compact(position(unsupportedTrade));
  const missingInteger = compact(position(missingTrade));
  const expensive = compact(position(expensiveTrade));
  const exactOne = compact(position(eurTrade, { capital: 100, referenceCapital: 1000, maxPositionPct: 1 }));
  const belowOne = compact(position(eurTrade, { capital: 99, referenceCapital: 1000, maxPositionPct: 1 }));

  const auditRows = [eurTrade, usdTrade, genericEurTrade, genericUsdTrade, unspecifiedTrade, unsupportedTrade, missingTrade];
  const audit = auditData(auditRows);

  const model = fitEdgeModel(Array.from({ length: 6 }, (_, index) => normalizeTrade({
    id: `train-${index}`,
    sample: "backtest",
    ticker: `T${index}`,
    strategy: "H3",
    entry_date: `2023-01-0${index + 1}`,
    exit_date: `2023-01-1${index + 1}`,
    invested_eur: 1000,
    gross_pnl_eur: 100,
    gross_return: 0.1,
    entry_price_usd: 100,
  })), { ...config, minTrainingObservations: 1 });
  const evaluationConfig = { ...config, minTrainingObservations: 1, confidence: 0.5, priorStrength: 0, turnoverCapAnnual: 100 };
  const evaluations = [eurTrade, usdTrade, unspecifiedTrade].map((trade) => evaluateTrade(trade, model, evaluationConfig));
  const result = {
    ...evaluatePortfolio([
      ...Array.from({ length: 6 }, (_, index) => normalizeTrade({
        id: `train-${index}`,
        sample: "backtest",
        ticker: `T${index}`,
        strategy: "H3",
        entry_date: `2023-01-0${index + 1}`,
        exit_date: `2023-01-1${index + 1}`,
        invested_eur: 1000,
        gross_pnl_eur: 100,
        gross_return: 0.1,
        entry_price_usd: 100,
      })),
      eurTrade,
      usdTrade,
      unspecifiedTrade,
    ], { ...evaluationConfig, analysisSample: "live" }),
    evaluations,
    trainingSummary: { min: 6, max: 6 },
  };
  state.trades = auditRows;
  state.result = result;
  state.ledgerFilter = "all";
  state.ledgerSearch = "";
  renderLedger(result);
  const ui = {
    ledgerText: byId("ledger-body").textContent,
    auditText: byId("audit-issues").textContent,
  };

  let exported = null;
  const originalCreate = URL.createObjectURL;
  const originalClick = HTMLAnchorElement.prototype.click;
  URL.createObjectURL = (blob) => { exported = blob; return "blob:h3"; };
  HTMLAnchorElement.prototype.click = function () {};
  exportDecisions();
  const exportText = exported ? await exported.text() : "";
  URL.createObjectURL = originalCreate;
  HTMLAnchorElement.prototype.click = originalClick;

  const imported = normalizeTrades(parseCsv([
    "sample,ticker,invested_eur,gross_pnl_eur,gross_return,entry_price_eur,entry_price_usd,entry_price,entry_price_currency",
    "live,EURCSV,1000,100,0.1,100,,,,",
    "live,USDCSV,1000,100,0.1,,100,,",
    "live,GENCSV,1000,100,0.1,,,100,EUR",
  ].join("\n")));

  return {
    eur,
    eurChangedFx,
    usd,
    usdChangedFx,
    genericEur,
    genericUsd,
    unspecifiedInteger,
    unspecifiedFractional,
    unsupportedInteger,
    missingInteger,
    expensive,
    exactOne,
    belowOne,
    audit,
    ui,
    exportText,
    imported: imported.map((trade) => trade.entryPriceInfo),
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

    eur = result["eur"]
    assert eur["unitPriceEur"] == 100
    assert eur["units"] == 10
    assert eur["notional"] == 1000
    assert eur["diagnostics"]["conversionFactor"] == 1
    assert eur["diagnostics"]["conversionStatus"] == "already-eur"
    assert result["eurChangedFx"] == eur

    usd = result["usd"]
    assert abs(usd["unitPriceEur"] - 92) < 1e-12
    assert usd["units"] == 10
    assert abs(usd["notional"] - 920) < 1e-12
    assert usd["diagnostics"]["conversionFactor"] == 0.92
    assert usd["diagnostics"]["conversionStatus"] == "converted-once"
    assert abs(result["usdChangedFx"]["unitPriceEur"] - 80) < 1e-12
    assert result["usdChangedFx"]["units"] == 12
    assert abs(result["usdChangedFx"]["notional"] - 960) < 1e-12

    assert result["genericEur"]["unitPriceEur"] == 100
    assert abs(result["genericUsd"]["unitPriceEur"] - 92) < 1e-12

    unspecified = result["unspecifiedInteger"]
    assert unspecified["executable"] is False
    assert unspecified["notional"] == 0
    assert unspecified["sizingStatus"] == "unconvertible-price"
    assert unspecified["diagnostics"]["currencyProvenance"] == "unspecified"

    fractional = result["unspecifiedFractional"]
    assert fractional["executable"] is True
    assert fractional["notional"] == 1000
    assert fractional["units"] == 0
    assert fractional["sizingStatus"] == "fractional-notional"

    unsupported = result["unsupportedInteger"]
    assert unsupported["executable"] is False
    assert unsupported["diagnostics"]["sourceCurrency"] == "GBP"
    assert result["missingInteger"]["sizingStatus"] == "missing-price"
    assert result["expensive"]["sizingStatus"] == "below-one-unit"
    assert result["exactOne"]["units"] == 1
    assert result["exactOne"]["notional"] == 100
    assert result["belowOne"]["executable"] is False

    audit = result["audit"]
    assert audit["eurPrices"] == 2
    assert audit["usdPrices"] == 2
    assert audit["unsupportedPriceCurrencies"] == 2
    assert audit["missingPrices"] == 1

    imported = result["imported"]
    assert imported[0]["sourceCurrency"] == "EUR"
    assert imported[1]["sourceCurrency"] == "USD"
    assert imported[2]["sourceCurrency"] == "EUR"
    assert imported[2]["currencyProvenance"] == "explicit-field"

    ui = result["ui"]
    assert "EUR" in ui["ledgerText"]
    assert "USD" in ui["ledgerText"]
    assert "non convertible" in ui["ledgerText"]
    assert "prix EUR" in ui["auditText"]
    assert "prix USD" in ui["auditText"]
    assert "devise prix non supportée" in ui["auditText"]

    export_text = result["exportText"]
    for header in (
        "entry_price_source_value",
        "entry_price_source_key",
        "entry_price_source_currency",
        "entry_price_currency_provenance",
        "entry_price_conversion_factor",
        "entry_price_eur",
        "entry_price_conversion_status",
        "unit_sizing_status",
    ):
        assert header in export_text, header
    assert "entry_price_eur" in export_text
    assert "entry_price_usd" in export_text
    assert "already-eur" in export_text
    assert "converted-once" in export_text

    print("H3 price currency provenance browser tests passed")


if __name__ == "__main__":
    asyncio.run(main())
