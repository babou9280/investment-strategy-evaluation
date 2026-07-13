# Prochaine mission Codex — en attente de la décision de lancement

## Statut

La page Cost Intelligence et sa préparation interne ont été fusionnées dans `breaktest-bootstrap` :

- pull request `#16`, commit `aadef6dec71a6882f9746ea4b2721ee91a3ee1f3` ;
- pull request `#17`, commit `3ffd20c845e0dcae8c7438fb866a18601ecc7ab3`.

Le prototype est techniquement prêt pour un premier test utilisateur, mais il n'est ni publié ni commercialement validé.

**Aucune nouvelle mission de code n'est autorisée avant la décision explicite d'Ayman concernant une publication statique externe.**

Ne modifie jamais `main`. Ne crée aucune branche de fonctionnalité. Ne fusionne rien automatiquement.

## Sources à lire après validation éventuelle

- `AGENTS.md` ;
- les six fichiers canoniques ;
- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `docs/design/` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/validation/COST_INTELLIGENCE_VALIDATION_SITE.md` ;
- `docs/validation/COST_INTELLIGENCE_LAUNCH_READINESS.md` ;
- `docs/launch/STATIC_LAUNCH_CHECKLIST.md` ;
- `docs/launch/USER_TEST_PROTOCOL.md` ;
- `docs/launch/PRIVACY_MINIMUM.md` ;
- `go_to_market/` ;
- `validation_site/` et ses tests.

## Mission conditionnelle après validation d'Ayman

Uniquement si Ayman valide une solution d'hébergement précise :

1. créer une branche isolée depuis le dernier `breaktest-bootstrap` ;
2. ajouter seulement la configuration et les instructions indispensables à l'hébergement retenu ;
3. conserver les formules Q0, l'interface et le moteur historique inchangés sauf défaut bloquant démontré ;
4. conserver analytics, email et paiement désactivés ;
5. ne demander aucun domaine payant ;
6. préserver l'absence de réseau applicatif et de stockage persistant ;
7. exécuter toutes les validations historiques, Cost Intelligence, Chromium, intégrité et syntaxe ;
8. documenter l'URL, le coût, les données techniques traitées par l'hébergeur, le rollback et les limites ;
9. ouvrir une pull request vers `breaktest-bootstrap` sans fusion automatique.

## Interdictions permanentes pour cette étape

- aucune nouvelle fonctionnalité ;
- aucun import de transactions ;
- aucune donnée ou grille réelle de courtier ;
- aucune recommandation ou comparaison prescriptive ;
- aucun compte utilisateur ;
- aucun analytics ;
- aucune collecte email ;
- aucun paiement ;
- aucun cookie ou stockage applicatif persistant ;
- aucune modification des formules sans nouvelle version et preuve ;
- aucune reprise de H3 à H6 ;
- aucune modification de `main`.

## Définition de terminé après validation éventuelle

La mission conditionnelle sera terminée seulement si :

- la configuration correspond exactement à la décision d'Ayman ;
- le site publié correspond au commit validé ;
- HTTPS et rollback sont démontrés ;
- aucun service externe non autorisé n'est actif ;
- toutes les suites réussissent sur le head exact ;
- la diffusion reste limitée à la première vague prévue ;
- la validation technique n'est jamais présentée comme une validation commerciale.
