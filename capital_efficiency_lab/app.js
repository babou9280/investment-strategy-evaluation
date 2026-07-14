(function () {
  'use strict';

  const engine = window.BreaktestCapitalEfficiency;
  const form = document.getElementById('lab-form');
  const resultsEl = document.getElementById('results');
  const errorSummary = document.getElementById('error-summary');
  const live = document.getElementById('result-live');
  const constraintMode = document.getElementById('constraintMode');
  const submitButton = document.getElementById('submit-analysis');
  let provenance = 'user_assumption';

  const fields = {
    capitalEur: document.getElementById('capitalEur'),
    orderNotionalEur: document.getElementById('orderNotionalEur'),
    monthlyOperations: document.getElementById('monthlyOperations'),
    commissionPerSideEur: document.getElementById('commissionPerSideEur'),
    fxRatePerSidePercent: document.getElementById('fxRatePerSidePercent'),
    spreadTotalPercent: document.getElementById('spreadTotalPercent'),
    slippageTotalPercent: document.getElementById('slippageTotalPercent'),
    grossEdgePercent: document.getElementById('grossEdgePercent'),
    grossEdgeLowPercent: document.getElementById('grossEdgeLowPercent'),
    grossEdgeBasePercent: document.getElementById('grossEdgeBasePercent'),
    grossEdgeHighPercent: document.getElementById('grossEdgeHighPercent'),
    retentionTargetPercent: document.getElementById('retentionTargetPercent'),
    annualDragBudgetPercent: document.getElementById('annualDragBudgetPercent'),
    targetNetPercent: document.getElementById('targetNetPercent')
  };

  const errorMap = {
    capitalEur: 'capitalEur',
    orderNotionalEur: 'orderNotionalEur',
    sideCount: 'sideCount',
    monthlyOperations: 'monthlyOperations',
    commissionPerSideEur: 'commissionPerSideEur',
    fxRatePerSide: 'fxRatePerSidePercent',
    spreadTotalRate: 'spreadTotalPercent',
    slippageTotalRate: 'slippageTotalPercent',
    grossEdgeRate: 'grossEdgePercent',
    grossEdgeLowRate: 'grossEdgeLowPercent',
    grossEdgeBaseRate: 'grossEdgeBasePercent',
    grossEdgeHighRate: 'grossEdgeHighPercent',
    retentionTargetRate: 'retentionTargetPercent',
    annualDragBudgetRate: 'annualDragBudgetPercent',
    targetNetRate: 'targetNetPercent'
  };

  function parseFrenchNumber(value, optional) {
    const text = String(value == null ? '' : value).trim();
    if (text === '') return optional ? null : NaN;
    const normalized = text.replace(/\s/g, '').replace(',', '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return NaN;
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : NaN;
  }

  function nullablePercent(value) {
    const parsed = parseFrenchNumber(value, true);
    return parsed == null ? null : parsed / 100;
  }

  function requiredPercent(value) {
    return parseFrenchNumber(value, false) / 100;
  }

  function currentEdgeInputMode() {
    const selected = form.querySelector('input[name="edgeInputMode"]:checked');
    return selected ? selected.value : 'threshold';
  }

  function readInput() {
    const side = form.querySelector('input[name="sideCount"]:checked');
    const constraint = constraintMode.value;
    const edgeInputMode = currentEdgeInputMode();
    return {
      capitalEur: parseFrenchNumber(fields.capitalEur.value, true),
      orderNotionalEur: parseFrenchNumber(fields.orderNotionalEur.value, false),
      sideCount: side ? Number(side.value) : NaN,
      monthlyOperations: parseFrenchNumber(fields.monthlyOperations.value, true),
      commissionPerSideEur: parseFrenchNumber(fields.commissionPerSideEur.value, false),
      fxRatePerSide: parseFrenchNumber(fields.fxRatePerSidePercent.value, false) / 100,
      spreadTotalRate: parseFrenchNumber(fields.spreadTotalPercent.value, false) / 100,
      slippageTotalRate: parseFrenchNumber(fields.slippageTotalPercent.value, false) / 100,
      grossEdgeRate: edgeInputMode === 'point' ? requiredPercent(fields.grossEdgePercent.value) : null,
      grossEdgeLowRate: edgeInputMode === 'range' ? requiredPercent(fields.grossEdgeLowPercent.value) : null,
      grossEdgeBaseRate: edgeInputMode === 'range' ? requiredPercent(fields.grossEdgeBasePercent.value) : null,
      grossEdgeHighRate: edgeInputMode === 'range' ? requiredPercent(fields.grossEdgeHighPercent.value) : null,
      retentionTargetRate: constraint === 'retention' ? nullablePercent(fields.retentionTargetPercent.value) : null,
      annualDragBudgetRate: constraint === 'budget' ? nullablePercent(fields.annualDragBudgetPercent.value) : null,
      targetNetRate: constraint === 'targetNet' ? nullablePercent(fields.targetNetPercent.value) : null,
      provenance
    };
  }

  function updateConstraintVisibility() {
    document.querySelectorAll('.constraint-option').forEach(function (element) {
      element.hidden = element.dataset.constraint !== constraintMode.value;
    });
  }

  function updateEdgeVisibility() {
    const mode = currentEdgeInputMode();
    document.getElementById('point-edge-fields').hidden = mode !== 'point';
    document.getElementById('range-edge-fields').hidden = mode !== 'range';
  }

  function updateSubmitLabel() {
    const mode = currentEdgeInputMode();
    submitButton.textContent = mode === 'threshold'
      ? 'Calculer le seuil brut'
      : mode === 'point'
        ? 'Mesurer ce qui reste de la valeur brute'
        : 'Tester la stabilité dans la fourchette';
  }

  function clearErrors() {
    errorSummary.hidden = true;
    errorSummary.textContent = '';
    document.querySelectorAll('.field-error').forEach(function (element) {
      element.textContent = '';
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (element) {
      element.removeAttribute('aria-invalid');
    });
  }

  function humanError(reason) {
    const messages = {
      required: 'Ce champ est requis.',
      not_finite_number: 'Saisis un nombre fini valide.',
      not_integer: 'La valeur doit être un nombre entier.',
      out_of_range: 'La valeur est hors de l’intervalle autorisé.',
      range_incomplete: 'Renseigne les trois hypothèses de la fourchette.',
      range_order_invalid: 'Respecte l’ordre : basse ≤ centrale ≤ haute.',
      edge_mode_conflict: 'Choisis soit une valeur unique, soit une fourchette complète.'
    };
    return messages[reason] || 'Valeur invalide.';
  }

  function showErrors(errors) {
    clearErrors();
    const entries = Object.entries(errors);
    if (!entries.length) return;
    errorSummary.hidden = false;
    errorSummary.textContent = `Corrige ${entries.length} champ${entries.length > 1 ? 's' : ''} avant le calcul.`;
    let firstFocusable = null;
    entries.forEach(function (entry) {
      const engineKey = entry[0];
      const reason = entry[1];
      const formKey = errorMap[engineKey];
      const errorEl = document.querySelector(`[data-error-for="${formKey}"]`);
      if (errorEl) errorEl.textContent = humanError(reason);
      const input = fields[formKey] || form.querySelector(`[name="${formKey}"]`);
      if (input) {
        input.setAttribute('aria-invalid', 'true');
        if (!firstFocusable) firstFocusable = input;
      }
    });
    if (firstFocusable) {
      const details = firstFocusable.closest('details');
      if (details) details.open = true;
      firstFocusable.focus();
    }
  }

  function fmtEur(value) {
    if (!Number.isFinite(value)) return 'Indisponible';
    const safe = Object.is(value, -0) ? 0 : value;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: Math.abs(safe) < 0.01 && safe !== 0 ? 4 : 2,
      maximumFractionDigits: Math.abs(safe) < 0.01 && safe !== 0 ? 4 : 2
    }).format(safe);
  }

  function fmtPct(value, digits) {
    if (!Number.isFinite(value)) return 'Indisponible';
    const safe = Object.is(value, -0) ? 0 : value;
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: digits == null ? 2 : digits,
      maximumFractionDigits: digits == null ? 2 : digits
    }).format(safe);
  }

  function fmtNumber(value, digits) {
    if (!Number.isFinite(value)) return 'Indisponible';
    const safe = Object.is(value, -0) ? 0 : value;
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: digits == null ? 2 : digits
    }).format(safe);
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function availableValue(item, formatter) {
    return item && item.status === 'available' ? formatter(item.value) : 'Indisponible';
  }

  function reasonCopy(reason) {
    const copy = {
      gross_edge_missing: 'Ajoute un rendement brut explicite pour calculer cette contrainte.',
      retention_target_missing: 'Ajoute la part du rendement brut que tu souhaites conserver.',
      budget_missing: 'Ajoute un budget annuel de friction.',
      capital_missing: 'Ajoute le capital de référence dans « impact annuel ».',
      frequency_missing: 'Ajoute une fréquence mensuelle dans « impact annuel ».',
      target_net_missing: 'Ajoute une marge nette cible.',
      gross_edge_non_positive: 'Ce ratio exige un rendement brut strictement positif.',
      variable_floor_zero: 'Aucun plancher variable n’est présent.',
      total_cost_zero: 'Le coût total est nul.',
      range_mode_selected: 'Cette contrainte utilise une valeur brute unique dans ce prototype.',
      range_missing: 'Aucune fourchette n’a été sélectionnée.'
    };
    return copy[reason] || 'Les entrées nécessaires ne sont pas disponibles.';
  }

  function constraintCard(label, item, formatter, description) {
    const article = document.createElement('article');
    article.className = 'constraint';
    const labelEl = document.createElement('div');
    labelEl.className = 'label';
    labelEl.textContent = label;
    const strong = document.createElement('strong');
    const paragraph = document.createElement('p');

    if (item && item.status === 'available') {
      if (item.boundary === 'no_positive_minimum_from_fixed_costs' && item.value === 0) {
        strong.textContent = 'Aucun minimum positif imposé';
        paragraph.textContent = 'Les coûts fixes sont nuls : toute taille strictement positive satisfait la composante fixe, sous réserve du plancher variable.';
      } else {
        strong.textContent = formatter(item.value);
        paragraph.textContent = description;
      }
    } else {
      article.classList.add(item && item.reason === 'structurally_unreachable' ? 'unreachable' : 'unavailable');
      if (item && item.reason === 'structurally_unreachable') {
        strong.textContent = 'Impossible sous ces hypothèses';
        paragraph.textContent = 'Le plancher variable empêche cette condition d’être satisfaite, quelle que soit la taille de l’ordre.';
      } else if (item && item.reason === 'unbounded_within_model') {
        strong.textContent = 'Non bornée dans ce modèle';
        paragraph.textContent = 'Aucune friction n’est saisie ; le modèle ne produit donc pas de frontière de fréquence.';
      } else {
        strong.textContent = 'Non calculable';
        paragraph.textContent = reasonCopy(item ? item.reason : null);
      }
    }

    article.append(labelEl, strong, paragraph);
    return article;
  }

  function rangeConstraintCard(edgeRange) {
    const article = document.createElement('article');
    article.className = 'constraint range-constraint';
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = 'Taille frontière pour une marge nette positive';
    const strong = document.createElement('strong');
    strong.textContent = 'Trois frontières conditionnelles';
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Chaque valeur répond uniquement à l’hypothèse brute correspondante. Elle ne recommande aucune taille.';
    const list = document.createElement('dl');
    list.className = 'constraint-table';

    [['Basse', edgeRange.low], ['Centrale', edgeRange.base], ['Haute', edgeRange.high]].forEach(function (entry) {
      const name = entry[0];
      const hypothesis = entry[1];
      const term = document.createElement('dt');
      term.textContent = name;
      const definition = document.createElement('dd');
      const item = hypothesis.minimumOrderForPositiveNet;
      if (item.status === 'available') {
        definition.textContent = item.boundary === 'no_positive_minimum_from_fixed_costs' && item.value === 0
          ? 'Aucun minimum positif imposé par les coûts fixes'
          : `> ${fmtEur(item.value)}`;
      } else {
        definition.textContent = item.reason === 'structurally_unreachable'
          ? 'Impossible sous cette hypothèse'
          : 'Indisponible';
      }
      list.append(term, definition);
    });

    article.append(label, strong, paragraph, list);
    return article;
  }

  function rangeStateCopy(state) {
    const copy = {
      survives_full_range: 'Même l’hypothèse basse saisie reste strictement au-dessus du seuil de couverture.',
      crosses_break_even: 'La fourchette saisie traverse le seuil : la marge dépend de l’hypothèse retenue.',
      fails_full_range: 'Même l’hypothèse haute saisie ne dépasse pas le seuil de couverture.'
    };
    return copy[state] || 'État de fourchette indisponible.';
  }

  function floorStateCopy(state) {
    const copy = {
      structurally_unreachable_full_range: 'Même l’hypothèse haute est au niveau ou sous le plancher variable : augmenter uniquement la taille ne peut pas créer une marge positive dans ce modèle.',
      variable_floor_crossing: 'La fourchette traverse le plancher variable : selon l’hypothèse, une taille supérieure peut ou non diluer suffisamment les coûts fixes.',
      above_variable_floor_full_range: 'Les trois hypothèses dépassent le plancher variable ; la composante fixe reste la partie diluable avec la taille.'
    };
    return copy[state] || '';
  }

  function renderPrimary(result) {
    const r = result.results;
    const primary = document.getElementById('primary-result');
    primary.innerHTML = '';
    primary.classList.toggle('textual', result.edgeMode === 'range_estimate');
    const kicker = document.createElement('p');
    kicker.className = 'kicker';
    const strong = document.createElement('strong');
    const note = document.createElement('span');

    if (result.edgeMode === 'threshold_only') {
      setText('primary-title', 'Le rendement brut à atteindre avant toute marge');
      kicker.textContent = 'SEUIL BRUT DE COUVERTURE';
      strong.textContent = fmtPct(r.breakEvenGrossRate.value);
      note.textContent = 'par opération pour seulement couvrir les frictions saisies.';
      setText('primary-explanation', `Sur ce seuil, ${fmtPct(r.variableFloorRate.value)} provient de coûts proportionnels qui ne diminuent pas lorsque l’ordre grossit.`);
    } else if (result.edgeMode === 'range_estimate') {
      const range = r.edgeRange;
      setText('primary-title', 'La conclusion reste-t-elle stable dans ta fourchette ?');
      kicker.textContent = 'STABILITÉ FACE AUX FRICTIONS';
      strong.textContent = range.rangeState === 'survives_full_range'
        ? 'La marge subsiste dans toute la fourchette'
        : range.rangeState === 'crosses_break_even'
          ? 'La marge dépend de l’hypothèse'
          : 'Aucune hypothèse ne produit de marge positive';
      note.textContent = `Marges nettes : ${fmtPct(range.low.netEdgeRate.value)} · ${fmtPct(range.base.netEdgeRate.value)} · ${fmtPct(range.high.netEdgeRate.value)}.`;
      setText('primary-explanation', rangeStateCopy(range.rangeState));
    } else if (result.inputs.G > 0) {
      setText('primary-title', 'La part du rendement brut qui subsiste');
      kicker.textContent = 'RENDEMENT BRUT CONSERVÉ';
      strong.textContent = availableValue(r.edgeRetainedRate, function (value) { return fmtPct(value, 1); });
      note.textContent = `${fmtPct(r.netEdgeRate.value)} de marge nette, soit ${fmtEur(r.netEdgeEur.value)} par opération dans ce scénario.`;
      setText('primary-explanation', r.primaryState === 'edge_fully_absorbed'
        ? 'Les frictions absorbent entièrement le rendement brut saisi.'
        : `Les frictions absorbent ${fmtPct(r.edgeAbsorptionRate.value, 1)} du rendement brut saisi.`);
    } else {
      setText('primary-title', 'La marge après un rendement brut non positif');
      kicker.textContent = 'MARGE NETTE';
      strong.textContent = fmtPct(r.netEdgeRate.value);
      note.textContent = `${fmtEur(r.netEdgeEur.value)} par opération. Les ratios de part conservée ne sont pas définis lorsque le brut n’est pas positif.`;
      setText('primary-explanation', 'Breaktest conserve la valeur nulle ou négative telle qu’elle a été saisie et n’invente aucun ratio favorable.');
    }

    primary.append(kicker, strong, note);
  }

  function renderRange(result) {
    const section = document.getElementById('range-section');
    section.hidden = result.edgeMode !== 'range_estimate';
    if (result.edgeMode !== 'range_estimate') return;
    const range = result.results.edgeRange;
    setText('range-summary', rangeStateCopy(range.rangeState));
    [['low', 'low'], ['base', 'base'], ['high', 'high']].forEach(function (entry) {
      const idPart = entry[0];
      const hypothesis = range[entry[1]];
      setText(`range-${idPart}-net`, fmtPct(hypothesis.netEdgeRate.value));
      setText(`range-${idPart}-detail`, `${fmtPct(hypothesis.grossEdgeRate.value)} brut · ${fmtEur(hypothesis.netEdgeEur.value)} net par opération`);
    });
    setText('range-floor-note', floorStateCopy(range.variableFloorState));
    setText('range-shape-note', range.rangeShape === 'degenerate'
      ? 'Les trois valeurs sont identiques : la fourchette est conservée comme telle, sans être transformée silencieusement en valeur unique.'
      : 'Ordre contrôlé : hypothèse basse ≤ centrale ≤ haute.');
  }

  function selectedConstraint(result) {
    const r = result.results;
    const mode = constraintMode.value;
    if (mode === 'positive') {
      return result.edgeMode === 'range_estimate'
        ? rangeConstraintCard(r.edgeRange)
        : constraintCard('Taille frontière pour une marge nette positive', r.minimumOrderForPositiveNet, fmtEur, 'Le montant doit être strictement supérieur à cette frontière mathématique lorsque des coûts fixes existent.');
    }
    if (mode === 'retention') {
      return result.edgeMode === 'range_estimate'
        ? constraintCard('Taille frontière pour conserver la part choisie', unavailableForUi('range_mode_selected'), fmtEur, '')
        : constraintCard('Taille frontière pour conserver la part choisie', r.minimumOrderForRetention, fmtEur, 'Montant correspondant à la part de rendement brut conservée que tu as saisie.');
    }
    if (mode === 'budget') {
      return constraintCard('Fréquence frontière sous le budget annuel', r.maxMonthlyOperationsUnderBudget, function (value) { return `${fmtNumber(value, 2)} / mois`; }, 'Frontière arithmétique sous le budget de friction saisi.');
    }
    if (mode === 'targetNet') {
      return constraintCard('Rendement brut requis pour la marge nette cible', r.requiredGrossRateForTargetNet, fmtPct, 'Somme de la marge nette cible et du seuil de couverture du scénario.');
    }
    return null;
  }

  function unavailableForUi(reason) {
    return { status: 'unavailable', reason, value: null };
  }

  function render(result) {
    const r = result.results;
    clearErrors();
    renderPrimary(result);
    setText('break-even-value', fmtPct(r.breakEvenGrossRate.value));
    setText('variable-floor-value', fmtPct(r.variableFloorRate.value));
    setText('fixed-cost-value', fmtEur(r.fixedCostEur.value));
    setText('total-cost-value', fmtEur(r.totalCostEur.value));
    setText('result-provenance', r.provenance === 'synthetic_demo' ? 'Exemple synthétique' : 'Hypothèses utilisateur');

    const edgeSection = document.getElementById('edge-section');
    edgeSection.hidden = result.edgeMode !== 'point_estimate';
    if (result.edgeMode === 'point_estimate') {
      setText('retained-edge-value', availableValue(r.edgeRetainedRate, function (value) { return fmtPct(value, 1); }));
      setText('retained-edge-note', r.edgeRetainedRate.status === 'available' ? 'peut devenir négative si les frictions dépassent le brut' : reasonCopy(r.edgeRetainedRate.reason));
      setText('net-edge-value', fmtPct(r.netEdgeRate.value));
      setText('net-edge-eur', `${fmtEur(r.netEdgeEur.value)} par opération`);
      setText('absorbed-edge-value', availableValue(r.edgeAbsorptionRate, function (value) { return fmtPct(value, 1); }));
      setText('gross-edge-value', fmtPct(r.grossEdgeRate.value));
      setText('gross-edge-eur', `${fmtEur(r.grossEdgeEur.value)} par opération`);
    }
    renderRange(result);

    const constraintSection = document.getElementById('constraint-section');
    const constraints = document.getElementById('constraints-grid');
    constraints.innerHTML = '';
    const card = selectedConstraint(result);
    constraintSection.hidden = !card;
    if (card) constraints.appendChild(card);

    const fixedShare = r.fixedCostShare.status === 'available' ? r.fixedCostShare.value : 0;
    const variableShare = r.variableCostShare.status === 'available' ? r.variableCostShare.value : 0;
    setText('fixed-share-value', r.fixedCostShare.status === 'available' ? fmtPct(fixedShare, 1) : 'Indisponible');
    setText('variable-share-value', r.variableCostShare.status === 'available' ? fmtPct(variableShare, 1) : 'Indisponible');
    document.getElementById('fixed-share-bar').style.width = `${Math.max(0, Math.min(100, fixedShare * 100))}%`;
    document.getElementById('variable-share-bar').style.width = `${Math.max(0, Math.min(100, variableShare * 100))}%`;
    setText('equal-order-note', r.fixedVariableEqualOrder.status === 'available'
      ? `À ${fmtEur(r.fixedVariableEqualOrder.value)} de montant, coût fixe et coût variable sont égaux selon le modèle.`
      : reasonCopy(r.fixedVariableEqualOrder.reason));

    const chart = document.getElementById('sensitivity-chart');
    chart.innerHTML = '';
    const max = Math.max.apply(null, result.sensitivity.order.map(function (point) { return point.breakEvenGrossRate; }));
    result.sensitivity.order.forEach(function (point) {
      const row = document.createElement('div');
      row.className = 'sensitivity-row';
      const label = document.createElement('span');
      label.textContent = fmtEur(point.orderNotionalEur);
      const track = document.createElement('div');
      track.className = 'sensitivity-track';
      const bar = document.createElement('i');
      bar.style.width = `${max === 0 ? 0 : Math.max(2, point.breakEvenGrossRate / max * 100)}%`;
      track.appendChild(bar);
      const value = document.createElement('strong');
      value.textContent = fmtPct(point.breakEvenGrossRate);
      row.append(label, track, value);
      chart.appendChild(row);
    });

    setText('calculation-version', result.version);
    setText('evidence-mode', result.edgeMode === 'range_estimate'
      ? 'Fourchette basse / centrale / haute fournie par l’utilisateur'
      : result.edgeMode === 'point_estimate'
        ? 'Valeur brute unique fournie par l’utilisateur'
        : 'Seuil uniquement — aucune hypothèse brute');
    setText('evidence-provenance', r.provenance === 'synthetic_demo' ? 'synthetic_demo — exemple non observé' : 'user_assumption — saisie non vérifiée');
    setText('side-convention', result.inputs.k === 2
      ? 'Aller-retour : commission et change × 2 ; spread et slippage déjà totaux.'
      : 'Achat simple : un côté ; spread et slippage déjà totaux.');

    resultsEl.hidden = false;
    resultsEl.focus({ preventScroll: true });
    resultsEl.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
    live.textContent = result.edgeMode === 'range_estimate'
      ? `Résultat calculé. ${rangeStateCopy(r.edgeRange.rangeState)}`
      : result.edgeMode === 'threshold_only'
        ? `Résultat calculé. Seuil brut nécessaire ${fmtPct(r.breakEvenGrossRate.value)}.`
        : `Résultat calculé. Marge nette ${fmtPct(r.netEdgeRate.value)}.`;
  }

  function run(event) {
    if (event) event.preventDefault();
    const result = engine.compute(readInput());
    if (!result.ok) {
      resultsEl.hidden = true;
      showErrors(result.errors);
      return;
    }
    engine.assertFiniteTree(result);
    render(result);
  }

  function invalidateCurrentResult() {
    if (!resultsEl.hidden) {
      resultsEl.hidden = true;
      live.textContent = 'Les hypothèses ont changé. Recalcule pour obtenir un résultat à jour.';
    }
  }

  document.getElementById('load-demo').addEventListener('click', function () {
    fields.capitalEur.value = '5000';
    fields.orderNotionalEur.value = '500';
    fields.monthlyOperations.value = '4';
    fields.commissionPerSideEur.value = '1';
    fields.fxRatePerSidePercent.value = '0,25';
    fields.spreadTotalPercent.value = '0,10';
    fields.slippageTotalPercent.value = '0,10';
    fields.grossEdgePercent.value = '';
    fields.grossEdgeLowPercent.value = '0,80';
    fields.grossEdgeBasePercent.value = '2,00';
    fields.grossEdgeHighPercent.value = '3,00';
    fields.retentionTargetPercent.value = '';
    fields.annualDragBudgetPercent.value = '';
    fields.targetNetPercent.value = '';
    constraintMode.value = 'positive';
    form.querySelector('input[name="sideCount"][value="2"]').checked = true;
    form.querySelector('input[name="edgeInputMode"][value="range"]').checked = true;
    document.getElementById('annual-details').open = true;
    document.getElementById('edge-details').open = true;
    document.getElementById('constraint-details').open = true;
    updateConstraintVisibility();
    updateEdgeVisibility();
    updateSubmitLabel();
    provenance = 'synthetic_demo';
    document.getElementById('provenance-banner').innerHTML = 'Provenance actuelle : <strong>démonstration synthétique</strong>. Aucune donnée réelle ni tarif de courtier.';
    run();
  });

  constraintMode.addEventListener('change', function () {
    updateConstraintVisibility();
    invalidateCurrentResult();
  });
  form.addEventListener('change', function (event) {
    if (event.target && event.target.name === 'edgeInputMode') updateEdgeVisibility();
    updateSubmitLabel();
    invalidateCurrentResult();
  });
  form.addEventListener('input', function (event) {
    updateSubmitLabel();
    invalidateCurrentResult();
    if (event.isTrusted && provenance === 'synthetic_demo') {
      provenance = 'user_assumption';
      document.getElementById('provenance-banner').innerHTML = 'Provenance actuelle : <strong>hypothèses utilisateur</strong>.';
    }
  });
  form.addEventListener('submit', run);
  updateConstraintVisibility();
  updateEdgeVisibility();
  updateSubmitLabel();
})();
