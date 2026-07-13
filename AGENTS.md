# Breaktest — instructions permanentes pour Codex

## 1. Avant de travailler

Lire intégralement :

- `PRODUCT.md` ;
- `QUALITY.md` ;
- `STATE.md` ;
- `DECISIONS.md` ;
- `METHODOLOGY.md` ;
- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `NEXT_CODEX_PROMPT.md` ;
- `docs/product/CAPITAL_EFFICIENCY_CORE.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/tasks/CAPITAL_EFFICIENCY_LAB.md` ;
- les fichiers de code, tests et documents concernés.

Traiter chaque demande comme un delta du produit existant. La stratégie Cost Intelligence et son raffinement Capital Efficiency priment sur les anciennes roadmaps.

## 2. Phase active

La phase actuelle est la **conception et le prototype interne Capital Efficiency**, avant validation commerciale externe.

Le seul développement de fond autorisé est le laboratoire isolé défini dans `docs/tasks/CAPITAL_EFFICIENCY_LAB.md`.

Il peut comprendre :

- moteur Edge Survival déterministe ;
- seuil brut, plancher variable et marge nette ;
- contraintes inverses transparentes ;
- sensibilité non prescriptive ;
- scénarios synthétiques ;
- tests Node et Chromium ;
- corrections de bugs empêchant cette validation interne.

Sont suspendus :

- publication externe ;
- H3 à H6 ;
- refonte de `app/Breaktest_Studio.html` ;
- modification fonctionnelle de `validation_site/` ;
- import CSV pour le nouveau produit ;
- comptes et stockage utilisateur ;
- application native ;
- connexion courtier ;
- tarifs réels de courtiers ;
- analytics, email et paiement ;
- marketplace, affiliation ou API ;
- signaux, conseil, allocation et exécution ;
- statistiques avancées sans données suffisantes.

## 3. Autonomie

Prendre seul les décisions techniques réversibles et ordinaires. Ne pas demander à Ayman de choisir une bibliothèque, une structure de fichier, un type de test ou un détail d'implémentation lorsqu'une évaluation technique suffit.

Demander une validation seulement pour une décision :

- stratégique ;
- coûteuse ;
- irréversible ;
- juridiquement engageante ;
- substantiellement subjective.

## 4. Processus obligatoire

1. Lire les fichiers canoniques et stratégiques.
2. Reconstruire l'état réellement validé.
3. Identifier la preuve que la modification doit produire.
4. Modifier le minimum cohérent.
5. Ajouter ou corriger les tests.
6. Exécuter les validations pertinentes.
7. Corriger les défauts détectés.
8. Rechercher les régressions.
9. Mettre à jour les documents uniquement avec des résultats démontrés.
10. Résumer résultat, preuves et limites.

## 5. Règles générales critiques

- Ne jamais inventer donnée, résultat, utilisateur, paiement, partenaire ou test réussi.
- Ne jamais masquer silencieusement une erreur avec une valeur par défaut.
- Signaler tout fallback de données ou de calcul.
- Ne jamais présenter une interaction factice comme fonctionnelle.
- Toute formule importante doit être documentée et testée.
- Toute correction de bug doit ajouter un test de non-régression lorsqu'il est pertinent.
- Une valeur numérique réelle égale à zéro reste distincte d'une absence.
- Ne jamais utiliser l'arrondi d'affichage dans les calculs internes.
- Préserver la cohérence entre code, méthodologie et discours commercial.

## 6. Règles Capital Efficiency

### Contrat quantitatif

Implémenter exactement `docs/standards/EDGE_SURVIVAL_CONTRACT.md`.

- le coût fixe et le plancher variable restent séparés ;
- le seuil brut doit être réconcilié avec le coût total ;
- la marge nette doit se réconcilier en taux et en euros ;
- l'absorption et la rétention ne sont calculées que si l'avantage brut est strictement positif ;
- une rétention négative n'est jamais tronquée ;
- une contrainte impossible ne devient jamais `Infinity` visible ;
- la fréquence n'affecte pas le seuil par opération ;
- la projection annuelle reste arithmétique, sans capitalisation ni positions simultanées ;
- chaque dénominateur, unité et provenance doit être visible.

### Hiérarchie produit

- avantage brut absent : mettre en avant le seuil brut et le plancher variable ;
- avantage brut présent : mettre en avant la part conservée et la marge nette ;
- le coût en euros explique le résultat, mais ne constitue pas seul la valeur principale ;
- montrer ce qui est diluable et ce qui ne l'est pas ;
- afficher les contraintes inverses uniquement avec la condition utilisateur visible.

### États autorisés

- `threshold_only` ;
- `edge_fully_absorbed` ;
- `edge_partially_retained` ;
- `retention_target_met` ;
- `structurally_unreachable` ;
- `not_computable`.

Aucun score opaque ou seuil arbitraire caché.

### Frontière réglementaire

Ne jamais :

- recommander un instrument ou une transaction ;
- choisir un courtier ;
- qualifier une taille ou fréquence d'optimale ;
- adapter une conclusion à la tolérance au risque, au patrimoine ou aux objectifs ;
- transmettre ou exécuter un ordre ;
- présenter un seuil comme un rendement probable.

Un seuil mathématique, une taille minimale conditionnelle ou une fréquence frontière n'est pas un conseil. La formulation doit le rappeler.

## 7. Provenance

Chaque composante doit être classée comme :

- `observed` ;
- `contractual` ;
- `estimated` ;
- `user_assumption` ;
- `derived` ;
- `synthetic_demo` ou `simulated` selon le contexte.

Ne jamais présenter :

- une estimation comme un coût payé ;
- un tarif sans date comme actuel ;
- une donnée synthétique comme observation réelle ;
- une hypothèse de démonstration comme tarif d'un courtier ;
- un avantage brut saisi comme rendement prédit par Breaktest.

## 8. Qualité de la preuve commerciale

- Un clic, un email ou un compliment ne constitue pas une vente.
- Une intention déclarée ne constitue pas un paiement.
- Une réservation n'est pas un abonnement actif.
- Ne pas créer de faux compteurs, avis, économies ou rareté.
- Les données de démonstration doivent être marquées synthétiques.
- Le test doit pouvoir conclure à l'abandon.
- Ne pas publier le laboratoire tant que la valeur produit et les formules ne sont pas revues.

## 9. Règles historiques conservées

Pour le moteur d'audit existant :

- séparer filtrage ex ante et analyse ex post ;
- ne jamais retirer des perdants rétrospectivement ;
- distinguer résultat observé et scénario simulé ;
- ne jamais écraser une base observée ;
- conserver la provenance ;
- refuser une valeur explicitement invalide ;
- ne jamais compter les coûts deux fois ;
- interdire toute influence future sur une décision antérieure ;
- consommer le turnover chronologiquement ;
- réserver le nominal complet jusqu'à la sortie ;
- appliquer le PnL sélectionné uniquement à la sortie ;
- réconcilier `capital libre = capital réalisé - nominal réservé` ;
- employer « courbe de trésorerie réalisée aux sorties », jamais mark-to-market sans implémentation réelle.

## 10. Fichiers et branches

- `app/Breaktest_Studio.html` reste l'actif technique canonique provisoire.
- `validation_site/` reste le calculateur Q0 fusionné et ne doit pas être modifié fonctionnellement.
- le laboratoire doit être créé sous `capital_efficiency_lab/`.
- les variantes de `source_material/` sont des archives.
- `main` reste strictement hors périmètre.
- toute mission utilise une branche isolée et une pull request vers `breaktest-bootstrap`.
- aucune fusion automatique par Codex.

## 11. Définition de terminé

Une tâche n'est terminée que lorsque :

- le comportement demandé fonctionne réellement ;
- les tests pertinents ont été exécutés et réussissent ;
- le build ou lancement pertinent a réussi ;
- les cas d'erreur essentiels ont été vérifiés ;
- les limites non vérifiées sont déclarées ;
- aucun élément hors périmètre n'a été ajouté ;
- les documents sont synchronisés avec les preuves.

Pour le laboratoire, « terminé » ne signifie ni marché validé ni produit prêt à publier. Cela signifie uniquement que le moteur et l'expérience interne sont fonctionnels et testés.

## 12. Rapport final

Présenter :

1. résultat obtenu ;
2. changements importants ;
3. validations réellement exécutées ;
4. limites restantes ;
5. une seule action utilisateur, uniquement si nécessaire.
