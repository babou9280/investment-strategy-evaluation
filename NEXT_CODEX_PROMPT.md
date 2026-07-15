# Prochaine mission Codex — décision Gate 1 Cost Gate

## Statut

La direction **Breaktest Cost Gate** est validée stratégiquement. Sa fondation synthétique interne est clôturée et fusionnée ; aucun produit utilisateur Cost Gate n'est encore construit.

```text
foundation pull request = #24, merged
foundation final head = 3fb6341d51ff46b70dd774546955fbb1c66a400e
foundation final tree = 62ad8094cfee5aff31e2d65fdd56da2ba057f5dc
foundation final run = 29346211285 (#618), success
foundation artifact = 8316213225
foundation digest = 50096ccdf90c9bd5d190151f41e24f7f52d972f7cc3878a2c20f1e920ab7a996
breaktest-bootstrap merge = e61d166d81da54a7d4ee596db2c2447fcb418eb2
current engine = cost-gate-foundation-3-synthetic
main = 6e8c8e801e9821fe212651d684c8fad75dc6abee, unchanged
```

La preuve est technique, quantitative, synthétique et interne. Elle ne valide ni interface, ni compréhension, ni donnée réelle, ni droit, ni marché.

## Première action obligatoire

Reconstruire l'état GitHub actuel avant toute action :

1. head réel de `breaktest-bootstrap` et de `main` ;
2. état fusionné de la PR `#24` ;
3. éventuelle nouvelle branche ou PR ;
4. derniers commentaires, runs et preuves exact-head ;
5. cohérence des fichiers canoniques avec cet état.

Le dépôt GitHub reste la source de vérité. Les identifiants ci-dessus sont des preuves historiques à vérifier, pas des hypothèses à imposer.

## Autorité documentaire

Lire intégralement les sources exigées par `AGENTS.md`, notamment :

- les fichiers canoniques ;
- `STRATEGY.md`, `BUSINESS_MODEL.md` et `VALIDATION_PLAN.md` ;
- `docs/product/COST_GATE_DIRECTION.md` ;
- `docs/product/COST_GATE_MVP_GATE_MATRIX.md` ;
- les contrats Cost Gate ;
- `docs/governance/BLIND_SPOT_REGISTER.md` ;
- `docs/scenarios/COST_GATE_FOUNDATION_MATRIX.md` ;
- `docs/validation/COST_GATE_FOUNDATION.md` ;
- `docs/delivery/OFFLINE_HTML_DELIVERABLE_STANDARD.md` ;
- le moteur et les tests sous `cost_gate_foundation/`.

`COST_GATE_MVP_GATE_MATRIX.md` est l'autorité unique pour les identifiants de gate. Ne pas créer une numérotation parallèle.

## Décision nécessaire

Gate 0 est clôturée. Gate 1 — valeur compréhensible sans donnée réelle — n'est pas encore autorisée.

Recommandation : construire sur une branche et une PR distinctes un prototype HTML hors ligne de critique, réellement interactif, utilisant uniquement les hypothèses manuelles ou `synthetic_demo` du moteur fusionné.

Demander à Ayman uniquement : `valide` ou `refuse`.

Ne créer ni branche fonctionnelle ni interface avant sa validation explicite.

## Si Gate 1 est validée

Objectif unique : tester si un investisseur autonome comprend la valeur du contrôle, distingue seuil, avantage, cash et qualité des données, identifie le facteur limitant et ne prend jamais un état favorable pour une recommandation.

Le prototype doit :

- fonctionner hors ligne en HTML autonome ou ZIP local avec `index.html` ;
- utiliser le moteur fusionné, sans réécriture divergente des formules ;
- proposer un parcours progressif réalisable en moins de trois minutes ;
- distinguer hypothèse utilisateur et `synthetic_demo` ;
- afficher unités, provenance, snapshot, expiration et couches non évaluées ;
- conserver tous les `findings[]` ;
- éviter feu vert, achat, vente, exécuter, rejeter, taille optimale ou recommandation ;
- être accessible au clavier, responsive et sans dépendance distante ;
- inclure oracles, tests navigateur, captures de preuve et contrôle du package exact ;
- préenregistrer le protocole de cinq participants et ses critères d'abandon avant observation.

## Interdictions maintenues

- aucune modification de `main` ;
- aucune donnée ou tarification réelle ;
- aucun réseau, fournisseur, broker ou Alpaca ;
- aucun compte, import, stockage ou analytics ;
- aucun profil de risque ou suitability ;
- aucune recommandation, transmission ou exécution ;
- aucune probabilité d'exécution ;
- aucun levier, marge, short ou dérivé ;
- aucune publication ;
- aucun package présenté comme produit final ou commercialement validé.

## Définition de terminé de Gate 1

La construction technique ne suffit pas. Gate 1 n'est terminée qu'après :

- package exact construit, ouvert, testé et inspecté ;
- CI verte sur le head distant exact ;
- moteur et non-régressions préservés ;
- protocole préenregistré avant utilisateurs ;
- cinq tests qualifiés réellement observés ;
- résultats, abandons, confusions et limites consignés sans invention ;
- décision documentée de continuer, corriger, réorienter ou abandonner.
