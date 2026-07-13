# Breaktest - méthodologie actuelle

## Nature des calculs

Le prototype travaille principalement au niveau des trades et des PnL fournis. La courbe C4 est calendaire aux seules dates de sortie : elle ne constitue pas une valorisation quotidienne des positions ouvertes.

## Bases de résultat

- Brut : PnL brut fourni par la ligne.
- Net du journal : PnL net fourni ; repli explicite sur le brut lorsqu'il manque.
- Coûts complets : full-cost fourni ; repli explicite sur le net lorsqu'il manque.
- Coûts additionnels : allocation multipliée par un taux en points de base.
- Frais fixes : montant additionnel par ligne.

Tout repli doit être visible pour l'utilisateur et dans l'audit. La normalisation effective des bases nettes du journal relève encore de H2.

## Normalisation numérique de la base brute — règle H1

- le nominal investi doit être présent, fini et strictement positif ;
- au moins un des champs `gross_pnl_eur` ou `gross_return` doit être présent et numériquement valide ;
- une valeur explicitement fournie mais non numérique, `NaN` ou infinie entraîne le refus du lot ;
- lorsque le rendement manque mais que le PnL brut et le nominal sont valides, le rendement est dérivé par `PnL / nominal` ;
- lorsque le PnL brut manque mais que le rendement et le nominal sont valides, le PnL est dérivé par `rendement × nominal` ;
- un zéro réel reste une observation valide ;
- la ligne normalisée conserve des indicateurs internes `grossPnlDerived` et `grossReturnDerived`.

La provenance dérivée est conservée dans le moteur, mais son affichage détaillé dans l'audit utilisateur reste à implémenter. La réconciliation lorsque PnL et rendement sont tous deux fournis mais incohérents relève encore de H4.

## Isolation temporelle du modèle — règle C2

Chaque trade rejoué est évalué avec son propre modèle. L'ensemble d'entraînement autorisé est défini comme suit :

- seules les lignes `backtest` peuvent entraîner le modèle ;
- la ligne de décision elle-même est exclue par identité de ligne, pas par identifiant textuel ;
- les dates doivent commencer par une date ISO `YYYY-MM-DD` représentant un jour calendaire réel ;
- les dates d'entrée et de sortie de la ligne d'entraînement doivent respecter `entrée ≤ sortie` ;
- la sortie de la ligne d'entraînement doit être strictement antérieure à l'entrée de la décision ;
- une sortie le même jour que l'entrée de la décision est exclue ;
- les lignes futures et toutes les lignes live sont exclues de l'entraînement ;
- une décision dont la date d'entrée est invalide est classée `observe` sans entraînement ;
- le modèle, le nombre d'observations et les exclusions sont conservés au niveau de chaque décision.

Le champ global `result.model` n'est plus un modèle entraîné sur toute la période : il sert uniquement de référence compatible avec l'interface et correspond à la dernière décision datée du replay. Les calculs de seuil de rentabilité utilisent le modèle propre à chaque ligne.

## Allocation du turnover — règle C3

Le plafond de turnover est appliqué dans l'ordre temporel des décisions :

- les évaluations sont ordonnées par date d'entrée croissante ;
- une date invalide est placée après les décisions datées, reste en observation et ne consomme aucun budget ;
- avant chaque date, les unités acceptées dont la date est sortie de la fenêtre glissante sont retirées du budget utilisé ;
- la fenêtre est fixée à 365,25 jours ;
- les décisions déjà `remove` ou `observe` avant le contrôle de turnover ne consomment rien ;
- les opportunités de dates différentes ne sont jamais triées ensemble selon leur edge ;
- pour une même date, les opportunités simultanément disponibles sont classées par edge prudent, puis edge central, puis identifiant déterministe ;
- une opportunité est conservée uniquement si ses unités demandées tiennent dans le budget glissant restant ;
- chaque décision conserve le budget avant, les unités demandées, le budget après, le rang simultané et le motif ;
- le résultat distingue le pic glissant réellement contraint de la moyenne annuelle descriptive.

L'invariant principal est qu'ajouter, supprimer ou modifier une opportunité future ne peut jamais changer une décision antérieure.

## Réservation du capital — règle C1

Après H1, C2 et C3, le moteur applique un contrôle de financement chronologique :

- les évaluations sont groupées par date d'entrée ;
- les décisions du groupe sont financées dans l'ordre de priorité simultanée C3 ;
- seules les décisions encore `keep` peuvent réserver du capital ;
- le nominal demandé est le nominal dimensionné de la position ;
- il est financé intégralement ou refusé : aucun redimensionnement implicite n'est appliqué ;
- une position ouverte dans le groupe n'est pas libérée au milieu de ce même groupe, même si sa sortie est le même jour ;
- une date d'entrée invalide, une date de sortie invalide, une sortie antérieure à l'entrée, un nominal invalide ou un PnL net non fini produit `observe` ;
- chaque décision conserve les réservations et disponibilités avant/après, le nominal demandé, la date de libération, le rang et le motif ;
- le résultat expose le pic de capital réservé, le minimum de capital libre et les refus de financement ;
- les métriques finales de turnover sont recalculées sur les décisions réellement financées.

C4 conserve ces règles de réservation, mais remplace le capital initial fixe par la trésorerie effectivement réalisée à l'événement : `capital libre = capital réalisé - nominal réservé`.

## Courbe de trésorerie réalisée — règle C4

Le financement et la réalisation du PnL sont calculés dans une seule simulation événementielle :

1. la simulation commence exactement au capital initial ;
2. les dates d'entrée et de sortie sont ramenées au jour calendaire ISO valide ;
3. avant les entrées d'une date, toutes les positions ouvertes dont la sortie est antérieure ou égale à cette date sont traitées ;
4. les sorties partageant une date libèrent leur nominal et appliquent leur PnL net dans un événement agrégé ;
5. l'ordre interne de ces sorties ne peut pas modifier le capital final du jour ;
6. le PnL d'une position ne modifie jamais la trésorerie avant sa sortie ;
7. les nouvelles entrées de la date sont ensuite financées selon la priorité C3 à partir du capital réalisé moins le nominal encore réservé ;
8. un gain réalisé augmente et une perte réalisée réduit la capacité de financement à compter de cet événement ;
9. une décision `remove` ou `observe` n'applique aucun PnL et ne réserve aucun nominal ;
10. la courbe conserve un point initial et un point par date de sortie ayant au moins une position financée ;
11. le dernier point doit égaler le capital initial plus la somme des PnL nets des positions financées à sorties valides ;
12. chaque événement conserve son type, sa date, le capital réalisé, le nominal réservé, le capital libre, le PnL appliqué et les identifiants concernés avant et après.

La courbe est une **courbe de trésorerie réalisée aux sorties**. Elle n'est pas mark-to-market : entre deux sorties, elle ne représente ni la valeur de marché des positions ouvertes ni un drawdown quotidien.

## Stress tests actuels

- augmentation des coûts ;
- retrait des meilleurs trades pour mesurer la concentration ;
- comparaison backtest / live-test ;
- risque de queue au niveau des trades ;
- réconciliation entre lignes et agrégats ;
- bootstrap conditionnel à l'échantillon fourni.

## Limites importantes

- les bases nettes et full-cost fournies par les journaux ne sont pas encore normalisées par le moteur ;
- le bootstrap ne corrige pas le biais de sélection, la dépendance temporelle ou le changement de régime ;
- la courbe réalisée aux sorties ne valorise pas les positions ouvertes et n'est pas mark-to-market ;
- un drawdown aux seules dates de sortie n'est pas un drawdown quotidien de portefeuille ;
- le levier, les appels de marge, les intérêts, les dividendes et les flux externes ne sont pas simulés ;
- une CVaR sur peu de trades est instable ;
- retirer le top N est un stress test ex post, pas une règle de trading ;
- un score composite est un indice d'évidence, pas une prédiction de performance.

## Breaktest Score - proposition actuelle

- résilience aux coûts : 25 % ;
- résilience aux outliers : 25 % ;
- hors-échantillon : 25 % ;
- risque de queue : 15 % ;
- profondeur : 10 %.

La formule et les seuils doivent être versionnés, testés et gelés avant d'être appliqués à de nouvelles données. Toute évolution doit apparaître dans le changelog.
