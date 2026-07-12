# Statut de la source HTML canonique

## Fichier attendu

- Chemin matérialisé : `app/Breaktest_Studio.html`
- Taille : 132 899 octets
- SHA-256 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`

## État au 12 juillet 2026

Le fichier a été lu, exécuté et audité depuis le pack local v0.2.

Une copie reproductible de cette source est maintenant versionnée dans `app/.bundle/payload.part001` à `payload.part007`. L'intégrité de chacun des sept fragments a été vérifiée après son transfert GitHub. `scripts/materialize_breaktest.py` reconstruit le HTML et refuse toute différence de nombre de fragments, de longueur, de taille décodée ou de SHA-256.

Le fichier HTML matérialisé n'est pas conservé en double dans la branche d'amorçage : Codex doit exécuter le script sur sa branche de travail, puis versionner le résultat avec la correction testée.

## Règle

Aucune modification quantitative ne peut être considérée comme portant sur la source auditée avant exécution réussie du script et vérification de l'empreinte attendue.