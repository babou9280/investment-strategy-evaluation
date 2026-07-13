#!/usr/bin/env python3
"""Apply C4 realized-exit cash simulation after the reviewed C1 build."""
from pathlib import Path
import hashlib

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "app" / "Breaktest_Studio.html"
CAPITAL_PATCH = ROOT / "scripts" / "patches" / "c4_capital.js"
POINTS_PATCH = ROOT / "scripts" / "patches" / "c4_equity_points.js"
RENDER_PATCH = ROOT / "scripts" / "patches" / "c4_render_equity.js"
C1_SHA256 = "e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e"
C4_SHA256 = "ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af"
C4_SIZE = 158_682


def digest(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"Expected exactly one {label}, found {count}")
    return source.replace(old, new, 1)


def replace_block(source: str, start_marker: str, end_marker: str, replacement: str, label: str) -> str:
    start = source.find(start_marker)
    end = source.find(end_marker, start)
    if start < 0 or end < 0 or source.find(start_marker, start + 1) >= 0:
        raise SystemExit(f"Unable to locate unique {label} block")
    return source[:start] + replacement.rstrip() + source[end:]


payload = TARGET.read_bytes()
actual_c1 = digest(payload)
if actual_c1 != C1_SHA256:
    raise SystemExit(f"C1 input SHA-256 mismatch: expected {C1_SHA256}, got {actual_c1}")
html = payload.decode("utf-8")

html = replace_block(
    html,
    "function applyCapitalReservation(evaluations, config = {}) {",
    "\n\nfunction selectReplayTrades(trades, sample) {",
    CAPITAL_PATCH.read_text(encoding="utf-8"),
    "C1 capital reservation",
)
html = replace_once(
    html,
    "    capitalReservedAtEnd: capitalReservation.reservedAtEnd,\n  };",
    "    capitalReservedAtEnd: capitalReservation.reservedAtEnd,\n"
    "    realizedCapital: capitalReservation.realizedCapital,\n"
    "    realizedPnlTotal: capitalReservation.realizedPnlTotal,\n"
    "    realizedEvents: capitalReservation.realizedEvents,\n"
    "    realizedEquityCurve: capitalReservation.realizedEquityCurve,\n"
    "  };",
    "C4 result fields",
)
html = replace_block(
    html,
    "function equityCurve(evaluations, filtered = false, initialCapital = 1000) {",
    "\n\nfunction auditData(trades) {",
    POINTS_PATCH.read_text(encoding="utf-8"),
    "legacy non-temporal equity curve",
)
html = replace_block(
    html,
    "function renderEquityChart(result) {",
    "\n\nfunction renderCapitalSummary(result) {",
    RENDER_PATCH.read_text(encoding="utf-8"),
    "equity chart renderer",
)

replacements = [
    (
        '<div class="card-heading"><div><span class="eyebrow">REPLAY NET</span><h3>Capital après coûts réels</h3></div><div class="legend"><span><i class="line-base"></i>Tout prendre</span><span><i class="line-filter"></i>Capital Gate</span></div></div>',
        '<div class="card-heading"><div><span class="eyebrow">TRÉSORERIE RÉALISÉE</span><h3>Capital réalisé aux sorties</h3></div><div class="legend"><span><i class="line-filter"></i>Trades financés</span></div></div>',
        "realized curve heading",
    ),
    (
        '<svg id="capital-equity-chart" class="chart-svg" viewBox="0 0 760 330" role="img" aria-label="Capital net avec et sans filtre"></svg>',
        '<svg id="capital-equity-chart" class="chart-svg" viewBox="0 0 760 330" role="img" aria-label="Courbe de trésorerie réalisée aux dates de sortie"></svg>',
        "realized curve accessibility label",
    ),
    (
        '<div class="chart-caption"><span>Courbe événementielle</span><span id="equity-caption">20 trades live · capital initial 1 000 €</span></div>',
        '<div class="chart-caption"><span>Sorties agrégées par date · non mark-to-market</span><span id="equity-caption">20 trades live · capital initial 1 000 €</span></div>',
        "realized curve static caption",
    ),
    (
        '  byId("equity-caption").textContent = `${total} trades · capital initial ${fmtCapital(result.config.capital)} · courbe encore non temporelle`;',
        '  byId("equity-caption").textContent = `${result.realizedEquityCurve.length - 1} date${result.realizedEquityCurve.length > 2 ? "s" : ""} de sortie · capital réalisé ${fmtCapital(result.realizedCapital)} · non mark-to-market`;',
        "realized curve dynamic caption",
    ),
]
for old, new, label in replacements:
    html = replace_once(html, old, new, label)

result = html.encode("utf-8")
actual_c4 = digest(result)
if len(result) != C4_SIZE or actual_c4 != C4_SHA256:
    raise SystemExit(
        f"C4 output mismatch: expected {C4_SIZE} bytes/{C4_SHA256}, "
        f"got {len(result)} bytes/{actual_c4}"
    )
TARGET.write_bytes(result)
print(f"Applied C4 to {TARGET.relative_to(ROOT)} ({len(result)} bytes, sha256={actual_c4})")
