# Mission — fondation Cost Gate

## Statut

- Branche : `strategy/cost-gate-foundation`
- Base : `breaktest-bootstrap`
- Phase : preuve synthétique interne exécutée ; synchronisation et revue finale de PR
- Publication : interdite
- Données externes : interdites
- `main` : hors périmètre

## Objectif unique

Transformer la direction stratégique Cost Gate en une fondation cohérente, falsifiable et testable, sans construire prématurément un produit connecté.

La mission doit répondre :

> Quel moteur minimal peut détecter et expliquer plusieurs incompatibilités pré-trade sous des hypothèses synthétiques, sans devenir une recommandation ni prétendre disposer de données actuelles ?

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
- `docs/standards/COST_GATE_METHOD_CONTRACT.md` ;
- `docs/standards/COST_GATE_PERSONALIZATION_BOUNDARY.md` ;
- `docs/standards/COST_GATE_SNAPSHOT_CONTRACT.md` ;
- `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- `docs/standards/COST_GATE_FINDINGS_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_ALIGNMENT_KEY.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/governance/BLIND_SPOT_REGISTER.md` ;
- `docs/scenarios/COST_GATE_FOUNDATION_MATRIX.md` ;
- les validations Edge Survival fusionnées.

## Étape 1 — revue hostile des contrats

Avant code :

- repérer contradictions, doublons et termes ambigus ;
- vérifier les unités, bases et dépendances ;
- vérifier la séparation cash immédiat / coût du cycle ;
- vérifier la frontière personnalisation / recommandation ;
- vérifier le snapshot et l'invalidation ;
- vérifier que `findings[]` ne perd aucun sous-diagnostic ;
- compléter le registre des angles morts ;
- proposer les corrections directement sur la branche.

## Étape 2 — schéma déterministe

Après cohérence documentaire, créer uniquement si nécessaire un dossier isolé :

```text
cost_gate_foundation/
```

Il peut contenir :

- schéma d'entrée synthétique ;
- normalisation stricte ;
- orchestration des couches déjà validées ;
- objet snapshot manuel ;
- `findings[]` ;
- synthèse interne ;
- oracles Node indépendants pour la matrice.

Il ne doit pas contenir :

- interface finale ;
- données réelles ;
- connexion, import ou stockage ;
- fournisseur de marché ;
- recommandation ;
- exécution ;
- IA générative dans la logique canonique.

## Périmètre du moteur synthétique

Support initial :

```text
cash_account
long_cash_purchase
actions_et_etf_au_comptant
hypothèses_manuelles_ou_synthetic_demo
```

Tout autre domaine retourne `unsupported`.

Le moteur doit distinguer :

- coût du cycle ;
- cash immédiat ;
- avantage absent, point ou fourchette ;
- capital calculable ou indisponible ;
- données externes non évaluées ;
- contraintes explicites ;
- constats multiples.

## Preuve fonctionnelle exécutée

```text
engine = cost-gate-foundation-0-synthetic
head = cfa88e861c2ad0715b183af2bac2368a2d7bbdb4
GitHub Actions = 29334708343 (#604)
conclusion = success
scenarios = CG-01 à CG-18
```

Le moteur est isolé sous `cost_gate_foundation/`. Il réutilise Capital Efficiency sans modifier `capital_efficiency_lab/`.

La preuve couvre aussi :

- cash du compte plafonné par l'allocation libre de stratégie ;
- holds déjà inclus non retranchés une seconde fois ;
- 502,25 EUR de cash immédiat distincts de 5,50 EUR de friction du cycle ;
- hash de contenu distinct de l'identifiant d'instance ;
- avantage brut issu de prix exécutés rejeté sans reconstruction ;
- quantité, prix, devise et nominal réconciliés ;
- fait dur indépendant non masqué par une donnée manquante ;
- anciens constats inactifs après mutation.

La validation détaillée figure dans `docs/validation/COST_GATE_FOUNDATION.md`.

## Tests requis

Implémenter les scénarios CG-01 à CG-18 avec oracles explicites.

Ajouter :

- strict numeric validation ;
- zéro/absence/invalidité ;
- exact seuil ;
- sous plancher ;
- double comptage spread et performance issue de prix exécutés ;
- cash et cycle distincts ;
- source déjà nette d'un hold, sans second retrait ;
- allocation de stratégie inférieure au cash du compte ;
- réconciliation quantité × prix × devise ;
- ordres en attente ;
- snapshot déterministe et identité d'instance séparée ;
- invalidation après changement ;
- constat multiple et priorité dépendante des preuves ;
- ordre stable ;
- domaine non supporté ;
- absence de termes prescriptifs ;
- aucune donnée externe revendiquée ;
- aucune valeur non finie ;
- non-régressions Edge Survival, Q0 et moteur historique.

## Versionnement envisagé

Première preuve exécutée :

```text
cost-gate-foundation-0-synthetic
```

Ce numéro identifie uniquement la preuve synthétique restreinte. Il ne nomme pas un produit prêt à publier.

## Documentation de validation

Créer seulement après exécution :

```text
docs/validation/COST_GATE_FOUNDATION.md
```

Elle indique :

- head exact ;
- commandes ;
- scénarios réussis ;
- limites ;
- périmètre non supporté ;
- absence de données externes ;
- absence de validation juridique, utilisateur ou commerciale.

## Interdictions

- aucune modification de `main` ;
- aucune modification fonctionnelle du moteur historique, Q0 ou Edge Survival ;
- aucune donnée ou tarif réel ;
- aucun réseau, compte, stockage, analytics, email ou paiement ;
- aucun profil de risque ;
- aucun actif ou courtier recommandé ;
- aucune taille ou fréquence recommandée ;
- aucun ordre ;
- aucune probabilité d'exécution ;
- aucune revendication de conformité ;
- aucun livrable final pour Ayman avant cohérence et validation.

## Définition de terminé

La mission de fondation est terminée uniquement si :

- les contrats sont cohérents, y compris cash, allocation de stratégie, identité du snapshot et alignement de `G` ;
- les angles morts nouveaux sont enregistrés ;
- le schéma ne dépasse pas le périmètre cash long synthétique ;
- les 18 scénarios sont démontrés si le moteur est implémenté ;
- toutes les non-régressions pertinentes sont vertes ;
- aucune affirmation externe n'est ajoutée ;
- les fichiers canoniques reflètent exactement le niveau de preuve ;
- la prochaine décision est clairement Gate 1 : critique de valeur et compréhension sur HTML hors ligne.
