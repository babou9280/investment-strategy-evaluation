# Prochaine mission Codex — Capital Efficiency Lab

## Statut

La publication externe du calculateur Q0 est suspendue. La nouvelle mission active consiste à construire un prototype interne apportant davantage de valeur que le simple calcul de coûts.

Branche de travail : `strategy/capital-efficiency-core`.

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
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/tasks/CAPITAL_EFFICIENCY_LAB.md` ;
- les validations historiques et Cost Intelligence existantes.

## Objectif unique

Exécuter intégralement `docs/tasks/CAPITAL_EFFICIENCY_LAB.md`.

Construire sous `capital_efficiency_lab/` un laboratoire local et responsive qui relie les coûts à un avantage brut fourni par l'utilisateur.

Le produit doit prioriser :

1. le seuil brut de couverture lorsque l'avantage brut est absent ;
2. la marge nette et la part de l'avantage conservée lorsque l'avantage brut est fourni ;
3. le plancher variable de friction ;
4. la taille minimale de couverture ;
5. la taille minimale permettant une rétention cible ;
6. la fréquence frontière sous un budget annuel de friction ;
7. la sensibilité transparente aux hypothèses.

Le coût en euros reste une explication du résultat, pas la proposition de valeur principale.

## Règles quantitatives

Implémenter exactement `docs/standards/EDGE_SURVIVAL_CONTRACT.md`.

- aucun arrondi interne ;
- tous les taux en décimaux internes ;
- dénominateurs nommés ;
- provenance visible ;
- avantage brut facultatif, jamais inventé par défaut ;
- cas impossibles affichés sans `Infinity` ;
- rétention négative non tronquée ;
- projection annuelle qualifiée d'arithmétique, sans capitalisation ;
- aucun score opaque ;
- aucune taille ou fréquence qualifiée d'optimale.

## Tests obligatoires

- tous les cas du contrat Edge Survival ;
- oracles indépendants ;
- invariants de réconciliation ;
- monotonicité et convergence ;
- achat simple / aller-retour ;
- avantage absent, nul, négatif et positif ;
- cas structurellement impossible ;
- zéro, absence, invalidité et valeurs non finies ;
- aucune valeur `NaN`, `Infinity` ou `-0` visible ;
- Chromium 390, 768, 1024 et 1440 px ;
- clavier, focus, annonces accessibles et absence de débordement ;
- absence de réseau, stockage persistant, secret, analytics, email et paiement ;
- syntaxe JavaScript ;
- non-régression H1–H2/C1–C4 ;
- non-régression du site Q0 fusionné.

## Documentation à mettre à jour

Après exécution réelle seulement :

- `STATE.md` ;
- `DECISIONS.md` avec les décisions D025 à D027 si elles n'y figurent pas encore ;
- `METHODOLOGY.md` ;
- `QUALITY.md` ;
- `AGENTS.md` ;
- `VALIDATION_PLAN.md` ;
- `BUSINESS_MODEL.md` uniquement pour distinguer le calculateur gratuit de la couche Edge Survival ;
- `docs/validation/CAPITAL_EFFICIENCY_LAB.md` avec commandes, résultats exacts, head, limites et preuves.

Ne présenter aucune formule ou interface comme commercialement validée.

## Interdictions

- aucun déploiement externe ;
- aucun import réel ;
- aucun courtier ou tarif réel ;
- aucun compte ;
- aucun tracking ;
- aucun paiement ;
- aucune recommandation ;
- aucune statistique avancée sans données ;
- aucune reprise de H3 à H6 ;
- aucune modification de `app/Breaktest_Studio.html` ;
- aucune modification fonctionnelle de `validation_site/` ;
- aucune modification de `main`.

## Définition de terminé

La mission est terminée uniquement si le code, les tests, les logs et les documents existent réellement sur GitHub, que toutes les suites pertinentes réussissent sur le head exact et qu'aucune capacité externe n'a été activée.
