# Breaktest — contrat quantitatif Edge Range

## 1. Objet

Ce contrat étend le moteur Edge Survival avec une fourchette déterministe d'avantage brut fournie par l'utilisateur.

Il ne définit aucune distribution, probabilité, confiance statistique ou prévision.

Le mode fourchette sert uniquement à tester la stabilité d'une conclusion sous trois hypothèses explicites.

## 2. Entrées

Entrées existantes du moteur :

```text
break_even_gross_rate = T
variable_floor_rate = V
fixed_cost_eur = C_fixed
order_notional_eur = N
```

Entrée historique de compatibilité :

```text
gross_edge_rate = G_point
```

Nouvelles entrées facultatives :

```text
gross_edge_low_rate = G_low
gross_edge_base_rate = G_base
gross_edge_high_rate = G_high
```

Toutes les valeurs sont des taux décimaux internes.

## 3. Détermination du mode et priorité des entrées

Le moteur doit déterminer exactement un mode :

- `threshold_only` : aucune valeur brute n'est fournie ;
- `point_estimate` : `G_point` est fournie et aucune borne de fourchette n'est fournie ;
- `range_estimate` : `G_low`, `G_base` et `G_high` sont toutes fournies et `G_point` est absente.

Cas invalides :

- une ou deux bornes seulement ;
- `G_point` fournie en même temps qu'une ou plusieurs bornes ;
- valeurs de bornes non finies ;
- ordre des bornes invalide.

Le moteur ne doit jamais :

- choisir silencieusement entre `G_point` et la fourchette ;
- copier `G_point` dans `G_base` ;
- compléter une borne manquante ;
- permuter les bornes ;
- transformer une fourchette dégénérée en point sans le signaler.

## 4. Validation

Chaque valeur est classée `valid`, `missing` ou `invalid` avant tout calcul.

En mode fourchette :

```text
G_low <= G_base <= G_high
```

Les valeurs peuvent être négatives. Elles doivent être finies.

Une égalité entre bornes est autorisée. Une fourchette dégénérée reste en mode `range_estimate` avec :

```text
range_shape = degenerate
```

Sinon :

```text
range_shape = ordered
```

Une fourchette partielle ou mélangée avec `G_point` rend le calcul de la couche Edge Range invalide. Les coûts de base peuvent rester calculables, mais aucune sortie de fourchette ne doit être fabriquée.

## 5. Tolérance numérique et égalités

Utiliser la même tolérance absolue-relative que le moteur Capital Efficiency :

```text
close(a, b) = abs(a - b) <= tolerance * max(1, abs(a), abs(b))
```

Définir :

```text
strictly_above(a, b) = a > b et non close(a, b)
at_or_below(a, b) = a < b ou close(a, b)
```

Une égalité numérique au seuil n'est jamais considérée comme une marge positive.

Une égalité numérique au plancher variable ne permet pas de diluer les coûts fixes vers une marge strictement positive.

## 6. Calcul par hypothèse

Pour chaque `G_i` dans `{G_low, G_base, G_high}` :

```text
net_edge_rate_i = G_i - T
net_edge_eur_i = N * net_edge_rate_i
headroom_to_break_even_i = G_i - T
headroom_to_variable_floor_i = G_i - V
```

Invariant explicite :

```text
headroom_to_break_even_i == net_edge_rate_i
```

Si `G_i > 0` :

```text
edge_absorption_rate_i = T / G_i
edge_retained_rate_i = net_edge_rate_i / G_i
```

Si `G_i <= 0`, absorption et rétention sont indisponibles avec le motif :

```text
gross_edge_non_positive
```

Les marges négatives et les rétentions négatives ne sont jamais tronquées à zéro.

## 7. État de survie de la fourchette

Avec les fonctions de comparaison de la section 5 :

```text
survives_full_range   si strictly_above(G_low, T)
fails_full_range      si at_or_below(G_high, T)
crosses_break_even    sinon
```

Conséquences :

- une borne basse égale au seuil implique `crosses_break_even` sauf si la borne haute est également au seuil ou en dessous ;
- une borne haute égale au seuil implique `fails_full_range` ;
- une fourchette dégénérée au-dessus du seuil peut être `survives_full_range` ;
- une fourchette dégénérée au seuil est `fails_full_range`.

## 8. État face au plancher variable

```text
structurally_unreachable_full_range si at_or_below(G_high, V)
above_variable_floor_full_range     si strictly_above(G_low, V)
variable_floor_crossing             sinon
```

Ces états concernent uniquement la possibilité mathématique de diluer le coût fixe en augmentant `N` sous les hypothèses du modèle.

Ils ne constituent pas une recommandation d'augmenter la taille.

## 9. Frontières de taille par hypothèse

Pour chaque hypothèse `G_i` :

Si `G_i <= V` ou `close(G_i, V)` :

```text
minimum_order_for_positive_net_i = unavailable
reason = structurally_unreachable
```

Sinon :

```text
minimum_order_for_positive_net_i = C_fixed / (G_i - V)
```

Le cas `C_fixed = 0` conserve la frontière `0` avec la qualification :

```text
no_positive_minimum_from_fixed_costs
```

L'interface doit préciser qu'une frontière mathématique de zéro ne recommande pas un ordre nul.

La frontière répond à « à partir de quelle taille les coûts fixes ne suffisent-ils plus à annuler cette hypothèse ? ». Elle ne répond pas à « quelle taille dois-je utiliser ? ».

## 10. Invariants

Pour chaque hypothèse calculable :

```text
G_i - T == net_edge_rate_i
N * net_edge_rate_i == net_edge_eur_i
headroom_to_break_even_i == net_edge_rate_i
```

Si `G_i > 0` :

```text
edge_absorption_rate_i + edge_retained_rate_i == 1
```

Ordre des marges :

```text
net_edge_rate_low <= net_edge_rate_base <= net_edge_rate_high
net_edge_eur_low <= net_edge_eur_base <= net_edge_eur_high
```

Si `C_fixed > 0` et les trois hypothèses sont strictement au-dessus de `V` :

```text
minimum_order_high <= minimum_order_base <= minimum_order_low
```

Rétrocompatibilité :

- le résultat du mode `point_estimate` doit être numériquement identique au résultat historique pour la même `gross_edge_rate` ;
- le mode `threshold_only` doit être numériquement identique au résultat historique sans avantage brut ;
- les six scénarios synthétiques existants doivent rester inchangés.

## 11. Sorties obligatoires

La couche fourchette doit exposer explicitement :

```text
mode
range_shape
range_state
variable_floor_state
threshold_rate
variable_floor_rate
low
base
high
```

Chaque élément `low`, `base`, `high` contient au minimum :

```text
gross_edge_rate
net_edge_rate
net_edge_eur
headroom_to_break_even
headroom_to_variable_floor
edge_absorption_rate ou unavailable
edge_retained_rate ou unavailable
minimum_order_for_positive_net ou unavailable
```

Toutes les sorties portent une provenance :

```text
user_assumption
synthetic_demo
```

## 12. Cas limites

Tester explicitement :

- aucune valeur ;
- point unique historique ;
- fourchette complète ;
- `G_point` et fourchette simultanées ;
- fourchette partielle ;
- ordre des bornes invalide ;
- bornes égales ;
- valeurs non finies ;
- borne basse égale au seuil ;
- borne haute égale au seuil ;
- fourchette dégénérée au seuil ;
- fourchette entièrement au-dessus du seuil ;
- fourchette traversant le seuil ;
- fourchette entièrement sous le seuil ;
- fourchette entièrement sous le plancher variable ;
- fourchette traversant le plancher variable ;
- valeurs négatives ;
- avantage nul ;
- coût fixe nul ;
- plancher variable nul ;
- nominal très petit mais strictement positif ;
- tolérance autour du seuil et du plancher ;
- absence de `NaN`, `Infinity` et `-0`.

## 13. Affichage

Le produit affiche toujours en mode fourchette :

- les trois hypothèses comme hypothèses utilisateur ou démonstration synthétique ;
- le seuil de couverture ;
- le plancher variable ;
- les marges basse, centrale et haute ;
- l'état descriptif de la fourchette ;
- les limites de l'interprétation.

La première phrase doit décrire seulement la stabilité de la conclusion :

- toute la fourchette est au-dessus du seuil ;
- la fourchette traverse le seuil ;
- même la borne haute ne couvre pas le seuil.

Elle ne doit jamais afficher :

- « probabilité de réussite » ;
- « confiance » ;
- « rendement attendu par Breaktest » ;
- « scénario optimal » ;
- « verdict » ;
- une couleur ou un score non expliqué ;
- une recommandation de taille, fréquence, actif, courtier ou opération.

## 14. Version

La première implémentation conforme utilise l'identifiant :

```text
capital-efficiency-lab-3-edge-range
```

Toute modification ultérieure de la logique des modes, comparaisons ou états impose un nouvel identifiant de version.