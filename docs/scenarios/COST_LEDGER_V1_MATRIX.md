# Cost Ledger v1 — matrice de scénarios pré-code

## 1. Statut

- Date de gel initial : 16 juillet 2026.
- Nature : scénarios synthétiques et oracles indépendants.
- Autorité : `docs/standards/COST_LEDGER_CONTRACT.md`.
- Périmètre : compte cash EUR, achat long, action ou ETF au comptant.
- Exclusions : donnée réelle, impact de marché, probabilité d'exécution, recommandation et TCA ex post.

Cette matrice est écrite avant le moteur Cost Ledger. Une CI verte ne peut pas modifier les valeurs attendues sans amendement documenté.

## 2. Scénario de référence

```text
operation_scope = complete_round_trip
return_denominator = entry_notional = 500 EUR
exit_notional = 500 EUR uniquement par convention legacy

commission_per_side = 1 EUR
fx_rate_per_side = 0,0025
spread_total_rate = 0,001
execution_cost_assumption_total_rate = 0,001
```

Oracle indépendant :

```text
fixed = 2 × 1 = 2 EUR
proportional_rate = 2 × 0,0025 + 0,001 + 0,001 = 0,007
proportional_cost = 500 × 0,007 = 3,50 EUR
total = 2 + 3,50 = 5,50 EUR
break_even = 5,50 / 500 = 0,011 = 1,10 %
```

Les événements attendus par `legacy-four-costs-1` sont :

```text
legacy.commission.entry
legacy.commission.exit
legacy.fx.entry
legacy.fx.exit
legacy.spread.full_cycle
legacy.execution_cost.full_cycle
```

## 3. Scénarios numériques et de compatibilité

### CL-01 — aller-retour legacy complet

Attendus :

```text
coverage = complete_under_declared_policy
known_cost_floor.base = 5,50 EUR
total_cost.base = 5,50 EUR
fixed_cost.base = 2 EUR
proportional_cost.base = 3,50 EUR
variable_floor.base = 0,70 %
break_even.base = 1,10 %
```

`spreadTotalRate` et `slippageTotalRate` restent des hypothèses synthétiques sans benchmark de marché.

### CL-02 — jambe d'entrée legacy complète

```text
operation_scope = entry_leg
side_count = 1
```

Oracle :

```text
fixed = 1 EUR
proportional_rate = 0,0025 + 0,001 + 0,001 = 0,0045
proportional_cost = 2,25 EUR
total = 3,25 EUR
break_even = 0,65 %
```

La commission et le FX de sortie ne sont ni créés ni attendus.

### CL-03 — zéros explicites

Les quatre champs legacy valent zéro. Tous les événements attendus existent avec un paramètre nul.

Attendus : couverture satisfaite, total et seuil nuls, aucun `-0`, aucune composante absente.

### CL-04 — commission absente

`commissionPerSideEur` est absent ; les autres valeurs restent celles de référence.

Attendus :

```text
missing_events = legacy.commission.entry, legacy.commission.exit
coverage = partial_under_declared_policy
known_cost_floor.base = 3,50 EUR
total_cost = null
break_even = null
```

Le sous-total n'est jamais affiché comme coût complet.

### CL-05 — ordre des composants

Toute permutation des six composants de CL-01 conserve :

- le même `ledgerHash` ;
- les mêmes agrégats ;
- les mêmes problèmes triés ;
- la même couverture.

### CL-06 — parité avec la fondation existante

Pour une grille déterministe de nominaux, commissions, taux FX, spread, coût d'exécution et portées valides :

```text
ledger.totalCostEur.base = foundation.lifecycleFrictionEur
ledger.breakEvenGrossRate.base = foundation.breakEvenGrossRate
ledger.fixedCostEur.base = foundation.fixedCostEur
ledger.variableFloorRate.base = foundation.variableFloorRate
```

L'oracle manuel est vérifié séparément ; un moteur ne sert pas d'unique oracle à l'autre.

## 4. Identité, couverture et double comptage

### CL-07 — `componentId` dupliqué

Deux lignes portent le même `componentId`.

Attendus : entrée invalide, lignes non agrégées, aucun seuil complet.

### CL-08 — `economicEventId` dupliqué

Deux identifiants de composant différents représentent `legacy.commission.entry`.

Attendus : `duplicate_economic_event`, les deux représentations sont exclues du sous-total et la couverture reste partielle.

### CL-09 — événement attendu absent malgré déclaration complète

La politique annonce `declared_complete`, mais `legacy.spread.full_cycle` manque.

Attendus : rétrogradation vers `partial_under_declared_policy`, événement manquant visible, total et seuil complets indisponibles.

### CL-10 — politique partielle non promue

Tous les composants présents utilisent `coverage.declaration = declared_partial`.

Attendu : `partial_declared` même si l'arithmétique des lignes réussit.

### CL-11 — identité économique trompeuse non détectable

Deux sources attribuent deux `economicEventId` différents à ce qui est réellement le même coût.

Attendu contractuel : le moteur ne prétend pas résoudre ce cas par heuristique. La limite `economic_event_identity_source_dependent` reste publiée et une réconciliation de source est nécessaire.

## 5. Base, devise, portée et signe

### CL-12 — FX impossible dans la même devise

```text
account_currency = EUR
quote_currency = EUR
fx_rate > 0
```

Attendu : conflit `same_currency_fx_cost`, composante FX exclue, couverture partielle, aucun seuil complet.

### CL-13 — taux sans base

Un composant proportionnel référence une base absente.

Attendu : `missing_calculation_basis`, composant non calculé, aucune base inventée.

### CL-14 — devise non supportée

Un composant ou sa base est en USD.

Attendu : `unsupported_currency`, aucun taux FX implicite, résultats EUR dépendants indisponibles.

### CL-15 — côté incohérent

`lifecycleScope = entry` et `side = sell`, ou `full_cycle` et `side = buy`.

Attendu : `lifecycle_side_mismatch`.

### CL-16 — portée incohérente

Un ledger `entry_leg` contient un composant `exit` ou `full_cycle`.

Attendu : `operation_scope_component_mismatch` ; le composant n'est pas silencieusement ignoré.

### CL-17 — convention de signe non supportée

Une valeur négative ou une autre convention de signe est fournie.

Attendu : entrée invalide. Une amélioration signée relève de la future TCA.

## 6. Benchmark, inclusion et type de preuve

### CL-18 — benchmark absent pour spread

Le composant `spread_cost` n'a pas d'objet benchmark.

Attendu : `benchmark_required`, composant non calculé. Le moteur n'invente ni mid ni heure.

### CL-19 — hypothèse de coût d'exécution correctement qualifiée

Le composant utilise :

```text
category = execution_cost_assumption
benchmark.kind = user_assumption_without_market_benchmark
provenance = synthetic_demo
evidenceStatus = synthetic_demo
```

Attendu : montant calculable, mais aucune revendication de slippage observé, liquidité ou actualité.

### CL-20 — inclusion prix inconnue

`priceInclusion = unknown`, alors que `edgeInclusion = excluded`.

Attendus : coût économique brut calculable ; Edge Survival peut utiliser le coût si les autres dépendances sont satisfaites ; la vue cash dépendante est bloquée.

### CL-21 — inclusion dans l'avantage inconnue

`edgeInclusion = unknown`.

Attendus : coût brut calculable ; Edge Survival inéligible jusqu'à réconciliation ; aucune double déduction supposée.

### CL-22 — inclusion dans le cash source inconnue

`cashSourceInclusion = unknown` sur un événement d'entrée.

Attendus : coût brut calculable ; cash disponible dépendant inéligible.

### CL-23 — calculable mais non actuel

Une hypothèse utilisateur finie utilise `temporalStatus = time_not_assessed`.

Attendu : calcul arithmétique disponible avec `evidenceStatus = user_assumption_unverified` ; aucun statut `current` n'est dérivé.

### CL-24 — catégorie ou forme réservée

Un composant `market_impact` ou `nonlinear_model` apparaît.

Attendus : `not_assessed` ou `unsupported_component`, montant exclu, couverture partielle. Aucune loi de remplacement.

## 7. Enveloppe synthétique

### CL-25 — sensibilité basse, centrale et haute

Seul le taux de coût d'exécution varie :

```text
low = 0,0005
base = 0,001
high = 0,002
coverage = not_applicable
calibrated = false
```

Oracle :

```text
total.low = 5,25 EUR
total.base = 5,50 EUR
total.high = 6,00 EUR
break_even.low = 1,05 %
break_even.base = 1,10 %
break_even.high = 1,20 %
```

La sortie utilise « sensibilité », jamais « probabilité », « confiance » ou « pire cas statistique ».

### CL-26 — fourchette désordonnée

`low > base`, `base > high` ou `base` différent du paramètre central.

Attendu : `invalid_uncertainty_order` ou `uncertainty_base_mismatch` ; aucun tri silencieux.

### CL-27 — fausse couverture statistique

Une `sensitivity_range` fournit une couverture de 95 % ou `calibrated = true`.

Attendu : `sensitivity_cannot_claim_coverage`.

## 8. Propriétés quantitatives

### CL-28 — monotonie

À contexte constant, augmenter un coût non négatif calculable ne peut diminuer ni le sous-total, ni le total, ni le seuil correspondant.

### CL-29 — géométrie de taille legacy

Avec la composition de référence :

```text
N = 250 EUR  -> total = 3,75 EUR -> seuil = 1,50 %
N = 500 EUR  -> total = 5,50 EUR -> seuil = 1,10 %
N = 1 000 EUR -> total = 9,00 EUR -> seuil = 0,90 %
```

Le plancher variable reste 0,70 %. Cette propriété n'est publiée que parce que chaque coût proportionnel déclare une relation d'échelle avec le dénominateur.

### CL-30 — hash et mutation

L'ordre des clés et des composants n'affecte pas `ledgerHash`. Toute mutation économique d'un montant, taux, base, devise, inclusion, provenance, incertitude, événement attendu ou version change le hash.

### CL-31 — nombres finis

`NaN`, `Infinity`, `-Infinity` et `-0` sont refusés ou normalisés conformément au contrat ; aucun ne peut apparaître dans la sortie.

## 9. Scénarios rétrospectifs issus de la revue hostile

Ces scénarios ont été gelés après la première implémentation et avant de considérer leurs corrections comme validées. Ils ne sont pas présentés comme pré-code historique.

### CL-32 — dénominateur non réconcilié

La clé de `returnDenominator` est inconnue, absente de `basisValues`, ou son montant diffère de la base correspondante.

Attendus : `unsupported_return_denominator_basis`, `missing_return_denominator_basis` ou `return_denominator_basis_mismatch` ; aucun total qualifié de complet, aucun seuil et aucun plancher variable publiés. Le cas fixe seul est couvert pour empêcher qu'une absence de composant proportionnel masque le conflit.

### CL-33 — dépendance déclarée mais sans sémantique

Un composant fixe ou proportionnel fournit une liste `dependencies` non vide.

Attendu : `dependency_semantics_unsupported_in_v1`, composant invalide et aucun seuil complet. V1 ne prétend ni propager ni résoudre cette dépendance.

### CL-34 — inclusion dans l'avantage déclarée non applicable

Un composant de coût calculable utilise `edgeInclusion = not_applicable`.

Attendu : `edge_inclusion_required_for_cost_component`, composant invalide et Edge Survival inéligible. L'état n'est jamais assimilé à `excluded`.

### CL-35 — qualification du plancher et des sensibilités

Sur CL-01, la valeur numérique du plancher variable reste `0,70 %`, mais la sortie la qualifie `algebraic_under_declared_scaling_without_size_domain` et conserve les limites :

```text
known_floor_requires_nonnegative_cost_ontology
component_sensitivities_co_moved_without_joint_model
scaling_domain_not_assessed
```

Aucune de ces limites ne modifie l'oracle legacy ; elles empêchent son extrapolation commerciale ou quantitative.

## 10. Condition de réussite de la tranche

La tranche Cost Ledger v1 n'est techniquement réussie que si :

- chaque scénario automatisable ci-dessus possède un test ;
- CL-01, CL-02, CL-06, CL-25 et CL-29 utilisent aussi un oracle indépendant ;
- les résultats historiques restent identiques dans le domaine legacy ;
- une sortie partielle ne possède jamais de faux seuil complet ;
- les limites non automatisables de CL-11 restent visibles ;
- la CI du head distant exact réussit et ses logs sont inspectés.

Cette réussite resterait une validation technique synthétique. Elle ne rouvrirait pas la cohorte et ne validerait ni données, ni marché, ni conformité, ni utilité réelle.
