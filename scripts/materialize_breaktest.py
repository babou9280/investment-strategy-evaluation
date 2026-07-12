#!/usr/bin/env python3
"""Materialize the audited Breaktest HTML and apply the reviewed H1 patch.

The immutable bundle is the exact v0.2 source. The transformation is deliberately
marker-based and fails closed if the expected source blocks are absent or duplicated.
"""
from pathlib import Path
import base64
import gzip
import hashlib

ROOT = Path(__file__).resolve().parents[1]
PARTS = sorted((ROOT / "app" / ".bundle").glob("payload.part*"))
TARGET = ROOT / "app" / "Breaktest_Studio.html"
SOURCE_SHA256 = "5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00"
TARGET_SHA256 = "f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c"
EXPECTED_PARTS = 7

NORMALIZATION_START = "function numeric(value, fallback = 0) {"
NORMALIZATION_END = "function positionForTrade(trade, config = {}) {"
NEW_NORMALIZATION = r'''class TradeValidationError extends Error {
  constructor(index, field, status) {
    const row = index + 1;
    const label = status === "missing" ? "manquant" : "invalide";
    super(`Ligne ${row} : ${field} ${label}.`);
    this.name = "TradeValidationError";
    this.row = row;
    this.field = field;
    this.status = status;
  }
}

class TradeBatchValidationError extends Error {
  constructor(errors) {
    const first = errors[0];
    const suffix = errors.length > 1 ? ` (+${errors.length - 1} autre${errors.length > 2 ? "s" : ""} erreur${errors.length > 2 ? "s" : ""})` : "";
    super(`Import refusé — ${first.message}${suffix}`);
    this.name = "TradeBatchValidationError";
    this.errors = errors;
  }
}

function numericState(value) {
  if (value === null || value === undefined) return { status: "missing", value: null };
  if (typeof value === "string" && value.trim() === "") return { status: "missing", value: null };
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? { status: "valid", value: parsed }
    : { status: "invalid", value: null };
}

function firstNumericSource(raw, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      const state = numericState(raw[key]);
      if (state.status !== "missing") return { ...state, key };
    }
  }
  return { status: "missing", value: null, key: keys[0] };
}

function requiredNumeric(raw, keys, index, field) {
  const source = firstNumericSource(raw, keys);
  if (source.status !== "valid") throw new TradeValidationError(index, field, source.status);
  return source.value;
}

function numeric(value, fallback = 0) {
  const state = numericState(value);
  return state.status === "valid" ? state.value : fallback;
}

function normalizedRate(value, fallback = 0) {
  const rate = numeric(value, fallback);
  return Math.abs(rate) > 2 ? rate / 100 : rate;
}

function normalizeTrade(raw, index = 0) {
  const invested = requiredNumeric(raw, ["invested_eur", "invested", "position_size"], index, "invested_eur");
  if (!(invested > 0)) throw new TradeValidationError(index, "invested_eur", "invalid");

  const grossPnlSource = firstNumericSource(raw, ["gross_pnl_eur", "gross_pnl", "pnl_eur", "pnl"]);
  const grossReturnSource = numericState(raw.gross_return);
  if (grossPnlSource.status === "invalid") throw new TradeValidationError(index, "gross_pnl_eur", "invalid");
  if (grossReturnSource.status === "invalid") throw new TradeValidationError(index, "gross_return", "invalid");
  if (grossPnlSource.status === "missing" && grossReturnSource.status === "missing") {
    throw new TradeValidationError(index, "gross_return ou gross_pnl_eur", "missing");
  }
  const normalizedGrossReturn = grossReturnSource.status === "valid"
    ? (Math.abs(grossReturnSource.value) > 2 ? grossReturnSource.value / 100 : grossReturnSource.value)
    : null;
  const grossPnl = grossPnlSource.status === "valid"
    ? grossPnlSource.value
    : invested * normalizedGrossReturn;
  const grossReturn = normalizedGrossReturn ?? grossPnl / invested;

  const entryPrice = Math.max(0, numeric(raw.entry_price_eur ?? raw.entry_price_usd ?? raw.entry_price));
  const dailyVolatility = Math.max(0, normalizedRate(raw.daily_volatility ?? raw.volatility_daily, 0));
  return {
    id: raw.id || `${raw.sample || "sample"}-${raw.ticker || raw.symbol || "trade"}-${index}`,
    sample: String(raw.sample || "import").trim().toLowerCase(),
    strategy: String(raw.strategy || "Non classé").trim(),
    ticker: String(raw.ticker || raw.symbol || `Trade ${index + 1}`).trim().toUpperCase(),
    company: String(raw.company || "").trim(),
    sector: String(raw.sector || "Non classé").trim(),
    setup: String(raw.signal_type || raw.setup || "Non classé").trim(),
    entryDate: String(raw.entry_date || raw.signal_date || "").trim(),
    exitDate: String(raw.exit_date || raw.entry_date || "").trim(),
    invested,
    grossPnl,
    grossReturn,
    grossPnlDerived: grossPnlSource.status === "missing",
    grossReturnDerived: grossReturnSource.status === "missing",
    entryPrice,
    dailyVolatility,
    advEur: Math.max(0, numeric(raw.adv_eur ?? raw.average_daily_volume_eur ?? raw.adv, 0)),
    source: raw,
  };
}

function normalizeTrades(rows) {
  const trades = [];
  const errors = [];
  rows.forEach((raw, index) => {
    try {
      trades.push(normalizeTrade(raw, index));
    } catch (error) {
      if (!(error instanceof TradeValidationError)) throw error;
      errors.push(error);
    }
  });
  if (errors.length) throw new TradeBatchValidationError(errors);
  return trades;
}

'''

OLD_IMPORT_CATCH = '''  } catch (error) {
    console.error(error);
    showToast("Impossible de lire ce CSV. Vérifiez les colonnes et le séparateur.");
  } finally {'''
NEW_IMPORT_CATCH = '''  } catch (error) {
    console.error(error);
    showToast(error instanceof TradeBatchValidationError
      ? error.message
      : "Impossible de lire ce CSV. Vérifiez les colonnes et le séparateur.");
  } finally {'''


def sha256(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"Expected exactly one {label} block, found {count}")
    return source.replace(old, new, 1)


if len(PARTS) != EXPECTED_PARTS:
    raise SystemExit(f"Expected {EXPECTED_PARTS} Breaktest bundle parts, found {len(PARTS)}")
encoded = "".join(part.read_text(encoding="ascii").strip() for part in PARTS)
try:
    source_payload = gzip.decompress(base64.b64decode(encoded, validate=True))
except Exception as exc:
    raise SystemExit(f"Unable to decode Breaktest bundle: {exc}") from exc
source_hash = sha256(source_payload)
if source_hash != SOURCE_SHA256:
    raise SystemExit(f"Source SHA-256 mismatch: expected {SOURCE_SHA256}, got {source_hash}")

html = source_payload.decode("utf-8")
start = html.find(NORMALIZATION_START)
end = html.find(NORMALIZATION_END, start)
if start < 0 or end < 0 or html.find(NORMALIZATION_START, start + 1) >= 0:
    raise SystemExit("Unable to locate the unique H1 normalization block")
html = html[:start] + NEW_NORMALIZATION + html[end:]
html = replace_once(html, OLD_IMPORT_CATCH, NEW_IMPORT_CATCH, "CSV import error handler")

target_payload = html.encode("utf-8")
target_hash = sha256(target_payload)
if target_hash != TARGET_SHA256:
    raise SystemExit(f"Target SHA-256 mismatch: expected {TARGET_SHA256}, got {target_hash}")
TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_bytes(target_payload)
print(
    f"Materialized {TARGET.relative_to(ROOT)} "
    f"({len(target_payload)} bytes, source_sha256={source_hash}, target_sha256={target_hash})"
)
