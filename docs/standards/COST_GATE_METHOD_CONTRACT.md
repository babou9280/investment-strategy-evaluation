# Breaktest — contrat méthodologique Cost Gate

## 1. Statut

Ce contrat décrit la méthodologie de Breaktest Cost Gate. Son sous-ensemble cash long synthétique est implémenté et testé dans `cost_gate_foundation/` ; les données réelles, l'interface et les domaines étendus restent hors preuve.

## 2. Principe

Cost Gate évalue la cohérence économique d'un scénario pré-trade sous des hypothèses explicites. Il ne prédit ni rendement, ni exécution, ni performance future.

Le diagnostic est une fonction de :

```text
scenario_snapshot
cost_model
capital_state
gross_edge_alignment
market_data_state
user_constraints
versioned_policy
```

Aucune sortie ne peut être plus forte que la composante la moins fiable.

## 3. Décomposition des couches

### 3.1 Frictions

Réutiliser le contrat Capital Efficiency :

```text
fixed_cost_eur
variable_floor_rate
variable_cost_eur
total_cost_eur
break_even_gross_rate
```

### 3.2 Avantage

Réutiliser point ou fourchette :

```text
gross_edge_rate
ou
gross_edge_low_rate
gross_edge_base_rate
gross_edge_high_rate
```

Aucune valeur n'est inventée.

Toute conclusion dépendante de l'avantage exige `edge_aligned` selon `GROSS_EDGE_ALIGNMENT_KEY.md`. Une valeur mal alignée n'empêche pas le calcul indépendant du seuil, mais laisse Edge Survival `not_assessed`.

### 3.3 Capital

La couche initiale réutilise `PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` :

```text
available_settled_cash_eur
available_settled_cash_basis
cash_hold_ledger[]
user_defined_cash_reserve_eur
account_free_settled_cash_eur
strategy_capital_eur
strategy_capital_committed_eur
strategy_allocation_headroom_eur
capital_feasibility_cash_eur
entry_cash_requirement_eur
```

La condition supportée est :

```text
entry_cash_requirement_eur <=
  min(
    account_free_settled_cash_eur,
    strategy_allocation_headroom_eur
  )
```

`reference_capital_eur`, `account_equity` et `buying_power` ne remplacent jamais ces bases. Les holds déjà intégrés au cash fourni par la source ne sont pas soustraits une deuxième fois.

Cette condition est nécessaire mais non suffisante dès que le modèle sort du périmètre cash long, qu'une allocation manque ou que plusieurs positions ne sont pas réconciliées.

### 3.4 Liquidité et exécution

Toute donnée doit être attachée à :

```text
instrument_id
venue_id
quote_currency
account_currency
timestamp
timezone
source
license
provenance
freshness_limit
```

Le modèle ne doit pas supposer qu'un bid/ask ou une profondeur visible garantit l'exécution.

## 4. Data Quality Gate

Pour chaque champ externe :

```text
valid
missing
invalid
stale
conflicted
unsupported
```

État agrégé :

```text
data_ready
data_stale
data_partial
data_conflicted
data_unavailable
```

Règles :

- aucun fallback silencieux ;
- zéro distinct d'absence ;
- timestamp obligatoire pour les données de marché ;
- instrument, place et devise réconciliés ;
- donnée stale jamais présentée comme actuelle ;
- conflit entre sources conservé et visible ;
- `data_ready` nécessaire pour toute conclusion dépendante de la donnée ;
- l'absence de donnée n'empêche pas les calculs indépendants de cette donnée.

## 5. Graphe de dépendances

Le moteur suit cette séquence de construction, sans en faire une priorité aveugle du message principal :

1. valider le domaine, les entrées et l'intégrité du snapshot ;
2. normaliser chaque source et sa qualité ;
3. calculer les couches dont les dépendances sont satisfaites ;
4. produire tous les `findings[]` indépendants ;
5. choisir une synthèse interne selon `COST_GATE_FINDINGS_CONTRACT.md` ;
6. expliquer constats, hypothèses, provenance et limites.

Dépendances minimales :

- géométrie de friction : coût, unité, portée et nominal réconciliés ;
- Edge Survival : géométrie complète et clé de `G` alignée ;
- cash immédiat : base de prix, cash réglé, holds et allocation de stratégie ;
- exécution : données temporelles et domaine explicitement couverts ;
- synthèse favorable : aucune incompatibilité active dans le domaine revendiqué.

Une couche invalide ou insuffisante ne contamine pas les couches indépendantes. Inversement, une donnée manquante dans une couche ne masque pas un fait dur déjà démontré ailleurs.
## 6. Sortie analytique

La sortie canonique est :

```text
findings[]
primary_factor
summary_code
unassessed_layers[]
snapshot_status
limitations[]
```

Les synthèses internes autorisées sont :

```text
invalid_input
unsupported_scope
snapshot_unusable
structurally_non_viable
capital_not_feasible
execution_cost_risk
constraint_breach
insufficient_data
no_incompatibility_detected_under_assumptions
```

Elles sont dérivées par la politique versionnée du contrat des constats. Elles ne remplacent jamais `findings[]` et ne sont pas affichées comme identifiants bruts dans l'interface grand public.

Les anciens états `compatible_under_assumptions` et `adjustment_required` sont retirés. Une migration explicite les mappe respectivement vers `no_incompatibility_detected_under_assumptions` et vers les constats concernés, avec `constraint_breach` uniquement si une synthèse interne est nécessaire.

### Périmètre initial

Une future preuve synthétique éventuelle supporte uniquement :

```text
cash_account
long_cash_purchase
spot_equity_or_etf
unlevered
manual_assumptions_or_synthetic_demo
```

Marge, short, dérivés, cash réglé non identifiable et toute autre structure retournent `unsupported_scope`. Aucun modèle cash long de substitution n'est lancé silencieusement.
## 7. Règle de prudence

La sortie agrégée ne doit pas masquer les sous-diagnostics. Un utilisateur doit voir :

- facteur limitant principal ;
- autres facteurs limitants ;
- hypothèses ;
- données et fraîcheur ;
- formules ;
- limites ;
- résultats encore calculables malgré l'indisponibilité.

Aucun score global opaque.

## 8. Temps, identité et atomicité

Une analyse pré-trade est active uniquement pour un snapshot identifié selon `COST_GATE_SNAPSHOT_CONTRACT.md`.

`snapshot_id` identifie le contenu canonique reproductible ; `snapshot_instance_id` distingue une occurrence de calcul. Les timestamps générés et les identifiants ne se hashent pas eux-mêmes.

Toute modification d'une entrée, d'un hold, d'une allocation, d'une source ou d'une version :

- invalide le diagnostic précédent ;
- rend les anciens constats inactifs ;
- exige un recalcul ;
- conserve versions, provenance et timestamps ;
- ne mélange pas des données temporellement incompatibles sans signalement.

Le passage du temps peut expirer un snapshot sans changer son hash : le statut temporel est réévalué au moment d'usage.
## 9. Scénarios minimaux futurs

- hypothèses manuelles cohérentes, sans incompatibilité détectée et couches non évaluées visibles ;
- avantage au seuil exact ;
- avantage sous plancher ;
- taille frontière supérieure au cash ;
- données stale ;
- devise incohérente ;
- place incorrecte ;
- spread manquant mais calculs de commission encore disponibles ;
- profondeur insuffisante ;
- ordre limite non exécuté : limite explicitée, aucune probabilité inventée ;
- source de cash brute puis déjà nette du même hold, sans double retrait ;
- allocation de stratégie inférieure au cash du compte ;
- plusieurs ordres concurrents pour le même cash ;
- capital modifié entre analyse et décision ;
- avantage brut mal aligné alors que le seuil reste calculable ;
- domaine marge, short ou dérivé refusé ;
- source indisponible ;
- coût de données non couvert par le modèle économique.

## 10. Tests requis avant implémentation externe

- oracles indépendants ;
- invariants de capital ;
- invariants de provenance ;
- tests de fraîcheur et fuseau ;
- tests instrument/place/devise ;
- conflits inter-sources ;
- absence de fallback silencieux ;
- invalidation des résultats obsolètes ;
- propriétés de monotonie pertinentes ;
- aucun `NaN`, `Infinity` ou `-0` ;
- tests de langage non prescriptif ;
- test utilisateur sans coaching ;
- revue juridique ;
- mesure du taux `insufficient_data` ;
- comparaison pré-trade / ex post si des données réelles sont un jour autorisées.

## 11. Versionnement

Toute implémentation devra exposer séparément :

```text
cost_engine_version
edge_engine_version
capital_engine_version
data_quality_version
cost_gate_policy_version
findings_catalog_version
snapshot_contract_version
gross_edge_alignment_version
```

Un changement de logique d'état, de tolérance, de source ou de domaine de validité impose une nouvelle version.

## 12. Interdictions

- aucune recommandation ;
- aucune exécution ;
- aucun ordre limite conseillé ;
- aucune probabilité d'exécution inventée ;
- aucun levier implicite ;
- aucun fallback vers le modèle cash long pour un domaine non supporté ;
- aucune donnée stale cachée ;
- aucune conclusion sans provenance ;
- aucun feu vert ou rouge simpliste supprimant les explications ;
- aucune revendication de conformité ou précision générale non auditée.
