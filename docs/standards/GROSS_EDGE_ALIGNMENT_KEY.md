# Breaktest — clé d'alignement de l'avantage brut

## 1. Objet

Une valeur d'avantage brut peut être mathématiquement valide et néanmoins incompatible avec le scénario Cost Gate.

Ce contrat formalise la clé d'alignement qui doit correspondre avant de confronter `G` aux frictions d'un trade envisagé.

Il complète `GROSS_EDGE_INPUT_CONTRACT.md`.

## 2. Clé canonique

Toute valeur ponctuelle ou fourchette possède :

```text
gross_edge_alignment_key = {
  instrument_scope,
  venue_scope,
  direction,
  operation_scope,
  entry_rule_id,
  exit_rule_id,
  signal_timing,
  holding_horizon_definition,
  return_denominator,
  price_basis,
  currency_basis,
  fx_treatment,
  gross_or_net_basis,
  cost_exclusions,
  estimator,
  sample_start,
  sample_end,
  observation_count,
  strategy_rule_version
}
```

## 3. Champs

### Instrument et place

```text
instrument_scope = exact_instrument | declared_universe | unsupported
venue_scope = exact_venue | consolidated_venues | not_venue_sensitive | unsupported
```

Une valeur estimée sur un autre instrument n'est pas automatiquement transférable.

Une agrégation d'univers exige une justification et une provenance. Elle ne devient pas un avantage spécifique à l'instrument.

### Direction

```text
direction = long | short | both_with_declared_method
```

Le périmètre initial Cost Gate supporte `long` uniquement.

### Portée de l'opération

```text
operation_scope = entry_leg | exit_leg | complete_round_trip
```

Les coûts et `G` doivent couvrir la même portée.

### Règles d'entrée et de sortie

L'avantage appartient à une méthode définie, pas au ticker seul.

Conserver :

```text
entry_rule_id
exit_rule_id
signal_timing
holding_period_start
holding_period_end
```

Un changement de règle invalide l'alignement jusqu'à nouvelle estimation.

### Horizon

```text
holding_horizon_definition =
  fixed_duration
  event_to_event
  signal_to_exit
  same_session
  user_defined
```

Un rendement annuel, mensuel ou journalier ne remplace pas silencieusement un rendement par opération complète.

### Dénominateur

```text
return_denominator =
  entry_notional
  average_committed_capital
  maximum_committed_capital
  portfolio_equity
```

Le moteur actuel exige `entry_notional` ou une transformation explicitement démontrée.

### Base de prix

```text
price_basis =
  frictionless_mid_to_mid
  reference_mid_to_mid
  observed_execution_to_execution
  contractual_price
  other_documented
```

Pour une analyse où spread et slippage sont soustraits séparément, la base brute doit être compatible avec une performance avant ces frictions.

Une performance calculée depuis des prix d'exécution observés peut déjà contenir spread et slippage. Elle ne peut pas être qualifiée de brute sans reconstitution.

### Devise

```text
currency_basis = instrument_currency | account_currency | base_currency
fx_treatment = excluded | included | separately_reconciled
```

Si le change est déjà inclus dans `G`, il ne peut pas être soustrait une seconde fois.

### Brut ou net

```text
gross_or_net_basis = gross_before_all_modelled_costs | partially_net | net
```

Seul `gross_before_all_modelled_costs` est directement compatible.

`partially_net` exige la liste exacte des coûts déjà inclus et une réconciliation sans double comptage.

### Estimateur et période

Conserver :

```text
estimator = trade_equal_weighted_mean | capital_weighted_rate | other_documented
sample_start
sample_end
observation_count
regime_notes
```

Breaktest ne choisit pas silencieusement l'estimateur.

## 4. Comparaison des clés

Chaque champ reçoit :

```text
aligned
not_applicable
missing
conflicted
unsupported
mismatched
```

État agrégé :

```text
edge_aligned
edge_alignment_incomplete
edge_alignment_conflicted
edge_misaligned
edge_scope_unsupported
```

Seul `edge_aligned` autorise une conclusion Edge Survival dépendante de `G`.

`edge_aligned` exige que chaque champ obligatoire soit `aligned` ou explicitement `not_applicable`. Un champ `missing`, `conflicted`, `unsupported` ou `mismatched` empêche cette conclusion.

Le seuil de couverture reste calculable sans `G` si ses propres entrées sont valides. La clé rejetée reste visible avec les champs précis en cause.

## 5. Transformations autorisées

Une transformation n'est permise que si :

- formule documentée ;
- source et destination de chaque champ de la clé publiées ;
- unités compatibles ;
- hypothèses visibles ;
- provenance conservée ;
- aucune composante de coût comptée deux fois ;
- réconciliation explicite de toute performance `partially_net` ;
- test indépendant ;
- version de transformation.

Exemple : convertir une somme de PnL bruts en taux capital-pondéré peut être valide si les notionnels sont présents et positifs.

## 6. Transformations interdites silencieusement

- CAGR vers rendement par trade ;
- taux de réussite vers espérance ;
- gain moyen des gagnants vers moyenne globale ;
- Sharpe vers rendement ;
- alpha vers PnL de l'opération ;
- net observé vers brut sans coûts détaillés ;
- performance portefeuille vers instrument unique ;
- short vers long ;
- horizon journalier vers aller-retour multi-jour ;
- prix exécutés vers brut frictionless sans reconstitution ;
- moyenne d'univers vers instrument exact sans méthode de transfert ;
- période ou estimateur absent comblé par défaut.

## 7. Fourchette

Les trois valeurs basse, centrale et haute partagent la même clé d'alignement.

Une borne provenant d'une autre méthode ou période rend la fourchette conflictuelle, sauf construction documentée comme analyse de sensibilité utilisateur.

Dans une fourchette purement saisie :

```text
provenance = user_assumption
alignment_basis = user_declared
```

Elle reste non vérifiée.

## 8. Messages

### Aligné

> L'hypothèse brute est définie sur la même opération, le même dénominateur et la même base de coûts que le scénario affiché.

### Incomplet

> La base de l'hypothèse brute n'est pas suffisamment décrite pour la confronter aux frictions sans risque de double comptage.

### Mal aligné

> L'hypothèse brute utilise un autre horizon, dénominateur, instrument ou traitement des coûts. Edge Survival n'est pas calculé à partir de cette valeur.

Aucun message ne suggère une valeur de remplacement.

## 9. Tests requis

- clé exactement alignée ;
- autre instrument ;
- autre place ;
- long contre short ;
- achat simple contre aller-retour ;
- autre horizon ;
- CAGR ;
- net déjà diminué des commissions ;
- spread déjà inclus ;
- change déjà inclus ;
- dénominateur portefeuille ;
- estimateur ou période absent ;
- quantité/prix/nominal incompatible avec le dénominateur ;
- fourchette avec clés différentes ;
- transformation documentée ;
- seuil encore disponible malgré `G` rejeté ;
- aucune valeur de remplacement inventée.

## 10. Statut

La clé complète est implémentée dans le moteur synthétique et couverte notamment par CG-02 et CG-11. Un statut déclaré `edge_aligned` ne contourne pas une incompatibilité réelle de la clé.

Aucune dérivation automatique d'avantage brut n'est autorisée. Toute nouvelle source, transformation ou agrégation exige une provenance et une validation distinctes.
