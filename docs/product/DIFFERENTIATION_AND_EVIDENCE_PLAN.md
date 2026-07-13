# Breaktest — plan de différenciation et de preuve

## Statut

Document interne de construction de valeur. Il organise les preuves à obtenir ; il ne transforme aucune hypothèse en résultat validé.

## 1. Objectif

Breaktest doit produire deux types de valeur simultanément :

1. **valeur utilisateur** : une compréhension économique qui modifie ou éclaire une décision réelle ;
2. **valeur de preuve** : un ensemble auditable démontrant la qualité financière, technique et entrepreneuriale du projet.

## 2. Thèses différenciantes à tester

### T1 — Le seuil seul est plus utile que le coût seul

Preuve attendue : l'utilisateur peut expliquer le seuil et le relier à son hypothèse de rendement brut.

### T2 — La part d'avantage conservée est le meilleur résultat principal

Preuve attendue : lorsqu'un avantage brut est fourni, l'utilisateur comprend immédiatement ce qui subsiste après friction et trouve ce résultat plus utile que le total des frais.

### T3 — Les contraintes inverses créent une valeur supérieure

Preuve attendue : une taille minimale conditionnelle, une fréquence frontière ou un rendement requis répond à une question que l'utilisateur calculait auparavant manuellement ou ne savait pas résoudre.

### T4 — Le plancher variable évite de fausses solutions

Preuve attendue : le produit explique correctement qu'une augmentation de taille ne compense pas une friction proportionnelle supérieure à l'avantage brut.

### T5 — La provenance et les plages d'incertitude augmentent la confiance

Preuve attendue : l'utilisateur distingue une commission observée d'un spread hypothétique et ne croit pas à tort que toutes les valeurs ont été effectivement payées.

## 3. Matrice problème → fonction → preuve

| Problème | Fonction candidate | Preuve minimale | Gate |
|---|---|---|---|
| Coût total peu interprétable | seuil brut de couverture | compréhension correcte sans aide | maintenir |
| Avantage brut absorbé | Edge Survival | décision ou surprise documentée | approfondir |
| Taille arbitraire | taille minimale conditionnelle | usage réel d'une contrainte | maintenir si récurrent |
| Fréquence trop coûteuse | budget annuel et fréquence frontière | seconde analyse ou comparaison | maintenir si utile |
| Coût implicite incertain | plages et sensibilité | meilleure compréhension sans confusion | construire après labo |
| Historique difficile à réconcilier | import local et Evidence Ledger | trois demandes et fichiers comparables | construire après preuve |
| Barèmes dispersés | base contractuelle versionnée | demande répétée et coût de maintenance viable | construire après volume |
| Comparaison indépendante | benchmarks consentis | données suffisantes et cadre juridique | long terme |

## 4. Preuves techniques à accumuler

### Quantitatives

- oracles indépendants ;
- identités de réconciliation ;
- tests de monotonicité ;
- convergence vers le plancher variable ;
- traitement des cas inatteignables ;
- tolérances numériques documentées ;
- absence d'arrondi interne ;
- sensibilité aux hypothèses.

### Ingénierie

- build et exécution reproductibles ;
- historique des défauts et tests de non-régression ;
- frontières de module ;
- accessibilité ;
- confidentialité ;
- absence de services externes implicites ;
- documentation versionnée.

### Produit

- temps jusqu'au premier résultat compris ;
- capacité à reformuler le résultat ;
- décision concrète éclairée ;
- retour pour une seconde analyse ;
- demande d'import ;
- disposition à payer ;
- motifs d'abandon.

## 5. Portefeuille de démonstrations futures

Chaque démonstration doit rester synthétique jusqu'à autorisation de données réelles.

### Démonstration A — Coût fixe dominant

Montre que la taille réduit fortement le seuil, jusqu'à proximité du plancher variable.

### Démonstration B — Coût variable dominant

Montre qu'une taille supérieure résout peu ou pas le problème.

### Démonstration C — Avantage entièrement absorbé

Montre une marge nette négative sans transformer le résultat en recommandation.

### Démonstration D — Cible de rétention inatteignable

Explique pourquoi aucune taille finie ne satisfait la contrainte sous les hypothèses.

### Démonstration E — Budget annuel

Montre la différence entre seuil par opération et coût annuel dépendant de la fréquence.

### Démonstration F — Incertitude

Montre comment une plage de spread/slippage modifie la survie de l'avantage.

## 6. Dossier de candidature académique

Le projet doit pouvoir produire, le moment venu :

1. une note de recherche courte sur le mécanisme coût fixe/plancher variable ;
2. un contrat quantitatif public et compréhensible ;
3. un benchmark synthétique reproductible ;
4. une démonstration interactive ;
5. un journal de décisions produit ;
6. une étude de marché honnête ;
7. des résultats de tests utilisateurs, y compris négatifs ;
8. une architecture et une suite de tests ;
9. une analyse réglementaire prudente ;
10. un récapitulatif des apprentissages et pivots.

### Pour une école de commerce

Mettre en avant :

- découverte du problème ;
- segmentation et modèle économique ;
- arbitrages ;
- validation ;
- distribution ;
- gestion des risques ;
- potentiel de plateforme.

### Pour une école d'ingénierie

Mettre en avant :

- spécification ;
- modélisation ;
- validation numérique ;
- invariants ;
- architecture ;
- sécurité ;
- reproductibilité ;
- limites statistiques.

## 7. Ce qui ne constitue pas une preuve

- nombre de lignes de code ;
- sophistication visuelle ;
- quantité de métriques ;
- résumé produit par une IA ;
- intention déclarée de payer ;
- compliment ;
- capture d'écran ;
- simulation synthétique présentée comme traction ;
- « conformité » sans audit applicable.

## 8. Critère de différenciation immédiate

Lors d'une démonstration de 90 secondes, un observateur doit pouvoir comprendre que Breaktest ne se limite pas à additionner des frais.

Il doit voir :

1. ce qui est supposé ;
2. le plancher de friction ;
3. ce qui reste de l'avantage ;
4. une contrainte inverse ;
5. un cas que la taille ne peut pas résoudre ;
6. la preuve mathématique et les limites.

## 9. Critère de passage à la suite

Le laboratoire peut devenir le nouveau prototype critique seulement si :

- les calculs passent les tests ;
- l'expérience est compréhensible ;
- le résultat principal est supérieur au calculateur Q0 ;
- aucune fonction n'est présentée comme commercialement validée ;
- le produit reste non prescriptif ;
- une prochaine expérience utilisateur précise est définie.
