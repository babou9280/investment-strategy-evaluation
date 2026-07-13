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
- `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md` ;
- `docs/product/COST_GATE_DIRECTION.md` ;
- `docs/product/WORLD_CLASS_PLATFORM_THESIS.md` ;
- `docs/product/DIFFERENTIATION_AND_EVIDENCE_PLAN.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/governance/BLIND_SPOT_REGISTER.md` ;
- `docs/delivery/OFFLINE_HTML_DELIVERABLE_STANDARD.md` ;
- la mission, validation, revues, scénarios, code et tests concernés.

Traiter chaque demande comme un delta du produit existant.

Ordre stratégique actuel :

1. Cost Intelligence reste la direction produit active ;
2. Capital Efficiency et Edge Survival restent son noyau analytique ;
3. Cost Gate est une trajectoire pré-trade validée mais non implémentée ;
4. aucune trajectoire future n'annule ou ne dégrade le travail déjà validé.

En cas de contradiction :

1. décision explicitement validée la plus récente ;
2. comportement réellement exécuté ;
3. contrat financier ou quantitatif ;
4. documentation secondaire ;
5. apparence.

L'incertitude est déclarée, jamais comblée par invention.

## 2. Phase active

La phase actuelle est la stabilisation interne de la pull request `#23` — Edge Survival Envelope.

Travail autorisé sans nouvelle décision stratégique :

- correction de calcul, contrat, tolérance, état, réconciliation ou provenance ;
- correction d'UX, accessibilité, responsive, navigateur et fraîcheur du résultat ;
- recherche hostile d'angles morts visibles, adjacents et rétrospectifs ;
- suppression d'un élément redondant ou trompeur ;
- scénario synthétique indispensable ;
- oracle, invariant ou test de non-régression ;
- synchronisation canonique fondée sur des preuves ;
- conception documentaire de Cost Gate ;
- préparation technique non livrée du futur package HTML hors ligne ;
- vérification Safari/iPad lorsque possible.

Travail suspendu :

- publication ou déploiement ;
- H3 à H6 ;
- refonte de `app/Breaktest_Studio.html` ;
- modification fonctionnelle de `validation_site/` ;
- import réel ;
- compte ou stockage utilisateur ;
- application native ;
- connexion courtier ;
- barèmes ou données de marché réels ;
- réseau applicatif ;
- analytics actif, email ou paiement ;
- marketplace, affiliation ou API ;
- signaux, allocation, recommandation, conseil ou exécution ;
- probabilité d'exécution ou ordre limite conseillé ;
- statistiques avancées sans données suffisantes ;
- package présenté comme abouti avant les gates documentés.

## 3. Autonomie et escalade

Prendre seul les décisions techniques, produit et méthodologiques réversibles et ordinaires.

Ne demander Ayman que pour une décision :

- changeant substantiellement cible ou proposition de valeur ;
- coûteuse ou créant un engagement externe ;
- irréversible ;
- juridiquement engageante ;
- dépendant réellement de sa préférence ;
- opposant plusieurs directions stratégiques comparables ;
- activant publication, collecte, paiement, donnée externe ou transaction réelle.

Recommander une option unique et demander `valide` ou `refuse` lorsque possible.

## 4. Processus obligatoire

1. Lire les sources canoniques et le registre des angles morts.
2. Reconstruire l'état réellement validé, la branche et le head exact.
3. Identifier le problème utilisateur, financier ou de preuve.
4. Rechercher au moins un défaut adjacent ou rétrospectif.
5. Distinguer erreur, hypothèse, limite, risque et travail différé.
6. Vérifier que la modification est nécessaire.
7. Modifier le minimum cohérent.
8. Ajouter ou corriger tests et oracles.
9. Exécuter les validations sur le code exact.
10. Corriger les défauts détectés et rechercher les régressions.
11. Propager les conséquences dans calculs, interface, documents et livrables.
12. Mettre à jour registre et canonicals seulement avec preuves.
13. Résumer résultat, preuves, limites et une seule action éventuelle.

Toute critique produit selon le cas :

- correction locale ;
- règle permanente ;
- test de non-régression ;
- limite explicite ;
- gate de réexamen.

## 5. Recherche permanente des angles morts

Jusqu'à déclaration explicite de fin du projet, inspecter :

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
- gouvernance.

Ne pas attendre qu'Ayman identifie le défaut. Ne pas limiter la revue au sujet mentionné. Une CI verte n'est jamais une preuve d'exhaustivité, utilité, conformité ou demande.

Tout angle mort important reçoit priorité, statut, preuve attendue, composant et gate dans `docs/governance/BLIND_SPOT_REGISTER.md`.

## 6. Règles générales critiques

- Ne jamais inventer donnée, source, résultat, test, utilisateur, paiement ou partenaire.
- Ne jamais transformer silencieusement une erreur en zéro ou valeur par défaut.
- Signaler tout fallback et conserver sa provenance.
- Ne jamais présenter une interaction factice comme fonctionnelle.
- Documenter, versionner et tester toute formule importante.
- Ajouter un test de non-régression à toute correction pertinente.
- Distinguer zéro, absence et invalidité.
- Aucun arrondi dans les calculs internes.
- Préserver cohérence code, méthode, interface et discours.
- Supprimer ou différer toute sophistication sans utilité, diagnostic ou preuve.
- Ne pas employer `final`, `production_ready`, `validated` ou équivalent sans définition satisfaite.

## 7. Contrats Capital Efficiency et Edge Range

Implémenter exactement :

- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md`.

Exigences :

- séparer coût fixe et plancher variable ;
- réconcilier seuil et coût total ;
- réconcilier marge nette en taux et euros ;
- absorption et rétention seulement si brut strictement positif ;
- aucune troncature des marges négatives ;
- aucun `Infinity`, `NaN` ou `-0` visible ;
- cas coût fixe nul explicite ;
- seuil par opération indépendant de la fréquence ;
- projections annuelles qualifiées d'arithmétiques ;
- unité, dénominateur, provenance et domaine de validité visibles ;
- trois modes non ambigus : seuil seul, point seul, fourchette complète seule ;
- mélange point/fourchette, fourchette partielle et ordre incohérent rejetés ;
- aucune complétion, permutation ou conversion silencieuse ;
- égalité au seuil ou plancher traitée par la tolérance commune ;
- rétrocompatibilité profonde.

## 8. Hiérarchie produit et UX

- Sans brut : seuil et plancher.
- Avec point : part conservée et marge nette.
- Avec fourchette : stabilité de la conclusion puis marges basse, centrale et haute.
- Le coût en euros explique ; il ne suffit pas comme valeur centrale.
- Montrer ce qui est diluable et ce qui ne l'est pas.
- Une seule contrainte inverse à la fois.
- Français concret avant jargon.
- Premier écran léger.
- Résultats obsolètes masqués immédiatement.
- Erreurs avec focus utile.
- Clavier, `aria-live`, contraste, mouvement réduit et absence de débordement.
- Chromium 390, 768, 1024 et 1440 ; Safari/iPad avant livraison.
- Démonstration de 90 secondes montrant plus qu'un totalisateur de frais.

## 9. Direction Cost Gate

Cost Gate est une direction stratégique, pas une fonctionnalité autorisée.

Référence : `docs/product/COST_GATE_DIRECTION.md`.

Il doit à terme confronter un trade envisagé :

- aux frictions ;
- au capital de référence et cash libre ;
- au nominal déjà réservé ;
- à la taille proposée ;
- à la liquidité et aux conditions de marché ;
- aux paramètres utilisateur ;
- à un point ou une fourchette brute explicitement fournis.

Il réutilise Cost Intelligence, Capital Efficiency, Edge Survival, Edge Range et la future Capital Feasibility.

États analytiques de travail :

```text
compatible_under_assumptions
adjustment_required
structurally_non_viable
capital_not_feasible
execution_cost_risk
insufficient_data
```

Aucun de ces états n'est un ordre, une recommandation ou une prévision.

### Data Quality Gate

Aucune conclusion utilisant une donnée externe sans contrôle de :

- source et licence ;
- timestamp, fuseau et fraîcheur ;
- instrument, place et devise ;
- couverture ;
- provenance ;
- valeurs manquantes ou contradictoires ;
- incertitude ;
- fallback et kill switch.

États envisagés :

```text
data_ready
data_stale
data_partial
data_conflicted
data_unavailable
```

Seul `data_ready` autorise une conclusion dépendante de la donnée concernée.

### Gates Cost Gate

1. stabiliser Edge Survival ;
2. valider l'utilité utilisateur ;
3. tester un prototype synthétique manuel ;
4. valider Capital Feasibility ;
5. définir et tester Data Quality Gate ;
6. décider explicitement d'une source externe limitée ;
7. revue juridique et économique ;
8. intégration ou exécution éventuelle sous décision distincte.

Ne jamais ajouter du code Cost Gate dans la PR #23 sauf nécessité directe déjà couverte par son périmètre.

## 10. Frontière réglementaire

Ne jamais :

- recommander instrument ou transaction ;
- choisir un courtier ;
- qualifier taille ou fréquence d'optimale ;
- personnaliser selon tolérance au risque, patrimoine ou objectifs ;
- transmettre ou exécuter un ordre ;
- présenter seuil, fourchette ou état comme rendement probable ;
- afficher « exécuter », « rejeter », « acheter », « vendre », « ordre limite conseillé » ou équivalent ;
- revendiquer conformité, certification ou audit externe non obtenu ;
- utiliser un disclaimer pour compenser une conception prescriptive.

Une frontière ou un état est une relation sous hypothèses, pas un conseil.

## 11. Preuve et différenciation

Chaque fonction explicite :

1. problème utilisateur ;
2. définition financière ;
3. entrées et unités ;
4. formule ;
5. provenance ;
6. cas indisponibles ;
7. oracle ou invariant ;
8. utilité décisionnelle ;
9. limite réglementaire ;
10. preuve commerciale ;
11. angle mort principal ;
12. condition d'abandon ou révision.

La valeur ne repose jamais sur :

- nombre de lignes ;
- design seul ;
- métriques décoratives ;
- conformité non auditée ;
- résumé IA ;
- personne, donnée ou traction synthétique présentée comme réelle.

## 12. Validation commerciale

- Clic, email ou compliment ≠ vente.
- Intention ≠ paiement.
- Réservation ≠ abonnement.
- Première utilisation ≠ rétention.
- Aucun faux compteur, avis, économie, partenaire ou rareté.
- Démonstrations marquées `synthetic_demo`.
- Mesurer compréhension, seconde utilisation, import, paiement et remboursement séparément.
- Conserver objections, abandons et trafic non qualifié.
- Le test doit pouvoir conclure à l'abandon.
- Ne pas élargir le produit pour embellir un indicateur faible.

Cost Gate exige en plus : usage volontaire avant une décision, qualité des données, absence de faux feu vert, coût soutenable des flux et revue juridique.

## 13. Règles historiques conservées

Pour le moteur historique :

- filtrage ex ante séparé de l'ex post ;
- aucun retrait rétrospectif des perdants ;
- observé séparé du simulé ;
- aucune base observée écrasée ;
- provenance conservée ;
- valeur invalide refusée ;
- aucun double comptage ;
- incohérences PnL/rendement signalées ;
- aucune influence future ;
- turnover chronologique ;
- nominal complet réservé jusqu'à sortie ;
- PnL appliqué à la sortie ;
- `capital libre = capital réalisé - nominal réservé` réconcilié ;
- « trésorerie réalisée aux sorties », jamais mark-to-market sans implémentation.

Ces règles ne justifient pas la reprise automatique de la roadmap historique.

## 14. Livraison HTML hors ligne

Les versions remises à Ayman respectent `docs/delivery/OFFLINE_HTML_DELIVERABLE_STANDARD.md`.

Priorité :

1. HTML autonome interactif ;
2. sinon ZIP local avec `index.html`, chemins relatifs et aucune dépendance distante.

Le package inclut :

- calculs réels du moteur validé ;
- fonctionnement hors ligne ;
- vue produit ;
- méthode, preuves et limites ;
- provenance et version ;
- manifeste et SHA-256 ;
- appareils réellement testés ;
- limites connues.

Les captures sont des preuves, jamais le livrable. Ne pas produire le package prématurément.

## 15. Fichiers et branches

- `app/Breaktest_Studio.html` : actif historique provisoire.
- `validation_site/` : Q0 fusionné et gelé.
- `capital_efficiency_lab/` : prototype actif.
- `source_material/` : archives.
- `main` : strictement hors périmètre.
- Branche isolée et PR vers `breaktest-bootstrap` pour chaque mission.
- Aucune fusion automatique sans preuve et revue.

## 16. Définition de terminé

Une tâche n'est terminée que si :

- comportement réel ;
- tests pertinents exécutés et verts ;
- build ou lancement réussi ;
- erreurs et frontières vérifiées ;
- angles morts adjacents recherchés ;
- limites déclarées ;
- aucun hors-périmètre ;
- documents et registre synchronisés ;
- head exact identifié ;
- package exact testé lorsqu'il est remis.

« Techniquement validé » ne signifie ni utile, ni juridiquement conforme, ni commercialement validé, ni prêt à publier.

## 17. Rapport final

Présenter :

1. résultat ;
2. changements ;
3. validations exécutées ;
4. défauts trouvés, y compris rétrospectifs ;
5. limites et angles morts ;
6. une seule action utilisateur si nécessaire.