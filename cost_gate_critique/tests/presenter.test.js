'use strict';

const assert = require('assert');
const engine = require('../../cost_gate_foundation/engine.js');
const fixtures = require('../../cost_gate_foundation/tests/fixtures.js');
const presenter = require('../src/presenter.js');

const provenance = { code: 'synthetic_demo', label: 'Démonstration synthétique', detail: 'Valeurs fictives.' };

function view(input) {
  const result = engine.compute(input);
  engine.assertFiniteTree(result);
  return { result, view: presenter.buildViewModel(result, provenance) };
}

const favorable = view(fixtures.baseInput());
assert.equal(favorable.view.summary.title, 'Aucune incompatibilité n’a été détectée dans les couches évaluées');
assert.match(favorable.view.recommendationWarning, /n’est ni une recommandation, ni une autorisation/);
assert.equal(favorable.view.findings.length, favorable.result.findings.length);
assert.ok(favorable.view.unassessedLayers.some((item) => item.code === 'data_quality'));
assert.ok(favorable.view.unassessedLayers.some((item) => item.code === 'execution_cost'));
assert.equal(favorable.view.metrics.find((item) => item.id === 'break-even').value.includes('1,10'), true);
assert.equal(favorable.view.edgeRows[0].rate.includes('0,90'), true);
assert.equal(favorable.view.edgeRows[0].eur.includes('4,50'), true);

const threshold = 0.011;
const exactPoint = view(fixtures.baseInput({ grossEdgeRate: threshold }));
assert.equal(exactPoint.view.summary.title, 'Aucune marge positive ne subsiste après les frictions modélisées');
assert.match(exactPoint.view.summary.description, /couvre exactement les frictions/);
assert.equal(exactPoint.view.edgeRows[0].rate.includes('0,00'), true);

const belowPoint = view(fixtures.baseInput({ grossEdgeRate: 0.009 }));
assert.equal(belowPoint.view.summary.title, 'L’avantage déclaré ne couvre pas entièrement les frictions modélisées');
assert.doesNotMatch(belowPoint.view.summary.description, /couvre exactement/);

const exactRange = view(fixtures.baseInput({
  grossEdgeRate: null,
  grossEdgeLowRate: threshold,
  grossEdgeBaseRate: threshold,
  grossEdgeHighRate: threshold
}));
assert.equal(exactRange.view.summary.title, 'Aucune marge positive ne subsiste après les frictions modélisées');
assert.equal(exactRange.view.edgeRows.length, 3);
exactRange.view.edgeRows.forEach((row) => {
  assert.equal(row.rate.includes('0,00'), true);
  assert.equal(row.eur.includes('0,00'), true);
});

const belowRange = view(fixtures.baseInput({
  grossEdgeRate: null,
  grossEdgeLowRate: 0.008,
  grossEdgeBaseRate: 0.009,
  grossEdgeHighRate: 0.01
}));
assert.equal(belowRange.view.summary.title, 'Aucune hypothèse ne produit de marge positive');
assert.doesNotMatch(belowRange.view.summary.description, /couvre exactement/);

const crossingRange = view(fixtures.baseInput({
  grossEdgeRate: null,
  grossEdgeLowRate: 0.008,
  grossEdgeBaseRate: 0.02,
  grossEdgeHighRate: 0.03
}));
assert.equal(crossingRange.view.summary.title, 'La fourchette traverse le seuil de couverture');

const structural = view(fixtures.baseInput({ grossEdgeRate: 0.007 }));
assert.equal(structural.view.summary.title, 'L’avantage déclaré ne dépasse pas le plancher variable');

const cash = view(fixtures.baseInput({ cash: { strategyCapitalEur: 400 } }));
assert.equal(cash.view.summary.title, 'Le cash déclaré ou l’allocation libre ne couvre pas l’engagement d’entrée');

const thresholdOnlyInput = fixtures.baseInput({ grossEdgeRate: null });
delete thresholdOnlyInput.grossEdgeAlignment;
const thresholdOnly = view(thresholdOnlyInput);
assert.equal(thresholdOnly.view.summary.title, 'Le seuil est calculé, mais l’avantage brut n’est pas évalué');

const tax = view(fixtures.baseInput({ cash: { entryTaxEur: 1 } }));
assert.equal(tax.view.summary.title, 'La friction complète n’est pas calculable avec les entrées actuelles');

const allText = [
  favorable.view.summary.title,
  exactPoint.view.summary.title,
  exactRange.view.summary.title,
  belowRange.view.summary.title
].join(' ');
assert.doesNotMatch(allText, /Aucune hypothèse ne couvre les frictions/);
assert.doesNotMatch(JSON.stringify(favorable.view), /Infinity|NaN|-0(?:\D|$)/);

console.log('Cost Gate critique presenter tests passed');
