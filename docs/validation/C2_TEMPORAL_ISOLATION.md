# Validation C2 — isolation temporelle et par échantillon

- Date : 12 juillet 2026
- Branche : `codex/c2-temporal-isolation`
- Entrée H1 : 135 754 octets, SHA-256 `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c`
- HTML après C2 : 138 406 octets, SHA-256 `b82dc786fc3a0669792744e77be34c49b744e89502138c56cd97b73187fc64f4`

## Comportement corrigé

Pour chaque décision rejouée :

- le modèle est construit séparément ;
- seules les lignes `backtest` peuvent appartenir à l'entraînement ;
- la décision elle-même est exclue ;
- les dates d'entrée et de sortie d'entraînement doivent être valides et cohérentes ;
- la sortie d'entraînement doit être strictement antérieure à l'entrée de la décision ;
- les sorties de même date, observations futures et lignes live sont exclues ;
- une décision à date d'entrée invalide est classée `observe`, sans entraînement ;
- le modèle et les diagnostics de sélection sont attachés à l'évaluation ;
- les seuils de rentabilité utilisent le modèle propre à la décision.

## Validations exécutées

### Build déterministe cumulatif

```text
python3 scripts/build_breaktest.py
Materialized app/Breaktest_Studio.html (135754 bytes, source_sha256=5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00, target_sha256=f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c)
Applied C2 to app/Breaktest_Studio.html (138406 bytes, sha256=b82dc786fc3a0669792744e77be34c49b744e89502138c56cd97b73187fc64f4)
```

Le pipeline échoue si la source H1, les marqueurs de transformation, la taille finale ou l'empreinte C2 divergent.

### Régression H1

```text
node tests/h1_strict_numeric_validation.test.js
H1 strict numeric validation tests passed

python3 tests/h1_browser_smoke.py
H1 browser smoke passed; normalized demo trades unchanged
```

La correction C2 préserve la normalisation stricte H1, les 40 trades de démonstration et les comportements d'import valide/invalide déjà validés.

### Invariants navigateur C2

```text
python3 tests/c2_temporal_isolation.py
C2 temporal isolation tests passed
```

Les scénarios exécutés démontrent :

- un seul backtest passé admissible pour une décision live donnée ;
- exclusion d'un backtest futur, d'une sortie le jour de la décision, d'une date de sortie invalide et d'une ligne live antérieure ;
- invariance du nombre d'entraînement, de la moyenne postérieure, de l'edge prudent et du statut pré-turnover après ajout d'une observation future extrême et d'une ligne live interdite ;
- application de la même règle temporelle en mode backtest ;
- décision à date invalide placée en observation, sans entraînement et triée après les décisions datées ;
- disparition des affirmations utilisateurs `OOS STRICT`, `OOS`, `walk-forward` et présence de la mention `turnover encore ex post`.

### Vérification syntaxique

Le JavaScript extrait du HTML C2 a passé `node --check`.

## Limites restantes

C2 isole l'entraînement du modèle mais ne rend pas toute la politique exécutable en temps réel. C3 reste ouvert : le budget de turnover est encore alloué après tri global des opportunités de la période. C1 et C4 restent également ouverts : capital simultané non réservé et courbe de capital non temporelle.
