# H2 — validation des bases nettes observées du journal

- Statut : fusionnée dans `breaktest-bootstrap`
- Pull request : `#12`
- Commit squash : `3504d448547bfeab9ef74114af3c08fb557a1c75`
- Branche de développement : `codex/h2-journal-net-bases`
- Build H1 + C2 + C3 + C1 + C4 + H2 : **166 862 octets**
- SHA-256 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`
- Exécution GitHub Actions finale : `29248916855`
- Head validé : `9539a9676ac1ac6d0a3bd1f470322c29b60edc96`

## Comportement validé

H2 distingue quatre bases de résultat :

1. **simulé par Breaktest** : brut observé redimensionné, diminué des coûts du scénario actif ;
2. **brut observé** : PnL/rendement brut fourni par le journal ;
3. **net fixe observé** : PnL/rendement net fixe fourni, avec fallback explicite vers le brut lorsqu'il est entièrement absent ;
4. **full-cost observé** : PnL/rendement full-cost fourni, avec fallback explicite vers le net fixe lorsqu'il est entièrement absent.

Chaque base conserve la valeur PnL, le rendement, la provenance `observed`, `derived`, `fallback` ou `simulated`, la base du fallback, les clés source et un signal d'incohérence destiné à H4.

Une valeur explicitement fournie mais non numérique, `NaN` ou infinie refuse le lot. Un zéro réel reste valide. Lorsqu'un seul membre PnL/rendement manque, il est dérivé à partir de l'autre et du nominal valide. Une paire optionnelle entièrement absente utilise un fallback visible.

## Séparation observation / simulation

- changer les coûts simulés ne modifie jamais les bases observées ;
- la base sélectionnée est visible dans les KPI, le Trade Gate, le ledger, l'audit et l'export ;
- C4 applique à la sortie le PnL de la base explicitement sélectionnée ;
- aucun coût simulé n'est soustrait une seconde fois d'une base nette observée ;
- le mode par défaut reste `simulated` ;
- le filtre ex ante reste le contrôle Breaktest ; la sélection de base détermine le résultat rapporté et la trésorerie réalisée.

## Invariants testés

- brut, net fixe et full-cost présents et distincts : conservation exacte ;
- dérivation du membre PnL/rendement manquant ;
- zéro net observé ;
- fallback explicite d'une base optionnelle absente ;
- valeurs invalides : refus du lot ;
- paire PnL/rendement incompatible : valeurs conservées et anomalie H4 signalée ;
- PnL fourni utilisé comme autorité de redimensionnement ;
- coûts simulés sans effet sur les bases observées ;
- sélection de chaque base produisant les agrégats et le capital C4 attendus ;
- absence de double comptage ;
- import, ledger, audit et export conservant base et provenance ;
- démonstration : 40 bases net fixe observées, 16 full-cost observées et 24 fallbacks full-cost ;
- compatibilité des scénarios synthétiques historiques sans objet `pnlBases`.

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

Résultats observés dans GitHub Actions `29248916855` :

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

- H4 reste responsable de la politique complète de réconciliation ;
- H3 sur la provenance de devise du prix d'entrée reste ouvert ;
- H5 sur l'injection de formule CSV reste ouvert ;
- H6 sur les performances reste ouvert ;
- les bases observées sont redimensionnées proportionnellement au nominal simulé ;
- cette validation ne démontre ni l'exactitude de toutes les formules ni la valeur commerciale du produit.
