# Breaktest — thèse de plateforme de classe mondiale

## Statut

- Document de direction produit interne.
- Il ne constitue ni une promesse commerciale, ni une preuve de marché, ni une autorisation de développer toutes les fonctions décrites.
- Toute fonction reste soumise aux gates de validation, aux standards quantitatifs et aux règles de conformité du projet.

## 1. Ambition utile

Breaktest ne doit pas devenir le calculateur de frais le plus décoré.

Il doit devenir la couche la plus claire, rigoureuse et actionnable pour répondre à une question économique précise :

> Un avantage brut supposé ou observé survit-il réellement aux frictions, avec ce capital, cette taille d'ordre, cette fréquence et cette qualité d'exécution ?

La différenciation immédiate recherchée vient de la combinaison suivante :

1. calculs inverses, pas seulement addition de coûts ;
2. séparation entre coûts diluables et plancher variable ;
3. explicitation de la part d'avantage absorbée et conservée ;
4. scénarios et frontières économiques sans recommandation personnalisée ;
5. provenance, incertitude et limites visibles ;
6. validation reproductible et auditabilité de chaque résultat.

## 2. Hiérarchie de valeur

### Niveau 0 — Décrire

- montant total des coûts ;
- ventilation commission, change, spread et slippage ;
- coût annuel arithmétique.

Ce niveau est nécessaire, mais insuffisant comme proposition de valeur centrale.

### Niveau 1 — Expliquer

- seuil brut de couverture ;
- plancher variable ;
- coût fixe diluable ;
- part fixe et variable ;
- effet de la taille et de la fréquence.

### Niveau 2 — Diagnostiquer

- marge nette après frictions ;
- part de l'avantage absorbée ;
- part conservée ;
- contrainte structurellement impossible ;
- sensibilité aux hypothèses.

### Niveau 3 — Résoudre une contrainte

- taille d'ordre requise pour une marge positive ;
- taille requise pour conserver une fraction choisie de l'avantage ;
- rendement brut requis pour une cible nette ;
- fréquence frontière sous budget annuel de friction ;
- combinaison de paramètres compatible avec une contrainte explicite.

### Niveau 4 — Prouver sur données réelles

Uniquement après validation commerciale et import conforme :

- réconciliation brut/net ;
- coûts observés contre coûts contractuels et estimés ;
- évolution du cost drag ;
- comparaison par devise, marché, courtier et taille ;
- intervalle de coût implicite ;
- historique des hypothèses et méthodes.

### Niveau 5 — Apprendre collectivement

Uniquement avec consentement, sécurité, volume et avis juridique :

- benchmarks anonymisés ;
- écarts annoncé/observé ;
- distribution des coûts par segment ;
- données d'exécution agrégées ;
- API et intégrations.

## 3. Expérience centrale future

L'expérience de référence doit être structurée autour de quatre vues cohérentes.

### 3.1 Edge Survival

Question : quelle part de l'avantage brut subsiste ?

Sorties principales :

- avantage brut saisi ou observé ;
- seuil de couverture ;
- marge nette ;
- part absorbée ;
- part conservée ;
- provenance et domaine de validité.

### 3.2 Capital Efficiency Frontier

Question : quelles contraintes économiques doivent être satisfaites ?

Représentation descriptive :

- axe horizontal : taille d'ordre ;
- axe vertical : fréquence ou seuil brut ;
- frontière : ensemble des points satisfaisant une contrainte explicitement choisie ;
- zones nommées « contrainte satisfaite » et « contrainte non satisfaite », jamais « bon » ou « mauvais trade ».

### 3.3 Friction Budget

Question : quel budget annuel de friction l'activité consomme-t-elle ?

Sorties :

- budget saisi ;
- coût annuel arithmétique ;
- fréquence frontière ;
- écart au budget ;
- ventilation des composantes contrôlables et non directement contrôlables.

### 3.4 Evidence Ledger

Question : pourquoi le résultat est-il crédible ?

Chaque résultat futur doit conserver :

- entrées ;
- unités ;
- dénominateurs ;
- provenance ;
- formule et version ;
- date de référence ;
- hypothèses ;
- arrondi d'affichage ;
- limites ;
- résultat des contrôles de cohérence.

## 4. Fonctionnalités à forte valeur, par ordre de preuve

### P0 — laboratoire interne actuel

- Edge Survival déterministe ;
- contraintes inverses ;
- états indisponibles explicites ;
- scénarios synthétiques ;
- tests de réconciliation et monotonie.

### P1 — test utilisateur sans import

Seulement après critique interne :

- mode seuil seul ;
- mode avantage brut ;
- mode budget de friction ;
- carte de sensibilité ;
- export méthodologique ;
- aucun compte ni donnée réelle.

### P2 — historique local minimal

Seulement après demande répétée d'import :

- un format réel prioritaire ;
- séparation observé/contractuel/estimé ;
- réconciliation ligne/agrégat ;
- comparaison avant/après ;
- aucune synchronisation courtier complète.

### P3 — portefeuille et décisions répétées

Seulement après usage récurrent et paiement :

- historique des analyses ;
- comparaison de périodes ;
- alertes descriptives de dérive ;
- budget de friction par portefeuille ;
- suivi du plancher variable.

### P4 — benchmarks et distribution

Seulement avec base légale, consentement et données suffisantes :

- benchmarks anonymisés ;
- widgets ;
- API ;
- partenariats ;
- comparaison indépendante.

## 5. Ce qui doit immédiatement différencier Breaktest

### 5.1 Calcul inverse

Les outils standards montrent souvent un coût. Breaktest doit calculer la contrainte qui en découle.

Exemples :

- « Il faut un avantage brut de X % pour couvrir ce scénario. »
- « Au-delà du plancher variable, la taille ne peut plus résoudre le problème. »
- « Pour conserver R % de l'avantage saisi, le nominal mathématique doit dépasser N. »
- « Sous un budget annuel B, la frontière de fréquence est M. »

Ces formulations restent descriptives et conditionnelles.

### 5.2 Limites structurelles visibles

Une réponse « impossible sous ces hypothèses » est plus utile qu'un nombre spectaculaire ou infini.

### 5.3 Incertitude honnête

Lorsque spread ou slippage ne sont pas observés, la future plateforme doit préférer :

- une plage ;
- trois scénarios explicites ;
- une provenance ;
- une analyse de sensibilité ;

plutôt qu'une estimation unique présentée avec une fausse précision.

### 5.4 Preuve plutôt que score

Aucun score global opaque ne doit remplacer :

- le seuil ;
- la marge ;
- les contraintes ;
- la provenance ;
- les limites.

### 5.5 Neutralité démontrable

Toute future comparaison commerciale doit séparer :

- méthode ;
- données ;
- rémunération ;
- classement ;
- conflits d'intérêts.

## 6. Défensibilité

Le calcul pur est copiable. La défensibilité potentielle vient de l'accumulation de :

1. contrats quantitatifs versionnés ;
2. corpus de cas limites et d'oracles ;
3. parseurs de relevés ;
4. historique individuel ;
5. benchmarks consentis ;
6. méthodes de réconciliation ;
7. intégrations ;
8. réputation de neutralité ;
9. qualité de la documentation et de la preuve.

## 7. Valeur académique et professionnelle

Le projet doit pouvoir être présenté sans exagération comme une démonstration intégrée de :

### Finance et quantitatif

- microstructure et transaction costs ;
- effet des coûts fixes et proportionnels ;
- turnover et allocation du capital ;
- performance brute contre nette ;
- validation temporelle ;
- gouvernance des métriques.

### Ingénierie

- spécification formelle ;
- moteur déterministe ;
- validation stricte ;
- tests d'invariants ;
- non-régression ;
- accessibilité ;
- privacy by design ;
- documentation reproductible.

### Entrepreneuriat

- insight issu d'un problème réel ;
- segmentation ;
- proposition de valeur ;
- validation commerciale ;
- économie du produit ;
- gates d'investissement ;
- stratégie de données et de distribution.

La valeur de candidature ne doit pas dépendre d'affirmations de traction inventées. Elle doit venir de la profondeur du raisonnement, de la qualité d'exécution, des preuves et de l'honnêteté des limites.

## 8. Barre de qualité mondiale

Une fonction n'entre dans le produit que si elle satisfait simultanément :

1. problème utilisateur précis ;
2. définition financière claire ;
3. formule et unités ;
4. provenance ;
5. cas indisponibles ;
6. test indépendant ;
7. utilité décisionnelle ;
8. formulation non prescriptive ;
9. expérience accessible ;
10. preuve commerciale ou rôle explicite dans une expérience de validation.

## 9. Critères d'échec de la thèse

La direction doit être réduite ou révisée si :

- les utilisateurs ne peuvent pas formuler d'avantage brut ou de contrainte utile ;
- les contraintes inverses ne changent aucune décision réelle ;
- le produit reste utilisé une seule fois ;
- la valeur principale devient seulement la comparaison de courtiers ;
- l'incertitude des coûts implicites rend les résultats trop fragiles ;
- l'import et la réconciliation exigent trop de support manuel ;
- la cible ne paie pas davantage pour le diagnostic que pour un calculateur simple.

## 10. Règle de séquence

Le produit mondial est une destination conditionnelle. La prochaine preuve reste beaucoup plus petite :

> Le laboratoire Edge Survival produit-il une compréhension et une décision plus utiles qu'un simple total de frais ?
