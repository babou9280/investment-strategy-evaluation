# Prochaine mission Codex — revue interne Capital Efficiency

## Statut

Le laboratoire Capital Efficiency est implémenté sous `capital_efficiency_lab/` et a réussi une première validation complète dans GitHub Actions.

La mission suivante n'est pas d'ajouter des fonctionnalités. Elle consiste à transformer la preuve technique en un prototype interne réellement critiquable, sans publication externe.

Branche active : `strategy/capital-efficiency-core` jusqu'à fusion éventuelle de la pull request `#20`.

Ne modifie jamais `main`. Ne publie rien. Ne fusionne rien automatiquement.

## Avant de travailler

Lire intégralement :

- `AGENTS.md` ;
- `PRODUCT.md` ;
- `QUALITY.md` ;
- `STATE.md` ;
- `DECISIONS.md` ;
- `METHODOLOGY.md` ;
- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `docs/product/CAPITAL_EFFICIENCY_CORE.md` ;
- `docs/product/WORLD_CLASS_PLATFORM_THESIS.md` ;
- `docs/product/DIFFERENTIATION_AND_EVIDENCE_PLAN.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/tasks/CAPITAL_EFFICIENCY_LAB.md` ;
- `docs/validation/CAPITAL_EFFICIENCY_LAB.md` ;
- le code et les tests de `capital_efficiency_lab/`.

## Objectif unique

Effectuer une revue hostile et multidisciplinaire du laboratoire comme si le produit devait être examiné simultanément par :

- un utilisateur autonome non expert ;
- un professionnel de marché ;
- un responsable produit fintech ;
- un ingénieur logiciel ;
- un évaluateur d'école de commerce ou d'ingénierie très sélective.

La revue doit déterminer si une démonstration de 90 secondes montre réellement que Breaktest apporte davantage qu'un calculateur de frais.

## Questions obligatoires

1. Le seuil brut est-il compris sans aide ?
2. Le plancher variable et le coût fixe diluable sont-ils distingués ?
3. La part conservée et la marge nette sont-elles réconciliées et prioritaires ?
4. Une contrainte inverse est-elle utile, conditionnelle et non prescriptive ?
5. Un cas structurellement impossible est-il compréhensible ?
6. Les hypothèses, unités, dénominateurs et provenance sont-ils visibles ?
7. Le produit évite-t-il la fausse précision et la sophistication décorative ?
8. Le parcours permet-il une critique sérieuse de la valeur commerciale ?
9. Le projet produit-il une preuve crédible de finance, ingénierie et entrepreneuriat sans exagération ?
10. Quelle fonction ou formulation devrait être supprimée plutôt qu'ajoutée ?

## Travail autorisé

- corriger les défauts de calcul ou de contrat ;
- améliorer la compréhension directe du parcours ;
- supprimer les éléments redondants ;
- ajouter des tests de non-régression ;
- préparer un protocole de revue interne de cinq participants ;
- préparer des scénarios synthétiques complémentaires strictement nécessaires ;
- documenter les objections et critères d'abandon ;
- vérifier Safari/iPad lorsque l'environnement le permet.

## Travail interdit

- publication externe ;
- import réel ;
- compte ou stockage persistant ;
- données ou tarifs de courtier réels ;
- analytics, email ou paiement ;
- recommandation, score opaque ou sélection d'actif ;
- statistiques avancées sans données suffisantes ;
- reprise H3 à H6 ;
- modification de `app/Breaktest_Studio.html` ;
- modification fonctionnelle de `validation_site/` ;
- développement de marketplace, affiliation ou API.

## Validation obligatoire

Après chaque modification :

- oracles Node ;
- tests d'invariants ;
- Chromium à 390, 768, 1024 et 1440 px ;
- navigation clavier et focus ;
- absence de débordement ;
- aucune valeur `NaN`, `Infinity` ou `-0` ;
- intégrité locale ;
- syntaxe ;
- non-régressions H1–H2/C1–C4 et Q0.

## Définition de terminé

La revue interne est prête seulement si :

- le laboratoire est techniquement vert sur le head exact ;
- les limites et preuves sont synchronisées ;
- un protocole court permet d'obtenir des observations réelles sans orienter les réponses ;
- aucune nouvelle affirmation commerciale n'est ajoutée ;
- les défauts connus sont classés en blocants, importants ou différables ;
- la prochaine décision demandée à Ayman est unique et réellement nécessaire.
