# Prochaine mission Codex — stabilisation finale de Cost Gate foundation

## Statut

La direction **Breaktest Cost Gate** est validée stratégiquement. La fondation synthétique est implémentée, mais la pull request reste en brouillon.

```text
pull request = #24
branch = strategy/cost-gate-foundation
base = breaktest-bootstrap
functional head = cfa88e861c2ad0715b183af2bac2368a2d7bbdb4
functional run = 29334708343 (#604), success
engine = cost-gate-foundation-0-synthetic
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
- réconciliation quantité, prix, devise et nominal ;
- alignement complet de l'avantage brut ;
- hash de contenu et instance séparés ;
- invalidation des anciens constats ;
- priorité des constats dépendante des preuves ;
- refus de marge, short, dérivés et provenance externe ;
- absence de réseau, persistance, recommandation et exécution ;
- non-régressions historiques, Q0, Capital Efficiency et Edge Survival.

Traiter les commentaires de revue GitHub seulement après vérification que leur cause est réellement corrigée sur le head distant.

## Preuve fonctionnelle déjà obtenue

Le run `#604` sur `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4` a exécuté :

```text
Cost Gate foundation engine tests passed
Cost Gate foundation scenario matrix passed: CG-01 to CG-18
Cost Gate foundation property tests passed
Cost Gate foundation static integrity passed
```

Il a aussi réussi le build, H1–H2/C1–C4, Q0, Capital Efficiency, Edge Survival, Chromium 390/768/1024/1440 et la syntaxe.

Artefact :

```text
id = 8311484443
digest = sha256:f95dfd83ba47ca1b1896dece5259a0831db96ff7156d0e194088fb40e6a24b46
```

Cette preuve doit être réexécutée si le code ou le workflow change. Une synchronisation documentaire ultérieure exige au minimum un run exact-head réussi avant clôture de la stabilisation.

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
