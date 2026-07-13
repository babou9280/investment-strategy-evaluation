# C4 — validation de la courbe de trésorerie réalisée

- Branche validée : `codex/c4-realized-equity-curve`
- Base : `breaktest-bootstrap` après C1, commit `2d84a0fa06b5b28da2fbd16c2f704e0bb58ff284`
- Build H1 + C2 + C3 + C1 + C4 : **158 682 octets**
- SHA-256 : `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af`
- Exécution GitHub Actions de référence : `29245031719`
- Commit testé : `ad15babbfdda2833f7120eb260cbc10cb47ebefd`

## Comportement validé

C4 remplace la courbe cumulée dans l'ordre des entrées par une simulation événementielle cohérente avec C1 :

1. le capital réalisé commence exactement au capital initial ;
2. une entrée réserve le nominal mais n'applique aucun PnL ;
3. les sorties échues sont traitées par date avant les entrées de cette date ;
4. le nominal est libéré et le PnL net est appliqué uniquement à la date de sortie ;
5. les sorties du même jour sont agrégées dans un point de courbe unique ;
6. le gain ou la perte réalisé modifie la trésorerie disponible pour les entrées de même date traitées ensuite et pour les dates futures ;
7. une décision `remove` ou `observe` ne réserve rien et ne contribue pas à la courbe ;
8. une date invalide, une sortie antérieure à l'entrée, un nominal invalide ou un PnL net non fini produit `observe` ;
9. chaque événement conserve capital réalisé, nominal réservé, capital libre, PnL appliqué et décisions concernées avant et après l'événement ;
10. l'interface présente explicitement une **courbe réalisée aux sorties**, non une valorisation mark-to-market.

## Invariants testés

- gain et perte absents de la courbe avant leur sortie ;
- modification de l'entrée sans modification de la sortie : point de PnL inchangé ;
- modification de la sortie : déplacement du point de PnL au nouveau jour ;
- deux sorties le même jour : résultat identique quel que soit l'ordre des lignes ;
- sortie puis entrée le même jour : le nominal et le PnL sortants sont disponibles avant le financement entrant ;
- gain réalisé finançant une entrée qui ne pouvait pas être financée auparavant ;
- perte réalisée empêchant une entrée ultérieure ;
- absence de recyclage intragroupe pour deux positions ouvertes et sorties le même jour ;
- décisions retirées ou observées sans effet sur le capital réalisé ;
- date de sortie invalide sans imputation silencieuse ;
- ajout ou modification d'un événement futur sans changement des décisions et points antérieurs ;
- courbe commençant au capital initial ;
- dernier point égal au capital initial plus la somme des PnL nets des trades financés ;
- réconciliation `capital libre = capital réalisé - nominal réservé` à chaque événement ;
- nominal réservé nul après traitement de toutes les sorties valides.

## Validations exécutées

```text
python3 scripts/build_breaktest.py
node tests/h1_strict_numeric_validation.test.js
python3 tests/h1_browser_smoke.py
python3 tests/c2_temporal_isolation.py
python3 tests/c3_chronological_turnover.py
python3 tests/c1_capital_reservation.py
python3 tests/c4_realized_equity_curve.py
node --check /tmp/breaktest-built.js
```

Résultats observés dans GitHub Actions `29245031719` :

```text
H1 strict numeric validation tests passed
H1 browser smoke passed; normalized demo trades unchanged
C2 temporal isolation tests passed
C3 chronological turnover tests passed
C1 capital reservation tests passed
C4 realized equity curve tests passed
JavaScript syntax: success
```

## Limites maintenues

- la courbe n'est pas mark-to-market et ne valorise pas les positions ouvertes entre entrée et sortie ;
- aucun levier, appel de marge, intérêt, frais de financement, dividende, dépôt ou retrait externe n'est simulé ;
- un drawdown calculé uniquement aux sorties n'est pas un drawdown quotidien de portefeuille ;
- H2 à H6 restent ouverts ;
- cette validation ne démontre pas l'exactitude générale de toutes les formules ni la valeur commerciale du produit.
