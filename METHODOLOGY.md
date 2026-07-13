# Breaktest - méthodologie actuelle

## Nature des calculs

Le prototype travaille principalement au niveau des trades et des PnL fournis. La courbe C4 est calendaire aux seules dates de sortie : elle ne constitue pas une valorisation quotidienne des positions ouvertes.

## Bases de résultat — règle H2

Breaktest conserve quatre bases séparées :

- **Brut observé** : PnL/rendement brut fourni par la ligne ;
- **Net fixe observé** : PnL/rendement net fixe fourni ; fallback explicite vers le brut lorsque la paire est entièrement absente ;
- **Full-cost observé** : PnL/rendement full-cost fourni ; fallback explicite vers le net fixe lorsque la paire est entièrement absente ;
- **Simulé par Breaktest** : brut observé redimensionné au nominal de la position, diminué des coûts du scénario actif.

Pour chaque base observée :

- une valeur explicitement invalide refuse le lot ;
- un zéro réel reste valide ;
- si seul le PnL est présent, le rendement est dérivé par `PnL / nominal` ;
- si seul le rendement est présent, le PnL est dérivé par `rendement × nominal` ;
- si la paire optionnelle est entièrement absente, le fallback et sa base d'origine sont conservés ;
- si PnL et rendement sont tous deux présents mais incompatibles, les deux valeurs sont conservées et l'anomalie est signalée pour H4 ;
- lors d'un redimensionnement, le PnL fourni est mis à l'échelle par `nominal simulé / nominal source` ; le rendement fourni reste conservé pour l'audit ;
- la provenance `observed`, `derived`, `fallback` ou `simulated` est attachée à la ligne.

Le mode par défaut reste **simulé par Breaktest**. La base sélectionnée détermine le résultat affiché, les agrégats et le PnL appliqué par C4. Les hypothèses de coûts ne modifient jamais une base observée et ne sont jamais soustraites une seconde fois d'un net observé.

La sélection de la base ne modifie pas rétroactivement les règles ex ante d'edge, de coûts, de turnover et de financement. Elle sépare le verdict de contrôle Breaktest du résultat observé ou simulé utilisé pour le reporting et la trésorerie réalisée.

## Normalisation numérique de la base brute — règle H1

- le nominal investi doit être présent, fini et strictement positif ;
- au moins un des champs `gross_pnl_eur` ou `gross_return` doit être présent et numériquement valide ;
- une valeur explicitement fournie mais non numérique, `NaN` ou infinie entraîne le refus du lot ;
- lorsque le rendement manque mais que le PnL brut et le nominal sont valides, le rendement est dérivé par `PnL / nominal` ;
- lorsque le PnL brut manque mais que le rendement et le nominal sont valides, le PnL est dérivé par `rendement × nominal` ;
- un zéro réel reste une observation valide ;
- la ligne normalisée conserve la provenance des valeurs.

## Isolation temporelle du modèle — règle C2

Chaque trade rejoué est évalué avec son propre modèle :

- seules les lignes `backtest` peuvent entraîner le modèle ;
- la ligne de décision elle-même est exclue par identité de ligne ;
- les dates doivent représenter des jours calendaires réels ;
- l'entrée doit être antérieure ou égale à la sortie ;
- la sortie d'entraînement doit être strictement antérieure à l'entrée de la décision ;
- les sorties de même date, les lignes futures et les lignes live sont exclues ;
- une décision à date invalide est classée `observe` ;
- le modèle, la profondeur et les exclusions sont conservés par décision.

## Allocation du turnover — règle C3

- les évaluations sont ordonnées par date d'entrée croissante ;
- le budget est consommé sur une fenêtre glissante de 365,25 jours ;
- les décisions déjà `remove` ou `observe` ne consomment rien ;
- les dates différentes ne sont jamais triées globalement selon l'edge ;
- les opportunités d'une même date sont classées par edge prudent, edge central puis identifiant ;
- chaque décision conserve budget avant/après, unités, rang et motif ;
- une opportunité future ne peut jamais changer une décision antérieure.

## Réservation du capital — règle C1

- les évaluations sont groupées par date d'entrée ;
- les décisions du groupe suivent la priorité C3 ;
- seules les décisions encore `keep` réservent le nominal complet ;
- aucune réduction implicite du nominal n'est autorisée ;
- une position du groupe n'est pas libérée au milieu de ce même groupe ;
- les données temporelles, nominales ou de résultat sélectionné invalides produisent `observe` ;
- chaque décision conserve capital réalisé, réservé et libre avant/après ;
- les métriques finales de turnover utilisent uniquement les décisions financées.

## Courbe de trésorerie réalisée — règle C4

Le financement et la réalisation sont calculés dans une seule simulation événementielle :

1. la simulation commence au capital initial ;
2. avant les entrées d'une date, les positions sorties à cette date ou avant sont traitées ;
3. les sorties d'un même jour libèrent leur nominal et appliquent le PnL de la base sélectionnée dans un événement agrégé ;
4. le PnL ne modifie jamais la trésorerie avant la sortie ;
5. les nouvelles entrées utilisent ensuite `capital réalisé - nominal réservé` ;
6. une décision `remove` ou `observe` n'applique aucun PnL ;
7. la courbe contient un point initial et un point par date de sortie financée ;
8. le dernier point égale le capital initial plus les PnL sélectionnés des positions financées ;
9. chaque événement conserve capital réalisé, réservé, libre, PnL et identifiants avant/après.

La courbe est une **courbe de trésorerie réalisée aux sorties**, pas une valorisation mark-to-market.

## Stress tests actuels

- augmentation des coûts ;
- retrait des meilleurs trades pour mesurer la concentration ;
- comparaison backtest / live-test ;
- risque de queue au niveau des trades ;
- réconciliation entre lignes et agrégats ;
- bootstrap conditionnel à l'échantillon fourni.

## Limites importantes

- H3 : la provenance de devise du prix d'entrée n'est pas encore corrigée ;
- H4 : aucune politique définitive ne réconcilie encore PnL, rendement et nominal lorsqu'ils sont simultanément incohérents ;
- H5 : l'export CSV n'est pas encore protégé contre l'injection de formule ;
- H6 : les performances sur imports moyens et grands restent insuffisantes ;
- la courbe réalisée ne valorise pas les positions ouvertes ;
- le levier, les appels de marge, intérêts, dividendes et flux externes ne sont pas simulés ;
- le bootstrap ne corrige pas le biais de sélection, la dépendance temporelle ou le changement de régime ;
- retirer le top N est un stress test ex post, pas une règle de trading ;
- un score composite est un indice d'évidence, pas une prédiction.

## Breaktest Score - proposition actuelle

- résilience aux coûts : 25 % ;
- résilience aux outliers : 25 % ;
- hors-échantillon : 25 % ;
- risque de queue : 15 % ;
- profondeur : 10 %.

La formule et les seuils doivent être versionnés, testés et gelés avant application à de nouvelles données.
