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
        assert not page.locator('#annual-details').get_attribute('open')
        assert not page.locator('#edge-details').get_attribute('open')
        assert not page.locator('#constraint-details').get_attribute('open')
        assert page.get_by_role('button', name='Calculer le seuil brut').is_visible()

        page.get_by_role('button', name='Voir un exemple complet').click()
        page.locator('#results').wait_for(state='visible')
        assert page.locator('#annual-details').get_attribute('open') is not None
        assert page.locator('#edge-details').get_attribute('open') is not None
        assert page.locator('#constraint-details').get_attribute('open') is not None
        assert '45' in page.locator('#primary-result strong').inner_text()
        assert '0,90' in page.locator('#net-edge-value').inner_text()
        assert page.locator('#constraints-grid .constraint').count() == 1
        assert '666,67' in page.locator('#constraints-grid .constraint').inner_text()
        assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
        text = page.locator('body').inner_text()
        for forbidden in ('NaN', 'Infinity', '-0,00', '-0.00'):
            assert forbidden not in text
        page.close()

    page = browser.new_page(viewport={"width": 390, "height": 900})
    page.goto(URL)
    page.get_by_role('button', name='Calculer le seuil brut').click()
    page.locator('#results').wait_for(state='visible')
    assert '1,10' in page.locator('#primary-result strong').inner_text()
    assert page.locator('#edge-section').is_hidden()
    assert page.locator('#constraint-section').is_hidden()

    page.locator('#orderNotionalEur').fill('')
    page.get_by_role('button', name='Calculer le seuil brut').click()
    assert page.locator('#orderNotionalEur').get_attribute('aria-invalid') == 'true'
    assert page.evaluate('document.activeElement.id') == 'orderNotionalEur'

    page.get_by_role('button', name='Voir un exemple complet').click()
    page.locator('#grossEdgePercent').fill('0,60')
    page.get_by_role('button', name='Mesurer ce qui reste du rendement brut').click()
    page.locator('#results').wait_for(state='visible')
    assert 'Impossible sous ces hypothèses' in page.locator('#constraints-grid').inner_text()

    page.locator('#commissionPerSideEur').fill('0')
    page.locator('#fxRatePerSidePercent').fill('0')
    page.locator('#spreadTotalPercent').fill('0')
    page.locator('#slippageTotalPercent').fill('0')
    page.locator('#grossEdgePercent').fill('1')
    page.locator('#retentionTargetPercent').fill('100')
    page.get_by_role('button', name='Mesurer ce qui reste du rendement brut').click()
    page.locator('#results').wait_for(state='visible')
    assert 'Aucun minimum positif imposé' in page.locator('#constraints-grid').inner_text()

    page.locator('#constraintMode').select_option('positive')
    page.get_by_role('button', name='Mesurer ce qui reste du rendement brut').click()
    page.locator('#results').wait_for(state='visible')
    assert 'Aucun minimum positif imposé' in page.locator('#constraints-grid').inner_text()
    assert 'Infinity' not in page.locator('body').inner_text()
    browser.close()

print('Capital Efficiency browser tests passed')