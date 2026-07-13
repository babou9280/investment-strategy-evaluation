# Breaktest — contrat quantitatif Edge Range

## 1. Objet

Ce contrat étend le moteur Edge Survival avec une fourchette déterministe d'avantage brut fournie par l'utilisateur.

Il ne définit aucune distribution, probabilité, confiance statistique ou prévision.

## 2. Entrées

Entrées existantes du moteur :

```text
break_even_gross_rate = T
variable_floor_rate = V
order_notional_eur = N
```

Nouvelles entrées facultatives :

```text
gross_edge_low_rate = G_low
gross_edge_base_rate = G_base
gross_edge_high_rate = G_high
```

## 3. Modes

- `threshold_only` : aucune valeur d'avantage fournie ;
- `point_estimate` : seule `G_base` est fournie ;
- `range_estimate` : `G_low`, `G_base` et `G_high` sont toutes fournies.

Toute fourchette partielle est invalide. Aucun champ manquant ne doit être déduit ou remplacé silencieusement.

## 4. Validation

Chaque valeur est classée `valid`, `missing` ou `invalid`.

En mode fourchette :

```text
G_low <= G_base <= G_high
```

Les valeurs peuvent être négatives. Elles doivent être finies.

Une égalité entre bornes est autorisée ; une fourchette dégénérée reste explicitement identifiée comme telle.

## 5. Calcul par hypothèse

Pour chaque `G_i` dans `{G_low, G_base, G_high}` :

```text
net_edge_rate_i = G_i - T
net_edge_eur_i = N * net_edge_rate_i
headroom_to_break_even_i = G_i - T
headroom_to_variable_floor_i = G_i - V
```

Si `G_i > 0` :

```text
edge_absorption_rate_i = T / G_i
edge_retained_rate_i = net_edge_rate_i / G_i
```

Si `G_i <= 0`, absorption et rétention sont indisponibles avec le motif `gross_edge_non_positive`.

## 6. État de survie de la fourchette

Avec la tolérance numérique du moteur :

```text
survives_full_range   si G_low > T
fails_full_range      si G_high <= T
crosses_break_even    sinon
```

L'égalité au seuil n'est pas une marge positive.

## 7. État face au plancher variable

```text
structurally_unreachable_full_range si G_high <= V
above_variable_floor_full_range     si G_low > V
variable_floor_crossing             sinon
```

Ces états concernent uniquement la possibilité mathématique de diluer le coût fixe en augmentant `N` sous les hypothèses du modèle.

Ils ne constituent pas une recommandation d'augmenter la taille.

## 8. Frontières de taille par hypothèse

Pour chaque hypothèse `G_i` :

Si `G_i <= V` :

```text
minimum_order_for_positive_net_i = unavailable
reason = structurally_unreachable
```

Sinon :

```text
minimum_order_for_positive_net_i = fixed_cost_eur / (G_i - V)
```

Le cas `fixed_cost_eur = 0` conserve la frontière `0` avec la qualification `no_positive_minimum_from_fixed_costs`.

## 9. Invariants

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
```

Si `fixed_cost_eur > 0` et les trois hypothèses sont au-dessus de `V` :

```text
minimum_order_high <= minimum_order_base <= minimum_order_low
```

## 10. Cas limites

Tester explicitement :

- aucune valeur ;
- point unique ;
- fourchette complète ;
- fourchette partielle ;
- ordre des bornes invalide ;
- bornes égales ;
- borne basse égale au seuil ;
- borne haute égale au seuil ;
- fourchette entièrement au-dessus du seuil ;
- fourchette traversant le seuil ;
- fourchette entièrement sous le seuil ;
- fourchette entièrement sous le plancher variable ;
- fourchette traversant le plancher variable ;
- valeurs négatives ;
- avantage nul ;
- coût fixe nul ;
- plancher variable nul ;
- absence de `NaN`, `Infinity` et `-0`.

## 11. Affichage

Le produit affiche toujours :

- les trois hypothèses comme hypothèses utilisateur ou démonstration synthétique ;
- le seuil de couverture ;
- le plancher variable ;
- les marges basse, centrale et haute ;
- l'état descriptif de la fourchette ;
- les limites de l'interprétation.

Il ne doit jamais afficher :

- « probabilité de réussite » ;
- « confiance » ;
- « rendement attendu par Breaktest » ;
- « scénario optimal » ;
- une couleur ou un score non expliqué comme verdict.

## 12. Version

La première implémentation conforme doit utiliser un identifiant distinct, par exemple :

```text
capital-efficiency-lab-3-edge-range
```
