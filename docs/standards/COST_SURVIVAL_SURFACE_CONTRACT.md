# Breaktest — contrat Cost Survival Surface v1

## 1. Objet

La Cost Survival Surface v1 décrit comment les frictions modélisées et un avantage brut explicitement fourni se croisent pour plusieurs tailles d'ordre.

Elle répond à :

> Sous une politique de projection synthétique déclarée, quelles cellules restent sous le seuil, atteignent exactement le seuil ou conservent une marge positive ?

Elle ne choisit aucune cellule, ne prédit aucun avantage et ne prétend pas que les tailles sont exécutables.

## 2. Séparation snapshot / projection

Le Cost Ledger v1 est un **snapshot**. Ses montants et taux n'ont pas automatiquement un domaine de validité hors du nominal source.

La surface utilise donc une politique de projection séparée. Cette politique doit déclarer :

- les tailles évaluées ;
- le domaine dans lequel la sensibilité est autorisée ;
- la transformation de chaque base ;
- la stabilité supposée des paramètres ;
- le traitement de l'avantage avec la taille ;
- les limites non évaluées.

`notionalScaling` dans le ledger ne suffit pas à prouver un domaine empirique.

## 3. Schéma racine

```text
surfaceRequest = {
  schemaVersion,
  surfaceId,
  sourceLedgerHash,
  sourceLedger,
  projection,
  edgeProfile
}

schemaVersion = cost-survival-surface-1
```

Les clés inconnues sont refusées. Le hash fourni doit correspondre au hash recalculé du ledger.

## 4. Politique de projection v1

```text
projection = {
  policyId,
  sourceNotionalEur,
  sizeAxisEur,
  domain,
  basisRules,
  parameterStability,
  quantityTreatment,
  limitations
}

policyId = linear-ledger-sensitivity-1
parameterStability = assumed_constant_over_declared_domain
quantityTreatment = notional_only_not_executable

domain = {
  minNotionalEur,
  maxNotionalEur,
  currency,
  status
}

status = synthetic_sensitivity_only
```

Règles :

- `sourceNotionalEur` correspond exactement au `returnDenominator` et à `basisValues.entry_notional` ;
- `sizeAxisEur` est explicite, strictement croissant, unique, fini, positif et contenu dans le domaine ;
- le domaine est une hypothèse de sensibilité, pas un domaine calibré ;
- chaque base présente dans le ledger possède exactement une règle ;
- `entry_notional = axis_value` ;
- une autre base peut seulement utiliser `preserve_source_ratio` dans v1 ;
- les paramètres fixes et taux restent constants uniquement par hypothèse déclarée ;
- une forme autre que `fixed` ou `proportional` rend la projection non supportée ;
- aucune taille n'est arrondie ou ajoutée silencieusement.

Cette politique conserve notamment `exit_notional / entry_notional` du snapshot. Avec l'adaptateur legacy, cela maintient `legacy_constant_notional` ; cela ne modélise pas un produit de sortie dépendant du rendement.

## 5. Profil d'avantage

```text
edgeProfile = {
  mode,
  provenance,
  alignmentContext,
  alignmentKeyHash,
  constantRates,
  bySize,
  limitations
}

mode = constant_across_size | explicit_by_size
provenance = user_assumption | synthetic_demo

edgeRates = { low, base, high }
```

`alignmentContext` contient l'instrument, la place, la direction, la portée, l'horizon, la devise du compte et la clé complète `grossEdgeAlignment`. Le moteur :

1. recalcule son hash et le compare à `alignmentKeyHash` ;
2. réexécute l'évaluateur canonique d'alignement de la fondation ;
3. exige la correspondance avec `sourceLedger.scenarioContext`.

Un simple statut `edge_aligned` déclaré par l'appelant n'est pas accepté.

Les trois taux sont finis et ordonnés. Ils peuvent être nuls ou négatifs. Ils restent des hypothèses non probabilistes.

### Mode constant

`constantRates` contient les trois taux et `bySize` est vide. La sortie publie `edge_capacity_not_modelled`. La stabilité de l'avantage avec la taille n'est jamais inférée d'un historique.

### Mode explicite par taille

`constantRates = null`. `bySize` contient exactement une ligne par taille, dans le même ordre :

```text
{ sizeEur, rates: { low, base, high } }
```

Aucune interpolation n'est autorisée entre deux lignes.

## 6. Conditions préalables

La surface n'est calculée que si :

- le ledger est valide ;
- sa couverture est `complete_under_declared_policy` ;
- Edge Survival est `eligible` ;
- le dénominateur est `entry_notional` en EUR ;
- les composants et bases sont projetables sous la politique v1 ;
- le profil d'avantage est aligné et complet.
- le contexte instrument/place/horizon de l'avantage correspond au contexte hashé du ledger.

Un sous-total connu peut rester visible dans le ledger, mais ne devient jamais une surface de survie complète.

## 7. Produit cartésien obligatoire

Pour chaque taille, les trois scénarios de coût sont croisés avec les trois hypothèses d'avantage :

```text
3 coûts × 3 avantages = 9 cellules par taille
```

Apparier seulement `low-low`, `base-base` et `high-high` est interdit : cela masquerait six combinaisons, dont coût haut × avantage bas.

Les scénarios de coût restent les sensibilités coordonnées du ledger. Ils ne constituent pas une distribution conjointe.

## 8. Calcul d'une cellule

Pour une taille `N`, un coût `C` et un taux brut `G` :

```text
grossEdgeEur = N × G
breakEvenGrossRate = C / N
netMarginEur = grossEdgeEur - C
netMarginRate = G - breakEvenGrossRate
```

État avec tolérance relative versionnée :

```text
below_threshold
at_threshold_no_positive_margin
positive_margin_under_assumptions
```

L'égalité signifie que les frictions sont couvertes exactement et qu'aucune marge strictement positive ne subsiste.

Si `grossEdgeEur <= 0`, absorption et rétention sont `null` avec la raison `non_positive_gross_edge`. Aucune division infinie n'est produite.

## 9. Frontières

### Profil constant et projection linéaire prouvée

Pour chaque croisement coût × avantage :

```text
net(N) = N × (G - V) - F
```

où `F` est le coût fixe et `V` le taux proportionnel rapporté au nominal d'entrée.

- si `G > V`, la frontière d'égalité est `F / (G - V)` et la marge est positive strictement au-dessus ;
- si `G = V` et `F = 0`, toutes les tailles positives sont exactement au seuil ;
- sinon, une marge positive est structurellement inaccessible sous ces hypothèses.

La relation de la frontière au domaine est publiée. Elle n'est jamais appelée taille optimale ou taille recommandée.

### Profil explicite par taille

Le moteur publie uniquement les changements observés entre tailles adjacentes. Il n'interpole aucune frontière et ne suppose aucune monotonie.

## 10. Sortie

La sortie contient :

- hash et version de la requête ;
- hash du ledger source ;
- hash du contexte source et hash du ledger projeté pour chaque taille ;
- tailles et hypothèses évaluées ;
- neuf cellules par taille ;
- coûts, seuils, marges, ratios éventuellement disponibles et états ;
- frontières exactes qualifiées ou intervalles discrets ;
- problèmes, invariants et limites ;
- couches non évaluées.

L'ordre canonique est taille, scénario de coût `low/base/high`, hypothèse d'avantage `low/base/high`.

## 11. Couches explicitement non évaluées

V1 conserve toujours :

```text
quantity_lot_tick_and_minimum_order
liquidity_market_impact_and_fill
capital_timeline_settlement_and_frequency
edge_capacity_and_decay (sauf profil explicite fourni, toujours non vérifié)
taxes_or_fees_outside_declared_policy
external_data_quality
```

La faisabilité d'un point de grille ne signifie donc pas qu'un ordre correspondant existe ou peut être financé.

## 12. Interdictions de langage et d'API

La sortie ne contient pas :

- `optimal` ;
- `recommended` ;
- `approved` ;
- `execute` ;
- score, classement ou meilleur point ;
- probabilité de réussite ou de fill.

Les états sont descriptifs et toujours suffixés par leur dépendance aux hypothèses.

## 13. Invariants

- aucun `NaN`, `Infinity` ou `-0` ;
- aucun seuil sans coût complet sous politique ;
- exactement neuf cellules par taille ;
- égalité distincte d'une marge positive ;
- produit cartésien complet ;
- ordre des composants du ledger sans effet ;
- mutation économique modifiant le hash ;
- aucune interpolation pour un profil par taille ;
- aucune frontière exacte si la géométrie n'est pas prouvée ;
- aucune donnée externe, recommandation ou exécution.

## 14. Portée de la preuve

Une réussite technique démontre uniquement l'arithmétique et les refus du domaine synthétique. Elle ne démontre pas que le domaine choisi est réaliste, que l'avantage reste stable, que les coûts implicites sont calibrés ou que la surface est utile à un utilisateur.
