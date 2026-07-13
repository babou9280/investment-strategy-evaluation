# Breaktest — Edge Survival Envelope

## Statut

- Phase : prototype interne de valeur produit
- Branche : `strategy/edge-survival-envelope`
- Publication externe : interdite
- Données : hypothèses utilisateur ou scénarios synthétiques uniquement

## Problème traité

Le moteur Capital Efficiency peut comparer un rendement brut ponctuel au seuil de couverture des frictions. Cette valeur unique crée toutefois une fausse précision : un investisseur connaît rarement son avantage brut futur avec exactitude.

Le produit doit pouvoir répondre sans prédire :

> La conclusion reste-t-elle vraie dans toute la fourchette de rendement brut que l'utilisateur considère plausible ?

## Proposition

Ajouter un mode facultatif **Fourchette d'avantage brut** avec trois valeurs fournies par l'utilisateur :

- borne basse ;
- scénario central ;
- borne haute.

Cette fourchette n'est ni un intervalle de confiance, ni une distribution, ni une probabilité. Elle représente uniquement trois hypothèses explicites.

## Valeur produit

Le module doit montrer :

1. la marge nette aux bornes basse, centrale et haute ;
2. si toute la fourchette dépasse le seuil brut de couverture ;
3. si la fourchette traverse ce seuil ;
4. si même sa borne haute reste sous le seuil ;
5. si une augmentation de taille peut théoriquement diluer le coût fixe ;
6. si le plancher variable rend une contrainte impossible dans tout ou partie de la fourchette.

Le résultat principal reste le seuil brut lorsque aucune hypothèse d'avantage n'est fournie.

## États descriptifs autorisés

- `survives_full_range` : la borne basse est strictement supérieure au seuil ;
- `crosses_break_even` : la fourchette contient des hypothèses sous le seuil et d'autres au-dessus ;
- `fails_full_range` : la borne haute est inférieure ou égale au seuil ;
- `structurally_unreachable_full_range` : même la borne haute est inférieure ou égale au plancher variable ;
- `variable_floor_crossing` : la fourchette traverse le plancher variable ;
- `point_estimate` : ancien mode à une seule valeur ;
- `threshold_only` : aucune hypothèse d'avantage.

Ces états décrivent des relations mathématiques. Ils ne qualifient pas une transaction de bonne, mauvaise, recommandée ou optimale.

## Expérience cible

Le parcours reste progressif :

1. calculer le seuil à partir des frictions ;
2. choisir facultativement `Valeur unique` ou `Fourchette` ;
3. saisir les hypothèses ;
4. lire une phrase en français simple avant les détails quantitatifs ;
5. ouvrir les marges basse, centrale et haute ;
6. afficher au maximum une contrainte inverse à la fois.

Exemples de formulation :

- « Même dans l'hypothèse basse saisie, le rendement brut reste supérieur au seuil de couverture. »
- « La fourchette saisie traverse le seuil : la conclusion dépend de l'hypothèse retenue. »
- « Même l'hypothèse haute reste sous le seuil de couverture. »
- « Même l'hypothèse haute reste sous le plancher variable : augmenter uniquement la taille ne peut pas résoudre cette contrainte dans le modèle. »

## Provenance

Chaque valeur d'avantage doit conserver une provenance :

- `user_assumption` ;
- `synthetic_demo`.

Les futures provenances `observed_backtest`, `observed_live` ou `derived` sont réservées à un import réellement validé. Elles ne doivent pas être simulées dans ce prototype.

## Interdictions

- aucune probabilité de succès ;
- aucun intervalle de confiance inventé ;
- aucun score de robustesse opaque ;
- aucune prédiction de rendement ;
- aucune recommandation de taille ou fréquence ;
- aucune donnée réelle de courtier ;
- aucun service externe, import ou stockage.

## Critère de valeur

Un utilisateur doit comprendre en moins de 90 secondes pourquoi une estimation ponctuelle peut être fragile et si sa conclusion change dans la fourchette qu'il a lui-même fournie.
