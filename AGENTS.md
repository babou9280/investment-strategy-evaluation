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
- `docs/product/WORLD_CLASS_PLATFORM_THESIS.md` ;
- `docs/product/DIFFERENTIATION_AND_EVIDENCE_PLAN.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/tasks/CAPITAL_EFFICIENCY_LAB.md` ;
- `docs/validation/CAPITAL_EFFICIENCY_LAB.md` ;
- les fichiers de code, tests et documents concernés.

Traiter chaque demande comme un delta du produit existant. La stratégie Cost Intelligence et son raffinement Capital Efficiency priment sur les anciennes roadmaps.

## 2. Phase active

La phase actuelle est la **revue interne du prototype Capital Efficiency**, avant toute validation commerciale externe.

Le laboratoire `capital_efficiency_lab/` est implémenté et a réussi une validation technique. Cela n'autorise pas son extension automatique.

Le seul travail de fond autorisé sans nouvelle décision stratégique est :

- revue hostile de la valeur et de la compréhension ;
- correction d'un défaut de calcul, contrat, accessibilité ou clarté ;
- suppression d'un élément redondant ;
- scénario synthétique indispensable à une preuve ;
- test de non-régression ;
- protocole de critique interne ;
- vérification Safari/iPad lorsque l'environnement le permet.

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
- substantiellement subjective ;
- créant une publication ou un engagement externe.

Dans ce cas, recommander une option unique lorsque c'est possible.

## 4. Processus obligatoire

1. Lire les fichiers canoniques et stratégiques.
2. Reconstruire l'état réellement validé.
3. Identifier le problème utilisateur ou la preuve recherchée.
4. Vérifier qu'une modification est nécessaire.
5. Modifier le minimum cohérent.
6. Ajouter ou corriger les tests.
7. Exécuter les validations pertinentes.
8. Corriger les défauts détectés.
9. Rechercher les régressions.
10. Mettre à jour les documents uniquement avec des résultats démontrés.
11. Résumer résultat, preuves, limites et action unique éventuelle.

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
- Une sophistication qui ne change ni compréhension, ni diagnostic, ni preuve doit être supprimée ou différée.

## 6. Règles Capital Efficiency

### Contrat quantitatif

Implémenter exactement `docs/standards/EDGE_SURVIVAL_CONTRACT.md`.

- le coût fixe et le plancher variable restent séparés ;
- le seuil brut doit être réconcilié avec le coût total ;
- la marge nette doit se réconcilier en taux et en euros ;
- l'absorption et la rétention ne sont calculées que si l'avantage brut est strictement positif ;
- une rétention négative n'est jamais tronquée ;
- une contrainte impossible ne devient jamais `Infinity` visible ;
- un coût fixe nul et une contrainte satisfaite ne doivent pas créer un faux minimum positif ;
- la fréquence n'affecte pas le seuil par opération ;
- la projection annuelle reste arithmétique, sans capitalisation ni positions simultanées ;
- chaque dénominateur, unité et provenance doit être visible.

### Hiérarchie produit

- avantage brut absent : mettre en avant le seuil brut et le plancher variable ;
- avantage brut présent : mettre en avant la part conservée et la marge nette ;
- le coût en euros explique le résultat, mais ne constitue pas seul la valeur principale ;
- montrer ce qui est diluable et ce qui ne l'est pas ;
- afficher les contraintes inverses uniquement avec la condition utilisateur visible ;
- une démonstration de 90 secondes doit montrer pourquoi le produit dépasse un calculateur de frais.

### États autorisés

- `threshold_only` ;
- `edge_fully_absorbed` ;
- `edge_partially_retained` ;
- `retention_target_met` ;
- `structurally_unreachable` ;
- `not_computable` ;
- `unbounded_within_model` pour une frontière réellement non bornée dans le modèle.

Aucun score opaque ou seuil arbitraire caché.

### Frontière réglementaire

Ne jamais :

- recommander un instrument ou une transaction ;
- choisir un courtier ;
- qualifier une taille ou fréquence d'optimale ;
- adapter une conclusion à la tolérance au risque, au patrimoine ou aux objectifs ;
- transmettre ou exécuter un ordre ;
- présenter un seuil comme un rendement probable ;
- employer un avertissement comme substitut à une conception réellement non prescriptive.

Un seuil mathématique, une taille frontière conditionnelle ou une fréquence frontière n'est pas un conseil. La formulation doit le rappeler.

## 7. Règles de preuve et de différenciation

Chaque fonction doit expliciter :

1. le problème utilisateur ;
2. la définition financière ;
3. les entrées et unités ;
4. la formule ;
5. la provenance ;
6. les cas indisponibles ;
7. l'oracle ou l'invariant ;
8. l'utilité décisionnelle ;
9. la limite réglementaire ;
10. la preuve commerciale recherchée.

La valeur académique ou commerciale ne doit jamais reposer sur :

- le nombre de lignes de code ;
- un design impressionnant seul ;
- des métriques décoratives ;
- une affirmation de conformité non auditée ;
- un résumé produit par une IA ;
- une traction ou un utilisateur synthétique.

## 8. Qualité de la preuve commerciale

- Un clic, un email ou un compliment ne constitue pas une vente.
- Une intention déclarée ne constitue pas un paiement.
- Une réservation n'est pas un abonnement actif.
- Ne pas créer de faux compteurs, avis, économies ou rareté.
- Les données de démonstration doivent être marquées synthétiques.
- Mesurer séparément compréhension, seconde utilisation, demande d'import, paiement et remboursement.
- Le test doit pouvoir conclure à l'abandon.
- Ne pas élargir le produit pour améliorer artificiellement un indicateur faible.

## 9. Règles historiques conservées

Pour le moteur d'audit existant :

- séparer filtrage ex ante et analyse ex post ;
- ne jamais retirer des perdants rétrospectivement ;
- distinguer strictement résultat observé et scénario simulé ;
- ne jamais écraser une base observée ;
- conserver la provenance des bases ;
- refuser une valeur optionnelle explicitement invalide ;
- ne jamais compter les coûts deux fois ;
- signaler les incohérences PnL/rendement pour H4 ;
- interdire toute influence future sur une décision antérieure ;
- consommer le turnover chronologiquement ;
- réserver le nominal complet jusqu'à la sortie ;
- appliquer le PnL sélectionné uniquement à la sortie ;
- réconcilier `capital libre = capital réalisé - nominal réservé` ;
- employer « courbe de trésorerie réalisée aux sorties », jamais mark-to-market sans implémentation réelle.

Ces règles restent actives, mais elles ne justifient pas la reprise automatique de la roadmap historique.

## 10. Fichiers et branches

- `app/Breaktest_Studio.html` reste l'actif technique canonique historique provisoire.
- `validation_site/` reste le calculateur Q0 fusionné et gelé fonctionnellement.
- `capital_efficiency_lab/` contient le prototype interne actif.
- Les variantes de `source_material/` sont des archives.
- `main` reste strictement hors périmètre.
- Toute mission utilise une branche isolée et une pull request vers `breaktest-bootstrap`.
- Aucune fusion automatique.

## 11. Définition de terminé

Une tâche n'est terminée que lorsque :

- le comportement demandé fonctionne réellement ;
- les tests pertinents ont été exécutés et réussissent ;
- le build ou lancement pertinent a réussi ;
- les cas d'erreur essentiels ont été vérifiés ;
- les limites non vérifiées sont déclarées ;
- aucun élément hors périmètre n'a été ajouté ;
- les documents sont synchronisés avec les preuves ;
- le head exact est identifié.

Pour un prototype interne, « techniquement validé » ne signifie ni utile, ni commercialement validé, ni prêt à publier.

## 12. Rapport final

Présenter :

1. résultat obtenu ;
2. changements importants ;
3. validations réellement exécutées ;
4. limites restantes ;
5. une seule action utilisateur, uniquement si nécessaire.
