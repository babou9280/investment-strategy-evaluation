# C4 — courbe de trésorerie réalisée aux sorties

Status: merged into `breaktest-bootstrap` by pull request `#10`, squash commit `691ed5e669b82f8f4638d0b8a4f84ef8c5866be2`.

## Objective

Replace the non-temporal entry-order PnL curve with an audited realized-cash curve at exit dates, integrated coherently with C1 capital reservation without claiming mark-to-market valuation.

## Implemented policy

- start exactly at initial capital ;
- reserve notional at entry without applying PnL ;
- process and aggregate exits before same-date entries ;
- release notional and apply net PnL only at a valid exit date ;
- make realized gains or losses available for financing only from that event ;
- preserve C3 same-date priority and C1 no-intragroup-recycling ;
- expose negative free cash after an extreme realized loss without inventing a margin call or forced liquidation ;
- keep full per-decision and per-event diagnostics ;
- render one realized-exit curve for funded decisions, explicitly non mark-to-market.

## Evidence

- build: 158 682 bytes ;
- SHA-256: `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af` ;
- GitHub Actions final run: `29245856820` on validated head `c510e943bf4634cfda0a92caf61c483a42cab3b9` ;
- H1, C2, C3, C1, C4 and negative-free-cash suites: passed ;
- Chromium execution and JavaScript syntax: passed ;
- detailed evidence: `docs/validation/C4_REALIZED_EQUITY_CURVE.md`.

`main` was not modified. The next isolated correction is H2.
