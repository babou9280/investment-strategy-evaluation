# Prochaine mission — C4 courbe de capital temporelle

Travaille uniquement sur une nouvelle branche créée depuis le dernier `breaktest-bootstrap` après fusion contrôlée de C1. Ne modifie et ne fusionne rien dans `main`.

Lis d'abord `AGENTS.md`, les six fichiers canoniques, `docs/TECHNICAL_AUDIT.md` et les validations H1, C2, C3 et C1.

## Objectif unique

Corriger C4 : la courbe de capital ne doit plus affecter le PnL complet à la date d'entrée. Elle doit représenter explicitement une courbe de trésorerie réalisée aux dates de sortie, cohérente avec la politique de financement C1.

## Politique retenue pour cette mission

1. Construire une courbe de **trésorerie réalisée**, pas une valorisation mark-to-market.
2. Partir du capital initial.
3. Conserver la réservation du nominal C1 séparée de la trésorerie réalisée : ouvrir une position réserve du capital mais ne crée pas de PnL.
4. Appliquer le PnL net de chaque décision finalement `keep` uniquement à sa date de sortie valide.
5. À une même date, agréger les PnL sortants avant de produire le point de courbe ; l'ordre interne ne doit pas modifier le résultat quotidien.
6. Une décision `remove` ou `observe` ne contribue pas à la courbe.
7. Une date de sortie invalide ne doit pas être imputée silencieusement à l'entrée ou à la fin de la série.
8. Définir explicitement si le PnL réalisé augmente le capital utilisable pour de nouvelles entrées. Recommandation : oui, uniquement à partir des groupes d'entrée strictement postérieurs ou de même date après traitement des sorties antérieures ; préserver la convention C1 selon laquelle une sortie à une date peut financer une entrée de cette date.
9. Recalculer le financement et la courbe dans une seule simulation événementielle cohérente, sans double comptage du nominal ni du PnL.
10. Conserver pour chaque événement : date, type, capital réalisé avant/après, nominal réservé avant/après, capital libre avant/après, PnL appliqué et décisions concernées.
11. Exposer clairement que la courbe est réalisée aux sorties et non mark-to-market.
12. Ne pas introduire de levier, appels de marge, intérêts, frais de financement, dividendes, dépôts/retraits ou valorisation intermédiaire.

## Invariants obligatoires

- un PnL ne modifie jamais la courbe avant la sortie ;
- changer uniquement la date d'entrée sans changer la sortie ne déplace pas le PnL réalisé ;
- changer la date de sortie déplace le PnL au nouveau jour de sortie ;
- deux sorties le même jour donnent le même point final quel que soit leur ordre ;
- un trade retiré ou observé ne modifie pas la courbe ;
- une perte réalisée réduit le capital disponible pour les entrées ultérieures, sans modifier les décisions antérieures ;
- un gain réalisé augmente le capital disponible seulement à partir de sa réalisation ;
- une sortie et une entrée le même jour respectent la convention documentée ;
- l'ajout ou la modification d'un événement futur ne change jamais les points et décisions antérieurs ;
- la courbe commence exactement au capital initial ;
- le dernier point égale le capital initial plus la somme des PnL nets des trades financés et sortis valides ;
- le capital libre et réservé restent réconciliés à chaque événement.

## Tests obligatoires

- gain avec entrée J1 et sortie J10 : aucune hausse avant J10 ;
- perte avec entrée J1 et sortie J10 : aucune baisse avant J10 ;
- deux sorties le même jour, ordre inversé ;
- sortie et nouvelle entrée le même jour ;
- gain finançant une entrée ultérieure qui ne rentrait pas avant réalisation ;
- perte empêchant une entrée ultérieure ;
- trade `remove` et trade `observe` sans effet ;
- date de sortie invalide ;
- futur extrême sans effet sur le passé ;
- réconciliation dernier point / somme des PnL réalisés ;
- réexécution intégrale des suites H1, C2, C3 et C1 ;
- build déterministe, lancement Chromium et `node --check`.

## Documentation et limites

- créer `docs/validation/C4_REALIZED_EQUITY_CURVE.md` avec les commandes, empreintes et résultats exacts ;
- mettre à jour les fichiers canoniques uniquement avec les résultats démontrés ;
- conserver l'expression « courbe réalisée aux sorties » et interdire « mark-to-market » ;
- H2 à H6 restent ouverts ;
- ne pas refondre l'application ;
- ne rien fusionner automatiquement.

## Résultat attendu

Une simulation événementielle cohérente entre financement et PnL réalisé, une courbe temporelle auditée aux dates de sortie, des invariants anti-futur reproductibles et une pull request isolée vers `breaktest-bootstrap`.
