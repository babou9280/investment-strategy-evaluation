# Cost Survival Surface v1 — matrice de scénarios avant moteur

## 1. Statut

- Date de gel : 16 juillet 2026.
- Nature : scénarios synthétiques, oracles indépendants et refus hostiles.
- Autorité : `docs/standards/COST_SURVIVAL_SURFACE_CONTRACT.md`.
- Source : Cost Ledger v1 complet sous `legacy-four-costs-1`.
- Exclusions : donnée réelle, quantité exécutable, impact, fill, fréquence, capital temporel et recommandation.

Cette matrice est figée avant l'ajout du moteur de surface.

## 2. Fixture de référence

Ledger aller-retour :

```text
F = 2 EUR
V.low/base/high = 0,0065 / 0,0070 / 0,0080
sizes = 250 / 500 / 1 000 EUR
edge.low/base/high = 0,009 / 0,011 / 0,020
domain = [250, 1 000] EUR, synthetic_sensitivity_only
```

À 500 EUR :

```text
cost.low/base/high = 5,25 / 5,50 / 6,00 EUR
break-even.low/base/high = 1,05 % / 1,10 % / 1,20 %
```

## 3. Calcul et produit cartésien

### CSS-01 — grille constante complète

Trois tailles, trois coûts et trois avantages produisent exactement 27 cellules, ordonnées de façon canonique.

### CSS-02 — neuf croisements à chaque taille

À 500 EUR, le moteur calcule les neuf couples, notamment coût haut × avantage bas et coût bas × avantage haut. Il ne produit pas seulement la diagonale.

### CSS-03 — égalité centrale

À 500 EUR, coût central `5,50 EUR` et avantage central `1,10 %` donnent :

```text
gross = 5,50 EUR
net = 0 EUR
state = at_threshold_no_positive_margin
```

### CSS-04 — égalité basse à grande taille

À 1 000 EUR, coût central `9 EUR` et avantage bas `0,90 %` donnent exactement l'égalité, sans marge positive.

### CSS-05 — sous le seuil

À 250 EUR, coût central `3,75 EUR` et avantage bas `2,25 EUR` donnent `-1,50 EUR` et `below_threshold`.

### CSS-06 — marge positive

À 250 EUR, coût central `3,75 EUR` et avantage haut `5 EUR` donnent `1,25 EUR` et `positive_margin_under_assumptions`.

### CSS-07 — ratios avec avantage positif

À 500 EUR, coût central et avantage haut donnent absorption `55 %`, rétention `45 %`, valeurs finies.

### CSS-08 — avantage nul ou négatif

La marge reste calculée ; absorption et rétention valent `null` avec `non_positive_gross_edge`. Aucun infini n'apparaît.

## 4. Projection et domaine

### CSS-09 — hash source exact

Un `sourceLedgerHash` différent du hash recalculé bloque toute cellule.

### CSS-10 — nominal source réconcilié

`sourceNotionalEur`, `returnDenominator.amount` et `basisValues.entry_notional.amount` doivent être égaux.

### CSS-11 — axe strict

Taille nulle, non finie, dupliquée, désordonnée ou hors domaine : requête invalide, aucun tri ni clamp silencieux.

### CSS-12 — règles de base exhaustives

Une base présente ou utilisée sans règle rend la projection non supportée. `entry_notional` doit utiliser `axis_value`.

### CSS-13 — forme réservée

Un composant `tiered`, `minimum_or_maximum` ou `nonlinear_model` empêche la projection ; il n'est jamais ramené à une droite.

### CSS-14 — stabilité qualifiée

Toute sortie contient `cost_parameters_assumed_constant_over_domain`, `scaling_domain_synthetic_only` et `notional_only_not_executable`.

### CSS-15 — nominal de sortie legacy

`exit_notional / entry_notional` est conservé avec `legacy_constant_notional`; aucune relation au rendement n'est inventée.

## 5. Profil d'avantage

### CSS-16 — avantage constant qualifié

Le mode constant conserve les trois taux et publie `edge_capacity_not_modelled`.

### CSS-17 — avantage explicite par taille

Chaque taille possède sa propre fourchette ordonnée. Le moteur utilise exactement la ligne correspondante et ne calcule aucune frontière interpolée.

### CSS-18 — profil par taille incomplet

Une taille absente, supplémentaire, dupliquée ou désordonnée invalide le profil.

### CSS-19 — fourchette d'avantage invalide

Valeur non finie ou `low > base > high` : aucune cellule dépendante.

### CSS-20 — alignement insuffisant

Un champ d'alignement incomplet, une clé invalide ou un hash qui ne correspond pas au contexte complet bloque la surface sans proposer une valeur de remplacement. Le moteur recalcule l'alignement ; il n'accepte pas un statut libre.

## 6. Frontières

### CSS-21 — frontière exacte linéaire

Avec coût central `F = 2`, `V = 0,007` et avantage haut `G = 0,020` :

```text
boundary = 2 / (0,020 - 0,007) = 153,846153846... EUR
positive margin strictly above boundary
domain relation = below_declared_domain
```

### CSS-22 — frontière à 500 EUR

Avec coût central et avantage central :

```text
boundary = 2 / (0,011 - 0,007) = 500 EUR
```

L'égalité à 500 reste non positive ; la marge est positive strictement au-dessus.

### CSS-23 — marge structurellement inaccessible

Si `G < V`, ou si `G = V` avec `F > 0`, aucune taille positive ne produit de marge positive sous les hypothèses linéaires.

### CSS-24 — égalité pour toutes les tailles

Si `F = 0` et `G = V`, toutes les tailles positives sont au seuil. Le moteur n'invente pas une taille minimale.

### CSS-25 — profil explicite sans interpolation

Un changement d'état entre 500 et 1 000 EUR produit seulement un intervalle discret `[500, 1000]`, sans frontière exacte ni monotonie supposée.

## 7. Refus et gouvernance

### CSS-26 — ledger partiel

Un coût attendu absent conserve le sous-total dans le ledger mais produit zéro cellule de survie complète.

### CSS-27 — inclusion edge non réconciliée

`unknown` ou `included` bloque la surface jusqu'à réconciliation ; `not_applicable` est invalide dans le ledger.

### CSS-28 — aucune optimisation

La sortie sérialisée ne contient aucun champ ou texte `optimal`, `recommended`, `approved`, `execute`, `best_size` ou équivalent.

### CSS-29 — couches non évaluées

Quantité/lot/tick, liquidité/impact/fill, capital/règlement/fréquence et données externes restent présentes dans `unassessedLayers`.

### CSS-30 — déterminisme et nombres finis

L'ordre des composants source n'affecte ni hash ni cellules. Toute mutation économique change le hash. Aucun `NaN`, `Infinity` ou `-0` n'apparaît.

### CSS-31 — contexte ledger et avantage incompatible

Un avantage aligné avec lui-même mais portant un autre instrument, une autre place, direction, portée, horizon ou devise que `sourceLedger.scenarioContext` produit `edge_ledger_scenario_context_mismatch` et zéro cellule.

### CSS-32 — reçus des projections

Chaque taille publie le hash du ledger réellement projeté, son hash de contexte, sa couverture, son enveloppe de coût et ses seuils. Chaque cellule référence exactement le hash de sa taille. La surface reste reconstructible sans faire confiance à une formule d'affichage.

## 8. Condition de réussite

Les trente-deux scénarios doivent être enregistrés. CSS-03 à CSS-08 et CSS-21 à CSS-24 utilisent des oracles indépendants. La suite de propriétés doit vérifier le produit cartésien, les frontières, l'ordre, le déterminisme et l'absence de valeurs non finies.

Une CI verte ne valide ni domaine réel, ni capacité, ni exécution, ni utilité.
