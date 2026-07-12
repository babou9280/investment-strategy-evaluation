# Breaktest - état actuel

## Version

Prototype local-first 0.1, consolidé et audité initialement le 12 juillet 2026.

## Matériel existant

- un prototype HTML autonome ;
- quatre fichiers de lancement archivés qui contiennent le même code et diffèrent seulement par le titre et la vue initiale ;
- un pitch deck ;
- un product blueprint ;
- un guide utilisateur ;
- un journal de backtest ;
- un journal de live-test ;
- un rapport académique d'évaluation de stratégie.

## Consolidation réalisée

`app/Breaktest_Studio.html` est le fichier canonique provisoire. La source v0.2 auditée est conservée dans sept fragments immuables sous `app/.bundle/`.

Le build cumulatif actuel exécute :

1. `scripts/materialize_breaktest.py` pour produire la version H1 ;
2. `scripts/apply_c2_patch.py` pour appliquer l'isolation temporelle C2 ;
3. `scripts/build_breaktest.py` comme point d'entrée unique.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- après H1 : `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c` ;
- version C2 durcie : `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454`.

## Fonctionnalités confirmées par exécution

- chargement local sans erreur JavaScript observée ;
- navigation entre les quatre vues ;
- modification du capital et recalcul visible ;
- presets de courtier et paramètres de coûts ;
- réinitialisation du jeu de démonstration ;
- import CSV nominal ;
- refus d'un import incomplet ou numériquement invalide avec conservation de l'état précédent ;
- export CSV des décisions ;
- filtres et recherche dans le ledger ;
- ouverture et fermeture de la modal méthodologique ;
- échappement de l'injection HTML testée dans le DOM.

Ces validations portent sur l'exécution fonctionnelle du dashboard, pas sur l'exactitude générale du moteur quantitatif.

## Audit technique initial

Le rapport `docs/TECHNICAL_AUDIT.md` a été produit à partir du fichier source vérifié par SHA-256, avec lecture du code, exécution Chromium et jeux CSV synthétiques.

### Défauts critiques encore ouverts

1. absence de contrainte de capital entre positions simultanées ;
2. allocation du budget de turnover avec connaissance de l'ensemble futur des opportunités ;
3. courbe de capital qui n'est ni une courbe réalisée aux sorties ni une courbe mark-to-market.

### H1 corrigé, validé et fusionné

La correction H1 est fusionnée dans `breaktest-bootstrap` par la pull request `#2`, commit squash `380e9e99f5b59387586df4290f32d5b057e2f3bd`.

Le moteur distingue une valeur numérique valide, manquante et invalide, refuse les lots ambigus et conserve la provenance des dérivations PnL/rendement.

Les preuves sont enregistrées dans `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### C2 — noyau fusionné, durcissement validé

Le noyau C2 est fusionné dans `breaktest-bootstrap` par la pull request `#3`, commit `bdd9d244925bc7097516410fdab3a2d005962ca7`.

Il construit un modèle distinct pour chaque décision avec uniquement les lignes backtest dont la sortie est strictement antérieure à l'entrée de la décision. Les lignes live, futures, de même date, invalides et la décision elle-même sont exclues ; les décisions à date invalide sont placées en observation sans entraînement.

Le durcissement `codex/c2-hardening` ajoute :

- validation stricte des dates ISO calendaires ;
- exclusion de la décision par identité d'objet, afin de conserver une autre ligne portant le même identifiant ;
- tests de non-régression pour une date impossible et des identifiants dupliqués ;
- cible déterministe de 138 887 octets, SHA-256 `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454`.

Validations exécutées sur la version durcie :

- `python3 scripts/build_breaktest.py` : réussite ;
- `node tests/h1_strict_numeric_validation.test.js` : réussite ;
- `python3 tests/h1_browser_smoke.py` : réussite ;
- `python3 tests/c2_temporal_isolation.py` : réussite ;
- JavaScript extrait : syntaxe validée avec `node --check` ;
- ajout d'observations futures ou live interdites : aucune modification de la décision antérieure testée ;
- date calendaire impossible : exclue ou placée en observation selon son rôle ;
- identifiants dupliqués : aucune exclusion erronée de l'historique admissible ;
- libellés trompeurs OOS/walk-forward retirés ;
- limitation `turnover encore ex post` affichée.

Le détail est enregistré dans `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### Défauts élevés encore ouverts

1. champs de PnL net/full-cost du journal ignorés ;
2. prix en euros reconvertis comme une devise étrangère ;
3. absence de réconciliation PnL / rendement / nominal ;
4. risque d'injection de formule dans l'export CSV ;
5. coût algorithmique élevé sur les imports moyens.

## Ce qui n'est pas encore considéré comme validé

- exactitude de chaque formule ;
- conformité des calculs aux rapports sources ;
- simulation d'un portefeuille réellement financé ;
- allocation strictement chronologique du turnover ;
- courbe de capital réalisée ou mark-to-market ;
- robustesse de l'import sur une couverture large de formats ;
- sécurité exhaustive du parsing et des exports ;
- compatibilité complète Safari, iPad, mobile et navigateurs ;
- reproductibilité du Breaktest Score ;
- cohérence complète entre produit, deck et chiffres ;
- valeur commerciale réelle et disposition à payer.

## Hébergement GitHub initial

- dépôt d'amorçage : `babou9280/investment-strategy-evaluation` ;
- branche de référence isolée : `breaktest-bootstrap` ;
- branche de durcissement C2 : `codex/c2-hardening` ;
- la branche `main` et le projet universitaire d'origine restent inchangés ;
- les PDF restent locaux et ne sont pas nécessaires aux corrections de code actuellement ciblées.

## Prochaine exécution autorisée

1. auditer et fusionner le durcissement C2 uniquement vers `breaktest-bootstrap` ;
2. ouvrir ensuite une branche isolée pour C3 — allocation chronologique du turnover ;
3. ne rien fusionner dans `main`.
