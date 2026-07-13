# Breaktest - état actuel

## Version

Prototype local-first 0.1, consolidé et audité initialement le 12 juillet 2026.

## Matériel existant

- un prototype HTML autonome ;
- quatre fichiers de lancement archivés qui contiennent le même code et diffèrent seulement par le titre et la vue initiale ;
- un pitch deck ;
- un product blueprint ;
- un guide utilisateur ;
- un journal de backtest ;
- un journal de live-test ;
- un rapport académique d'évaluation de stratégie.

## Consolidation réalisée

`app/Breaktest_Studio.html` est le fichier canonique provisoire. La source v0.2 auditée est conservée dans sept fragments immuables sous `app/.bundle/`.

Le build cumulatif actuel exécute :

1. `scripts/materialize_breaktest.py` pour produire la version H1 ;
2. `scripts/apply_c2_patch.py` pour appliquer l'isolation temporelle C2 ;
3. `scripts/apply_c3_patch.py` pour appliquer l'allocation chronologique du turnover C3 ;
4. `scripts/apply_c1_patch.py` pour appliquer la réservation chronologique du capital C1 ;
5. `scripts/build_breaktest.py` comme point d'entrée unique.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- après H1 : `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c` ;
- après C2 durci : `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454` ;
- après C3 : `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80`, 142 782 octets ;
- version candidate après C1 : `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e`, 152 496 octets.

## Fonctionnalités confirmées par exécution

- chargement local sans erreur JavaScript observée ;
- navigation entre les quatre vues ;
- modification du capital et recalcul visible ;
- presets de courtier et paramètres de coûts ;
- réinitialisation du jeu de démonstration ;
- import CSV nominal ;
- refus d'un import incomplet ou numériquement invalide avec conservation de l'état précédent ;
- export CSV des décisions ;
- filtres et recherche dans le ledger ;
- ouverture et fermeture de la modal méthodologique ;
- échappement de l'injection HTML testée dans le DOM ;
- modèle d'entraînement antérieur propre à chaque décision ;
- allocation du turnover dans l'ordre chronologique sur une fenêtre glissante de 365,25 jours ;
- réservation du nominal entre l'entrée et la sortie des positions financées ;
- refus sans redimensionnement implicite lorsqu'un chevauchement dépasse le capital disponible ;
- diagnostics de capital par décision et agrégats de financement.

Ces validations ne prouvent pas encore l'exactitude générale du moteur quantitatif ni une courbe de portefeuille temporelle.

## Corrections fusionnées

### H1 — validation numérique stricte

La correction H1 est fusionnée dans `breaktest-bootstrap` par la pull request `#2`, commit squash `380e9e99f5b59387586df4290f32d5b057e2f3bd`.

Le moteur distingue une valeur numérique valide, manquante et invalide, refuse les lots ambigus et conserve la provenance des dérivations PnL/rendement. Les preuves sont enregistrées dans `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### C2 — isolation temporelle et par échantillon

Le noyau C2 est fusionné par la pull request `#3`, puis durci par la pull request `#5`, commit squash `0134b3bb7166e2a4720c27ad754512952b3f75de`.

Chaque décision utilise uniquement des lignes backtest valides dont la sortie est strictement antérieure à son entrée. Les lignes live, futures, de même date, invalides et la décision elle-même sont exclues. Les preuves sont enregistrées dans `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### C3 — allocation chronologique du turnover

C3 est fusionné dans `breaktest-bootstrap` par la pull request `#6`, commit squash `703f259e056189b2250bc5c528bd4a914f26f03c`.

Les décisions sont traitées par date d'entrée croissante et le plafond est appliqué sur une fenêtre glissante de 365,25 jours. Une opportunité future ne peut pas modifier une décision antérieure. Les preuves sont enregistrées dans `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md`.

## Correction validée sur branche, en attente de fusion

### C1 — réservation du capital entre positions simultanées

La candidate C1 est présente sur `codex/c1-capital-reservation`. Elle réserve le nominal complet des décisions encore `keep`, libère avant chaque groupe les positions antérieures sorties, préserve la priorité simultanée C3, ne recycle pas une nouvelle position au milieu de son groupe et refuse sans redimensionnement un nominal insuffisamment financé.

Les dates d'entrée ou de sortie invalides, les sorties antérieures à l'entrée et les nominaux invalides produisent `observe` sans réservation. Le PnL ne modifie pas le capital disponible. Les métriques de turnover sont recalculées sur les décisions finalement financées.

Validations exécutées dans GitHub Actions sur la candidate verrouillée :

- build H1 + C2 + C3 + C1 : 152 496 octets, SHA-256 `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e` ;
- suite H1 stricte : réussite ;
- smoke test Chromium H1 : réussite ;
- suites C2, C3 et C1 : réussite ;
- JavaScript construit : syntaxe validée avec `node --check` ;
- deux positions simultanées incompatibles, positions non chevauchantes, libération le jour de la sortie, absence de recyclage intragroupe, priorité C3, capital exact ou nul, dates invalides, sortie inversée, décision préfiltrée, opportunité future et PnL futur extrême couverts.

Le détail est enregistré dans `docs/validation/C1_CAPITAL_RESERVATION.md`.

## Défaut critique encore ouvert

1. **C4 — courbe de capital non temporelle** : le PnL est encore affecté selon l'entrée et la courbe n'est ni une trésorerie réalisée aux sorties ni une valeur mark-to-market.

## Défauts élevés encore ouverts

1. champs de PnL net/full-cost du journal ignorés ;
2. prix en euros reconvertis comme une devise étrangère ;
3. absence de réconciliation PnL / rendement / nominal ;
4. risque d'injection de formule dans l'export CSV ;
5. coût algorithmique élevé sur les imports moyens.

## Ce qui n'est pas encore considéré comme validé

- exactitude de chaque formule ;
- conformité complète des calculs aux journaux et rapports sources ;
- courbe de capital réalisée ou mark-to-market ;
- réinvestissement chronologique du PnL, levier, appels de marge, intérêts et flux externes ;
- robustesse de l'import sur une couverture large de formats ;
- sécurité exhaustive du parsing et des exports ;
- compatibilité complète Safari, iPad, mobile et navigateurs ;
- reproductibilité et calibration définitive du Breaktest Score ;
- cohérence complète entre produit, deck, guide et chiffres ;
- valeur commerciale réelle et disposition à payer.

## Hébergement GitHub

- dépôt d'amorçage : `babou9280/investment-strategy-evaluation` ;
- branche de référence isolée : `breaktest-bootstrap` ;
- branche C1 candidate : `codex/c1-capital-reservation` ;
- la branche `main` et le projet universitaire d'origine restent inchangés ;
- les PDF restent locaux et ne sont pas nécessaires aux corrections de code actuellement ciblées.

## Prochaine exécution autorisée

1. auditer le diff final et l'état propre de la pull request C1 ;
2. fusionner C1 uniquement dans `breaktest-bootstrap` si la dernière exécution verrouillée reste verte ;
3. créer ensuite une branche isolée pour C4 — courbe de capital temporelle ;
4. ne rien fusionner dans `main`.
