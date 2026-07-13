# Prochaine mission Codex — audit de préparation au test utilisateur

## Statut

La page Cost Intelligence a été fusionnée dans `breaktest-bootstrap` par la pull request `#16`, commit `aadef6dec71a6882f9746ea4b2721ee91a3ee1f3`.

La mission active est une **préparation interne et réversible**. Elle n'autorise aucun déploiement public, domaine, collecte, analytics, paiement ou dépense.

Ne modifie jamais `main`. Ne fusionne rien automatiquement.

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
- `docs/design/` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/validation/COST_INTELLIGENCE_VALIDATION_SITE.md` ;
- `docs/launch/STATIC_LAUNCH_CHECKLIST.md` ;
- `docs/launch/USER_TEST_PROTOCOL.md` ;
- `docs/launch/PRIVACY_MINIMUM.md` ;
- `docs/tasks/COST_INTELLIGENCE_LAUNCH_READINESS.md` ;
- `go_to_market/` ;
- le dossier `validation_site/` et ses tests.

## Objectif unique

Rendre le prototype prêt à être présenté localement ou via une URL de prévisualisation privée après validation d'Ayman, sans activer de service externe.

## Périmètre autorisé

1. créer `validation_site/README.md` avec des instructions locales exactes ;
2. ajouter un test d'intégrité statique vérifiant :
   - tous les assets sont locaux et relatifs ;
   - aucun script tiers, pixel, iframe ou requête réseau n'est configuré ;
   - aucun secret, token ou endpoint n'est présent ;
   - analytics, email et paiement restent désactivés ;
   - aucune donnée saisie n'est sérialisée automatiquement dans l'URL ou un stockage persistant ;
3. contrôler le poids des fichiers et documenter un budget de performance simple ;
4. vérifier à nouveau les calculs, la syntaxe et Chromium ;
5. créer `docs/validation/COST_INTELLIGENCE_LAUNCH_READINESS.md` avec commandes, résultats et limites ;
6. mettre à jour `STATE.md` uniquement avec les preuves exécutées.

## Interdictions

- aucun déploiement public ou privé chez un tiers ;
- aucune création de domaine ;
- aucune activation de GitHub Pages ou service équivalent ;
- aucune collecte email ;
- aucun analytics ;
- aucun paiement ;
- aucun cookie ou stockage persistant ;
- aucun tarif réel de courtier ;
- aucun import de transactions ;
- aucune recommandation ;
- aucune modification des formules Q0 sans nouvelle décision et nouvelle version ;
- aucune reprise de H3 à H6 ;
- aucune transformation en application complète.

## Tests obligatoires

- toutes les suites historiques et Cost Intelligence déjà validées ;
- test d'intégrité statique ;
- vérification des liens et fichiers locaux ;
- vérification qu'aucun `http://`, `https://`, `fetch`, `XMLHttpRequest`, `WebSocket`, iframe, beacon ou script tiers n'est actif dans `validation_site/` ;
- vérification de la configuration désactivée ;
- vérification que le calculateur fonctionne depuis un serveur local statique ;
- contrôle Chromium aux quatre largeurs ;
- syntaxe JavaScript et Python.

## Définition de terminé

La mission est terminée lorsque :

- le prototype peut être lancé localement avec une commande documentée ;
- les contrôles prouvent l'absence d'intégration externe active ;
- le build historique demeure inchangé ;
- les suites sont vertes sur le head exact ;
- les limites Safari/iPad et marché restent déclarées ;
- une pull request isolée vers `breaktest-bootstrap` est prête pour revue.

La décision suivante devra porter uniquement sur l'autorisation d'une prévisualisation ou publication externe et sera présentée à Ayman avec une recommandation unique.
