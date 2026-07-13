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
5. `scripts/build_breaktest.py` — point d'entrée unique.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- après H1 : `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c` ;
- après C2 : `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454` ;
- après C3 : `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80`, 142 782 octets ;
- version fusionnée après C1 : `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e`, 152 496 octets.

## Fonctionnalités confirmées par exécution

- chargement local, navigation, recalcul du capital et paramètres de coûts ;
- import CSV nominal et refus ferme des données numériques ambiguës ;
- export CSV nominal, filtres, recherche, modal méthodologique et échappement HTML ;
- modèle d'entraînement antérieur propre à chaque décision ;
- allocation chronologique du turnover sur 365,25 jours ;
- réservation du nominal entre entrée et sortie ;
- refus sans redimensionnement implicite lorsque les positions simultanées dépassent le capital ;
- diagnostics de modèle, turnover et financement par décision.

Ces validations ne prouvent pas encore l'exactitude générale du moteur quantitatif ni une courbe temporelle de portefeuille.

## Corrections fusionnées dans `breaktest-bootstrap`

### H1 — validation numérique stricte

Fusionnée par la pull request `#2`. Le moteur distingue `valid`, `missing` et `invalid`, refuse les lots ambigus et conserve la provenance des dérivations. Preuves : `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### C2 — isolation temporelle et par échantillon

Fusionnée par les pull requests `#3` et `#5`. Chaque décision utilise uniquement les lignes backtest valides dont la sortie est strictement antérieure à son entrée. Preuves : `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### C3 — allocation chronologique du turnover

Fusionnée par la pull request `#6`. Le budget est consommé chronologiquement et une opportunité future ne peut pas modifier une décision antérieure. Preuves : `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md`.

### C1 — réservation du capital entre positions simultanées

Fusionnée par la pull request `#8`, commit squash `2d84a0fa06b5b28da2fbd16c2f704e0bb58ff284`.

C1 réserve le nominal complet des décisions financées, libère les positions antérieures avant chaque groupe de même date, préserve la priorité C3, interdit le recyclage intragroupe et refuse un nominal insuffisant sans redimensionnement. Les dates ou chronologies invalides produisent `observe`. Le PnL ne modifie pas encore le capital disponible.

Validations finales :

- build H1 + C2 + C3 + C1 : 152 496 octets, SHA-256 `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e` ;
- GitHub Actions `29215480281` : réussite ;
- suites H1, C2, C3 et C1 : réussite ;
- Chromium et `node --check` : réussite ;
- scénarios de chevauchement, non-chevauchement, égalité de date, priorité simultanée, dates invalides, capital nul/exact et invariance au futur couverts.

Preuves : `docs/validation/C1_CAPITAL_RESERVATION.md`.

## Défaut critique encore ouvert

1. **C4 — courbe de capital non temporelle** : le PnL est encore affecté selon l'entrée ; la courbe n'est ni une trésorerie réalisée aux sorties ni une valeur mark-to-market et le PnL réalisé ne modifie pas encore le financement ultérieur.

## Défauts élevés encore ouverts

1. champs de PnL net/full-cost du journal ignorés ;
2. prix en euros reconvertis comme une devise étrangère ;
3. absence de réconciliation PnL / rendement / nominal ;
4. risque d'injection de formule dans l'export CSV ;
5. coût algorithmique élevé sur les imports moyens.

## Ce qui n'est pas encore considéré comme validé

- exactitude de chaque formule et conformité complète aux journaux sources ;
- courbe de trésorerie réalisée ou mark-to-market ;
- réinvestissement chronologique du PnL, levier, appels de marge, intérêts et flux externes ;
- robustesse étendue des imports, sécurité exhaustive et performance à l'échelle ;
- compatibilité complète Safari/iPad/mobile ;
- calibration définitive du Breaktest Score ;
- cohérence complète du deck et du guide ;
- valeur commerciale et disposition à payer.

## Hébergement GitHub

- dépôt d'amorçage : `babou9280/investment-strategy-evaluation` ;
- branche de référence isolée : `breaktest-bootstrap` ;
- branche active C4 : `codex/c4-realized-equity-curve` ;
- `main` et le projet universitaire d'origine restent inchangés.

## Prochaine exécution autorisée

1. travailler uniquement sur `codex/c4-realized-equity-curve` ;
2. construire une simulation événementielle de trésorerie réalisée aux sorties, cohérente avec C1 ;
3. réexécuter H1, C2, C3 et C1 et ajouter les invariants C4 ;
4. auditer la pull request avant toute fusion dans `breaktest-bootstrap` ;
5. ne rien fusionner dans `main`.
