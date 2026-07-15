# Prochaine mission Codex — Gate 1 Cost Gate hors ligne

## Statut reconstruit

La direction **Breaktest Cost Gate** est validée stratégiquement. Gate 0 est clôturée et la fondation synthétique interne est fusionnée. Ayman a explicitement validé Gate 1 le 15 juillet 2026.

```text
foundation pull request = #24, merged
foundation merge = e61d166d81da54a7d4ee596db2c2447fcb418eb2
documentation pull request = #25, merged
breaktest-bootstrap base = 56fb50954afd7394baf1689e0f1b7220a1fd73fc
active branch = strategy/cost-gate-offline-critique
current engine = cost-gate-foundation-3-synthetic
main = 6e8c8e801e9821fe212651d684c8fad75dc6abee, unchanged
```

Vérifier ces identifiants sur GitHub à chaque reprise. Une affirmation locale n'est pas une preuve distante.

## Objectif unique

Construire et falsifier un prototype HTML hors ligne `internal_review` qui permet à un investisseur autonome de :

- saisir des hypothèses sans valeur financière préremplie ;
- charger volontairement une démonstration `synthetic_demo` clairement marquée ;
- distinguer seuil, avantage brut, cash et qualité des données ;
- identifier le facteur principal ;
- voir tous les constats et les couches non évaluées ;
- comprendre qu'un état favorable n'est ni une recommandation ni une autorisation.

La réussite technique ne clôt pas Gate 1.

## Autorité de validation

Lire les sources exigées par `AGENTS.md`, puis utiliser :

- `docs/tasks/COST_GATE_OFFLINE_CRITIQUE.md` pour le protocole utilisateur préenregistré ;
- `docs/scenarios/COST_GATE_OFFLINE_CRITIQUE_MATRIX.md` pour les scénarios techniques ;
- `docs/product/COST_GATE_MVP_GATE_MATRIX.md` comme autorité unique des gates ;
- les contrats Cost Gate et le moteur fusionné comme autorités financières.

Les seuils préenregistrés ne peuvent pas être modifiés silencieusement après observation.

## Exigences techniques

- moteur navigateur dérivé automatiquement du moteur fusionné, avec parité prouvée ;
- aucune formule financière recopiée dans la présentation ;
- résultat obsolète masqué dès toute modification ;
- distinction persistante entre saisie vide, `synthetic_demo` et démo modifiée ;
- point, fourchette et mode seuil sans performance inventée ;
- tous les `findings[]`, dépendances, limites et `unassessedLayers` accessibles ;
- provenance, version, snapshot et expiration visibles ;
- erreurs explicites, aucun fallback silencieux ;
- aucun `NaN`, `Infinity` ou `-0` ;
- clavier, focus, annonces et mouvement réduit ;
- responsive à 390, 768, 1 024 et 1 440 px ;
- ouverture réelle sous `file://` ;
- package exact, manifeste et SHA-256 vérifiés ;
- CI et artefacts inspectés sur le head distant exact.

## Interdictions

- aucune modification de `main` ;
- aucune donnée ou tarification réelle ;
- aucun réseau, fournisseur, broker ou Alpaca ;
- aucun compte, import, stockage ou analytics ;
- aucun profil de risque ou suitability ;
- aucune recommandation, transmission ou exécution ;
- aucune probabilité d'exécution ;
- aucun levier, marge, short ou dérivé ;
- aucune publication ;
- aucun package qualifié de final, prêt à produire ou commercialement validé.

## Clôture de Gate 1

Après preuve technique du package exact, observer cinq participants qualifiés selon le protocole préenregistré. Consigner résultats, aides, abandons, confusions et limites sans invention, puis décider de continuer, corriger, réduire, réorienter ou abandonner.

Ne demander l'aide d'Ayman que lorsqu'un recrutement ou une observation humaine devient réellement indispensable.
