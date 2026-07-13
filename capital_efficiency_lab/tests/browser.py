from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = (ROOT / 'index.html').as_uri()
VIEWPORTS = [390, 768, 1024, 1440]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width in VIEWPORTS:
        page = browser.new_page(viewport={"width": width, "height": 1000})
        page.goto(URL)
        page.get_by_role('button', name='Charger la démonstration synthétique').click()
        page.get_by_role('button', name='Analyser la survie de l’avantage').click()
        page.locator('#results').wait_for(state='visible')
        assert '45' in page.locator('#primary-result strong').inner_text()
        assert '0,90' in page.locator('#net-edge-value').inner_text()
        assert '666,67' in page.locator('#constraints-grid .constraint').nth(1).inner_text()
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
        text = page.locator('body').inner_text()
        for forbidden in ('NaN', 'Infinity', '-0,00', '-0.00'):
            assert forbidden not in text
        page.close()

    page = browser.new_page(viewport={"width": 390, "height": 900})
    page.goto(URL)
    page.locator('#orderNotionalEur').fill('')
    page.get_by_role('button', name='Analyser la survie de l’avantage').click()
    assert page.locator('#orderNotionalEur').get_attribute('aria-invalid') == 'true'
    assert page.evaluate('document.activeElement.id') == 'orderNotionalEur'

    page.locator('#orderNotionalEur').fill('500')
    page.locator('#grossEdgePercent').fill('0,60')
    page.get_by_role('button', name='Analyser la survie de l’avantage').click()
    page.locator('#results').wait_for(state='visible')
    assert 'Impossible sous ces hypothèses' in page.locator('#constraints-grid').inner_text()

    page.locator('#commissionPerSideEur').fill('0')
    page.locator('#fxRatePerSidePercent').fill('0')
    page.locator('#spreadTotalPercent').fill('0')
    page.locator('#slippageTotalPercent').fill('0')
    page.locator('#grossEdgePercent').fill('1')
    page.locator('#retentionTargetPercent').fill('100')
    page.get_by_role('button', name='Analyser la survie de l’avantage').click()
    page.locator('#results').wait_for(state='visible')
    constraints_text = page.locator('#constraints-grid').inner_text()
    assert constraints_text.count('Aucun minimum positif imposé') >= 2
    assert 'Infinity' not in page.locator('body').inner_text()
    browser.close()

print('Capital Efficiency browser tests passed')