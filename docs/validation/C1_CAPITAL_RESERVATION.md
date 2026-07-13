# Validation C1 — réservation chronologique du capital

- Date : 13 juillet 2026
- Branche : `codex/c1-capital-reservation`
- Entrée C3 : 142 782 octets, SHA-256 `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80`
- HTML après C1 : 152 496 octets, SHA-256 `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e`
- GitHub Actions : workflow `Breaktest validation`, exécution `29215185885`, succès complet

## Politique validée

- les décisions déjà `keep` après H1, C2 et C3 sont traitées chronologiquement par groupes de même entrée ;
- avant chaque groupe, le nominal des positions dont la sortie est antérieure ou égale à l'entrée du groupe est libéré ;
- une position ouverte et sortie le jour du groupe n'est pas recyclée au milieu de ce même groupe ;
- la priorité simultanée C3 est conservée par `rankWithinDate`, puis par les départages déterministes existants ;
- le nominal complet est réservé sans redimensionnement implicite ;
- un capital libre insuffisant produit `remove` avec un motif explicite ;
- une décision déjà retirée ou en observation ne réserve rien ;
- une date d'entrée invalide, une date de sortie invalide ou une sortie antérieure à l'entrée produit `observe` sans réservation ;
- le PnL ne modifie pas le capital disponible : C1 libère uniquement le nominal à la sortie ;
- chaque décision conserve un diagnostic de financement avant et après ;
- les agrégats exposent le pic réservé, le minimum libre et le nombre de refus de financement ;
- les statistiques de turnover sont recalculées sur les décisions finalement financées.

## Validations exécutées

```text
python3 scripts/build_breaktest.py
Materialized app/Breaktest_Studio.html (135754 bytes, source_sha256=5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00, target_sha256=f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c)
Applied C2 to app/Breaktest_Studio.html (138887 bytes, sha256=e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454)
Applied C3 to app/Breaktest_Studio.html (142782 bytes, sha256=b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80)
Applied C1 to app/Breaktest_Studio.html (152496 bytes, sha256=e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e)
```

```text
node tests/h1_strict_numeric_validation.test.js
H1 strict numeric validation tests passed

python3 tests/h1_browser_smoke.py
H1 browser smoke passed; normalized demo trades unchanged

python3 tests/c2_temporal_isolation.py
C2 temporal isolation tests passed

python3 tests/c3_chronological_turnover.py
C3 chronological turnover tests passed

python3 tests/c1_capital_reservation.py
C1 capital reservation tests passed
```

Le JavaScript extrait du HTML a passé `node --check`.

## Scénarios C1 démontrés

- deux positions simultanées de 700 € avec 1 000 € : une seule financée ;
- deux positions non chevauchantes de 700 € avec 1 000 € : les deux financées ;
- sortie et entrée le même jour : le nominal antérieur est libéré avant la nouvelle entrée ;
- deux entrées et sorties le même jour : aucune libération au milieu du groupe simultané ;
- priorité C3 de même date préservée même lorsqu'elle contredit l'ordre des identifiants ;
- capital exactement suffisant ;
- capital nul ;
- date d'entrée invalide ;
- date de sortie invalide ;
- sortie antérieure à l'entrée ;
- décision préfiltrée sans réservation ;
- ajout ou modification d'une opportunité future sans modification de la décision antérieure ;
- PnL futur extrême sans effet sur le capital antérieur ;
- diagnostics présents sur toutes les décisions de démonstration ;
- pic de capital réservé inférieur ou égal au capital initial ;
- turnover final inférieur ou égal à son plafond après refus de financement.

## Limites restantes

C1 ne produit pas une courbe de trésorerie réalisée ou mark-to-market. Le capital initial reste constant et le PnL n'est pas réinvesti. Les appels de marge, le levier, les intérêts, les flux externes et les valorisations intermédiaires restent hors périmètre. C4 demeure critique ; H2 à H6 demeurent ouverts.
