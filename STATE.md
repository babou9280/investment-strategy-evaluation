# Breaktest — état actuel

## 1. Décision stratégique

Le 13 juillet 2026, Ayman a validé le pivot vers **Breaktest Cost Intelligence** : une application web installable qui mesure l'impact des commissions, du change, du spread, du slippage et de la rotation sur les petits et moyens portefeuilles.

La phase active est la **validation commerciale**, pas l'extension du moteur historique.

Documents de référence :

- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `go_to_market/` ;
- `docs/design/` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/launch/`.

## 2. Instrument de validation construit et fusionné

La pull request `#16` a été fusionnée dans `breaktest-bootstrap` au commit `aadef6dec71a6882f9746ea4b2721ee91a3ee1f3`.

Le dossier `validation_site/` contient une page statique mobile-first avec :

- calculateur pré-transaction déterministe et local ;
- paramètres, unités, conventions et hypothèses visibles ;
- achat simple ou aller-retour ;
- commission et change par côté ;
- spread et slippage pour le scénario complet ;
- coût par opération, coût relatif à l'ordre, coût annuel et ratio annuel sur capital ;
- décomposition des quatre composantes avec provenance ;
- comparaison descriptive de trois scénarios ;
- partage excluant le capital exact par défaut ;
- formulaire de validation et emplacements analytics, email et paiement désactivés.

La suite finale de la pull request a réussi sur le head `f58725cbf3a02967185b74f676b37209e71a5d44`, GitHub Actions run `29269231453`. Preuve : `docs/validation/COST_INTELLIGENCE_VALIDATION_SITE.md`.

Le site n'est pas déployé publiquement. Aucun utilisateur, paiement, usage répété ou signal commercial n'est encore validé.

Le suivi réel par import, l'abonnement, les données de courtiers et les benchmarks ne sont pas construits ni validés.

## 3. Préparation contrôlée du lancement

La pull request `#17`, branche `strategy/cost-intelligence-launch-readiness`, prépare sans engagement externe :

- la checklist de lancement statique ;
- le protocole exact de test utilisateur ;
- les limites minimales de confidentialité ;
- les instructions de prévisualisation locale ;
- le plan de rollback ;
- un test d'intégrité statique interdisant réseau, stockage persistant, secrets et intégrations actives.

L'exécution de référence `29269885911`, head `245489655917a9de38cf80e6546852d3223eebcd`, a réussi :

- build et suites historiques conservés ;
- calculateur et Chromium verts ;
- intégrité statique verte ;
- 7 références locales ;
- 43 171 octets actifs ;
- aucune capacité réseau ou persistance détectée ;
- syntaxe JavaScript et Python valide.

Preuve : `docs/validation/COST_INTELLIGENCE_LAUNCH_READINESS.md`.

Aucun domaine, hébergement public, analytics, collecte email ou paiement n'est activé par cette préparation.

## 4. Build technique canonique conservé

`app/Breaktest_Studio.html` demeure l'actif technique canonique provisoire. Le build cumulatif exécute H1, C2, C3, C1, C4 puis H2 via `scripts/build_breaktest.py`.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- version fusionnée après H2 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`, 166 862 octets.

La construction du site de validation n'a pas modifié ce moteur.

## 5. Fonctionnalités techniques validées

### Moteur historique

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

### Site de validation Cost Intelligence

- cinq scénarios synthétiques reproduits ;
- conventions de côtés et de fréquence testées ;
- capital absent ou nul traité sans ratio inventé ;
- validation stricte et absence de fallback silencieux ;
- calculs internes non arrondis ;
- partage sans donnée personnelle par défaut ;
- clavier, focus d'erreur, annonce accessible et responsive testés dans Chromium ;
- largeurs 390, 768, 1024 et 1440 px sans débordement horizontal ;
- intégrations externes désactivées ;
- syntaxe JavaScript validée ;
- assets locaux, sans réseau ni stockage persistant actifs.

## 6. Développement suspendu

La pull request `#14` consacrée à H3 a été fermée sans fusion. Son travail reste non validé et pourra être réexaminé uniquement si la validation commerciale démontre sa nécessité.

Sont suspendus :

- H3 à H6 ;
- certification de stratégies ;
- score de recommandation ;
- journal complet ;
- application native ;
- connexions courtiers ;
- conseil, signaux et exécution ;
- marketplace et API ;
- import réel, comptes, stockage et paiement avant preuve de demande.

## 7. Défauts techniques encore ouverts

- H3 : provenance de devise du prix d'entrée ;
- H4 : réconciliation définitive PnL / rendement / nominal ;
- H5 : injection de formule CSV ;
- H6 : coût algorithmique élevé ;
- absence de valorisation mark-to-market ;
- absence de levier, appels de marge, intérêts, dividendes et flux externes ;
- compatibilité Safari/iPad non exhaustive.

Ces défauts restent documentés. Ils ne sont plus automatiquement prioritaires.

## 8. Marché — état de preuve

### Établi

- le rapport fondateur démontre un cas où frictions et rotation contraignent fortement le net ;
- des outils adjacents de suivi et de journalisation obtiennent des abonnements payants ;
- la transparence des coûts demeure une préoccupation réglementaire et économique ;
- un instrument technique de test est disponible ;
- le protocole de première vague est préparé.

### Non validé

- fréquence du problème chez la cible ;
- compréhension réelle du calcul en moins de 90 secondes ;
- usage répété ;
- volonté de payer 39 à 59 EUR par an ;
- demande d'import ;
- coût de maintien des barèmes ;
- distribution organique ;
- valeur d'une future base de données ;
- rentabilité et potentiel de plateforme.

## 9. Hébergement GitHub

- dépôt : `babou9280/investment-strategy-evaluation` ;
- branche de référence produit : `breaktest-bootstrap` au commit `aadef6dec71a6882f9746ea4b2721ee91a3ee1f3` ;
- pull request de préparation active : `#17`, branche `strategy/cost-intelligence-launch-readiness` ;
- `main` reste inchangé et hors périmètre.

## 10. Prochaine exécution autorisée

1. obtenir une exécution CI verte sur le head final de la pull request `#17` ;
2. fusionner uniquement dans `breaktest-bootstrap` après revue ;
3. vérifier les options actuelles d'hébergement statique au moment où un déploiement devient nécessaire ;
4. présenter à Ayman une recommandation unique avant toute publication externe ou dépense ;
5. effectuer un test Safari/iPad avant diffusion plus large ;
6. commencer par une première vague de cinq utilisateurs ;
7. mettre à jour `MARKET_EVIDENCE.md` uniquement avec des comportements réellement observés ;
8. ne reprendre aucune extension fonctionnelle avant les résultats du test.
