from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = (ROOT / 'index.html').as_uri()
VIEWPORTS = [390, 768, 1024, 1440]


def no_overflow(page):
    return page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1')


def assert_no_nonfinite(page):
    text = page.locator('body').inner_text()
    for forbidden in ('NaN', 'Infinity', '-0,00', '-0.00'):
        assert forbidden not in text


def assert_results_clear_of_sticky_header(page):
    # Le produit utilise un défilement doux. Attendre sa stabilisation avant
    # de mesurer la position finale évite de valider une image intermédiaire.
    page.wait_for_timeout(650)
    positions = page.evaluate(
        '''() => {
            const header = document.querySelector('.topbar');
            const results = document.querySelector('#results');
            const headerRect = header.getBoundingClientRect();
            const resultsRect = results.getBoundingClientRect();
            return {
                headerBottom: headerRect.bottom,
                resultsTop: resultsRect.top,
                titleTop: document.querySelector('#primary-title').getBoundingClientRect().top
            };
        }'''
    )
    assert positions['resultsTop'] >= positions['headerBottom'] - 1, positions
    assert positions['titleTop'] >= positions['headerBottom'] - 1, positions


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for width in VIEWPORTS:
        page = browser.new_page(viewport={"width": width, "height": 1100})
        page.set_default_timeout(10000)
        page.goto(URL)

        assert not page.locator('#annual-details').get_attribute('open')
        assert not page.locator('#edge-details').get_attribute('open')
        assert not page.locator('#constraint-details').get_attribute('open')
        assert page.get_by_role('button', name='Calculer le seuil brut').is_visible()
        assert no_overflow(page)

        # Mode seuil autonome.
        page.get_by_role('button', name='Calculer le seuil brut').click()
        page.locator('#results').wait_for(state='visible')
        assert '1,10' in page.locator('#break-even-value').inner_text()
        assert 'SEUIL BRUT' in page.locator('#primary-result').inner_text()
        assert page.locator('#edge-section').is_hidden()
        assert page.locator('#range-section').is_hidden()
        assert page.evaluate('document.activeElement.id') == 'results'
        assert_results_clear_of_sticky_header(page)
        assert no_overflow(page)
        assert_no_nonfinite(page)

        # Mode valeur unique rétrocompatible.
        page.locator('#edge-details summary').click()
        page.locator('input[name="edgeInputMode"][value="point"]').check()
        assert page.locator('#point-edge-fields').is_visible()
        assert page.locator('#range-edge-fields').is_hidden()
        page.locator('#grossEdgePercent').fill('2,00')
        page.get_by_role('button', name='Mesurer ce qui reste de la valeur brute').click()
        page.locator('#results').wait_for(state='visible')
        assert page.locator('#edge-section').is_visible()
        assert '45,0' in page.locator('#retained-edge-value').inner_text()
        assert '0,90' in page.locator('#net-edge-value').inner_text()
        assert page.locator('#range-section').is_hidden()
        assert_results_clear_of_sticky_header(page)
        assert no_overflow(page)

        # Une modification d'hypothèse invalide immédiatement le résultat
        # rendu. Un ancien diagnostic ne doit jamais rester visible à côté de
        # nouvelles entrées qui ne lui correspondent plus.
        page.locator('#grossEdgePercent').fill('2,10')
        assert page.locator('#results').is_hidden()
        assert 'recalcul' in (page.locator('#result-live').text_content() or '').lower()

        # Mode fourchette : la marge change de signe autour du seuil.
        page.locator('input[name="edgeInputMode"][value="range"]').check()
        assert page.locator('#range-edge-fields').is_visible()
        assert page.locator('#point-edge-fields').is_hidden()
        page.locator('#grossEdgeLowPercent').fill('0,80')
        page.locator('#grossEdgeBasePercent').fill('2,00')
        page.locator('#grossEdgeHighPercent').fill('3,00')
        page.locator('#constraint-details summary').click()
        page.locator('#constraintMode').select_option('positive')
        page.get_by_role('button', name='Tester la stabilité dans la fourchette').click()
        page.locator('#results').wait_for(state='visible')
        assert page.locator('#range-section').is_visible()
        assert page.locator('#edge-section').is_hidden()
        assert 'traverse le seuil' in page.locator('#range-summary').inner_text()
        assert '-0,30' in page.locator('#range-low-net').inner_text()
        assert '0,90' in page.locator('#range-base-net').inner_text()
        assert '1,90' in page.locator('#range-high-net').inner_text()
        assert page.locator('.range-card').count() == 3
        assert page.locator('.constraint-table dd').count() == 3
        assert 'Fourchette basse' in (page.locator('#evidence-mode').text_content() or '')
        assert_results_clear_of_sticky_header(page)
        assert no_overflow(page)
        assert_no_nonfinite(page)

        # Ordre invalide : résultats anciens masqués, message et focus utiles.
        page.locator('#grossEdgeLowPercent').fill('3')
        page.locator('#grossEdgeBasePercent').fill('2')
        page.locator('#grossEdgeHighPercent').fill('1')
        page.get_by_role('button', name='Tester la stabilité dans la fourchette').click()
        assert page.locator('#results').is_hidden()
        assert page.locator('#grossEdgeLowPercent').get_attribute('aria-invalid') == 'true'
        assert page.evaluate('document.activeElement.id') == 'grossEdgeLowPercent'
        assert 'ordre' in page.locator('#range-low-error').inner_text().lower()
        assert no_overflow(page)

        # Fourchette dégénérée conservée et égalité au seuil non positive.
        page.locator('#grossEdgeLowPercent').fill('1,10')
        page.locator('#grossEdgeBasePercent').fill('1,10')
        page.locator('#grossEdgeHighPercent').fill('1,10')
        page.get_by_role('button', name='Tester la stabilité dans la fourchette').click()
        page.locator('#results').wait_for(state='visible')
        assert 'identiques' in page.locator('#range-shape-note').inner_text()
        assert 'ne dépasse pas le seuil' in page.locator('#range-summary').inner_text()
        assert_results_clear_of_sticky_header(page)
        assert_no_nonfinite(page)

        # Navigation clavier vers le choix de mode.
        page.locator('#orderNotionalEur').focus()
        reached = False
        for _ in range(30):
            page.keyboard.press('Tab')
            if page.evaluate('document.activeElement && document.activeElement.name') == 'edgeInputMode':
                reached = True
                break
        assert reached

        text = page.locator('body').inner_text().lower()
        for forbidden in ('probabilité de réussite', 'intervalle de confiance calculé', 'scénario optimal', 'verdict'):
            assert forbidden not in text
        page.close()

    browser.close()

print('Edge Survival Envelope browser tests passed: 390/768/1024/1440')
