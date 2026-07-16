from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ENGINE = ROOT / "cost_gate_model_vnext" / "ledger.js"
CONTRACT = ROOT / "docs" / "standards" / "COST_LEDGER_CONTRACT.md"
MATRIX = ROOT / "docs" / "scenarios" / "COST_LEDGER_V1_MATRIX.md"
ARCHITECTURE = ROOT / "docs" / "product" / "COST_GATE_MODEL_ARCHITECTURE_VNEXT.md"

for required in (ENGINE, CONTRACT, MATRIX, ARCHITECTURE):
    if not required.is_file():
        raise SystemExit(f"Missing Cost Ledger authority: {required.relative_to(ROOT)}")

engine = ENGINE.read_text(encoding="utf-8")
contract = CONTRACT.read_text(encoding="utf-8")
matrix = MATRIX.read_text(encoding="utf-8")
architecture = ARCHITECTURE.read_text(encoding="utf-8")

required_engine_tokens = (
    "cost-ledger-engine-1-synthetic",
    "cost-ledger-1",
    "economicEventId",
    "complete_under_declared_policy",
    "user_assumption_without_market_benchmark",
    "sensitivity_cannot_claim_coverage",
    "economic_event_identity_source_dependent",
)
for token in required_engine_tokens:
    if token not in engine:
        raise SystemExit(f"Cost Ledger engine is missing contract token: {token}")

for forbidden in ("fetch(", "XMLHttpRequest", "WebSocket", "navigator.sendBeacon"):
    if forbidden in engine:
        raise SystemExit(f"Cost Ledger engine must remain local-only: {forbidden}")

for forbidden_model in ("almgren", "squareRootImpact", "fillProbability", "recommendedLimitPrice"):
    if forbidden_model.lower() in engine.lower():
        raise SystemExit(f"Uncalibrated execution model leaked into Cost Ledger v1: {forbidden_model}")

for token in (
    "Une liste de composants ne prouve pas seule sa propre complétude",
    "economicEventId",
    "calculationStatus",
    "evidenceStatus",
    "temporalStatus",
    "Une fourchette de sensibilité n'est ni une distribution ni un intervalle de confiance",
):
    if token not in contract:
        raise SystemExit(f"Cost Ledger contract is missing guardrail: {token}")

for index in range(1, 36):
    code = f"CL-{index:02d}"
    if matrix.count(f"### {code} —") != 1:
        raise SystemExit(f"Frozen scenario missing or duplicated: {code}")

for token in (
    "complete_under_declared_policy",
    "economic_event_id",
    "qualité de preuve",
    "Le moteur ne peut pas deviner",
):
    if token not in architecture:
        raise SystemExit(f"vNext architecture is missing ledger separation: {token}")

print("Cost Ledger v1 static integrity: PASS")
