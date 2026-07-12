# Breaktest — point d'entrée

Ce dépôt contient le projet universitaire d'origine sur `main` et un amorçage isolé de Breaktest sur la branche `breaktest-bootstrap`.

## Ordre de lecture obligatoire

1. `AGENTS.md`
2. `PRODUCT.md`
3. `QUALITY.md`
4. `STATE.md`
5. `DECISIONS.md`
6. `METHODOLOGY.md`
7. `docs/TECHNICAL_AUDIT.md`
8. `NEXT_CODEX_PROMPT.md`

## État réel

- Le prototype local a été exécuté et audité initialement.
- L'audit est versionné dans `docs/TECHNICAL_AUDIT.md`.
- Le fichier canonique attendu est `app/Breaktest_Studio.html`.
- Son SHA-256 attendu est `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`.
- Tant que ce fichier n'est pas présent et vérifié sur `breaktest-bootstrap`, Codex ne doit effectuer aucune modification de code.
- Le workflow Codex ne dépend pas d'une pièce jointe ZIP : l'environnement doit utiliser les fichiers du dépôt.
- La branche `main` ne doit pas recevoir de modification Breaktest.

La prochaine mission autorisée est décrite exactement dans `NEXT_CODEX_PROMPT.md`.