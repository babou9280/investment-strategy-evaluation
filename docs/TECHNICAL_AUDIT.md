# Breaktest — audit technique initial et suivi des corrections

- Date de l'audit initial : 12 juillet 2026
- Fichier source audité : `app/Breaktest_Studio.html` issu du pack local v0.2
- SHA-256 source vérifié : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`
- Taille source : 132 899 octets
- Périmètre initial : lecture du code, exécution locale contrôlée et tests CSV synthétiques ciblés
- Version courante construite : H1 + C2 + C3, 142 782 octets, SHA-256 `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80`

## 1. Conclusion exécutive

Le prototype est une application locale réellement interactive, sans dépendance réseau ni bibliothèque externe. Le chargement, la navigation, les contrôles de capital et de coûts, l'import CSV, la recherche du ledger, la fenêtre méthodologique et l'export CSV ont été exécutés avec succès dans Chromium.

Quatre défauts structurels ont été démontrés dans la source initiale :

1. le capital disponible et les positions simultanées n'étaient pas simulés ;
2. le modèle et le budget de turnover pouvaient utiliser une information future ou une vue globale de la période ;
3. les données invalides pouvaient être transformées silencieusement en rendement nul ;
4. les PnL nets/full-cost fournis par le journal étaient ignorés alors que la méthodologie les décrit comme bases de résultat.

H1, C2 et C3 sont corrigés, testés et fusionnés dans `breaktest-bootstrap`. C1 et C4 restent critiques. Le produit reste donc une **démonstration fonctionnelle de dashboard avec plusieurs contrôles quantitatifs validés**, mais pas encore un moteur de portefeuille entièrement financé et temporel.

## 2. Vérifications initiales réellement exécutées

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

## 3. Architecture et build cumulatif

Le fichier source contient HTML, CSS et JavaScript dans un document unique, 40 trades de démonstration, aucune requête réseau, aucun backend, aucun stockage local et un objet global de diagnostic `window.__BREAKTEST__`.

La version courante est reproduite de manière déterministe :

1. `scripts/materialize_breaktest.py` reconstruit la source et applique H1 ;
2. `scripts/apply_c2_patch.py` applique l'isolation temporelle C2 ;
3. `scripts/apply_c3_patch.py` applique le turnover chronologique C3 ;
4. `scripts/build_breaktest.py` exécute la chaîne complète.

Chaque étape vérifie son entrée, sa taille et son empreinte. La chaîne principale normalise les trades, dimensionne chaque position, calcule les coûts, construit un modèle antérieur par décision, estime l'edge, applique le turnover chronologique puis agrège les résultats.

Plusieurs hypothèses restent codées et doivent demeurer exposées comme hypothèses : winsorisation 10/90 %, écart-type minimal de 0,25 % par trade, prior de shrinkage de 8 observations, minimum de 5 observations d'entraînement, volatilité quotidienne par défaut de 2,5 %, ADV par défaut de 50 M€ et bootstrap IID de 1 200 réplications avec graine fixe.

## 4. Défauts critiques

### C1 — Absence de contrainte de capital entre positions simultanées — ouvert

Chaque trade est encore dimensionné à partir du même capital initial. Il n'existe pas encore de livre de positions ouvertes ni de réservation du nominal entre `entryDate` et `exitDate`.

**Preuve initiale :** deux trades live simultanés de 700 € ont tous deux été conservés pour un capital déclaré de 1 000 €, soit 1 400 € de nominal simultané.

**Impact :** Capital Fit peut encore déclarer exécutables des trades incompatibles avec le capital disponible.

### C2 — Fuite temporelle et contamination des échantillons — corrigé et fusionné

Dans la source initiale, un modèle pouvait utiliser des trades backtest terminés après la décision évaluée et des lignes d'un échantillon non autorisé.

La correction fusionnée construit un modèle distinct pour chaque décision et n'autorise que les lignes backtest à dates calendaires valides dont la sortie est strictement antérieure à l'entrée de la décision. Les lignes live, futures, de même date, invalides et la décision elle-même sont exclues. L'exclusion de soi utilise l'identité d'objet, pas l'identifiant textuel.

**Preuves versionnées :**

- build H1 + C2 : 138 887 octets, SHA-256 `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454` ;
- ajout d'un backtest futur extrême ou d'une ligne live interdite sans modification de la décision antérieure ;
- dates calendaires impossibles exclues ou placées en observation ;
- identifiants dupliqués distingués correctement ;
- suites H1 et C2 réussies dans Chromium.

Le détail est consigné dans `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### C3 — Budget de turnover alloué avec connaissance de l'avenir — corrigé et fusionné

Dans la source initiale, les candidats de toute la période étaient triés par edge prudent avant consommation du budget.

La correction fusionnée traite les décisions par date d'entrée croissante et applique un plafond aux unités acceptées dans les 365,25 jours précédents. Un classement par edge n'est utilisé qu'entre opportunités simultanément disponibles à la même date ; l'identifiant constitue le dernier départage. Les dates invalides et décisions préfiltrées ne consomment rien.

Chaque décision conserve le budget avant, les unités demandées, le budget après, le rang simultané et le motif. Le pic glissant contraint est distingué de la moyenne annuelle descriptive.

**Preuves versionnées :**

- build H1 + C2 + C3 : 142 782 octets, SHA-256 `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80` ;
- suites H1, C2 et C3 réussies ;
- JavaScript construit validé avec `node --check` ;
- décision antérieure identique avec ou sans opportunité future, y compris lorsque l'edge futur passe de +99 à −99 ;
- renouvellement après la fenêtre, absence de renouvellement avant, dates égales, budget nul, date invalide et décision préfiltrée couverts ;
- pic glissant de la démonstration inférieur ou égal au plafond.

Le détail est consigné dans `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md`.

### C4 — Courbe de capital non temporelle — ouvert

Le PnL complet des trades est encore ajouté selon leur date d'entrée, sans tenir compte de leur date de sortie, des chevauchements ou d'un mark-to-market.

**Impact :** la courbe affichée n'est ni une courbe de trésorerie réalisée, ni une courbe de valeur de portefeuille.

## 5. Défauts élevés

### H1 — Rendements invalides ou absents transformés silencieusement en zéro — corrigé et fusionné

La version fusionnée distingue `valid`, `missing` et `invalid`, refuse les valeurs explicitement invalides, exige un nominal valide et au moins un PnL ou rendement brut valide, n'autorise que les dérivations non ambiguës et refuse le lot complet au lieu de supprimer silencieusement les lignes invalides.

Les preuves sont consignées dans `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### H2 — Les bases nettes du journal sont ignorées

Les champs `fixed_net_pnl_eur`, `full_cost_net_pnl_eur` et leurs rendements ne sont pas normalisés. Le moteur recalcule systématiquement le net à partir du brut et des coûts simulés.

**Preuve exécutée :** une ligne déclarant un PnL full-cost de −10 € a produit +10 € lorsque les coûts simulés étaient nuls.

### H3 — Un prix en euros est reconverti comme une devise étrangère

Le prix retenu est toujours multiplié par `eurPerQuoteCurrency`, même lorsqu'il provient de `entry_price_eur`.

**Preuve exécutée :** `entry_price_eur = 100` avec un taux de 0,92 produit un prix unitaire de 92 €.

### H4 — Aucune réconciliation PnL / rendement / nominal

Une ligne incohérente entre `gross_pnl_eur`, `invested_eur` et `gross_return` est acceptée sans anomalie financière.

### H5 — Injection de formule dans le CSV exporté

Les valeurs textuelles commençant par `=`, `+`, `-` ou `@` ne sont pas neutralisées avant export.

**Preuve exécutée :** une stratégie `=HYPERLINK(...)` a été réexportée avec le préfixe `=` intact.

### H6 — Coût algorithmique excessif

Mesures initiales sur la seule fonction d'évaluation backtest : environ 19 ms pour 100 lignes, 2,1 s pour 500 lignes et 17 s pour 1 000 lignes. Le rendu complet est plus coûteux et peut bloquer l'interface, notamment sur iPad.

## 6. Ce qui est validé et ce qui ne l'est pas

### Validé par exécution et preuves versionnées

- application locale interactive ;
- navigation et recalculs visibles ;
- import nominal et refus des données numériques ambiguës ;
- export CSV nominal ;
- échappement de l'injection HTML testée dans le DOM ;
- correction H1 et non-régression de la normalisation ;
- isolation temporelle et par échantillon du modèle C2 ;
- validation calendaire stricte des dates utilisées par le replay ;
- allocation chronologique et glissante du turnover C3 ;
- invariance d'une décision antérieure face aux observations ou opportunités futures dans les scénarios testés.

### Non validé

- exactitude de toutes les formules ;
- simulation d'un portefeuille financé entre positions simultanées ;
- courbe de capital réalisée ou mark-to-market ;
- cohérence complète avec les journaux et rapports sources ;
- robustesse Safari/iPad complète ;
- sécurité exhaustive du parsing et des exports ;
- performance sur des imports moyens et grands ;
- valeur commerciale et disposition à payer.

## 7. Prochaine correction recommandée

Corriger ensuite **C1 — réservation du capital entre positions simultanées**.

Les décisions déjà conservées après H1/C2/C3 doivent être traitées chronologiquement. Le nominal doit être réservé jusqu'à la sortie, libéré avant les entrées de même date selon une convention explicite, et un trade insuffisamment financé doit être retiré sans redimensionnement silencieux. Les dates invalides doivent produire un statut d'observation et des diagnostics.

L'invariant principal sera : à tout instant, le capital réservé ne dépasse jamais le capital initial, et l'ajout ou la modification d'une opportunité future ne change jamais une décision antérieure. C4 restera hors périmètre : C1 libérera seulement le nominal, sans construire encore une courbe réalisée ou mark-to-market.
