# Breaktest — contrat futur de faisabilité du capital

## 1. Problème découvert

Le moteur Capital Efficiency calcule actuellement des seuils et des frontières de taille, mais une frontière mathématiquement correcte peut être économiquement inexécutable pour le capital disponible.

Exemples :

- la taille nécessaire à une marge positive dépasse le capital de référence ;
- le montant d'ordre saisi dépasse le capital alors que le prototype ne modélise ni levier ni marge ;
- plusieurs positions simultanées utilisent chacune une taille apparemment admissible mais dépassent ensemble le capital ;
- une fréquence annuelle paraît compatible avec un budget de friction alors que la durée de détention immobilise le capital ;
- une taille frontière est interprétée comme recommandation, alors qu'elle ne décrit qu'une condition arithmétique.

Ce contrat définit le problème général. Pour le cash immédiat du périmètre cash long, `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` est désormais l'autorité la plus spécifique. Ses noms, son ledger de holds et son plafonnement par allocation remplacent les anciens raccourcis `available_cash_eur` et `reserved_notional_eur`.

Ce document reste l'autorité future pour le chevauchement des positions, l'exposition et la réservation chronologique. Il n'autorise ni donnée réelle, ni connexion de compte, ni levier.

## 2. Distinctions obligatoires

Ne jamais confondre :

```text
reference_capital_eur
strategy_capital_eur
strategy_capital_committed_eur
available_settled_cash_eur
account_free_settled_cash_eur
strategy_allocation_headroom_eur
capital_feasibility_cash_eur
entry_cash_requirement_eur
scenario_notional_eur
portfolio_gross_exposure_eur
portfolio_net_exposure_eur
```

Le `capital de référence` sert principalement de dénominateur analytique. Il ne prouve ni une allocation à la stratégie, ni du cash réglé, ni l'absence de holds.

La faisabilité immédiate utilise le minimum entre cash réglé réconcilié et allocation de stratégie encore libre. Une source déjà nette d'un hold ne peut pas provoquer une seconde soustraction de ce même hold.
## 3. Périmètre sans levier

Tant que levier, marge et liquidations forcées ne sont pas implémentés :

- une opération ne peut pas être présentée comme finançable uniquement parce que son seuil est positif ;
- si `entry_cash_requirement_eur > capital_feasibility_cash_eur`, l'état doit être `insufficient_declared_strategy_cash` ;
- le produit ne doit pas supposer silencieusement un crédit, une marge, une vente à découvert ou l'affectation de tout le compte à la stratégie ;
- une taille frontière supérieure au plafond disponible doit rester visible comme `frontier_exceeds_available_capital` ;
- aucune réduction automatique de taille n'est autorisée.

Ces états sont descriptifs. Ils ne recommandent ni levier ni augmentation du capital.
## 4. Frontière contre faisabilité

Pour une frontière de taille `N_min` :

```text
frontier_status =
  mathematically_available
  | structurally_unreachable

capital_feasibility =
  unknown
  | feasible_within_declared_strategy_cash
  | frontier_exceeds_available_capital
```

La faisabilité n'est calculable que si cash réglé, base d'inclusion des holds, allocation de stratégie et capital déjà engagé sont explicitement définis.

Si :

```text
N_min <= capital_feasibility_cash_eur
```

le résultat signifie seulement que la frontière tient dans le plafond déclaré et réconcilié. Il ne signifie pas que l'ordre est approprié, prudent ou optimal.
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
strategy_capital_eur =
  reference_capital_eur * capital_allocation_rate
strategy_capital_committed_eur
strategy_allocation_headroom_eur =
  strategy_capital_eur - strategy_capital_committed_eur
```

La faisabilité compare ensuite l'engagement au minimum entre ce headroom et le cash réglé réconcilié du compte.

Ne jamais présumer que 100 % du capital ou du cash du compte est disponible pour la stratégie ou l'opération analysée.
## 8. Réserve de cash

Une réserve de cash peut être décrite par l'utilisateur, mais Breaktest ne doit pas en choisir le niveau.

```text
account_free_settled_cash_eur =
  available_settled_cash_eur
  - holds_non_deja_inclus_par_la_source
  - user_defined_cash_reserve_eur

capital_feasibility_cash_eur =
  min(
    account_free_settled_cash_eur,
    strategy_allocation_headroom_eur
  )
```

Les holds sont déduits par identifiant unique selon le contrat cash/cycle. Le produit calcule la conséquence de cette condition ; il ne recommande ni le niveau de réserve ni l'allocation.
## 9. États futurs autorisés

```text
capital_basis_missing
cash_basis_missing
feasible_within_declared_strategy_cash
frontier_exceeds_available_capital
order_exceeds_available_capital
not_feasible_without_leverage
overlap_not_modelled
capital_reservation_required
```

Aucun état ne doit être transformé en score opaque.

## 10. Tests

La fondation synthétique couvre déjà cash absent, égalité et dépassement, allocation partielle, réserve, holds, absence de réduction silencieuse et absence de suggestion de levier.

Restent futurs pour la couche portefeuille :

- frontière inférieure, égale ou supérieure au capital ;
- positions non chevauchantes ;
- positions chevauchantes ;
- pertes réalisées réduisant le capital libre ;
- dates invalides ;
- réconciliation avec le moteur historique de réservation du capital.

## 11. Gate d'implémentation

Cette couche ne doit être implémentée qu'après :

1. fusion d'Edge Survival Envelope — réalisée dans la PR `#23` ;
2. cohérence des contrats de cash, snapshot et constats ;
3. base de cash réglé et ledger de holds explicitement définis ;
4. allocation de stratégie et capital déjà engagé explicitement définis ;
5. prototype synthétique démontrant le plafonnement sans donnée réelle ;
6. positions simultanées maintenues hors périmètre tant qu'elles ne sont pas modélisées ;
7. tests de non-régression avec C1 et C4.

## 12. Valeur produit potentielle

Cette couche pourrait transformer une sortie abstraite — « taille minimale 2 000 EUR » — en diagnostic plus utile :

> La condition mathématique existe, mais elle dépasse le capital que tu as déclaré disponible pour cette méthode.

Cette formulation apporte de la valeur sans recommander une opération, un levier ou un niveau de capital.
