from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ENGINE = ROOT / "cost_gate_model_vnext" / "survival_surface.js"
CONTRACT = ROOT / "docs" / "standards" / "COST_SURVIVAL_SURFACE_CONTRACT.md"
MATRIX = ROOT / "docs" / "scenarios" / "COST_SURVIVAL_SURFACE_V1_MATRIX.md"
REVIEW = ROOT / "docs" / "review" / "COST_GATE_MODEL_VNEXT_HOSTILE_REVIEW.md"

for required in (ENGINE, CONTRACT, MATRIX, REVIEW):
    if not required.is_file():
        raise SystemExit(f"Missing Cost Survival Surface authority: {required.relative_to(ROOT)}")

engine = ENGINE.read_text(encoding="utf-8")
contract = CONTRACT.read_text(encoding="utf-8")
matrix = MATRIX.read_text(encoding="utf-8")
review = REVIEW.read_text(encoding="utf-8")

for token in (
    "cost-survival-surface-engine-1-synthetic",
    "linear-ledger-sensitivity-1",
    "at_threshold_no_positive_margin",
    "edge_capacity_not_modelled",
    "component_cost_scenarios_not_joint_distribution",
    "discrete_profile_no_interpolation",
):
    if token not in engine:
        raise SystemExit(f"Surface engine is missing guardrail: {token}")

for forbidden in ("fetch(", "XMLHttpRequest", "WebSocket", "navigator.sendBeacon"):
    if forbidden in engine:
        raise SystemExit(f"Surface engine must remain local-only: {forbidden}")

for forbidden_model in ("almgren", "fillProbability", "recommendedLimitPrice", "bestSize"):
    if forbidden_model.lower() in engine.lower():
        raise SystemExit(f"Unsupported optimizer or execution model leaked into surface: {forbidden_model}")

for token in (
    "Séparation snapshot / projection",
    "Produit cartésien obligatoire",
    "Aucune interpolation",
    "notional_only_not_executable",
):
    if token not in contract:
        raise SystemExit(f"Surface contract is missing guardrail: {token}")

for index in range(1, 31):
    code = f"CSS-{index:02d}"
    if matrix.count(f"### {code} —") != 1:
        raise SystemExit(f"Frozen surface scenario missing or duplicated: {code}")

for token in (
    "ne possède aucun domaine de taille",
    "produit cartésien",
    "l'avantage peut diminuer avec la capacité",
):
    if token not in review:
        raise SystemExit(f"Hostile review is missing material finding: {token}")

print("Cost Survival Surface v1 static integrity: PASS")
