#!/usr/bin/env python3
"""Build the current audited Breaktest HTML from immutable source and reviewed patches."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
for script in ("materialize_breaktest.py", "apply_c2_patch.py", "apply_c3_patch.py", "apply_c1_patch.py", "apply_c4_patch.py", "apply_h2_patch.py"):
    subprocess.run([sys.executable, str(ROOT / "scripts" / script)], cwd=ROOT, check=True)
