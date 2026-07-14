# Mission — fondation Cost Gate

## Statut

- Branche : `strategy/cost-gate-foundation`
- Base : `breaktest-bootstrap`
- Phase : durcissement rétrospectif version `3` prévalidé localement ; CI distante requise
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
première preuve distante = cost-gate-foundation-0-synthetic
head = cfa88e861c2ad0715b183af2bac2368a2d7bbdb4
GitHub Actions = 29334708343 (#604)
conclusion = success
scenarios = CG-01 à CG-18
```

La revue exacte du head documentaire `be6aa09d2b87bb07bd19258f393b496e522580a1` a ouvert trois fils sur l'indépendance du cash, l'expiration et la coexistence stale/conflit. La révision `cost-gate-foundation-1-synthetic`, prouvée par le run `#608` puis synchronisée sur `9d38ce31e33b41159d0c6180205c3747c3bb6f1d` par le run `#610`, a corrigé ces causes ainsi que portée/côtés, ordre canonique et vocabulaire de synthèse.

La revue automatisée finale du head exact `9d38ce31e33b41159d0c6180205c3747c3bb6f1d` a ensuite révélé quatre défauts supplémentaires : nominal économique non réconcilié avec quantité × prix, source observée après l'évaluation, expiration agrégée pilotée par une source non critique et collections mal formées assimilées à des listes vides. L'audit adjacent a reproduit une contradiction base brute/nette contre holds inclus, puis les incohérences devise/FX et coûts d'entrée/cycle. La révision `cost-gate-foundation-2-synthetic` corrige ces causes sur le head `faafd348da55217e96ba67efd9f9434be62725ca` ; le run exact-head `#612` (`29342135098`) et l'artefact `8314518122` inspecté les valident techniquement. La synchronisation documentaire, les réponses aux quatre fils et une dernière revue du head final restent requises.

La revue hostile indépendante du head documentaire `6cfc43e4bbb015c8512c0ae26aad02d04503c897`, engagée après l'indisponibilité du quota de revue automatisée, a ensuite trouvé quatre défauts adjacents : conflit même devise/FX dépendant à tort de la présence du cash ; taxe ou frais contractuel laissant la friction et Edge Survival paraître complets ; heure d'évaluation invalide laissant un snapshot paraître actuel ; identité ou caractère critique de source incomplets. Pendant la correction, un cinquième risque de régression a aussi été verrouillé : une source non critique stale ne doit jamais coexister avec un constat positif affirmant que toutes les sources sont actuelles. La révision locale `cost-gate-foundation-3-synthetic` ajoute les garde-fous et régressions correspondants. Elle n'est pas validée à distance tant qu'un nouveau head exact, sa CI et son artefact n'ont pas été inspectés.

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
- réconciliation quantité × prix × devise × nominal économique ;
- réconciliation entre base brute/nette, liste source et indicateurs des holds ;
- refus d'une source observée après l'heure d'évaluation ;
- expiration agrégée limitée aux sources critiques ;
- rejet des collections non-tableaux ;
- cohérence devise compte/cotation et coûts FX ;
- conflit même devise/FX refusé même sans vue cash et cas même devise/FX nul conservé valide ;
- réconciliation commission et change entre cash d'entrée et coût du cycle ;
- refus explicite des taxes ou frais d'entrée non modélisés dans le cycle, avec friction incomplète et Edge Survival non évalué ;
- identité complète, indicateur critique explicite et heure d'évaluation valide pour toute source ;
- absence de constat positif d'actualité lorsqu'une source non critique est stale ;
- inactivation des anciens constats lorsque l'heure d'évaluation est invalide à contenu identique ;
- ordres en attente ;
- snapshot déterministe et identité d'instance séparée ;
- invalidation après changement ;
- inactivation après expiration à contenu identique ;
- constat multiple et priorité dépendante des preuves ;
- stale et conflit simultanément visibles ;
- portée économique cohérente avec le nombre de côtés ;
- ordre des ensembles sans effet sur le hash ;
- cash calculable malgré une erreur indépendante de friction ;
- avantage absorbé distinct d'une contrainte utilisateur ;
- ordre stable ;
- domaine non supporté ;
- absence de termes prescriptifs ;
- aucune donnée externe revendiquée ;
- aucune valeur non finie ;
- non-régressions Edge Survival, Q0 et moteur historique.

## Versionnement envisagé

Révision courante :

```text
cost-gate-foundation-3-synthetic
cost-gate-snapshot-4
cost-gate-findings-4
cost-gate-findings-catalog-4
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
