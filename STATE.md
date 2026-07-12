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
- branche de référence isolée : `breaktest-bootstrap` ;
- la branche `main` et le projet universitaire d'origine restent inchangés ;
- les documents canoniques, les instructions, l'audit initial et une copie reproductible du HTML audité sont présents sur `breaktest-bootstrap` ;
- la copie HTML est stockée en sept fragments vérifiés dans `app/.bundle/` et reconstruite par `scripts/materialize_breaktest.py` ;
- le script contrôle 7 fragments, 41 356 caractères encodés, 132 899 octets décodés et le SHA-256 canonique avant d'écrire `app/Breaktest_Studio.html` ;
- les PDF restent locaux et ne sont pas nécessaires à la première correction H1 ;
- le workflow Codex utilise le dépôt et ne dépend d'aucune pièce jointe ZIP.

## Première correction en cours

- branche de travail : `codex/h1-strict-numeric-validation` ;
- pull request brouillon : `#2` vers `breaktest-bootstrap` ;
- périmètre : uniquement H1, validation stricte des données numériques ;
- la commande `@codex` a été acceptée par le connecteur Codex ;
- aucun résultat, test ou correctif Codex n'est encore déclaré validé tant que la branche n'a pas reçu les modifications et preuves attendues.

## Prochaine exécution autorisée

1. Codex matérialise et vérifie le HTML canonique sur sa branche de travail ;
2. Codex corrige uniquement H1 et exécute les tests de non-régression ;
3. les changements sont audités avant toute fusion dans `breaktest-bootstrap` ;
4. aucune fusion dans `main`.