# Prochaine mission Codex — stabilisation finale de Cost Gate foundation

## Statut

La direction **Breaktest Cost Gate** est validée stratégiquement. La fondation synthétique est implémentée, mais la pull request reste en brouillon.

```text
pull request = #24
branch = strategy/cost-gate-foundation
base = breaktest-bootstrap
base head = 5f1281b49fde9363dcb38e0225a5d48d34589475
version 3 functional head = 753152d9cce1feabba48e54b32b4eed2ce3f5e07
version 3 functional tree = 574ec387391a995cec167149cc099e87c1f92c02
version 3 functional run = 29345208179 (#616), success
version 3 artifact = 8315786779
version 3 digest = 67b4603cfd95271a4916ee04e36ed229cb352a6526b0a25f40fd1089dcb8b614
current engine = cost-gate-foundation-3-synthetic
```

`main` reste strictement hors périmètre. Ne fusionne, ne publie et ne déploie rien automatiquement.

## Première action obligatoire

Reconstruire l'état GitHub actuel de la PR `#24` :

1. head, base, brouillon et mergeability ;
2. fichiers réellement présents ;
3. commentaires et threads de revue ;
4. dernier run associé au head exact ;
5. artefact, logs et digest ;
6. différence entre preuve fonctionnelle et synchronisation documentaire.

Le head peut avoir évolué depuis le présent document. Une affirmation locale n'est pas une preuve distante.

Les neuf fils de revue inline ont été résolus après preuves exact-head. Une dernière revue automatisée demandée sur `6cfc43e4bbb015c8512c0ae26aad02d04503c897` n'a pas été exécutée faute de quota. La revue hostile indépendante a alors trouvé quatre défauts adjacents : même devise/FX dépendant du cash, friction faussement complète avec taxe ou frais d'entrée, heure d'évaluation invalide et identité/criticité de source incomplète. La version `3` les corrige et verrouille aussi l'absence de constat d'actualité contradictoire pour une source non critique stale. Vérifier la synchronisation documentaire exact-head avant toute décision de fusion.

## Sources obligatoires

Lire intégralement :

- `AGENTS.md` ;
- les six fichiers canoniques ;
- `STRATEGY.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `docs/product/COST_GATE_DIRECTION.md` ;
- `docs/product/COST_GATE_MVP_GATE_MATRIX.md` ;
- `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md` ;
- tous les contrats Cost Gate sous `docs/standards/` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_ALIGNMENT_KEY.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/governance/BLIND_SPOT_REGISTER.md` ;
- `docs/scenarios/COST_GATE_FOUNDATION_MATRIX.md` ;
- `docs/tasks/COST_GATE_FOUNDATION.md` ;
- `docs/validation/COST_GATE_FOUNDATION.md` ;
- le moteur et tous les tests sous `cost_gate_foundation/` ;
- le workflow GitHub Actions ;
- les validations Edge Survival fusionnées.

## Objectif unique

Terminer la stabilisation de la PR `#24` sans étendre le produit.

Vérifier ou corriger seulement :

- cohérence code–contrats–scénarios–canonicals ;
- calcul `502,25 EUR` de cash immédiat contre `5,50 EUR` de friction de cycle ;
- plafonnement par l'allocation libre de stratégie ;
- absence de double retrait des holds ;
- cohérence entre base brute/nette, liste des holds inclus par la source et ledger ;
- réconciliation quantité, prix, devise et nominal ;
- refus d'une source future et expiration agrégée limitée aux sources critiques ;
- rejet des collections, éléments et identifiants stables mal formés ;
- cohérence devise/FX et coûts communs entre entrée et cycle ;
- conflit même devise/FX refusé même sans vue cash, avec cas FX nul valide ;
- blocage explicite des taxes ou frais d'entrée absents du modèle de cycle, friction incomplète et Edge Survival indisponible ;
- identité, place, devise, caractère critique et heure d'évaluation obligatoires pour une source ;
- anciens constats inactifs lorsque l'heure d'évaluation est invalide à contenu identique ;
- aucune source stale accompagnée d'un constat positif d'actualité globale ;
- alignement complet de l'avantage brut ;
- hash de contenu et instance séparés ;
- invalidation des anciens constats ;
- inactivation après expiration malgré un hash de contenu identique ;
- priorité des constats dépendante des preuves ;
- coexistence des constats stale et conflit ;
- cohérence `operation_scope` / `side_count` ;
- ordre des ensembles sans effet sur le snapshot ;
- indépendance du cash face à une erreur de friction ;
- distinction entre avantage absorbé et contrainte utilisateur ;
- refus de marge, short, dérivés et provenance externe ;
- absence de réseau, persistance, recommandation et exécution ;
- non-régressions historiques, Q0, Capital Efficiency et Edge Survival.

Traiter les commentaires de revue GitHub seulement après vérification que leur cause est réellement corrigée sur le head distant.

## Preuve fonctionnelle déjà obtenue

Le run `#616` sur `753152d9cce1feabba48e54b32b4eed2ce3f5e07` a exécuté :

```text
Cost Gate foundation engine tests passed
Cost Gate foundation scenario matrix passed: CG-01 to CG-18
Cost Gate foundation property tests passed
Cost Gate foundation static integrity passed
```

Il a aussi réussi le build, H1–H2/C1–C4, Q0, Capital Efficiency, Edge Survival, Chromium 390/768/1024/1440 et la syntaxe. L'intégrité Cost Gate couvre cinq fichiers et `94 064` octets sans capacité réseau ou persistance.

Artefact :

```text
id = 8315786779
digest = sha256:67b4603cfd95271a4916ee04e36ed229cb352a6526b0a25f40fd1089dcb8b614
```

Les logs, l'archive et les captures 390/1 440 px ont été inspectés. Le digest téléchargé correspond à GitHub, les dix blobs fonctionnels correspondent au tree distant `574ec387391a995cec167149cc099e87c1f92c02` et les 24 captures sont identiques à la preuve précédente. Cette preuve doit être réexécutée si le code ou le workflow change. La synchronisation documentaire exige son propre run exact-head avant clôture de la stabilisation.

## Interdictions

- aucune interface Cost Gate dans la PR `#24` ;
- aucun HTML final remis à Ayman ;
- aucune donnée ou tarif réel ;
- aucun réseau, fournisseur, broker ou Alpaca ;
- aucun compte, import ou stockage ;
- aucune analytics, email ou paiement ;
- aucun profil de risque ou suitability ;
- aucune recommandation d'actif, courtier, ordre, taille ou fréquence ;
- aucun levier, marge, short ou dérivé simulé ;
- aucune probabilité d'exécution ;
- aucune modification fonctionnelle de `capital_efficiency_lab/`, Q0 ou moteur historique ;
- aucune reprise H3–H6 ;
- aucune modification de `main` ;
- aucune fusion automatique.

## Gate suivant, hors de cette mission

Après clôture séparée de la fondation et décision explicite, le prochain artefact pourra être un HTML Cost Gate réellement interactif et hors ligne sur une nouvelle branche.

Ce futur gate devra tester compréhension, effort de saisie et confusion avec une recommandation. Il ne devra toujours contenir aucune donnée externe.

## Définition de terminé

La stabilisation de la PR `#24` est terminée uniquement si :

- code et documents sont visibles sur GitHub ;
- le head exact final possède une CI verte ;
- logs, jobs et artefact ont été inspectés ;
- CG-01 à CG-18 restent verts ;
- commentaires de revue corrigés sont résolus ;
- fichiers canoniques et registre reflètent le niveau de preuve réel ;
- la PR reste en brouillon ;
- les limites juridiques, commerciales, utilisateur et données restent explicites ;
- aucun hors-périmètre n'a été ajouté.
