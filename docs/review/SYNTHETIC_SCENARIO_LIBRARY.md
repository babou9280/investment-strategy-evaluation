# Breaktest — bibliothèque de scénarios synthétiques

## Statut

- Tous les scénarios sont synthétiques.
- Ils servent à vérifier les comportements du moteur et à préparer les futures revues utilisateur.
- Ils ne constituent ni des tarifs de courtier, ni des performances observées, ni des conseils.
- Les entrées et oracles machine-readable sont conservés dans `capital_efficiency_lab/tests/scenarios.json`.

## 1. Coût fixe dominant

### Question

Que se passe-t-il lorsque deux euros de commission s'appliquent à un ordre de seulement 100 euros ?

### Résultat central

- seuil brut : 2 % ;
- rendement brut supposé : 3 % ;
- part conservée : 33,33 % ;
- frontière de taille pour une marge positive : 66,67 EUR ;
- frontière pour conserver 50 % : 133,33 EUR.

### Valeur pédagogique

Montre clairement que la taille peut diluer un coût fixe.

## 2. Plancher variable dominant

### Question

Une taille d'ordre supérieure résout-elle des frictions entièrement proportionnelles ?

### Résultat central

- coût fixe : zéro ;
- plancher variable : 0,70 % ;
- seuil brut : 0,70 % quelle que soit la taille dans ce modèle ;
- avantage brut : 0,80 % ;
- part conservée : 12,50 %.

### Valeur pédagogique

Montre qu'une taille supérieure ne diminue pas le plancher variable et qu'aucun minimum positif n'est imposé par les coûts fixes.

## 3. Avantage entièrement absorbé

### Question

Comment représenter un rendement brut inférieur au seuil sans masquer le résultat négatif ?

### Résultat central

- rendement brut : 1,00 % ;
- seuil : 1,10 % ;
- marge nette : −0,10 % ;
- part conservée : −10 % ;
- état : `edge_fully_absorbed`.

### Valeur pédagogique

Vérifie qu'une part conservée négative reste visible et que le produit ne transforme pas un échec en avertissement favorable.

## 4. Avantage sous le plancher variable

### Question

Une taille supérieure peut-elle résoudre un rendement brut de 0,60 % lorsque le plancher variable vaut 0,70 % ?

### Résultat central

- marge nette négative ;
- frontière de taille positive : `structurally_unreachable` ;
- frontière de rétention : `structurally_unreachable`.

### Valeur pédagogique

C'est la démonstration la plus importante contre une pseudo-optimisation de taille.

## 5. Budget annuel de friction

### Question

Quelle fréquence arithmétique reste compatible avec un budget annuel de 2 % du capital ?

### Résultat central

- coût par scénario : 3 EUR ;
- fréquence saisie : 10 opérations par mois ;
- coût annuel : 360 EUR, soit 3,60 % du capital ;
- fréquence frontière : 5,56 opérations mensuelles.

### Valeur pédagogique

Distingue le seuil par opération de l'impact annuel dépendant de la fréquence.

## 6. Marge nette cible sans avantage prévu

### Question

Quel brut est mathématiquement requis pour une marge nette cible sans prétendre prévoir le rendement ?

### Résultat central

- seuil brut : 0,25 % ;
- marge nette cible : 1 % ;
- brut requis : 1,25 %.

### Valeur pédagogique

Montre qu'une contrainte peut être calculée sans que Breaktest fournisse ou endosse un avantage attendu.

## 7. Règles d'utilisation en revue

- présenter un seul scénario à la fois ;
- demander au participant de reformuler le résultat avant toute explication ;
- ne pas demander lequel paraît « meilleur » ;
- ne pas convertir une frontière en recommandation ;
- conserver la provenance `synthetic_demo` ;
- ne pas ajouter de cas spectaculaire uniquement pour impressionner ;
- choisir le scénario selon la question de compréhension testée.

## 8. Preuve attendue

La bibliothèque est utile si elle démontre simultanément :

- la dilution d'un coût fixe ;
- la convergence vers un plancher variable ;
- la conservation d'une marge négative ;
- une impossibilité structurelle ;
- la dépendance annuelle à la fréquence ;
- une contrainte calculable sans prédiction.
