# Breaktest — audit technique initial et suivi des corrections

- Date de l'audit initial : 12 juillet 2026
- Fichier source audité : `app/Breaktest_Studio.html` issu du pack local v0.2
- SHA-256 source vérifié : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`
- Taille source : 132 899 octets
- Version candidate courante : H1 + C2 + C3 + C1, 152 496 octets, SHA-256 `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e`

## 1. Conclusion exécutive

Le prototype est une application locale réellement interactive, sans dépendance réseau ni bibliothèque externe. Le chargement, la navigation, les contrôles de capital et de coûts, l'import CSV, la recherche du ledger, la fenêtre méthodologique et l'export CSV ont été exécutés avec succès dans Chromium.

Quatre défauts structurels ont été démontrés dans la source initiale :

1. le capital disponible et les positions simultanées n'étaient pas simulés ;
2. le modèle et le budget de turnover pouvaient utiliser une information future ou une vue globale de la période ;
3. les données invalides pouvaient être transformées silencieusement en rendement nul ;
4. les PnL nets/full-cost fournis par le journal étaient ignorés alors que la méthodologie les décrit comme bases de résultat.

H1, C2 et C3 sont corrigés et fusionnés. C1 est corrigé et validé sur sa branche candidate, en attente de fusion contrôlée. C4 reste le seul défaut critique structurel ouvert. Le produit est une **démonstration fonctionnelle avec validation numérique, isolation temporelle, turnover chronologique et financement du nominal**, mais pas encore une simulation de portefeuille temporelle complète.

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

La version candidate est reproduite de manière déterministe :

1. `scripts/materialize_breaktest.py` reconstruit la source et applique H1 ;
2. `scripts/apply_c2_patch.py` applique l'isolation temporelle C2 ;
3. `scripts/apply_c3_patch.py` applique le turnover chronologique C3 ;
4. `scripts/apply_c1_patch.py` applique la réservation chronologique du capital C1 ;
5. `scripts/build_breaktest.py` exécute la chaîne complète.

Chaque transformation vérifie l'empreinte de son entrée et de sa sortie. La chaîne normalise les trades, dimensionne les positions, calcule les coûts, construit un modèle antérieur par décision, applique le turnover chronologique, réserve le nominal des positions financées puis agrège les résultats.

Plusieurs hypothèses restent codées et doivent demeurer exposées comme hypothèses : winsorisation 10/90 %, écart-type minimal de 0,25 % par trade, prior de shrinkage de 8 observations, minimum de 5 observations d'entraînement, volatilité quotidienne par défaut de 2,5 %, ADV par défaut de 50 M€ et bootstrap IID de 1 200 réplications avec graine fixe.

## 4. Défauts critiques

### C1 — absence de contrainte de capital entre positions simultanées — corrigé et validé sur branche

**Preuve initiale :** deux trades simultanés de 700 € étaient tous deux conservés avec un capital déclaré de 1 000 €.

La candidate C1 traite les entrées chronologiquement par groupes de même date. Elle libère avant le groupe le nominal des positions antérieures sorties, préserve la priorité C3, interdit le recyclage d'une position nouvellement ouverte au milieu du groupe et finance intégralement ou refuse le nominal sans redimensionnement implicite.

Les décisions invalides ou préfiltrées ne réservent rien. Le PnL ne modifie pas le capital disponible. Chaque décision conserve ses diagnostics de financement et les agrégats exposent le pic réservé, le minimum libre et les refus. Les métriques de turnover sont recalculées après financement.

**Preuves versionnées :**

- build H1 + C2 + C3 + C1 : 152 496 octets, SHA-256 `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e` ;
- suites H1, C2, C3 et C1 réussies dans GitHub Actions et Chromium ;
- JavaScript construit validé avec `node --check` ;
- simultané 700 € + 700 € avec 1 000 €, non-chevauchement, libération le jour de sortie, absence de recyclage intragroupe, priorité C3, capital exact ou nul, dates invalides, sortie inversée, décision préfiltrée et invariance au futur couverts ;
- capital réservé inférieur ou égal au capital initial dans la démonstration et les scénarios testés.

Le détail est consigné dans `docs/validation/C1_CAPITAL_RESERVATION.md`.

### C2 — fuite temporelle et contamination des échantillons — corrigé et fusionné

La correction construit un modèle distinct pour chaque décision et n'autorise que les lignes backtest à dates calendaires valides dont la sortie est strictement antérieure à l'entrée de la décision. Les lignes live, futures, de même date, invalides et la décision elle-même sont exclues.

Le détail est consigné dans `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### C3 — budget de turnover alloué avec connaissance de l'avenir — corrigé et fusionné

La correction traite les décisions par date d'entrée croissante et applique un plafond aux unités acceptées dans les 365,25 jours précédents. Un classement par edge n'est utilisé qu'entre opportunités simultanément disponibles à la même date. Les dates invalides et décisions préfiltrées ne consomment rien.

Le détail est consigné dans `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md`.

### C4 — courbe de capital non temporelle — ouvert

Le PnL complet des trades est encore ajouté selon leur date d'entrée, sans tenir compte de leur date de sortie. Malgré la réservation C1, la courbe affichée n'est ni une courbe de trésorerie réalisée, ni une courbe de valeur mark-to-market.

**Impact :** les dates des gains, pertes et drawdowns ne représentent pas le moment de leur réalisation ; le PnL ne modifie pas encore le capital disponible pour les décisions suivantes.

## 5. Défauts élevés

### H1 — données numériques invalides transformées silencieusement — corrigé et fusionné

La version fusionnée distingue `valid`, `missing` et `invalid`, refuse les valeurs explicitement invalides et n'autorise que les dérivations non ambiguës. Les preuves figurent dans `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### H2 — bases nettes du journal ignorées

Les champs `fixed_net_pnl_eur`, `full_cost_net_pnl_eur` et leurs rendements ne sont pas normalisés. Le moteur recalcule systématiquement le net à partir du brut et des coûts simulés.

### H3 — prix en euros reconverti comme devise étrangère

Le prix retenu est toujours multiplié par `eurPerQuoteCurrency`, même lorsqu'il provient de `entry_price_eur`.

### H4 — absence de réconciliation PnL / rendement / nominal

Une ligne incohérente entre `gross_pnl_eur`, `invested_eur` et `gross_return` est acceptée sans anomalie financière.

### H5 — injection de formule dans le CSV exporté

Les valeurs textuelles commençant par `=`, `+`, `-` ou `@` ne sont pas neutralisées avant export.

### H6 — coût algorithmique excessif

Mesures initiales sur l'évaluation backtest : environ 19 ms pour 100 lignes, 2,1 s pour 500 lignes et 17 s pour 1 000 lignes. Le rendu complet peut bloquer l'interface, notamment sur iPad.

## 6. Ce qui est validé et ce qui ne l'est pas

### Validé par exécution et preuves versionnées

- application locale interactive ;
- navigation et recalculs visibles ;
- import nominal et refus des données numériques ambiguës ;
- export CSV nominal ;
- échappement de l'injection HTML testée dans le DOM ;
- correction H1 ;
- isolation temporelle et par échantillon C2 ;
- allocation chronologique et glissante du turnover C3 ;
- réservation du nominal entre positions C1 sur la branche candidate ;
- invariance des décisions antérieures face aux observations, opportunités et PnL futurs dans les scénarios testés.

### Non validé

- exactitude de toutes les formules ;
- courbe de trésorerie réalisée ou mark-to-market ;
- réinvestissement chronologique du PnL ;
- cohérence complète avec les journaux et rapports sources ;
- robustesse Safari/iPad complète ;
- sécurité exhaustive du parsing et des exports ;
- performance sur des imports moyens et grands ;
- valeur commerciale et disposition à payer.

## 7. Prochaine correction recommandée

Corriger ensuite **C4 — courbe de capital temporelle**.

La prochaine mission doit construire une courbe de trésorerie réalisée aux dates de sortie et unifier les événements de financement et de réalisation sans prétendre fournir un mark-to-market. Le PnL doit devenir disponible uniquement à sa réalisation, les sorties d'une date doivent précéder les entrées finançables de cette date selon la convention C1, et aucune donnée future ne doit modifier l'historique antérieur.
