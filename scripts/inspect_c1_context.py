#!/usr/bin/env python3
"""Print concise generated-HTML context needed to implement C1 safely."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"
lines = HTML.read_text(encoding="utf-8").splitlines()

for line_number in range(500 - 1, min(548, len(lines))):
    print(f"{line_number + 1:05d}: {lines[line_number]}")
