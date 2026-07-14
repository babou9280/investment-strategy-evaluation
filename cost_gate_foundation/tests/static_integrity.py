from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / "engine.js"
TESTS = ROOT / "tests"

required = [
    ENGINE,
    TESTS / "fixtures.js",
    TESTS / "engine.test.js",
    TESTS / "scenario_matrix.test.js",
    TESTS / "properties.test.js",
]

for path in required:
    if not path.is_file():
        raise SystemExit(f"Missing Cost Gate foundation file: {path.relative_to(ROOT.parent)}")

engine = ENGINE.read_text(encoding="utf-8")

forbidden = {
    "network URL": r"https?://",
    "fetch": r"\bfetch\s*\(",
    "XHR": r"XMLHttpRequest",
    "WebSocket": r"\bWebSocket\b",
    "EventSource": r"\bEventSource\b",
    "persistent browser storage": r"localStorage|sessionStorage|indexedDB|document\.cookie",
    "process spawning": r"child_process",
    "network module": r"require\(['\"](?:http|https|net|tls|dgram|dns)['\"]\)",
    "filesystem module": r"require\(['\"]fs['\"]\)",
    "nondeterministic clock": r"Date\.now\s*\(|new\s+Date\s*\(\s*\)",
    "randomness": r"Math\.random\s*\(|randomUUID\s*\("
}

for label, pattern in forbidden.items():
    if re.search(pattern, engine):
        raise SystemExit(f"Forbidden {label} capability in Cost Gate foundation engine")

requires = re.findall(r"require\(['\"]([^'\"]+)['\"]\)", engine)
allowed_requires = {"crypto", "../capital_efficiency_lab/engine.js"}
if set(requires) != allowed_requires:
    raise SystemExit(f"Unexpected engine dependencies: {requires}")

required_tokens = [
    "cost-gate-foundation-1-synthetic",
    "cost-gate-findings-2",
    "cost-gate-snapshot-2",
    "cost-gate-findings-catalog-2",
    "cash_account",
    "long_cash_purchase",
    "unsupported_scope",
    "findings",
    "snapshotContentHash",
    "capitalFeasibilityCashEur",
    "no_incompatibility_detected_under_assumptions",
    "edge_not_surviving_modelled_friction",
    "operation_scope_side_count_mismatch",
    "synthetic_or_manual_only",
    "no_market_data_claim",
    "no_execution",
    "no_recommendation",
]

for token in required_tokens:
    if token not in engine:
        raise SystemExit(f"Missing required Cost Gate foundation token: {token}")

scenario_test = (TESTS / "scenario_matrix.test.js").read_text(encoding="utf-8")
scenario_ids = set(re.findall(r"id:\s*'(CG-\d{2})'", scenario_test))
expected_ids = {f"CG-{index:02d}" for index in range(1, 19)}
if scenario_ids != expected_ids:
    raise SystemExit(f"Scenario coverage mismatch: {sorted(scenario_ids)}")

total_bytes = sum(path.stat().st_size for path in required)
print(
    "Cost Gate foundation static integrity passed: "
    f"{len(required)} local files, {total_bytes} bytes, no network or persistence capability"
)
