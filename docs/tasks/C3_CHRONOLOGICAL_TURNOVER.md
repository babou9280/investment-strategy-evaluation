# C3 — allocation chronologique du turnover

Status: ready for Codex execution.

## Objectif

Remplacer l’allocation ex post du budget de turnover par une politique strictement chronologique et exécutable au moment de chaque décision.

## Invariants obligatoires

- les décisions sont traitées dans l’ordre temporel de leur entrée ;
- une décision ne peut jamais être déplacée devant une décision antérieure en fonction de son edge réalisé ou estimé ;
- le budget consommé avant une décision dépend uniquement des décisions antérieures ;
- l’ajout d’une opportunité future, même extrême, ne modifie jamais le statut d’une décision antérieure ;
- les égalités de date sont résolues par une règle déterministe documentée, sans information de performance future ;
- une date invalide ne doit pas recevoir artificiellement la priorité ;
- les diagnostics doivent conserver le budget disponible, le budget consommé et la cause exacte d’un retrait ;
- C1 (capital simultané) et C4 (courbe de capital) restent hors périmètre.

## Validation attendue

Ajouter des tests reproductibles démontrant au minimum : invariance à l’ajout d’un trade futur, respect de l’ordre temporel, déterminisme des dates égales, traitement explicite des dates invalides, conservation des tests H1 et C2, lancement navigateur et build déterministe.
