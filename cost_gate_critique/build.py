#!/usr/bin/env python3
"""Build the exact offline Gate 1 internal-review package."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import stat
import subprocess
import zipfile
from pathlib import Path


DELIVERABLE_VERSION = "cost-gate-gate1-internal-review-1"
PACKAGE_NAME = "breaktest-cost-gate-gate1"
STANDALONE_NAME = "Breaktest_Cost_Gate_Gate_1.html"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def read_utf8(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_utf8(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8", newline="\n")


def module_wrapper(module_id: str, source: str) -> str:
    return (
        f"  define({json.dumps(module_id)}, function (module, exports, require) {{\n"
        f"{source.rstrip()}\n"
        "  });\n"
    )


def build_engine_bundle(repo_root: Path, source_dir: Path) -> tuple[str, list[dict[str, str]]]:
    sources = [
        ("crypto", source_dir / "crypto-shim.js", "cost_gate_critique/src/crypto-shim.js"),
        (
            "../capital_efficiency_lab/engine.js",
            repo_root / "capital_efficiency_lab" / "engine.js",
            "capital_efficiency_lab/engine.js",
        ),
        (
            "cost_gate_foundation/engine.js",
            repo_root / "cost_gate_foundation" / "engine.js",
            "cost_gate_foundation/engine.js",
        ),
    ]
    component_hashes = []
    modules = []
    for module_id, path, display_path in sources:
        data = path.read_bytes()
        component_hashes.append({"path": display_path, "sha256": sha256_bytes(data)})
        modules.append(module_wrapper(module_id, data.decode("utf-8")))

    runtime = """(function (root) {
  'use strict';
  const definitions = Object.create(null);
  const cache = Object.create(null);
  function define(id, factory) { definitions[id] = factory; }
  function load(id) {
    if (cache[id]) return cache[id].exports;
    if (!definitions[id]) throw new Error('offline_module_missing:' + id);
    const module = { exports: {} };
    cache[id] = module;
    definitions[id](module, module.exports, load);
    return module.exports;
  }
"""
    runtime += "".join(modules)
    runtime += """  root.BreaktestCostGate = load('cost_gate_foundation/engine.js');
  root.BreaktestCostGateBundle = Object.freeze({
    engineVersion: root.BreaktestCostGate.VERSION,
    capitalEfficiencyVersion: root.BreaktestCapitalEfficiency.VERSION
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
"""
    return runtime, component_hashes


def replace_tokens(value: str, tokens: dict[str, str]) -> str:
    for token, replacement in tokens.items():
        value = value.replace(f"@@{token}@@", replacement)
    leftovers = re.findall(r"@@[A-Z_]+@@", value)
    if leftovers:
        raise ValueError(f"Unreplaced template tokens: {sorted(set(leftovers))}")
    return value


def safe_inline_script(value: str) -> str:
    return re.sub(r"</script", r"<\\/script", value, flags=re.IGNORECASE)


def deterministic_zip(package_dir: Path, zip_path: Path) -> None:
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(item for item in package_dir.rglob("*") if item.is_file()):
            relative = path.relative_to(package_dir).as_posix()
            info = zipfile.ZipInfo(relative, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            archive.writestr(info, path.read_bytes())


def validate_args(args: argparse.Namespace) -> None:
    if args.source_commit != "WORKTREE" and not re.fullmatch(r"[0-9a-f]{40}", args.source_commit):
        raise SystemExit("--source-commit must be WORKTREE or a 40-character lowercase SHA")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z", args.generated_at):
        raise SystemExit("--generated-at must be an explicit UTC timestamp such as 2026-07-15T12:00:00Z")
    if not args.browser_under_test.strip():
        raise SystemExit("--browser-under-test must identify the actual browser target")


def validate_source_commit(repo_root: Path, source_commit: str) -> None:
    if source_commit == "WORKTREE":
        return
    try:
        actual = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            cwd=repo_root,
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()
    except (OSError, subprocess.CalledProcessError) as error:
        raise SystemExit("Cannot verify --source-commit against the checked-out repository") from error
    if actual != source_commit:
        raise SystemExit(f"--source-commit {source_commit} does not match checked-out HEAD {actual}")


def clear_previous_package(package_dir: Path, zip_path: Path, standalone_path: Path) -> None:
    if package_dir.is_symlink() or package_dir.is_file():
        package_dir.unlink()
    elif package_dir.is_dir():
        shutil.rmtree(package_dir)
    if zip_path.exists() or zip_path.is_symlink():
        zip_path.unlink()
    if standalone_path.exists() or standalone_path.is_symlink():
        standalone_path.unlink()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-commit", required=True)
    parser.add_argument("--generated-at", required=True)
    parser.add_argument("--browser-under-test", required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    validate_args(args)

    project_dir = Path(__file__).resolve().parent
    repo_root = project_dir.parent
    source_dir = project_dir / "src"
    dist_dir = (args.output or (project_dir / "dist")).resolve()
    package_dir = dist_dir / PACKAGE_NAME
    zip_path = dist_dir / f"{PACKAGE_NAME}-internal-review.zip"
    standalone_path = dist_dir / STANDALONE_NAME
    validate_source_commit(repo_root, args.source_commit)
    clear_previous_package(package_dir, zip_path, standalone_path)
    (package_dir / "assets").mkdir(parents=True)

    tokens = {
        "SOURCE_COMMIT": args.source_commit,
        "GENERATED_AT": args.generated_at,
        "DELIVERABLE_VERSION": DELIVERABLE_VERSION,
        "BROWSER_UNDER_TEST": args.browser_under_test.strip(),
    }

    engine_bundle, component_hashes = build_engine_bundle(repo_root, source_dir)
    tokens.update(
        {
            "INLINE_STYLES": read_utf8(source_dir / "styles.css"),
            "INLINE_ENGINE_BUNDLE": safe_inline_script(engine_bundle),
            "INLINE_SCENARIO": safe_inline_script(read_utf8(source_dir / "scenario.js")),
            "INLINE_PRESENTER": safe_inline_script(read_utf8(source_dir / "presenter.js")),
            "INLINE_APP": safe_inline_script(read_utf8(source_dir / "app.js")),
        }
    )
    write_utf8(package_dir / "assets" / "engine-bundle.js", engine_bundle)
    for name in ["scenario.js", "presenter.js", "app.js", "styles.css"]:
        write_utf8(package_dir / "assets" / name, read_utf8(source_dir / name))
    built_index = replace_tokens(read_utf8(source_dir / "index.html"), tokens)
    write_utf8(package_dir / "index.html", built_index)
    write_utf8(standalone_path, built_index)
    write_utf8(package_dir / "README.html", replace_tokens(read_utf8(source_dir / "README.html"), tokens))

    package_files = []
    for path in sorted(item for item in package_dir.rglob("*") if item.is_file()):
        package_files.append(
            {
                "path": path.relative_to(package_dir).as_posix(),
                "bytes": path.stat().st_size,
                "sha256": sha256_file(path),
            }
        )

    manifest = {
        "schema_version": 1,
        "name": "Breaktest Cost Gate — Gate 1 offline critique",
        "deliverable_version": DELIVERABLE_VERSION,
        "status": "internal_review",
        "source_commit": args.source_commit,
        "generated_at_utc": args.generated_at,
        "entrypoint": "index.html",
        "standalone_artifact": {
            "path": STANDALONE_NAME,
            "identical_to": "index.html",
            "sha256": sha256_file(standalone_path),
        },
        "browser_under_test": args.browser_under_test.strip(),
        "browser_claim": "Target recorded; success requires the external exact-run evidence that tested this unchanged package.",
        "viewport_targets_px": [390, 768, 1024, 1440],
        "engine_versions": {
            "cost_gate": "cost-gate-foundation-3-synthetic",
            "capital_efficiency": "capital-efficiency-lab-4-optional-annual",
            "scenario_adapter": "cost-gate-critique-scenario-1",
            "presenter": "cost-gate-critique-presenter-1",
        },
        "source_components": component_hashes,
        "files": package_files,
        "manifest_self_hash_excluded": True,
        "validated_capabilities": [],
        "known_limits": [
            "synthetic_or_manual_only",
            "no_market_data_claim",
            "no_execution",
            "no_recommendation",
            "no_user_validation_yet",
            "no_commercial_or_legal_validation",
            "safari_ipad_not_claimed",
        ],
    }
    write_utf8(package_dir / "MANIFEST.json", json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")

    deterministic_zip(package_dir, zip_path)
    total_bytes = sum(path.stat().st_size for path in package_dir.rglob("*") if path.is_file())
    print(f"Built {package_dir}")
    print(f"Package files: {len(package_files) + 1}")
    print(f"Package bytes: {total_bytes}")
    print(f"Archive: {zip_path}")
    print(f"Archive SHA-256: {sha256_file(zip_path)}")
    print(f"Standalone: {standalone_path}")
    print(f"Standalone SHA-256: {sha256_file(standalone_path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
