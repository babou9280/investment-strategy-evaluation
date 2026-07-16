# Breaktest Cost Gate — architecture analytique vNext

## 1. Statut

- Nature : architecture produit, financière et quantitative interne.
- Décision fondatrice : Ayman a suspendu le 16 juillet 2026 le recrutement Gate 1 pour approfondir le modèle avant toute cohorte.
- Relation avec la PR `#26` : le prototype hors ligne reste une preuve technique et une sonde d'interface. Il n'est plus le candidat actuel à une observation utilisateur.
- Données : aucune donnée externe n'est autorisée par ce document.
- Code : ce document n'autorise pas l'implémentation immédiate d'un modèle de market impact, d'une probabilité d'exécution ou d'une recommandation.

L'objectif n'est pas de rendre le prototype existant plus impressionnant. Il est de construire une base qui puisse accueillir des coûts contractuels, des hypothèses, des estimations de microstructure et des observations d'exécution sans les mélanger ni les compter deux fois.

## 2. Ce que le noyau actuel démontre

Le moteur `cost-gate-foundation-3-synthetic` démontre correctement, dans son domaine déclaré :

- une friction composée d'un coût fixe et de taux proportionnels ;
- un seuil brut de couverture ;
- un plancher variable ;
- une marge nette ponctuelle ou sur trois hypothèses ;
- une faisabilité cash immédiate sous allocation déclarée ;
- un alignement strict de l'avantage brut ;
- des constats multiples, une provenance et un snapshot versionné ;
- le refus des données manquantes, conflictuelles ou hors domaine.

Cette base reste utile. Elle ne doit pas être jetée ni présentée comme un modèle d'exécution complet.

## 3. Limite structurelle découverte

La friction courante est essentiellement :

```text
coût = coûts fixes + nominal × somme des taux proportionnels
```

Cette géométrie est exacte pour les composantes réellement définies ainsi. Elle devient insuffisante dès que le produit veut représenter :

- une commission minimale, un palier ou un barème conditionnel ;
- une taxe asymétrique entre achat et vente ;
- un spread rattaché à un prix et à un instant précis ;
- plusieurs exécutions partielles ;
- un impact dépendant de la taille, du volume, de la volatilité ou de la durée ;
- un ordre limite non exécuté ou partiellement exécuté ;
- un coût d'attente ou d'opportunité ;
- une différence entre coût estimé avant l'ordre et coût mesuré après l'ordre ;
- une incertitude de coût ;
- un chevauchement de positions et une réservation chronologique du capital.

Ajouter directement ces éléments comme de nouveaux champs numériques créerait un moteur fragile, difficile à auditer et exposé au double comptage.

## 4. Question produit cible

Le modèle vNext doit pouvoir répondre, sans choisir le trade :

> Sous les hypothèses et données explicitement disponibles, quelle partie de l'économie du scénario est connue, estimée, incertaine ou non évaluée, et dans quelles régions de taille, fréquence ou horizon la conclusion change-t-elle ?

Cette question est plus forte qu'un feu vert ou rouge. Elle produit une géométrie économique et un dossier de preuve.

## 5. Séparations non négociables

Le modèle doit distinguer :

```text
coût contractuel
coût estimé ex ante
coût observé ex post

prix de décision
prix d'arrivée
prix de soumission
prix d'exécution
prix de référence postérieur

quantité demandée
quantité exécutable estimée
quantité exécutée
quantité non exécutée

spread coté
effective spread observé
market impact estimé
slippage observé contre benchmark nommé
coût d'opportunité

hypothèse d'avantage
estimateur historique
fourchette de sensibilité
intervalle statistique

cash immédiat
coût économique du cycle
capital réservé dans le temps
exposition de portefeuille
```

Une valeur ne passe jamais d'une catégorie à une autre sans transformation documentée, versionnée et testée.

## 6. Architecture cible

### 6.1 Couche A — identité du scénario et horloge

Chaque analyse possède une identité économique stable :

```text
scenario_id
account_model
instrument_id
instrument_type
venue_id
side
operation_scope
order_intent_type
quantity
notional
account_currency
quote_currency
decision_time
arrival_time
submission_time
execution_window
holding_horizon_definition
settlement_convention
```

Les instants absents restent absents. Le moteur n'invente jamais un benchmark temporel.

### 6.2 Couche B — ledger canonique des coûts

Le coût n'est plus une liste de quatre scalaires. Il devient une collection de composants :

```text
cost_component = {
  component_id,
  economic_event_id,
  category,
  lifecycle_scope,
  side,
  calculation_kind,
  calculation_basis,
  benchmark,
  amount_currency,
  sign_convention,
  price_inclusion,
  edge_inclusion,
  cash_source_inclusion,
  provenance,
  observed_at,
  valid_until,
  uncertainty_kind,
  model_version,
  dependencies,
  input_status,
  evidence_status
}
```

Le ledger possède aussi une politique de couverture déclarant les événements économiques attendus. Une liste de lignes, même valide, ne prouve pas à elle seule qu'aucun coût n'a été oublié. La sortie autorisée est donc `complete_under_declared_policy`, jamais « coût complet » sans qualification.

Catégories prévues :

```text
commission
venue_fee
clearing_or_settlement_fee
tax
fx_cost
spread_cost
execution_cost_assumption
market_impact
delay_cost
opportunity_cost
financing_or_borrow_cost_future
other_contractual_cost
```

Formes de calcul prévues :

```text
fixed
proportional
minimum_or_maximum
tiered
piecewise
nonlinear_model
observed_difference
externally_supplied
```

Une forme non supportée retourne `not_assessed` ou `unsupported`. Elle n'est jamais approximée silencieusement par un taux proportionnel.

### 6.3 Couche C — réconciliation et prévention du double comptage

Chaque composant indique :

- s'il est déjà incorporé dans un prix ;
- s'il est déjà incorporé dans l'avantage brut ;
- s'il est déjà retranché par une source de cash ;
- le côté et le moment auxquels il s'applique ;
- le dénominateur utilisé ;
- la devise d'origine et la transformation de devise éventuelle.

Le moteur produit une matrice d'inclusion. Deux composants portant le même `economic_event_id` ou deux inclusions contradictoires bloquent les conclusions dépendantes. Il distingue aussi calculabilité, qualité de preuve et état temporel : une hypothèse peut rester calculable sans devenir actuelle ou fiable.

Le moteur ne peut pas deviner que deux sources ont attribué à tort deux identifiants différents au même événement. Ce risque résiduel exige provenance, réconciliation de source et revue hostile ; il ne doit pas être masqué par une promesse automatique de déduplication.

### 6.4 Couche D — enveloppe de coût ex ante

Lorsque le coût implicite n'est pas observé, le produit utilise une analyse de sensibilité explicite :

```text
cost_envelope = {
  low,
  base,
  high,
  construction_method,
  provenance,
  calibrated,
  domain,
  limitations
}
```

Les trois scénarios ne sont pas une distribution de probabilité. Ils ne deviennent un intervalle statistique qu'après validation d'une méthode, d'un échantillon et d'une couverture.

La sortie doit montrer :

- le seuil sous chaque scénario de coût ;
- la marge sous chaque croisement coût × avantage ;
- les changements d'état aux frontières ;
- les composantes responsables de l'écart ;
- les couches non évaluées.

### 6.5 Couche E — modèle de microstructure enfichable

Un modèle de market impact n'est pas universel. Un futur composant ne peut être activé que s'il déclare au minimum :

```text
model_id
instrument_domain
venue_domain
calibration_sample
calibration_period
fit_timestamp
input_features
functional_form
parameter_estimates
error_metrics
out_of_sample_evidence
validity_limits
fallback_policy = none
```

Les entrées plausibles comprennent taille relative au volume, participation, volatilité, durée et caractéristiques de l'instrument. Leur disponibilité ne prouve pas à elle seule la validité du modèle.

La littérature d'exécution montre que coût, market impact et risque de prix interagissent et que l'impact peut être non linéaire. Elle ne justifie pas de copier une loi de puissance dans Breaktest sans calibration appropriée.

### 6.6 Couche F — faisabilité temporelle du capital

La faisabilité devient une trajectoire, pas seulement une photographie :

```text
cash_timeline
settlement_timeline
position_open_interval
hold_ledger
strategy_allocation_timeline
peak_committed_capital
minimum_free_cash
gross_and_net_exposure
```

La fréquence n'est déclarée faisable que si durée de détention, chevauchement, règlement et réservations sont suffisamment décrits.

### 6.7 Couche G — qualité de l'avantage fourni

La clé d'alignement actuelle reste obligatoire. Elle est complétée par un dossier de preuve :

```text
edge_evidence = {
  provenance,
  estimator,
  sample_size,
  sample_period,
  in_sample_or_out_of_sample,
  dispersion,
  concentration,
  temporal_stability,
  selection_process,
  variants_tested,
  uncertainty_method,
  evidence_status
}
```

États envisagés :

```text
user_assumption_unverified
historical_estimate_incomplete
historical_estimate_described
historical_estimate_fragile
historical_estimate_out_of_sample_supported
synthetic_demo
```

Ces états n'impliquent aucune probabilité de réussite. Les métriques avancées restent conditionnelles aux standards quantitatifs du projet.

### 6.8 Couche H — TCA ex post séparée

Une future Transaction Cost Analysis doit comparer une exécution observée à un benchmark nommé et horodaté. Elle peut inclure :

- effective spread ;
- realized spread ;
- implementation shortfall ;
- market impact observé selon la méthode ;
- timing ou delay cost ;
- coûts explicites ;
- coût d'opportunité des quantités non exécutées.

La mesure ex post ne remplace pas l'estimation ex ante. Elle peut plus tard servir à recalibrer un modèle seulement par un processus séparé, versionné et testé.

### 6.9 Couche I — surface de décision descriptive

Le résultat utile n'est pas un score unique. Le moteur calcule une surface sur des axes déclarés :

```text
taille
fréquence
horizon d'exécution
scénario de coût
scénario d'avantage
capital disponible
```

Chaque cellule reçoit un état descriptif :

```text
condition_satisfied_in_model
condition_not_satisfied_in_model
structurally_unreachable
capital_not_feasible
insufficient_data
not_assessed
unsupported
```

Le moteur peut identifier une frontière mathématique. Il ne choisit jamais une cellule optimale.

La revue hostile impose une séparation supplémentaire : le Cost Ledger est un snapshot, pas une fonction de taille. La surface utilise donc une politique de projection distincte qui nomme domaine, transformation des bases, stabilité supposée des paramètres et traitement de l'avantage avec la taille. Les coûts bas, central et haut sont croisés avec les trois avantages par produit cartésien ; une diagonale de trois couples est insuffisante.

La première surface reste `notional_only_not_executable`. Quantité, prix, lot, tick, minimum d'ordre, liquidité, impact, fill, fréquence et trajectoire de capital demeurent non évalués. Une frontière exacte n'est publiée que sous une géométrie linéaire démontrée ; un profil d'avantage fourni par taille produit seulement des changements discrets sans interpolation.

## 7. Premier noyau implémenté — Cost Ledger v1

Le premier code vNext n'est pas un modèle de market impact. Il est le **Cost Ledger v1**, isolé et techniquement validé sur le head fonctionnel exact `df3ff7fc970c7a2d1030ceea9e7473fcf79fb0f5`. Cette réussite prouve le contrat synthétique et la rétrocompatibilité, pas la justesse de coûts de marché non calibrés.

Objectif : représenter les coûts actuels sous une structure extensible sans modifier leur économie.

Le premier périmètre conserve :

- compte cash ;
- achat long ;
- action ou ETF au comptant ;
- commission fixe par côté ;
- FX proportionnel par côté ;
- spread total hypothétique ;
- coût d'exécution hypothétique ;
- coût contractuel ou taxe explicitement nul ou non supporté ;
- coût du cycle séparé du cash d'entrée.

Il ajoute seulement :

- identifiants de composants ;
- identifiants d'événements économiques et politique de couverture ;
- côté, portée, base et devise ;
- benchmark ou absence explicite de benchmark ;
- statut observé, contractuel, hypothétique ou synthétique ;
- matrice d'inclusion ;
- provenance et version ;
- statut de calcul séparé du statut de preuve ;
- adaptateur rétrocompatible depuis l'entrée actuelle.

## 8. Invariants du Cost Ledger v1

1. L'adaptateur legacy reproduit exactement les résultats actuels dans le domaine supporté.
2. L'ordre des composants économiquement non ordonnés ne change pas le résultat.
3. Deux `component_id` identiques sont refusés.
4. Deux composants portant le même `economic_event_id` sont conflictuels et exclus de l'agrégat.
5. Chaque montant possède une devise et une base.
6. Chaque taux possède un dénominateur explicite.
7. Chaque coût possède un côté ou une portée de cycle.
8. Un benchmark absent ne devient pas un mid-price implicite.
9. Un coût hypothétique ne devient jamais observé.
10. Un composant inconnu ne devient jamais zéro.
11. La somme des composants réconcilie le coût du cycle et le seuil.
12. Toute mutation invalide le snapshot antérieur.
13. Aucun résultat ne contient `NaN`, `Infinity` ou `-0`.
14. Les conclusions indépendantes restent disponibles lorsqu'un autre composant est non évalué.
15. Une collection n'est complète que sous une politique de couverture déclarée et satisfaite.
16. La calculabilité arithmétique ne promeut jamais la qualité de preuve ou l'actualité.

## 9. Ordre d'implémentation dans Gate 1

Cet ordre ne crée pas de nouvelle numérotation de gate :

1. maintenir le contrat `Cost Ledger v1`, ses scénarios hostiles, son adaptateur et ses oracles ;
2. maintenir les corrections de la revue hostile, dont la réconciliation du dénominateur ;
3. valider sur head distant exact la Cost Survival Surface v1 sans optimum ;
4. réévaluer le parcours et le besoin utilisateur seulement après cette preuve ;
5. décider ensuite si un prototype supérieur à la sonde actuelle mérite une cohorte ;
6. toute donnée réelle, TCA observée ou calibration de microstructure reste soumise aux gates ultérieures de la matrice d'autorité.

## 10. Ce qui reste interdit

- hardcoder un modèle d'impact présenté comme vrai pour tous les instruments ;
- déduire une probabilité d'exécution d'un ordre limite sans données et méthode ;
- appeler `slippage` une différence sans benchmark ;
- transformer la borne haute en pire cas statistique sans preuve ;
- optimiser une taille, un type d'ordre ou un timing pour l'utilisateur ;
- suggérer un prix limite ;
- masquer les quantités non exécutées ;
- agréger ex ante et ex post ;
- réutiliser une exécution observée pour recalibrer silencieusement le modèle ;
- étendre le domaine au levier, short, options ou crypto sans contrats séparés.

## 11. Références de conception

Ces références motivent des séparations et des champs. Elles ne valident pas encore une formule Breaktest :

- [Almgren et Chriss, *Optimal Execution of Portfolio Transactions*](https://doi.org/10.21314/JOR.2001.041) : arbitrage entre coût d'impact et risque de prix ;
- [Almgren, Thum, Hauptmann et Li, *Direct Estimation of Equity Market Impact*](https://www.risk.net/ja/node/1500270) : dépendance empirique à la taille, la durée, le volume et la volatilité ;
- [ESMA, MiFID II, article 27](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-27-obligation-execute-orders) : prix, coûts, vitesse, probabilité d'exécution et de règlement, taille et nature sont des dimensions distinctes de l'exécution ;
- [SEC, Rule 605 amendée](https://www.sec.gov/rules-regulations/2025/09/disclosure-order-execution-information) : catégories de taille et de type d'ordre, temps d'exécution, effective spread, realized spread et fill rate sont mesurés séparément ; date de conformité reportée au 1er août 2026 ;
- [Global Foreign Exchange Committee, TCA Data Template](https://www.globalfxc.org/uploads/doc3_tca_data_template_instructions.pdf) et [FX Global Code 2024](https://www.globalfxc.org/uploads/fx_global.pdf) : parent/child orders, heures, montants, prix avec et sans frais, mid à l'arrivée, type d'ordre, lieu et référence de marché doivent rester traçables.

## 12. Condition de sortie de la conception

Le modèle n'est prêt pour un nouveau prototype utilisateur que si :

- le ledger couvre sans ambiguïté le domaine initial ;
- les coûts actuels sont reproduits sans régression ;
- l'incertitude n'est pas présentée comme probabilité ;
- ex ante et ex post sont séparés ;
- l'avantage et sa qualité sont séparés ;
- les frontières de capital tiennent compte du temps lorsqu'elles revendiquent la faisabilité ;
- chaque couche peut répondre `non évaluée` ;
- une revue hostile n'identifie plus de double comptage ou de benchmark implicite matériel ;
- la valeur du prochain prototype est explicitement supérieure à celle de la sonde actuelle.
