#!/usr/bin/env python3
"""Capture exact Gate 1 review states without changing production CSS."""

from __future__ import annotations

import os
import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright


PROJECT = Path(__file__).resolve().parents[1]
PACKAGE = PROJECT / "dist" / "breaktest-cost-gate-gate1"
INDEX = PROJECT / "dist" / "Breaktest_Cost_Gate_Gate_1.html"
ARTIFACTS = PROJECT / "review_artifacts"


def executable_path() -> str | None:
    explicit = os.environ.get("CHROMIUM_PATH")
    if explicit:
        return explicit
    system = Path("/usr/bin/chromium")
    return str(system) if system.exists() else None


def neutralize_capture_focus(page) -> None:
    page.evaluate("""() => {
      const active = document.activeElement;
      if (active && typeof active.blur === 'function') active.blur();
      window.scrollTo(0, 0);
    }""")


def submit_demo(page) -> None:
    page.get_by_role("button", name="Charger la démonstration synthétique").click()
    page.get_by_role("button", name="Analyser ce scénario").click()
    page.locator("#results").wait_for(state="visible")


assert INDEX.is_file(), "Build the package before capture"
if ARTIFACTS.exists():
    shutil.rmtree(ARTIFACTS)
ARTIFACTS.mkdir(parents=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        headless=True,
        executable_path=executable_path(),
    )
    for width in [390, 1440]:
        page = browser.new_page(viewport={"width": width, "height": 1000})
        page.emulate_media(reduced_motion="reduce")
        page.goto(INDEX.as_uri(), wait_until="load")
        neutralize_capture_focus(page)
        skip_rect = page.locator(".skip-link").evaluate("""element => {
          const rect = element.getBoundingClientRect();
          return {top: rect.top, bottom: rect.bottom};
        }""")
        assert skip_rect["bottom"] <= 0, f"Skip link visible before neutral capture at {width}px: {skip_rect}"
        page.screenshot(path=ARTIFACTS / f"gate1-neutral-{width}.png", full_page=False)

        submit_demo(page)
        neutralize_capture_focus(page)
        page.screenshot(path=ARTIFACTS / f"gate1-favorable-{width}.png", full_page=True)

        page.locator("#grossEdgePct").fill("1.1")
        page.get_by_role("button", name="Analyser ce scénario").click()
        assert page.locator("#result-title").inner_text() == "Aucune marge positive ne subsiste après les frictions modélisées"
        neutralize_capture_focus(page)
        page.screenshot(path=ARTIFACTS / f"gate1-threshold-equality-{width}.png", full_page=True)
        page.close()
    browser.close()

print(f"Cost Gate critique review captures created: {len(list(ARTIFACTS.glob('*.png')))}")
