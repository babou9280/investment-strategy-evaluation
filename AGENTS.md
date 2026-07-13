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
- les fichiers de code, tests et documents concernés.

Traiter chaque demande comme un delta du produit existant. La stratégie Cost Intelligence validée prime sur les anciennes roadmaps de fonctionnalités.

## 2. Phase active

La phase actuelle est la **validation commerciale**.

Le seul développement autorisé sans nouvelle décision stratégique est :

- une page statique de validation ;
- un calculateur déterministe limité ;
- des scénarios synthétiques ;
- des tests ;
- un formulaire ou des liens configurables désactivés par défaut ;
- des corrections de bugs empêchant le test commercial.

Sont suspendus :

- H3 à H6 ;
- refonte de `app/Breaktest_Studio.html` ;
- import CSV pour le nouveau produit ;
- comptes et stockage utilisateur ;
- application native ;
- connexion courtier ;
- tarifs réels de courtiers ;
- analytics actifs ;
- paiement réel ;
- marketplace, affiliation ou API ;
- signaux, conseil, allocation et exécution.

Ne reprendre aucun de ces travaux sur la base d'une intuition technique. Exiger une preuve commerciale ou une décision stratégique explicite.

## 3. Autonomie

Prendre seul les décisions techniques réversibles et ordinaires. Ne pas demander à Ayman de choisir une bibliothèque, une structure de fichier, un type de test ou un détail d'implémentation lorsqu'une évaluation technique suffit.

Demander une validation seulement pour une décision :

- stratégique ;
- coûteuse ;
- irréversible ;
- juridiquement engageante ;
- substantiellement subjective.

Dans ce cas, recommander une option et au maximum deux alternatives.

## 4. Processus obligatoire

1. Lire les fichiers canoniques et stratégiques.
2. Reconstruire l'état réellement validé.
3. Identifier la preuve que la modification doit produire.
4. Modifier le minimum cohérent.
5. Ajouter ou corriger les tests.
6. Exécuter les validations pertinentes.
7. Corriger les défauts détectés.
8. Rechercher les régressions.
9. Mettre à jour les documents concernés uniquement avec des résultats démontrés.
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

## 6. Règles Cost Intelligence

### Provenance

Chaque composante doit être classée comme :

- `observed` ;
- `contractual` ;
- `estimated` ;
- `user_assumption`.

Ne jamais présenter :

- une estimation comme un coût payé ;
- un tarif sans date comme actuel ;
- une donnée synthétique comme observation réelle ;
- une hypothèse de démonstration comme tarif d'un courtier.

### Calculateur de validation

Les formules autorisées sont celles de `METHODOLOGY.md` et `NEXT_CODEX_PROMPT.md`.

Le calculateur doit :

- séparer commission, change, spread et slippage ;
- afficher coût par ordre, coût annuel et impact relatif au capital ;
- comparer des scénarios sans désigner un gagnant ;
- refuser les valeurs invalides ;
- fonctionner sans backend ;
- ne transmettre aucune donnée financière à un tiers ;
- afficher les limites et la mention non-prescriptive.

### Frontière réglementaire

Ne jamais :

- recommander un instrument ;
- recommander une transaction ;
- choisir un courtier pour l'utilisateur ;
- qualifier une taille ou une fréquence d'« optimale » ;
- adapter une conclusion au patrimoine, aux objectifs ou à la tolérance au risque ;
- transmettre ou exécuter un ordre ;
- dissimuler un conflit d'intérêts.

Un seuil mathématique de couverture des frais n'est pas un conseil. La formulation doit le rappeler.

## 7. Qualité de la preuve commerciale

- Un clic, un email ou un compliment ne constitue pas une vente.
- Une intention déclarée ne constitue pas un paiement.
- Une réservation n'est pas un abonnement actif.
- Ne pas créer de faux compteurs, avis, économies ou rareté.
- Les données de démonstration doivent être marquées synthétiques.
- Mesurer séparément trafic qualifié, simulation, retour, partage, demande d'import, paiement et remboursement.
- Le test doit pouvoir conclure à l'abandon.
- Ne pas élargir le produit pour améliorer artificiellement un indicateur faible.

## 8. Règles historiques conservées

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

## 9. Fichiers et branches

- `app/Breaktest_Studio.html` reste l'actif technique canonique provisoire.
- Le site de validation doit être isolé, par exemple sous `validation_site/`.
- Les variantes de `source_material/` sont des archives.
- `main` reste strictement hors périmètre.
- Toute mission utilise une branche isolée et une pull request vers `breaktest-bootstrap`.
- Aucune fusion automatique.

## 10. Définition de terminé

Une tâche n'est terminée que lorsque :

- le comportement demandé fonctionne réellement ;
- les tests pertinents ont été exécutés et réussissent ;
- le build ou lancement pertinent a réussi ;
- les cas d'erreur essentiels ont été vérifiés ;
- les limites non vérifiées sont déclarées ;
- aucun élément hors périmètre n'a été ajouté ;
- les documents sont synchronisés avec les preuves.

Pour une page de validation, « terminé » ne signifie pas que le marché est validé. Cela signifie uniquement que l'instrument de test est fonctionnel.

## 11. Rapport final

Présenter :

1. résultat obtenu ;
2. changements importants ;
3. validations réellement exécutées ;
4. limites restantes ;
5. une seule action utilisateur, uniquement si nécessaire.