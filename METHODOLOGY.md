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

La provenance dérivée est désormais conservée dans le moteur, mais son affichage détaillé dans l'audit utilisateur reste à implémenter. La réconciliation lorsque PnL et rendement sont tous deux fournis mais incohérents relève encore du défaut H4.

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

Cette correction ne rend pas encore toute la chaîne strictement walk-forward : l'allocation du budget de turnover reste ex post et relève de C3. Les libellés utilisateurs doivent donc parler de « modèle antérieur », pas d'« OOS strict » ni de « walk-forward ».

## Stress tests actuels

- augmentation des coûts ;
- retrait des meilleurs trades pour mesurer la concentration ;
- comparaison backtest / live-test ;
- risque de queue au niveau des trades ;
- réconciliation entre lignes et agrégats ;
- bootstrap conditionnel à l'échantillon fourni.

## Limites importantes

- le bootstrap ne corrige pas le biais de sélection, la dépendance temporelle ou le changement de régime ;
- l'isolation temporelle du modèle ne corrige pas l'allocation ex post du turnover ;
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
