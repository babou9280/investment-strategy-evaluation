# Breaktest — méthodologie actuelle

## 1. Statut méthodologique

Breaktest possède trois couches distinctes :

1. **moteur historique validé** : audit de journaux et backtests, fusionné jusqu'à H2 ;
2. **calculateur Cost Intelligence Q0 validé techniquement** : calculateur pré-transaction descriptif ;
3. **Capital Efficiency Lab validé techniquement** : seuil brut, plancher variable, survie de l'avantage et contraintes inverses.

Aucune de ces couches n'est commercialement validée tant qu'elle n'a pas été confrontée à des utilisateurs réels et à des paiements.

## 2. Méthodologie du calculateur Q0

Le calculateur utilise uniquement des paramètres fournis par l'utilisateur et des scénarios synthétiques explicitement identifiés.

### Entrées

- capital en euros, strictement positif lorsqu'il est fourni ;
- montant d'ordre en euros, strictement positif ;
- nombre d'opérations mensuelles, supérieur ou égal à zéro ;
- achat simple ou aller-retour ;
- commission par côté, supérieure ou égale à zéro ;
- taux de change par côté, compris entre 0 et 100 % ;
- spread total estimé, compris entre 0 et 100 % ;
- slippage total estimé, compris entre 0 et 100 %.

### Formules

Pour un nombre de côtés `k` :

- `commission = k × commission_par_côté` ;
- `change = k × taux_change_par_côté × montant_ordre` ;
- `spread = taux_spread_total × montant_ordre` ;
- `slippage = taux_slippage_total × montant_ordre` ;
- `coût_total = commission + change + spread + slippage` ;
- `coût_ordre_pct = coût_total / montant_ordre` ;
- `coût_annuel = coût_total × opérations_mensuelles × 12` ;
- `coût_capital_pct = coût_annuel / capital` lorsque le capital est disponible ;
- `seuil_brut_pct = coût_ordre_pct`.

Le `seuil_brut_pct` indique le rendement brut nécessaire pour couvrir les frictions du scénario. Il ne constitue ni un objectif de rendement ni une recommandation d'effectuer l'opération.

### Précision

- calculs internes non arrondis ;
- arrondi uniquement à l'affichage ;
- composantes visibles avant agrégation ;
- scénarios comparés sans classement ;
- zéro réel distinct d'une absence ;
- absence, invalidité et zéro distingués.

### Provenance des coûts

Chaque valeur doit porter une nature explicite :

- `observed` : présente dans un relevé ;
- `contractual` : issue d'un barème sourcé et daté ;
- `estimated` : estimée par une méthode documentée ;
- `user_assumption` : saisie par l'utilisateur ;
- `synthetic_demo` : scénario construit et non observé.

Une estimation ne peut jamais être présentée comme un coût réellement payé.

## 3. Limites du calculateur Q0

Le calculateur initial ne modélise pas :

- fiscalité personnelle ;
- rendement futur ;
- qualité globale d'un courtier ;
- probabilité de gain ;
- coût d'opportunité ;
- impact de marché calibré ;
- intérêts, financement ou appels de marge ;
- transmission ou exécution d'ordres.

Il ne recommande ni actif, ni courtier, ni fréquence, ni taille d'ordre.

## 4. Méthodologie future du Cost Tracker

Cette couche reste conditionnelle à la validation commerciale.

Lorsqu'un historique est importé, Breaktest devra distinguer :

- commissions observées ;
- frais de change observés ou contractuels ;
- coûts implicites estimés ;
- performance brute observée ;
- performance nette observée ;
- scénarios recalculés.

Toute agrégation devra se réconcilier avec les lignes sources. Les coûts estimés devront être séparés et accompagnés d'une plage ou d'une hypothèse explicite lorsque l'incertitude est matérielle.

## 5. Bases de résultat du moteur historique — règle H2

Le moteur validé conserve quatre bases séparées :

- **Brut observé** : PnL/rendement brut fourni ;
- **Net fixe observé** : PnL/rendement net fixe fourni, avec fallback explicite vers le brut lorsque la paire est entièrement absente ;
- **Full-cost observé** : PnL/rendement full-cost fourni, avec fallback explicite vers le net fixe lorsque la paire est entièrement absente ;
- **Simulé par Breaktest** : brut observé redimensionné au nominal de la position, diminué des coûts du scénario actif.

Règles :

- une valeur explicitement invalide refuse le lot ;
- un zéro réel reste valide ;
- si seul le PnL est présent, le rendement est dérivé par `PnL / nominal` ;
- si seul le rendement est présent, le PnL est dérivé par `rendement × nominal` ;
- si une paire optionnelle est entièrement absente, le fallback et son origine sont conservés ;
- si PnL et rendement sont incompatibles, les deux restent visibles et l'anomalie est signalée ;
- lors d'un redimensionnement, le PnL fourni est mis à l'échelle ;
- la provenance reste attachée à chaque ligne.

Les hypothèses de coûts ne modifient jamais une base observée et ne sont jamais soustraites une seconde fois d'un net observé.

## 6. Normalisation numérique historique — règle H1

- nominal présent, fini et strictement positif ;
- au moins un des champs brut PnL/rendement présent et valide ;
- valeur non numérique, `NaN` ou infinie refusée ;
- dérivation uniquement depuis des valeurs valides ;
- zéro réel conservé ;
- provenance conservée.

## 7. Isolation temporelle — règle C2

Chaque trade rejoué est évalué avec son propre modèle :

- seules les lignes backtest peuvent entraîner le modèle ;
- la ligne évaluée est exclue ;
- dates valides et cohérentes ;
- sortie d'entraînement strictement antérieure à l'entrée de la décision ;
- sorties de même date, lignes futures et live exclues ;
- date invalide classée `observe` ;
- modèle, profondeur et exclusions conservés.

## 8. Turnover — règle C3

- décisions ordonnées par date d'entrée croissante ;
- budget consommé sur 365,25 jours glissants ;
- `remove` et `observe` ne consomment rien ;
- aucune priorité globale par edge entre dates différentes ;
- priorité déterministe pour les opportunités de même date ;
- aucune opportunité future ne change une décision passée.

## 9. Réservation du capital — règle C1

- évaluations groupées par date d'entrée ;
- priorité C3 conservée ;
- seules les décisions `keep` réservent le nominal complet ;
- aucune réduction implicite du nominal ;
- aucune libération au milieu d'un groupe de même date ;
- donnée invalide classée `observe` ;
- capital réalisé, réservé et libre auditables.

## 10. Trésorerie réalisée — règle C4

- simulation au capital initial ;
- sorties avant entrées de même date ;
- sortie libérant le nominal et appliquant une seule fois le PnL sélectionné ;
- aucun PnL avant sortie ;
- aucune contribution des décisions `remove` ou `observe` ;
- dernier point égal au capital initial plus les PnL sélectionnés des positions financées ;
- courbe qualifiée de **trésorerie réalisée aux sorties**, pas de mark-to-market.

## 11. Stress tests historiques

- augmentation des coûts ;
- retrait des meilleurs trades pour mesurer la concentration ;
- comparaison backtest/live-test ;
- risque de queue au niveau des trades ;
- réconciliation lignes/agrégats ;
- bootstrap conditionnel à l'échantillon fourni.

## 12. Limites techniques ouvertes

- H3 : provenance de devise du prix d'entrée ;
- H4 : politique définitive de réconciliation PnL/rendement/nominal ;
- H5 : protection de l'export contre l'injection de formule ;
- H6 : performances sur imports moyens et grands ;
- absence de valorisation mark-to-market ;
- absence de levier, intérêts, dividendes et flux externes ;
- bootstrap sans correction complète du biais de sélection, de dépendance temporelle ou de changement de régime.

H3 à H6 restent suspendus jusqu'à démonstration d'un besoin produit direct.

## 13. Breaktest Score historique

La proposition de score reste non prioritaire et non commercialement validée. Aucun score global ne doit être utilisé dans Cost Intelligence ou Capital Efficiency.

## 14. Capital Efficiency — contrat Edge Survival

Le laboratoire suit `docs/standards/EDGE_SURVIVAL_CONTRACT.md`, qui fait autorité pour les cas limites.

### 14.1 Entrées supplémentaires

- avantage brut moyen `G`, facultatif ;
- part cible conservée `R`, facultative ;
- budget annuel de friction `B`, facultatif ;
- marge nette cible `Q`, facultative.

Aucune valeur d'avantage brut n'est inventée. Une démonstration `synthetic_demo` reste explicitement non observée.

### 14.2 Décomposition structurelle

Pour un nominal `N`, un nombre de côtés `k`, une commission par côté `C`, un taux de change par côté `F`, un spread total `S` et un slippage total `L` :

- `fixed_cost_eur = k × C` ;
- `variable_floor_rate = k × F + S + L` ;
- `variable_cost_eur = N × variable_floor_rate` ;
- `total_cost_eur = fixed_cost_eur + variable_cost_eur` ;
- `break_even_gross_rate = total_cost_eur / N`.

Le coût fixe peut être dilué par une taille supérieure. Le plancher variable ne diminue pas avec `N` dans ce modèle.

### 14.3 Survie de l'avantage

Lorsque `G` est fourni :

- `net_edge_rate = G - break_even_gross_rate` ;
- `gross_edge_eur = N × G` ;
- `net_edge_eur = gross_edge_eur - total_cost_eur`.

Si `G > 0` :

- `edge_absorption_rate = break_even_gross_rate / G` ;
- `edge_retained_rate = net_edge_rate / G`.

Une rétention négative reste négative. Les ratios sont indisponibles lorsque `G <= 0`.

### 14.4 Frontière pour une marge nette positive

Définir :

`positive_denominator = G - variable_floor_rate`.

- si `positive_denominator <= 0`, la contrainte est `structurally_unreachable` ;
- si `positive_denominator > 0`, `minimum_order_for_positive_net = fixed_cost_eur / positive_denominator` ;
- si le coût fixe est nul, la valeur mathématique est zéro mais l'interface indique qu'aucun minimum positif n'est imposé par la composante fixe ; elle ne suggère jamais un ordre nul.

### 14.5 Frontière pour une rétention cible

Définir :

`retention_denominator = G × (1 - R) - variable_floor_rate`.

- si `retention_denominator < 0`, la contrainte est `structurally_unreachable` ;
- si `retention_denominator = 0` et le coût fixe est positif, aucun nominal fini ne satisfait la cible ;
- si `retention_denominator = 0` et le coût fixe est nul, la cible est exactement satisfaite pour toute taille strictement positive ; la frontière mathématique vaut zéro avec diagnostic explicite ;
- si `retention_denominator > 0`, `minimum_order_for_retention = fixed_cost_eur / retention_denominator` ;
- un résultat nul issu d'un coût fixe nul n'est jamais présenté comme un ordre recommandé.

### 14.6 Budget annuel

- `annual_cost_eur = total_cost_eur × monthly_operations × 12` ;
- `max_monthly_operations_under_budget = (B × capital) / (12 × total_cost_eur)` lorsque le coût est positif ;
- coût total nul : `unbounded_within_model`, jamais `Infinity`.

### 14.7 Marge nette cible

`required_gross_rate_for_target_net = Q + break_even_gross_rate`.

Cette valeur est une contrainte mathématique, pas une prévision.

### 14.8 Invariants

- `break_even_gross_rate >= variable_floor_rate` ;
- `fixed_cost_eur + variable_cost_eur = total_cost_eur` ;
- `gross_edge_eur - total_cost_eur = net_edge_eur` ;
- si `G > 0`, absorption + rétention = 1 ;
- si le coût total est positif, part fixe + part variable = 1 ;
- la fréquence n'affecte pas le seuil par opération ;
- le coût annuel est proportionnel à la fréquence ;
- le seuil converge vers le plancher variable lorsque `N` augmente.

### 14.9 Projection annuelle

Les projections annuelles de l'avantage sont strictement arithmétiques :

- sans capitalisation ;
- sans réinvestissement ;
- sans positions simultanées ;
- sans contrainte dynamique de capital.

Elles ne constituent ni performance annualisée ni simulation de portefeuille.

### 14.10 Statut de validation

Le laboratoire a réussi les oracles Node, les tests Chromium, les contrôles d'intégrité et les non-régressions indiqués dans `docs/validation/CAPITAL_EFFICIENCY_LAB.md`.

Cette validation porte sur l'exécution technique du contrat. Elle ne démontre ni utilité utilisateur, ni demande, ni paiement, ni performance future.
