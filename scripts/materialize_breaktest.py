#!/usr/bin/env python3
from pathlib import Path
import base64
import gzip
import hashlib

ROOT = Path(__file__).resolve().parents[1]
BUNDLE_DIR = ROOT / "app" / ".bundle"
PARTS = sorted(BUNDLE_DIR.glob("payload.part*"))
TARGET = ROOT / "app" / "Breaktest_Studio.html"
EXPECTED_PART_COUNT = 7
EXPECTED_ENCODED_LENGTH = 41_356
EXPECTED_SIZE = 132_899
EXPECTED_SHA256 = "5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00"

if len(PARTS) != EXPECTED_PART_COUNT:
    raise SystemExit(
        f"Incomplete Breaktest bundle: expected {EXPECTED_PART_COUNT} parts, got {len(PARTS)}"
    )

encoded = "".join(part.read_text(encoding="ascii").strip() for part in PARTS)
if len(encoded) != EXPECTED_ENCODED_LENGTH:
    raise SystemExit(
        f"Encoded bundle length mismatch: expected {EXPECTED_ENCODED_LENGTH}, got {len(encoded)}"
    )

try:
    payload = gzip.decompress(base64.b64decode(encoded, validate=True))
except Exception as exc:
    raise SystemExit(f"Unable to decode Breaktest bundle: {exc}") from exc

actual_size = len(payload)
actual_sha256 = hashlib.sha256(payload).hexdigest()
if actual_size != EXPECTED_SIZE:
    raise SystemExit(f"Size mismatch: expected {EXPECTED_SIZE}, got {actual_size}")
if actual_sha256 != EXPECTED_SHA256:
    raise SystemExit(
        f"SHA-256 mismatch: expected {EXPECTED_SHA256}, got {actual_sha256}"
    )

TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_bytes(payload)
print(
    f"Materialized {TARGET.relative_to(ROOT)} "
    f"({actual_size} bytes, sha256={actual_sha256})"
)
