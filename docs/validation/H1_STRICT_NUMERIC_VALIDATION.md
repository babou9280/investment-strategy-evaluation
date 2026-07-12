# Validation H1 — données numériques strictes

- Date : 12 juillet 2026
- Branche : `codex/h1-strict-numeric-validation`
- Source immuable : bundle v0.2, SHA-256 `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`
- HTML après correction H1 : 135 754 octets, SHA-256 `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c`

## Comportement corrigé

- `invested_eur` doit être présent, fini et strictement positif.
- Une valeur PnL ou rendement explicitement invalide entraîne le refus du lot.
- Au moins un PnL brut ou rendement brut valide est obligatoire.
- Le champ manquant peut être dérivé de l'autre champ et du nominal lorsque le calcul est non ambigu.
- Un zéro réel reste valide.
- La normalisation conserve `grossPnlDerived` et `grossReturnDerived`.
- Une ou plusieurs lignes invalides refusent le lot complet ; l'ancien jeu reste actif.

## Validations exécutées

### Matérialisation déterministe

```text
python3 scripts/materialize_breaktest.py
Materialized app/Breaktest_Studio.html (135754 bytes, source_sha256=5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00, target_sha256=f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c)
```

Le script refuse un nombre de fragments incorrect, une empreinte source divergente, des marqueurs de transformation absents ou multiples et une empreinte cible divergente.

### Tests unitaires et d'invariants

```text
node tests/h1_strict_numeric_validation.test.js
H1 strict numeric validation tests passed
```

Cas couverts : chaîne non numérique, cellule vide, `NaN`, `Infinity`, nominal absent ou nul, PnL invalide, rendement dérivé, PnL dérivé, zéro réel, lot comportant plusieurs lignes invalides et conservation des 40 lignes de démonstration.

### Test navigateur ciblé

```text
python3 tests/h1_browser_smoke.py
H1 browser smoke passed; demo numerical snapshot unchanged
```

Exécuté dans l'environnement d'audit avec Playwright et Chromium système. Le test :

- reconstruit et vérifie la source pré-H1 depuis le bundle ;
- compare le snapshot numérique complet de la démonstration avant/après ;
- importe un CSV valide avec rendement dérivé ;
- refuse un CSV contenant un rendement non numérique ;
- vérifie que le jeu précédent reste inchangé et que le message indique la ligne et le champ.

### Vérification syntaxique

Le JavaScript extrait du document a passé `node --check`.

## Limites restantes

Cette correction ne valide pas le moteur quantitatif complet. Les défauts C1 à C4 et H2 à H6 de `docs/TECHNICAL_AUDIT.md` restent ouverts. La provenance dérivée est conservée en interne mais n'est pas encore affichée ligne par ligne dans l'interface utilisateur.
