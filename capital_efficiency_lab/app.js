(function () {
  'use strict';
  const engine = window.BreaktestCapitalEfficiency;
  const form = document.getElementById('lab-form');
  const resultsEl = document.getElementById('results');
  const errorSummary = document.getElementById('error-summary');
  const live = document.getElementById('result-live');
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

  function readInput() {
    const side = form.querySelector('input[name="sideCount"]:checked');
    return {
      capitalEur: parseFrenchNumber(fields.capitalEur.value, true),
      orderNotionalEur: parseFrenchNumber(fields.orderNotionalEur.value, false),
      sideCount: side ? Number(side.value) : NaN,
      monthlyOperations: parseFrenchNumber(fields.monthlyOperations.value, false),
      commissionPerSideEur: parseFrenchNumber(fields.commissionPerSideEur.value, false),
      fxRatePerSide: parseFrenchNumber(fields.fxRatePerSidePercent.value, false) / 100,
      spreadTotalRate: parseFrenchNumber(fields.spreadTotalPercent.value, false) / 100,
      slippageTotalRate: parseFrenchNumber(fields.slippageTotalPercent.value, false) / 100,
      grossEdgeRate: nullablePercent(fields.grossEdgePercent.value),
      retentionTargetRate: nullablePercent(fields.retentionTargetPercent.value),
      annualDragBudgetRate: nullablePercent(fields.annualDragBudgetPercent.value),
      targetNetRate: nullablePercent(fields.targetNetPercent.value),
      provenance
    };
  }

  function clearErrors() {
    errorSummary.hidden = true;
    errorSummary.textContent = '';
    document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
    Object.values(fields).forEach(el => el.removeAttribute('aria-invalid'));
  }

  function humanError(reason) {
    const messages = {
      required: 'Ce champ est requis.',
      not_finite_number: 'Saisis un nombre fini valide.',
      not_integer: 'La valeur doit être un nombre entier.',
      out_of_range: 'La valeur est hors de l’intervalle autorisé.'
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
    entries.forEach(([engineKey, reason]) => {
      const formKey = errorMap[engineKey];
      const message = humanError(reason);
      const errorEl = document.querySelector(`[data-error-for="${formKey}"]`);
      if (errorEl) errorEl.textContent = message;
      const input = fields[formKey] || form.querySelector(`[name="${formKey}"]`);
      if (input) {
        input.setAttribute('aria-invalid', 'true');
        if (!firstFocusable) firstFocusable = input;
      }
    });
    if (firstFocusable) firstFocusable.focus();
  }

  function fmtEur(value) {
    if (!Number.isFinite(value)) return 'Indisponible';
    const safe = Object.is(value, -0) ? 0 : value;
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: Math.abs(safe) < 0.01 && safe !== 0 ? 4 : 2, maximumFractionDigits: Math.abs(safe) < 0.01 && safe !== 0 ? 4 : 2 }).format(safe);
  }

  function fmtPct(value, digits) {
    if (!Number.isFinite(value)) return 'Indisponible';
    const safe = Object.is(value, -0) ? 0 : value;
    return new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: digits == null ? 2 : digits, maximumFractionDigits: digits == null ? 2 : digits }).format(safe);
  }

  function fmtNumber(value, digits) {
    if (!Number.isFinite(value)) return 'Indisponible';
    const safe = Object.is(value, -0) ? 0 : value;
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: digits == null ? 2 : digits }).format(safe);
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function availableValue(item, formatter) {
    return item && item.status === 'available' ? formatter(item.value) : 'Indisponible';
  }

  function reasonCopy(reason) {
    const copy = {
      gross_edge_missing: 'Ajoute un avantage brut explicite pour calculer cette contrainte.',
      retention_target_missing: 'Ajoute une part cible d’avantage conservé.',
      budget_missing: 'Ajoute un budget annuel de friction.',
      capital_missing: 'Ajoute un capital de référence.',
      target_net_missing: 'Ajoute une marge nette cible.',
      gross_edge_non_positive: 'Ce ratio exige un avantage brut strictement positif.',
      variable_floor_zero: 'Aucun plancher variable n’est présent.',
      total_cost_zero: 'Le coût total est nul.'
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
    const p = document.createElement('p');
    if (item && item.status === 'available') {
      strong.textContent = formatter(item.value);
      p.textContent = description;
    } else {
      article.classList.add(item && item.reason === 'structurally_unreachable' ? 'unreachable' : 'unavailable');
      if (item && item.reason === 'structurally_unreachable') {
        strong.textContent = 'Impossible sous ces hypothèses';
        p.textContent = 'Le plancher variable empêche cette contrainte d’être satisfaite, quelle que soit la taille d’ordre.';
      } else if (item && item.reason === 'unbounded_within_model') {
        strong.textContent = 'Non bornée dans ce modèle';
        p.textContent = 'Aucune friction n’est saisie ; le modèle ne produit donc pas de frontière de fréquence.';
      } else {
        strong.textContent = 'Non calculable';
        p.textContent = reasonCopy(item ? item.reason : null);
      }
    }
    article.append(labelEl, strong, p);
    return article;
  }

  function renderPrimary(result) {
    const r = result.results;
    const primary = document.getElementById('primary-result');
    primary.innerHTML = '';
    const kicker = document.createElement('p');
    kicker.className = 'kicker';
    const strong = document.createElement('strong');
    const note = document.createElement('span');

    if (result.inputs.G == null) {
      setText('primary-title', 'Le seuil avant toute marge nette');
      kicker.textContent = 'SEUIL BRUT DE COUVERTURE';
      strong.textContent = fmtPct(r.breakEvenGrossRate.value);
      note.textContent = 'Rendement brut nécessaire par opération pour couvrir les frictions saisies.';
      setText('primary-explanation', `Le seuil comprend ${fmtPct(r.variableFloorRate.value)} de plancher variable, auquel s’ajoute un coût fixe diluable avec la taille d’ordre.`);
    } else if (result.inputs.G > 0) {
      setText('primary-title', 'La part de l’avantage qui subsiste');
      kicker.textContent = 'AVANTAGE BRUT CONSERVÉ';
      strong.textContent = availableValue(r.edgeRetainedRate, value => fmtPct(value, 1));
      note.textContent = `${fmtPct(r.netEdgeRate.value)} de marge nette, soit ${fmtEur(r.netEdgeEur.value)} par opération dans ce scénario.`;
      const stateCopy = r.netEdgeRate.value <= 0
        ? 'Les frictions absorbent entièrement l’avantage brut saisi.'
        : `Les frictions absorbent ${fmtPct(r.edgeAbsorptionRate.value, 1)} de l’avantage brut saisi.`;
      setText('primary-explanation', stateCopy);
    } else {
      setText('primary-title', 'Marge nette sous avantage non positif');
      kicker.textContent = 'MARGE NETTE';
      strong.textContent = fmtPct(r.netEdgeRate.value);
      note.textContent = `${fmtEur(r.netEdgeEur.value)} par opération. Les ratios de rétention sont indisponibles lorsque l’avantage brut n’est pas positif.`;
      setText('primary-explanation', 'Le produit conserve la valeur négative ou nulle telle qu’elle a été saisie et n’invente aucun ratio favorable.');
    }
    primary.append(kicker, strong, note);
  }

  function render(result) {
    const r = result.results;
    clearErrors();
    renderPrimary(result);
    setText('break-even-value', fmtPct(r.breakEvenGrossRate.value));
    setText('variable-floor-value', fmtPct(r.variableFloorRate.value));
    setText('fixed-cost-value', fmtEur(r.fixedCostEur.value));
    setText('total-cost-value', fmtEur(r.totalCostEur.value));
    setText('result-provenance', r.provenance === 'synthetic_demo' ? 'Scénario synthétique' : 'Hypothèses utilisateur');

    const edgeSection = document.getElementById('edge-section');
    edgeSection.hidden = result.inputs.G == null;
    if (result.inputs.G != null) {
      setText('retained-edge-value', availableValue(r.edgeRetainedRate, value => fmtPct(value, 1)));
      setText('retained-edge-note', r.edgeRetainedRate.status === 'available' ? 'peut être négative si les frictions dépassent le brut' : reasonCopy(r.edgeRetainedRate.reason));
      setText('net-edge-value', fmtPct(r.netEdgeRate.value));
      setText('net-edge-eur', `${fmtEur(r.netEdgeEur.value)} par opération`);
      setText('absorbed-edge-value', availableValue(r.edgeAbsorptionRate, value => fmtPct(value, 1)));
      setText('gross-edge-value', fmtPct(r.grossEdgeRate.value));
      setText('gross-edge-eur', `${fmtEur(r.grossEdgeEur.value)} par opération`);
    }

    const constraints = document.getElementById('constraints-grid');
    constraints.innerHTML = '';
    constraints.append(
      constraintCard('Taille frontière pour une marge nette positive', r.minimumOrderForPositiveNet, fmtEur, 'Le montant doit être strictement supérieur à cette frontière mathématique.'),
      constraintCard('Taille frontière pour la rétention cible', r.minimumOrderForRetention, fmtEur, 'Montant correspondant à la part cible d’avantage conservé saisie.'),
      constraintCard('Fréquence frontière sous budget annuel', r.maxMonthlyOperationsUnderBudget, value => `${fmtNumber(value, 2)} / mois`, 'Frontière arithmétique sous le budget de friction saisi.'),
      constraintCard('Brut requis pour la marge nette cible', r.requiredGrossRateForTargetNet, value => fmtPct(value), 'Somme de la cible nette et du seuil de couverture du scénario.')
    );

    const fixedShare = r.fixedCostShare.status === 'available' ? r.fixedCostShare.value : 0;
    const variableShare = r.variableCostShare.status === 'available' ? r.variableCostShare.value : 0;
    setText('fixed-share-value', r.fixedCostShare.status === 'available' ? fmtPct(fixedShare, 1) : 'Indisponible');
    setText('variable-share-value', r.variableCostShare.status === 'available' ? fmtPct(variableShare, 1) : 'Indisponible');
    document.getElementById('fixed-share-bar').style.width = `${Math.max(0, Math.min(100, fixedShare * 100))}%`;
    document.getElementById('variable-share-bar').style.width = `${Math.max(0, Math.min(100, variableShare * 100))}%`;
    setText('equal-order-note', r.fixedVariableEqualOrder.status === 'available'
      ? `À ${fmtEur(r.fixedVariableEqualOrder.value)} de nominal, le coût fixe et le coût variable sont égaux selon le modèle.`
      : reasonCopy(r.fixedVariableEqualOrder.reason));

    const chart = document.getElementById('sensitivity-chart');
    chart.innerHTML = '';
    const max = Math.max(...result.sensitivity.order.map(point => point.breakEvenGrossRate));
    result.sensitivity.order.forEach(point => {
      const row = document.createElement('div');
      row.className = 'sensitivity-row';
      const orderLabel = document.createElement('span');
      orderLabel.textContent = fmtEur(point.orderNotionalEur);
      const track = document.createElement('div');
      track.className = 'sensitivity-track';
      const bar = document.createElement('i');
      bar.style.width = `${max === 0 ? 0 : Math.max(2, point.breakEvenGrossRate / max * 100)}%`;
      track.appendChild(bar);
      const value = document.createElement('strong');
      value.textContent = fmtPct(point.breakEvenGrossRate);
      row.append(orderLabel, track, value);
      chart.appendChild(row);
    });

    setText('calculation-version', result.version);
    setText('evidence-provenance', r.provenance === 'synthetic_demo' ? 'synthetic_demo — exemple non observé' : 'user_assumption — saisie non vérifiée');
    setText('side-convention', result.inputs.k === 2 ? 'Aller-retour : commission et change × 2 ; spread et slippage déjà totaux.' : 'Achat simple : un côté ; spread et slippage déjà totaux.');

    resultsEl.hidden = false;
    resultsEl.focus({ preventScroll: true });
    resultsEl.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    live.textContent = result.inputs.G == null
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

  document.getElementById('load-demo').addEventListener('click', function () {
    fields.capitalEur.value = '5000';
    fields.orderNotionalEur.value = '500';
    fields.monthlyOperations.value = '4';
    fields.commissionPerSideEur.value = '1';
    fields.fxRatePerSidePercent.value = '0,25';
    fields.spreadTotalPercent.value = '0,10';
    fields.slippageTotalPercent.value = '0,10';
    fields.grossEdgePercent.value = '2,00';
    fields.retentionTargetPercent.value = '50';
    fields.annualDragBudgetPercent.value = '3,00';
    fields.targetNetPercent.value = '1,00';
    form.querySelector('input[name="sideCount"][value="2"]').checked = true;
    provenance = 'synthetic_demo';
    document.getElementById('provenance-banner').innerHTML = 'Provenance actuelle : <strong>démonstration synthétique</strong>. Aucune donnée réelle ni tarif de courtier.';
    run();
  });

  form.addEventListener('input', function (event) {
    if (event.isTrusted && provenance === 'synthetic_demo') {
      provenance = 'user_assumption';
      document.getElementById('provenance-banner').innerHTML = 'Provenance actuelle : <strong>hypothèses utilisateur</strong>.';
    }
  });
  form.addEventListener('submit', run);
})();