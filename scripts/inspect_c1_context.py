#!/usr/bin/env python3
"""Print narrowly scoped generated-HTML context needed to implement C1 safely."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"
text = HTML.read_text(encoding="utf-8")
markers = [
    "applyTurnoverBudget(",
    "const turnover =",
    "keptTurnoverAverageAnnual",
    "function selectReplayTrades",
    "function evaluateSample",
    "return {\n    sample,",
    "mini-turnover",
]
for marker in markers:
    print(f"\n===== {marker} =====")
    start = 0
    found = False
    while True:
        index = text.find(marker, start)
        if index < 0:
            break
        found = True
        lo = max(0, index - 700)
        hi = min(len(text), index + 1800)
        print(text[lo:hi])
        print("\n--- occurrence end ---")
        start = index + len(marker)
    if not found:
        print("<not found>")
