# Breaktest — contrat méthodologique Cost Gate

## 1. Statut

Ce contrat décrit la méthodologie future de Breaktest Cost Gate. Il ne prouve aucune fonctionnalité implémentée.

## 2. Principe

Cost Gate évalue la cohérence économique d'un scénario pré-trade sous des hypothèses explicites. Il ne prédit ni rendement, ni exécution, ni performance future.

Le diagnostic est une fonction de :

```text
scenario
cost_model
capital_state
edge_assumption
market_data_state
user_constraints
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

### 3.3 Capital

Future couche :

```text
reference_capital_eur
strategy_capital_eur
available_cash_eur
reserved_notional_eur
proposed_order_notional_eur
```

Contraintes minimales :

```text
available_cash_eur >= 0
reserved_notional_eur >= 0
proposed_order_notional_eur > 0
```

Sans levier modélisé :

```text
proposed_order_notional_eur <= available_cash_eur
```

Cette condition est nécessaire mais non suffisante si plusieurs positions ou ordres concurrents existent.

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

## 5. Hiérarchie de diagnostic

Le diagnostic doit être construit dans cet ordre :

1. validité des entrées ;
2. qualité des données ;
3. géométrie de friction ;
4. survie de l'avantage ;
5. faisabilité du capital ;
6. risque de coût d'exécution ;
7. contraintes utilisateur ;
8. explication et limites.

Une couche invalide ne doit pas contaminer les couches indépendantes, mais doit bloquer les conclusions qui en dépendent.

## 6. États analytiques

```text
compatible_under_assumptions
adjustment_required
structurally_non_viable
capital_not_feasible
execution_cost_risk
insufficient_data
invalid_input
```

### `compatible_under_assumptions`

Conditions nécessaires envisagées :

- données nécessaires `data_ready` ou aucune donnée externe requise ;
- avantage au-dessus du seuil selon le mode choisi ;
- capital faisable ;
- contraintes utilisateur satisfaites ;
- aucun risque d'exécution matériel non résolu dans le modèle.

Cet état ne signifie pas « bon trade » ou « exécuter ».

### `adjustment_required`

Une contrainte n'est pas satisfaite mais une frontière mathématique finie existe. L'interface explique la frontière sans recommander de la suivre.

### `structurally_non_viable`

Le scénario ne peut pas satisfaire la contrainte dans le modèle, notamment lorsque l'avantage est au niveau ou sous le plancher variable.

### `capital_not_feasible`

Une frontière ou taille proposée dépasse les ressources autorisées dans le modèle sans levier implicite.

### `execution_cost_risk`

Les hypothèses de spread, slippage, profondeur ou type d'ordre produisent un risque de coût non résolu. Aucun calcul de probabilité n'est implicite.

### `insufficient_data`

Les données requises sont manquantes, stale, conflictuelles ou non couvertes.

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

## 8. Temps et atomicité

Une analyse pré-trade est valide uniquement pour un snapshot identifié.

Toute modification d'une entrée ou mise à jour d'une donnée :

- invalide le diagnostic précédent ;
- exige un recalcul ;
- conserve la version et le timestamp du snapshot ;
- ne mélange pas des données de timestamps incompatibles sans signalement.

## 9. Scénarios minimaux futurs

- données complètes et scénario compatible ;
- avantage au seuil exact ;
- avantage sous plancher ;
- taille frontière supérieure au cash ;
- données stale ;
- devise incohérente ;
- place incorrecte ;
- spread manquant mais calculs de commission encore disponibles ;
- profondeur insuffisante ;
- ordre limite non exécuté : limite explicitée, aucune probabilité inventée ;
- plusieurs ordres concurrents pour le même cash ;
- capital modifié entre analyse et décision ;
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
```

Un changement de logique d'état, de tolérance, de source ou de domaine de validité impose une nouvelle version.

## 12. Interdictions

- aucune recommandation ;
- aucune exécution ;
- aucun ordre limite conseillé ;
- aucune probabilité d'exécution inventée ;
- aucun levier implicite ;
- aucune donnée stale cachée ;
- aucune conclusion sans provenance ;
- aucun feu vert ou rouge simpliste supprimant les explications ;
- aucune revendication de conformité ou précision générale non auditée.