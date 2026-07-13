# Breaktest Cost Intelligence — contrat de calcul

## 1. Objet

Ce document définit le comportement mathématique du calculateur de validation. Il complète `METHODOLOGY.md` et les scénarios de `go_to_market/DEMO_SCENARIOS.md`.

Le calculateur doit être déterministe, local, sans donnée externe et sans arrondi dans les calculs internes.

## 2. Entrées normalisées

```text
capitalEur
orderAmountEur
activityType = single_buy | round_trip
monthlyFrequency
commissionPerSideEur
fxPerConversionRate
spreadRate
slippageRate
```

Toutes les valeurs numériques sont exprimées en décimal interne :

- `0.25 %` devient `0.0025` ;
- `0.10 %` devient `0.001`.

## 3. Statut des entrées

Chaque champ doit être classé avant calcul :

- `valid` ;
- `missing` ;
- `invalid`.

Règles :

- zéro est valide pour commissions, change, spread, slippage et fréquence ;
- `orderAmountEur` doit être strictement positif ;
- `capitalEur` doit être strictement positif pour le ratio annuel sur capital, mais son absence ne bloque pas les autres résultats ;
- aucune valeur négative, `NaN`, infinie ou chaîne non numérique ne doit être calculée ;
- aucun fallback silencieux vers zéro.

## 4. Nombre de côtés

```text
sides = 1 si activityType = single_buy
sides = 2 si activityType = round_trip
```

Le nombre annuel d'événements est :

```text
annualOperations = monthlyFrequency × 12
```

La fréquence décrit des achats simples ou des allers-retours complets selon `activityType`. Elle n'est pas multipliée une seconde fois par `sides`.

## 5. Formules par opération

### Commission

```text
commissionCostEur = commissionPerSideEur × sides
```

### Change

```text
fxCostEur = orderAmountEur × fxPerConversionRate × sides
```

### Spread

Convention de validation : `spreadRate` représente le coût total du scénario sélectionné.

```text
spreadCostEur = orderAmountEur × spreadRate
```

Il n'est pas multiplié par `sides`.

### Slippage

Convention de validation : `slippageRate` représente le coût total du scénario sélectionné.

```text
slippageCostEur = orderAmountEur × slippageRate
```

Il n'est pas multiplié par `sides`.

### Coût total

```text
totalCostPerOperationEur = commissionCostEur
                         + fxCostEur
                         + spreadCostEur
                         + slippageCostEur
```

### Coût relatif à l'ordre

```text
costRatePerOperation = totalCostPerOperationEur / orderAmountEur
```

Ce résultat est indisponible si `orderAmountEur` n'est pas strictement positif.

## 6. Formules annuelles

```text
annualCostEur = totalCostPerOperationEur × annualOperations
```

```text
annualCostToCapitalRate = annualCostEur / capitalEur
```

Le ratio annuel sur capital est indisponible si `capitalEur` n'est pas strictement positif.

## 7. Seuil de couverture

```text
breakEvenGrossRatePerOperation = costRatePerOperation
```

Interprétation autorisée : performance brute minimale nécessaire pour couvrir les frictions du scénario.

Ce seuil ne mesure pas :

- la probabilité de gain ;
- le rendement futur ;
- l'intérêt économique global ;
- la fiscalité ;
- le risque ;
- le coût d'opportunité.

## 8. Décomposition

Pour chaque composante :

```text
componentShare = componentCostEur / totalCostPerOperationEur
```

Si le coût total vaut zéro :

- chaque part doit être affichée comme `0 %` ou indisponible selon le composant visuel ;
- aucune division par zéro ;
- le texte doit préciser que le scénario ne contient aucune friction saisie.

La somme des valeurs internes des composantes doit être exactement égale au coût total dans la précision numérique utilisée.

## 9. Scénarios comparatifs

### Scénario actuel

Copie exacte des entrées.

### Ordre ×2

```text
orderAmountEur' = orderAmountEur × 2
```

Toutes les autres entrées sont inchangées.

Conséquences attendues :

- commission inchangée ;
- change, spread et slippage doublés ;
- coût total augmente ;
- coût relatif de la commission diminue ;
- aucune interprétation prescriptive.

### Fréquence ÷2

```text
monthlyFrequency' = monthlyFrequency / 2
```

Toutes les autres entrées sont inchangées.

Conséquences attendues :

- coût par opération inchangé ;
- coût relatif par opération inchangé ;
- coût annuel divisé par deux ;
- ratio annuel sur capital divisé par deux si disponible.

## 10. Arrondis d'affichage

Les calculs internes conservent la précision native du type numérique.

Affichage recommandé :

- EUR : deux décimales ;
- pourcentage : deux décimales ;
- parts de composantes : une décimale ou deux si nécessaire ;
- fréquence : deux décimales maximum sans zéros inutiles.

Les tests doivent comparer les valeurs internes avant formatage. Les chaînes affichées sont testées séparément.

## 11. Scénarios de référence obligatoires

Le moteur doit reproduire exactement les cinq scénarios de `go_to_market/DEMO_SCENARIOS.md`.

Invariants supplémentaires :

1. tous les coûts à zéro donnent un coût total et annuel exactement nuls ;
2. fréquence nulle donne un coût annuel nul sans modifier le coût par opération ;
3. doubler uniquement la commission modifie uniquement la commission et les agrégats dépendants ;
4. doubler uniquement le change modifie uniquement le change et les agrégats dépendants ;
5. doubler uniquement le spread modifie uniquement le spread et les agrégats dépendants ;
6. doubler uniquement le slippage modifie uniquement le slippage et les agrégats dépendants ;
7. modifier le capital ne modifie pas le coût par opération ni le coût annuel, seulement le ratio annuel sur capital ;
8. modifier la fréquence ne modifie pas le coût par opération ;
9. passer de `single_buy` à `round_trip` double seulement les composantes par côté : commission et change ;
10. aucun résultat ne doit contenir `NaN`, `Infinity` ou `-0` affiché.

## 12. Provenance

Chaque résultat doit pouvoir exposer :

- nom de la composante ;
- valeur saisie ;
- unité ;
- statut ;
- provenance `user_assumption` pour cette version ;
- valeur calculée en EUR.

Les scénarios préremplis sont marqués `synthetic_demo`, jamais `observed` ou `contractual`.

## 13. Sérialisation et partage

Le rapport partagé peut sérialiser uniquement :

- version du calcul ;
- type d'activité ;
- montant d'ordre ;
- fréquence ;
- paramètres de coût ;
- résultats calculés.

Le capital exact est exclu par défaut. Email, pseudonyme et réponses au formulaire sont toujours exclus.

Les données doivent être validées à nouveau après désérialisation. Un lien modifié ne peut pas contourner la validation.

## 14. Versionnement

Le calculateur doit exposer une constante de version, par exemple :

```text
CALCULATION_VERSION = "cost-intelligence-validation-1"
```

Toute modification future d'une formule ou convention exige :

- nouvelle version ;
- mise à jour de ce document ;
- mise à jour des scénarios ;
- tests de non-régression ;
- distinction entre résultats produits par les différentes versions.
