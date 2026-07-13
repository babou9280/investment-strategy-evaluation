#!/usr/bin/env python3
"""Apply C1 chronological capital reservation after the reviewed C3 build."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "app" / "Breaktest_Studio.html"
PATCH = ROOT / "scripts" / "patches" / "c1_capital.js"
REPLACEMENTS = ROOT / "scripts" / "patches" / "c1_replacements.json"
C3_SHA256 = "b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80"
C1_SHA256 = ""
C1_SIZE = 0
INSERT_BEFORE = "function selectReplayTrades(trades, sample) {"
C1_MARKER = "function applyCapitalReservation(evaluations, config = {}) {"


def digest(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"Expected exactly one {label}, found {count}")
    return source.replace(old, new, 1)


payload = TARGET.read_bytes()
actual_c3 = digest(payload)
if actual_c3 != C3_SHA256:
    raise SystemExit(f"C3 input SHA-256 mismatch: expected {C3_SHA256}, got {actual_c3}")
html = payload.decode("utf-8")
if html.count(INSERT_BEFORE) != 1:
    raise SystemExit(f"Expected one C1 insertion point, found {html.count(INSERT_BEFORE)}")
if C1_MARKER in html:
    raise SystemExit("C1 capital reservation block is already present")
html = html.replace(INSERT_BEFORE, PATCH.read_text(encoding="utf-8") + "\n\n" + INSERT_BEFORE, 1)
for item in json.loads(REPLACEMENTS.read_text(encoding="utf-8")):
    html = replace_once(html, item["old"], item["new"], item["label"])
result = html.encode("utf-8")
actual_c1 = digest(result)
if C1_SIZE and (len(result) != C1_SIZE or actual_c1 != C1_SHA256):
    raise SystemExit(
        f"C1 output mismatch: expected {C1_SIZE} bytes/{C1_SHA256}, "
        f"got {len(result)} bytes/{actual_c1}"
    )
TARGET.write_bytes(result)
print(f"Applied C1 to {TARGET.relative_to(ROOT)} ({len(result)} bytes, sha256={actual_c1})")
