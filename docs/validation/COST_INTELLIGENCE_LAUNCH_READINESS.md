# Validation — préparation du test utilisateur Cost Intelligence

## Statut

La préparation interne au test utilisateur est techniquement validée sur la pull request `#17`.

Exécution de référence :

- head : `245489655917a9de38cf80e6546852d3223eebcd` ;
- GitHub Actions run : `29269885911` ;
- artifact : `8286999777` ;
- empreinte de l'artifact : `sha256:14794de6cff0029fba03b948f98051a8a6e000a263b14cb1cf712017a1a32463`.

Cette preuve n'autorise ni déploiement public, ni collecte, ni paiement.

## Livrables contrôlés

- `docs/launch/STATIC_LAUNCH_CHECKLIST.md` ;
- `docs/launch/USER_TEST_PROTOCOL.md` ;
- `docs/launch/PRIVACY_MINIMUM.md` ;
- `validation_site/README.md` ;
- `tests/validation_static_integrity.py` ;
- workflow GitHub Actions étendu aux branches `strategy/**`.

## Commandes exécutées

```bash
python3 scripts/build_breaktest.py
node tests/h1_strict_numeric_validation.test.js
node tests/h2_journal_net_bases.test.js
node tests/validation_calculator.test.js
python3 tests/validation_static_integrity.py
python3 tests/h1_browser_smoke.py
python3 tests/c2_temporal_isolation.py
python3 tests/c3_chronological_turnover.py
python3 tests/c1_capital_reservation.py
python3 tests/c4_realized_equity_curve.py
python3 tests/c4_negative_free_cash.py
python3 tests/h2_journal_net_bases.py
python3 tests/validation_browser.py
python3 -m py_compile tests/validation_browser.py tests/validation_static_integrity.py
node --check /tmp/breaktest-built.js
node --check validation_site/config.js
node --check validation_site/calculator.js
node --check validation_site/app.js
```

## Résultats

### Moteur historique

Le build demeure :

- `166862` octets ;
- SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`.

Les validations H1, H2, C2, C3, C1 et C4 ont réussi.

### Calculateur Cost Intelligence

- tests unitaires réussis ;
- tests Chromium réussis à 390, 768, 1024 et 1440 px ;
- syntaxe JavaScript réussie ;
- conventions et valeurs Q0 inchangées.

### Intégrité statique

Résultat exact :

```text
Static integrity passed: 7 local references, 43171 active bytes, no network or persistence capability
```

Le test a confirmé :

- assets actifs locaux et relatifs ;
- aucun asset distant ;
- aucun `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` ou iframe ;
- aucun `localStorage`, `sessionStorage`, IndexedDB ou cookie ;
- aucun endpoint ou secret détecté par les règles versionnées ;
- analytics, email, paiement et URL publique désactivés ;
- aucune sérialisation automatique des données dans l'URL ;
- poids cumulé des fichiers actifs inférieur au budget de 150 Ko.

## Préparation utilisateur

Le protocole est prêt pour une première vague de cinq participants et définit :

- critères de recrutement ;
- consigne exacte ;
- tâches de compréhension ;
- grille de mesure ;
- seuils d'acceptation UX ;
- distinction entre déclaration et comportement commercial réel ;
- règles de traitement des objections et données.

## Limites

- aucun test utilisateur réel effectué ;
- aucune mesure des 90 secondes en situation réelle ;
- aucune validation Safari/iPad manuelle ;
- aucun hébergeur vérifié ou sélectionné ;
- aucune URL publique ;
- aucune collecte email, analytics ou paiement ;
- aucune preuve de rétention ou disposition à payer ;
- aucun avis juridique professionnel.

## Conclusion

La préparation interne est cohérente et reproductible. La prochaine décision externe doit être limitée à l'autorisation d'une prévisualisation ou publication statique, avec hébergeur, données, coût et rollback explicitement présentés à Ayman.
