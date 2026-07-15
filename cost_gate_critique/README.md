# Breaktest Cost Gate — prototype Gate 1

Ce dossier construit un package `internal_review` hors ligne à partir du moteur fusionné `cost_gate_foundation/engine.js`.

Le moteur navigateur n'est pas maintenu à la main : `build.py` enveloppe les sources canoniques Capital Efficiency et Cost Gate, puis ajoute uniquement un adaptateur SHA-256 synchrone nécessaire au navigateur. Les tests comparent les sorties navigateur et Node.

Le package généré reste hors de Git. Il est créé sous `cost_gate_critique/dist/` et doit être testé sous `file://` avant toute revue.

Exemple local :

```text
python3 cost_gate_critique/build.py \
  --source-commit WORKTREE \
  --generated-at 2026-07-15T00:00:00Z \
  --browser-under-test "Chromium local"
```

Cette construction ne produit ni donnée réelle, ni recommandation, ni ordre, ni validation utilisateur.
