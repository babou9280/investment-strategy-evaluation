# Breaktest — audit technique initial et suivi des corrections

- Audit initial : 12 juillet 2026
- Source v0.2 : 132 899 octets, SHA-256 `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`
- Version fusionnée : H1 + C2 + C3 + C1 + C4 + H2, 166 862 octets, SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`

## 1. Conclusion exécutive

Le prototype est une application locale réellement interactive. Le chargement, la navigation, les contrôles, l'import CSV, le ledger, la méthodologie et l'export ont été exécutés dans Chromium.

H1, C2, C3, C1, C4 et H2 sont corrigés et fusionnés dans `breaktest-bootstrap`. H2 sépare résultat simulé, brut observé, net fixe observé et full-cost observé, conserve leur provenance et empêche le double comptage des coûts.

H3 à H6 restent ouverts. Le produit n'est toujours ni une valorisation mark-to-market ni une simulation complète de portefeuille.

## 2. Architecture et build cumulatif

Le build déterministe exécute H1, C2, C3, C1, C4 puis H2. Chaque étape vérifie l'empreinte de son entrée et de sa sortie.

## 3. Corrections structurelles validées

- **H1** : validation numérique stricte — `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md` ;
- **C2** : isolation temporelle — `docs/validation/C2_TEMPORAL_ISOLATION.md` ;
- **C3** : turnover chronologique — `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md` ;
- **C1** : réservation du capital — `docs/validation/C1_CAPITAL_RESERVATION.md` ;
- **C4** : trésorerie réalisée aux sorties — `docs/validation/C4_REALIZED_EQUITY_CURVE.md`.

### H2 — bases nettes du journal — corrigé et fusionné

H2 est fusionné par la pull request `#12`, commit squash `3504d448547bfeab9ef74114af3c08fb557a1c75`.

**Défaut initial :** une valeur full-cost fournie pouvait être ignorée et remplacée par un résultat recalculé depuis le brut.

La correction :

- normalise les paires PnL/rendement brut, net fixe et full-cost ;
- refuse les valeurs fournies invalides ;
- conserve le zéro réel ;
- dérive uniquement le membre manquant ;
- applique un fallback seulement lorsque la paire optionnelle est absente ;
- conserve provenance, clés source et origine du fallback ;
- sépare le résultat simulé des valeurs observées ;
- rend les bases observées indépendantes des hypothèses de coûts ;
- permet de sélectionner la base rapportée et appliquée par C4 ;
- interdit la double soustraction des coûts ;
- conserve et signale les paires incohérentes pour H4 ;
- utilise le PnL fourni comme autorité de redimensionnement ;
- expose base et provenance dans l'interface, l'audit et l'export.

**Preuves finales :**

- build : 166 862 octets, SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf` ;
- GitHub Actions `29248916855` sur `9539a9676ac1ac6d0a3bd1f470322c29b60edc96` : réussite ;
- H1, H2 numérique, Chromium H1, C2, C3, C1, C4, capital libre négatif, H2 navigateur et `node --check` : réussite ;
- démonstration : 40 bases net fixe observées, 16 full-cost observées et 24 fallbacks full-cost.

Détail : `docs/validation/H2_JOURNAL_NET_BASES.md`.

## 4. Défauts élevés encore ouverts

### H3 — provenance de devise du prix d'entrée

`entry_price_eur` peut encore être multiplié par `eurPerQuoteCurrency`, comme s'il s'agissait d'un prix en devise étrangère.

### H4 — réconciliation PnL / rendement / nominal

H2 signale les paires incohérentes mais ne définit pas encore la politique finale de résolution.

### H5 — injection de formule CSV

Les cellules textuelles commençant par `=`, `+`, `-` ou `@` ne sont pas neutralisées avant export.

### H6 — coût algorithmique

L'évaluation peut bloquer l'interface sur des imports moyens ou grands, particulièrement sur iPad.

## 5. Validé / non validé

### Validé par exécution

- application locale interactive ;
- H1, C2, C3, C1, C4 et H2 ;
- séparation observation / simulation ;
- sélection et conservation des bases observées ;
- absence de double comptage ;
- provenance visible dans l'interface et l'export ;
- invariance temporelle dans les scénarios couverts.

### Non validé

- exactitude exhaustive des formules ;
- provenance de devise de tous les prix ;
- politique finale H4 ;
- valorisation quotidienne ou mark-to-market ;
- levier, appels de marge, intérêts, dividendes et flux externes ;
- compatibilité Safari/iPad complète ;
- sécurité exhaustive, performance à l'échelle et valeur commerciale.

## 6. Prochaine correction recommandée

Corriger **H3 — provenance de devise du prix d'entrée** : un prix EUR doit rester inchangé et un prix en devise de cotation doit être converti exactement une fois avec une provenance auditée.
