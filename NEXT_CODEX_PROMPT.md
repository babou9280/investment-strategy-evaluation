# Prochaine mission — C3 allocation chronologique du turnover

Travaille uniquement sur une nouvelle branche créée depuis `breaktest-bootstrap`. Ne modifie et ne fusionne rien dans `main`.

Lis d'abord `AGENTS.md`, les six fichiers canoniques, `docs/TECHNICAL_AUDIT.md` et les validations H1/C2.

## Objectif unique

Corriger C3 : le budget de turnover ne doit plus être alloué après un tri global utilisant les opportunités futures.

## Politique retenue

- traiter les décisions par date d'entrée croissante ;
- appliquer un plafond glissant sur les 365,25 jours précédant chaque décision ;
- à date identique, classer uniquement les opportunités simultanément disponibles par edge prudent, puis edge central et identifiant déterministe ;
- une décision future ne doit jamais modifier une décision antérieure ;
- les décisions à date invalide restent `observe` et ne consomment aucun budget ;
- conserver pour chaque décision le budget disponible, l'utilisation avant/après et le motif d'acceptation ou de refus ;
- distinguer dans les agrégats le turnover annuel moyen et le pic glissant réellement comparé au plafond.

## Exigences de validation

1. Ajouter un scénario où l'algorithme historique global choisit à tort un meilleur trade futur au détriment d'un trade antérieur.
2. Prouver qu'après correction, ajouter, supprimer ou modifier une opportunité future ne change jamais les décisions déjà prises.
3. Tester le renouvellement du budget après 365,25 jours, les décisions de même date, un budget nul et une date invalide.
4. Réexécuter intégralement les tests H1 et C2.
5. Vérifier le build déterministe, la syntaxe JavaScript et l'absence de régression de la démonstration hors effets attendus du turnover.
6. Mettre à jour les fichiers canoniques uniquement avec les résultats démontrés.

## Hors périmètre

- ne pas corriger C1, C4 ou H2 à H6 ;
- ne pas simuler encore la réservation du capital entre positions ;
- ne pas transformer la courbe de capital en mark-to-market ;
- ne pas refondre l'application ;
- ne rien fusionner automatiquement dans `main`.

## Résultat attendu

Une allocation du turnover ex ante, chronologique et auditée, des invariants anti-futur reproductibles, une documentation cohérente et une pull request vers `breaktest-bootstrap`.
