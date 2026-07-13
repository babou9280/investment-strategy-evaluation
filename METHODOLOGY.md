# Breaktest - méthodologie actuelle

## Nature des calculs

Le prototype travaille principalement au niveau des trades et des PnL fournis. Les métriques calculées à ce niveau ne doivent pas être présentées comme des métriques calendaires quotidiennes.

## Bases de résultat

- Brut : PnL brut fourni par la ligne.
- Net du journal : PnL net fourni ; repli explicite sur le brut lorsqu'il manque.
- Coûts complets : full-cost fourni ; repli explicite sur le net lorsqu'il manque.
- Coûts additionnels : allocation multipliée par un taux en points de base.
- Frais fixes : montant additionnel par ligne.

Tout repli doit être visible pour l'utilisateur et dans l'audit.

## Normalisation numérique de la base brute — règle H1

- le nominal investi doit être présent, fini et strictement positif ;
- au moins un des champs `gross_pnl_eur` ou `gross_return` doit être présent et numériquement valide ;
- une valeur explicitement fournie mais non numérique, `NaN` ou infinie entraîne le refus du lot ;
- lorsque le rendement manque mais que le PnL brut et le nominal sont valides, le rendement est dérivé par `PnL / nominal` ;
- lorsque le PnL brut manque mais que le rendement et le nominal sont valides, le PnL est dérivé par `rendement × nominal` ;
- un zéro réel reste une observation valide ;
- la ligne normalisée conserve des indicateurs internes `grossPnlDerived` et `grossReturnDerived`.

La provenance dérivée est conservée dans le moteur, mais son affichage détaillé dans l'audit utilisateur reste à implémenter. La réconciliation lorsque PnL et rendement sont tous deux fournis mais incohérents relève encore du défaut H4.

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
- avant chaque groupe, les positions antérieures dont la sortie est antérieure ou égale à l'entrée du groupe libèrent leur nominal ;
- une position ouverte dans le groupe n'est pas libérée au milieu de ce même groupe, même si sa sortie est le même jour ;
- les décisions du groupe sont financées dans l'ordre de priorité simultanée C3 ;
- seules les décisions encore `keep` peuvent réserver du capital ;
- le nominal demandé est le nominal dimensionné de la position ;
- il est financé intégralement ou refusé : aucun redimensionnement implicite n'est appliqué ;
- si le capital libre est insuffisant, la décision devient `remove` ;
- une date d'entrée invalide, une date de sortie invalide, une sortie antérieure à l'entrée ou un nominal invalide produit `observe` ;
- le PnL n'augmente ni ne diminue le capital disponible : seule la libération du nominal est modélisée ;
- chaque décision conserve les réservations et disponibilités avant/après, le nominal demandé, la date de libération, le rang et le motif ;
- le résultat expose le pic de capital réservé, le minimum de capital libre et les refus de financement ;
- les métriques finales de turnover sont recalculées sur les décisions réellement financées.

Cette règle garantit, dans les scénarios couverts, que le capital réservé ne dépasse pas le capital initial. Elle ne modélise pas le réinvestissement du PnL, le levier, les appels de marge, les intérêts ou les flux externes.

## Stress tests actuels

- augmentation des coûts ;
- retrait des meilleurs trades pour mesurer la concentration ;
- comparaison backtest / live-test ;
- risque de queue au niveau des trades ;
- réconciliation entre lignes et agrégats ;
- bootstrap conditionnel à l'échantillon fourni.

## Limites importantes

- le bootstrap ne corrige pas le biais de sélection, la dépendance temporelle ou le changement de régime ;
- la réservation du nominal ne transforme pas la courbe affichée en courbe de trésorerie réalisée ou mark-to-market ;
- un drawdown aux dates de sortie n'est pas un drawdown mark-to-market quotidien ;
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
