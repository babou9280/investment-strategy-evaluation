#!/usr/bin/env python3
"""Static offline, provenance, and build-source integrity checks."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT.parent
SOURCE = PROJECT / "src"
PACKAGE = PROJECT / "dist" / "breaktest-cost-gate-gate1"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


required_sources = [
    SOURCE / "index.html",
    SOURCE / "styles.css",
    SOURCE / "crypto-shim.js",
    SOURCE / "scenario.js",
    SOURCE / "presenter.js",
    SOURCE / "app.js",
    SOURCE / "README.html",
    PROJECT / "build.py",
]
for path in required_sources:
    assert path.is_file(), f"Missing source: {path}"

assert PACKAGE.is_dir(), "Build the package before static integrity checks"
manifest = json.loads((PACKAGE / "MANIFEST.json").read_text(encoding="utf-8"))
assert manifest["status"] == "internal_review"
assert manifest["validated_capabilities"] == []
assert "no_user_validation_yet" in manifest["known_limits"]

runtime_files = [
    PACKAGE / "index.html",
    PACKAGE / "README.html",
    PACKAGE / "assets" / "engine-bundle.js",
    PACKAGE / "assets" / "scenario.js",
    PACKAGE / "assets" / "presenter.js",
    PACKAGE / "assets" / "app.js",
    PACKAGE / "assets" / "styles.css",
]
runtime_text = "\n".join(path.read_text(encoding="utf-8") for path in runtime_files)
for pattern in [
    r"https?://",
    r"\bfetch\s*\(",
    r"XMLHttpRequest",
    r"\bWebSocket\b",
    r"\bEventSource\b",
    r"sendBeacon",
    r"\blocalStorage\b",
    r"\bsessionStorage\b",
    r"\bindexedDB\b",
    r"<iframe\b",
    r"@import\s+url",
]:
    assert not re.search(pattern, runtime_text, flags=re.I), f"Forbidden offline capability: {pattern}"

index = (PACKAGE / "index.html").read_text(encoding="utf-8")
for asset in re.findall(r"(?:src|href)=\"([^\"]+)\"", index):
    if asset.startswith("#"):
        continue
    assert not re.match(r"(?:[a-z]+:)?//", asset, flags=re.I), f"Remote asset: {asset}"
    assert (PACKAGE / asset).is_file(), f"Missing relative asset: {asset}"

text_inputs = re.findall(r"<input\b[^>]*type=\"text\"[^>]*>", (SOURCE / "index.html").read_text(encoding="utf-8"), flags=re.I)
assert text_inputs, "No manual numeric inputs found"
for element in text_inputs:
    assert not re.search(r"\bvalue=", element, flags=re.I), f"Financial value prefilled: {element}"

assert "Aucune hypothèse ne couvre les frictions" not in runtime_text
assert "Aucune marge positive ne subsiste après les frictions modélisées" in runtime_text
assert "Ce résultat n’est ni une recommandation, ni une autorisation d’ordre, ni une prévision." in runtime_text
assert "Démonstration synthétique modifiée" in runtime_text
assert "L’ancien résultat a été masqué" in runtime_text
assert "resultContent.replaceChildren()" in runtime_text

component_hashes = {item["path"]: item["sha256"] for item in manifest["source_components"]}
assert component_hashes["capital_efficiency_lab/engine.js"] == sha256(ROOT / "capital_efficiency_lab" / "engine.js")
assert component_hashes["cost_gate_foundation/engine.js"] == sha256(ROOT / "cost_gate_foundation" / "engine.js")
assert component_hashes["cost_gate_critique/src/crypto-shim.js"] == sha256(SOURCE / "crypto-shim.js")

assert "cost-gate-foundation-3-synthetic" in (PACKAGE / "assets" / "engine-bundle.js").read_text(encoding="utf-8")
assert "@@" not in runtime_text
assert "NaN" not in (PACKAGE / "index.html").read_text(encoding="utf-8")

print(f"Cost Gate critique static integrity passed: {len(runtime_files) + 1} package files, offline and source-bound")
