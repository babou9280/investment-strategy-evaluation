# C1 — réservation du capital entre positions simultanées

Status: implemented and validated on `codex/c1-capital-reservation`; ready for controlled pull-request review and merge into `breaktest-bootstrap`.

## Scope delivered

- chronological reservation and release of full position nominal ;
- same-date funding priority inherited from C3 ;
- no intragroup recycling of newly opened same-day positions ;
- no implicit resizing ;
- explicit invalid-date and insufficient-capital outcomes ;
- per-decision capital diagnostics and aggregate constraints ;
- funded-turnover reconciliation ;
- deterministic build, Chromium invariants and cumulative regression suite.

## Evidence

See `docs/validation/C1_CAPITAL_RESERVATION.md`.

C4 and H2 to H6 remain outside this task.
