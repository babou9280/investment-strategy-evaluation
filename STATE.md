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
6. `scripts/apply_h2_patch.py` — H2 ;
7. `scripts/build_breaktest.py` — point d'entrée unique.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- après H1 : `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c` ;
- après C2 : `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454` ;
- après C3 : `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80`, 142 782 octets ;
- après C1 : `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e`, 152 496 octets ;
- après C4 : `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af`, 158 682 octets ;
- candidate H2 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`, 166 862 octets.

## Fonctionnalités confirmées par exécution

- chargement local, navigation, recalcul du capital et paramètres de coûts ;
- import CSV et refus ferme des données numériques ambiguës ;
- export CSV, filtres, recherche, modal méthodologique et échappement HTML ;
- modèle d'entraînement antérieur propre à chaque décision ;
- allocation chronologique du turnover ;
- réservation du nominal entre entrée et sortie ;
- courbe de trésorerie réalisée aux sorties ;
- gains et pertes disponibles pour le financement seulement après réalisation ;
- sélection explicite entre résultat simulé, brut observé, net fixe observé et full-cost observé ;
- provenance observée, dérivée, fallback ou simulée conservée par ligne ;
- bases observées indépendantes des hypothèses de coûts ;
- absence de double comptage entre net observé et coûts simulés ;
- base sélectionnée exposée dans les KPI, le Trade Gate, le ledger, l'audit, la courbe et l'export.

Ces validations ne prouvent pas encore l'exactitude générale du moteur quantitatif ni une valorisation mark-to-market.

## Corrections fusionnées dans `breaktest-bootstrap`

- **H1** — validation numérique stricte : pull request `#2` ;
- **C2** — isolation temporelle et par échantillon : pull requests `#3` et `#5` ;
- **C3** — turnover chronologique : pull request `#6` ;
- **C1** — réservation du capital : pull request `#8`, commit `2d84a0fa06b5b28da2fbd16c2f704e0bb58ff284` ;
- **C4** — trésorerie réalisée aux sorties : pull request `#10`, commit `691ed5e669b82f8f4638d0b8a4f84ef8c5866be2`.

## Correction validée sur branche, en attente de fusion

### H2 — bases nettes observées du journal

La candidate `codex/h2-journal-net-bases` normalise et conserve quatre bases distinctes : simulée, brute observée, nette fixe observée et full-cost observée.

Règles validées :

- valeurs fournies invalides : refus du lot ;
- zéro observé : valeur valide ;
- dérivation d'un membre manquant uniquement à partir de l'autre membre et du nominal ;
- fallback uniquement lorsque la paire optionnelle est entièrement absente ;
- provenance et origine du fallback conservées ;
- valeurs PnL/rendement incompatibles conservées et signalées pour H4 ;
- PnL fourni utilisé comme autorité de redimensionnement, sans réconciliation silencieuse ;
- coûts simulés sans effet sur les bases observées ;
- C4 utilise la base choisie sans double soustraction des coûts.

Validations de référence :

- build : 166 862 octets, SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf` ;
- GitHub Actions `29248248566` sur le head `580f3bfaca51897ab8a1ab438813a6e3e1996298` : réussite ;
- H1, H2 numérique, H1 navigateur, C2, C3, C1, C4, C4 capital libre négatif et H2 navigateur : réussite ;
- JavaScript construit : `node --check` réussi.

Preuves : `docs/validation/H2_JOURNAL_NET_BASES.md`.

## Défauts élevés encore ouverts

1. **H3** — prix en euros reconvertis comme une devise étrangère ;
2. **H4** — politique définitive de réconciliation PnL / rendement / nominal ;
3. **H5** — injection de formule dans l'export CSV ;
4. **H6** — coût algorithmique élevé sur les imports moyens.

## Ce qui n'est pas encore considéré comme validé

- exactitude de chaque formule et conformité complète aux journaux sources ;
- provenance de devise de tous les champs de prix ;
- réconciliation définitive des paires PnL/rendement incohérentes ;
- valorisation mark-to-market ou quotidienne ;
- levier, appels de marge, intérêts, dividendes et flux externes ;
- robustesse étendue des imports, sécurité exhaustive et performance à l'échelle ;
- compatibilité complète Safari/iPad/mobile ;
- calibration définitive du Breaktest Score ;
- valeur commerciale et disposition à payer.

## Hébergement GitHub

- dépôt d'amorçage : `babou9280/investment-strategy-evaluation` ;
- branche de référence : `breaktest-bootstrap` ;
- branche candidate H2 : `codex/h2-journal-net-bases` ;
- `main` et le projet universitaire d'origine restent inchangés.

## Prochaine exécution autorisée

1. retirer l'artefact temporaire de revue H2 du workflow ;
2. réexécuter toutes les validations sur le head final ;
3. fusionner H2 uniquement dans `breaktest-bootstrap` si cette exécution reste verte ;
4. synchroniser les documents de fusion ;
5. ouvrir ensuite une branche isolée pour H3 ;
6. ne rien fusionner dans `main`.
