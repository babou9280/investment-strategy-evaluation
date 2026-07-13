#!/usr/bin/env python3
"""Apply H3 price-currency provenance after the reviewed H2 build."""
from pathlib import Path
import hashlib

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "app" / "Breaktest_Studio.html"
PATCH_DIR = ROOT / "scripts" / "patches"
H2_SHA256 = "dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf"
H3_SHA256 = "49e558fa711bf5c523e9f3478085c3c09c512b5c33015beb94a863afc1a24312"
H3_SIZE = 173_716


def digest(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def replace_block(source: str, start: str, end: str, replacement_path: str, label: str) -> str:
    a = source.find(start)
    b = source.find(end, a)
    if a < 0 or b < 0 or source.find(start, a + 1) >= 0:
        raise SystemExit(f"Unable to locate unique {label} block")
    replacement = (PATCH_DIR / replacement_path).read_text(encoding="utf-8").rstrip()
    return source[:a] + replacement + "\n\n" + source[b:]


payload = TARGET.read_bytes()
actual_h2 = digest(payload)
if actual_h2 != H2_SHA256:
    raise SystemExit(f"H2 input SHA-256 mismatch: expected {H2_SHA256}, got {actual_h2}")
html = payload.decode("utf-8")
html = replace_block(html, "function normalizeTrade(raw, index = 0) {", "function normalizeTrades(rows) {", "h3_normalization.js", "H3 normalization")
html = replace_block(html, "function positionForTrade(trade, config = {}) {", "function executionCosts(trade, notional, config = {}) {", "h3_position.js", "H3 position sizing")
html = replace_block(html, "function auditData(trades) {", "const COLORS = {", "h3_audit.js", "H3 audit")
html = replace_block(html, "function renderLedger(result) {", "function renderDatasetMeta() {", "h3_render_ledger.js", "H3 ledger")
html = replace_block(html, "function exportDecisions() {", "function openMethod()", "h3_export.js", "H3 export")

result = html.encode("utf-8")
actual_h3 = digest(result)
if len(result) != H3_SIZE or actual_h3 != H3_SHA256:
    raise SystemExit(
        f"H3 output mismatch: expected {H3_SIZE} bytes/{H3_SHA256}, "
        f"got {len(result)} bytes/{actual_h3}"
    )
TARGET.write_bytes(result)
print(f"Applied H3 to {TARGET.relative_to(ROOT)} ({len(result)} bytes, sha256={actual_h3})")
