# C3 — allocation chronologique du turnover

Status: implemented and validated on `codex/c3-chronological-turnover-v2`; pending pull-request review and merge into `breaktest-bootstrap`.

## Scope delivered

- chronological processing by entry date ;
- rolling 365.25-day turnover cap ;
- same-date ex-ante ranking by conservative edge, central edge and deterministic identifier ;
- no budget consumption for invalid-date or prefiltered decisions ;
- per-decision budget diagnostics ;
- separate rolling peak and descriptive annual average ;
- truthful UI labels ;
- cumulative deterministic build and browser invariants.

## Evidence

See `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md`.

C1, C4 and H2 to H6 remain outside this task.
