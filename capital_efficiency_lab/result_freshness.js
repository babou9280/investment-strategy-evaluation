(function () {
  'use strict';

  const form = document.getElementById('lab-form');
  const results = document.getElementById('results');
  const live = document.getElementById('result-live');

  if (!form || !results || !live) return;

  const neutralInitialFields = {
    orderNotionalEur: 'ex. 500',
    monthlyOperations: 'ex. 4',
    commissionPerSideEur: 'ex. 1,00',
    fxRatePerSidePercent: 'ex. 0,25',
    spreadTotalPercent: 'ex. 0,10',
    slippageTotalPercent: 'ex. 0,10'
  };

  Object.entries(neutralInitialFields).forEach(function (entry) {
    const field = document.getElementById(entry[0]);
    if (!field) return;
    field.value = '';
    field.placeholder = entry[1];
  });

  form.querySelectorAll('input[name="sideCount"]').forEach(function (radio) {
    radio.checked = false;
  });

  const grossHelp = document.getElementById('gross-help');
  if (grossHelp) {
    grossHelp.textContent = 'Moyenne brute par opération complète, gains, pertes et opérations nulles inclus, avant les coûts saisis. Cette valeur reste une hypothèse non vérifiée par Breaktest.';
  }

  const rangeIntro = document.querySelector('.range-intro p');
  if (rangeIntro) {
    rangeIntro.textContent = 'Les trois valeurs doivent décrire la même moyenne brute par opération complète, avant coûts. Elles servent à tester la sensibilité de la conclusion, pas à produire une probabilité ou un intervalle de confiance.';
  }

  function invalidateRenderedResult(event) {
    if (!event.isTrusted || results.hidden) return;
    results.hidden = true;
    live.textContent = 'Hypothèses modifiées. Le résultat précédent est masqué ; recalcule avant de l’interpréter.';
  }

  form.addEventListener('input', invalidateRenderedResult);
  form.addEventListener('change', invalidateRenderedResult);
})();
