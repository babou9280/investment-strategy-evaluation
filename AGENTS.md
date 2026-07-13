# Breaktest — instructions permanentes pour Codex

## 1. Autorité documentaire

Avant toute modification matérielle, lire intégralement :

- `PRODUCT.md` ;
- `QUALITY.md` ;
- `STATE.md` ;
- `DECISIONS.md` ;
- `METHODOLOGY.md` ;
- `AGENTS.md` ;
- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `NEXT_CODEX_PROMPT.md` ;
- `docs/product/CAPITAL_EFFICIENCY_CORE.md` ;
- `docs/product/EDGE_SURVIVAL_ENVELOPE.md` ;
- `docs/product/WORLD_CLASS_PLATFORM_THESIS.md` ;
- `docs/product/DIFFERENTIATION_AND_EVIDENCE_PLAN.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/governance/BLIND_SPOT_REGISTER.md` ;
- `docs/delivery/OFFLINE_HTML_DELIVERABLE_STANDARD.md` ;
- la mission, la validation, les revues, scénarios, code et tests concernés.

Traiter chaque demande comme un delta du produit existant. La stratégie Cost Intelligence, son raffinement Capital Efficiency et les décisions canoniques priment sur les anciennes roadmaps.

En cas de contradiction :

1. une décision explicitement validée plus récente prime ;
2. le comportement réellement exécuté prime sur un résumé ;
3. le contrat financier ou quantitatif prime sur l'apparence ;
4. l'incertitude doit être déclarée, jamais comblée par invention.

## 2. Phase active

La phase actuelle est la **stabilisation interne d'Edge Survival Envelope**, avant toute publication ou validation commerciale externe.

La pull request active reste isolée de `main`. Le travail autorisé sans nouvelle décision stratégique comprend :

- correction de calcul, contrat, état frontière ou réconciliation ;
- correction d'accessibilité, compréhension, responsive ou comportement navigateur ;
- recherche hostile d'angles morts visibles, adjacents et rétrospectifs ;
- suppression d'un élément redondant ou trompeur ;
- scénario synthétique indispensable à une preuve ;
- oracle, invariant ou test de non-régression ;
- synchronisation documentaire fondée sur des preuves exécutées ;
- préparation technique non livrée du futur package HTML hors ligne ;
- vérification Safari/iPad lorsque l'environnement le permet.

Sont suspendus :

- publication ou déploiement externe ;
- H3 à H6 ;
- refonte de `app/Breaktest_Studio.html` ;
- modification fonctionnelle de `validation_site/` ;
- import réel pour le nouveau produit ;
- comptes et stockage utilisateur ;
- application native ;
- connexion courtier ;
- tarifs réels de courtiers ;
- analytics, email et paiement ;
- marketplace, affiliation ou API ;
- signaux, conseil, allocation et exécution ;
- statistiques avancées sans données suffisantes ;
- package présenté à Ayman comme abouti avant les gates documentés.

## 3. Autonomie et escalade

Prendre seul les décisions techniques, méthodologiques et produit réversibles et ordinaires. Ne pas demander à Ayman de choisir une bibliothèque, une structure, un test, une formulation technique ou une décomposition lorsqu'une évaluation professionnelle suffit.

Demander une validation seulement pour une décision :

- qui change substantiellement la cible ou la proposition de valeur ;
- coûteuse ou créant un engagement externe ;
- irréversible ;
- juridiquement engageante ;
- dépendant réellement de sa préférence ;
- opposant plusieurs directions stratégiques comparables ;
- créant une publication, collecte de données ou transaction réelle.

Dans ce cas, recommander une option unique et demander seulement `valide` ou `refuse` lorsque possible.

## 4. Processus obligatoire

1. Lire les fichiers canoniques, stratégiques et le registre des angles morts.
2. Reconstruire l'état réellement validé et le head exact.
3. Identifier le problème utilisateur, financier ou de preuve.
4. Chercher aussi au moins un défaut adjacent ou rétrospectif.
5. Distinguer erreur, hypothèse, limite, risque et travail différé.
6. Vérifier qu'une modification est nécessaire.
7. Modifier le minimum cohérent, sans patch local contradictoire.
8. Ajouter ou corriger les tests et oracles pertinents.
9. Exécuter les validations sur le code exact.
10. Corriger les défauts détectés et rechercher les régressions.
11. Propager les conséquences dans calculs, interface, documents et livrables concernés.
12. Mettre à jour le registre et les fichiers canoniques uniquement avec des résultats démontrés.
13. Résumer résultat, preuves, limites et une seule action utilisateur éventuelle.

Une critique doit produire, selon le cas :

- une correction locale ;
- une règle permanente ;
- un test empêchant le retour du défaut ;
- une limite explicite ;
- un gate daté ou conditionnel de réexamen.

## 5. Recherche permanente des angles morts

Jusqu'à déclaration explicite de fin du projet, inspecter systématiquement les domaines définis dans `docs/governance/BLIND_SPOT_REGISTER.md` :

- finance et microstructure ;
- quantitatif et statistique ;
- données et provenance ;
- produit et utilité ;
- UX, accessibilité et compréhension ;
- réglementation, droit et éthique ;
- ingénierie, sécurité et confidentialité ;
- business model, marché et distribution ;
- validation et expérimentation ;
- opérations et exploitation ;
- réputation, candidature et preuve de travail ;
- gouvernance du projet.

Règles :

- ne pas attendre qu'Ayman identifie lui-même le défaut ;
- ne pas limiter la revue au sujet explicitement mentionné ;
- ne pas inventer une exhaustivité impossible ;
- une CI verte n'est jamais une preuve d'utilité, de conformité ou de demande ;
- tout nouvel angle mort important est ajouté au registre avec priorité, statut, preuve et gate ;
- une limite acceptée reste visible et doit avoir une condition de réexamen.

## 6. Règles générales critiques

- Ne jamais inventer donnée, résultat, utilisateur, paiement, partenaire, source ou test réussi.
- Ne jamais masquer silencieusement une erreur avec une valeur par défaut.
- Signaler tout fallback de données ou de calcul.
- Ne jamais présenter une interaction factice comme fonctionnelle.
- Toute formule importante doit être documentée, versionnée et testée.
- Toute correction de bug doit ajouter un test de non-régression lorsqu'il est pertinent.
- Une valeur numérique réelle égale à zéro reste distincte d'une absence.
- Ne jamais utiliser l'arrondi d'affichage dans les calculs internes.
- Préserver la cohérence entre code, méthodologie, interface et discours commercial.
- Une sophistication qui ne change ni compréhension, ni diagnostic, ni preuve doit être supprimée ou différée.
- Ne jamais appeler `final`, `production_ready`, `validated` ou équivalent ce qui ne satisfait pas la définition correspondante.

## 7. Contrats Capital Efficiency et Edge Range

Implémenter exactement :

- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md`.

Exigences permanentes :

- séparer coût fixe diluable et plancher variable ;
- réconcilier seuil brut et coût total ;
- réconcilier marge nette en taux et euros ;
- calculer absorption et rétention uniquement si le brut est strictement positif ;
- ne jamais tronquer une marge ou rétention négative ;
- ne jamais afficher `Infinity`, `NaN` ou `-0` ;
- traiter exactement les coûts fixes nuls ;
- garder le seuil par opération indépendant de la fréquence ;
- qualifier toute projection annuelle d'arithmétique, sans capitalisation ni positions simultanées ;
- afficher dénominateur, unité, provenance et domaine de validité ;
- conserver trois modes non ambigus : seuil seul, point seul, fourchette complète seule ;
- rejeter tout mélange point/fourchette, toute fourchette partielle et tout ordre incohérent ;
- ne jamais compléter, réordonner ou convertir silencieusement une fourchette ;
- considérer l'égalité au seuil ou au plancher selon la tolérance contractuelle, jamais comme marge strictement positive ;
- conserver la rétrocompatibilité profonde des modes historiques.

## 8. Hiérarchie produit et UX

- Sans avantage brut : mettre en avant le seuil de couverture et le plancher variable.
- Avec point brut : mettre en avant part conservée et marge nette.
- Avec fourchette : mettre en avant la stabilité de la conclusion, puis les marges basse, centrale et haute.
- Le coût en euros explique le résultat ; il ne constitue pas seul la valeur centrale.
- Montrer ce qui est diluable et ce qui ne l'est pas.
- Afficher une seule contrainte inverse à la fois avec la condition utilisateur visible.
- Employer le français concret avant le jargon financier.
- Ne pas surcharger le premier écran.
- Masquer les résultats obsolètes après erreur ou conflit de mode.
- Conserver focus, clavier, `aria-live`, contraste, mouvement réduit et absence de débordement.
- Tester 390, 768, 1024 et 1440 pixels, puis Safari/iPad avant livraison à Ayman.
- Une démonstration de 90 secondes doit montrer pourquoi Breaktest dépasse un totalisateur de frais.

## 9. Frontière réglementaire

Ne jamais :

- recommander un instrument ou une transaction ;
- choisir un courtier ;
- qualifier une taille ou fréquence d'optimale ;
- adapter une conclusion à la tolérance au risque, au patrimoine ou aux objectifs ;
- transmettre ou exécuter un ordre ;
- présenter un seuil ou une fourchette comme rendement probable ;
- utiliser les termes probabilité, confiance, prévision ou verdict sans méthode statistique et autorisation correspondantes ;
- revendiquer une conformité, certification ou audit externe non obtenu ;
- employer un avertissement comme substitut à une conception réellement non prescriptive.

Un seuil, une taille frontière conditionnelle ou une fréquence frontière est une relation mathématique sous hypothèses, pas un conseil.

## 10. Preuve et différenciation

Chaque fonction doit expliciter :

1. problème utilisateur ;
2. définition financière ;
3. entrées et unités ;
4. formule ;
5. provenance ;
6. cas indisponibles ;
7. oracle ou invariant ;
8. utilité décisionnelle ;
9. limite réglementaire ;
10. preuve commerciale recherchée ;
11. angle mort principal ;
12. condition d'abandon ou de révision.

La valeur académique ou commerciale ne repose jamais sur :

- le nombre de lignes de code ;
- un design impressionnant seul ;
- des métriques décoratives ;
- une conformité non auditée ;
- un résumé produit par une IA ;
- une traction, donnée ou personne synthétique présentée comme réelle.

## 11. Validation commerciale

- Un clic, un email ou un compliment n'est pas une vente.
- Une intention déclarée n'est pas un paiement.
- Une réservation n'est pas un abonnement actif.
- Une première utilisation n'est pas une rétention.
- Ne créer aucun faux compteur, avis, économie, partenaire ou rareté.
- Marquer les démonstrations `synthetic_demo`.
- Mesurer séparément compréhension, seconde utilisation, demande d'import, paiement et remboursement.
- Conserver objections, abandons et trafic non qualifié.
- Le test doit pouvoir conclure à l'abandon.
- Ne pas élargir le produit pour améliorer artificiellement un indicateur faible.

## 12. Règles historiques conservées

Pour le moteur d'audit existant :

- séparer filtrage ex ante et analyse ex post ;
- ne jamais retirer rétrospectivement les perdants ;
- distinguer résultat observé et scénario simulé ;
- ne jamais écraser une base observée ;
- conserver la provenance ;
- refuser une valeur optionnelle explicitement invalide ;
- ne jamais compter les coûts deux fois ;
- signaler les incohérences PnL/rendement ;
- interdire toute influence future sur une décision antérieure ;
- consommer le turnover chronologiquement ;
- réserver le nominal complet jusqu'à la sortie ;
- appliquer le PnL sélectionné uniquement à la sortie ;
- réconcilier `capital libre = capital réalisé - nominal réservé` ;
- employer « courbe de trésorerie réalisée aux sorties », jamais mark-to-market sans implémentation réelle.

Ces règles restent actives mais ne justifient pas la reprise automatique de la roadmap historique.

## 13. Livraison HTML hors ligne

Les futures versions remises à Ayman pour critique doivent respecter `docs/delivery/OFFLINE_HTML_DELIVERABLE_STANDARD.md`.

Priorité :

1. HTML autonome réellement interactif ;
2. sinon bundle ZIP local avec `index.html`, chemins relatifs et aucune dépendance distante.

Le package doit inclure :

- interaction et calculs réels issus du moteur validé ;
- navigation hors ligne sans serveur obligatoire lorsque techniquement évitable ;
- vue produit ;
- vue méthode, preuves et limites ;
- provenance et version du calcul ;
- manifeste, liste des fichiers et SHA-256 ;
- navigateurs et appareils réellement testés ;
- limites connues.

Les captures sont des preuves de test, jamais un substitut au livrable. Ne pas produire le package final prématurément.

## 14. Fichiers et branches

- `app/Breaktest_Studio.html` reste l'actif historique provisoire.
- `validation_site/` reste le calculateur Q0 fusionné et gelé fonctionnellement.
- `capital_efficiency_lab/` contient le prototype interne actif.
- `source_material/` contient des archives.
- `main` reste strictement hors périmètre.
- Toute mission utilise une branche isolée et une pull request vers `breaktest-bootstrap`.
- Aucune fusion automatique sans preuve et revue.

## 15. Définition de terminé

Une tâche n'est terminée que lorsque :

- le comportement demandé fonctionne réellement ;
- les tests pertinents ont été exécutés et réussissent ;
- le build ou lancement pertinent a réussi ;
- les cas d'erreur et frontières essentiels ont été vérifiés ;
- les angles morts adjacents ont été recherchés ;
- les limites non vérifiées sont déclarées ;
- aucun élément hors périmètre n'a été ajouté ;
- les documents et le registre sont synchronisés ;
- le head exact est identifié ;
- le package exact est testé lorsqu'un livrable est remis.

« Techniquement validé » ne signifie ni utile, ni juridiquement conforme, ni commercialement validé, ni prêt à publier.

## 16. Rapport final

Présenter :

1. résultat obtenu ;
2. changements importants ;
3. validations réellement exécutées ;
4. défauts trouvés, y compris rétrospectifs ;
5. limites et angles morts restants ;
6. une seule action utilisateur, uniquement si nécessaire.