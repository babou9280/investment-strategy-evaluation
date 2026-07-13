# H2 — validation des bases nettes observées du journal

- Branche candidate : `codex/h2-journal-net-bases`
- Base : `breaktest-bootstrap` après C4 et sa synchronisation documentaire
- Build H1 + C2 + C3 + C1 + C4 + H2 : **166 862 octets**
- SHA-256 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`
- Première exécution intégrale verte : GitHub Actions `29248248566`
- Head alors testé : `580f3bfaca51897ab8a1ab438813a6e3e1996298`

## Comportement validé

H2 distingue désormais quatre bases de résultat :

1. **simulé par Breaktest** : brut observé redimensionné, diminué des coûts du scénario actif ;
2. **brut observé** : PnL/rendement brut fourni par le journal ;
3. **net fixe observé** : PnL/rendement net fixe fourni, avec fallback explicite vers le brut lorsqu'il est entièrement absent ;
4. **full-cost observé** : PnL/rendement full-cost fourni, avec fallback explicite vers le net fixe lorsqu'il est entièrement absent.

Chaque base conserve :

- la valeur PnL ;
- le rendement ;
- la provenance `observed`, `derived`, `fallback` ou `simulated` ;
- la base d'origine du fallback ;
- les clés source utilisées ;
- un signal d'incohérence PnL/rendement destiné à H4.

Une valeur explicitement fournie mais non numérique, `NaN` ou infinie refuse le lot. Un zéro réel reste valide. Lorsqu'un seul membre PnL/rendement manque, il est dérivé à partir de l'autre et du nominal valide. Lorsqu'une base optionnelle est entièrement absente, le fallback est visible et auditée.

## Séparation observation / simulation

- changer les coûts simulés ne modifie jamais les bases observées ;
- la base sélectionnée est visible dans les KPI, le mode du Trade Gate, le ledger et l'export ;
- C4 applique à la sortie le PnL de la base explicitement sélectionnée ;
- le coût simulé n'est jamais soustrait une seconde fois d'une base nette observée ;
- le mode par défaut reste `simulated`, afin de préserver le comportement validé antérieur ;
- le filtre ex ante d'edge et de coûts reste le contrôle de décision Breaktest ; la sélection de base détermine le résultat rapporté et la trésorerie réalisée, pas une réécriture rétrospective du filtre.

## Invariants testés

- brut, net fixe et full-cost tous présents et distincts : conservation exacte ;
- PnL présent et rendement absent : dérivation du rendement ;
- rendement présent et PnL absent : dérivation du PnL ;
- zéro net observé conservé ;
- base optionnelle totalement absente : fallback explicite ;
- valeurs `abc`, `NaN`, infinies ou non numériques : refus du lot ;
- PnL et rendement tous deux fournis mais incompatibles : valeurs conservées et anomalie H4 signalée ;
- le PnL fourni reste l'autorité pour redimensionner le résultat à un autre nominal, sans réconciliation silencieuse ;
- modification des coûts sans modification des bases observées ;
- variation du résultat simulé lorsque les coûts changent ;
- sélection brut/net fixe/full-cost produisant les agrégats et le capital C4 attendus ;
- absence de double comptage des coûts ;
- import CSV, ledger, audit et export conservant base et provenance ;
- jeu de démonstration : 40 bases net fixe observées, 16 full-cost observées et 24 fallbacks full-cost identifiés ;
- compatibilité des scénarios synthétiques historiques ne possédant pas encore l'objet `pnlBases`.

## Validations exécutées

```text
python3 scripts/build_breaktest.py
node tests/h1_strict_numeric_validation.test.js
node tests/h2_journal_net_bases.test.js
python3 tests/h1_browser_smoke.py
python3 tests/c2_temporal_isolation.py
python3 tests/c3_chronological_turnover.py
python3 tests/c1_capital_reservation.py
python3 tests/c4_realized_equity_curve.py
python3 tests/c4_negative_free_cash.py
python3 tests/h2_journal_net_bases.py
node --check /tmp/breaktest-built.js
```

Résultats observés dans GitHub Actions `29248248566` :

```text
H1 strict numeric validation tests passed
H2 journal net bases normalization tests passed
H1 browser smoke passed; normalized demo trades unchanged
C2 temporal isolation tests passed
C3 chronological turnover tests passed
C1 capital reservation tests passed
C4 realized equity curve tests passed
C4 negative free cash test passed
H2 journal net bases browser tests passed
JavaScript syntax: success
```

## Limites maintenues

- H4 reste responsable de la politique complète de réconciliation lorsque PnL, rendement et nominal sont simultanément incohérents ;
- H3 sur la provenance de devise du prix d'entrée reste ouvert ;
- H5 sur l'injection de formule CSV reste ouvert ;
- H6 sur les performances reste ouvert ;
- les bases observées sont redimensionnées proportionnellement au nominal simulé ; cette hypothèse doit rester explicite ;
- cette validation ne démontre ni l'exactitude de toutes les formules ni la valeur commerciale du produit.
