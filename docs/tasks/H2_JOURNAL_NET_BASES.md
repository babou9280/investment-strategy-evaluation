# H2 — bases nettes observées du journal

Status: merged into `breaktest-bootstrap` by pull request `#12`, squash commit `3504d448547bfeab9ef74114af3c08fb557a1c75`.

## Objective

Normalize and preserve journal-provided fixed-net and full-cost PnL/return bases instead of silently replacing them with Breaktest cost simulations.

## Implemented policy

- gross observed, fixed-net observed, full-cost observed and Breaktest-simulated results are separate bases ;
- observed, derived, fallback and simulated provenance is preserved per line ;
- explicitly invalid supplied values fail the batch firmly ;
- a real numeric zero remains valid ;
- one missing member of a PnL/return pair is derived only from the other member and a valid nominal ;
- fallback occurs only when an optional pair is entirely absent ;
- observed journal values never change when simulated-cost assumptions change ;
- C4 consumes the selected result basis once, without double-counting costs ;
- jointly supplied inconsistent PnL/return values are preserved and flagged for H4 ;
- supplied PnL is authoritative for scaling to a simulated notional, while supplied return remains auditable ;
- basis and provenance are visible in the UI, audit and export.

## Evidence

- build: 166 862 bytes ;
- SHA-256: `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf` ;
- final exact-head GitHub Actions run: `29248916855` on `9539a9676ac1ac6d0a3bd1f470322c29b60edc96` ;
- H1, H2 numeric, H1 browser, C2, C3, C1, C4, negative-free-cash, H2 browser and JavaScript syntax suites: passed ;
- detailed evidence: `docs/validation/H2_JOURNAL_NET_BASES.md`.

`main` was not modified. The next isolated correction is H3.
