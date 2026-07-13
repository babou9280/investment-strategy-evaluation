# Breaktest — audit technique initial et suivi des corrections

- Audit initial : 12 juillet 2026
- Source v0.2 : 132 899 octets, SHA-256 `5dd4614868be7d00b7966a1979621b2a42ff8db0c55ecbede047b93757304f00`
- Version fusionnée : H1 + C2 + C3 + C1 + C4, 158 682 octets, SHA-256 `ae5e1f9c94b6e39b335eccc145461b8b4bc8af135eda184706529ab020c438af`
- Candidate H2 : 166 862 octets, SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`

## 1. Conclusion exécutive

Le prototype est une application locale réellement interactive. Le chargement, la navigation, les contrôles, l'import CSV, le ledger, la méthodologie et l'export ont été exécutés dans Chromium.

Les défauts structurels H1, C2, C3, C1 et C4 sont corrigés et fusionnés dans `breaktest-bootstrap`. La candidate H2 corrige l'ignorance des bases nettes fournies par les journaux : elle sépare résultat simulé, brut observé, net fixe observé et full-cost observé, conserve leur provenance et empêche le double comptage des coûts.

H3 à H6 restent ouverts. Le produit n'est toujours ni une valorisation mark-to-market ni une simulation complète de portefeuille.

## 2. Architecture et build cumulatif

Le build déterministe exécute :

1. `materialize_breaktest.py` — H1 ;
2. `apply_c2_patch.py` — C2 ;
3. `apply_c3_patch.py` — C3 ;
4. `apply_c1_patch.py` — C1 ;
5. `apply_c4_patch.py` — C4 ;
6. `apply_h2_patch.py` — H2 ;
7. `build_breaktest.py` — orchestration.

Chaque étape vérifie l'empreinte de son entrée et de sa sortie.

## 3. Corrections structurelles validées

### H1 — validation numérique stricte

Les valeurs obligatoires `missing`, `invalid` et zéro réel sont distinguées. Les dérivations non ambiguës conservent leur provenance. Preuves : `docs/validation/H1_STRICT_NUMERIC_VALIDATION.md`.

### C2 — isolation temporelle

Chaque décision utilise uniquement les lignes backtest sorties strictement avant son entrée. Preuves : `docs/validation/C2_TEMPORAL_ISOLATION.md`.

### C3 — turnover chronologique

Le budget est consommé sur 365,25 jours dans l'ordre des dates ; l'edge ne classe que les opportunités simultanées. Preuves : `docs/validation/C3_CHRONOLOGICAL_TURNOVER.md`.

### C1 — réservation du capital

Le nominal complet est réservé jusqu'à la sortie et refusé sans redimensionnement lorsqu'il dépasse le capital libre. Preuves : `docs/validation/C1_CAPITAL_RESERVATION.md`.

### C4 — trésorerie réalisée aux sorties

Le nominal est libéré et le PnL est appliqué uniquement à la sortie ; les sorties précèdent les entrées de même date. La courbe est explicitement non mark-to-market. Preuves : `docs/validation/C4_REALIZED_EQUITY_CURVE.md`.

### H2 — bases nettes du journal — validé sur branche

**Défaut initial démontré :** une valeur full-cost fournie pouvait être ignorée et remplacée par un résultat recalculé à partir du brut.

La candidate H2 :

- normalise les paires PnL/rendement brut, net fixe et full-cost ;
- refuse toute valeur fournie explicitement invalide ;
- conserve le zéro réel ;
- dérive uniquement le membre manquant d'une paire ;
- utilise un fallback uniquement lorsque la paire optionnelle est entièrement absente ;
- conserve provenance, clés source et origine du fallback ;
- garde séparé le résultat simulé par Breaktest ;
- laisse les bases observées inchangées lorsque les coûts simulés changent ;
- permet de sélectionner la base rapportée et appliquée par C4 ;
- évite toute seconde soustraction des coûts ;
- conserve les paires incohérentes et les signale pour H4 ;
- utilise le PnL fourni comme autorité de redimensionnement, sans réconciliation silencieuse ;
- expose base et provenance dans l'interface, l'audit et l'export.

**Preuves :**

- build : 166 862 octets, SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf` ;
- GitHub Actions `29248248566` sur `580f3bfaca51897ab8a1ab438813a6e3e1996298` : réussite ;
- H1, H2 numérique, H1 navigateur, C2, C3, C1, C4, C4 capital libre négatif, H2 navigateur et `node --check` : réussite ;
- 40 bases net fixe observées, 16 full-cost observées et 24 fallbacks full-cost identifiés dans la démonstration.

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
- import et refus ferme des données numériques ambiguës ;
- H1, C2, C3, C1 et C4 ;
- sélection et conservation des bases observées H2 sur branche ;
- séparation observation / simulation et absence de double comptage ;
- provenance visible dans l'interface et l'export ;
- invariance temporelle des décisions et événements dans les scénarios couverts.

### Non validé

- exactitude de toutes les formules ;
- provenance de devise de tous les prix ;
- politique finale H4 ;
- valorisation quotidienne ou mark-to-market ;
- levier, appels de marge, intérêts, dividendes et flux externes ;
- compatibilité Safari/iPad complète ;
- sécurité exhaustive, performance à l'échelle et valeur commerciale.

## 6. Prochaine correction recommandée

Après fusion contrôlée de H2, corriger **H3 — provenance de devise du prix d'entrée** : un prix explicitement en euros doit rester inchangé, tandis qu'un prix en devise de cotation doit être converti exactement une fois avec une provenance auditée.
