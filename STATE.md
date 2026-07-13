# Breaktest - état actuel

## Version

Prototype local-first 0.1, consolidé et audité initialement le 12 juillet 2026.

## Matériel existant

- un prototype HTML autonome ;
- quatre fichiers de lancement archivés qui contiennent le même code et diffèrent seulement par le titre et la vue initiale ;
- un pitch deck, un product blueprint et un guide utilisateur ;
- des journaux de backtest et de live-test ;
- un rapport académique d'évaluation de stratégie.

## Build canonique

`app/Breaktest_Studio.html` est le fichier canonique provisoire. La source v0.2 auditée est conservée dans sept fragments immuables sous `app/.bundle/`.

Le build cumulatif exécute :

1. `scripts/materialize_breaktest.py` — H1 ;
2. `scripts/apply_c2_patch.py` — C2 ;
3. `scripts/apply_c3_patch.py` — C3 ;
4. `scripts/apply_c1_patch.py` — C1 ;
5. `scripts/apply_c4_patch.py` — C4 ;
6. `scripts/build_breaktest.py` — point d'entrée unique.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- après H1 : `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c` ;
- après C2 : `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454` ;
- après C3 : `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80`, 142 782 octets ;
- après C1 : `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e`, 152 496 octets ;
- candidate C4 : `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af`, 158 682 octets.

## Fonctionnalités confirmées par exécution

- chargement local, navigation, recalcul du capital et paramètres de coûts ;
- import CSV nominal et refus ferme des données numériques ambiguës ;
- export CSV nominal, filtres, recherche, modal méthodologique et échappement HTML ;
- modèle d'entraînement antérieur propre à chaque décision ;
- allocation chronologique du turnover sur 365,25 jours ;
- réservation du nominal entre entrée et sortie ;
- refus sans redimensionnement implicite lorsque les positions simultanées dépassent le capital disponible ;
- courbe de trésorerie réalisée aux dates de sortie des positions financées ;
- gains et pertes réalisés disponibles pour le financement à partir de leur date de sortie ;
- diagnostics de modèle, turnover, financement et événements réalisés.

Ces validations ne prouvent pas encore l'exactitude générale du moteur quantitatif ni une valorisation mark-to-market du portefeuille.

## Corrections fusionnées dans `breaktest-bootstrap`

### H1 — validation numérique stricte

Fusionnée par la pull request `#2`. Preuves : `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### C2 — isolation temporelle et par échantillon

Fusionnée par les pull requests `#3` et `#5`. Preuves : `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### C3 — allocation chronologique du turnover

Fusionnée par la pull request `#6`. Preuves : `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md`.

### C1 — réservation du capital entre positions simultanées

Fusionnée par la pull request `#8`, commit squash `2d84a0fa06b5b28da2fbd16c2f704e0bb58ff284`. Le nominal complet est réservé jusqu'à la sortie, les priorités C3 sont préservées et aucun redimensionnement silencieux n'est autorisé. Preuves : `docs/validation/C1_CAPITAL_RESERVATION.md`.

## Correction validée sur branche, prête à fusionner

### C4 — courbe de trésorerie réalisée aux sorties

La candidate C4 unifie la réservation C1 et la réalisation du PnL dans une simulation événementielle : les sorties sont traitées avant les entrées de même date, le nominal est libéré, le PnL net est appliqué une seule fois à la sortie et la trésorerie réalisée modifie le financement à partir de cet instant.

La courbe commence au capital initial, agrège les sorties d'une même date et se termine au capital initial augmenté de la somme des PnL nets des trades financés. Elle est explicitement présentée comme **réalisée aux sorties** et non mark-to-market.

Validations de référence :

- build H1 + C2 + C3 + C1 + C4 : 158 682 octets, SHA-256 `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af` ;
- GitHub Actions `29245705155` sur le commit `ded3ded64edf5cf66e90438ca086678e197d9356` : réussite ;
- suites H1, C2, C3, C1 et C4 : réussite ;
- test complémentaire de capital libre négatif après perte réalisée : réussite ;
- Chromium et `node --check` : réussite ;
- gains/pertes aux sorties, sorties simultanées, financement par gain, blocage par perte, invalides, absence de recyclage intragroupe, réconciliation et invariance au futur couverts.

Preuves : `docs/validation/C4_REALIZED_EQUITY_CURVE.md`.

## Défauts élevés encore ouverts

1. **H2** — champs de PnL net/full-cost du journal ignorés ;
2. **H3** — prix en euros reconvertis comme une devise étrangère ;
3. **H4** — absence de réconciliation PnL / rendement / nominal ;
4. **H5** — risque d'injection de formule dans l'export CSV ;
5. **H6** — coût algorithmique élevé sur les imports moyens.

## Ce qui n'est pas encore considéré comme validé

- exactitude de chaque formule et conformité complète aux journaux sources ;
- valorisation mark-to-market ou quotidienne des positions ouvertes ;
- levier, appels de marge, intérêts, dividendes et flux externes ;
- robustesse étendue des imports, sécurité exhaustive et performance à l'échelle ;
- compatibilité complète Safari/iPad/mobile ;
- calibration définitive du Breaktest Score ;
- cohérence complète du deck et du guide ;
- valeur commerciale et disposition à payer.

## Hébergement GitHub

- dépôt d'amorçage : `babou9280/investment-strategy-evaluation` ;
- branche de référence isolée : `breaktest-bootstrap` ;
- branche candidate C4 : `codex/c4-realized-equity-curve` ;
- `main` et le projet universitaire d'origine restent inchangés.

## Prochaine exécution autorisée

1. auditer le diff final de C4 et conserver une exécution GitHub Actions verte sur le head exact ;
2. fusionner C4 uniquement dans `breaktest-bootstrap` ;
3. synchroniser l'état canonique après fusion ;
4. ouvrir ensuite une branche isolée pour H2 — bases nettes du journal ;
5. ne rien fusionner dans `main`.
