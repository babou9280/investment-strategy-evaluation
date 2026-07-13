# Breaktest - état actuel

## Version

Prototype local-first 0.1, consolidé et audité initialement le 12 juillet 2026.

## Build canonique

`app/Breaktest_Studio.html` est le fichier canonique provisoire. La source v0.2 auditée est conservée dans sept fragments immuables sous `app/.bundle/`.

Le build cumulatif exécute H1, C2, C3, C1, C4 puis H2 via `scripts/build_breaktest.py`.

Empreintes :

- source v0.2 : `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00` ;
- après H1 : `f4be9f41ce33f52f11f3387f7055fa9b1d951618ee8505352eaa7247cdc9353c` ;
- après C2 : `e4ce6dd3c545549a58d453c7c4df72f96e197fb29d2dc82c662dfbaab64c0454` ;
- après C3 : `b94b4a5b6e48b14e30a867bc3fb05beae112897fbf04015f7c77a7ffe796cb80`, 142 782 octets ;
- après C1 : `e592046804c4ddaaa3b834ff580bef3e373c3f69a8f93dea027b4bb4fc537f2e`, 152 496 octets ;
- après C4 : `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af`, 158 682 octets ;
- version fusionnée après H2 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`, 166 862 octets.

## Fonctionnalités confirmées par exécution

- application locale interactive, import/export, filtres et audit ;
- validation numérique stricte ;
- modèle antérieur propre à chaque décision ;
- turnover chronologique ;
- réservation du nominal ;
- trésorerie réalisée aux sorties ;
- sélection entre résultat simulé, brut observé, net fixe observé et full-cost observé ;
- provenance observée, dérivée, fallback ou simulée conservée par ligne ;
- bases observées indépendantes des hypothèses de coûts ;
- absence de double comptage ;
- base sélectionnée visible dans les KPI, le Trade Gate, le ledger, l'audit, la courbe et l'export.

## Corrections fusionnées dans `breaktest-bootstrap`

- **H1** : pull request `#2` ;
- **C2** : pull requests `#3` et `#5` ;
- **C3** : pull request `#6` ;
- **C1** : pull request `#8`, commit `2d84a0fa06b5b28da2fbd16c2f704e0bb58ff284` ;
- **C4** : pull request `#10`, commit `691ed5e669b82f8f4638d0b8a4f84ef8c5866be2` ;
- **H2** : pull request `#12`, commit `3504d448547bfeab9ef74114af3c08fb557a1c75`.

### H2 — bases nettes observées du journal

H2 normalise et conserve quatre bases distinctes : simulée, brute observée, nette fixe observée et full-cost observée.

Sont validés : refus des valeurs fournies invalides, zéro réel, dérivations contrôlées, fallbacks explicites, conservation des incohérences pour H4, PnL fourni comme autorité de redimensionnement, indépendance des bases observées face aux coûts simulés et utilisation par C4 sans double soustraction.

Preuves finales :

- build : 166 862 octets, SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf` ;
- GitHub Actions `29248916855` sur le head exact `9539a9676ac1ac6d0a3bd1f470322c29b60edc96` : réussite ;
- H1, H2 numérique, Chromium H1, C2, C3, C1, C4, capital libre négatif, H2 navigateur et `node --check` : réussite.

Détail : `docs/validation/H2_JOURNAL_NET_BASES.md`.

## Défauts élevés encore ouverts

1. **H3** — provenance de devise du prix d'entrée ;
2. **H4** — politique définitive de réconciliation PnL / rendement / nominal ;
3. **H5** — injection de formule dans l'export CSV ;
4. **H6** — coût algorithmique élevé.

## Non validé

- exactitude exhaustive des formules ;
- provenance de devise de tous les prix ;
- politique finale H4 ;
- valorisation mark-to-market ;
- levier, appels de marge, intérêts, dividendes et flux externes ;
- compatibilité Safari/iPad complète ;
- sécurité exhaustive, performance à l'échelle et valeur commerciale.

## Hébergement GitHub

- dépôt : `babou9280/investment-strategy-evaluation` ;
- branche de référence : `breaktest-bootstrap` ;
- H2 est fusionné ;
- la prochaine branche active doit être dédiée à H3 ;
- `main` reste inchangé.

## Prochaine exécution autorisée

1. fusionner cette synchronisation documentaire ;
2. créer une branche isolée H3 ;
3. exécuter `NEXT_CODEX_PROMPT.md` ;
4. préserver toutes les validations H1 à H2 ;
5. ne rien fusionner dans `main`.
