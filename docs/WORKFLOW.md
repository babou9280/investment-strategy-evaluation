# Workflow Breaktest

## Quand Ayman donne un retour

1. Interpréter le retour comme un delta.
2. Chercher la cause profonde.
3. Modifier les parties concernées.
4. Ajouter une règle ou un test si le défaut peut revenir.
5. Valider la nouvelle version.
6. Mettre à jour `STATE.md`, et les autres fichiers si nécessaire.

## Réponses courtes acceptées

- `continue` : sélectionner l'amélioration prioritaire dans `STATE.md` ;
- `audit complet` : vérifier produit, code, calculs, données et promesses ;
- `reviens à la version précédente` : restaurer la dernière version approuvée sans supprimer les améliorations indépendantes ;
- `ça fait faux` : rechercher les éléments décoratifs, non prouvés, génériques ou incohérents ;
- `rends-le investisseur-ready` : vérifier d'abord la défendabilité, puis actualiser le packaging.

## Source de vérité

Lire dans l'ordre : `AGENTS.md`, les six fichiers canoniques, puis `docs/TECHNICAL_AUDIT.md`.

## Séparation des branches

- `main` : projet universitaire d'origine, inchangé par Breaktest ;
- `breaktest-bootstrap` : amorçage provisoire du produit et des audits.

## Source du code pour Codex

Codex Cloud travaille à partir du dépôt et de la branche associés à son environnement. Le workflow ne suppose pas qu'un fichier ZIP puisse être joint à une tâche.

Avant toute mission de code :

1. vérifier que `app/Breaktest_Studio.html` existe sur `breaktest-bootstrap` ;
2. vérifier que son SHA-256 vaut `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` pour la version auditée ;
3. lire `NEXT_CODEX_PROMPT.md` ;
4. ne modifier qu'une cible étroite ;
5. exécuter et consigner les validations ;
6. mettre à jour les fichiers canoniques.

## État actuel

L'audit initial est disponible dans `docs/TECHNICAL_AUDIT.md`. La prochaine correction autorisée porte uniquement sur la validation stricte des données numériques. Aucun refactoring général n'est autorisé.