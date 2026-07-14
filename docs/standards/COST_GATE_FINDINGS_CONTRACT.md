# Breaktest — contrat des constats Cost Gate

## 1. Objet

Un état unique comme `compatible` ou `refusé` masque trop d'information et risque d'être interprété comme une recommandation.

Cost Gate doit produire un ensemble de constats explicables, puis éventuellement une synthèse descriptive. Les couches calculables restent visibles même lorsqu'une autre couche est indisponible.

## 2. Structure canonique d'un constat

Chaque constat possède :

```text
finding_id
finding_code
layer
status
materiality
condition
observed_value
threshold_value
unit
basis
provenance
snapshot_id
depends_on
resolution_condition
limitations
```

### `layer`

```text
input_validity
data_quality
friction_geometry
edge_survival
capital_feasibility
execution_cost
user_constraint
scope_limit
```

### `status`

```text
not_assessed
not_applicable
satisfied
breached
structurally_unreachable
insufficient_data
invalid
expired
conflicted
unsupported
```

### `materiality`

```text
blocking
material
informational
```

`materiality` décrit la dépendance logique du diagnostic. Elle ne représente ni risque financier global ni recommandation.

## 3. Pas de verdict écrasant

Le résultat principal expose :

- le facteur limitant principal ;
- les autres constats matériels ;
- les couches satisfaites ;
- les couches non évaluées ;
- le snapshot et son expiration ;
- les hypothèses et limites.

Un constat ne peut pas effacer les autres.

Exemple : un avantage au-dessus du seuil et un capital insuffisant produisent simultanément :

```text
edge_survival = satisfied
capital_feasibility = breached
```

Le produit ne résume pas ce cas en « mauvais trade ». Il explique que l'hypothèse économique survit aux frictions, mais que l'engagement immédiat dépasse le cash déclaré disponible.

## 4. Synthèse interne

Une synthèse interne peut être dérivée pour l'orchestration et les tests :

```text
invalid_input
insufficient_data
capital_not_feasible
structurally_non_viable
execution_cost_risk
constraint_breach
no_incompatibility_detected_under_assumptions
```

Elle ne remplace jamais `findings[]`.

Ordre de priorité logique proposé :

1. `invalid_input` ;
2. `insufficient_data` pour une couche indispensable ;
3. `capital_not_feasible` ;
4. `structurally_non_viable` ;
5. `execution_cost_risk` ;
6. `constraint_breach` ;
7. `no_incompatibility_detected_under_assumptions`.

Cet ordre sert à choisir le premier message, pas à supprimer les autres constats.

## 5. Conditions de la synthèse la plus favorable

`no_incompatibility_detected_under_assumptions` exige :

- entrées valides ;
- snapshot non expiré ;
- toutes les données critiques prêtes ou aucune donnée externe requise ;
- capital faisable dans le modèle supporté ;
- avantage au-dessus du seuil lorsque l'avantage est évalué ;
- contraintes utilisateur calculables et satisfaites ;
- aucune incompatibilité structurelle ;
- aucun risque d'exécution matériel non résolu dans le domaine revendiqué ;
- toutes les couches non évaluées affichées.

Cet état ne signifie pas :

- rendement probable ;
- risque acceptable ;
- trade approprié ;
- ordre exécutable ;
- recommandation ;
- absence de frictions omises.

## 6. Couche partiellement calculable

Si une quote manque mais que les commissions contractuelles sont disponibles :

- commission : calculable ;
- spread/slippage : `insufficient_data` ;
- coût total complet : indisponible ;
- seuil complet : indisponible ;
- capital immédiat éventuellement calculable selon sa base ;
- synthèse globale : ne peut pas être favorable si la donnée manquante est critique.

Le produit ne remplace pas la donnée manquante par zéro.

## 7. État exact au seuil

Lorsque :

```text
gross_edge_rate == break_even_gross_rate
```

selon la tolérance contractuelle :

```text
edge_survival.status = breached
finding_code = no_strictly_positive_margin
observed_net_margin = 0
```

La formulation :

> L'hypothèse couvre les frictions saisies mais ne produit aucune marge strictement positive.

Elle ne doit pas dire que les frictions ne sont pas couvertes.

## 8. Incompatibilité structurelle

Lorsque l'avantage brut est au niveau ou sous le plancher variable :

```text
status = structurally_unreachable
finding_code = gross_edge_not_above_variable_floor
```

Le constat explique que l'augmentation de taille ne peut pas créer une marge positive dans le modèle. Il ne recommande ni abandon, ni augmentation du brut, ni changement d'actif.

## 9. Capital non faisable

Lorsque l'engagement immédiat dépasse le cash libre déclaré :

```text
status = breached
finding_code = entry_cash_requirement_exceeds_free_settled_cash
```

Le produit affiche les deux montants et les réservations prises en compte.

Il ne propose pas automatiquement :

- une taille réduite ;
- un dépôt ;
- du levier ;
- une vente d'actifs ;
- un crédit.

Une frontière mathématique peut être affichée comme condition, avec une phrase non prescriptive.

## 10. Risque de coût d'exécution

`execution_cost_risk` signifie que le coût réel peut dépasser l'hypothèse ou que le modèle ne peut pas vérifier la qualité d'exécution.

Il ne contient aucune probabilité implicite.

Exemples de codes :

```text
spread_data_stale
visible_depth_below_proposed_quantity
slippage_model_unavailable
partial_fill_not_modelled
market_status_unknown
```

## 11. Conditions de résolution

Chaque constat peut exposer une condition mathématique ou informationnelle :

- donnée fraîche requise ;
- base de nominal à préciser ;
- cash réglé à renseigner ;
- hypothèse brute à aligner ;
- frontière mathématique ;
- conflit de source à résoudre.

`resolution_condition` ne doit jamais être libellée comme action recommandée.

## 12. Présentation UX

### Ordre

1. phrase descriptive principale ;
2. facteur limitant principal ;
3. constats matériels ;
4. couches calculables et satisfaites ;
5. couches non évaluées ;
6. méthode, provenance, snapshot et limites.

### Couleur

La couleur ne porte jamais seule l'état. Chaque bloc possède texte, code explicatif accessible et valeur.

### Identifiants internes

Les codes techniques ne sont visibles que dans la vue méthode/preuve, pas comme titre principal destiné au grand public.

## 13. Déterminisme

À entrées, versions et snapshot identiques :

- ordre des constats identique ;
- facteur principal identique ;
- synthèse interne identique ;
- texte issu d'un catalogue versionné ;
- aucune génération libre par IA dans le diagnostic financier canonique.

L'IA peut ultérieurement expliquer un résultat déjà calculé, sans modifier les constats ni ajouter une conclusion.

## 14. Tests futurs

Tester :

- aucune incompatibilité détectée ;
- deux violations simultanées ;
- données manquantes avec sous-calcul encore disponible ;
- exact seuil ;
- sous plancher variable ;
- capital insuffisant malgré avantage positif ;
- capital suffisant mais avantage absorbé ;
- snapshot expiré ;
- conflit de devise ;
- couche non applicable ;
- domaine non supporté ;
- ordre stable ;
- texte non prescriptif ;
- aucun code brut présenté comme feu vert ;
- aucune couleur seule ;
- aucune perte de constat dans la synthèse.

## 15. Statut

Contrat de conception non implémenté. Toute future implémentation doit versionner le catalogue des constats et la politique de priorité.