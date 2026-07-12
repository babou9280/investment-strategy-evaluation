#!/usr/bin/env python3
"""Apply the reviewed C3 chronological-turnover patch to the hardened C2 HTML."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "app" / "Breaktest_Studio.html"
PATCH = ROOT / "scripts" / "patches" / "c3_turnover.js"
REPLACEMENTS = ROOT / "scripts" / "patches" / "c3_replacements.json"
C2_SHA256 = "e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454"
C3_SHA256 = "b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80"
C3_SIZE = 142_782
BLOCK_START = "function applyTurnoverBudget(evaluations, config = {}) {"
BLOCK_END = "function selectReplayTrades(trades, sample) {"


def digest(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"Expected exactly one {label}, found {count}")
    return source.replace(old, new, 1)


payload = TARGET.read_bytes()
actual_c2 = digest(payload)
if actual_c2 != C2_SHA256:
    raise SystemExit(f"C2 input SHA-256 mismatch: expected {C2_SHA256}, got {actual_c2}")
html = payload.decode("utf-8")
start = html.find(BLOCK_START)
end = html.find(BLOCK_END, start)
if start < 0 or end < 0 or html.find(BLOCK_START, start + 1) >= 0:
    raise SystemExit("Unable to locate the unique C3 turnover block")
html = html[:start] + PATCH.read_text(encoding="utf-8") + "\n" + html[end:]
for item in json.loads(REPLACEMENTS.read_text(encoding="utf-8")):
    html = replace_once(html, item["old"], item["new"], item["label"])
result = html.encode("utf-8")
actual_c3 = digest(result)
if C3_SIZE and (len(result) != C3_SIZE or actual_c3 != C3_SHA256):
    raise SystemExit(
        f"C3 output mismatch: expected {C3_SIZE} bytes/{C3_SHA256}, "
        f"got {len(result)} bytes/{actual_c3}"
    )
TARGET.write_bytes(result)
print(f"Applied C3 to {TARGET.relative_to(ROOT)} ({len(result)} bytes, sha256={actual_c3})")
