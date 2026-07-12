#!/usr/bin/env python3
"""Apply the reviewed C2 temporal-isolation patch to the H1 HTML."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "app" / "Breaktest_Studio.html"
PATCH = ROOT / "scripts" / "patches" / "c2_portfolio.js"
REPLACEMENTS = ROOT / "scripts" / "patches" / "c2_replacements.json"
H1_SHA256 = "f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c"
C2_SHA256 = "e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454"
C2_SIZE = 138_887
BLOCK_START = "function selectReplayTrades(trades, sample) {"
BLOCK_END = "function breakEvenCapital(trade, model, config = {}, maximum = 10_000_000) {"


def digest(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"Expected exactly one {label}, found {count}")
    return source.replace(old, new, 1)


payload = TARGET.read_bytes()
actual_h1 = digest(payload)
if actual_h1 != H1_SHA256:
    raise SystemExit(f"H1 input SHA-256 mismatch: expected {H1_SHA256}, got {actual_h1}")
html = payload.decode("utf-8")
start = html.find(BLOCK_START)
end = html.find(BLOCK_END, start)
if start < 0 or end < 0 or html.find(BLOCK_START, start + 1) >= 0:
    raise SystemExit("Unable to locate the unique C2 evaluation block")
html = html[:start] + PATCH.read_text(encoding="utf-8") + html[end:]
for item in json.loads(REPLACEMENTS.read_text(encoding="utf-8")):
    html = replace_once(html, item["old"], item["new"], item["label"])
result = html.encode("utf-8")
actual_c2 = digest(result)
if len(result) != C2_SIZE or actual_c2 != C2_SHA256:
    raise SystemExit(
        f"C2 output mismatch: expected {C2_SIZE} bytes/{C2_SHA256}, "
        f"got {len(result)} bytes/{actual_c2}"
    )
TARGET.write_bytes(result)
print(f"Applied C2 to {TARGET.relative_to(ROOT)} ({len(result)} bytes, sha256={actual_c2})")
