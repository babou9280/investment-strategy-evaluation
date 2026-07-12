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

## Stress tests actuels

- augmentation des coûts ;
- retrait des meilleurs trades pour mesurer la concentration ;
- comparaison backtest / live-test ;
- risque de queue au niveau des trades ;
- réconciliation entre lignes et agrégats ;
- bootstrap conditionnel à l'échantillon fourni.

## Limites importantes

- le bootstrap ne corrige pas le biais de sélection, la dépendance temporelle ou le changement de régime ;
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
