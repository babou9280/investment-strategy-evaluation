# Prochaine mission à donner à Codex

Ne pas lancer cette mission tant que `app/Breaktest_Studio.html` n'est pas présent sur la branche `breaktest-bootstrap` et que son SHA-256 n'a pas été vérifié comme égal à :

`5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`

```text
Travaille uniquement sur la branche breaktest-bootstrap. Ne modifie et ne fusionne rien dans main.

Lis d'abord AGENTS.md, PRODUCT.md, QUALITY.md, STATE.md, DECISIONS.md, METHODOLOGY.md et docs/TECHNICAL_AUDIT.md.

Objectif unique : corriger le défaut H1 de l'audit — les rendements numériques invalides ou absents ne doivent plus être transformés silencieusement en zéro.

Exigences :
1. Identifie précisément les chemins de normalisation concernés, notamment numeric, normalizeTrade et normalizeTrades.
2. Distingue explicitement : valeur numérique valide, valeur manquante et valeur invalide.
3. Refuse un import lorsqu'un rendement ou un PnL obligatoire ne permet pas un calcul non ambigu.
4. N'utilise aucun fallback silencieux à zéro pour une donnée source obligatoire.
5. Ajoute des tests de non-régression couvrant au minimum : chaîne non numérique, cellule vide, NaN, Infinity, rendement absent avec PnL calculable, rendement et PnL tous deux absents.
6. Préserve le fonctionnement nominal du jeu de démonstration et de l'import CSV valide.
7. Exécute réellement les tests et consigne leurs commandes et résultats.
8. Mets à jour STATE.md, QUALITY.md et docs/TECHNICAL_AUDIT.md uniquement avec les constats démontrés.
9. Ne refactore pas l'application, ne corrige pas les autres défauts et ne change pas l'apparence.

Résultat attendu : une correction étroite, une suite de tests reproductible, un résumé des fichiers modifiés et les preuves d'exécution.
```
