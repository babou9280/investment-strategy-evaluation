# Breaktest — audit technique initial

- Date : 12 juillet 2026
- Fichier audité : `app/Breaktest_Studio.html` issu du pack local v0.2
- SHA-256 vérifié : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`
- Taille : 132 899 octets
- Périmètre : lecture du code, exécution locale contrôlée et tests CSV synthétiques ciblés
- Limite : au moment de cet audit, le HTML n'était pas encore présent sur la branche GitHub ; l'audit porte sur le fichier local vérifié par empreinte.

## 1. Conclusion exécutive

Le prototype est une application locale réellement interactive, sans dépendance réseau ni bibliothèque externe. Le chargement, la navigation, les contrôles de capital et de coûts, l'import CSV, la recherche du ledger, la fenêtre méthodologique et l'export CSV ont été exécutés avec succès dans Chromium.

Cette interactivité ne valide pas encore la proposition quantitative. Quatre défauts structurels empêchent de présenter le moteur comme un contrôle fiable de l'exécutabilité d'une stratégie :

1. le capital disponible et les positions simultanées ne sont pas simulés ;
2. les modèles et le budget de turnover peuvent utiliser une information future ou une vue globale de la période ;
3. les données invalides pouvaient être transformées silencieusement en rendement nul dans la source auditée ;
4. les PnL nets/full-cost fournis par le journal sont ignorés alors que la méthodologie les décrit comme bases de résultat.

Le produit est donc, à ce stade, une **démonstration fonctionnelle de dashboard**, pas encore un moteur quantitatif validé. La correction H1 réduit le risque d'entrée corrompue mais ne résout aucun des défauts structurels C1 à C4.

## 2. Vérifications réellement exécutées

| Contrôle | Résultat |
|---|---|
| Chargement initial | réussi, aucune erreur JavaScript ni message console |
| Jeu de démonstration | 40 trades, dont 20 live/OOS |
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

Le fichier contient :

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

### C2 — Fuite temporelle et contamination des échantillons

En mode live, le modèle peut utiliser des trades backtest terminés après la date du trade live. Dans d'autres modes, des lignes d'un échantillon différent peuvent influencer le prior si leurs dates satisfont le filtre.

**Preuve exécutée :** un trade live daté de 2024 a été évalué avec cinq trades backtest datés de 2025.

**Impact :** les mentions « OOS strict » et « walk-forward » ne sont pas garanties par le moteur.

### C3 — Budget de turnover alloué avec connaissance de l'avenir

Les candidats de toute la période sont triés par edge prudent avant consommation du budget, au lieu d'être traités chronologiquement.

**Impact :** la sélection bénéficie d'une optimisation ex post et ne représente pas une politique exécutable en temps réel.

### C4 — Courbe de capital non temporelle

Le PnL complet des trades est ajouté selon leur date d'entrée, sans tenir compte de leur date de sortie, des chevauchements ou d'un mark-to-market.

**Impact :** la courbe affichée n'est ni une courbe de trésorerie réalisée, ni une courbe de valeur de portefeuille.

## 5. Défauts élevés

### H1 — Rendements invalides ou absents transformés silencieusement en zéro — corrigé sur la branche candidate

Dans la source auditée, `numeric` utilisait un fallback à zéro. Une valeur non numérique ou absente pouvait survivre à la normalisation comme rendement nul, sans être signalée par l'audit de données.

**Impact initial :** une donnée invalide était transformée en performance réelle, contrairement à `QUALITY.md` et `AGENTS.md`.

**Correction H1 vérifiée :** la version candidate distingue `valid`, `missing` et `invalid`; refuse une valeur explicitement invalide ; exige un nominal valide et au moins un PnL ou rendement brut valide ; ne dérive le champ manquant que lorsque le calcul est non ambigu ; conserve `grossPnlDerived` et `grossReturnDerived` ; refuse le lot complet au lieu de supprimer silencieusement les lignes invalides.

**Preuves exécutées :**

- source pré-H1 reconstruite avec le SHA-256 attendu ;
- cible H1 produite à 135 754 octets avec le SHA-256 `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c` ;
- suite Node couvrant chaîne non numérique, vide, `NaN`, `Infinity`, dérivations, zéro réel et rejet de lot : réussie ;
- test Chromium : import nominal accepté, import invalide refusé et état précédent conservé ;
- snapshot numérique des 40 trades de démonstration : inchangé.

Le détail est consigné dans `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`. La provenance dérivée n'est pas encore affichée ligne par ligne dans l'interface et H4 reste ouvert.

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
- présence reproductible des défauts décrits ci-dessus ;
- correction H1 sur la branche candidate et absence de modification du snapshot numérique de démonstration.

### Non validé

- exactitude de toutes les formules ;
- simulation de portefeuille financé ;
- caractère strictement OOS/walk-forward ;
- cohérence avec les journaux et rapports sources ;
- robustesse Safari/iPad complète ;
- sécurité exhaustive du parsing et des exports ;
- valeur commerciale et disposition à payer.

## 7. Prochaine correction recommandée

Corriger ensuite **C2 — isolation temporelle et par échantillon** avant de conserver les libellés « OOS strict » et « walk-forward ».

Pour chaque décision, l'ensemble d'entraînement doit être construit avec une politique explicite et testable : observations appartenant à l'échantillon autorisé, date de sortie strictement antérieure à la date d'entrée de la décision, aucune observation live dans un modèle entraîné sur le backtest et aucun recours à une observation future. Les dates manquantes ou invalides doivent être exclues avec un diagnostic, pas ordonnées artificiellement à l'époque zéro.

Cette correction doit ajouter des invariants anti-look-ahead et démontrer que l'ajout d'une observation future ou d'un échantillon interdit ne modifie jamais une décision antérieure. Elle ne corrigera pas encore C1, C3 ou C4.
