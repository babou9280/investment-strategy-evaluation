# Breaktest - état actuel

## Version

Prototype local-first 0.1, consolidé et audité initialement le 12 juillet 2026.

## Matériel existant

- un prototype HTML autonome de 132 899 octets ;
- quatre fichiers de lancement qui contiennent le même code et diffèrent seulement par le titre et la vue initiale : Capital Fit, Cost X-Ray, Evidence Lab et Trade Gate ;
- un pitch deck ;
- un product blueprint ;
- un guide utilisateur ;
- un journal de backtest ;
- un journal de live-test ;
- un rapport académique d'évaluation de stratégie.

## Consolidation réalisée

`app/Breaktest_Studio.html` est le fichier canonique provisoire. Les quatre variantes originales sont conservées dans le pack local dans `source_material/` à titre d'archive.

L'empreinte du fichier canonique audité est :

`5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`

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

Le rapport `docs/TECHNICAL_AUDIT.md` a été produit à partir du fichier local vérifié par SHA-256, avec lecture du code, exécution Chromium et jeux CSV synthétiques.

### Défauts critiques démontrés

1. absence de contrainte de capital entre positions simultanées ;
2. fuite temporelle et contamination possible des échantillons ;
3. allocation du budget de turnover avec connaissance de l'ensemble futur des opportunités ;
4. courbe de capital qui n'est ni une courbe réalisée aux sorties ni une courbe mark-to-market.

### Défauts élevés démontrés

1. rendements invalides ou absents convertis silencieusement en zéro ;
2. champs de PnL net/full-cost du journal ignorés ;
3. prix en euros reconvertis comme une devise étrangère ;
4. absence de réconciliation PnL / rendement / nominal ;
5. risque d'injection de formule dans l'export CSV ;
6. coût algorithmique élevé sur les imports moyens.

## Ce qui n'est pas encore considéré comme validé

- exactitude de chaque formule ;
- conformité des calculs aux rapports sources ;
- simulation d'un portefeuille réellement financé ;
- caractère strictement OOS ou walk-forward ;
- robustesse de l'import sur des fichiers variés ;
- sécurité exhaustive du parsing et des exports ;
- tests automatiques intégrés au dépôt ;
- compatibilité complète Safari, iPad, mobile et navigateurs ;
- reproductibilité du Breaktest Score ;
- cohérence complète entre produit, deck et chiffres ;
- valeur commerciale réelle et disposition à payer.

## Hébergement GitHub initial

- dépôt d'amorçage : `babou9280/investment-strategy-evaluation` ;
- branche isolée : `breaktest-bootstrap` ;
- la branche `main` et le projet universitaire d'origine restent inchangés ;
- les documents canoniques, les instructions de travail, le manifeste des sources et l'audit initial sont présents sur la branche ;
- le prototype HTML et les PDF restent dans le pack local tant que leur présence dans GitHub n'a pas été vérifiée explicitement ;
- le workflow ne dépend plus d'une pièce jointe ZIP dans Codex Cloud : Codex doit travailler à partir des fichiers présents dans le dépôt associé à son environnement.

## Prochaine exécution autorisée

1. matérialiser `app/Breaktest_Studio.html` sur `breaktest-bootstrap` avec contrôle de son SHA-256 ;
2. confier à Codex la première correction étroite : validation stricte des champs numériques et tests de non-régression associés ;
3. ne pas refactorer l'architecture ni fusionner dans `main` avant revue des résultats.