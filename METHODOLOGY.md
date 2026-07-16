# Breaktest — méthodologie actuelle

## 1. Couches distinctes

Breaktest conserve cinq niveaux méthodologiques séparés :

1. **moteur historique** : audit de journaux et backtests, validé jusqu'à H2 et C1–C4 ;
2. **calculateur Q0** : coût descriptif pré-transaction, techniquement validé mais non publié ;
3. **Capital Efficiency** : seuil, plancher, survie ponctuelle et contraintes inverses ;
4. **Edge Survival Envelope** : sensibilité déterministe basse / centrale / haute, fusionnée après validation technique interne ;
5. **Cost Gate foundation et critique** : orchestration synthétique de snapshots, cash, alignement de l'avantage et constats multiples ; moteur isolé démontré par CG-01 à CG-18 puis interface hors ligne techniquement exécutée, sans donnée réelle ni validation utilisateur.

Aucune couche n'est commercialement validée. La preuve Cost Gate couvre seulement le domaine cash long synthétique déclaré.

## 2. Principes généraux

- Calcul déterministe à partir d'entrées explicites.
- Aucun rendement inventé.
- Zéro réel distinct d'une absence.
- Entrée invalide distincte d'une entrée manquante.
- Aucun arrondi interne.
- Provenance attachée aux valeurs.
- Résultats observés séparés des scénarios simulés.
- Toute égalité importante traitée avec une tolérance documentée.
- Toute sortie dépendante d'une entrée facultative devient indisponible, pas faussement nulle.
- Aucune frontière mathématique présentée comme recommandation.

## 3. Entrées du scénario de friction

### 3.1 Entrées obligatoires

```text
order_notional_eur = N > 0
side_count = k ∈ {1, 2}
commission_per_side_eur = C >= 0
fx_rate_per_side = F ∈ [0, 1]
spread_total_rate = S ∈ [0, 1]
slippage_total_rate = L ∈ [0, 1]
```

Convention :

- commission et change sont saisis par côté ;
- spread et slippage représentent déjà le scénario complet ;
- `k = 1` correspond à un achat simple dans le modèle ;
- `k = 2` correspond à un aller-retour complet.

### 3.2 Entrées facultatives

```text
reference_capital_eur = K > 0 ou absent
monthly_operations = m >= 0 ou absent
gross_edge_rate = G ou absent
gross_edge_low_rate = G_low ou absent
gross_edge_base_rate = G_base ou absent
gross_edge_high_rate = G_high ou absent
retention_target_rate = R ∈ [0, 1] ou absent
annual_drag_budget_rate = B ∈ [0, 1] ou absent
target_net_rate = Q ou absent
```

Capital et fréquence ne sont pas requis pour calculer le seuil par opération.

## 4. Géométrie de friction

```text
fixed_cost_eur = k * C
variable_floor_rate = k * F + S + L
variable_cost_eur = N * variable_floor_rate
total_cost_eur = fixed_cost_eur + variable_cost_eur
break_even_gross_rate = total_cost_eur / N
```

Interprétation :

- `fixed_cost_eur / N` se dilue lorsque le nominal augmente ;
- `variable_floor_rate` ne diminue pas avec le nominal dans ce modèle ;
- `break_even_gross_rate` est le rendement brut nécessaire pour seulement couvrir les frictions saisies.

Invariant :

```text
break_even_gross_rate >= variable_floor_rate
```

## 5. Structure du coût

Lorsque `total_cost_eur > 0` :

```text
fixed_cost_share = fixed_cost_eur / total_cost_eur
variable_cost_share = variable_cost_eur / total_cost_eur
fixed_cost_share + variable_cost_share = 1
```

Lorsque `variable_floor_rate > 0` :

```text
fixed_variable_equal_order = fixed_cost_eur / variable_floor_rate
```

Cette valeur indique le nominal où coût fixe et coût variable sont égaux dans le modèle. Elle ne constitue pas une taille recommandée.

## 6. Définition de l'avantage brut

`G` signifie actuellement :

> moyenne brute arithmétique par opération complète, gains, pertes et opérations nulles inclus, avant les coûts saisis, rapportée au nominal compatible avec le scénario.

Pour une opération `i` :

```text
gross_return_i = gross_pnl_i / order_notional_i
```

Lorsque les notionnels diffèrent :

```text
trade_equal_weighted_mean = mean(gross_return_i)
capital_weighted_rate = sum(gross_pnl_i) / sum(order_notional_i)
```

Ces estimateurs ne sont pas interchangeables. Le prototype demande une hypothèse utilisateur et ne choisit pas silencieusement une méthode d'agrégation.

Ne sont pas des substituts valides :

- taux de réussite ;
- gain moyen des gagnants ;
- rendement annuel ;
- performance totale du compte ;
- alpha, Sharpe ou payoff ratio ;
- objectif personnel ;
- rendement déjà net de coûts.

Voir `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md`.

## 7. Mode seuil uniquement

Lorsque aucune valeur brute n'est fournie :

```text
edge_mode = threshold_only
primary_state = threshold_only
```

Sorties principales :

- seuil brut ;
- plancher variable ;
- coût fixe ;
- coût total ;
- sensibilité à la taille.

Aucune marge, rétention ou absorption n'est inventée.

## 8. Mode point

Lorsque `G` seul est fourni :

```text
edge_mode = point_estimate
net_edge_rate = G - break_even_gross_rate
gross_edge_eur = N * G
net_edge_eur = gross_edge_eur - total_cost_eur
```

Si `G > 0` :

```text
edge_absorption_rate = break_even_gross_rate / G
edge_retained_rate = net_edge_rate / G
edge_absorption_rate + edge_retained_rate = 1
```

Si `G <= 0`, absorption et rétention sont indisponibles.

Classification avec tolérance :

```text
edge_fully_absorbed si G est au niveau ou sous le seuil
edge_partially_retained si G dépasse le seuil sans cible satisfaite explicite
retention_target_met si une cible R est fournie et satisfaite
```

Un point positif sans cible de rétention ne peut jamais laisser l'état principal nul.

## 9. Mode fourchette

Le mode `range_estimate` exige exactement :

```text
G_low <= G_base <= G_high
```

Aucune valeur ponctuelle ne peut être fournie simultanément. Une fourchette partielle, mélangée ou mal ordonnée est invalide.

Pour chaque hypothèse `G_i` :

```text
net_edge_rate_i = G_i - break_even_gross_rate
net_edge_eur_i = N * net_edge_rate_i
headroom_to_break_even_i = G_i - break_even_gross_rate
headroom_to_variable_floor_i = G_i - variable_floor_rate
```

États face au seuil :

```text
survives_full_range si G_low dépasse strictement le seuil
fails_full_range si G_high est au niveau ou sous le seuil
crosses_break_even sinon
```

États face au plancher :

```text
structurally_unreachable_full_range si G_high est au niveau ou sous le plancher
above_variable_floor_full_range si G_low dépasse strictement le plancher
variable_floor_crossing sinon
```

Une fourchette dégénérée reste une fourchette et est marquée `degenerate`.

La fourchette décrit une sensibilité, jamais une probabilité ou un intervalle de confiance.

## 10. Tolérance numérique

Le moteur utilise :

```text
close(a, b) = abs(a - b) <= tolerance * max(1, abs(a), abs(b))
```

Avec :

```text
tolerance = 1e-12
strictly_above(a, b) = a > b et non close(a, b)
at_or_below(a, b) = a < b ou close(a, b)
```

Les modes point et fourchette utilisent les mêmes fonctions autour du seuil et du plancher.

## 11. Frontière pour une marge positive

Définir :

```text
positive_denominator = G - variable_floor_rate
```

Si `G` est au niveau ou sous le plancher :

```text
minimum_order_for_positive_net = unavailable
reason = structurally_unreachable
```

Sinon :

```text
minimum_order_for_positive_net = fixed_cost_eur / positive_denominator
```

Si le coût fixe est nul, la frontière mathématique vaut zéro avec la qualification :

```text
no_positive_minimum_from_fixed_costs
```

L'interface ne recommande jamais un ordre nul.

## 12. Frontière pour une rétention cible

Pour une cible `R` :

```text
retention_denominator = G * (1 - R) - variable_floor_rate
```

- dénominateur négatif : `structurally_unreachable` ;
- dénominateur nul dans la tolérance et coût fixe positif : aucune taille finie ;
- dénominateur nul et coût fixe nul : cible exactement satisfaite pour toute taille strictement positive ;
- dénominateur positif :

```text
minimum_order_for_retention = fixed_cost_eur / retention_denominator
```

## 13. Sorties annuelles facultatives

Lorsque `m` est fourni :

```text
annual_operations = 12 * m
annual_cost_eur = total_cost_eur * annual_operations
```

Lorsque `G` est aussi fourni :

```text
annual_gross_edge_eur = gross_edge_eur * annual_operations
annual_net_edge_eur = net_edge_eur * annual_operations
```

Lorsque `K` est fourni :

```text
annual_drag_to_capital_rate = annual_cost_eur / K
annual_gross_edge_to_capital_rate = annual_gross_edge_eur / K
annual_net_edge_to_capital_rate = annual_net_edge_eur / K
```

Si `m` est absent, les sorties annuelles sont indisponibles avec `frequency_missing`.

Si `m` existe mais `K` est absent, les ratios au capital sont indisponibles avec `capital_missing`.

Ces projections sont arithmétiques. Elles ne modélisent ni capitalisation, ni positions simultanées, ni durée de détention, ni variation de nominal.

## 14. Fréquence frontière sous budget

Lorsque `B` et `K` sont fournis :

```text
max_monthly_operations_under_budget = (B * K) / (12 * total_cost_eur)
```

Cette frontière ne dépend pas de la fréquence actuelle. Elle reste donc calculable si `m` est absent.

Si le coût total est nul :

```text
unbounded_within_model
```

Aucun `Infinity` n'est produit.

## 15. Rendement brut requis pour une cible nette

Pour une marge nette cible `Q` :

```text
required_gross_rate_for_target_net = Q + break_even_gross_rate
```

Cette sortie est une contrainte arithmétique, pas une prévision.

## 16. Sensibilités

### Taille

Pour des facteurs prédéfinis :

```text
threshold(N * factor) = fixed_cost_eur / (N * factor) + variable_floor_rate
```

Le seuil doit être non croissant avec la taille et converger vers le plancher variable.

### Fréquence

Lorsque `m` est fourni :

```text
annual_cost(m * factor) = total_cost_eur * m * factor * 12
```

Le coût annuel est proportionnel à la fréquence. Le seuil par opération reste inchangé.

Si `m` est absent, la sensibilité de fréquence est une liste vide, pas une série inventée.

## 17. Provenance et fraîcheur de l'interface

L'interface distingue :

```text
user_assumption
synthetic_demo
```

Règles :

- le formulaire initial ne contient aucune hypothèse financière préremplie ;
- achat simple / aller-retour n'est pas sélectionné silencieusement ;
- l'exemple complet charge explicitement un scénario synthétique ;
- toute modification d'entrée masque immédiatement le résultat précédent ;
- une erreur de validation ne laisse aucun ancien résultat visible ;
- la définition de l'avantage brut est affichée avant saisie.

## 18. Cost Gate foundation — méthodologie contractuelle

La taille frontière ne prouve pas sa faisabilité. Le périmètre synthétique est limité à un compte cash, un achat long sans levier et une action ou un ETF au comptant.

La faisabilité immédiate distingue :

```text
reference_capital_eur
strategy_capital_eur
strategy_capital_committed_eur
available_settled_cash_eur
account_free_settled_cash_eur
strategy_allocation_headroom_eur
capital_feasibility_cash_eur
entry_cash_requirement_eur
lifecycle_friction_eur
```

Règles :

- le cash fourni par une source déclare s'il inclut déjà chaque hold ;
- la base brute/nette, `source_included_hold_ids[]` et les indicateurs du ledger doivent concorder exactement ;
- un `hold_id` n'est déduit qu'une fois ;
- le plafond de faisabilité est le minimum entre cash réglé réconcilié et allocation de stratégie encore libre ;
- l'engagement d'entrée exclut les coûts de sortie futurs ;
- spread et slippage incorporés au prix ne sont pas ajoutés une deuxième fois au cash ;
- quantité × prix est réconciliée avec la considération cash et le nominal du scénario ;
- commission et change d'entrée sont réconciliés avec les mêmes coûts par côté du cycle ; un change non nul entre devises identiques invalide la friction même sans vue cash ;
- une taxe ou un frais contractuel d'entrée absent du modèle de cycle rend la friction incomplète et Edge Survival indisponible ;
- `entry_leg` exige un côté et `complete_round_trip` deux côtés ; `exit_leg` reste hors périmètre ;
- `G` doit être aligné sur instrument, place, direction, portée, horizon, dénominateur, prix, devise, coûts, estimateur et période ;
- la sortie conserve `findings[]` ; une synthèse n'efface aucun constat ;
- toute mutation rend les anciens constats obsolètes et toute expiration les rend inactifs même si le hash de contenu reste identique ;
- une source future est invalide ; identité, place, devise, caractère critique et heure d'évaluation sont obligatoires ; seules les sources critiques déterminent l'expiration agrégée et aucune source stale ne peut coexister avec un constat positif d'actualité globale ;
- l'ordre des holds, sources, contraintes et exclusions sans signification économique ne modifie pas le hash ;
- une collection ou un élément mal formé, ainsi qu'un identifiant stable dupliqué, n'est jamais remplacé par une liste vide ;
- marge, short, dérivés et cash réglé non identifiable restent `unsupported_scope`.

Les autorités spécifiques sont `PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md`, `COST_GATE_SNAPSHOT_CONTRACT.md`, `COST_GATE_FINDINGS_CONTRACT.md` et `GROSS_EDGE_ALIGNMENT_KEY.md`.

La révision courante utilise `cost-gate-foundation-3-synthetic`, `cost-gate-snapshot-4` et `cost-gate-findings-4`. Le head fonctionnel `753152d9cce1feabba48e54b32b4eed2ce3f5e07` a réussi le run exact `#616` (`29345208179`) ; l'artefact, les logs et les captures ont été inspectés. Cette preuve ne couvre aucun comportement sur compte, donnée ou exécution réels. Aucune règle n'est une recommandation.

## 19. Méthodologie Cost Ledger v1

La prochaine architecture représente chaque coût comme un composant versionné plutôt que comme un champ isolé.

Chaque composant déclare :

- identité de représentation, identité d'événement économique et catégorie ;
- côté et portée de cycle ;
- forme de calcul et base ;
- devise et convention de signe ;
- benchmark ou absence explicite de benchmark ;
- inclusion dans prix, avantage et cash ;
- provenance, qualité de preuve et validité temporelle ;
- incertitude et version ;
- dépendances réservées et statut ; v1 refuse toute dépendance non vide tant que sa propagation n'est pas définie.

Le coût total est la somme des seuls composants valides, applicables, réconciliés et convertis sur une base commune. Une somme partielle reste un `known_cost_floor` uniquement sous l'ontologie déclarée de coûts adverses non négatifs. Elle n'est pas qualifiée de friction complète. Même une collection sans erreur n'est déclarée `complete_under_declared_policy` que si chaque événement attendu par une politique nommée est présent exactement une fois.

Le modèle distingue trois familles :

```text
contractuel
estimé ex ante
observé ex post
```

Une fourchette basse, centrale et haute est une sensibilité tant qu'aucune méthode statistique et couverture ne sont validées. Un benchmark absent n'est jamais remplacé par un mid implicite. Une forme non linéaire ou conditionnelle non supportée reste non évaluée.

La calculabilité arithmétique, la qualité de preuve et l'actualité restent trois états distincts. L'adaptateur legacy reproduit exactement le coût, le seuil, la marge et les constats actuels avant toute migration. Les règles complètes sont dans `docs/standards/COST_LEDGER_CONTRACT.md` et les falsifications dans `docs/scenarios/COST_LEDGER_V1_MATRIX.md`.

## 20. Méthodologie Cost Survival Surface v1

Un ledger est un snapshot. Une surface multi-taille exige une politique de projection distincte : tailles explicites, domaine déclaré, transformation de chaque base et stabilité supposée des paramètres.

Pour chaque taille, les trois coûts sont croisés avec les trois avantages par produit cartésien. Les neuf cellules calculent brut, coût, seuil et marge. L'égalité reste `at_threshold_no_positive_margin` ; elle n'est jamais promue en marge positive par arrondi.

Une frontière exacte est permise uniquement si les coûts restent fixes plus proportionnels dans le domaine et si l'avantage est déclaré constant. Un avantage fourni séparément par taille produit uniquement des changements discrets sans interpolation. La surface reste `notional_only_not_executable` : elle ne traite ni quantité, lot, liquidité, impact, fill, fréquence ou capital temporel.

Les règles complètes sont dans `docs/standards/COST_SURVIVAL_SURFACE_CONTRACT.md` et les scénarios CSS-01 à CSS-30 dans `docs/scenarios/COST_SURVIVAL_SURFACE_V1_MATRIX.md`.

## 21. Méthodologie historique conservée

### H1 — normalisation

- nominal fini et strictement positif ;
- au moins un membre brut PnL/rendement valide ;
- dérivation uniquement depuis des valeurs valides ;
- zéro conservé ;
- provenance conservée.

### H2 — bases de résultat

- brut observé ;
- net fixe observé ;
- full-cost observé ;
- scénario Breaktest simulé.

Une base observée n'est jamais écrasée ni débitée deux fois.

### C2 — isolation temporelle

Chaque décision utilise uniquement des observations admissibles sorties strictement avant son entrée.

### C3 — turnover

Budget consommé chronologiquement sur 365,25 jours, sans priorité globale par edge entre dates différentes.

### C1 — réservation du capital

Nominal complet réservé entre entrée et sortie ; aucune réduction implicite ; priorité de même date conservée.

### C4 — trésorerie réalisée

Sorties avant entrées le même jour ; PnL appliqué une fois à la sortie ; réconciliation du capital réalisé, réservé et libre.

L'expression autorisée reste « trésorerie réalisée aux sorties », pas mark-to-market.

## 22. Limites actuelles

Le prototype ne modélise pas :

- rendement futur ;
- fiscalité ;
- impact de marché calibré ;
- frais réglementaires spécifiques ;
- financement, intérêts, levier ou marge ;
- vente à découvert ;
- exécution partielle ;
- positions simultanées dans les projections Q0/Capital Efficiency ;
- durée de détention ;
- capital réellement disponible ;
- corporate actions ;
- données contractuelles de courtier ;
- incertitude statistique issue d'un historique réel.

Les défauts historiques H3 à H6 restent suspendus jusqu'à preuve d'un besoin produit direct.

## 22. Validation

Le moteur et l'interface doivent réussir :

- oracles de référence ;
- invariants de réconciliation ;
- cas absent, invalide, nul, négatif et positif ;
- conflits entre modes ;
- fourchettes partielles et mal ordonnées ;
- égalités et voisinage de tolérance ;
- cohérence point / fourchette ;
- entrées annuelles absentes ;
- non-finis ;
- fraîcheur du résultat ;
- Chromium 390/768/1024/1440 ;
- clavier, focus, `aria-live` et overflow ;
- intégrité locale ;
- syntaxe ;
- non-régressions H1–H2/C1–C4 et Q0.

Une exécution verte ne prouve ni compréhension, ni conformité, ni valeur commerciale.
