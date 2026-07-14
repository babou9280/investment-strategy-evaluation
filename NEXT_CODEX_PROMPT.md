# Prochaine mission Codex — fondation Cost Gate

## Statut

Edge Survival Envelope est fusionné dans `breaktest-bootstrap` par la pull request `#23`.

La direction **Breaktest Cost Gate — contrôle pré-trade personnalisé** est validée stratégiquement. Elle complète Cost Intelligence, Capital Efficiency et Edge Survival ; elle ne les remplace pas.

- Branche : `strategy/cost-gate-foundation`
- Base : `breaktest-bootstrap`
- Phase : contrats et preuve synthétique interne
- Publication externe : interdite
- `main` : strictement hors périmètre

Ne fusionne rien automatiquement.

## Avant de travailler

Lire intégralement :

- `AGENTS.md` ;
- les six fichiers canoniques ;
- `STRATEGY.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `docs/product/COST_GATE_DIRECTION.md` ;
- `docs/product/COST_GATE_MVP_GATE_MATRIX.md` ;
- `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md` ;
- `docs/standards/COST_GATE_METHOD_CONTRACT.md` ;
- `docs/standards/COST_GATE_PERSONALIZATION_BOUNDARY.md` ;
- `docs/standards/COST_GATE_SNAPSHOT_CONTRACT.md` ;
- `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- `docs/standards/COST_GATE_FINDINGS_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/governance/BLIND_SPOT_REGISTER.md` ;
- `docs/scenarios/COST_GATE_FOUNDATION_MATRIX.md` ;
- `docs/tasks/COST_GATE_FOUNDATION.md` ;
- les validations Edge Survival fusionnées.

## Objectif unique

Construire une fondation déterministe permettant de détecter et d'expliquer plusieurs incompatibilités pré-trade sous des hypothèses synthétiques, sans donnée actuelle, recommandation ou exécution.

La fondation doit distinguer :

- friction économique du cycle ;
- besoin de cash immédiat ;
- seuil et Edge Survival ;
- faisabilité du cash ;
- qualité ou absence de données ;
- contraintes explicites ;
- domaine non supporté ;
- constats multiples et synthèse interne.

## Première étape obligatoire

Effectuer une revue hostile des nouveaux contrats avant code :

- contradictions ;
- doublons ;
- unités et dénominateurs ;
- double comptage ;
- base du nominal ;
- frais déjà incorporés au prix ;
- cash réglé, réservations et ordres en attente ;
- personnalisation contre suitability ;
- snapshot et temps de contrôle / temps d'usage ;
- perte de constats dans une synthèse ;
- alignement de l'avantage brut ;
- angles morts réglementaires, sécurité, données, business et UX.

Corriger les contrats et le registre avant toute implémentation.

## Implémentation autorisée après revue

Créer au besoin un dossier isolé :

```text
cost_gate_foundation/
```

Périmètre :

```text
cash_account
long_cash_purchase
actions_et_etf_au_comptant
hypothèses_manuelles_ou_synthetic_demo
```

Le moteur peut exposer :

- validation stricte ;
- snapshot manuel déterministe ;
- orchestration des moteurs validés ;
- `findings[]` ;
- synthèse interne non affichée comme feu vert ;
- domaine non supporté ;
- oracles indépendants.

## Matrice obligatoire

Démontrer CG-01 à CG-18 dans `docs/scenarios/COST_GATE_FOUNDATION_MATRIX.md`.

Points critiques :

- exact seuil : coût couvert, aucune marge positive ;
- sous plancher : impossibilité structurelle ;
- avantage positif avec cash insuffisant ;
- cash immédiat distinct des coûts de sortie futurs ;
- spread déjà inclus au prix sans double comptage ;
- quote stale ;
- conflit instrument/place/devise ;
- avantage brut mal aligné ;
- violations simultanées conservées ;
- snapshot invalidé ;
- ordre en attente ;
- instruments et comptes non supportés ;
- sous-calcul utile malgré une donnée manquante.

## Tests obligatoires

- oracles explicites indépendants ;
- strict numeric validation ;
- zéro, absence et invalidité ;
- déterminisme et hash ;
- aucune valeur non finie ;
- ordre stable des constats ;
- aucune perte de constat ;
- aucune recommandation ou vocabulaire d'autorisation ;
- aucune donnée externe revendiquée ;
- non-régressions H1–H2/C1–C4, Q0, Capital Efficiency et Edge Survival ;
- intégrité locale et syntaxe.

## Interdictions

- aucune donnée ou tarif réel ;
- aucun réseau, fournisseur, broker ou Alpaca ;
- aucun compte, import ou stockage ;
- aucune analytics, email ou paiement ;
- aucun profil de risque ;
- aucun actif, courtier, ordre, taille ou fréquence recommandé ;
- aucun levier, marge, short ou dérivé simulé ;
- aucune probabilité d'exécution ;
- aucune interface finale ou publication ;
- aucune modification fonctionnelle des actifs fusionnés ;
- aucune reprise H3–H6 ;
- aucune modification de `main`.

## Livraison ultérieure

Ne remets pas encore de livrable à Ayman.

Après validation de la fondation, le prochain artefact de critique sera un HTML réellement interactif et hors ligne conforme à `docs/delivery/OFFLINE_HTML_DELIVERABLE_STANDARD.md`, puis testé sur le package exact.

## Définition de terminé

La fondation est terminée uniquement si :

- les contrats sont cohérents ;
- les angles morts sont mis à jour ;
- le périmètre cash long synthétique est respecté ;
- les scénarios sont démontrés si le moteur est créé ;
- toutes les non-régressions réussissent sur le head exact ;
- aucune affirmation juridique, commerciale ou temps réel n'est ajoutée ;
- les fichiers canoniques distinguent stratégie, preuve technique et inconnues ;
- le prochain gate est une critique de compréhension et de valeur, pas une connexion de données.