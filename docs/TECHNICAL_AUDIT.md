# Breaktest — audit technique initial et suivi des corrections

- Date de l'audit initial : 12 juillet 2026
- Fichier source audité : `app/Breaktest_Studio.html` issu du pack local v0.2
- SHA-256 source vérifié : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`
- Taille source : 132 899 octets
- Version candidate courante : H1 + C2 + C3 + C1 + C4, 158 682 octets, SHA-256 `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af`

## 1. Conclusion exécutive

Le prototype est une application locale réellement interactive, sans dépendance réseau ni bibliothèque externe. Le chargement, la navigation, les contrôles de capital et de coûts, l'import CSV, la recherche du ledger, la fenêtre méthodologique et l'export CSV ont été exécutés avec succès dans Chromium.

Les quatre défauts structurels critiques démontrés dans la source initiale sont désormais corrigés et couverts par des preuves reproductibles :

1. validation ferme des données numériques obligatoires — H1 ;
2. isolation temporelle du modèle par décision — C2 ;
3. allocation chronologique du turnover — C3 ;
4. financement du nominal et réalisation temporelle du PnL — C1 puis C4.

La candidate C4 produit une courbe de trésorerie réalisée aux sorties et utilise les gains ou pertes réalisés pour le financement à partir de leur date de sortie. Elle ne constitue pas une valorisation mark-to-market ni une simulation complète de portefeuille.

Les défauts élevés H2 à H6 restent ouverts. Le prochain travail prioritaire porte sur les bases nettes/full-cost fournies par le journal.

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
5. `scripts/apply_c4_patch.py` applique la simulation événementielle et la courbe réalisée C4 ;
6. `scripts/build_breaktest.py` exécute la chaîne complète.

Chaque transformation vérifie l'empreinte de son entrée et de sa sortie. La chaîne normalise les trades, dimensionne les positions, calcule les coûts, construit un modèle antérieur par décision, applique le turnover chronologique, puis simule les événements d'entrée et de sortie.

Plusieurs hypothèses restent codées et doivent demeurer exposées comme hypothèses : winsorisation 10/90 %, écart-type minimal de 0,25 % par trade, prior de shrinkage de 8 observations, minimum de 5 observations d'entraînement, volatilité quotidienne par défaut de 2,5 %, ADV par défaut de 50 M€ et bootstrap IID de 1 200 réplications avec graine fixe.

## 4. Corrections structurelles

### H1 — données numériques invalides transformées silencieusement — corrigé et fusionné

La version fusionnée distingue `valid`, `missing` et `invalid`, refuse les valeurs explicitement invalides et n'autorise que les dérivations non ambiguës. Les preuves figurent dans `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### C2 — fuite temporelle et contamination des échantillons — corrigé et fusionné

La correction construit un modèle distinct pour chaque décision et n'autorise que les lignes backtest à dates calendaires valides dont la sortie est strictement antérieure à l'entrée de la décision. Les lignes live, futures, de même date, invalides et la décision elle-même sont exclues.

Le détail est consigné dans `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### C3 — budget de turnover alloué avec connaissance de l'avenir — corrigé et fusionné

La correction traite les décisions par date d'entrée croissante et applique un plafond aux unités acceptées dans les 365,25 jours précédents. Un classement par edge n'est utilisé qu'entre opportunités simultanément disponibles à la même date. Les dates invalides et décisions préfiltrées ne consomment rien.

Le détail est consigné dans `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md`.

### C1 — absence de contrainte de capital entre positions simultanées — corrigé et fusionné

**Preuve initiale :** deux trades simultanés de 700 € étaient tous deux conservés avec un capital déclaré de 1 000 €.

C1 traite les entrées chronologiquement par groupes de même date, préserve la priorité C3 et finance intégralement ou refuse le nominal sans redimensionnement implicite. Les décisions invalides ou préfiltrées ne réservent rien.

**Preuves versionnées :**

- build H1 + C2 + C3 + C1 : 152 496 octets, SHA-256 `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e` ;
- suites H1, C2, C3 et C1 réussies dans GitHub Actions et Chromium ;
- JavaScript construit validé avec `node --check` ;
- simultané 700 € + 700 € avec 1 000 €, non-chevauchement, libération le jour de sortie, absence de recyclage intragroupe, priorité C3, capital exact ou nul, dates invalides, sortie inversée, décision préfiltrée et invariance au futur couverts.

Le détail est consigné dans `docs/validation/C1_CAPITAL_RESERVATION.md`.

### C4 — courbe de capital non temporelle — corrigé et validé sur branche

**Preuve initiale :** le PnL complet des trades était ajouté dans l'ordre des entrées sans tenir compte du moment de sortie.

La candidate C4 unifie financement et réalisation dans une simulation événementielle :

- la courbe commence au capital initial ;
- une entrée réserve le nominal sans appliquer le PnL ;
- les positions sorties sont groupées par jour, traitées avant les entrées de ce jour, puis leur nominal est libéré et leur PnL net est appliqué ;
- un gain ou une perte réalisé modifie la capacité de financement à partir de cet événement ;
- les décisions `remove` ou `observe` n'affectent pas la courbe ;
- le dernier point est réconcilié avec le capital initial et les PnL nets des positions financées ;
- l'interface présente explicitement une courbe réalisée aux sorties, non mark-to-market.

**Preuves versionnées :**

- build H1 + C2 + C3 + C1 + C4 : 158 682 octets, SHA-256 `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af` ;
- GitHub Actions `29245031719` sur le commit `ad15babbfdda2833f7120eb260cbc10cb47ebefd` : réussite ;
- suites H1, C2, C3, C1 et C4 réussies dans Chromium ;
- JavaScript construit validé avec `node --check` ;
- gain et perte absents avant la sortie ;
- agrégation déterministe des sorties simultanées ;
- sortie et entrée le même jour ;
- gain finançant une entrée et perte la bloquant ;
- décision retirée, observée ou invalide sans effet silencieux ;
- absence de recyclage intragroupe ;
- invariance de l'historique face à un événement futur ;
- réconciliation du capital réalisé, réservé et libre à chaque événement.

Le détail est consigné dans `docs/validation/C4_REALIZED_EQUITY_CURVE.md`.

## 5. Défauts élevés encore ouverts

### H2 — bases nettes du journal ignorées

Les champs `fixed_net_pnl_eur`, `full_cost_net_pnl_eur` et leurs rendements ne sont pas normalisés. Le moteur recalcule systématiquement le net à partir du brut et des coûts simulés.

**Preuve exécutée :** une ligne déclarant un PnL full-cost de −10 € a produit +10 € lorsque les coûts simulés étaient nuls.

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
- validation numérique H1 ;
- isolation temporelle et par échantillon C2 ;
- allocation chronologique et glissante du turnover C3 ;
- réservation du nominal entre positions C1 ;
- courbe de trésorerie réalisée aux dates de sortie C4 ;
- financement influencé par les gains et pertes uniquement après leur réalisation ;
- invariance des décisions et points antérieurs face aux observations, opportunités et événements futurs dans les scénarios testés.

### Non validé

- exactitude de toutes les formules ;
- utilisation correcte des bases nettes/full-cost fournies par les journaux ;
- valorisation mark-to-market ou quotidienne ;
- levier, appels de marge, intérêts, dividendes et flux externes ;
- cohérence complète avec les journaux et rapports sources ;
- robustesse Safari/iPad complète ;
- sécurité exhaustive du parsing et des exports ;
- performance sur des imports moyens et grands ;
- valeur commerciale et disposition à payer.

## 7. Prochaine correction recommandée

Corriger ensuite **H2 — bases nettes et full-cost fournies par le journal**.

La prochaine mission doit normaliser les bases observées sans les écraser par des coûts simulés, conserver leur provenance, rendre les fallbacks visibles, refuser les valeurs explicitement invalides et distinguer clairement résultat observé et scénario simulé. H4 restera séparé pour la réconciliation complète entre PnL, rendement et nominal.
