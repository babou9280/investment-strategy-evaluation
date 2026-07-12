# Mission active — C2 isolation temporelle

Travaille uniquement sur la branche `codex/c2-temporal-isolation`. Ne modifie et ne fusionne rien dans `main`.

Lis d'abord `AGENTS.md`, `PRODUCT.md`, `QUALITY.md`, `STATE.md`, `DECISIONS.md`, `METHODOLOGY.md` et `docs/TECHNICAL_AUDIT.md`.

## Objectif unique

Corriger C2 : aucune observation future, de même date ou issue d'un échantillon interdit ne doit influencer le modèle utilisé pour une décision rejouée.

## Exigences

1. Construire un modèle distinct pour chaque décision.
2. Autoriser comme entraînement uniquement les lignes `backtest` dont les dates sont valides, cohérentes et dont la sortie est strictement antérieure à l'entrée de la décision.
3. Exclure la décision elle-même, les lignes live, les observations futures et les sorties de même date.
4. Classer une décision à date invalide en `observe`, avec un diagnostic explicite et sans entraînement.
5. Attacher à chaque évaluation son modèle et ses diagnostics de sélection temporelle.
6. Utiliser le modèle propre à chaque décision pour les calculs de seuil de rentabilité.
7. Retirer les affirmations « OOS strict », « walk-forward » et « sans ré-optimisation » tant que C3 reste ouvert ; afficher clairement que le turnover est encore ex post.
8. Ajouter des invariants prouvant que l'ajout d'une observation future ou live interdite ne modifie pas une décision antérieure.
9. Réexécuter intégralement les tests H1.
10. Mettre à jour les fichiers canoniques uniquement avec les résultats démontrés.

## Hors périmètre

- ne pas corriger C1, C3, C4 ou H2 à H6 ;
- ne pas refondre l'application ;
- ne pas modifier l'apparence au-delà des libellés nécessaires à la vérité méthodologique ;
- ne rien fusionner automatiquement dans `main`.

## Résultat attendu

Une correction C2 étroite et reproductible, un build déterministe, des tests navigateur anti-look-ahead, les preuves d'exécution et une pull request vers `breaktest-bootstrap`.
