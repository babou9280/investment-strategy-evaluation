# Breaktest — état actuel

## 1. Direction active

Le 13 juillet 2026, Ayman a validé le pivot vers **Breaktest Cost Intelligence** pour les petits et moyens portefeuilles.

Le même jour, après revue des prototypes, il a constaté qu'un simple calcul de coûts apportait une valeur insuffisante. Le seuil brut nécessaire a été identifié comme une sortie nettement plus utile.

La direction active est donc raffinée en **Capital Efficiency** : relier les frictions à un avantage brut et montrer la marge qui subsiste, les contraintes qui peuvent être satisfaites et celles qui sont structurellement impossibles.

La phase active est la **conception et le prototype interne**, avant toute publication externe.

Documents de référence :

- `PRODUCT.md` ;
- `STRATEGY.md` ;
- `docs/product/CAPITAL_EFFICIENCY_CORE.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/tasks/CAPITAL_EFFICIENCY_LAB.md` ;
- `NEXT_CODEX_PROMPT.md`.

## 2. Instrument Q0 construit mais publication suspendue

La pull request `#16` a été fusionnée dans `breaktest-bootstrap` au commit `aadef6dec71a6882f9746ea4b2721ee91a3ee1f3`.

Le dossier `validation_site/` contient un calculateur local de coûts avec :

- achat simple ou aller-retour ;
- commission, change, spread et slippage ;
- coût par opération, coût annuel et ratio sur capital ;
- seuil brut de couverture ;
- comparaison descriptive ;
- partage sans capital exact par défaut.

La suite finale a réussi sur le head `f58725cbf3a02967185b74f676b37209e71a5d44`, GitHub Actions run `29269231453`.

La pull request `#17` a ensuite ajouté la préparation de lancement et les contrôles d'intégrité, fusionnés au commit `3ffd20c845e0dcae8c7438fb866a18601ecc7ab3`. L'exécution finale `29270109903` a réussi.

Cependant, le site Q0 n'est pas publié : sa valeur reste principalement descriptive et ne justifie pas encore un test externe.

## 3. Nouvelle mission active

Branche : `strategy/capital-efficiency-core`.

Objectif : construire `capital_efficiency_lab/`, un laboratoire interne déterministe répondant à la question :

> Quelle part d'un avantage brut survit aux frictions, et quelles contraintes économiques doivent être satisfaites pour qu'il subsiste ?

Sorties prévues :

- seuil brut de couverture ;
- plancher variable de friction ;
- marge nette en taux, points de base et euros ;
- part d'avantage absorbée et conservée ;
- taille minimale de couverture ;
- taille minimale pour une rétention cible ;
- fréquence frontière sous budget annuel ;
- sensibilité aux hypothèses.

Le contrat quantitatif est versionné dans `docs/standards/EDGE_SURVIVAL_CONTRACT.md`.

Le laboratoire n'est pas encore implémenté ni validé.

## 4. Build technique historique conservé

`app/Breaktest_Studio.html` demeure l'actif technique canonique provisoire. Le build cumulatif exécute H1, C2, C3, C1, C4 puis H2 via `scripts/build_breaktest.py`.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- version fusionnée après H2 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`, 166 862 octets.

Corrections fusionnées :

- H1 : pull request `#2` ;
- C2 : pull requests `#3` et `#5` ;
- C3 : pull request `#6` ;
- C1 : pull request `#8` ;
- C4 : pull request `#10` ;
- H2 : pull request `#12`, commit `3504d448547bfeab9ef74114af3c08fb557a1c75`.

Le nouveau laboratoire doit rester isolé et ne modifier ni ce moteur ni le site Q0.

## 5. Fonctionnalités réellement validées

### Moteur historique

- import/export, filtres et audit ;
- validation numérique stricte ;
- modèle antérieur propre à chaque décision ;
- turnover chronologique ;
- réservation du nominal ;
- trésorerie réalisée aux sorties ;
- bases brut/net/observé/simulé séparées ;
- provenance conservée ;
- absence de double comptage dans les scénarios testés.

### Site Q0

- cinq scénarios synthétiques ;
- conventions de côtés et fréquence ;
- capital absent ou nul sans ratio inventé ;
- calculs internes non arrondis ;
- partage sans donnée personnelle par défaut ;
- Chromium à 390, 768, 1024 et 1440 px ;
- aucune capacité réseau ou persistance applicative active ;
- syntaxe JavaScript validée.

### Capital Efficiency

À ce stade, seuls la définition produit, le contrat mathématique et la mission sont versionnés. Aucun moteur ou écran Capital Efficiency n'est encore validé.

## 6. Développements suspendus

- publication externe du site Q0 ;
- H3 à H6 ;
- certification de stratégies ;
- score global de recommandation ;
- journal complet ;
- application native ;
- connexions courtiers ;
- données ou tarifs réels ;
- conseil, signaux et exécution ;
- marketplace, affiliation et API ;
- import réel, comptes, stockage, analytics, email et paiement ;
- métriques statistiques avancées sans données suffisantes.

## 7. Défauts techniques historiques ouverts

- H3 : provenance de devise du prix d'entrée ;
- H4 : réconciliation définitive PnL / rendement / nominal ;
- H5 : injection de formule CSV ;
- H6 : coût algorithmique élevé ;
- absence de valorisation mark-to-market ;
- absence de levier, appels de marge, intérêts, dividendes et flux externes ;
- compatibilité Safari/iPad non exhaustive.

Ces défauts restent documentés. Ils ne sont pas automatiquement prioritaires.

## 8. Marché — état de preuve

### Établi

- le rapport fondateur illustre qu'une prime brute peut être fortement absorbée par les frictions et le turnover ;
- le mécanisme du seuil de couverture est calculable ;
- des outils adjacents obtiennent des abonnements payants ;
- un calculateur Q0 techniquement fonctionnel existe.

### Non validé

- compréhension et valeur perçue des nouvelles sorties ;
- existence d'un avantage brut suffisamment formalisé chez la cible ;
- usage répété ;
- demande d'import ;
- volonté de payer ;
- distribution organique ;
- rentabilité et potentiel de plateforme.

## 9. Hébergement GitHub

- dépôt : `babou9280/investment-strategy-evaluation` ;
- branche de référence produit : `breaktest-bootstrap` ;
- branche active : `strategy/capital-efficiency-core` ;
- `main` reste inchangé et hors périmètre.

## 10. Prochaine exécution autorisée

1. implémenter le laboratoire isolé selon le contrat ;
2. ajouter les oracles et invariants quantitatifs ;
3. exécuter les suites historiques, Q0, Chromium, intégrité et syntaxe ;
4. corriger les défauts ;
5. mettre à jour les fichiers canoniques uniquement avec les résultats exécutés ;
6. ne rien publier ;
7. revenir vers Ayman uniquement lorsqu'un prototype interne réellement fonctionnel est prêt à être critiqué ou lorsqu'une décision stratégique devient nécessaire.
