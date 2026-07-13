(function () {
  'use strict';

  const form = document.getElementById('lab-form');
  const results = document.getElementById('results');
  const live = document.getElementById('result-live');

  if (!form || !results || !live) return;

  function invalidateRenderedResult(event) {
    if (!event.isTrusted || results.hidden) return;
    results.hidden = true;
    live.textContent = 'Hypothèses modifiées. Le résultat précédent est masqué ; relance le calcul.';
  }

  form.addEventListener('input', invalidateRenderedResult);
  form.addEventListener('change', invalidateRenderedResult);
})();
