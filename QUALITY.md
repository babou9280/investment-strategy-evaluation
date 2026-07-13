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
- le modèle, la profondeur d'entraînement et les exclusions doivent rester attachés à chaque décision afin d'être auditables.

## Allocation chronologique du turnover

- les décisions sont traitées par date d'entrée croissante ;
- le budget consommé avant une décision ne dépend que des décisions antérieures encore présentes dans la fenêtre glissante ;
- une opportunité future ne doit jamais modifier le statut ou les diagnostics d'une décision antérieure ;
- le plafond s'applique sur les 365,25 jours précédant chaque décision ;
- un classement par edge n'est autorisé qu'entre opportunités disponibles à la même date ;
- les égalités restantes sont résolues par une règle déterministe documentée ;
- une date invalide, une décision déjà retirée ou une décision en observation ne consomme aucun budget ;
- le budget avant et après, les unités demandées, le rang simultané et le motif doivent être conservés par décision ;
- le pic glissant réellement contraint doit être distingué de la moyenne annuelle descriptive ;
- tout retour à un tri global des opportunités de plusieurs dates selon leur edge est interdit.

## Réservation chronologique du capital

- seules les décisions encore `keep` après les contrôles antérieurs peuvent réserver du capital ;
- les entrées sont traitées chronologiquement par groupes de même date ;
- avant un groupe, les positions antérieures dont la sortie est antérieure ou égale à cette entrée libèrent leur nominal ;
- une position ouverte dans le groupe ne peut pas être libérée au milieu du même groupe, même si sa sortie est le même jour ;
- l'ordre de financement d'un groupe doit préserver la priorité simultanée déterminée par C3 ;
- le nominal complet est financé ou refusé : aucun redimensionnement silencieux n'est autorisé ;
- le capital réservé ne peut jamais dépasser le capital initial ;
- une date invalide, une sortie antérieure à l'entrée ou un nominal invalide produit `observe` sans réservation ;
- une décision déjà `remove` ou `observe` ne réserve rien ;
- le PnL ne modifie pas le capital disponible avant la sortie dans C1 ;
- chaque décision conserve le capital réservé et libre avant/après, le nominal demandé, la date de libération et le motif ;
- le pic de capital réservé, le minimum de capital libre et les refus de financement doivent être exposés ;
- les agrégats de turnover doivent être recalculés sur les décisions finalement financées.

Les expressions « portefeuille entièrement simulé », « courbe réalisée », « mark-to-market » ou équivalentes restent interdites tant que C4 n'est pas validé.

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
