(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.BreaktestCostGatePresenter = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = 'cost-gate-critique-presenter-1';
  const NUMBER = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 4 });
  const EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
  const PERCENT = new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 4 });

  const LAYERS = Object.freeze({
    input_validity: 'Validité des entrées',
    scope_limit: 'Périmètre',
    snapshot_integrity: 'Snapshot',
    data_quality: 'Qualité des données',
    friction_geometry: 'Frictions',
    edge_survival: 'Survie de l’avantage',
    capital_feasibility: 'Cash et allocation',
    execution_cost: 'Liquidité et exécution',
    user_constraint: 'Contrainte déclarée'
  });

  const STATUSES = Object.freeze({
    satisfied: 'Condition satisfaite dans le modèle',
    breached: 'Condition non satisfaite',
    structurally_unreachable: 'Limite structurelle',
    not_assessed: 'Non évalué',
    insufficient_data: 'Données insuffisantes',
    invalid: 'Entrée invalide',
    unsupported: 'Périmètre non pris en charge',
    conflicted: 'Données en conflit',
    expired: 'Donnée expirée',
    obsolete: 'Résultat obsolète'
  });

  const FINDING_LABELS = Object.freeze({
    unsupported_scope: 'Le scénario sort du périmètre cash long pris en charge.',
    snapshot_serialization_failed: 'Le snapshot n’a pas pu être construit de manière fiable.',
    external_market_data_not_assessed: 'Aucune donnée de marché actuelle n’est évaluée.',
    synthetic_source_stale: 'Une source synthétique est expirée pour l’heure d’évaluation.',
    synthetic_source_observed_after_evaluation: 'Une source est postérieure à l’heure d’évaluation.',
    instrument_venue_currency_mismatch: 'Instrument, place ou devise ne concordent pas.',
    synthetic_sources_current_for_evaluation_time: 'Les sources synthétiques sont actuelles pour l’heure déclarée.',
    complete_friction_geometry_calculated: 'La friction modélisée et le seuil sont calculés.',
    friction_components_missing: 'La friction complète ne peut pas être calculée.',
    gross_edge_not_provided: 'Aucun avantage brut n’est fourni : seul le seuil est évalué.',
    gross_edge_basis_mismatch: 'La définition de l’avantage brut ne correspond pas au scénario.',
    complete_friction_required_for_edge: 'La survie de l’avantage exige une friction complète.',
    gross_edge_not_above_variable_floor: 'L’avantage déclaré ne dépasse pas le plancher variable.',
    no_strictly_positive_margin: 'Les frictions sont couvertes, sans marge strictement positive.',
    gross_edge_does_not_cover_friction: 'L’avantage déclaré ne couvre pas les frictions modélisées.',
    gross_edge_survives_modelled_friction: 'Une marge positive subsiste après les frictions modélisées.',
    gross_edge_range_not_above_variable_floor: 'Toute la fourchette reste au niveau ou sous le plancher variable.',
    gross_edge_range_survives_modelled_friction: 'Toute la fourchette conserve une marge positive.',
    gross_edge_range_has_no_positive_margin: 'Aucun point de la fourchette ne produit de marge positive.',
    gross_edge_range_crosses_break_even: 'La fourchette traverse le seuil de couverture.',
    capital_not_provided: 'Le cash n’est pas évalué.',
    cash_basis_conflicted: 'Les hypothèses de cash décrivent des bases incompatibles.',
    entry_cash_within_capital_feasibility_cash: 'L’engagement d’entrée tient dans le cash et l’allocation déclarés.',
    entry_cash_requirement_exceeds_capital_feasibility_cash: 'L’engagement d’entrée dépasse le plafond de cash déclaré.',
    execution_liquidity_not_assessed: 'Liquidité, profondeur et exécution ne sont pas évaluées.'
  });

  const LIMITATIONS = Object.freeze({
    synthetic_or_manual_only: 'Hypothèses manuelles ou synthétiques uniquement',
    no_market_data_claim: 'Aucune affirmation sur le marché actuel',
    no_execution: 'Aucune transmission ni exécution',
    no_recommendation: 'Aucune recommandation',
    cash_long_spot_equity_or_etf_only: 'Compte cash, achat long, action ou ETF au comptant uniquement',
    nonzero_entry_tax_or_contractual_fees_require_lifecycle_model: 'Une taxe ou un frais contractuel non nul exige un modèle de cycle complet',
    no_current_market_claim: 'Aucune affirmation sur une donnée de marché actuelle',
    break_even_only: 'Seuil seulement, avantage non évalué',
    no_execution_probability: 'Aucune probabilité d’exécution',
    no_current_depth: 'Aucune profondeur de marché actuelle',
    synthetic_only: 'Source synthétique uniquement'
  });

  function cleanNumber(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    return Object.is(value, -0) ? 0 : value;
  }

  function formatEur(value) {
    const clean = cleanNumber(value);
    return clean === null ? 'Indisponible' : EUR.format(clean);
  }

  function formatRate(value) {
    const clean = cleanNumber(value);
    return clean === null ? 'Indisponible' : PERCENT.format(clean);
  }

  function formatValue(value, unit) {
    const clean = cleanNumber(value);
    if (clean === null) return value === null || value === undefined ? 'Non renseigné' : String(value);
    if (unit === 'EUR' || unit === 'EUR_known_components_only') return formatEur(clean);
    if (unit === 'decimal_rate') return formatRate(clean);
    return NUMBER.format(clean) + (unit ? ` ${unit}` : '');
  }

  function hasFinding(result, code) {
    return result.findings.some((item) => item.findingCode === code);
  }

  function rangeMarginsAreZero(result) {
    const range = result.friction && result.friction.edgeResults && result.friction.edgeResults.edgeRange;
    if (!range) return false;
    return ['low', 'base', 'high'].every((key) => {
      const value = range[key] && range[key].netEdgeRate && range[key].netEdgeRate.value;
      return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e-12;
    });
  }

  function summaryFor(result) {
    if (result.summaryCode === 'invalid_input') {
      return {
        tone: 'danger',
        kicker: 'Entrées à corriger',
        title: 'Le scénario ne peut pas être évalué tel quel',
        description: 'Au moins une entrée est absente, invalide ou contradictoire. Aucun fallback n’a été appliqué.'
      };
    }
    if (result.summaryCode === 'unsupported_scope') {
      return {
        tone: 'danger',
        kicker: 'Périmètre non pris en charge',
        title: 'Ce prototype ne couvre pas ce scénario',
        description: 'Gate 1 reste limitée au compte cash, à l’achat long et aux actions ou ETF au comptant.'
      };
    }
    if (result.summaryCode === 'snapshot_unusable') {
      return {
        tone: 'danger',
        kicker: 'Snapshot inutilisable',
        title: 'La provenance ou le temps empêche ce diagnostic',
        description: 'Les constats dépendants de ce snapshot ne doivent pas être utilisés.'
      };
    }
    if (result.summaryCode === 'structurally_non_viable') {
      return {
        tone: 'danger',
        kicker: 'Facteur principal · plancher variable',
        title: 'L’avantage déclaré ne dépasse pas le plancher variable',
        description: 'Augmenter le nominal ne supprime pas cette partie proportionnelle des frictions dans le modèle.'
      };
    }
    if (result.summaryCode === 'edge_not_surviving_modelled_friction') {
      if (hasFinding(result, 'no_strictly_positive_margin') || rangeMarginsAreZero(result)) {
        return {
          tone: 'warning',
          kicker: 'Facteur principal · marge nette',
          title: 'Aucune marge positive ne subsiste après les frictions modélisées',
          description: 'L’égalité au seuil couvre exactement les frictions ; elle ne laisse pas de marge strictement positive.'
        };
      }
      if (hasFinding(result, 'gross_edge_range_has_no_positive_margin')) {
        return {
          tone: 'warning',
          kicker: 'Facteur principal · avantage brut',
          title: 'Aucune hypothèse ne produit de marge positive',
          description: 'La fourchette entière reste sous le seuil de couverture avec les frictions modélisées.'
        };
      }
      if (hasFinding(result, 'gross_edge_range_crosses_break_even')) {
        return {
          tone: 'warning',
          kicker: 'Facteur principal · incertitude de l’avantage',
          title: 'La fourchette traverse le seuil de couverture',
          description: 'La conclusion change selon l’hypothèse basse, centrale ou haute. La fourchette complète reste visible.'
        };
      }
      return {
        tone: 'warning',
        kicker: 'Facteur principal · avantage brut',
        title: 'L’avantage déclaré ne couvre pas entièrement les frictions modélisées',
        description: 'La marge nette calculée sous ces hypothèses n’est pas positive.'
      };
    }
    if (result.summaryCode === 'capital_not_feasible') {
      return {
        tone: 'danger',
        kicker: 'Facteur principal · cash et allocation',
        title: 'Le cash déclaré ou l’allocation libre ne couvre pas l’engagement d’entrée',
        description: 'Le plafond effectif est le plus petit du cash réglé libre et de l’allocation libre déclarée.'
      };
    }
    if (result.summaryCode === 'constraint_breach') {
      return {
        tone: 'warning',
        kicker: 'Facteur principal · contrainte déclarée',
        title: 'Une contrainte fournie n’est pas satisfaite',
        description: 'Cette relation applique une limite explicite ; elle ne choisit pas la limite à votre place.'
      };
    }
    if (result.summaryCode === 'no_incompatibility_detected_under_assumptions') {
      return {
        tone: 'calm',
        kicker: 'Dans les couches évaluées',
        title: 'Aucune incompatibilité n’a été détectée dans les couches évaluées',
        description: 'Ce constat dépend uniquement des hypothèses affichées et ne couvre pas les couches indiquées comme non évaluées.'
      };
    }
    if (hasFinding(result, 'gross_edge_not_provided') && result.friction && result.friction.complete) {
      return {
        tone: 'neutral',
        kicker: 'Parcours seuil',
        title: 'Le seuil est calculé, mais l’avantage brut n’est pas évalué',
        description: 'Aucune performance n’est inventée. Vous pouvez comparer ce seuil à une hypothèse brute seulement si sa définition est compatible.'
      };
    }
    if (result.friction && !result.friction.complete) {
      return {
        tone: 'warning',
        kicker: 'Données insuffisantes',
        title: 'La friction complète n’est pas calculable avec les entrées actuelles',
        description: 'Les composants connus restent distincts des composants absents ; la survie de l’avantage n’est pas évaluée.'
      };
    }
    return {
      tone: 'neutral',
      kicker: 'Données insuffisantes',
      title: 'Le contrôle ne peut pas conclure sur toutes les couches',
      description: 'Les faits indépendants calculables restent visibles avec les données ou hypothèses manquantes.'
    };
  }

  function edgeRows(result) {
    if (!result.friction || !result.friction.complete || !result.friction.edgeResults) return [];
    const rows = [];
    const edge = result.friction.edgeResults;
    if (result.friction.edgeMode === 'point_estimate' && edge.netEdgeRate && edge.netEdgeRate.status === 'available') {
      rows.push({ label: 'Marge nette', rate: edge.netEdgeRate.value, eur: edge.netEdgeEur.value, state: edge.primaryState });
    }
    if (result.friction.edgeMode === 'range_estimate' && edge.edgeRange) {
      ['low', 'base', 'high'].forEach((key) => {
        const item = edge.edgeRange[key];
        rows.push({
          label: key === 'low' ? 'Hypothèse basse' : key === 'base' ? 'Hypothèse centrale' : 'Hypothèse haute',
          rate: item.netEdgeRate.value,
          eur: item.netEdgeEur.value,
          state: item.state
        });
      });
    }
    return rows;
  }

  function findingsFor(result) {
    return result.findings.map((item) => ({
      id: item.findingId,
      code: item.findingCode,
      layer: item.layer,
      layerLabel: LAYERS[item.layer] || item.layer,
      status: item.status,
      statusLabel: STATUSES[item.status] || item.status,
      materiality: item.materiality,
      label: FINDING_LABELS[item.findingCode] || (item.findingCode.startsWith('invalid_')
        ? 'Une entrée est invalide ou absente.'
        : 'Constat détaillé du moteur.'),
      observed: formatValue(item.observedValue, item.unit),
      threshold: formatValue(item.thresholdValue, item.unit),
      unit: item.unit,
      condition: item.condition,
      dependsOn: item.dependsOn.slice(),
      resolutionCondition: item.resolutionCondition,
      limitations: item.limitations.map((limit) => LIMITATIONS[limit] || limit)
    }));
  }

  function buildViewModel(result, provenanceState) {
    const summary = summaryFor(result);
    const frictionComplete = Boolean(result.friction && result.friction.complete);
    const cash = result.cash || {};
    const metrics = [
      {
        id: 'break-even',
        label: 'Seuil brut',
        value: frictionComplete ? formatRate(result.friction.breakEvenGrossRate) : 'Indisponible',
        note: 'Rendement brut requis pour couvrir les frictions modélisées.'
      },
      {
        id: 'variable-floor',
        label: 'Plancher variable',
        value: frictionComplete ? formatRate(result.friction.variableFloorRate) : 'Indisponible',
        note: 'Part proportionnelle qui ne disparaît pas avec un nominal plus élevé.'
      },
      {
        id: 'lifecycle-friction',
        label: 'Friction du cycle',
        value: frictionComplete ? formatEur(result.friction.lifecycleFrictionEur) : formatEur(result.friction.knownCostEur),
        note: frictionComplete ? 'Coût complet modélisé pour la portée choisie.' : 'Composants connus seulement.'
      },
      {
        id: 'entry-cash',
        label: 'Engagement d’entrée',
        value: formatEur(cash.entryCashRequirementEur),
        note: 'Cash immédiat ; il reste distinct du coût d’un futur cycle complet.'
      },
      {
        id: 'cash-ceiling',
        label: 'Plafond de cash déclaré',
        value: formatEur(cash.capitalFeasibilityCashEur),
        note: 'Minimum du cash réglé libre et de l’allocation libre déclarée.'
      }
    ];

    return {
      version: VERSION,
      summary,
      recommendationWarning: 'Ce résultat n’est ni une recommandation, ni une autorisation d’ordre, ni une prévision.',
      metrics,
      edgeRows: edgeRows(result).map((row) => ({
        label: row.label,
        rate: formatRate(row.rate),
        eur: formatEur(row.eur),
        state: row.state
      })),
      findings: findingsFor(result),
      unassessedLayers: result.unassessedLayers.map((layer) => ({ code: layer, label: LAYERS[layer] || layer })),
      limitations: result.limitations.map((limit) => LIMITATIONS[limit] || limit),
      provenance: provenanceState,
      snapshot: {
        id: result.snapshot.snapshotId,
        instanceId: result.snapshot.snapshotInstanceId,
        status: result.snapshot.status,
        expiresAt: result.snapshot.expiresAtUtc,
        engineVersion: result.version,
        policyVersion: result.policyVersion,
        snapshotVersion: result.snapshot.versions.dataQualityVersion || null
      },
      rawSummaryCode: result.summaryCode,
      findingCount: result.findings.length
    };
  }

  return {
    VERSION,
    LAYERS,
    STATUSES,
    FINDING_LABELS,
    LIMITATIONS,
    cleanNumber,
    formatEur,
    formatRate,
    formatValue,
    buildViewModel
  };
});
