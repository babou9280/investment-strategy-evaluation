#!/usr/bin/env python3
from pathlib import Path
import base64, gzip, hashlib

ROOT = Path(__file__).resolve().parents[1]
PARTS = sorted((ROOT / "app" / ".bundle").glob("Breaktest_Studio.html.gz.b64.part*"))
TARGET = ROOT / "app" / "Breaktest_Studio.html"
EXPECTED_SHA256 = "5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00"

if not PARTS:
    raise SystemExit("No Breaktest bundle parts found")
encoded = "".join(part.read_text(encoding="ascii").strip() for part in PARTS)
try:
    payload = gzip.decompress(base64.b64decode(encoded, validate=True))
except Exception as exc:
    raise SystemExit(f"Unable to decode Breaktest bundle: {exc}") from exc
actual = hashlib.sha256(payload).hexdigest()
if actual != EXPECTED_SHA256:
    raise SystemExit(f"SHA-256 mismatch: expected {EXPECTED_SHA256}, got {actual}")
TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_bytes(payload)
print(f"Materialized {TARGET.relative_to(ROOT)} ({len(payload)} bytes, sha256={actual})")
