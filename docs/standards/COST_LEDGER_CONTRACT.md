# Breaktest — contrat Cost Ledger v1

## 1. Objet

Le Cost Ledger v1 représente chaque friction comme un événement économique identifiable, une méthode de calcul et un dossier de preuve.

Il remplace, dans le futur moteur vNext, l'hypothèse selon laquelle toute friction peut être décrite durablement par quatre scalaires. Il conserve un adaptateur de compatibilité pour les résultats déjà validés.

Ce contrat ne fournit aucune donnée actuelle, ne choisit aucun trade et n'autorise aucun modèle de market impact.

## 2. Principes non négociables

1. Une valeur absente n'est jamais zéro.
2. Un sous-total connu n'est jamais présenté comme coût complet.
3. Une liste de composants ne prouve pas seule sa propre complétude.
4. Une hypothèse calculable n'est pas pour autant une donnée actuelle ou fiable.
5. Un événement économique ne peut être retranché deux fois.
6. Une fourchette de sensibilité n'est ni une distribution ni un intervalle de confiance.
7. Un coût ex ante et une mesure ex post restent dans des contrats séparés.
8. Une forme non supportée reste non évaluée.

## 3. Version, domaine et schéma racine

Le wire format initial utilise les clés `camelCase` suivantes :

```text
costLedger = {
  schemaVersion,
  ledgerId,
  operationScope,
  accountCurrency,
  quoteCurrency,
  returnDenominator,
  basisValues,
  coverage,
  components
}

schemaVersion = cost-ledger-1
operationScope = entry_leg | complete_round_trip
accountCurrency = EUR
```

Le domaine initial reste :

```text
account_model = cash_account
position_model = long_cash_purchase
instrument_type = spot_equity | spot_etf
```

Ces trois limites restent contrôlées par la fondation Cost Gate. Toute autre devise de compte ou portée retourne un état explicite `unsupported_scope`.

Les clés inconnues sont refusées dans v1. Une extension future devra être placée dans un espace explicitement versionné avant d'être acceptée.

## 4. Contexte de calcul

```text
returnDenominator = {
  basis,
  amount,
  currency
}

basisValues = {
  entry_notional: { amount, currency },
  exit_notional: { amount, currency },
  entry_asset_consideration: { amount, currency }
}
```

Seules les bases réellement disponibles sont présentes. Un composant proportionnel référence une clé existante ; le moteur ne choisit jamais `entry_notional` par défaut.

Le taux interne est décimal, fini et non négatif. Son dénominateur est donc nommé par `calculationBasis`.

Le premier moteur n'effectue aucune conversion de devise. Un montant ou une base qui n'est pas en EUR reste `unsupported_currency`. Le coût de change lui-même peut être exprimé comme un coût en EUR ; cela ne constitue pas une conversion implicite du ledger.

## 5. Complétude déclarée

Une collection de composants ne permet pas de savoir si une commission, une taxe ou un coût d'exécution a été oublié. Le ledger exige donc :

```text
coverage = {
  declaration,
  policyId,
  expectedEconomicEventIds,
  notApplicableCategories,
  limitations
}

declaration = declared_complete | declared_partial | unknown
```

Règles :

- `expectedEconomicEventIds` est un ensemble d'identifiants uniques défini par une politique nommée ;
- `declared_complete` n'est accepté comme calcul complet que si chaque événement attendu possède exactement un composant calculable et non conflictuel ;
- une composante attendue absente ou non évaluée rétrograde le résultat vers `partial_under_declared_policy` ;
- `declared_partial` ou `unknown` ne sont jamais promus silencieusement ;
- `notApplicableCategories` ne vaut preuve que dans le périmètre du `policyId` ;
- la sortie dit toujours `complete_under_declared_policy`, jamais simplement « complet ».

Cette déclaration reste une assertion de la source. Elle ne prouve pas qu'une politique a recensé tous les coûts possibles du monde réel.

## 6. Composant canonique

```text
costComponent = {
  componentId,
  economicEventId,
  category,
  lifecycleScope,
  side,
  calculationKind,
  calculationBasis,
  parameters,
  amountCurrency,
  signConvention,
  notionalScaling,
  benchmark,
  priceInclusion,
  edgeInclusion,
  cashSourceInclusion,
  provenance,
  sourceId,
  temporalStatus,
  observedAtUtc,
  validUntilUtc,
  uncertainty,
  modelVersion,
  dependencies,
  inputStatus,
  evidenceStatus,
  limitations
}
```

`inputStatus` décrit ce qui a été fourni :

```text
provided | not_assessed | unsupported_component
```

Le moteur dérive séparément un `calculationStatus` ; l'appelant ne peut pas s'auto-déclarer valide.

## 7. Identité et double comptage

`componentId` identifie la représentation. `economicEventId` identifie le fait économique sous-jacent.

Exemple : la commission d'achat et la commission de vente sont deux événements distincts. La même commission d'achat copiée dans deux lignes conserve le même `economicEventId` et devient conflictuelle.

Règles :

- les deux identifiants sont des chaînes stables, non vides ;
- deux `componentId` identiques sont invalides ;
- deux composants partageant un `economicEventId` sont exclus de l'agrégat et produisent `duplicate_economic_event` ;
- un identifiant attendu absent rend la couverture partielle ;
- le moteur ne prétend pas détecter deux coûts identiques auxquels une source aurait attribué à tort deux identifiants économiques différents ; ce risque exige réconciliation de source et revue.

## 8. Catégories

Catégories calculables dans le domaine initial :

```text
commission
fx_cost
spread_cost
execution_cost_assumption
entry_contractual_fee
entry_tax
```

Catégories réservées mais non calculées dans v1 :

```text
venue_fee
clearing_or_settlement_fee
market_impact
delay_cost
opportunity_cost
financing_or_borrow_cost
other_contractual_cost
```

Une catégorie réservée retourne `not_assessed` ou `unsupported_component`. Elle n'est jamais absorbée dans `execution_cost_assumption`.

## 9. Portée et côté

```text
lifecycleScope = entry | exit | full_cycle
side = buy | sell | both | not_applicable
```

Règles initiales :

- `entry` correspond à `buy` ;
- `exit` correspond à `sell` ;
- `full_cycle` correspond à `both` ;
- `entry_leg` refuse les composants de sortie ou de cycle complet ;
- `complete_round_trip` accepte entrée, sortie et cycle complet ;
- un coût asymétrique ne peut pas être créé par multiplication automatique ;
- un frais de sortie futur appartient au coût économique du cycle, mais pas au cash immédiat d'entrée.

## 10. Forme de calcul

Formes calculables dans la première tranche :

```text
fixed
proportional
```

Formes réservées :

```text
externally_supplied_amount
minimum_or_maximum
tiered
piecewise
nonlinear_model
observed_difference
```

### 10.1 Fixe

```text
calculationKind = fixed
calculationBasis = not_applicable
parameters = { amount }
notionalScaling = fixed_wrt_return_denominator
```

### 10.2 Proportionnel

```text
calculationKind = proportional
parameters = { rate }
calculationBasis = une clé existante de basisValues
notionalScaling = proportional_to_return_denominator | proportional_to_other_basis
```

`proportional_to_return_denominator` n'est accepté que si la base et le dénominateur ont la même devise et une relation unitaire prouvée dans le contexte initial. Sinon le moteur calcule le montant du scénario, mais ne publie pas de plancher structurel.

Une forme réservée ne devient pas un montant fixe par commodité.

## 11. Benchmark

```text
benchmark = {
  kind,
  price,
  currency,
  observedAtUtc,
  sourceId,
  status
}
```

Kinds prévus :

```text
not_applicable
user_assumption_without_market_benchmark
decision_price
arrival_mid
submission_mid
quoted_bid_or_ask
vwap
closing_price
other_documented
```

Une commission fixe utilise `not_applicable`. Dans l'adaptateur legacy, `spreadTotalRate` et `slippageTotalRate` utilisent `user_assumption_without_market_benchmark` : ce sont des hypothèses de coût, pas un spread ou un slippage observé.

Un prix, une heure ou une source ne sont jamais inventés pour rendre le benchmark complet.

## 12. Convention de signe

Convention v1 :

```text
signConvention = positive_cost_is_adverse_to_investor
```

Les paramètres sont non négatifs. Une amélioration de prix signée par rapport à un benchmark appartient à une future TCA et à un contrat distinct.

Cette restriction rend le sous-total connu mathématiquement inférieur ou égal au total des composants non négatifs encore inconnus. Le produit l'appelle néanmoins `knownCostFloor` seulement avec la limite de couverture affichée.

## 13. Matrice d'inclusion

```text
priceInclusion = included | excluded | not_applicable | unknown
edgeInclusion = included | excluded | not_applicable | unknown
cashSourceInclusion = included | excluded | not_applicable | unknown
```

Les axes ont des sens distincts :

- `priceInclusion` : le coût est-il déjà incorporé au prix ou à la contrepartie de référence utilisée pour le cash ?
- `edgeInclusion` : le coût est-il déjà retranché dans l'avantage `G` fourni ?
- `cashSourceInclusion` : le coût est-il déjà retranché du cash publié par la source ?

Le ledger brut peut calculer un montant malgré un axe `unknown`. En revanche :

- `priceInclusion = unknown` bloque la vue cash dépendante ;
- `edgeInclusion = unknown` bloque Edge Survival ;
- `cashSourceInclusion = unknown` bloque le cash disponible dépendant ;
- `included` exige une réconciliation avant toute nouvelle déduction.

Une inconnue ne bloque donc jamais une conclusion indépendante.

## 14. Provenance, preuve et temps

```text
provenance =
  contractual_user_input
  | user_assumption
  | synthetic_demo
  | historical_observation
  | external_source
  | model_estimate
```

`sourceId` est toujours non vide. Les trois dernières provenances restent réservées dans l'implémentation initiale.

La qualité de preuve est distincte de la calculabilité :

```text
evidenceStatus =
  contractual_input_unverified
  | user_assumption_unverified
  | synthetic_demo
  | historical_observation_unverified
  | external_source_pending_quality_gate
  | model_estimate_pending_validation
```

Temps :

```text
temporalStatus =
  not_time_sensitive
  | as_of_snapshot
  | current_until
  | time_not_assessed
  | stale
  | future_timestamp
```

Une composante peut être arithmétiquement calculable avec `time_not_assessed`, mais aucune revendication d'actualité n'en découle. `as_of_snapshot` exige `observedAtUtc`. `current_until` exige aussi `validUntilUtc`. Une observation future est invalide pour les résultats dépendants.

`model_estimate` exige modèle, paramètres, domaine, calibration et preuve hors échantillon. Cette provenance n'est pas calculable dans v1.

## 15. Incertitude

```text
uncertainty = {
  kind,
  appliesTo,
  low,
  base,
  high,
  unit,
  method,
  coverage,
  calibrated,
  limitations
}

kind = none_contractual | point_assumption | sensitivity_range
```

Règles :

- `appliesTo` nomme `parameters.amount` ou `parameters.rate` ;
- `base` égale le paramètre fourni ;
- `low <= base <= high` et les trois valeurs sont finies et non négatives ;
- `none_contractual` et `point_assumption` ont trois valeurs égales ;
- `sensitivity_range` utilise `coverage = not_applicable` et `calibrated = false` ;
- une couverture probabiliste non démontrée est refusée ;
- les agrégats `low`, `base`, `high` sont des scénarios coordonnés, pas des quantiles.

Les kinds statistiques restent réservés à une version future.

## 16. Agrégation et sorties

Pour chaque scénario `s = low | base | high`, le moteur calcule les seuls composants calculables, applicables, non dupliqués et en EUR :

```text
knownCostSubtotalEur(s) = somme des montants calculables
knownCostFloorEur(s) = knownCostSubtotalEur(s), sous convention de coûts non négatifs
```

Seulement sous `complete_under_declared_policy` :

```text
totalCostEur(s) = knownCostSubtotalEur(s)
breakEvenGrossRate(s) = totalCostEur(s) / returnDenominator.amount
```

Le résultat publie aussi :

- composants inclus, exclus et non évalués ;
- événements attendus manquants ;
- conflits et erreurs ;
- décomposition fixe et proportionnelle ;
- plancher variable uniquement lorsque son comportement d'échelle est prouvé ;
- statut de couverture et ses limites ;
- formule, version et `ledgerHash`.

Une sortie partielle ne publie pas de seuil complet.

## 17. Adaptateur legacy

L'entrée actuelle est transformée ainsi :

```text
commissionPerSideEur -> un événement fixe distinct par côté applicable
fxRatePerSide -> un événement proportionnel distinct par côté applicable
spreadTotalRate -> un événement proportionnel sur la portée déclarée
slippageTotalRate -> execution_cost_assumption sur la portée déclarée
```

Pour `complete_round_trip`, le nominal de sortie reste égal au nominal d'entrée uniquement pour reproduire exactement la convention historique. Cette hypothèse est nommée `legacy_constant_notional` ; elle ne devient pas une règle générale.

La politique `legacy-four-costs-1` attend tous les événements correspondant à la portée. Une valeur zéro crée un composant explicite. Une valeur absente laisse l'événement attendu manquant.

Les taxes et frais contractuels d'entrée ne sont pas déclarés `not_applicable` par défaut. Ils restent hors de la politique legacy avec une limite visible ; une valeur cash non nulle les transforme en événements attendus mais manquants, afin de conserver l'incomplétude démontrée par la fondation actuelle.

L'adaptateur conserve exactement la valeur économique legacy. Il ne qualifie plus `spreadTotalRate` ou `slippageTotalRate` de mesure observée.

## 18. Tests obligatoires

- parité legacy point et fourchette sur entrée et aller-retour ;
- parité des sous-totaux lorsque des composantes legacy manquent ;
- commission et taux nuls explicites ;
- déclaration complète distincte de la complétude réellement satisfaite ;
- ordre des composants sans effet ;
- doublon de `componentId` ;
- doublon de `economicEventId` ;
- événement attendu absent ;
- même devise avec FX non nul ;
- portée ou côté incohérent ;
- devise manquante ou non supportée ;
- taux sans base ;
- benchmark absent pour spread ou coût d'exécution ;
- inclusion dans le prix, l'avantage et le cash traitée séparément ;
- catégorie et forme réservées non évaluées ;
- enveloppe basse, centrale et haute ordonnée et non probabiliste ;
- mutation changeant `ledgerHash` ;
- aucun nombre non fini ni `-0` ;
- oracle indépendant et propriétés de monotonie.

## 19. Limites honnêtes de v1

Le contrat ne démontre pas encore :

- qu'une politique de couverture contient tous les coûts réels ;
- que deux sources ont correctement attribué leurs `economicEventId` ;
- qu'une hypothèse de spread ou d'exécution est réaliste ;
- qu'une fourchette couvre une fréquence statistique donnée ;
- qu'un coût reste stable avec la taille ou dans le temps ;
- qu'une donnée externe est fraîche, licenciée ou complète ;
- qu'un ordre sera exécuté.

Ces limites restent visibles même lorsque l'arithmétique réussit.
