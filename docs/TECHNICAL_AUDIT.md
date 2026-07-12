# Breaktest — audit technique initial

- Date : 12 juillet 2026
- Fichier audité : `app/Breaktest_Studio.html` issu du pack local v0.2
- SHA-256 vérifié : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`
- Taille : 132 899 octets
- Périmètre : lecture du code, exécution locale contrôlée et tests CSV synthétiques ciblés
- Limite : au moment de cet audit, le HTML n'était pas encore présent sur la branche GitHub ; l'audit porte sur le fichier local vérifié par empreinte.

## 1. Conclusion exécutive

Le prototype est une application locale réellement interactive, sans dépendance réseau ni bibliothèque externe. Le chargement, la navigation, les contrôles de capital et de coûts, l'import CSV, la recherche du ledger, la fenêtre méthodologique et l'export CSV ont été exécutés avec succès dans Chromium.

Cette interactivité ne valide pas encore la proposition quantitative. Quatre défauts structurels ont été démontrés dans la source initiale :

1. le capital disponible et les positions simultanées ne sont pas simulés ;
2. le modèle et le budget de turnover pouvaient utiliser une information future ou une vue globale de la période ;
3. les données invalides pouvaient être transformées silencieusement en rendement nul ;
4. les PnL nets/full-cost fournis par le journal sont ignorés alors que la méthodologie les décrit comme bases de résultat.

H1 est corrigé et fusionné. C2 est corrigé et validé sur la branche candidate. Le produit reste une **démonstration fonctionnelle de dashboard**, pas encore un moteur quantitatif validé, car C1, C3, C4 et H2 à H6 restent ouverts.

## 2. Vérifications réellement exécutées

| Contrôle | Résultat |
|---|---|
| Chargement initial | réussi, aucune erreur JavaScript ni message console |
| Jeu de démonstration | 40 trades, dont 20 live |
| Navigation | les quatre vues s'activent réellement |
| Capital | passage de 1 000 € à 2 500 € et recalcul observé |
| Preset `stress` | paramètres de coûts appliqués |
| Réinitialisation | retour au jeu initial et au preset retail |
| Import CSV valide | 7 lignes acceptées : 5 backtest et 2 live |
| Import incomplet | refusé et état précédent conservé |
| Modal méthodologique | ouverture et fermeture par `Échap` réussies |
| Recherche ledger | filtrage exécuté |
| Export CSV | téléchargement obtenu |
| Injection HTML importée | aucun élément HTML exécuté dans le ledger |
| Contrôle responsive | aucun débordement horizontal détecté à 1 440, 1 024, 768 et 390 px dans ce test automatisé |

Ces contrôles ne prouvent pas la compatibilité Safari/iPad complète. L'ouverture et l'interactivité de base sur iPad constituent une vérification utilisateur distincte.

## 3. Inventaire de l'architecture

Le fichier source contient :

- HTML, CSS et JavaScript dans un document unique ;
- 40 trades de démonstration embarqués ;
- 71 fonctions JavaScript déclarées dans la source auditée ;
- 89 identifiants DOM uniques ;
- 19 boutons, 18 champs `input`, 3 sélecteurs et 3 graphiques SVG ;
- aucune requête réseau, aucun backend, aucun stockage local et aucune dépendance externe ;
- un objet global de diagnostic `window.__BREAKTEST__`.

La chaîne de calcul principale normalise les trades, dimensionne chaque position, calcule les coûts d'exécution, estime un edge par stratégie, compare une borne prudente à un seuil, applique un budget de turnover puis agrège les PnL et coûts.

Plusieurs hypothèses sont codées sans être suffisamment exposées : winsorisation 10/90 %, écart-type minimal de 0,25 % par trade, prior de shrinkage de 8 observations, minimum de 5 observations d'entraînement, durée minimale de 0,25 année pour le turnover, volatilité quotidienne par défaut de 2,5 %, ADV par défaut de 50 M€ et bootstrap IID de 1 200 réplications avec graine fixe.

## 4. Défauts critiques

### C1 — Absence de contrainte de capital entre positions simultanées

Chaque trade est dimensionné à partir du même capital initial. Il n'existe ni trésorerie, ni livre de positions ouvertes, ni réservation du capital entre `entryDate` et `exitDate`.

**Preuve exécutée :** deux trades live simultanés de 700 € ont tous deux été conservés pour un capital déclaré de 1 000 €, soit 1 400 € de nominal simultané.

**Impact :** Capital Fit peut déclarer exécutables des trades incompatibles avec le capital disponible.

### C2 — Fuite temporelle et contamination des échantillons — corrigé sur la branche candidate

Dans la source initiale, un modèle pouvait utiliser des trades backtest terminés après la décision évaluée et des lignes d'un échantillon non autorisé.

**Preuve initiale :** un trade live daté de 2024 a été évalué avec cinq trades backtest datés de 2025.

**Correction C2 vérifiée :** chaque décision possède désormais son propre modèle ; seules les lignes backtest à dates valides dont la sortie est strictement antérieure à l'entrée de la décision sont admissibles ; les lignes live, futures, de même date, invalides et la décision elle-même sont exclues ; une décision à date invalide est placée en observation sans entraînement.

**Preuves exécutées :**

- build cumulatif H1 + C2 produit 138 406 octets, SHA-256 `b82dc786fc3a0669792744e77be34c49b744e89502138c56cd97b73187fc64f4` ;
- l'ajout d'un backtest futur extrême ou d'une ligne live interdite ne modifie ni la profondeur d'entraînement, ni la moyenne postérieure, ni l'edge prudent, ni le statut pré-turnover d'une décision antérieure ;
- la règle est appliquée en mode live comme en mode backtest ;
- les décisions à date invalide sont observées avec un diagnostic explicite ;
- les libellés `OOS strict`, `OOS`, `walk-forward` et `sans ré-optimisation` sont retirés ; l'interface indique que le turnover reste ex post ;
- les tests H1 passent encore et les 40 trades normalisés de démonstration sont inchangés.

Le détail est consigné dans `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### C3 — Budget de turnover alloué avec connaissance de l'avenir

Les candidats de toute la période sont encore triés par edge prudent avant consommation du budget, au lieu d'être traités chronologiquement.

**Impact :** la sélection bénéficie d'une optimisation ex post et ne représente pas une politique exécutable en temps réel. Pour cette raison, la version candidate C2 parle de « modèle antérieur » et affiche « turnover encore ex post » au lieu de revendiquer un walk-forward complet.

### C4 — Courbe de capital non temporelle

Le PnL complet des trades est ajouté selon leur date d'entrée, sans tenir compte de leur date de sortie, des chevauchements ou d'un mark-to-market.

**Impact :** la courbe affichée n'est ni une courbe de trésorerie réalisée, ni une courbe de valeur de portefeuille.

## 5. Défauts élevés

### H1 — Rendements invalides ou absents transformés silencieusement en zéro — corrigé et fusionné

Dans la source auditée, `numeric` utilisait un fallback à zéro. Une valeur non numérique ou absente pouvait survivre à la normalisation comme rendement nul.

La version fusionnée distingue `valid`, `missing` et `invalid`, refuse les valeurs explicitement invalides, exige un nominal valide et au moins un PnL ou rendement brut valide, n'autorise que les dérivations non ambiguës et refuse le lot complet au lieu de supprimer silencieusement les lignes invalides.

Les preuves sont consignées dans `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### H2 — Les bases nettes du journal sont ignorées

Les champs `fixed_net_pnl_eur`, `full_cost_net_pnl_eur` et leurs rendements ne sont pas normalisés. Le moteur recalcule systématiquement le net à partir du brut et des coûts simulés.

**Preuve exécutée :** une ligne déclarant un PnL full-cost de −10 € a produit +10 € lorsque les coûts simulés étaient nuls.

**Impact :** le dashboard ne peut pas être réconcilié avec le journal source.

### H3 — Un prix en euros est reconverti comme une devise étrangère

Le prix retenu est toujours multiplié par `eurPerQuoteCurrency`, même lorsqu'il provient de `entry_price_eur`.

**Preuve exécutée :** `entry_price_eur = 100` avec un taux de 0,92 produit un prix unitaire de 92 €.

### H4 — Aucune réconciliation PnL / rendement / nominal

Une ligne incohérente entre `gross_pnl_eur`, `invested_eur` et `gross_return` est acceptée sans anomalie financière.

### H5 — Injection de formule dans le CSV exporté

Les valeurs textuelles commençant par `=`, `+`, `-` ou `@` ne sont pas neutralisées avant export.

**Preuve exécutée :** une stratégie `=HYPERLINK(...)` a été réexportée avec le préfixe `=` intact.

**Impact :** un tableur peut interpréter la cellule comme une formule.

### H6 — Coût algorithmique excessif

Mesures sur la seule fonction d'évaluation backtest :

- 100 lignes : environ 19 ms ;
- 500 lignes : environ 2,1 s ;
- 1 000 lignes : environ 17 s.

Le rendu complet est plus coûteux. L'interface peut donc se bloquer sur des CSV de taille courante, en particulier sur iPad.

## 6. Ce qui est validé et ce qui ne l'est pas

### Validé par exécution

- application locale interactive ;
- navigation et recalculs visibles ;
- import nominal et refus d'un import incomplet ;
- export CSV ;
- échappement de l'injection HTML testée dans le DOM ;
- correction H1 et non-régression de la normalisation ;
- isolation temporelle et par échantillon du modèle sur la branche candidate C2 ;
- invariance d'une décision antérieure à l'ajout d'observations futures ou live interdites.

### Non validé

- exactitude de toutes les formules ;
- simulation de portefeuille financé ;
- allocation chronologique du turnover ;
- courbe de capital réalisée ou mark-to-market ;
- cohérence avec les journaux et rapports sources ;
- robustesse Safari/iPad complète ;
- sécurité exhaustive du parsing et des exports ;
- valeur commerciale et disposition à payer.

## 7. Prochaine correction recommandée

Corriger ensuite **C3 — allocation chronologique du budget de turnover**.

Les décisions doivent être traitées dans l'ordre temporel, sans tri global par edge futur. À une date donnée, seules les informations disponibles à cette date peuvent déterminer si le budget annuel ou glissant autorise le trade. La politique de renouvellement du budget, les égalités de date et les dates invalides doivent être explicites et testées.

L'invariant principal sera : ajouter, supprimer ou modifier une opportunité future ne doit jamais changer une décision antérieure. Cette correction ne simulera pas encore la réservation du capital entre positions simultanées, qui relève de C1, ni la courbe de capital, qui relève de C4.
