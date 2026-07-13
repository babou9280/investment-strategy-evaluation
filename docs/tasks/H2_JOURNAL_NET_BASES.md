# H2 — bases nettes observées du journal

Status: ready for implementation on `codex/h2-journal-net-bases`, based on synchronized `breaktest-bootstrap` after C4.

## Objective

Normalize and preserve journal-provided fixed-net and full-cost PnL/return bases instead of silently replacing them with Breaktest cost simulations.

## Required policy

- distinguish gross observed, fixed-net observed and full-cost observed bases ;
- preserve source, derived and explicit-fallback provenance per line ;
- fail firmly on explicitly invalid supplied net values ;
- keep real numeric zero valid ;
- derive one missing member of a PnL/return pair only from the other member and a valid nominal ;
- use fallback only when an optional basis is entirely absent ;
- separate observed journal results from simulated-cost results ;
- prevent double counting when C4 consumes the selected PnL basis ;
- keep H4 reconciliation of jointly supplied inconsistent pairs outside this correction, except for explicit anomaly reporting.

## Required evidence

Follow `NEXT_CODEX_PROMPT.md`. Preserve and rerun H1, C2, C3, C1 and C4; add deterministic H2 import, provenance, aggregation, scenario-separation, ledger/export and browser invariants. Lock the build size and SHA-256 and document exact execution evidence in `docs/validation/H2_JOURNAL_NET_BASES.md`.

`main` remains out of scope and no automatic merge is allowed.
