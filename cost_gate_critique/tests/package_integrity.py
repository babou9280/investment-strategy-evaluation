#!/usr/bin/env python3
"""Verify the exact package, archive, manifest, and deterministic rebuild."""

from __future__ import annotations

import hashlib
import json
import subprocess
import tempfile
import zipfile
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
DIST = PROJECT / "dist"
PACKAGE = DIST / "breaktest-cost-gate-gate1"
ARCHIVE = DIST / "breaktest-cost-gate-gate1-internal-review.zip"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


manifest_path = PACKAGE / "MANIFEST.json"
assert manifest_path.is_file()
assert ARCHIVE.is_file()
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

declared = {item["path"]: item for item in manifest["files"]}
actual = {
    path.relative_to(PACKAGE).as_posix(): path
    for path in PACKAGE.rglob("*")
    if path.is_file() and path.name != "MANIFEST.json"
}
assert set(declared) == set(actual), (set(declared) - set(actual), set(actual) - set(declared))
for relative, path in actual.items():
    assert declared[relative]["bytes"] == path.stat().st_size
    assert declared[relative]["sha256"] == sha256(path)

with zipfile.ZipFile(ARCHIVE) as archive:
    names = set(archive.namelist())
    expected = set(actual) | {"MANIFEST.json"}
    assert names == expected, (names - expected, expected - names)
    for name in expected:
        assert archive.read(name) == (PACKAGE / name).read_bytes(), name

with tempfile.TemporaryDirectory() as temporary:
    output = Path(temporary) / "rebuild"
    subprocess.run(
        [
            "python3",
            str(PROJECT / "build.py"),
            "--source-commit",
            manifest["source_commit"],
            "--generated-at",
            manifest["generated_at_utc"],
            "--browser-under-test",
            manifest["browser_under_test"],
            "--output",
            str(output),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
    )
    rebuilt = output / ARCHIVE.name
    assert sha256(rebuilt) == sha256(ARCHIVE), "Archive build is not deterministic"

assert (PACKAGE / manifest["entrypoint"]).is_file()
assert manifest["source_commit"] == "WORKTREE" or len(manifest["source_commit"]) == 40
print(f"Cost Gate critique package integrity passed: archive sha256:{sha256(ARCHIVE)}")
