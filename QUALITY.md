# Breaktest - standard de qualité

## Ordre de priorité

1. Exactitude.
2. Fonctionnement réel.
3. Utilité décisionnelle.
4. Auditabilité.
5. Cohérence.
6. Simplicité.
7. Crédibilité commerciale.
8. Qualité visuelle.
9. Richesse fonctionnelle.

## Définition d'une fonctionnalité terminée

Une fonctionnalité n'est pas terminée parce qu'elle est visible. Elle doit :

- produire un résultat réel et reproductible ;
- gérer les entrées invalides et les états d'erreur ;
- avoir des règles et hypothèses explicites ;
- être couverte par des tests pertinents ;
- ne pas dégrader les fonctions déjà validées ;
- être cohérente avec la documentation et le discours commercial.

## Données et affirmations

Toujours distinguer :

- données observées ;
- données calculées ;
- hypothèses ;
- estimations ;
- exemples synthétiques ;
- résultats non encore vérifiés.

Ne jamais inventer silencieusement une donnée, un test réussi, une traction ou une intégration fonctionnelle.

## Validation stricte des données numériques source

- une donnée source numérique obligatoire est classée comme `valid`, `missing` ou `invalid` avant tout calcul ;
- un zéro numérique réel est une valeur valide et ne doit jamais être confondu avec une absence ;
- une valeur explicitement fournie mais invalide ne peut pas être remplacée par un fallback ou une dérivation ;
- lorsqu'un seul des deux champs brut PnL/rendement manque, il peut être dérivé uniquement à partir de l'autre champ et d'un nominal tous deux valides ;
- la provenance dérivée doit être conservée pour permettre son audit ;
- une ligne invalide ne doit pas être supprimée silencieusement : le lot est refusé et l'erreur est signalée.

## Isolation temporelle des modèles

- chaque décision doit être évaluée avec un modèle construit uniquement à partir des observations autorisées et disponibles avant cette décision ;
- une observation d'entraînement n'est admissible que si ses dates d'entrée et de sortie sont valides, cohérentes et si sa sortie est strictement antérieure à l'entrée de la décision ;
- une observation future, de même date ou issue d'un échantillon interdit ne doit jamais modifier une décision antérieure ;
- une ligne live ne peut pas entraîner le modèle de référence backtest ;
- une décision dont la date d'entrée est absente ou invalide doit être placée en observation avec un diagnostic explicite ;
- le modèle, la profondeur d'entraînement et les exclusions doivent rester attachés à chaque décision afin d'être auditables ;
- toute mention « OOS strict » ou « walk-forward » est interdite tant que l'ensemble de la chaîne, notamment l'allocation du turnover, n'est pas lui-même strictement chronologique.

## Qualité quantitative

- documenter les formules importantes ;
- utiliser des scénarios de référence calculés indépendamment ;
- tester les invariants ;
- signaler les limites statistiques ;
- ne pas ajouter une métrique pour son apparence sophistiquée ;
- distinguer métriques au niveau des trades et métriques calendaires ;
- éviter look-ahead, cherry-picking et suppression rétrospective trompeuse des perdants.

## Qualité visuelle

Chaque composant doit servir à comprendre, comparer, diagnostiquer, décider, paramétrer ou exporter.

Éviter :

- cartes décoratives ;
- chiffres sans origine ;
- animations gratuites ;
- interactions factices ;
- design générique de dashboard IA ;
- densité excessive ;
- apparence qui promet plus que le moteur réel.

## Validation technique attendue

Selon la modification :

- tests unitaires ;
- tests d'invariants ;
- tests d'intégration ;
- tests end-to-end ;
- lint et vérification des types ;
- build ;
- lancement réel dans un navigateur ;
- inspection mobile et desktop ;
- contrôle des états loading, empty, error et success.

Ne jamais déclarer un contrôle réussi sans l'avoir exécuté.
