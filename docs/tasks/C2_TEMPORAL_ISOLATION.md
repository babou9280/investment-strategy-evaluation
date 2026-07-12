# C2 — isolation temporelle et par échantillon

Status: implemented and validated on `codex/c2-temporal-isolation`; pending pull-request review and merge into `breaktest-bootstrap`.

## Scope delivered

- one temporal training set and one model per replayed decision ;
- strict `training exit < decision entry` rule ;
- backtest-only training source ;
- exclusion of self, live rows, future rows, same-date exits and invalid training dates ;
- explicit observation state for decisions with invalid entry dates ;
- per-decision model and temporal diagnostics ;
- per-decision model use in break-even calculations ;
- truthful UI wording that discloses remaining ex-post turnover ;
- cumulative deterministic build and anti-look-ahead browser tests.

## Evidence

See `docs/validation/C2_TEMPORAL_ISOLATION.md`.

C1, C3, C4 and H2 to H6 remain outside this task.
