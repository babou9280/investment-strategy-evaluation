# Breaktest — standards quantitatifs et financiers

## Statut

Ce document fixe les standards à appliquer progressivement à Breaktest Cost Intelligence.

Il ne constitue ni une affirmation de conformité réglementaire, ni une revendication de conformité GIPS, ni un avis juridique. Il définit un niveau minimal de rigueur pour les calculs, les données, les présentations et les validations futures.

La phase active reste la validation commerciale d'un calculateur synthétique. Les exigences avancées ne doivent pas être implémentées avant qu'une preuve utilisateur justifie leur coût.

## 1. Principes directeurs

1. **Fair representation** : aucun résultat ne doit être présenté d'une manière plus favorable que ce que les données permettent réellement d'établir.
2. **Full disclosure** : hypothèses, exclusions, conventions, provenance, limites et périodes doivent être visibles.
3. **Traçabilité** : chaque sortie doit pouvoir être reliée à ses entrées, à sa formule, à sa version et à son arrondi d'affichage.
4. **Reproductibilité** : mêmes entrées, même version et mêmes conventions doivent produire les mêmes résultats déterministes.
5. **Séparation des statuts** : distinguer `observed`, `contractual`, `estimated`, `user_assumption`, `derived` et `simulated`.
6. **Aucune autorité implicite** : un calcul automatisé n'est ni une recommandation, ni une certification, ni une garantie.
7. **Validation proportionnée** : plus une métrique influence une décision ou une affirmation commerciale, plus son test doit être exigeant.

## 2. Références professionnelles retenues

### 2.1 GIPS — inspiration de présentation, pas revendication de conformité

Les Global Investment Performance Standards de CFA Institute reposent sur la représentation fidèle et la divulgation complète des performances.

Breaktest retient ces principes pour :

- la séparation entre performance brute et nette ;
- la présentation explicite des frais ;
- l'identification de la période ;
- la cohérence des méthodes entre scénarios ;
- la conservation des données sources ;
- l'interdiction du cherry-picking.

Breaktest ne devra jamais afficher « GIPS compliant » sans analyse professionnelle complète du périmètre, des données, de l'organisation et des exigences applicables.

Référence officielle : https://rpc.cfainstitute.org/gips-standards

### 2.2 MiFID II — taxonomie et transparence des coûts

La réglementation européenne sur les coûts et charges constitue une référence de conception utile, même lorsque Breaktest n'agit pas comme entreprise d'investissement.

Principes repris :

- exprimer les coûts en montant monétaire et en pourcentage ;
- distinguer coûts de service, coûts de produit, coûts de transaction et change lorsque ces catégories sont pertinentes ;
- distinguer estimation ex ante et coût réellement observé ex post ;
- montrer l'effet cumulé des coûts ;
- préciser la devise et les coûts de conversion ;
- signaler que les estimations peuvent différer des coûts réellement encourus ;
- ne pas masquer des coûts par compensation ou netting silencieux.

Référence officielle : Règlement délégué (UE) 2017/565, article 50 et annexe II.
https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32017R0565

### 2.3 Gouvernance du risque de modèle

Les principes de gestion du risque de modèle imposent une analyse critique, des limites documentées, une validation distincte du développement et un suivi lorsque le contexte change.

Breaktest retient :

- tests indépendants des exemples ayant servi à développer la formule ;
- challenge explicite des hypothèses ;
- jeux de référence calculés séparément ;
- surveillance des changements de périmètre ;
- versionnage des méthodes ;
- refus d'étendre une métrique hors de son domaine validé.

Référence officielle de principe : Federal Reserve SR 11-7, à utiliser comme inspiration de gouvernance et non comme affirmation d'assujettissement.
https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm

## 3. Contrat d'unités

### 3.1 Représentation interne

- valeurs monétaires : nombre décimal dans la devise explicitement attachée ;
- taux et rendements : décimal interne (`0.0025` pour `0,25 %`) ;
- points de base : `1 bp = 0,0001 = 0,01 %` ;
- fréquences : événements par période explicitement nommée ;
- dates : jours calendaires ISO `YYYY-MM-DD` lorsqu'une date est nécessaire ;
- aucun calcul ne doit dépendre d'une chaîne formatée pour l'affichage.

### 3.2 Affichage minimal d'un coût

Lorsqu'il est calculable, un coût important doit pouvoir être présenté sous plusieurs angles :

- montant en devise ;
- pourcentage du montant de l'ordre ;
- points de base du montant de l'ordre ;
- montant annualisé selon la fréquence saisie ;
- pourcentage du capital initial lorsque le capital est disponible.

Ces ratios ne sont pas interchangeables. Le dénominateur doit être nommé à côté de chaque valeur.

### 3.3 Arrondis

- calcul interne non arrondi ;
- arrondi uniquement à l'affichage ;
- devise : deux décimales par défaut, avec règle documentée pour les très petits montants ;
- pourcentage : précision adaptative sans fausse exactitude ;
- points de base : précision cohérente avec la qualité des entrées ;
- interdire `-0`, `NaN`, `Infinity` et toute valeur non finie visible.

## 4. Taxonomie obligatoire des coûts

### 4.1 Coûts explicites

- commission ;
- frais de plateforme ou de service lorsqu'ils sont effectivement inclus ;
- taxe de transaction ;
- frais de change contractuels ;
- frais de financement ;
- frais de produit.

### 4.2 Coûts implicites

- spread ;
- slippage relativement à un benchmark nommé ;
- market impact lorsqu'il devient mesurable ;
- mark-up ou mark-down intégré au prix lorsqu'il est observable.

### 4.3 Statut de provenance

Chaque composante doit avoir un statut :

- `observed` : constatée dans une transaction ou un relevé ;
- `contractual` : issue d'une grille ou d'un document daté ;
- `estimated` : estimée par une méthode documentée ;
- `user_assumption` : saisie comme hypothèse par l'utilisateur ;
- `derived` : obtenue à partir d'autres champs identifiés ;
- `simulated` : créée dans un scénario synthétique.

Une agrégation doit conserver la provenance de ses composantes. Un coût total mélangeant observation et hypothèse doit être présenté comme mixte, pas comme entièrement observé.

## 5. Convention actuelle du calculateur de validation

### 5.1 Nombre de côtés

- achat simple : `side_count = 1` ;
- aller-retour : `side_count = 2` ;
- la commission et le change saisis « par côté » sont multipliés par `side_count` ;
- le spread et le slippage saisis « pour le scénario complet » ne sont pas multipliés une seconde fois.

### 5.2 Formules

Pour un montant d'ordre `N`, une commission par côté `C`, un taux de change par côté `F`, un spread total `S`, un slippage total `L`, un nombre de côtés `k` et une fréquence mensuelle `m` :

- commission du scénario : `commission_cost = k × C` ;
- change du scénario : `fx_cost = k × N × F` ;
- spread : `spread_cost = N × S` ;
- slippage : `slippage_cost = N × L` ;
- coût total : somme des quatre composantes ;
- coût relatif à l'ordre : `total_cost / N` ;
- coût annuel : `total_cost × m × 12` ;
- coût annuel relatif au capital : `annual_cost / capital` lorsque le capital est strictement positif.

### 5.3 Interdictions

- ne pas multiplier deux fois le change, le spread, le slippage ou la fréquence ;
- ne pas assimiler un aller-retour à deux événements mensuels si la fréquence saisie désigne déjà des allers-retours ;
- ne pas remplacer une absence par zéro ;
- ne pas calculer un ratio lorsque son dénominateur est absent ou nul ;
- ne pas présenter le coût annuel comme une performance annualisée ;
- ne pas qualifier un scénario d'optimal, meilleur ou recommandé.

## 6. Standards futurs de performance

Ces éléments ne deviennent obligatoires qu'après validation d'un import réel ou d'un suivi de portefeuille.

### 6.1 Rendements

- nommer le type : rendement simple, logarithmique, cumulé, annualisé, pondéré dans le temps ou pondéré par les flux ;
- utiliser la capitalisation géométrique pour agréger des rendements successifs ;
- ne jamais additionner des rendements périodiques pour produire un rendement cumulé sauf approximation explicitement signalée ;
- séparer rendement brut, net de coûts explicites, net estimé des coûts implicites et net après frais de produit ;
- inclure les flux externes selon une convention documentée ;
- ne pas comparer des périodes ou fréquences incompatibles.

### 6.2 TWR et MWR

- TWR : mesure de performance neutralisant l'effet des flux externes ;
- MWR/IRR : rendement dépendant du calendrier et de la taille des flux ;
- aucune des deux mesures ne doit être présentée comme universellement supérieure ;
- le produit doit expliquer leur usage et refuser les flux ou dates invalides.

### 6.3 Volatilité et ratios

Avant tout affichage de volatilité, Sharpe, Sortino ou information ratio :

- fréquence des observations connue ;
- convention d'annualisation explicitée ;
- taux sans risque et période cohérents pour Sharpe ;
- traitement des valeurs manquantes documenté ;
- taille d'échantillon visible ;
- aucune métrique calculée sur une série trop courte sans avertissement ;
- test de non-régression avec jeu de référence indépendant.

### 6.4 Drawdown

- calculer sur une série de valeur ou de richesse cohérente ;
- distinguer drawdown réalisé et mark-to-market ;
- conserver date du pic, date du creux, profondeur et durée ;
- ne pas calculer un drawdown de portefeuille complet à partir de seuls PnL de trades non alignés dans le temps.

## 7. Standards futurs de Transaction Cost Analysis

La TCA ne doit être ajoutée qu'avec des données d'exécution assez riches.

### 7.1 Benchmark obligatoire

Toute mesure de slippage doit nommer son benchmark :

- prix de décision ;
- prix d'arrivée ;
- mid-price ;
- VWAP ;
- prix de clôture ;
- autre référence explicitement définie.

Le mot « slippage » sans benchmark, sens de transaction, horodatage et devise est incomplet.

### 7.2 Mesures possibles

- effective spread ;
- realized spread ;
- implementation shortfall ;
- market impact ;
- timing cost ;
- coût explicite ;
- coût d'opportunité des quantités non exécutées.

Chaque mesure exige une formule, des horodatages, le sens achat/vente, les quantités, les exécutions partielles, la devise et une convention de signe.

### 7.3 Convention de signe

Une convention unique devra être gelée, par exemple :

- coût positif = défavorable à l'investisseur ;
- économie négative = exécution meilleure que le benchmark.

L'interface ne devra jamais alterner entre signe économique et signe comptable sans le signaler.

## 8. Standards futurs de validation quantitative

Avant toute promesse sur la robustesse d'une stratégie :

- aucune donnée future dans une décision passée ;
- séparation temporelle entraînement / validation / test ;
- walk-forward ou protocole temporel adapté ;
- coûts et contraintes de capital appliqués au moment où ils deviennent connus ;
- gestion explicite des positions simultanées ;
- traitement des survivorship, selection et look-ahead biases ;
- nombre de variantes testées documenté ;
- correction du multiple testing lorsque pertinent ;
- sensibilité aux hypothèses et aux régimes ;
- intervalles d'incertitude ou bootstrap seulement lorsque leurs hypothèses sont défendables ;
- aucune suppression rétrospective des perdants pour améliorer le résultat.

Les métriques avancées telles que Deflated Sharpe Ratio, Probability of Backtest Overfitting ou tests de supériorité ne doivent être ajoutées qu'avec définition, référence méthodologique, jeu de contrôle et interprétation limitée.

## 9. Gouvernance des métriques

Chaque métrique livrée doit avoir :

- un identifiant stable ;
- une définition métier ;
- une formule ;
- des unités ;
- des entrées et leur provenance ;
- une convention de signe ;
- une convention temporelle ;
- des cas invalides ;
- des tests unitaires ;
- au moins un oracle indépendant ;
- une version ;
- une liste de limites ;
- une formulation commerciale autorisée et interdite.

Une modification de formule doit produire :

1. une nouvelle version ;
2. une justification ;
3. des tests de migration ;
4. une comparaison avant/après ;
5. une mise à jour documentaire.

## 10. Portes de passage produit

### Porte Q0 — validation commerciale actuelle

Autorisé :

- scénarios synthétiques ;
- calculs déterministes simples ;
- coûts saisis par l'utilisateur ;
- provenance `user_assumption` ;
- comparaison descriptive.

Interdit :

- tarif réel présenté comme actuel ;
- import de transactions ;
- performance de portefeuille ;
- TCA ;
- recommandation ;
- score quantitatif avancé.

### Porte Q1 — import de relevés

Exiger avant lancement :

- schéma de données versionné ;
- provenance par champ ;
- devise et conversion auditables ;
- réconciliation des totaux ;
- sécurité CSV ;
- tests sur relevés anonymisés autorisés ;
- distinction coût observé / estimé.

### Porte Q2 — suivi de performance

Exiger :

- politique de flux ;
- convention TWR/MWR ;
- traitement des dividendes et taxes ;
- valorisation et calendrier ;
- séparation réalisé / non réalisé ;
- netting interdit ou explicite ;
- tests indépendants.

### Porte Q3 — comparaison de courtiers ou exécutions

Exiger :

- données comparables ;
- méthodologie de normalisation ;
- échantillon minimal ;
- horodatage et qualité des données ;
- conflits d'intérêts divulgués ;
- aucun classement payé caché ;
- revue juridique.

### Porte Q4 — score, recommandation ou intégration transactionnelle

Aucune implémentation sans :

- décision stratégique explicite ;
- validation statistique externe ;
- analyse réglementaire professionnelle ;
- gouvernance des conflits ;
- sécurité renforcée ;
- responsabilité clairement attribuée.

## 11. Règle de communication

Les formulations autorisées décrivent un calcul :

- « coût estimé selon vos hypothèses » ;
- « impact annuel si cette fréquence se répète » ;
- « valeur non disponible faute de capital renseigné » ;
- « composante observée / contractuelle / estimée ».

Les formulations interdites promettent une décision :

- « taille optimale » ;
- « meilleur courtier » ;
- « trade rentable » ;
- « stratégie validée » ;
- « rendement garanti » ;
- « conforme GIPS » ;
- « conforme MiFID II » ;
- « certifié par Breaktest ».

## 12. Conséquence pour toute pull request concernée

Le site de validation doit respecter immédiatement :

- le contrat d'unités ;
- la taxonomie commission/change/spread/slippage ;
- les statuts de provenance ;
- la convention nombre de côtés ;
- les formules Q0 ;
- les règles d'arrondi ;
- les formulations autorisées ;
- l'absence de métriques avancées non justifiées.

Les portes Q1 à Q4 restent documentées mais suspendues.
