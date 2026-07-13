# Breaktest — contrat quantitatif Edge Survival

## 1. Objet

Ce contrat définit les formules du prototype interne Capital Efficiency.

Il complète `docs/standards/QUANT_FINANCE_STANDARDS.md`. En cas de contradiction, la règle la plus spécifique et la plus prudente s'applique.

Le moteur doit être déterministe, local, sans données externes, sans arrondi interne et sans recommandation.

## 2. Entrées

```text
capital_eur = K
order_notional_eur = N
side_count = k                 # 1 achat simple, 2 aller-retour
monthly_operations = m
commission_per_side_eur = C
fx_rate_per_side = F
spread_total_rate = S
slippage_total_rate = L
gross_edge_rate = G            # facultatif
retention_target_rate = R      # facultatif, 0 <= R <= 1
annual_drag_budget_rate = B     # facultatif, 0 <= B <= 1
target_net_rate = Q             # facultatif
```

Tous les taux utilisent une représentation décimale interne.

## 3. Validation des entrées

Chaque entrée est classée `valid`, `missing` ou `invalid` avant calcul.

Règles :

- `N` doit être fini et strictement positif ;
- `K` est facultatif, mais doit être fini et strictement positif lorsqu'il est fourni ;
- `k` vaut exactement 1 ou 2 ;
- `m`, `C`, `F`, `S`, `L` doivent être finis et supérieurs ou égaux à zéro ;
- `F`, `S`, `L`, `R`, `B` doivent être compris entre 0 et 1 ;
- `G` et `Q` peuvent être négatifs si l'utilisateur saisit explicitement une hypothèse négative, mais les ratios utilisant `G` comme dénominateur exigent `G > 0` ;
- aucune absence ne devient zéro silencieusement ;
- aucune valeur non finie n'est calculée ou affichée.

## 4. Décomposition des frictions

### 4.1 Coût fixe

```text
fixed_cost_eur = k * C
```

### 4.2 Taux variable total

```text
variable_floor_rate = k * F + S + L
```

Le terme « plancher variable » signifie que ce taux ne diminue pas avec `N` sous les conventions du modèle.

### 4.3 Coût variable

```text
variable_cost_eur = N * variable_floor_rate
```

### 4.4 Coût total

```text
total_cost_eur = fixed_cost_eur + variable_cost_eur
```

### 4.5 Seuil brut de couverture

```text
break_even_gross_rate = total_cost_eur / N
                      = fixed_cost_eur / N + variable_floor_rate
```

Invariant :

```text
break_even_gross_rate >= variable_floor_rate
```

## 5. Edge Survival

Ces sorties ne sont calculables que lorsque `G` est fourni.

### 5.1 Marge nette attendue

```text
net_edge_rate = G - break_even_gross_rate
```

### 5.2 PnL brut et net par opération

```text
gross_edge_eur = N * G
net_edge_eur = N * net_edge_rate
             = gross_edge_eur - total_cost_eur
```

Invariant :

```text
gross_edge_eur - total_cost_eur == net_edge_eur
```

à la tolérance numérique documentée.

### 5.3 Absorption et rétention

Si `G > 0` :

```text
edge_absorption_rate = break_even_gross_rate / G
edge_retained_rate = net_edge_rate / G
```

Invariant :

```text
edge_absorption_rate + edge_retained_rate == 1
```

`edge_retained_rate` peut être négatif. Il ne doit pas être tronqué à zéro.

Si `G <= 0`, ces deux ratios sont indisponibles ; la marge nette reste calculable.

## 6. Taille minimale

### 6.1 Taille minimale pour une marge nette positive

La condition est :

```text
G - variable_floor_rate > 0
```

Si elle n'est pas satisfaite :

```text
minimum_order_for_positive_net = unavailable
minimum_order_reason = structurally_unreachable
```

Sinon :

```text
minimum_order_for_positive_net = fixed_cost_eur / (G - variable_floor_rate)
```

La valeur mathématique correspond au point de couverture exact. Pour exiger une marge strictement positive, l'interface doit préciser que l'ordre doit être supérieur à ce seuil, hors précision d'affichage.

### 6.2 Taille minimale pour une rétention cible

Condition :

```text
edge_retained_rate >= R
```

ce qui équivaut à :

```text
fixed_cost_eur / N + variable_floor_rate <= G * (1 - R)
```

Définir :

```text
retention_denominator = G * (1 - R) - variable_floor_rate
```

Si `retention_denominator <= 0` :

```text
minimum_order_for_retention = unavailable
minimum_order_reason = structurally_unreachable
```

Sinon :

```text
minimum_order_for_retention = fixed_cost_eur / retention_denominator
```

Cas `fixed_cost_eur = 0` : le seuil vaut zéro si la condition variable est satisfaite. L'interface ne doit pas suggérer un ordre nul ; elle doit expliquer qu'aucune taille minimale positive n'est imposée par les coûts fixes dans le modèle.

## 7. Budget annuel de friction

### 7.1 Coût annuel arithmétique

```text
annual_operations = 12 * m
annual_cost_eur = total_cost_eur * annual_operations
```

Ce résultat n'est ni un rendement annualisé ni une simulation de portefeuille.

Si `K > 0` :

```text
annual_drag_to_capital_rate = annual_cost_eur / K
```

### 7.2 Fréquence frontière sous budget

Calculable si `B`, `K` et `total_cost_eur` sont valides.

Si `total_cost_eur > 0` :

```text
max_monthly_operations_under_budget = (B * K) / (12 * total_cost_eur)
```

Si `total_cost_eur = 0` :

```text
max_monthly_operations_under_budget = unbounded_within_model
```

Cette sortie représente une frontière mathématique, pas une recommandation de fréquence.

## 8. Rendement brut requis pour une cible nette

Si `Q` est fourni :

```text
required_gross_rate_for_target_net = Q + break_even_gross_rate
```

Cette sortie n'est pas une prévision de rendement réalisable.

## 9. Diagnostics de structure des coûts

### 9.1 Part fixe et variable

Si `total_cost_eur > 0` :

```text
fixed_cost_share = fixed_cost_eur / total_cost_eur
variable_cost_share = variable_cost_eur / total_cost_eur
```

Invariant :

```text
fixed_cost_share + variable_cost_share == 1
```

### 9.2 Taille d'égalité fixe-variable

Si `variable_floor_rate > 0` :

```text
fixed_variable_equal_order = fixed_cost_eur / variable_floor_rate
```

À ce nominal, coût fixe et coût variable sont égaux selon le modèle.

Si `variable_floor_rate = 0`, cette sortie est indisponible ou infinie ; aucun affichage `Infinity` n'est autorisé.

## 10. Projection annuelle de l'avantage

Uniquement comme projection arithmétique sans compounding, sans positions simultanées et sans réinvestissement :

```text
annual_gross_edge_eur = gross_edge_eur * annual_operations
annual_net_edge_eur = net_edge_eur * annual_operations
```

Si `K > 0` :

```text
annual_gross_edge_to_capital_rate = annual_gross_edge_eur / K
annual_net_edge_to_capital_rate = annual_net_edge_eur / K
```

L'interface doit afficher : « projection arithmétique, sans capitalisation ni contrainte de positions simultanées ».

## 11. États

```text
threshold_only
edge_fully_absorbed
edge_partially_retained
retention_target_met
structurally_unreachable
not_computable
```

Règles :

- `threshold_only` si `G` est absent et les coûts calculables ;
- `edge_fully_absorbed` si `G` est présent et `net_edge_rate <= 0` ;
- `edge_partially_retained` si `net_edge_rate > 0`, `R` est présent et `edge_retained_rate < R` ;
- `retention_target_met` si `R` est présent et `edge_retained_rate >= R` ;
- sans `R`, ne pas inventer de seuil de qualification ; afficher seulement les valeurs ;
- `structurally_unreachable` s'applique à une contrainte particulière, pas nécessairement à tout le scénario ;
- `not_computable` si les entrées requises sont absentes ou invalides.

## 12. Sensibilité

Le prototype peut calculer des points de sensibilité déterministes pour :

- `N` ;
- `m` ;
- `G` ;
- `variable_floor_rate`.

Pour chaque point, toutes les autres entrées restent strictement constantes. Les axes, unités et paramètres constants doivent être visibles.

Une courbe de seuil selon `N` doit converger vers `variable_floor_rate` lorsque `N` augmente.

## 13. Cas de référence principal

Entrées synthétiques :

```text
K = 5000
N = 500
k = 2
m = 4
C = 1
F = 0.0025
S = 0.001
L = 0.001
G = 0.02
R = 0.50
B = 0.03
Q = 0.01
```

Résultats exacts attendus :

```text
fixed_cost_eur = 2
variable_floor_rate = 0.007
variable_cost_eur = 3.5
total_cost_eur = 5.5
break_even_gross_rate = 0.011
net_edge_rate = 0.009
gross_edge_eur = 10
net_edge_eur = 4.5
edge_absorption_rate = 0.55
edge_retained_rate = 0.45
minimum_order_for_positive_net = 153.84615384615384
minimum_order_for_retention = 666.6666666666666
annual_cost_eur = 264
annual_drag_to_capital_rate = 0.0528
max_monthly_operations_under_budget = 2.272727272727273
required_gross_rate_for_target_net = 0.021
fixed_cost_share = 0.36363636363636365
variable_cost_share = 0.6363636363636364
fixed_variable_equal_order = 285.7142857142857
annual_gross_edge_eur = 480
annual_net_edge_eur = 216
annual_gross_edge_to_capital_rate = 0.096
annual_net_edge_to_capital_rate = 0.0432
```

## 14. Tests obligatoires

- cas de référence principal ;
- achat simple contre aller-retour ;
- coûts fixes nuls ;
- coûts variables nuls ;
- coût total nul ;
- avantage brut absent, nul, négatif et positif ;
- avantage égal au seuil ;
- avantage égal au plancher variable ;
- avantage inférieur au plancher variable ;
- seuil de rétention atteignable et impossible ;
- budget annuel avec coût nul ;
- capital absent ;
- fréquence nulle ;
- valeurs invalides, infinies et chaînes ;
- invariants de réconciliation ;
- absence de `NaN`, `Infinity` et `-0` visible ;
- monotonicité du seuil par rapport à la taille lorsque le coût fixe est positif ;
- convergence vers le plancher variable ;
- indépendance de la fréquence sur le seuil par opération ;
- proportionnalité du coût annuel à la fréquence ;
- aucune modification du moteur historique ou du site de validation fusionné.

## 15. Langage interdit

- taille optimale ;
- fréquence recommandée ;
- trade viable sans qualifier les hypothèses ;
- rendement attendu garanti ;
- stratégie rentable ;
- conseil personnalisé ;
- probabilité de gain dérivée de ces seules formules.
