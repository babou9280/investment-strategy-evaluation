#!/usr/bin/env python3
"""Print concise generated-HTML context needed to implement C1 safely."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "app" / "Breaktest_Studio.html"
lines = HTML.read_text(encoding="utf-8").splitlines()

def show_range(title, start_line, end_line):
    print(f"\n===== {title} =====")
    for line_number in range(start_line - 1, min(end_line, len(lines))):
        print(f"{line_number + 1:05d}: {lines[line_number]}")

show_range("Position sizing", 1635, 1668)
show_range("Trade evaluation", 1801, 1863)
show_range("C2/C3 replay pipeline", 1998, 2102)
show_range("Capital Fit render", 2408, 2440)
