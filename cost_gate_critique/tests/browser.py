#!/usr/bin/env python3
"""Exercise the exact offline package in Chromium under file://."""

from __future__ import annotations

import json
import os
import re
import subprocess
from pathlib import Path

from playwright.sync_api import Page, sync_playwright


PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent
PACKAGE = PROJECT / "dist" / "breaktest-cost-gate-gate1"
INDEX = PACKAGE / "index.html"
VIEWPORTS = [390, 768, 1024, 1440]


def executable_path() -> str | None:
    explicit = os.environ.get("CHROMIUM_PATH")
    if explicit:
        return explicit
    system = Path("/usr/bin/chromium")
    return str(system) if system.exists() else None


def open_page(browser, width: int = 1440) -> tuple[Page, list[str], list[str], list[str]]:
    page = browser.new_page(viewport={"width": width, "height": 1000})
    page.emulate_media(reduced_motion="reduce")
    console_errors: list[str] = []
    page_errors: list[str] = []
    requests: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on("request", lambda request: requests.append(request.url))
    page.goto(INDEX.as_uri(), wait_until="load")
    return page, console_errors, page_errors, requests


def submit_demo(page: Page) -> None:
    page.get_by_role("button", name="Charger la démonstration synthétique").click()
    page.get_by_role("button", name="Analyser ce scénario").click()
    page.locator("#results").wait_for(state="visible")


def assert_clean_runtime(console_errors: list[str], page_errors: list[str], requests: list[str]) -> None:
    assert not console_errors, console_errors
    assert not page_errors, page_errors
    assert requests, "No local resources requested"
    assert all(url.startswith("file://") for url in requests), requests


def node_demo_result() -> dict:
    code = f"""
const engine = require({json.dumps(str(ROOT / 'cost_gate_foundation' / 'engine.js'))});
const scenario = require({json.dumps(str(PROJECT / 'src' / 'scenario.js'))});
const built = scenario.buildScenario(engine, scenario.demoFields(), {{mode:'demo', instanceId:'parity-instance'}});
if (!built.ok) throw new Error(JSON.stringify(built.errors));
process.stdout.write(JSON.stringify(engine.compute(built.input)));
"""
    output = subprocess.run(["node", "-e", code], check=True, capture_output=True, text=True).stdout
    return json.loads(output)


assert INDEX.is_file(), "Build the offline package before browser tests"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        headless=True,
        executable_path=executable_path(),
    )

    page, console_errors, page_errors, requests = open_page(browser)
    assert page.locator("#results").is_hidden()
    assert page.locator("#stale-banner").is_hidden()
    assert all(value == "" for value in page.locator('input[type="text"]').evaluate_all("els => els.map(el => el.value)"))
    assert not page.locator('input[type="radio"]:checked').count()
    page.keyboard.press("Tab")
    assert page.evaluate("document.activeElement.classList.contains('skip-link')")
    skip_box = page.locator(".skip-link").bounding_box()
    assert skip_box and skip_box["y"] >= 0 and skip_box["y"] < 100
    page.keyboard.press("Enter")
    assert page.evaluate("document.activeElement.id") == "main-content"
    assert page.evaluate("getComputedStyle(document.documentElement).scrollBehavior") == "auto"

    submit_demo(page)
    assert "Démonstration synthétique chargée" in page.locator("#provenance-text").inner_text()
    assert page.locator("#result-title").inner_text() == "Aucune incompatibilité n’a été détectée dans les couches évaluées"
    assert page.evaluate("document.activeElement.id") == "result-title"
    warning = page.locator(".recommendation-warning").inner_text()
    assert "ni une recommandation" in warning and "ni une autorisation" in warning
    assert "1,10" in page.locator('[data-metric="break-even"] .metric-value').inner_text()
    assert "502,25" in page.locator('[data-metric="entry-cash"] .metric-value').inner_text()
    assert "1 000" in page.locator('[data-metric="cash-ceiling"] .metric-value').inner_text().replace("\u202f", " ")
    finding_count = page.locator(".finding").count()
    browser_finding_count = page.evaluate("BreaktestCostGate.compute(BreaktestCostGateScenario.buildScenario(BreaktestCostGate, BreaktestCostGateScenario.demoFields(), {mode:'demo', instanceId:'x'}).input).findings.length")
    assert finding_count == browser_finding_count
    assert "Qualité des données" in page.locator(".coverage-grid").inner_text()
    assert "Liquidité et exécution" in page.locator(".coverage-grid").inner_text()
    page_text = page.locator("body").inner_text()
    assert not re.search(r"(?:^|\s)(?:NaN|Infinity|-Infinity|-0(?:[\s€%]|$))", page_text)
    assert "Aucune hypothèse ne couvre les frictions" not in page_text

    browser_result = page.evaluate("""() => {
      const built = BreaktestCostGateScenario.buildScenario(
        BreaktestCostGate,
        BreaktestCostGateScenario.demoFields(),
        {mode: 'demo', instanceId: 'parity-instance'}
      );
      return BreaktestCostGate.compute(built.input);
    }""")
    assert browser_result == node_demo_result(), "Browser bundle diverges from canonical Node engine"

    page.locator("#grossEdgePct").fill("1.1")
    assert page.locator("#results").is_hidden()
    assert page.locator("#stale-banner").is_visible()
    assert not page.locator("#result-title").count(), "Stale result remains in the DOM"
    assert "Démonstration synthétique modifiée" in page.locator("#provenance-text").inner_text()
    page.get_by_role("button", name="Analyser ce scénario").click()
    assert page.locator("#result-title").inner_text() == "Aucune marge positive ne subsiste après les frictions modélisées"
    assert "0,00" in page.locator(".edge-result-card").inner_text()

    page.locator('[name="edgeMode"][value="range"]').check()
    page.locator("#grossEdgeLowPct").fill("1.1")
    page.locator("#grossEdgeBasePct").fill("1.1")
    page.locator("#grossEdgeHighPct").fill("1.1")
    page.get_by_role("button", name="Analyser ce scénario").click()
    assert page.locator("#result-title").inner_text() == "Aucune marge positive ne subsiste après les frictions modélisées"
    range_rows = page.locator(".edge-result-card tbody tr")
    assert range_rows.count() == 3
    for index in range(3):
        text = range_rows.nth(index).inner_text()
        assert text.count("0,00") >= 2, text

    page.locator("#grossEdgeLowPct").fill("0.8")
    page.locator("#grossEdgeBasePct").fill("0.9")
    page.locator("#grossEdgeHighPct").fill("1.0")
    page.get_by_role("button", name="Analyser ce scénario").click()
    assert page.locator("#result-title").inner_text() == "Aucune hypothèse ne produit de marge positive"

    page.get_by_role("button", name="Charger la démonstration synthétique").click()
    page.locator("#strategyHeadroomEur").fill("400")
    page.get_by_role("button", name="Analyser ce scénario").click()
    assert page.locator("#result-title").inner_text() == "Le cash déclaré ou l’allocation libre ne couvre pas l’engagement d’entrée"

    page.get_by_role("button", name="Charger la démonstration synthétique").click()
    page.locator('[name="edgeMode"][value="none"]').check()
    page.get_by_role("button", name="Analyser ce scénario").click()
    assert page.locator("#result-title").inner_text() == "Le seuil est calculé, mais l’avantage brut n’est pas évalué"
    assert not page.locator(".edge-result-card").count()

    page.get_by_role("button", name="Saisir des hypothèses vides").click()
    page.get_by_role("button", name="Analyser ce scénario").click()
    assert page.locator("#error-summary").is_visible()
    assert page.evaluate("document.activeElement.id") == "error-summary"
    assert page.locator('[aria-invalid="true"]').count() >= 10
    assert page.locator("#results").is_hidden()
    assert_clean_runtime(console_errors, page_errors, requests)
    page.close()

    for width in VIEWPORTS:
        page, console_errors, page_errors, requests = open_page(browser, width)
        submit_demo(page)
        overflow = page.evaluate("Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth")
        assert overflow <= 1, f"Horizontal overflow at {width}px: {overflow}px"
        assert page.locator("#result-title").is_visible()
        assert page.locator(".recommendation-warning").is_visible()
        assert page.locator(".finding").count() == browser_finding_count
        page.locator("footer").scroll_into_view_if_needed()
        footer_box = page.locator("footer").bounding_box()
        assert footer_box and footer_box["width"] <= width + 1
        for control in page.locator("button, input, select").all():
            assert control.evaluate("""el => Boolean(
              (el.tagName === 'BUTTON' && el.textContent.trim()) ||
              el.closest('label') ||
              el.getAttribute('aria-label') ||
              document.querySelector(`label[for="${el.id}"]`)
            )"""), f"Unlabelled control at {width}px"
        assert_clean_runtime(console_errors, page_errors, requests)
        page.close()

    page, console_errors, page_errors, requests = open_page(browser, 1024)
    page.locator("footer a").click()
    page.wait_for_load_state("load")
    assert page.title() == "Guide du package — Breaktest Cost Gate"
    assert page.get_by_role("heading", name="Guide de la critique Gate 1").is_visible()
    assert page.locator('a[href="index.html"]').count() >= 1
    assert_clean_runtime(console_errors, page_errors, requests)
    page.close()

    browser.close()

print("Cost Gate critique browser tests passed: file://, parity, freshness, semantics, accessibility, responsive")
