# Breaktest Cost Gate — matrice synthétique de fondation

## 1. Rôle

Cette matrice définit les premiers oracles conceptuels d'un futur moteur Cost Gate. Elle n'utilise aucune donnée réelle et n'autorise aucune implémentation externe.

Chaque scénario doit produire plusieurs constats indépendants plutôt qu'un verdict simpliste.

## 2. Conventions communes

Sauf indication contraire :

```text
account_model = cash_account
position = long_cash_purchase
account_currency = EUR
provenance = synthetic_demo
order_notional = 500 EUR
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
free_settled_cash = 1 000 EUR
entry_cash_requirement = 505 EUR
snapshot = manual_assumptions_only
```

Attendus :

```text
net_edge = 0,90 %
edge_retention = 45 %
edge_survival = satisfied
capital_feasibility = satisfied
external_market_data = not_assessed
summary = no_incompatibility_detected_under_assumptions
```

La synthèse précise que la liquidité réelle et l'exécution ne sont pas évaluées.

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
free_settled_cash = 400 EUR
entry_cash_requirement = 505 EUR
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
operation_scope = round_trip
lifecycle_friction = 5,50 EUR
entry_commission = 1 EUR
entry_fx_cash_cost = 1,25 EUR
entry_asset_consideration = 500 EUR
exit_costs = 2,75 EUR futurs
```

Attendus :

```text
entry_cash_requirement = 502,25 EUR
lifecycle_friction = 5,50 EUR
```

Les frais de sortie futurs ne sont pas ajoutés au cash immédiat. Le test doit détecter tout calcul utilisant `505,50 EUR` comme besoin immédiat sans base supplémentaire.

### CG-07 — spread déjà incorporé au prix ask

Entrées :

```text
notional_basis = reference_ask_price
spread_included_in_reference_price = true
```

Attendus :

- le spread reste dans l'analyse économique si la méthode le mesure ;
- il n'est pas ajouté une deuxième fois à l'engagement cash ;
- aucune double soustraction.

### CG-08 — base de nominal conflictuelle

Entrées :

```text
notional_basis = reference_ask_price
spread_included_in_reference_price = unknown
```

Attendus :

```text
capital_feasibility = conflicted
finding_code = cash_basis_conflicted
```

Les calculs de coût indépendants restent disponibles.

### CG-09 — quote stale

Entrées : quote externe expirée ; commissions contractuelles actuelles.

Attendus :

```text
data_quality.quote = stale
commission_cost = calculable
complete_execution_cost = insufficient_data
snapshot = snapshot_expired
summary = insufficient_data
```

La quote stale n'est jamais remplacée par zéro ni qualifiée d'actuelle.

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

- coûts pour aller-retour actions EUR ;
- `G` provenant d'un rendement annuel de portefeuille ou d'un autre instrument.

Attendus :

```text
edge_input = invalid
finding_code = gross_edge_basis_mismatch
```

Aucun fallback depuis CAGR, taux de réussite ou alpha.

### CG-12 — plusieurs violations simultanées

Entrées :

- quote stale ;
- cash insuffisant ;
- `G` sous le plancher.

Attendus :

- trois constats conservés ;
- facteur principal choisi par politique versionnée ;
- aucun constat supprimé ;
- aucune phrase « trade refusé ».

### CG-13 — snapshot invalidé par changement de taille

Après calcul, `order_notional` passe de 500 à 600 EUR.

Attendus :

```text
old_snapshot = obsolete
old_findings = inactive
recalculation_required = true
```

### CG-14 — ordre en attente

Entrées :

```text
available_settled_cash = 1 000 EUR
pending_cash_commitments = 600 EUR
cash_reserve = 100 EUR
entry_cash_requirement = 400 EUR
```

Attendus :

```text
free_settled_cash = 300 EUR
capital_feasibility = breached
```

Le solde brut de 1 000 EUR ne peut pas être utilisé seul.

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
- résultats identiques à snapshot et versions identiques ;
- toute modification d'entrée invalide le snapshot ;
- les couches indépendantes restent calculables ;
- le domaine non supporté reste visible.

## 5. Gate d'implémentation

Cette matrice doit être relue contre les contrats de personnalisation, snapshot, cash/cycle et findings avant tout code.

Une future implémentation doit utiliser des oracles explicites, pas recopier ses propres fonctions internes dans les tests.