# Validation — site Breaktest Cost Intelligence

## Statut

Le calculateur statique de validation commerciale est implémenté sur la pull request `#16`.

Code exécuté par GitHub Actions : commit `496e839a010970abcf3e6d3b56e608f73959d446`, run `29268915729`.

Le site n'est pas déployé publiquement. Cette validation est technique ; elle ne constitue pas une preuve de demande commerciale.

## Périmètre exécuté

- page statique sous `validation_site/` ;
- moteur déterministe local `calculator.js` ;
- distinction achat simple / aller-retour ;
- commission et change par côté ;
- spread et slippage pour le scénario complet ;
- coût par opération, coût relatif à l'ordre, coût annuel et ratio annuel sur capital ;
- décomposition avec provenance ;
- comparaison descriptive `actuel / ordre ×2 / fréquence ÷2` ;
- partage excluant le capital exact par défaut ;
- formulaire et emplacements externes désactivés ;
- conservation intégrale du moteur historique H1–H2/C1–C4.

## Commandes exécutées en CI

```bash
python3 scripts/build_breaktest.py
node tests/h1_strict_numeric_validation.test.js
node tests/h2_journal_net_bases.test.js
node tests/validation_calculator.test.js
python3 tests/h1_browser_smoke.py
python3 tests/c2_temporal_isolation.py
python3 tests/c3_chronological_turnover.py
python3 tests/c1_capital_reservation.py
python3 tests/c4_realized_equity_curve.py
python3 tests/c4_negative_free_cash.py
python3 tests/h2_journal_net_bases.py
python3 tests/validation_browser.py
node --check /tmp/breaktest-built.js
node --check validation_site/config.js
node --check validation_site/calculator.js
node --check validation_site/app.js
```

## Résultats démontrés

### Build historique conservé

Le build cumulatif H1, C2, C3, C1, C4 et H2 produit toujours :

- taille : `166862` octets ;
- SHA-256 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`.

### Scénarios de référence

Les tests Node reproduisent les scénarios synthétiques versionnés :

1. capital 500 EUR, ordre 100 EUR, quatre allers-retours par mois : `2,70 EUR` par aller-retour, `129,60 EUR` par an, `25,92 %` du capital ;
2. capital 5 000 EUR, ordre 500 EUR, quatre allers-retours par mois : `5,50 EUR`, `264 EUR` par an, `5,28 %` du capital ;
3. achat mensuel de 300 EUR en euros : `1,30 EUR` par achat, `15,60 EUR` par an, `0,312 %` du capital ;
4. commission nulle avec change et microstructure : `7 EUR` par aller-retour, `168 EUR` par an, `1,68 %` du capital ;
5. comparaison de tailles 100 / 500 / 1 000 EUR : coûts relatifs `2,20 % / 0,60 % / 0,40 %` selon les hypothèses synthétiques.

Sont également couverts :

- zéro réel distinct d'une absence ;
- fréquence nulle ;
- capital absent ou nul : coût calculable, ratio sur capital indisponible ;
- valeurs négatives, non numériques et non finies refusées ;
- indépendance des composantes ;
- aucune double multiplication du spread, du slippage ou de la fréquence ;
- changement achat simple / aller-retour limité aux composantes par côté ;
- aucun arrondi interne ;
- aucun `NaN`, `Infinity` ou `-0` affiché ;
- partage sans email ni capital exact par défaut.

### Navigateur

Le test Playwright Chromium a réussi aux largeurs :

- `390 px` ;
- `768 px` ;
- `1024 px` ;
- `1440 px`.

Il vérifie notamment :

- absence de débordement horizontal ;
- premier calcul au clavier ;
- focus sur la première erreur ;
- annonce accessible `Résultat mis à jour` ;
- résultats numériques du scénario intermédiaire ;
- trois cartes de comparaison ;
- provenance `user_assumption` ;
- partage sans donnée personnelle ni capital exact par défaut ;
- intégrations analytics, email et paiement désactivées ;
- respect de `prefers-reduced-motion` ;
- absence des formulations prescriptives interdites testées.

### Syntaxe

La syntaxe JavaScript du moteur historique et des trois scripts du site de validation a réussi avec `node --check`.

## Limites déclarées

- aucune utilisation par un particulier réel ;
- aucune preuve de paiement, retour, partage ou rétention ;
- aucune donnée ni grille de courtier réelle ;
- aucun import de transactions ;
- aucune TCA réelle ni métrique de performance ;
- aucune connexion courtier, recommandation, signal ou exécution ;
- aucune collecte email, analytics ou paiement actif ;
- aucune validation Safari/iPad exhaustive ;
- aucune revue juridique professionnelle ;
- aucune conformité GIPS ou MiFID II revendiquée ;
- la revue visuelle automatisée ne remplace pas un test utilisateur réel.

## Conclusion

La page est techniquement apte à servir d'instrument de validation commerciale statique. Elle ne doit pas être présentée comme un produit complet ni déployée avec collecte ou paiement sans décision explicite et configuration externe contrôlée.
