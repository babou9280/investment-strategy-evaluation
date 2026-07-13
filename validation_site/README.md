# Breaktest Cost Intelligence — prévisualisation locale

Cette page est un instrument de validation commerciale, pas la V1 complète de Breaktest.

## Lancer localement

Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

Ouvrir ensuite :

```text
http://127.0.0.1:8000/validation_site/index.html
```

Un serveur HTTP local est préférable à l'ouverture directe du fichier pour reproduire le contexte du test navigateur.

## Ce qui fonctionne

- calcul local des commissions, du change, du spread et du slippage ;
- achat simple ou aller-retour ;
- impact par opération et annuel ;
- décomposition des composantes ;
- comparaisons descriptives ;
- partage textuel sans capital exact par défaut ;
- scénarios synthétiques.

## Ce qui est volontairement désactivé

- analytics ;
- collecte d'email ;
- paiement ;
- backend ;
- comptes ;
- import de transactions ;
- données de courtiers ;
- recommandations et exécution.

Les drapeaux sont définis dans `config.js` et doivent rester désactivés pendant la préparation interne.

## Tests

```bash
node tests/validation_calculator.test.js
python3 tests/validation_static_integrity.py
python3 tests/validation_browser.py
node --check validation_site/config.js
node --check validation_site/calculator.js
node --check validation_site/app.js
```

Le test navigateur requiert Playwright et Chromium. Le workflow GitHub Actions installe automatiquement ces dépendances.

## Confidentialité

Le calculateur n'envoie pas les valeurs saisies. Ne saisir aucune information d'identification de courtier, mot de passe, clé API ou donnée personnelle inutile.

Le capital exact n'est inclus dans le texte partagé qu'après activation explicite de la case correspondante.

## Limites

- aucun tarif réel de courtier ;
- spread et slippage saisis comme hypothèses ;
- aucun rendement futur calculé ;
- aucun conseil d'investissement ;
- aucune validation commerciale ;
- compatibilité Safari/iPad encore à vérifier manuellement.
