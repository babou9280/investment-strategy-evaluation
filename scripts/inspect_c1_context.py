#!/usr/bin/env python3
"""Print concise generated-HTML context needed to implement C1 safely."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"
lines = HTML.read_text(encoding="utf-8").splitlines()
markers = [
    "function applyTurnoverBudget",
    "const turnover =",
    "keptTurnoverAverageAnnual",
    "function selectReplayTrades",
    "function evaluateSample",
    "mini-turnover",
]

for marker in markers:
    indexes = [index for index, line in enumerate(lines) if marker in line]
    print(f"\n===== {marker} ({len(indexes)} occurrence(s)) =====")
    for occurrence, index in enumerate(indexes, start=1):
        lo = max(0, index - 7)
        hi = min(len(lines), index + 15)
        print(f"--- occurrence {occurrence}, generated line {index + 1} ---")
        for line_number in range(lo, hi):
            print(f"{line_number + 1:05d}: {lines[line_number]}")
