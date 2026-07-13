(() => {
  "use strict";
  const calc = window.BreaktestCalculator;
  const config = window.BreaktestValidationConfig;
  const form = document.querySelector("#cost-form");
  const resultSection = document.querySelector("#results");
  const errorSummary = document.querySelector("#error-summary");
  const live = document.querySelector("#result-live");
  const includeCapital = document.querySelector("#share-capital");
  let lastResult = null;
  let currentProvenance = "synthetic_demo";

  function fieldValue(name) {
    const node = form.elements.namedItem(name);
    return node ? node.value : "";
  }

  function rawScenario() {
    return {
      capitalEur: fieldValue("capitalEur"), orderAmountEur: fieldValue("orderAmountEur"),
      activityType: fieldValue("activityType"), monthlyFrequency: fieldValue("monthlyFrequency"),
      commissionPerSideEur: fieldValue("commissionPerSideEur"), fxPerConversionPercent: fieldValue("fxPerConversionPercent"),
      spreadPercent: fieldValue("spreadPercent"), slippagePercent: fieldValue("slippagePercent"),
    };
  }

  function clearErrors() {
    errorSummary.hidden = true;
    errorSummary.innerHTML = "";
    form.querySelectorAll("[data-error-for]").forEach((node) => { node.textContent = ""; });
    form.querySelectorAll("[aria-invalid='true']").forEach((node) => node.setAttribute("aria-invalid", "false"));
  }

  function showErrors(errors) {
    clearErrors();
    const entries = Object.entries(errors);
    if (!entries.length) return;
    const list = document.createElement("ul");
    for (const [key, message] of entries) {
      const input = form.elements.namedItem(key);
      const local = form.querySelector(`[data-error-for="${key}"]`);
      if (local) local.textContent = message;
      if (input && input.setAttribute) input.setAttribute("aria-invalid", "true");
      const item = document.createElement("li");
      item.textContent = message;
      list.appendChild(item);
    }
    errorSummary.append("Corrige les champs suivants :", list);
    errorSummary.hidden = false;
    const first = form.elements.namedItem(entries[0][0]);
    if (first && first.focus) first.focus();
  }

  function setText(id, value, raw) {
    const node = document.querySelector(`#${id}`);
    node.textContent = value;
    if (raw !== undefined && raw !== null) node.dataset.raw = String(raw);
    else delete node.dataset.raw;
  }

  function renderComponents(result) {
    const list = document.querySelector("#component-list");
    list.innerHTML = "";
    if (!result.hasAnyFriction) {
      const zero = document.createElement("p");
      zero.className = "zero-state";
      zero.textContent = "Ce scénario ne contient aucune friction saisie. Le résultat est donc nul ; cela ne signifie pas qu’une exécution réelle serait sans coût.";
      list.appendChild(zero);
      return;
    }
    [...result.components].sort((a, b) => b.costEur - a.costEur).forEach((component) => {
      const row = document.createElement("div");
      row.className = "component-row";
      const provenanceLabel = component.provenance === "synthetic_demo" ? "Exemple synthétique" : "Hypothèse saisie";
      row.innerHTML = `<div class="component-head"><span>${component.label}</span><strong>${calc.formatEur(component.costEur)}</strong></div>
        <div class="bar" aria-hidden="true"><span style="width:${Math.max(component.share * 100, component.costEur > 0 ? 2 : 0)}%"></span></div>
        <div class="component-meta"><span>${calc.formatPercent(component.share, 1)} du total</span><span>${provenanceLabel}</span></div>`;
      row.dataset.component = component.key;
      row.dataset.raw = String(component.costEur);
      row.dataset.provenance = component.provenance;
      list.appendChild(row);
    });
  }

  function renderComparisons(result) {
    const grid = document.querySelector("#comparison-grid");
    grid.innerHTML = "";
    calc.buildComparisons(result).forEach((entry) => {
      const card = document.createElement("article");
      card.className = "comparison-card";
      card.dataset.scenario = entry.key;
      const capitalRate = entry.result.annualCostToCapitalRate === null ? "Indisponible sans capital" : calc.formatPercent(entry.result.annualCostToCapitalRate);
      card.innerHTML = `<h3>${entry.label}</h3><dl>
        <div><dt>Par opération</dt><dd>${calc.formatEur(entry.result.totalCostPerOperationEur)}</dd></div>
        <div><dt>Part de l’ordre</dt><dd>${calc.formatPercent(entry.result.costRatePerOperation)}</dd></div>
        <div><dt>Par an</dt><dd>${calc.formatEur(entry.result.annualCostEur)}</dd></div>
        <div><dt>Sur le capital</dt><dd>${capitalRate}</dd></div></dl>`;
      grid.appendChild(card);
    });
  }

  function renderResult(result) {
    const operationLabel = result.inputs.activityType === "round_trip" ? "aller-retour" : "achat";
    setText("metric-operation", calc.formatEur(result.totalCostPerOperationEur), result.totalCostPerOperationEur);
    setText("metric-operation-rate", `${calc.formatPercent(result.costRatePerOperation)} du montant de l’ordre`, result.costRatePerOperation);
    setText("metric-annual", calc.formatEur(result.annualCostEur), result.annualCostEur);
    setText("metric-frequency", `${calc.formatFrequency(result.inputs.monthlyFrequency)} ${operationLabel}${result.inputs.monthlyFrequency > 1 ? "s" : ""}/mois`);
    setText("metric-capital", result.annualCostToCapitalRate === null ? "Indisponible" : calc.formatPercent(result.annualCostToCapitalRate), result.annualCostToCapitalRate);
    setText("metric-break-even", calc.formatPercent(result.breakEvenGrossRatePerOperation), result.breakEvenGrossRatePerOperation);
    document.querySelector("#operation-label").textContent = `Coût estimé par ${operationLabel}`;
    document.querySelector("#capital-note").textContent = result.annualCostToCapitalRate === null
      ? "Le coût par opération reste calculable, mais pas son poids annuel dans le capital."
      : "Part du capital de référence absorbée selon cette fréquence.";
    renderComponents(result);
    renderComparisons(result);
    document.querySelector("#calculation-version").textContent = result.version;
    resultSection.hidden = false;
    resultSection.focus({ preventScroll: true });
    resultSection.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    live.textContent = "Résultat mis à jour";
  }

  form.addEventListener("input", () => { currentProvenance = "user_assumption"; });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const outcome = calc.calculate(rawScenario(), { provenance: currentProvenance });
    if (!outcome.ok) {
      resultSection.hidden = true;
      showErrors(outcome.errors);
      return;
    }
    clearErrors();
    lastResult = outcome.result;
    renderResult(lastResult);
  });

  document.querySelector("#hero-cta").addEventListener("click", () => {
    document.querySelector("#calculator").scrollIntoView({ behavior: "smooth" });
    document.querySelector("#capitalEur").focus({ preventScroll: true });
  });

  document.querySelectorAll("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => {
      const demo = calc.DEMO_SCENARIOS[button.dataset.demo];
      if (!demo) return;
      for (const [key, value] of Object.entries(demo.values)) {
        const node = form.elements.namedItem(key);
        if (!node) continue;
        if (typeof RadioNodeList !== "undefined" && node instanceof RadioNodeList) node.value = value;
        else node.value = String(value).replace(".", ",");
      }
      currentProvenance = demo.provenance;
      document.querySelector("#demo-status").textContent = `Exemple synthétique chargé : ${demo.label}.`;
      form.querySelector("button[type='submit']").focus();
    });
  });

  document.querySelector("#share-result").addEventListener("click", async () => {
    if (!lastResult) return;
    const options = { includeCapital: includeCapital.checked };
    const payload = calc.buildSharePayload(lastResult, options);
    const text = calc.shareText(lastResult, options);
    window.__breaktestLastSharePayload = payload;
    window.__breaktestLastShareText = text;
    try {
      if (navigator.share) await navigator.share({ title: "Breaktest Cost Intelligence", text });
      else if (navigator.clipboard) await navigator.clipboard.writeText(text);
      document.querySelector("#share-status").textContent = "Résultat prêt à être partagé.";
    } catch (error) {
      document.querySelector("#share-status").textContent = "Partage annulé. Aucune donnée n’a été envoyée.";
    }
  });

  document.querySelector("#interest-form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#interest-status").textContent = config.emailEndpoint
      ? "Endpoint configuré mais envoi désactivé dans cette version de validation."
      : "Collecte non activée : aucune donnée n’a été envoyée.";
  });

  window.BreaktestValidation = { rawScenario, renderResult, getLastResult: () => lastResult, config };
})();
