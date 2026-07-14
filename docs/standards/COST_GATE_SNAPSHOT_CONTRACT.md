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
created_at_utc
calculated_at_utc
expires_at_utc ou no_automatic_expiry
scenario_hash
input_hash
source_bundle_hash
gate_policy_version
cost_engine_version
edge_engine_version
capital_engine_version
data_quality_version
```

Les hashes sont calculés sur une sérialisation canonique documentée. L'arrondi d'affichage n'entre jamais dans le hash.

## 3. Contenu minimal

Le snapshot contient ou référence de manière immuable :

### Scénario

```text
instrument_id
venue_id
side
operation_scope
order_type
order_quantity
reference_price
proposed_order_notional_eur
account_currency
quote_currency
holding_horizon_definition
```

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
```

### Capital

```text
reference_capital_eur
strategy_capital_eur
available_settled_cash_eur
reserved_cash_eur
pending_cash_commitments_eur
capital_observed_at_utc
capital_status
```

### Avantage brut

Le snapshot référence la définition complète de `G` :

```text
gross_edge_mode
gross_edge_value ou low/base/high
gross_edge_basis
gross_edge_provenance
gross_edge_sample_period
gross_edge_instrument_scope
gross_edge_horizon
gross_edge_method_version
```

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

Si une politique manque, la donnée dépendante ne peut pas produire une conclusion actuelle.

## 6. Cohérence temporelle

Deux données peuvent être individuellement non stale tout en étant incompatibles entre elles.

Le produit vérifie au minimum :

- fuseau normalisé en UTC ;
- absence de timestamp futur injustifié ;
- écart maximal autorisé entre quote, profondeur, FX et capital, défini par politique ;
- statut de marché ou session lorsque pertinent ;
- date et version du barème contractuel ;
- absence de mélange entre cours ajusté historique et quote non ajustée.

Un mélange temporel invalide uniquement les conclusions dépendantes ; les calculs indépendants restent visibles.

## 7. Invalidation

Le snapshot devient obsolète dès qu'un élément du hash change :

- instrument, place, devise ou côté ;
- quantité, prix de référence ou nominal ;
- type d'ordre ;
- hypothèse de coût ;
- capital, réservation ou ordre en attente ;
- avantage brut ou fourchette ;
- contrainte utilisateur ;
- version d'un moteur ou d'une politique ;
- donnée externe mise à jour ;
- correction d'une source.

L'interface masque le diagnostic antérieur ou le marque explicitement obsolète. Elle ne conserve jamais un ancien état favorable comme résultat actif.

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

La future implémentation définit une sérialisation canonique :

- clés triées ;
- taux en décimal interne ;
- montants dans leur unité source et devise explicite ;
- timestamps ISO 8601 UTC ;
- zéro normalisé, jamais `-0` ;
- aucune valeur non finie ;
- champs absents représentés par un état explicite ;
- versions incluses.

Le hash recommandé pour le package de preuve est SHA-256.

## 10. Tests futurs

Tester :

- snapshot entièrement manuel ;
- quote actuelle puis expirée ;
- barème actuel avec quote stale ;
- timestamp futur ;
- fuseaux différents mais réconciliables ;
- sources temporellement incompatibles ;
- modification d'une entrée ;
- modification d'une contrainte ;
- modification du capital ;
- changement de version moteur ;
- hash déterministe ;
- ordre des clés sans effet ;
- zéro contre absence ;
- rejet de `NaN`, `Infinity` et `-0` ;
- couche indépendante encore calculable lorsque la quote manque ;
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

Contrat de conception non implémenté. Il ne prouve aucune capacité temps réel.