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
- `docs/product/COST_GATE_MVP_GATE_MATRIX.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_ALIGNMENT_KEY.md` ;
- `docs/standards/COST_GATE_METHOD_CONTRACT.md` ;
- `docs/standards/COST_GATE_PERSONALIZATION_BOUNDARY.md` ;
- `docs/standards/COST_GATE_SNAPSHOT_CONTRACT.md` ;
- `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- `docs/standards/COST_GATE_FINDINGS_CONTRACT.md` ;
- `docs/governance/BLIND_SPOT_REGISTER.md` ;
- `docs/validation/COST_GATE_FOUNDATION.md` lorsqu'il existe ;
- `docs/validation/COST_GATE_OFFLINE_CRITIQUE.md` lorsqu'il existe ;
- `docs/delivery/OFFLINE_HTML_DELIVERABLE_STANDARD.md` ;
- la mission, les scénarios, validations, revues, code et tests concernés.

Traiter chaque demande comme un delta du produit existant.

Ordre stratégique :

1. Cost Intelligence reste la direction produit ;
2. Capital Efficiency et Edge Survival en sont le noyau analytique validé techniquement ;
3. Cost Gate est la trajectoire pré-trade validée stratégiquement ;
4. Cost Gate orchestre les actifs précédents, il ne les remplace pas ;
5. aucune fonction future n'annule une preuve déjà acquise sans décision explicite.

En cas de contradiction :

1. décision validée la plus récente ;
2. comportement réellement exécuté ;
3. contrat financier ou quantitatif ;
4. documentation secondaire ;
5. apparence.

L'incertitude est déclarée, jamais comblée par invention.

## 2. Phase active

Les pull requests `#23`, `#24` et `#25` sont fusionnées dans `breaktest-bootstrap`.

La fondation synthétique Cost Gate, version `cost-gate-foundation-3-synthetic`, est techniquement validée dans son périmètre cash long restreint. Gate 0 est clôturée. Ayman a explicitement validé Gate 1 le 15 juillet 2026. Son prototype `internal_review` est techniquement exécuté ; cinq observations qualifiées réelles restent nécessaires avant toute clôture de Gate 1.

La mission fonctionnelle active est l'**observation de cinq participants qualifiés** avec le prototype HTML hors ligne de critique de la PR `#26`, sur `strategy/cost-gate-offline-critique`. Elle doit tester la compréhension, l'effort de saisie et la confusion avec une recommandation, sans donnée externe.

Le travail autorisé se limite à :

- corriger un défaut démontré dans les actifs fusionnés ;
- maintenir les contrats, preuves et fichiers canoniques ;
- rechercher et enregistrer les angles morts ;
- exécuter les cinq observations préenregistrées de Gate 1 ;
- corriger uniquement un défaut réellement reproduit dans le prototype `internal_review` et maintenir son package exact.

Travail suspendu :

- publication ou déploiement ;
- H3 à H6 ;
- modification fonctionnelle de `app/Breaktest_Studio.html`, `validation_site/` ou `capital_efficiency_lab/` ;
- import réel ;
- compte ou stockage utilisateur ;
- application native ;
- connexion courtier ou fournisseur ;
- barème ou donnée de marché réels ;
- réseau applicatif ;
- analytics, email ou paiement ;
- marketplace, affiliation ou API ;
- signaux, allocation, recommandation, conseil ou exécution ;
- probabilité d'exécution ou ordre limite conseillé ;
- levier, marge, vente à découvert ou dérivés ;
- package présenté comme abouti avant ses gates.

## 3. Autonomie et escalade

Prendre seul les décisions techniques, produit et méthodologiques réversibles et ordinaires.

Ne consulter Ayman que pour une décision :

- changeant substantiellement la cible ou la proposition de valeur ;
- coûteuse ou créant un engagement externe ;
- irréversible ;
- juridiquement engageante ;
- dépendant réellement de sa préférence ;
- opposant plusieurs directions stratégiques comparables ;
- activant publication, collecte, paiement, donnée externe ou transaction réelle.

Recommander une option unique et demander `valide` ou `refuse` lorsque possible.

## 4. Processus obligatoire

1. Lire les sources canoniques et le registre des angles morts.
2. Reconstruire l'état validé, la branche et le head exact.
3. Identifier le problème utilisateur, financier ou de preuve.
4. Rechercher au moins un défaut adjacent ou rétrospectif.
5. Distinguer erreur, hypothèse, limite, risque et report.
6. Vérifier que la modification est nécessaire.
7. Modifier le minimum cohérent.
8. Ajouter ou corriger tests et oracles.
9. Exécuter les validations sur le code exact.
10. Corriger les défauts et rechercher les régressions.
11. Propager dans calculs, interface, documents et livrables.
12. Mettre à jour registre et canonicals uniquement avec preuves.
13. Résumer résultat, preuves, limites et une action éventuelle.

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

Ne pas attendre qu'Ayman identifie le défaut. Une CI verte ne prouve ni exhaustivité, ni utilité, ni conformité, ni demande.

Tout angle mort important reçoit priorité, statut, preuve, composant et gate dans `docs/governance/BLIND_SPOT_REGISTER.md`.

## 6. Règles critiques générales

- Ne jamais inventer donnée, source, résultat, test, utilisateur, paiement ou partenaire.
- Ne jamais transformer silencieusement une erreur en zéro ou valeur par défaut.
- Signaler tout fallback et conserver sa provenance.
- Ne jamais présenter une interaction factice comme fonctionnelle.
- Documenter, versionner et tester toute formule importante.
- Ajouter un test de non-régression à toute correction pertinente.
- Distinguer zéro, absence, invalidité, stale, conflit et non supporté.
- Aucun arrondi dans les calculs internes.
- Préserver cohérence code, méthode, interface et discours.
- Supprimer ou différer toute sophistication sans utilité, diagnostic ou preuve.
- Ne pas employer `final`, `production_ready`, `validated` ou équivalent sans définition satisfaite.

## 7. Contrats Cost Intelligence et Edge Survival

Respecter exactement :

- `QUANT_FINANCE_STANDARDS.md` ;
- `EDGE_SURVIVAL_CONTRACT.md` ;
- `EDGE_RANGE_CONTRACT.md` ;
- `GROSS_EDGE_INPUT_CONTRACT.md`.

Exigences :

- coût fixe séparé du plancher variable ;
- seuil réconcilié avec le coût total ;
- marge nette réconciliée en taux et euros ;
- absorption/rétention seulement si brut strictement positif ;
- aucune troncature d'une valeur négative ;
- aucun `Infinity`, `NaN` ou `-0` ;
- coût fixe nul traité explicitement ;
- seuil par opération indépendant de la fréquence ;
- projection annuelle qualifiée d'arithmétique ;
- unités, dénominateurs, provenance et domaine visibles ;
- seuil, point et fourchette complète non ambigus ;
- aucun mélange ou complément silencieux ;
- égalités traitées avec la tolérance commune ;
- rétrocompatibilité profonde.

## 8. Fondation Cost Gate

Cost Gate évalue une cohérence économique sous hypothèses. Il ne prédit ni rendement, ni exécution, ni performance.

Références obligatoires :

- `COST_GATE_METHOD_CONTRACT.md` ;
- `COST_GATE_PERSONALIZATION_BOUNDARY.md` ;
- `COST_GATE_SNAPSHOT_CONTRACT.md` ;
- `PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- `COST_GATE_FINDINGS_CONTRACT.md` ;
- `GROSS_EDGE_ALIGNMENT_KEY.md` ;
- `COST_GATE_MVP_GATE_MATRIX.md` ;
- `COST_GATE_FOUNDATION_MATRIX.md`.

Les identifiants de gate de `COST_GATE_MVP_GATE_MATRIX.md` font autorité. Les autres documents doivent les citer sans créer une numérotation parallèle.

### Périmètre initial

```text
cash_account
long_cash_purchase
actions_et_etf_au_comptant
hypothèses_manuelles_ou_synthetic_demo
```

Tout autre modèle retourne `unsupported`.

### Distinctions obligatoires

Ne jamais confondre :

- capital de référence et cash réglé libre ;
- cash total du compte et allocation libre de stratégie ;
- hold déjà inclus par la source et hold à déduire ;
- nominal économique et engagement cash immédiat ;
- coût d'entrée et coût du cycle complet ;
- prix mid, ask, prix attendu et prix observé ;
- spread incorporé au prix et spread ajouté ;
- donnée actuelle, stale et hypothèse manuelle ;
- avantage brut compatible et métrique d'un autre horizon ;
- absence d'incompatibilité détectée et autorisation d'ordre.

### Constats

Le moteur produit `findings[]`. Une synthèse interne ne supprime jamais les sous-diagnostics.

La formulation favorable maximale est :

> Aucune incompatibilité n'a été détectée sous les hypothèses, données et contraintes affichées pour ce snapshot.

Elle doit afficher les couches non évaluées et l'expiration.

### Personnalisation

Autoriser uniquement des contraintes explicites. Ne jamais inférer :

- tolérance au risque ;
- suitability ;
- objectif patrimonial ;
- taille, actif, courtier ou fréquence recommandés.

### Snapshot et données

Toute conclusion dépendante d'une donnée externe exige :

- source et licence ;
- timestamp, fuseau et fraîcheur ;
- instrument, place et devise ;
- couverture et provenance ;
- valeurs manquantes ou conflictuelles ;
- politique versionnée ;
- fallback interdit ;
- kill switch.

Toute modification invalide le snapshot.

Les invariants rétrospectifs obligatoires sont aussi :

- `entry_leg` correspond à un côté et `complete_round_trip` à deux côtés ;
- une incohérence entre portée et nombre de côtés invalide l'entrée ;
- l'ordre des holds, sources, contraintes et exclusions économiquement non ordonnés ne change pas le snapshot ;
- l'expiration inactive les anciens constats même si le contenu hashé n'a pas changé ;
- stale et conflit restent deux constats indépendants ;
- une erreur de friction ne supprime pas un constat cash calculable indépendamment ;
- `constraint_breach` reste réservé à une contrainte utilisateur explicite.

## 9. Frontière réglementaire

Ne jamais :

- recommander instrument ou transaction ;
- choisir un courtier ;
- qualifier taille ou fréquence d'optimale ;
- personnaliser selon un profil de risque ;
- transmettre ou exécuter un ordre ;
- présenter seuil, fourchette ou état comme rendement probable ;
- afficher « exécuter », « rejeter », « acheter », « vendre », « feu vert » ou équivalent ;
- revendiquer conformité, certification ou audit externe non obtenu ;
- utiliser un disclaimer pour compenser une conception prescriptive.

Une frontière ou un état est une relation sous hypothèses, pas un conseil.

## 10. Preuve et validation

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
12. condition d'abandon.

Clic, email, compliment, intention et première utilisation ne constituent ni paiement ni rétention.

Le test doit pouvoir conclure à l'abandon.

## 11. Règles historiques conservées

Pour le moteur historique :

- filtrage ex ante séparé de l'ex post ;
- aucun retrait rétrospectif des perdants ;
- observé séparé du simulé ;
- aucune base observée écrasée ;
- provenance conservée ;
- valeur invalide refusée ;
- aucun double comptage ;
- aucune influence future ;
- turnover chronologique ;
- nominal réservé jusqu'à sortie ;
- PnL appliqué à la sortie ;
- capital libre réconcilié ;
- « trésorerie réalisée aux sorties », jamais mark-to-market sans implémentation.

## 12. Livraison HTML hors ligne

Les versions remises à Ayman respectent `OFFLINE_HTML_DELIVERABLE_STANDARD.md`.

Priorité :

1. HTML autonome interactif ;
2. sinon ZIP local avec `index.html` et ressources relatives.

Le package inclut calculs réels, vue produit, méthode, preuves, limites, versions, manifeste, SHA-256 et appareils testés.

Les captures sont des preuves, jamais le livrable. Ne pas produire le package prématurément.

## 13. Fichiers et branches

- `app/Breaktest_Studio.html` : actif historique provisoire.
- `validation_site/` : Q0 fusionné et gelé.
- `capital_efficiency_lab/` : Edge Survival fusionné et protégé.
- `cost_gate_foundation/` : moteur synthétique isolé actif, sans interface ni donnée réelle ; toute extension exige un contrat et des oracles.
- `source_material/` : archives.
- `main` : strictement hors périmètre.
- Chaque mission utilise une branche isolée et une PR vers `breaktest-bootstrap`.
- Aucune fusion sans preuve et revue.

## 14. Définition de terminé

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

## 15. Rapport final

Présenter :

1. résultat ;
2. changements ;
3. validations exécutées ;
4. défauts trouvés, y compris rétrospectifs ;
5. limites et angles morts ;
6. une seule action utilisateur si nécessaire.
