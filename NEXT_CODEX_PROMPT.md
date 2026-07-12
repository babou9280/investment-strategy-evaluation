# Prochaine mission — C1 réservation du capital simultané

Travaille uniquement sur une nouvelle branche créée depuis le dernier `breaktest-bootstrap`. Ne modifie et ne fusionne rien dans `main`.

Lis d'abord `AGENTS.md`, les six fichiers canoniques, `docs/TECHNICAL_AUDIT.md` et les validations H1, C2 et C3.

## Objectif unique

Corriger C1 : les positions qui se chevauchent ne doivent jamais réserver simultanément plus de capital que le portefeuille n'en possède.

## Politique retenue

1. Traiter les décisions d'entrée chronologiquement, en conservant l'ordre déterministe déjà établi.
2. Avant chaque groupe d'entrées, libérer le capital des positions dont la sortie est antérieure ou égale à cet instant. Une position sortie à une date peut donc financer une entrée de la même date.
3. Réserver le nominal effectivement dimensionné uniquement pour une décision déjà `keep` après H1, C2 et C3.
4. Ne jamais redimensionner implicitement un trade pour le faire entrer dans le capital disponible.
5. Si le capital libre est insuffisant, classer la décision `remove` avec un motif explicite de financement insuffisant.
6. Une décision déjà `remove` ou `observe` ne réserve rien.
7. Une date d'entrée ou de sortie invalide place la décision en `observe`, sans réservation et avec un diagnostic explicite.
8. Le PnL ne modifie pas le capital disponible avant la sortie. Pour C1, libérer uniquement le nominal réservé ; la courbe réalisée ou mark-to-market relève de C4.
9. Conserver par décision : capital initial, capital réservé avant, capital libre avant, nominal demandé, décision de financement, capital réservé après, capital libre après, date de libération et motif.
10. Exposer au minimum : pic de capital réservé, minimum de capital libre et nombre de refus pour financement.

## Tests obligatoires

- deux positions simultanées de 700 € avec 1 000 € : une seule financée ;
- deux positions non chevauchantes de 700 € avec 1 000 € : les deux financées ;
- sortie et entrée le même jour : capital libéré avant l'entrée ;
- capital exactement suffisant ;
- capital nul ;
- date d'entrée invalide ;
- date de sortie invalide ;
- décision préfiltrée : aucune réservation ;
- ajout ou modification d'une opportunité future : aucune modification d'une décision antérieure ;
- PnL futur extrême : aucune modification du capital libre avant la sortie ;
- réexécution intégrale des suites H1, C2 et C3 ;
- build déterministe, lancement Chromium et `node --check` sur le JavaScript construit.

## Documentation et limites

- créer `docs/validation/C1_CAPITAL_RESERVATION.md` avec les commandes et résultats exacts ;
- ajouter une règle permanente empêchant le retour d'un surfinancement simultané ;
- mettre à jour les fichiers canoniques uniquement avec les résultats démontrés ;
- C4 et H2 à H6 restent ouverts ;
- ne pas simuler de mark-to-market, appels de marge, levier, intérêts ou réinvestissement automatique du PnL ;
- ne pas refondre l'application ;
- ne rien fusionner automatiquement.

## Résultat attendu

Une simulation de réservation du nominal strictement chronologique et auditée, des invariants de financement reproductibles, la non-régression intégrale de H1/C2/C3 et une pull request vers `breaktest-bootstrap`.
