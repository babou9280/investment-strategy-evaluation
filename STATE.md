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

`app/Breaktest_Studio.html` est le fichier canonique provisoire. La source v0.2 auditée est conservée dans sept fragments immuables sous `app/.bundle/` et reconstruite de façon déterministe par `scripts/materialize_breaktest.py`.

Empreinte de la source pré-correction :

`5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`

Empreinte de la version candidate après correction H1 :

`f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c`

## Fonctionnalités confirmées par exécution

- chargement local sans erreur JavaScript observée ;
- navigation entre les quatre vues ;
- modification du capital et recalcul visible ;
- presets de courtier et paramètres de coûts ;
- réinitialisation du jeu de démonstration ;
- import CSV nominal ;
- refus d'un import incomplet avec conservation de l'état précédent ;
- export CSV des décisions ;
- filtres et recherche dans le ledger ;
- ouverture et fermeture de la modal méthodologique ;
- échappement de l'injection HTML testée dans le DOM.

Ces validations portent sur l'exécution fonctionnelle du dashboard, pas sur l'exactitude générale du moteur quantitatif.

## Audit technique initial

Le rapport `docs/TECHNICAL_AUDIT.md` a été produit à partir du fichier source vérifié par SHA-256, avec lecture du code, exécution Chromium et jeux CSV synthétiques.

### Défauts critiques encore ouverts

1. absence de contrainte de capital entre positions simultanées ;
2. fuite temporelle et contamination possible des échantillons ;
3. allocation du budget de turnover avec connaissance de l'ensemble futur des opportunités ;
4. courbe de capital qui n'est ni une courbe réalisée aux sorties ni une courbe mark-to-market.

### Défaut H1 corrigé et vérifié sur la branche candidate

La branche `codex/h1-strict-numeric-validation` distingue désormais une valeur numérique valide, manquante et invalide. Elle refuse le lot lorsqu'une valeur explicitement fournie est invalide ou lorsque PnL et rendement bruts sont tous deux absents. Un champ manquant peut être dérivé uniquement à partir de l'autre champ et d'un nominal valides ; la provenance dérivée est conservée.

Validations exécutées :

- `python3 scripts/materialize_breaktest.py` : source et cible vérifiées par SHA-256 ;
- `node tests/h1_strict_numeric_validation.test.js` : réussite ;
- `python3 tests/h1_browser_smoke.py` : réussite dans Chromium ;
- snapshot numérique des 40 trades de démonstration : inchangé ;
- import valide avec rendement dérivé : accepté ;
- import comportant un rendement non numérique : refusé, ancien jeu conservé ;
- JavaScript extrait : syntaxe validée avec `node --check`.

Le détail reproductible est enregistré dans `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

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
- caractère strictement OOS ou walk-forward ;
- robustesse de l'import sur une couverture large de formats ;
- sécurité exhaustive du parsing et des exports ;
- compatibilité complète Safari, iPad, mobile et navigateurs ;
- reproductibilité du Breaktest Score ;
- cohérence complète entre produit, deck et chiffres ;
- valeur commerciale réelle et disposition à payer.

## Hébergement GitHub initial

- dépôt d'amorçage : `babou9280/investment-strategy-evaluation` ;
- branche de référence isolée : `breaktest-bootstrap` ;
- branche de correction : `codex/h1-strict-numeric-validation` ;
- pull request brouillon : `#2` vers `breaktest-bootstrap` ;
- la branche `main` et le projet universitaire d'origine restent inchangés ;
- les PDF restent locaux et ne sont pas nécessaires aux corrections de code actuellement ciblées.

## Prochaine exécution autorisée

1. auditer le diff réel de la pull request H1 et les fichiers versionnés ;
2. fusionner dans `breaktest-bootstrap` uniquement si les preuves et le périmètre sont conformes ;
3. ouvrir ensuite une branche isolée pour C2 — isolation temporelle et par échantillon ;
4. ne rien fusionner dans `main`.
