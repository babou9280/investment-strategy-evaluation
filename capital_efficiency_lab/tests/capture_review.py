from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "review_artifacts"
OUTPUT.mkdir(exist_ok=True)
URL = (ROOT / "index.html").as_uri()


def wait_for_settled_results(page):
    page.locator("#results").wait_for(state="visible")
    page.wait_for_timeout(650)


def fill_cost_scenario(page):
    page.locator("#orderNotionalEur").fill("500")
    page.locator('input[name="sideCount"][value="2"]').check()
    page.locator("#commissionPerSideEur").fill("1")
    page.locator("#fxRatePerSidePercent").fill("0,25")
    page.locator("#spreadTotalPercent").fill("0,10")
    page.locator("#slippageTotalPercent").fill("0,10")


def open_edge_section(page):
    if page.locator("#edge-details").get_attribute("open") is None:
        page.locator("#edge-details summary").click()


def open_constraint_section(page):
    if page.locator("#constraint-details").get_attribute("open") is None:
        page.locator("#constraint-details summary").click()


def submit_range(page, low, base, high):
    open_edge_section(page)
    page.locator('input[name="edgeInputMode"][value="range"]').check()
    page.locator("#grossEdgeLowPercent").fill(low)
    page.locator("#grossEdgeBasePercent").fill(base)
    page.locator("#grossEdgeHighPercent").fill(high)
    page.get_by_role("button", name="Tester la stabilité dans la fourchette").click()
    wait_for_settled_results(page)


def neutralize_capture_focus(page):
    """Neutralize screenshot-only focus without changing product behavior.

    Chromium's full-page capture may move focus back to the first link when no
    element remains focused. A temporary off-screen focus sink is retained for
    the duration of the screenshot. The skip link is also forced outside the
    viewport only for the capture. Keyboard tests independently verify the real
    first-Tab behavior.
    """
    page.evaluate(
        """() => {
            const oldSink = document.getElementById('capture-focus-sink');
            if (oldSink) oldSink.remove();

            const sink = document.createElement('span');
            sink.id = 'capture-focus-sink';
            sink.tabIndex = -1;
            sink.setAttribute('aria-hidden', 'true');
            sink.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;overflow:hidden;';
            document.body.appendChild(sink);
            sink.focus({preventScroll: true});

            window.scrollTo(0, 0);
            const skip = document.querySelector('.skip-link');
            skip.dataset.capturePreviousTop = skip.style.getPropertyValue('top');
            skip.dataset.capturePreviousPriority = skip.style.getPropertyPriority('top');
            skip.style.setProperty('top', '-80px', 'important');
        }"""
    )
    page.wait_for_timeout(50)
    assert page.evaluate("document.activeElement && document.activeElement.id") == "capture-focus-sink"
    skip_link = page.locator(".skip-link")
    assert skip_link.count() == 1
    rect = skip_link.evaluate(
        """element => {
            const box = element.getBoundingClientRect();
            return {top: box.top, bottom: box.bottom, left: box.left, right: box.right};
        }"""
    )
    assert rect["bottom"] <= 0 or rect["right"] <= 0, rect


def restore_capture_focus_style(page):
    page.evaluate(
        """() => {
            const skip = document.querySelector('.skip-link');
            const previousTop = skip.dataset.capturePreviousTop || '';
            const previousPriority = skip.dataset.capturePreviousPriority || '';
            if (previousTop) {
                skip.style.setProperty('top', previousTop, previousPriority);
            } else {
                skip.style.removeProperty('top');
            }
            delete skip.dataset.capturePreviousTop;
            delete skip.dataset.capturePreviousPriority;

            const sink = document.getElementById('capture-focus-sink');
            if (sink) sink.remove();
        }"""
    )


def full_page_capture(page, path):
    neutralize_capture_focus(page)
    try:
        page.screenshot(path=str(path), full_page=True)
    finally:
        restore_capture_focus_style(page)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for width, height, name in [
        (390, 1100, "mobile-390"),
        (768, 1100, "tablet-768"),
        (1440, 1100, "desktop-1440"),
    ]:
        page = browser.new_page(
            viewport={"width": width, "height": height},
            device_scale_factor=1,
        )
        page.set_default_timeout(10000)
        page.goto(URL)

        # La première capture montre volontairement un formulaire neutre, sans
        # hypothèses financières préremplies ou scénario implicitement choisi.
        full_page_capture(page, OUTPUT / f"{name}-threshold-form.png")

        fill_cost_scenario(page)
        page.get_by_role("button", name="Calculer le seuil brut").click()
        wait_for_settled_results(page)
        page.locator("#results").screenshot(
            path=str(OUTPUT / f"{name}-threshold-results.png")
        )

        open_edge_section(page)
        page.locator('input[name="edgeInputMode"][value="point"]').check()
        page.locator("#grossEdgePercent").fill("2,00")
        page.get_by_role(
            "button", name="Mesurer ce qui reste de la valeur brute"
        ).click()
        wait_for_settled_results(page)
        page.locator("#results").screenshot(
            path=str(OUTPUT / f"{name}-point-results.png")
        )

        open_constraint_section(page)
        page.locator("#constraintMode").select_option("positive")

        submit_range(page, "0,80", "2,00", "3,00")
        full_page_capture(page, OUTPUT / f"{name}-range-cross-full.png")
        page.locator("#results").screenshot(
            path=str(OUTPUT / f"{name}-range-cross-results.png")
        )

        submit_range(page, "1,20", "2,00", "3,00")
        page.locator("#results").screenshot(
            path=str(OUTPUT / f"{name}-range-survives-results.png")
        )

        submit_range(page, "-1,00", "0,00", "0,60")
        page.locator("#results").screenshot(
            path=str(OUTPUT / f"{name}-range-fails-results.png")
        )

        submit_range(page, "1,10", "1,10", "1,10")
        page.locator("#results").screenshot(
            path=str(OUTPUT / f"{name}-range-degenerate-results.png")
        )

        page.close()

    browser.close()

print(f"Captured Edge Survival Envelope review screenshots in {OUTPUT}")
