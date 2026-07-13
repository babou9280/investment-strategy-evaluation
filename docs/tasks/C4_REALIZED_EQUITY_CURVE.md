# C4 — courbe de trésorerie réalisée aux sorties

Status: ready for implementation on `codex/c4-realized-equity-curve`, based on `breaktest-bootstrap` commit `2d84a0fa06b5b28da2fbd16c2f704e0bb58ff284`.

## Objective

Replace the non-temporal entry-date PnL curve with an audited realized-cash curve at exit dates, integrated coherently with C1 capital reservation without claiming mark-to-market valuation.

## Required evidence

Follow `NEXT_CODEX_PROMPT.md`. Preserve and rerun H1, C2, C3 and C1; add deterministic C4 browser invariants, exact build evidence and canonical documentation. Never modify `main`.
