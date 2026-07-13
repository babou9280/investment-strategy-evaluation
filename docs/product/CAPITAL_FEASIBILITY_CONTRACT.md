# Breaktest — contrat futur de faisabilité du capital

## 1. Problème découvert

Le moteur Capital Efficiency calcule actuellement des seuils et des frontières de taille, mais une frontière mathématiquement correcte peut être économiquement inexécutable pour le capital disponible.

Exemples :

- la taille nécessaire à une marge positive dépasse le capital de référence ;
- le montant d'ordre saisi dépasse le capital alors que le prototype ne modélise ni levier ni marge ;
- plusieurs positions simultanées utilisent chacune une taille apparemment admissible mais dépassent ensemble le capital ;
- une fréquence annuelle paraît compatible avec un budget de friction alors que la durée de détention immobilise le capital ;
- une taille frontière est interprétée comme recommandation, alors qu'elle ne décrit qu'une condition arithmétique.

Ce contrat définit le problème. Il n'autorise pas encore son implémentation dans la pull request Edge Survival Envelope.

## 2. Distinctions obligatoires

Ne jamais confondre :

```text
reference_capital_eur
available_cash_eur
order_notional_eur
reserved_notional_eur
portfolio_gross_exposure_eur
portfolio_net_exposure_eur
```

Le prototype actuel demande un `capital de référence`. Cette valeur sert principalement de dénominateur pour les frictions annuelles. Elle ne prouve pas qu'elle est entièrement disponible pour un nouvel ordre.

Avant toute fonction de faisabilité réelle, l'interface devra demander ou dériver explicitement la base de capital pertinente.

## 3. Périmètre sans levier

Tant que levier, marge et liquidations forcées ne sont pas implémentés :

- une opération ne peut pas être présentée comme finançable uniquement parce que son seuil est positif ;
- si `order_notional_eur > available_cash_eur`, l'état doit être `not_feasible_without_leverage` ;
- le produit ne doit pas supposer silencieusement un crédit, une marge ou une vente à découvert ;
- une taille frontière supérieure au capital disponible doit rester visible comme `frontier_exceeds_available_capital` ;
- aucune réduction automatique de taille n'est autorisée.

Ces états sont descriptifs. Ils ne recommandent ni levier ni augmentation du capital.

## 4. Frontière contre faisabilité

Pour une frontière de taille `N_min` :

```text
frontier_status = mathematically_available | structurally_unreachable
capital_feasibility = unknown | feasible_within_available_capital | frontier_exceeds_available_capital
```

La faisabilité n'est calculable que si la base de capital est explicitement définie.

Si :

```text
N_min <= available_cash_eur
```

le résultat signifie seulement que la frontière tient dans le cash déclaré. Il ne signifie pas que l'ordre est approprié, prudent ou optimal.

## 5. Positions simultanées

La faisabilité d'une stratégie répétée dépend de la durée de détention et du chevauchement des positions.

Une projection utilisant uniquement :

```text
monthly_operations * 12
```

ne suffit pas à prouver que le capital peut financer toutes les opérations.

Une future couche portefeuille devra réutiliser les règles historiques validées :

- réserver le nominal entre entrée et sortie ;
- libérer le nominal à la sortie ;
- traiter les sorties avant les entrées d'une même date selon la convention validée ;
- ne jamais appliquer le PnL avant sa réalisation ;
- réconcilier capital réalisé, réservé et libre ;
- refuser ou observer une opération non finançable plutôt que réduire silencieusement sa taille.

## 6. Fréquence et durée

Deux stratégies ayant la même fréquence mensuelle peuvent nécessiter des capitaux différents si leurs durées de détention diffèrent.

La future analyse doit distinguer :

- nombre d'opérations initiées ;
- nombre d'opérations clôturées ;
- durée de détention ;
- pic de positions simultanées ;
- pic de nominal réservé ;
- turnover ;
- capital libre minimum.

Aucune fréquence frontière ne doit être appelée `faisable` sans cette information lorsque des positions peuvent se chevaucher.

## 7. Allocation partielle du capital

Un utilisateur peut souhaiter consacrer seulement une part de son capital à une méthode.

La future entrée doit être explicite :

```text
capital_allocation_rate
strategy_capital_eur = reference_capital_eur * capital_allocation_rate
```

Ne jamais présumer que 100 % du capital est disponible pour la stratégie ou l'opération analysée.

## 8. Réserve de sécurité

Une réserve de cash peut être décrite par l'utilisateur, mais Breaktest ne doit pas en choisir le niveau.

```text
user_defined_cash_reserve_eur
available_cash_eur = strategy_capital_eur - user_defined_cash_reserve_eur - reserved_notional_eur
```

Le produit calcule la conséquence de cette condition ; il ne recommande pas la réserve.

## 9. États futurs autorisés

```text
capital_basis_missing
available_cash_unknown
feasible_within_available_capital
frontier_exceeds_available_capital
order_exceeds_available_capital
not_feasible_without_leverage
overlap_not_modelled
capital_reservation_required
```

Aucun état ne doit être transformé en score opaque.

## 10. Tests futurs

Tester au minimum :

- capital absent ;
- capital égal au nominal ;
- nominal supérieur au capital ;
- frontière inférieure, égale ou supérieure au capital ;
- allocation partielle ;
- réserve de cash ;
- positions non chevauchantes ;
- positions chevauchantes ;
- pertes réalisées réduisant le capital libre ;
- dates invalides ;
- absence de réduction silencieuse ;
- aucune suggestion de levier ;
- réconciliation avec le moteur historique de réservation du capital.

## 11. Gate d'implémentation

Cette couche ne doit être implémentée qu'après :

1. stabilisation et fusion d'Edge Survival Envelope ;
2. validation que les utilisateurs comprennent la frontière de taille actuelle ;
3. preuve que la faisabilité par rapport au capital change réellement leur diagnostic ;
4. définition explicite de la base de capital disponible ;
5. décision sur le traitement des positions simultanées ;
6. tests de non-régression avec C1 et C4.

## 12. Valeur produit potentielle

Cette couche pourrait transformer une sortie abstraite — « taille minimale 2 000 EUR » — en diagnostic plus utile :

> La condition mathématique existe, mais elle dépasse le capital que tu as déclaré disponible pour cette méthode.

Cette formulation apporte de la valeur sans recommander une opération, un levier ou un niveau de capital.