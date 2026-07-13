#!/usr/bin/env python3
"""Apply H2 journal-observed PnL bases after the reviewed C4 build."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "app" / "Breaktest_Studio.html"
PATCH_DIR = ROOT / "scripts" / "patches"
C4_SHA256 = "ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af"
H2_SHA256 = "a5d6c978e4c10a5179ba94d7216f86ea8c522207bbf78ef1bc6fa91d08ee6e52"
H2_SIZE = 166_816


def digest(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"Expected exactly one {label}, found {count}")
    return source.replace(old, new, 1)


def replace_block(source: str, start: str, end: str, replacement_path: str, label: str) -> str:
    a = source.find(start)
    b = source.find(end, a)
    if a < 0 or b < 0 or source.find(start, a + 1) >= 0:
        raise SystemExit(f"Unable to locate unique {label} block")
    replacement = (PATCH_DIR / replacement_path).read_text(encoding="utf-8").rstrip()
    return source[:a] + replacement + "\n\n" + source[b:]


payload = TARGET.read_bytes()
actual_c4 = digest(payload)
if actual_c4 != C4_SHA256:
    raise SystemExit(f"C4 input SHA-256 mismatch: expected {C4_SHA256}, got {actual_c4}")
html = payload.decode("utf-8")
replacements = json.loads((PATCH_DIR / "h2_replacements.json").read_text(encoding="utf-8"))

for item in replacements[:5]:
    html = replace_once(html, item["old"], item["new"], item["label"])

html = replace_block(html, "function normalizeTrade(raw, index = 0) {", "function normalizeTrades(rows) {", "h2_normalization.js", "H2 normalization")
html = replace_block(html, "function evaluateTrade(trade, model, config = {}) {", "function validDate(value) {", "h2_evaluate_trade.js", "H2 trade evaluation")
html = replace_block(html, "function auditData(trades) {", "const COLORS = {", "h2_audit.js", "H2 audit")
html = replace_block(html, "function renderCapitalSummary(result) {", "function renderCapitalLadder(result) {", "h2_render_summary.js", "H2 capital summary")
html = replace_block(html, "function renderLedger(result) {", "function renderDatasetMeta() {", "h2_render_ledger.js", "H2 ledger")
html = replace_block(html, "function exportDecisions() {", "function openMethod()", "h2_export.js", "H2 export")

for item in replacements[5:]:
    html = replace_once(html, item["old"], item["new"], item["label"])

result = html.encode("utf-8")
actual_h2 = digest(result)
if len(result) != H2_SIZE or actual_h2 != H2_SHA256:
    raise SystemExit(
        f"H2 output mismatch: expected {H2_SIZE} bytes/{H2_SHA256}, "
        f"got {len(result)} bytes/{actual_h2}"
    )
TARGET.write_bytes(result)
print(f"Applied H2 to {TARGET.relative_to(ROOT)} ({len(result)} bytes, sha256={actual_h2})")
