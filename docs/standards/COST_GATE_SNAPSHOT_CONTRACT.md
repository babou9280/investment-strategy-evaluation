# Breaktest — contrat de snapshot pré-trade Cost Gate

## 1. Objet

Une analyse pré-trade n'est vraie que pour l'ensemble exact d'hypothèses, de données, de versions et d'horodatages utilisés au moment du calcul.

Le snapshot empêche :

- l'interprétation d'un ancien résultat après modification d'une entrée ;
- le mélange silencieux de données provenant de moments incompatibles ;
- l'utilisation d'une donnée stale comme donnée actuelle ;
- l'impossibilité de reproduire le diagnostic ;
- la confusion entre analyse et exécution.

## 2. Identité canonique

Chaque analyse expose :

```text
snapshot_id
snapshot_instance_id
created_at_utc
calculated_at_utc
expires_at_utc ou no_automatic_expiry
scenario_hash
input_hash
source_bundle_hash
snapshot_content_hash
gate_policy_version
cost_engine_version
edge_engine_version
capital_engine_version
data_quality_version
findings_catalog_version
gross_edge_alignment_version
```

Les identifiants ont des rôles distincts :

- `scenario_hash` couvre seulement l'identité économique du scénario : instrument, place, direction, portée, quantité, base de prix, devise et type d'ordre ;
- `input_hash` couvre toutes les entrées normalisées fournies, y compris capital, coûts, avantage et contraintes, mais exclut les champs générés par le calcul ;
- `source_bundle_hash` couvre les valeurs sourcées et leur provenance, version, observation et validité ;
- `snapshot_content_hash` couvre les trois hashes précédents et toutes les versions de moteurs/politiques ;
- `snapshot_id = snapshot_content_hash` identifie le contenu reproductible ;
- `snapshot_instance_id` identifie une occurrence de calcul et peut différer entre deux recalculs identiques.

`created_at_utc`, `calculated_at_utc`, `snapshot_instance_id` et `snapshot_id` ne s'incluent jamais eux-mêmes dans les hashes. À contenu, sources et versions identiques, `snapshot_id` reste identique même si une nouvelle instance est créée.

Les hashes sont calculés sur une sérialisation canonique documentée. L'arrondi d'affichage n'entre jamais dans le hash.
## 3. Contenu minimal

Le snapshot contient ou référence de manière immuable :

### Scénario

```text
instrument_id
venue_id
instrument_type
account_model
position_model
side
operation_scope
order_type
order_quantity
quantity_unit
reference_price
reference_price_currency
notional_basis
spread_reference_price_status
slippage_reference_price_status
entry_asset_consideration_eur
scenario_notional_eur
account_currency
quote_currency
holding_horizon_definition
```

Lorsque quantité et prix existent, `entry_asset_consideration_eur` doit se réconcilier avec leur produit et la transformation FX déclarée. Un nominal conflictuel invalide uniquement les sorties qui en dépendent.

La devise de cotation et la devise du compte font partie de l'identité économique. Si elles sont identiques, toute hypothèse ou ligne de cash FX non nulle est conflictuelle. Les composantes immédiates normalisées sont présentes explicitement, y compris lorsqu'elles valent zéro.

Toute valeur non applicable reste explicitement `not_applicable`, jamais absente sans explication.

### Hypothèses de friction

Chaque composante porte :

```text
value
unit
basis
provenance
source_id
source_version
observed_at_utc
valid_until_utc
status
included_in_reference_price
```

### Capital

```text
reference_capital_eur
strategy_capital_eur
strategy_capital_committed_eur
available_settled_cash_eur
available_settled_cash_basis
source_included_hold_ids[]
cash_hold_ledger[]
user_defined_cash_reserve_eur
account_free_settled_cash_eur
strategy_allocation_headroom_eur
capital_feasibility_cash_eur
capital_observed_at_utc
capital_status
```

Chaque élément du `cash_hold_ledger` possède un `hold_id` unique, un type, un montant et ses indicateurs d'inclusion côté source et côté stratégie. Les anciens agrégats `reserved_cash_eur` et `pending_cash_commitments_eur` peuvent être exposés comme vues, jamais comme déductions indépendantes sans réconciliation.

`source_included_hold_ids[]`, `cash_hold_ledger[]`, `sources[]`, `user_constraints[]` et `cost_exclusions[]` sont des collections typées. Un objet unique ou toute autre valeur non tableau est une entrée invalide, jamais un tableau vide implicite. Chaque source et contrainte possède un identifiant stable et non dupliqué. Les collections économiquement non ordonnées sont triées avant hash et évaluation.

### Avantage brut

Le snapshot référence la définition complète de `G` :

```text
gross_edge_mode
gross_edge_value ou low/base/high
gross_edge_basis
gross_edge_provenance
gross_edge_alignment_key
gross_edge_alignment_state
gross_edge_method_version
```

La clé d'alignement inclut notamment instrument, place, direction, portée de l'opération, horizon, dénominateur, base de prix, devise, coûts déjà inclus, estimateur, période et version de règle. Aucun calcul Edge Survival dépendant de `G` n'est actif tant que l'état n'est pas `edge_aligned`.

### Contraintes explicites

Chaque contrainte utilisateur est incluse avec sa valeur, son unité et sa provenance.
## 4. États temporels

Chaque donnée temporelle possède :

```text
current
stale
future_timestamp
missing_timestamp
mixed_time_basis
not_time_sensitive
```

L'état agrégé du snapshot est :

```text
snapshot_current
snapshot_expired
snapshot_temporally_inconsistent
snapshot_incomplete
snapshot_conflicted
manual_assumptions_only
```

`manual_assumptions_only` signifie qu'aucune actualité de marché n'est revendiquée. Il ne doit pas être qualifié de `current market snapshot`.

## 5. Fraîcheur

Aucun seuil universel de fraîcheur n'est caché dans le produit.

Pour chaque source ou classe de donnée :

```text
freshness_policy_id
freshness_limit
freshness_unit
policy_source
policy_version
```

L'expiration agrégée est la plus proche des expirations obligatoires :

```text
expires_at_utc = min(valid_until_utc des données critiques)
```

Une source marquée non critique peut produire son propre constat stale, mais elle ne raccourcit pas `expires_at_utc` et n'expire pas à elle seule tous les autres constats. Si aucune source n'est critique, l'expiration agrégée est `no_automatic_expiry`.

Si une politique manque, la donnée dépendante ne peut pas produire une conclusion actuelle.

## 6. Cohérence temporelle

Deux données peuvent être individuellement non stale tout en étant incompatibles entre elles.

Le produit vérifie au minimum :

- fuseau normalisé en UTC ;
- `observed_at_utc <= evaluated_at_utc` pour toute donnée utilisée ;
- absence de timestamp futur injustifié ;
- écart maximal autorisé entre quote, profondeur, FX et capital, défini par politique ;
- statut de marché ou session lorsque pertinent ;
- date et version du barème contractuel ;
- absence de mélange entre cours ajusté historique et quote non ajustée.

Un mélange temporel invalide uniquement les conclusions dépendantes ; les calculs indépendants restent visibles.

Une source observée après l'heure d'évaluation produit `snapshot_temporally_inconsistent` et le constat bloquant `synthetic_source_observed_after_evaluation` dans la fondation synthétique. Elle n'est jamais classée `snapshot_current`.

## 7. Invalidation

Le contenu économique devient obsolète dès qu'un élément couvert par `snapshot_content_hash` change :

- instrument, place, devise, côté ou domaine ;
- quantité, prix de référence, base du nominal ou nominal ;
- type d'ordre ;
- hypothèse de coût ou statut d'inclusion dans le prix ;
- capital, allocation de stratégie, engagement, réserve ou hold ;
- avantage brut, fourchette ou clé d'alignement ;
- contrainte utilisateur ;
- version d'un moteur, d'une politique ou du catalogue de constats ;
- donnée externe mise à jour ;
- correction d'une source.

Le passage du temps peut aussi rendre un snapshot expiré sans changer son contenu. Le statut temporel est donc réévalué au moment d'usage contre `expires_at_utc` ; il ne suffit pas de comparer les hashes.

L'interface masque le diagnostic antérieur ou le marque explicitement obsolète. Ses anciens constats deviennent inactifs et ne peuvent plus alimenter la synthèse. Elle ne conserve jamais un ancien état favorable comme résultat actif.
## 8. Temps de contrôle contre temps d'usage

Cost Gate est un contrôle, pas une garantie d'exécution.

Entre `calculated_at_utc` et une décision éventuelle :

- le marché peut bouger ;
- le capital peut changer ;
- un ordre concurrent peut réserver du cash ;
- une quote peut disparaître ;
- une exécution partielle peut modifier le nominal et les frais.

Le produit affiche :

```text
Analyse valable pour le snapshot affiché. Recalculez après toute modification ou expiration.
```

Il ne prétend jamais que l'ordre sera exécuté au prix ou au coût estimé.

## 9. Sérialisation et hash

L'implémentation synthétique définit la sérialisation canonique suivante :

- clés triées ;
- tableaux ordonnés par une représentation canonique stable avant hash et évaluation lorsque l'ordre n'a pas de sens économique ; cela couvre au minimum holds, sources, contraintes utilisateur et exclusions de coûts ;
- taux en décimal interne ;
- montants dans leur unité source et devise explicite ;
- timestamps ISO 8601 UTC ;
- zéro normalisé, jamais `-0` ;
- aucune valeur non finie ;
- champs absents représentés par un état explicite ;
- versions incluses dans `snapshot_content_hash` ;
- champs générés et identifiants exclus des payloads qu'ils identifient.

Le hash du package de preuve est SHA-256.

La sérialisation doit publier le périmètre de chaque hash. Deux objets économiquement identiques avec un ordre de clés ou d'ensembles différent produisent le même `snapshot_id`. Deux instances calculées à des heures différentes peuvent partager ce `snapshot_id`, tout en conservant des `snapshot_instance_id` distincts.

Le même contenu peut passer de courant à expiré sans nouveau hash. Dans ce cas, `compareSnapshots` conserve `sameContent = true` mais impose `oldFindingsActive = false` et un état `expired`.
## 10. Tests

Tester :

- snapshot entièrement manuel ;
- quote actuelle puis expirée sans mutation silencieuse du contenu ;
- quote expirée rendant les anciens constats inactifs malgré un hash identique ;
- barème actuel avec quote stale ;
- timestamp futur ;
- fuseaux différents mais réconciliables ;
- sources temporellement incompatibles ;
- modification d'une entrée ;
- modification d'une contrainte ;
- modification du capital ou de l'allocation de stratégie ;
- modification d'un hold déjà inclus par la source ;
- changement de version moteur ou catalogue ;
- hash déterministe ;
- deux instances identiques avec même `snapshot_id` ;
- absence de boucle d'auto-hash ;
- ordre des clés sans effet ;
- ordre des holds, sources, contraintes et exclusions sans effet sur le snapshot ni les constats dérivés ;
- quantité × prix × devise × nominal économique réconciliés ;
- source observée après l'évaluation refusée ;
- expiration agrégée limitée aux sources critiques ;
- collections et identifiants mal formés refusés ;
- zéro contre absence ;
- rejet de `NaN`, `Infinity` et `-0` ;
- couche indépendante encore calculable lorsque la quote manque ;
- anciens constats inactifs après invalidation ;
- aucune conclusion actuelle après expiration.
## 11. Gate d'implémentation

Avant donnée externe réelle :

1. politiques de fraîcheur versionnées ;
2. source et licence identifiées ;
3. horloge et fuseau testés ;
4. stratégie de kill switch ;
5. journal d'incident et correction de source ;
6. test de temps de contrôle / temps d'usage ;
7. revue de confidentialité des intentions d'ordre.

## 12. Statut

Le sous-ensemble synthétique est implémenté dans `cost_gate_foundation/` : sérialisation canonique, hashes de scénario/entrées/sources/contenu, identité d'instance séparée, mutation et expiration. La version `cost-gate-snapshot-2`, validée au head fonctionnel `2ebf0e3e37852e4f3252e54149e147aa0d5712c3` par le run `#608` puis synchronisée par le run `#610`, ajoute l'ordre canonique des ensembles et l'inactivation après expiration.

La version locale `cost-gate-snapshot-3` refuse les sources futures et collections mal formées, et limite l'expiration agrégée aux sources critiques. Elle n'est pas encore prouvée à distance ; un nouveau head, une CI exact-head et un artefact inspecté sont requis.

Ce contrat et cette preuve n'établissent aucune capacité temps réel, aucune persistance et aucune qualité de source externe.
