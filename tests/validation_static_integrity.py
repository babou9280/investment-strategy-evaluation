#!/usr/bin/env python3
"""Fail closed if the validation site gains an external integration or hidden persistence."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "validation_site"
ACTIVE_FILES = [
    SITE / "index.html",
    SITE / "styles.css",
    SITE / "config.js",
    SITE / "calculator.js",
    SITE / "app.js",
]


class AssetParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[tuple[str, str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = dict(attrs)
        for attr in ("src", "href"):
            value = attr_map.get(attr)
            if value:
                self.references.append((tag, attr, value.strip()))


def assert_local_reference(tag: str, attr: str, value: str) -> None:
    lower = value.lower()
    assert not lower.startswith(("http://", "https://", "//")), (tag, attr, value)
    assert not lower.startswith(("data:", "javascript:")), (tag, attr, value)
    if value.startswith("#"):
        return
    path = (SITE / value.split("?", 1)[0].split("#", 1)[0]).resolve()
    assert SITE.resolve() in path.parents or path == SITE.resolve(), value
    assert path.exists(), f"missing local asset: {value}"


def main() -> None:
    for path in ACTIVE_FILES:
        assert path.exists(), f"missing required file: {path.relative_to(ROOT)}"
        assert path.stat().st_size > 0, f"empty required file: {path.relative_to(ROOT)}"

    parser = AssetParser()
    html = (SITE / "index.html").read_text(encoding="utf-8")
    parser.feed(html)
    for reference in parser.references:
        assert_local_reference(*reference)

    active_text = "\n".join(path.read_text(encoding="utf-8") for path in ACTIVE_FILES)
    lowered = active_text.lower()

    prohibited_network = (
        r"\bfetch\s*\(",
        r"\bxmlhttprequest\b",
        r"\bwebsocket\b",
        r"\bsendbeacon\b",
        r"<iframe\b",
        r"https?://",
        r"src\s*=\s*[\"']//",
    )
    for pattern in prohibited_network:
        assert re.search(pattern, lowered) is None, f"prohibited external capability: {pattern}"

    prohibited_persistence = (
        r"\blocalstorage\b",
        r"\bsessionstorage\b",
        r"\bindexeddb\b",
        r"document\.cookie",
    )
    for pattern in prohibited_persistence:
        assert re.search(pattern, lowered) is None, f"prohibited persistence: {pattern}"

    secret_patterns = (
        r"-----begin [a-z ]*private key-----",
        r"\bsk_live_[a-z0-9]+",
        r"\bpk_live_[a-z0-9]+",
        r"\bghp_[a-z0-9]{20,}",
        r"\bapi[_-]?key\s*[:=]\s*[\"'][^\"']+[\"']",
    )
    for pattern in secret_patterns:
        assert re.search(pattern, active_text, flags=re.I) is None, f"possible secret: {pattern}"

    config = (SITE / "config.js").read_text(encoding="utf-8")
    required_disabled = (
        "analyticsEnabled: false",
        "emailEndpoint: null",
        "paymentEnabled: false",
        "paymentUrl: null",
        "publicBaseUrl: null",
    )
    for marker in required_disabled:
        assert marker in config, f"disabled integration marker missing: {marker}"

    assert "window.location.search" not in active_text
    assert "window.location.hash" not in active_text
    assert "history.pushState" not in active_text
    assert "history.replaceState" not in active_text

    total_bytes = sum(path.stat().st_size for path in ACTIVE_FILES)
    assert total_bytes <= 150_000, f"validation site exceeds 150 KB budget: {total_bytes} bytes"
    assert (SITE / "index.html").stat().st_size <= 50_000
    assert (SITE / "styles.css").stat().st_size <= 40_000
    assert (SITE / "calculator.js").stat().st_size <= 35_000
    assert (SITE / "app.js").stat().st_size <= 35_000

    print(f"Static integrity passed: {len(parser.references)} local references, {total_bytes} active bytes, no network or persistence capability")


if __name__ == "__main__":
    main()
