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


def prepare_full_page_capture(page):
    """Remove Playwright stitching artefacts without changing product code.

    Chromium may repaint fixed/sticky elements in multiple tiles during a
    full-page screenshot. A focused skip link and sticky header can therefore
    appear in a position that no user would see. Capture-only inline overrides
    hide the skip link and place the header in normal document flow. They are
    restored immediately after the screenshot. Keyboard behavior remains
    covered independently by the browser suite.
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
            skip.dataset.capturePreviousVisibility = skip.style.getPropertyValue('visibility');
            skip.dataset.capturePreviousVisibilityPriority = skip.style.getPropertyPriority('visibility');
            skip.style.setProperty('visibility', 'hidden', 'important');

            const topbar = document.querySelector('.topbar');
            topbar.dataset.capturePreviousPosition = topbar.style.getPropertyValue('position');
            topbar.dataset.capturePreviousPositionPriority = topbar.style.getPropertyPriority('position');
            topbar.style.setProperty('position', 'static', 'important');
        }"""
    )
    page.wait_for_timeout(50)
    assert page.evaluate("document.activeElement && document.activeElement.id") == "capture-focus-sink"
    assert page.locator(".skip-link").evaluate(
        "element => getComputedStyle(element).visibility"
    ) == "hidden"
    assert page.locator(".topbar").evaluate(
        "element => getComputedStyle(element).position"
    ) == "static"


def restore_full_page_capture(page):
    page.evaluate(
        """() => {
            const skip = document.querySelector('.skip-link');
            const oldVisibility = skip.dataset.capturePreviousVisibility || '';
            const oldVisibilityPriority = skip.dataset.capturePreviousVisibilityPriority || '';
            if (oldVisibility) {
                skip.style.setProperty('visibility', oldVisibility, oldVisibilityPriority);
            } else {
                skip.style.removeProperty('visibility');
            }
            delete skip.dataset.capturePreviousVisibility;
            delete skip.dataset.capturePreviousVisibilityPriority;

            const topbar = document.querySelector('.topbar');
            const oldPosition = topbar.dataset.capturePreviousPosition || '';
            const oldPositionPriority = topbar.dataset.capturePreviousPositionPriority || '';
            if (oldPosition) {
                topbar.style.setProperty('position', oldPosition, oldPositionPriority);
            } else {
                topbar.style.removeProperty('position');
            }
            delete topbar.dataset.capturePreviousPosition;
            delete topbar.dataset.capturePreviousPositionPriority;

            const sink = document.getElementById('capture-focus-sink');
            if (sink) sink.remove();
        }"""
    )


def full_page_capture(page, path):
    prepare_full_page_capture(page)
    try:
        page.screenshot(path=str(path), full_page=True)
    finally:
        restore_full_page_capture(page)


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
