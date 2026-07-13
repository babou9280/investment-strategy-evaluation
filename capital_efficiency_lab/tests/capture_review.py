from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "review_artifacts"
OUTPUT.mkdir(exist_ok=True)
URL = (ROOT / "index.html").as_uri()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width, height, name in [
        (390, 1100, "mobile-390"),
        (768, 1100, "tablet-768"),
        (1440, 1100, "desktop-1440"),
    ]:
        page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
        page.goto(URL)
        page.get_by_role("button", name="Charger la démonstration synthétique").click()
        page.locator("#results").wait_for(state="visible")
        page.screenshot(path=str(OUTPUT / f"{name}-full.png"), full_page=True)
        page.locator("#results").screenshot(path=str(OUTPUT / f"{name}-results.png"))
        page.close()
    browser.close()

print(f"Captured review screenshots in {OUTPUT}")