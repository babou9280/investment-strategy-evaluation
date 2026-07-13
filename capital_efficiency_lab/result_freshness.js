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

  function invalidateRenderedResult(event) {
    if (!event.isTrusted || results.hidden) return;
    results.hidden = true;
    live.textContent = 'Hypothèses modifiées. Le résultat précédent est masqué ; recalcule avant de l’interpréter.';
  }

  form.addEventListener('input', invalidateRenderedResult);
  form.addEventListener('change', invalidateRenderedResult);
})();
