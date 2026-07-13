# Breaktest — état actuel

## 1. Décision stratégique

Le 13 juillet 2026, Ayman a validé le pivot vers **Breaktest Cost Intelligence** : une application web installable qui mesure l'impact des commissions, du change, du spread, du slippage et de la rotation sur les petits et moyens portefeuilles.

La phase active est la **validation commerciale**, pas l'extension du moteur.

Documents de référence :

- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `go_to_market/`.

## 2. Produit à valider

Le premier produit autorisé est une page statique mobile-first avec :

- calculateur pré-transaction ;
- paramètres et hypothèses visibles ;
- coût par aller-retour, annuel, par ordre et par capital ;
- comparaison de scénarios ;
- rapport partageable ;
- formulaire de validation ;
- liens analytics, email et paiement désactivés par défaut.

Le suivi réel par import, l'abonnement, les données de courtiers et les benchmarks ne sont pas encore construits ni validés.

## 3. Build technique canonique conservé

`app/Breaktest_Studio.html` demeure l'actif technique canonique provisoire. Le build cumulatif exécute H1, C2, C3, C1, C4 puis H2 via `scripts/build_breaktest.py`.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- version fusionnée après H2 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`, 166 862 octets.

## 4. Fonctionnalités techniques validées

- application locale interactive ;
- import/export, filtres et audit ;
- validation numérique stricte ;
- modèle antérieur propre à chaque décision ;
- turnover chronologique ;
- réservation du nominal ;
- trésorerie réalisée aux sorties ;
- sélection entre résultat simulé, brut observé, net fixe observé et full-cost observé ;
- provenance conservée par ligne ;
- séparation des bases observées et des coûts simulés ;
- absence de double comptage dans les scénarios testés.

Corrections fusionnées :

- H1 : pull request `#2` ;
- C2 : pull requests `#3` et `#5` ;
- C3 : pull request `#6` ;
- C1 : pull request `#8` ;
- C4 : pull request `#10` ;
- H2 : pull request `#12`, commit `3504d448547bfeab9ef74114af3c08fb557a1c75`.

Preuve H2 : `docs/validation/H2_JOURNAL_NET_BASES.md`.

## 5. Développement suspendu

La pull request `#14` consacrée à H3 a été fermée sans fusion. Son travail reste non validé et pourra être réexaminé uniquement si la validation commerciale démontre sa nécessité.

Sont suspendus :

- H3 à H6 ;
- certification de stratégies ;
- score de recommandation ;
- journal complet ;
- application native ;
- connexions courtiers ;
- conseil, signaux et exécution ;
- marketplace et API.

## 6. Défauts techniques encore ouverts

- H3 : provenance de devise du prix d'entrée ;
- H4 : réconciliation définitive PnL / rendement / nominal ;
- H5 : injection de formule CSV ;
- H6 : coût algorithmique élevé ;
- absence de valorisation mark-to-market ;
- absence de levier, appels de marge, intérêts, dividendes et flux externes ;
- compatibilité Safari/iPad non exhaustive.

Ces défauts restent documentés. Ils ne sont plus automatiquement prioritaires.

## 7. Marché — état de preuve

### Établi

- le rapport fondateur démontre un cas où frictions et rotation contraignent fortement le net ;
- des outils adjacents de suivi et de journalisation obtiennent des abonnements payants ;
- la transparence des coûts demeure une préoccupation réglementaire et économique.

### Non validé

- fréquence du problème chez la cible ;
- usage répété ;
- volonté de payer 39 à 59 EUR par an ;
- demande d'import ;
- coût de maintien des barèmes ;
- distribution organique ;
- valeur d'une future base de données ;
- rentabilité et potentiel de plateforme.

## 8. Hébergement GitHub

- dépôt : `babou9280/investment-strategy-evaluation` ;
- branche de référence produit : `breaktest-bootstrap` ;
- branche stratégique active : `strategy/cost-intelligence-pivot` ;
- `main` reste inchangé et hors périmètre.

## 9. Prochaine exécution autorisée

1. fusionner la décision stratégique et les documents de validation dans `breaktest-bootstrap` ;
2. créer une branche isolée pour la page de validation ;
3. exécuter uniquement `NEXT_CODEX_PROMPT.md` ;
4. contrôler les calculs contre `go_to_market/DEMO_SCENARIOS.md` ;
5. ne déployer ni paiement ni collecte externe sans configuration explicite ;
6. ne reprendre aucune autre fonctionnalité avant les résultats du test.