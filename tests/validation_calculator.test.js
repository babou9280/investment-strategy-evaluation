"use strict";
const assert = require("node:assert/strict");
const calc = require("../validation_site/calculator.js");

function approx(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);
}

function run(values, provenance) {
  const outcome = calc.calculate(values, provenance ? { provenance } : undefined);
  assert.equal(outcome.ok, true, JSON.stringify(outcome.errors));
  return outcome.result;
}

const scenario1 = run(calc.DEMO_SCENARIOS.small_round_trip.values, "synthetic_demo");
approx(scenario1.components.find((x) => x.key === "commission").costEur, 2);
approx(scenario1.components.find((x) => x.key === "fx").costEur, 0.5);
approx(scenario1.components.find((x) => x.key === "spread").costEur, 0.1);
approx(scenario1.components.find((x) => x.key === "slippage").costEur, 0.1);
approx(scenario1.totalCostPerOperationEur, 2.7);
approx(scenario1.costRatePerOperation, 0.027);
approx(scenario1.annualCostEur, 129.6);
approx(scenario1.annualCostToCapitalRate, 0.2592);
assert.equal(scenario1.components[0].provenance, "synthetic_demo");

const scenario2 = run(calc.DEMO_SCENARIOS.intermediate_round_trip.values);
approx(scenario2.totalCostPerOperationEur, 5.5);
approx(scenario2.costRatePerOperation, 0.011);
approx(scenario2.annualCostEur, 264);
approx(scenario2.annualCostToCapitalRate, 0.0528);

const scenario3 = run(calc.DEMO_SCENARIOS.monthly_eur_buy.values);
approx(scenario3.totalCostPerOperationEur, 1.3);
approx(scenario3.costRatePerOperation, 1.3 / 300);
approx(scenario3.annualCostEur, 15.6);
approx(scenario3.annualCostToCapitalRate, 0.00312);
assert.equal(scenario3.sideCount, 1);

const scenario4 = run(calc.DEMO_SCENARIOS.zero_commission_round_trip.values);
approx(scenario4.totalCostPerOperationEur, 7);
approx(scenario4.costRatePerOperation, 0.007);
approx(scenario4.annualCostEur, 168);
approx(scenario4.annualCostToCapitalRate, 0.0168);

for (const [amount, total, rate] of [[100, 2.2, 0.022], [500, 3, 0.006], [1000, 4, 0.004]]) {
  const scenario5 = run({
    capitalEur: 5000,
    orderAmountEur: amount,
    activityType: "round_trip",
    monthlyFrequency: 1,
    commissionPerSideEur: 1,
    fxPerConversionPercent: 0,
    spreadPercent: 0.1,
    slippagePercent: 0.1,
  });
  approx(scenario5.totalCostPerOperationEur, total);
  approx(scenario5.costRatePerOperation, rate);
}

const zero = run({ capitalEur: 1000, orderAmountEur: 100, activityType: "round_trip", monthlyFrequency: 0, commissionPerSideEur: 0, fxPerConversionPercent: 0, spreadPercent: 0, slippagePercent: 0 });
assert.equal(zero.totalCostPerOperationEur, 0);
assert.equal(zero.annualCostEur, 0);
assert.equal(zero.hasAnyFriction, false);
assert.equal(Object.is(zero.totalCostPerOperationEur, -0), false);

const noCapital = run({ capitalEur: "", orderAmountEur: 100, activityType: "single_buy", monthlyFrequency: 1, commissionPerSideEur: 1, fxPerConversionPercent: 0, spreadPercent: 0, slippagePercent: 0 });
assert.equal(noCapital.totalCostPerOperationEur, 1);
assert.equal(noCapital.annualCostToCapitalRate, null);

for (const invalid of ["abc", -1, "NaN", "Infinity", 0]) {
  const outcome = calc.calculate({ capitalEur: 1000, orderAmountEur: invalid, activityType: "round_trip", monthlyFrequency: 1, commissionPerSideEur: 1, fxPerConversionPercent: 0, spreadPercent: 0, slippagePercent: 0 });
  assert.equal(outcome.ok, false);
  assert.ok(outcome.errors.orderAmountEur);
}

const base = calc.DEMO_SCENARIOS.intermediate_round_trip.values;
const single = run(Object.assign({}, base, { activityType: "single_buy" }));
const round = run(Object.assign({}, base, { activityType: "round_trip" }));
approx(round.components.find((x) => x.key === "commission").costEur, 2 * single.components.find((x) => x.key === "commission").costEur);
approx(round.components.find((x) => x.key === "fx").costEur, 2 * single.components.find((x) => x.key === "fx").costEur);
approx(round.components.find((x) => x.key === "spread").costEur, single.components.find((x) => x.key === "spread").costEur);
approx(round.components.find((x) => x.key === "slippage").costEur, single.components.find((x) => x.key === "slippage").costEur);

const changedCapital = run(Object.assign({}, base, { capitalEur: 10000 }));
approx(changedCapital.totalCostPerOperationEur, scenario2.totalCostPerOperationEur);
approx(changedCapital.annualCostEur, scenario2.annualCostEur);
approx(changedCapital.annualCostToCapitalRate, scenario2.annualCostToCapitalRate / 2);

const changedFrequency = run(Object.assign({}, base, { monthlyFrequency: 2 }));
approx(changedFrequency.totalCostPerOperationEur, scenario2.totalCostPerOperationEur);
approx(changedFrequency.annualCostEur, scenario2.annualCostEur / 2);

const comparisons = calc.buildComparisons(scenario2);
approx(comparisons[1].result.inputs.orderAmountEur, 1000);
approx(comparisons[1].result.components.find((x) => x.key === "commission").costEur, 2);
approx(comparisons[2].result.totalCostPerOperationEur, scenario2.totalCostPerOperationEur);
approx(comparisons[2].result.annualCostEur, scenario2.annualCostEur / 2);

const payload = calc.buildSharePayload(scenario2);
assert.equal("capitalEur" in payload, false);
assert.equal(payload.annualCostToCapitalRate, null);
assert.equal("email" in payload, false);
const payloadWithCapital = calc.buildSharePayload(scenario2, { includeCapital: true });
assert.equal(payloadWithCapital.capitalEur, 5000);

for (const text of [calc.formatEur(-0), calc.formatPercent(-0), calc.shareText(zero)]) {
  assert.equal(/NaN|Infinity|-0/.test(text), false, text);
}
assert.equal(calc.CALCULATION_VERSION, "cost-intelligence-validation-1");
console.log("Cost Intelligence calculator tests passed");
