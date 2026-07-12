# Validation C3 — allocation chronologique du turnover

- Date : 13 juillet 2026
- Branche : `codex/c3-chronological-turnover-v2`
- Entrée C2 : 138 887 octets, SHA-256 `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454`
- HTML après C3 : 142 782 octets, SHA-256 `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80`

## Comportement corrigé

- décisions traitées par date d'entrée croissante ;
- plafond appliqué sur les 365,25 jours précédents ;
- opportunités de même date classées avec leurs informations simultanément disponibles ;
- opportunité future incapable de modifier une décision antérieure ;
- date invalide sans consommation de budget ;
- décisions déjà retirées/observées sans consommation ;
- diagnostics détaillés attachés à chaque décision ;
- pic glissant séparé de la moyenne annuelle.

## Validations exécutées

```text
python3 scripts/build_breaktest.py
Materialized app/Breaktest_Studio.html (135754 bytes, source_sha256=5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00, target_sha256=f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c)
Applied C2 to app/Breaktest_Studio.html (138887 bytes, sha256=e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454)
Applied C3 to app/Breaktest_Studio.html (142782 bytes, sha256=b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80)
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
```

Le JavaScript extrait du HTML a passé `node --check`.

## Scénarios C3 démontrés

- une décision antérieure est identique avec ou sans opportunité future, même si l'edge futur change de +99 à −99 ;
- l'opportunité future est refusée lorsque le budget a déjà été consommé ;
- le budget se renouvelle après plus de 365,25 jours ;
- il ne se renouvelle pas avant l'expiration de la fenêtre ;
- à date identique, edge prudent supérieur prioritaire ;
- à edge identique, identifiant déterministe comme dernier départage ;
- budget nul : refus sans dépassement ;
- date invalide : observation sans consommation ;
- décision préfiltrée : aucune consommation ;
- démonstration : pic glissant inférieur ou égal au plafond et diagnostics présents sur toutes les évaluations.

## Limites restantes

C3 ne réserve pas le capital entre positions simultanées et ne produit pas une courbe de portefeuille réalisée ou mark-to-market. C1 et C4 restent critiques.
