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

## Séparation des bases observées et simulées

- le brut observé, le net fixe observé, le full-cost observé et le résultat simulé sont des bases distinctes ;
- une base observée ne peut jamais être écrasée ou modifiée par les hypothèses de coûts actives ;
- le scénario simulé doit rester identifiable comme calcul Breaktest et ne pas être présenté comme une valeur du journal ;
- une valeur optionnelle entièrement absente peut utiliser un fallback documenté vers la base précédente ;
- un fallback doit conserver sa provenance et la base dont il provient ;
- lorsqu'un seul membre PnL/rendement manque, la dérivation exige l'autre membre et un nominal valides ;
- un zéro observé est conservé comme zéro et ne déclenche aucun fallback ;
- une valeur explicitement fournie mais invalide fait échouer le lot ;
- si PnL et rendement sont tous deux fournis mais incompatibles, H2 conserve les valeurs et expose l'anomalie : aucune réconciliation silencieuse n'est autorisée avant H4 ;
- lors d'un redimensionnement du nominal, le PnL fourni reste l'autorité de mise à l'échelle ; le rendement fourni reste conservé pour l'audit ;
- la base sélectionnée doit être visible dans les KPI, le ledger, la courbe, l'audit et l'export ;
- C4 applique une seule fois, à la sortie, le PnL de la base sélectionnée ;
- une base nette observée ne doit jamais subir une seconde soustraction des coûts simulés ;
- le filtre ex ante et la base de résultat doivent rester conceptuellement séparés : choisir une base observée ne réécrit pas rétroactivement les règles de décision.

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
- une nouvelle réservation ne peut être acceptée que si le capital libre avant l'entrée couvre le nominal demandé ;
- une perte réalisée peut rendre le capital libre négatif alors que d'autres positions restent ouvertes ; cet état doit rester visible et aucune nouvelle entrée ne peut être financée, car C4 ne simule pas les appels de marge ou liquidations forcées ;
- une date invalide, une sortie antérieure à l'entrée, un nominal invalide ou un PnL sélectionné non fini produit `observe` sans réservation ;
- une décision déjà `remove` ou `observe` ne réserve rien ;
- chaque décision conserve le capital réalisé, réservé et libre avant/après, le nominal demandé, la date de libération et le motif ;
- le pic de capital réservé, le minimum de capital libre et les refus de financement doivent être exposés ;
- les agrégats de turnover doivent être recalculés sur les décisions finalement financées.

## Trésorerie réalisée aux sorties

- la courbe commence exactement au capital initial ;
- l'entrée d'une position réserve son nominal mais ne crée aucun PnL ;
- le PnL sélectionné d'une décision finalement `keep` est appliqué une seule fois, uniquement à sa date de sortie valide ;
- les sorties d'une date sont agrégées et traitées avant les entrées de cette même date ;
- un gain ou une perte ne modifie la capacité de financement qu'à partir de sa réalisation ;
- une décision `remove` ou `observe` ne contribue jamais à la courbe ;
- une date de sortie invalide ne peut pas être remplacée silencieusement par l'entrée ou la fin de série ;
- ajouter, supprimer ou modifier un événement futur ne doit jamais changer un point de courbe ou une décision antérieurs ;
- le dernier point doit égaler le capital initial plus la somme des PnL sélectionnés des trades financés et sortis valides ;
- à chaque événement, `capital libre = capital réalisé - nominal réservé` doit être réconcilié ;
- chaque événement conserve sa date, son type, le capital réalisé, le nominal réservé, le capital libre, le PnL appliqué et les décisions concernées avant et après ;
- l'expression autorisée est « courbe de trésorerie réalisée aux sorties » ;
- les expressions « mark-to-market », « valorisation quotidienne » ou « portefeuille entièrement simulé » restent interdites tant que ces comportements ne sont pas implémentés et validés.

## Provenance des coûts — règle Cost Intelligence

Toute composante de coût doit être classée comme :

- **observée** : montant présent dans un relevé ou une transaction ;
- **contractuelle** : valeur issue d'un barème identifié, daté et sourcé ;
- **estimée** : valeur calculée, par exemple spread ou slippage ;
- **hypothèse utilisateur** : paramètre saisi sans preuve externe ;
- **démonstration synthétique** : exemple construit et explicitement non observé.

Règles :

- ne jamais présenter un coût estimé comme payé ;
- afficher l'unité, le dénominateur, la source et la date ;
- une valeur contractuelle périmée doit être signalée ;
- ne pas additionner deux coûts qui représentent la même friction ;
- afficher chaque composante avant l'agrégat ;
- tester indépendamment commissions, change, spread, slippage et fréquence ;
- l'arrondi est réservé à l'affichage ;
- un résultat de seuil économique ne constitue pas une recommandation.

## Qualité Capital Efficiency

### Hiérarchie de valeur

- sans avantage brut fourni, le résultat principal est le seuil brut de couverture ;
- avec avantage brut positif, les résultats principaux sont la part conservée et la marge nette ;
- avec avantage brut nul ou négatif, la marge nette reste calculable mais les ratios de rétention sont indisponibles ;
- le coût en euros explique les résultats, mais ne peut plus constituer seul la proposition de valeur centrale.

### Contrat économique

- séparer coût fixe diluable et plancher variable ;
- `break_even_gross_rate` doit rester supérieur ou égal au plancher variable ;
- `gross_edge_eur - total_cost_eur = net_edge_eur` doit être réconcilié ;
- une part d'avantage conservée négative ne doit jamais être tronquée ;
- une contrainte impossible doit produire `structurally_unreachable` ;
- une frontière non bornée dans un scénario de coût nul ne doit jamais afficher `Infinity` ;
- fréquence et taille doivent agir uniquement sur les métriques prévues par le contrat ;
- les projections annuelles doivent être qualifiées d'arithmétiques, sans capitalisation ni positions simultanées.

### Contraintes inverses

Une taille, une fréquence ou un rendement brut requis ne peut être affiché que si :

- la condition utilisateur est visible ;
- la formule et le dénominateur sont définis ;
- les états indisponibles sont traités ;
- la sortie n'est pas formulée comme optimale, recommandée ou probable.

### Preuve minimale

Le noyau Capital Efficiency exige :

- oracle principal calculé indépendamment ;
- tests des cas zéro, absent, invalide, négatif et positif ;
- tests d'invariants ;
- monotonie du seuil avec la taille lorsque le coût fixe est positif ;
- convergence vers le plancher variable ;
- indépendance du seuil par rapport à la fréquence ;
- proportionnalité du coût annuel à la fréquence ;
- absence de `NaN`, `Infinity` et `-0` visibles ;
- exécution Chromium mobile et desktop ;
- intégrité locale sans service externe ;
- non-régression du moteur historique et du calculateur Q0.

## Qualité de la validation commerciale

- un visiteur, un email ou un compliment n'est pas une preuve de paiement ;
- une intention déclarée n'est pas un achat ;
- mesurer activation, seconde utilisation, demande d'import, paiement et remboursement ;
- ne jamais fabriquer de faux avis, compteurs, économies ou partenaires ;
- ne pas sélectionner uniquement les retours favorables ;
- conserver les objections et abandons ;
- déclarer le trafic non qualifié séparément ;
- ne pas construire une fonction avant d'identifier la preuve qu'elle doit obtenir ;
- tout paiement de réservation doit indiquer clairement que le produit complet n'est pas encore disponible ;
- la validation doit pouvoir conduire à l'abandon du produit.

## Frontière produit / conseil

- calculer l'impact de paramètres saisis est autorisé dans le périmètre produit ;
- ne pas recommander un instrument, un courtier, une fréquence ou une taille ;
- comparer des scénarios sans désigner automatiquement un gagnant ;
- ne pas adapter un résultat à la tolérance au risque, au patrimoine ou aux objectifs personnels ;
- ne pas transmettre ou exécuter d'ordre ;
- ne pas utiliser un avertissement comme substitut à une conception réellement non prescriptive.

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