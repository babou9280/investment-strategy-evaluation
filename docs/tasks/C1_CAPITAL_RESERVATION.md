# C1 — réservation du capital entre positions simultanées

Status: ready for Codex execution on `codex/c1-capital-reservation`, based on synchronized `breaktest-bootstrap` commit `88ccf837e4776646c757b8de6d2ce347e19bf4aa`.

## Objective

Prevent simultaneous open positions from reserving more nominal capital than the portfolio owns, without implicit resizing and without introducing C4 mark-to-market behavior.

## Required evidence

See `NEXT_CODEX_PROMPT.md`. Preserve and rerun H1, C2 and C3 tests; add deterministic C1 browser invariants and exact build evidence.
