(function () {
  'use strict';

  const engine = globalThis.BreaktestCostGate;
  const scenario = globalThis.BreaktestCostGateScenario;
  const presenter = globalThis.BreaktestCostGatePresenter;
  if (!engine || !scenario || !presenter) throw new Error('cost_gate_critique_dependencies_missing');

  const form = document.getElementById('scenario-form');
  const results = document.getElementById('results');
  const resultContent = document.getElementById('result-content');
  const staleBanner = document.getElementById('stale-banner');
  const errorSummary = document.getElementById('error-summary');
  const errorList = document.getElementById('error-list');
  const liveRegion = document.getElementById('live-region');
  const provenanceBanner = document.getElementById('provenance-banner');
  const provenanceText = document.getElementById('provenance-text');
  const manualButton = document.getElementById('manual-button');
  const demoButton = document.getElementById('demo-button');
  const pointPanel = document.getElementById('point-edge-panel');
  const rangePanel = document.getElementById('range-edge-panel');
  let mode = 'neutral';
  let demoModified = false;
  let programmaticChange = false;
  let hasActiveResult = false;
  let instanceCounter = 0;

  const ERROR_MESSAGES = Object.freeze({
    required: 'Renseignez une valeur explicite, y compris zéro lorsque le composant ne s’applique pas.',
    invalid_number: 'Saisissez un nombre avec une virgule ou un point, sans séparateur de milliers.',
    must_be_non_negative: 'La valeur ne peut pas être négative.',
    must_be_strictly_positive: 'Le nominal doit être strictement positif.',
    percent_out_of_range: 'Le taux doit être compris entre 0 et 100 %.',
    required_choice: 'Choisissez une option.',
    same_currency_fx_must_be_zero: 'Le change doit être zéro lorsque le compte et la cotation sont en EUR.',
    range_order_invalid: 'Respectez l’ordre basse ≤ centrale ≤ haute.'
  });

  const FIELD_LABELS = Object.freeze({
    instrumentType: 'Instrument',
    operationScope: 'Portée des frictions',
    quoteCurrency: 'Devise de cotation',
    orderNotionalEur: 'Nominal proposé',
    commissionPerSideEur: 'Commission par côté',
    fxRatePerSidePct: 'Change par côté',
    spreadTotalPct: 'Spread total',
    slippageTotalPct: 'Slippage total',
    cashSettledBeforeReserveEur: 'Cash réglé avant réserve',
    strategyHeadroomEur: 'Allocation libre de stratégie',
    cashReserveEur: 'Réserve de cash',
    entryContractualFeesEur: 'Autres frais contractuels',
    entryTaxEur: 'Taxe d’entrée',
    executionCashBufferEur: 'Buffer cash d’exécution',
    edgeMode: 'Mode d’évaluation',
    grossEdgePct: 'Avantage brut',
    grossEdgeLowPct: 'Hypothèse basse',
    grossEdgeBasePct: 'Hypothèse centrale',
    grossEdgeHighPct: 'Hypothèse haute'
  });

  function elementForField(name) {
    return document.getElementById(name) || form.querySelector(`[name="${name}"]`);
  }

  function setProvenance(nextMode, modified) {
    mode = nextMode;
    demoModified = Boolean(modified);
    provenanceBanner.className = 'provenance-banner';
    if (mode === 'demo') {
      provenanceBanner.classList.add('provenance-demo');
      provenanceText.textContent = demoModified
        ? 'Démonstration synthétique modifiée · toujours sans donnée de marché réelle'
        : 'Démonstration synthétique chargée · valeurs fictives pour critique';
    } else if (mode === 'manual') {
      provenanceBanner.classList.add('provenance-manual');
      provenanceText.textContent = 'Hypothèses manuelles · Breaktest ne vérifie pas leur source';
    } else {
      provenanceBanner.classList.add('provenance-neutral');
      provenanceText.textContent = 'Aucune provenance choisie · aucun résultat actif';
    }
  }

  function setNamedValue(name, value) {
    const controls = form.querySelectorAll(`[name="${name}"]`);
    controls.forEach((control) => {
      if (control.type === 'radio') control.checked = control.value === value;
      else control.value = value;
    });
  }

  function clearForm() {
    programmaticChange = true;
    form.reset();
    programmaticChange = false;
    toggleEdgePanels();
    clearErrors();
    hideResult(false);
    setProvenance('manual', false);
    const first = form.querySelector('[name="instrumentType"]');
    if (first) first.focus();
  }

  function loadDemo() {
    programmaticChange = true;
    const values = scenario.demoFields();
    Object.keys(values).forEach((key) => setNamedValue(key, values[key]));
    programmaticChange = false;
    toggleEdgePanels();
    clearErrors();
    hideResult(false);
    setProvenance('demo', false);
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleEdgePanels() {
    const selected = form.querySelector('[name="edgeMode"]:checked');
    const value = selected ? selected.value : null;
    pointPanel.hidden = value !== 'point';
    rangePanel.hidden = value !== 'range';
  }

  function hideResult(showStale) {
    if (hasActiveResult || !results.hidden) {
      resultContent.replaceChildren();
      results.hidden = true;
      hasActiveResult = false;
    }
    staleBanner.hidden = !showStale;
  }

  function clearErrors() {
    errorSummary.hidden = true;
    errorList.replaceChildren();
    form.querySelectorAll('[aria-invalid="true"]').forEach((control) => {
      control.removeAttribute('aria-invalid');
      control.removeAttribute('aria-describedby');
    });
    form.querySelectorAll('.field-error').forEach((node) => { node.textContent = ''; });
  }

  function renderErrors(errors) {
    clearErrors();
    Object.keys(errors).forEach((name) => {
      const message = ERROR_MESSAGES[errors[name]] || 'Corrigez cette entrée.';
      const errorNode = document.getElementById(`${name}-error`);
      if (errorNode) errorNode.textContent = message;
      const controls = form.querySelectorAll(`[name="${name}"]`);
      controls.forEach((control) => {
        control.setAttribute('aria-invalid', 'true');
        control.setAttribute('aria-describedby', `${name}-error`);
      });
      const item = document.createElement('li');
      const link = document.createElement('a');
      const target = elementForField(name);
      link.href = target && target.id ? `#${target.id}` : `#${name}-group`;
      link.textContent = `${FIELD_LABELS[name] || name} : ${message}`;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        if (target) target.focus();
      });
      item.append(link);
      errorList.append(item);
    });
    errorSummary.hidden = false;
    hideResult(false);
    errorSummary.focus();
    liveRegion.textContent = `${Object.keys(errors).length} entrée(s) à corriger.`;
  }

  function collectFields() {
    const data = new FormData(form);
    const fields = {};
    for (const [key, value] of data.entries()) fields[key] = value;
    [
      'instrumentType', 'operationScope', 'quoteCurrency', 'orderNotionalEur', 'commissionPerSideEur',
      'fxRatePerSidePct', 'spreadTotalPct', 'slippageTotalPct', 'cashSettledBeforeReserveEur',
      'strategyHeadroomEur', 'cashReserveEur', 'entryContractualFeesEur', 'entryTaxEur',
      'executionCashBufferEur', 'edgeMode', 'grossEdgePct', 'grossEdgeLowPct', 'grossEdgeBasePct',
      'grossEdgeHighPct'
    ].forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) fields[key] = '';
    });
    return fields;
  }

  function createText(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  }

  function renderMetrics(view, container) {
    const grid = document.createElement('dl');
    grid.className = 'metric-grid';
    view.metrics.forEach((metric) => {
      const card = document.createElement('div');
      card.className = 'metric-card';
      card.dataset.metric = metric.id;
      card.append(createText('dt', '', metric.label));
      card.append(createText('dd', 'metric-value', metric.value));
      card.append(createText('p', 'metric-note', metric.note));
      grid.append(card);
    });
    container.append(grid);
  }

  function renderEdgeRows(view, container) {
    if (!view.edgeRows.length) return;
    const section = document.createElement('section');
    section.className = 'edge-result-card';
    section.append(createText('h3', '', view.edgeRows.length === 1 ? 'Marge après coûts' : 'Fourchette après coûts'));
    const tableWrap = document.createElement('div');
    tableWrap.className = 'table-wrap';
    const table = document.createElement('table');
    const caption = createText('caption', 'sr-only', 'Marges nettes calculées');
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['Hypothèse', 'Marge nette', 'Marge en euros', 'État moteur'].forEach((label) => headRow.append(createText('th', '', label)));
    head.append(headRow);
    const body = document.createElement('tbody');
    view.edgeRows.forEach((row) => {
      const tr = document.createElement('tr');
      tr.append(createText('th', '', row.label));
      tr.append(createText('td', '', row.rate));
      tr.append(createText('td', '', row.eur));
      tr.append(createText('td', 'engine-state', row.state));
      body.append(tr);
    });
    table.append(caption, head, body);
    tableWrap.append(table);
    section.append(tableWrap);
    container.append(section);
  }

  function renderCoverage(view, container) {
    const grid = document.createElement('div');
    grid.className = 'coverage-grid';
    const provenance = document.createElement('article');
    provenance.className = 'coverage-card';
    provenance.append(createText('p', 'card-kicker', 'Provenance'));
    provenance.append(createText('h3', '', view.provenance.label));
    provenance.append(createText('p', '', view.provenance.detail));

    const unassessed = document.createElement('article');
    unassessed.className = 'coverage-card';
    unassessed.append(createText('p', 'card-kicker', 'Couches non évaluées'));
    unassessed.append(createText('h3', '', view.unassessedLayers.length ? `${view.unassessedLayers.length} couche(s) restent ouvertes` : 'Aucune couche déclarée non évaluée'));
    const list = document.createElement('ul');
    view.unassessedLayers.forEach((item) => list.append(createText('li', '', item.label)));
    if (!view.unassessedLayers.length) list.append(createText('li', '', 'Voir malgré tout les limites permanentes ci-dessous.'));
    unassessed.append(list);
    grid.append(provenance, unassessed);
    container.append(grid);
  }

  function renderFindings(view, container) {
    const section = document.createElement('section');
    section.className = 'findings-section';
    const heading = document.createElement('div');
    heading.className = 'section-heading-row';
    heading.append(createText('h3', '', `Tous les constats du moteur (${view.findingCount})`));
    heading.append(createText('p', '', 'La synthèse ne supprime aucun sous-diagnostic.'));
    section.append(heading);
    const list = document.createElement('div');
    list.className = 'finding-list';
    view.findings.forEach((finding) => {
      const details = document.createElement('details');
      details.className = `finding finding-${finding.status}`;
      const summary = document.createElement('summary');
      const summaryText = document.createElement('span');
      summaryText.append(createText('span', 'finding-layer', finding.layerLabel));
      summaryText.append(createText('strong', '', finding.label));
      summary.append(summaryText, createText('span', 'finding-status', finding.statusLabel));
      details.append(summary);
      const body = document.createElement('div');
      body.className = 'finding-body';
      const dl = document.createElement('dl');
      const rows = [
        ['Code stable', finding.code],
        ['Valeur observée', finding.observed],
        ['Seuil', finding.threshold],
        ['Condition', finding.condition || 'Aucune condition supplémentaire'],
        ['Dépend de', finding.dependsOn.length ? finding.dependsOn.join(', ') : 'Aucune dépendance déclarée'],
        ['Résolution', finding.resolutionCondition || 'Non déclarée']
      ];
      rows.forEach(([term, value]) => {
        const row = document.createElement('div');
        row.append(createText('dt', '', term), createText('dd', '', value));
        dl.append(row);
      });
      body.append(dl);
      if (finding.limitations.length) {
        const limitations = document.createElement('ul');
        finding.limitations.forEach((limit) => limitations.append(createText('li', '', limit)));
        body.append(limitations);
      }
      details.append(body);
      list.append(details);
    });
    section.append(list);
    container.append(section);
  }

  function renderProof(view, container) {
    const details = document.createElement('details');
    details.className = 'snapshot-details';
    const summary = createText('summary', '', 'Snapshot, versions et limites du moteur');
    const body = document.createElement('div');
    body.className = 'snapshot-body';
    const dl = document.createElement('dl');
    [
      ['Snapshot', view.snapshot.id || 'Indisponible'],
      ['Instance', view.snapshot.instanceId],
      ['État', view.snapshot.status],
      ['Expiration', view.snapshot.expiresAt],
      ['Moteur', view.snapshot.engineVersion],
      ['Politique', view.snapshot.policyVersion],
      ['Contrat snapshot', view.snapshot.snapshotVersion]
    ].forEach(([term, value]) => {
      const row = document.createElement('div');
      row.append(createText('dt', '', term), createText('dd', '', value || 'Indisponible'));
      dl.append(row);
    });
    body.append(dl);
    body.append(createText('h4', '', 'Limites permanentes'));
    const list = document.createElement('ul');
    view.limitations.forEach((limit) => list.append(createText('li', '', limit)));
    body.append(list);
    details.append(summary, body);
    container.append(details);
  }

  function renderResult(result) {
    const provenanceState = mode === 'demo'
      ? {
          code: 'synthetic_demo',
          label: demoModified ? 'Démonstration synthétique modifiée' : 'Démonstration synthétique',
          detail: 'Les valeurs restent fictives et ne décrivent aucune donnée de marché actuelle.'
        }
      : {
          code: 'user_assumption',
          label: 'Hypothèses manuelles',
          detail: 'Breaktest calcule ces valeurs sans vérifier leur origine ni leur qualité statistique.'
        };
    const view = presenter.buildViewModel(result, provenanceState);
    resultContent.replaceChildren();

    const summary = document.createElement('header');
    summary.className = `result-summary result-${view.summary.tone}`;
    summary.append(createText('p', 'result-kicker', view.summary.kicker));
    const title = createText('h2', '', view.summary.title);
    title.id = 'result-title';
    title.tabIndex = -1;
    summary.append(title);
    summary.append(createText('p', 'result-description', view.summary.description));
    summary.append(createText('p', 'recommendation-warning', view.recommendationWarning));
    resultContent.append(summary);

    renderMetrics(view, resultContent);
    renderEdgeRows(view, resultContent);
    renderCoverage(view, resultContent);
    renderFindings(view, resultContent);
    renderProof(view, resultContent);

    results.hidden = false;
    staleBanner.hidden = true;
    hasActiveResult = true;
    title.focus();
    liveRegion.textContent = `Nouveau résultat : ${view.summary.title}`;
  }

  manualButton.addEventListener('click', clearForm);
  demoButton.addEventListener('click', loadDemo);
  form.addEventListener('input', (event) => {
    if (programmaticChange) return;
    if (mode === 'neutral') setProvenance('manual', false);
    else if (mode === 'demo') setProvenance('demo', true);
    if (hasActiveResult) hideResult(true);
    const target = event.target;
    if (target && target.name) {
      const error = document.getElementById(`${target.name}-error`);
      if (error) error.textContent = '';
      target.removeAttribute('aria-invalid');
      target.removeAttribute('aria-describedby');
    }
    toggleEdgePanels();
  });
  form.addEventListener('change', toggleEdgePanels);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();
    if (mode === 'neutral') setProvenance('manual', false);
    instanceCounter += 1;
    const built = scenario.buildScenario(engine, collectFields(), {
      mode: mode === 'demo' ? 'demo' : 'manual',
      instanceId: `gate1-instance-${instanceCounter}`
    });
    if (!built.ok) {
      renderErrors(built.errors);
      return;
    }
    try {
      const result = engine.compute(built.input);
      engine.assertFiniteTree(result);
      renderResult(result);
    } catch (error) {
      renderErrors({ orderNotionalEur: 'internal_error' });
      liveRegion.textContent = 'Le moteur a refusé ce scénario. Aucun résultat n’est affiché.';
    }
  });

  setProvenance('neutral', false);
  toggleEdgePanels();
})();
