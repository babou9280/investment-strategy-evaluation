# Breaktest Cost Gate — matrice synthétique de fondation

## 1. Rôle

Cette matrice définit les oracles indépendants exécutés par le moteur synthétique Cost Gate. Elle n'utilise aucune donnée réelle et n'autorise aucune implémentation externe.

Chaque scénario doit produire plusieurs constats indépendants plutôt qu'un verdict simpliste.

## 2. Conventions communes

Sauf indication contraire :

```text
account_model = cash_account
position = long_cash_purchase
account_currency = EUR
quote_currency = USD
provenance = synthetic_demo
order_notional = 500 EUR
order_quantity = 5
reference_price_in_account_currency = 100 EUR
side_count = 2
commission = 1 EUR par côté
fx = 0,25 % par côté
spread total = 0,10 %
slippage total = 0,10 %
fixed_cost = 2 EUR
variable_floor = 0,70 %
total_cost = 5,50 EUR
break_even = 1,10 %
```

Le nominal est économique pour le cycle. Le cash immédiat n'est dérivé que dans les scénarios qui définissent explicitement sa base.

Lorsque la faisabilité du capital est évaluée, le scénario fournit aussi une allocation de stratégie et son capital déjà engagé. Le cash total du compte n'est jamais supposé entièrement disponible pour la stratégie.

Toute conclusion Edge Survival dépendante de `G` exige une clé d'alignement `edge_aligned` selon `GROSS_EDGE_ALIGNMENT_KEY.md`.

## 3. Scénarios

### CG-01 — seuil seul, aucune hypothèse brute

Entrées : coûts complets, aucun `G`, aucune donnée externe.

Attendus :

```text
friction_geometry = satisfied/calculable
break_even = 1,10 %
edge_survival = not_assessed
capital_feasibility = not_assessed
summary != no_incompatibility_detected_under_assumptions
```

Phrase principale : seuil de couverture, sans conclusion sur l'avantage.

### CG-02 — avantage positif et cash suffisant

Entrées :

```text
G = 2,00 %
gross_edge_alignment_state = edge_aligned
notional_basis = expected_execution_consideration
entry_asset_consideration = 500 EUR
spread_reference_price_status = included
slippage_reference_price_status = included
entry_commission = 1 EUR
entry_fx_cash_cost = 1,25 EUR
entry_cash_requirement = 502,25 EUR

available_settled_cash = 1 000 EUR
available_settled_cash_basis = gross_before_declared_holds
source_included_hold_ids = []
cash_hold_ledger = []
user_defined_cash_reserve = 0 EUR
strategy_capital = 1 000 EUR
strategy_capital_committed = 0 EUR
capital_feasibility_cash = 1 000 EUR
snapshot = manual_assumptions_only
```

La devise de cotation synthétique USD explique le coût de change vers le compte EUR. Une cotation EUR avec ces mêmes coûts FX est conflictuelle.

Attendus :

```text
net_edge = 0,90 %
edge_retention = 45 %
edge_survival = satisfied
capital_feasibility = satisfied
external_market_data = not_assessed
summary = no_incompatibility_detected_under_assumptions
```

La synthèse précise que la liquidité réelle, l'actualité de marché et l'exécution ne sont pas évaluées.
### CG-03 — exact seuil

Entrées :

```text
G = 1,10 %
```

Attendus :

```text
net_edge = 0
edge_survival = breached
finding_code = no_strictly_positive_margin
```

Phrase : les frictions sont couvertes, mais aucune marge positive n'existe.

### CG-04 — sous le plancher variable

Entrées :

```text
G = 0,60 %
variable_floor = 0,70 %
```

Attendus :

```text
edge_survival = structurally_unreachable
minimum_order_for_positive_net = unavailable
```

Aucune taille finie n'est proposée.

### CG-05 — avantage survivant, capital insuffisant

Entrées :

```text
G = 2,00 %
gross_edge_alignment_state = edge_aligned
capital_feasibility_cash = 400 EUR
entry_cash_requirement = 502,25 EUR
```

Attendus :

```text
edge_survival = satisfied
capital_feasibility = breached
summary = capital_not_feasible
```

Les deux constats restent visibles. Aucun dépôt, levier ou redimensionnement automatique n'est proposé.
### CG-06 — coût du cycle distinct du cash immédiat

Entrées :

```text
operation_scope = complete_round_trip
notional_basis = expected_execution_consideration
entry_asset_consideration = 500 EUR
spread_reference_price_status = included
slippage_reference_price_status = included

entry_commission = 1 EUR
entry_fx_cash_cost = 1,25 EUR
future_exit_commission = 1 EUR
future_exit_fx_cost = 1,25 EUR
lifecycle_embedded_spread_slippage = 1 EUR
lifecycle_friction = 5,50 EUR
```

Attendus :

```text
entry_cash_requirement = 502,25 EUR
future_exit_explicit_fees = 2,25 EUR
lifecycle_friction = 5,50 EUR
```

Le prix attendu de l'actif contient déjà les effets de prix déclarés à l'entrée : spread et slippage ne sont donc pas ajoutés comme lignes de cash. Ils restent dans la mesure économique du cycle parce que `G` est défini avant toutes les frictions modélisées.

Les frais de sortie futurs ne sont pas ajoutés au cash immédiat. L'oracle doit détecter `505,50 EUR`, `505 EUR` ou toute autre somme qui réintroduit des coûts futurs ou incorporés sans base explicite.
### CG-07 — spread déjà incorporé au prix ask

Entrées :

```text
notional_basis = reference_ask_price
spread_reference_price_status = included
slippage_reference_price_status = excluded
```

Attendus :

- le spread peut rester dans l'analyse économique si `G` utilise une base avant spread ;
- il n'est pas ajouté une deuxième fois à l'engagement cash ;
- le slippage n'est ajouté au cash que si sa méthode et sa base le justifient ;
- aucune double soustraction.
### CG-08 — base de nominal conflictuelle

Entrées :

```text
notional_basis = reference_ask_price
spread_reference_price_status = unknown
```

Attendus :

```text
capital_feasibility = conflicted
finding_code = cash_basis_conflicted
```

`unknown` n'est pas transformé en `false`. Les calculs de coût indépendants restent disponibles.
### CG-09 — quote synthétique stale

Entrées : quote `synthetic_demo` expirée ; commissions contractuelles synthétiques encore valides.

Attendus :

```text
data_quality.quote = stale
commission_cost = calculable
complete_execution_cost = insufficient_data
snapshot = snapshot_expired
summary = snapshot_unusable
```

Cette quote sert uniquement à falsifier la politique de fraîcheur. Elle n'est ni réelle ni externe. Elle n'est jamais remplacée par zéro ni qualifiée d'actuelle.

Régressions temporelles associées : une source observée après `evaluated_at_utc` produit `snapshot_temporally_inconsistent` et `synthetic_source_observed_after_evaluation`. Une source non critique expirée garde son propre constat stale, mais ne raccourcit pas l'expiration agrégée portée par les sources critiques.
### CG-10 — conflit instrument / place / devise

Entrées : coût contractuel pour un instrument ou une place différents du scénario.

Attendus :

```text
data_quality = conflicted
finding_code = instrument_venue_currency_mismatch
```

Aucun coût total n'est calculé depuis la source conflictuelle.

### CG-11 — avantage brut mal aligné

Entrées :

- coûts pour un aller-retour long sur une action EUR ;
- `G` provenant d'un rendement annuel de portefeuille, d'un autre instrument, d'un autre dénominateur ou de prix d'exécution déjà nets de spread/slippage.

Attendus :

```text
gross_edge_alignment_state = edge_misaligned
edge_survival = not_assessed
finding_code = gross_edge_basis_mismatch
```

L'instrument, la place, la direction, la portée, l'horizon, le dénominateur, la base de prix, la devise, les coûts déjà inclus, l'estimateur, la période et la version de règle sont comparés. Aucun fallback depuis CAGR, taux de réussite, alpha ou performance déjà nette.
### CG-12 — plusieurs violations simultanées

Entrées indépendantes :

- donnée synthétique d'exécution stale, sans effet sur le barème manuel déjà utilisé par la géométrie de friction ;
- cash de stratégie insuffisant ;
- `G` aligné au niveau ou sous le plancher manuel.

Attendus :

```text
execution_data = insufficient_data
capital_feasibility = breached
edge_survival = structurally_unreachable
summary = structurally_non_viable
```

Les trois constats restent actifs. L'impossibilité structurelle démontrée n'est pas masquée par une donnée manquante dans une autre couche. Si le plancher dépendait lui-même de la donnée stale, le constat structurel resterait `insufficient_data` au lieu d'être inventé.

Aucun constat n'est supprimé et aucune phrase « trade refusé » n'est affichée.
### CG-13 — snapshot invalidé par changement de taille

Après calcul, `order_notional` passe de 500 à 600 EUR.

Attendus :

```text
old_snapshot = obsolete
old_findings = inactive
recalculation_required = true
```

### CG-14 — holds et allocation de stratégie

Cas A — source brute avant holds :

```text
available_settled_cash = 1 000 EUR
available_settled_cash_basis = gross_before_declared_holds
source_included_hold_ids = []
pending hold H1 = 600 EUR, included_by_source = false
cash_reserve = 100 EUR
strategy_capital = 1 000 EUR
strategy_capital_committed = 0 EUR
entry_cash_requirement = 400 EUR
```

Attendus :

```text
account_free_settled_cash = 300 EUR
capital_feasibility_cash = 300 EUR
capital_feasibility = breached
```

Cas B — la source publie déjà 400 EUR nets de H1 :

```text
available_settled_cash = 400 EUR
available_settled_cash_basis = net_of_listed_holds
source_included_hold_ids = [H1]
cash_reserve = 100 EUR
```

Attendu : `H1` n'est pas soustrait une seconde fois ; le cash réconcilié reste 300 EUR.

Cas de conflit — base brute mais H1 déclaré inclus, ou désaccord entre `source_included_hold_ids` et le ledger :

```text
capital_feasibility = conflicted
finding_code = cash_basis_conflicted
summary != no_incompatibility_detected_under_assumptions
```

Une réserve utilisateur déjà retranchée par la source est également conflictuelle, car la fondation applique cette réserve après normalisation du cash source.

Cas C — le compte dispose de 1 000 EUR, mais la stratégie n'a plus que 350 EUR d'allocation libre :

```text
account_free_settled_cash = 1 000 EUR
strategy_capital = 450 EUR
strategy_capital_committed = 100 EUR
entry_cash_requirement = 400 EUR
```

Attendus :

```text
strategy_allocation_headroom = 350 EUR
capital_feasibility_cash = 350 EUR
capital_feasibility = breached
```

Le solde brut du compte ne peut jamais contourner un hold déjà identifié ni l'allocation de stratégie déclarée.
### CG-15 — modèle non supporté

Entrées : option, vente à découvert ou compte sur marge.

Attendus :

```text
capital_model = unsupported
```

Le produit ne simule pas silencieusement un achat cash.

### CG-16 — contrainte utilisateur exactement atteinte

Entrée : friction annuelle égale à la limite explicitement saisie.

Attendus :

- statut déterminé par convention documentée ;
- égalité non classée comme dépassement si la contrainte est `<=` ;
- texte exact et unité visibles.

### CG-17 — donnée manquante mais sous-calcul utile

Entrées : spread absent, commission et change présents.

Attendus :

- composantes connues affichées ;
- total complet indisponible ;
- seuil complet indisponible ;
- explication du champ manquant ;
- aucune somme partielle présentée comme coût total.

### CG-18 — aucune incompatibilité détectée, couche non évaluée

Entrées manuelles cohérentes, capital suffisant, avantage positif, aucune donnée de profondeur.

Attendus :

- synthèse conditionnelle autorisée ;
- couche liquidité marquée `not_assessed` ;
- aucune phrase garantissant l'exécution ou le coût réel.

## 4. Invariants transversaux

Pour tous les scénarios :

- aucun `NaN`, `Infinity` ou `-0` ;
- zéro distinct d'absence ;
- provenance sur chaque valeur ;
- aucune donnée manquante remplacée par zéro ;
- aucune recommandation ;
- aucun constat supprimé par la synthèse ;
- résultats identiques à contenu de snapshot et versions identiques ;
- ordre des holds, sources, contraintes et exclusions sans signification économique sans effet sur le snapshot ni les constats ;
- même contenu donnant le même `snapshot_id`, même si l'instance de calcul change ;
- toute modification d'entrée invalide le snapshot et rend les anciens constats inactifs ;
- toute expiration rend les anciens constats inactifs même lorsque le contenu et le `snapshot_id` restent identiques ;
- les couches indépendantes restent calculables ;
- une erreur de friction ne supprime pas un constat de cash encore calculable ;
- aucun `hold_id` déduit deux fois ;
- `capital_feasibility_cash <= account_free_settled_cash` et `<= strategy_allocation_headroom` ;
- quantité, prix, devise et nominal réconciliés lorsqu'ils sont présents ;
- toute conclusion dépendante de `G` exige `edge_aligned` ;
- `entry_leg` exige un côté et `complete_round_trip` deux côtés ;
- le domaine non supporté reste visible avec `unsupported_scope`.

## 5. Preuve d'implémentation synthétique

La matrice a été relue contre les contrats de personnalisation, snapshot, cash/cycle, alignement de `G` et findings avant l'implémentation.

Les scénarios CG-01 à CG-18 utilisent des résultats attendus explicites et des contrôles indépendants des fonctions internes. Ils ont réussi sur le head `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4`, run `29334708343` (`#604`).

Cette exécution prouve uniquement le domaine synthétique déclaré. Toute extension de domaine ou donnée externe exige de nouveaux oracles et un gate distinct.
