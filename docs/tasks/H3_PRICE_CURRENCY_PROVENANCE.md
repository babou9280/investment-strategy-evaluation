# H3 — provenance de devise du prix d'entrée

Status: ready for implementation on `codex/h3-price-currency-provenance`, based on synchronized `breaktest-bootstrap` after H2.

## Objective

Prevent `entry_price_eur` from being converted again, convert an explicitly USD-denominated price exactly once, and preserve source, currency and conversion provenance.

## Required policy

- EUR source price: conversion factor 1 ;
- USD source price: apply `eurPerQuoteCurrency` exactly once ;
- generic price: require an explicit supported currency to convert confidently, otherwise preserve `unspecified` provenance and use a documented fail-safe ;
- supplied invalid, zero or negative prices must never silently become a valid zero-price position ;
- integer-share sizing must use the corrected EUR unit price ;
- fractional sizing must preserve its nominal behavior while retaining price diagnostics ;
- UI, audit and export must expose source key, source value, currency, factor and final EUR price ;
- H1, H2, C2, C3, C1 and C4 must remain unchanged except for minimal provenance transport.

## Required evidence

Follow `NEXT_CODEX_PROMPT.md`. Add deterministic normalization, sizing, import, UI/audit/export and browser tests; rerun every existing regression suite; lock build size and SHA-256; document exact proof in `docs/validation/H3_PRICE_CURRENCY_PROVENANCE.md`.

`main` remains out of scope and no automatic merge is allowed.
