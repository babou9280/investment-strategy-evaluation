#!/usr/bin/env python3
from __future__ import annotations

import contextlib
import http.server
import socket
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt: str, *args: object) -> None:
        return


@contextlib.contextmanager
def server():
    port = free_port()
    handler = lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs)
    with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{port}/validation_site/index.html"
        finally:
            httpd.shutdown()
            thread.join(timeout=2)


def fill_scenario_2(page) -> None:
    values = {
        "capitalEur": "5000",
        "orderAmountEur": "500",
        "monthlyFrequency": "4",
        "commissionPerSideEur": "1",
        "fxPerConversionPercent": "0,25",
        "spreadPercent": "0,10",
        "slippagePercent": "0,10",
    }
    for name, value in values.items():
        page.locator(f"[name='{name}']").fill(value)
    page.locator("[name='activityType'][value='round_trip']").check()


def main() -> None:
    with server() as url, sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True)
        for width in (390, 768, 1024, 1440):
            context = browser.new_context(viewport={"width": width, "height": 1000}, reduced_motion="reduce")
            page = context.new_page()
            page.goto(url, wait_until="networkidle")
            overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            assert overflow <= 1, f"horizontal overflow at {width}px: {overflow}px"
            assert page.locator("h1").inner_text() == "Combien tes ordres coûtent-ils vraiment ?"
            context.close()

        context = browser.new_context(viewport={"width": 390, "height": 1000}, reduced_motion="reduce", permissions=["clipboard-read", "clipboard-write"])
        page = context.new_page()
        page.goto(url, wait_until="networkidle")

        page.locator("#hero-cta").click()
        assert page.evaluate("document.activeElement.id") == "capitalEur"

        fill_scenario_2(page)
        page.locator("#slippagePercent").press("Enter")
        page.locator("#results").wait_for(state="visible")
        assert float(page.locator("#metric-operation").get_attribute("data-raw")) == 5.5
        assert float(page.locator("#metric-annual").get_attribute("data-raw")) == 264.0
        assert abs(float(page.locator("#metric-capital").get_attribute("data-raw")) - 0.0528) < 1e-12
        assert page.locator("#result-live").inner_text() == "Résultat mis à jour"
        assert page.locator("[data-component='commission']").count() == 1
        assert page.locator("[data-scenario='current']").count() == 1
        assert page.locator("[data-scenario='double_order']").count() == 1
        assert page.locator("[data-scenario='half_frequency']").count() == 1

        page.locator("#share-result").click()
        page.wait_for_timeout(50)
        payload = page.evaluate("window.__breaktestLastSharePayload")
        assert "capitalEur" not in payload
        assert payload["annualCostToCapitalRate"] is None
        assert "email" not in payload

        page.locator("#share-capital").check()
        page.locator("#share-result").click()
        page.wait_for_timeout(50)
        payload_with_capital = page.evaluate("window.__breaktestLastSharePayload")
        assert payload_with_capital["capitalEur"] == 5000

        page.locator("#orderAmountEur").fill("-1")
        page.locator("#cost-form button[type='submit']").click()
        assert page.locator("#error-summary").is_visible()
        assert page.evaluate("document.activeElement.id") == "orderAmountEur"
        assert page.locator("#results").is_hidden()

        page.locator("#orderAmountEur").fill("500")
        page.locator("#capitalEur").fill("")
        page.locator("#cost-form button[type='submit']").click()
        page.locator("#results").wait_for(state="visible")
        assert page.locator("#metric-capital").inner_text() == "Indisponible"
        assert float(page.locator("#metric-operation").get_attribute("data-raw")) == 5.5

        config = page.evaluate("window.BreaktestValidation.config")
        assert config["analyticsEnabled"] is False
        assert config["paymentEnabled"] is False
        assert config["emailEndpoint"] is None

        body = page.locator("body").inner_text().lower()
        for prohibited in ("meilleur choix", "optimal pour", "tu devrais", "performance garantie", "gips compliant", "conforme mifid"):
            assert prohibited not in body

        reduced_duration = page.evaluate("getComputedStyle(document.querySelector('.button')).transitionDuration")
        assert reduced_duration in ("0s", "0.001s", "0.000001s"), reduced_duration
        context.close()
        browser.close()
    print("Cost Intelligence browser tests passed at 390/768/1024/1440 px")


if __name__ == "__main__":
    main()
