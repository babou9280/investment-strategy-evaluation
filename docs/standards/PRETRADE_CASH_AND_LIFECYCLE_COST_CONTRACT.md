# Breaktest — contrat cash immédiat et coût économique du cycle

## 1. Problème

Un contrôle pré-trade ne peut pas utiliser indistinctement le coût total d'un aller-retour pour répondre à deux questions différentes :

1. combien l'opération complète doit-elle rapporter pour couvrir toutes ses frictions ?
2. combien de cash faut-il réellement au moment de l'entrée ?

Confondre ces deux bases peut :

- surestimer le cash immédiat en ajoutant des frais de sortie futurs ;
- sous-estimer le cash immédiat si le prix de référence ne contient pas l'effet du spread ou du slippage ;
- compter deux fois une friction déjà incorporée dans le prix d'exécution ;
- déclarer un ordre finançable sur une base de capital incorrecte.

## 2. Périmètre initial recommandé

Le premier prototype de faisabilité du capital doit être limité à :

```text
cash_account
long_cash_purchase
unlevered
no_short_sale
no_derivatives
no_margin
single_account_currency
```

Un scénario d'aller-retour peut être utilisé pour l'analyse économique du cycle, mais la faisabilité de l'entrée reste une analyse distincte.

La portée économique et le nombre de côtés sont indissociables :

```text
entry_leg -> side_count = 1
complete_round_trip -> side_count = 2
```

Une contradiction invalide le calcul. `exit_leg` isolé reste hors du périmètre du moteur d'achat long.

Toute autre configuration retourne `unsupported_capital_model` jusqu'à implémentation dédiée.

## 3. Trois bases à distinguer

### 3.1 Nominal économique du scénario

```text
scenario_notional_eur
```

Base utilisée pour les rendements et la friction économique par opération complète.

### 3.2 Engagement cash immédiat

```text
entry_cash_commitment_eur
```

Montant que l'utilisateur prévoit de mobiliser à l'entrée selon une base explicitement définie.

### 3.3 Coût économique du cycle

```text
lifecycle_friction_eur
```

Somme des frictions d'entrée et de sortie couvertes par le scénario d'analyse.

Ces trois grandeurs peuvent être proches, mais ne sont jamais supposées identiques.

## 4. Base du nominal

Le champ de nominal doit préciser :

```text
notional_basis =
  reference_mid_price
  reference_ask_price
  user_cash_budget
  expected_execution_consideration
  observed_execution_consideration
```

Sans `notional_basis`, Cost Gate ne dérive pas automatiquement le cash immédiat depuis le nominal.

Lorsque quantité et prix sont présents, le snapshot doit aussi réconcilier :

```text
entry_asset_consideration_eur
≈ order_quantity * reference_price_in_account_currency
```

Dans la fondation synthétique actuelle, une seule valeur `reference_price_in_account_currency` alimente aussi le nominal économique. Elle impose donc en plus :

```text
scenario_notional_eur
≈ order_quantity * reference_price_in_account_currency
```

La tolérance, l'unité de quantité, la devise et toute transformation FX sont explicites. Un nominal saisi indépendamment ne remplace pas silencieusement ce contrôle. Une future séparation entre prix mid économique et prix d'exécution devra fournir deux prix et une réconciliation explicite ; elle ne peut pas être simulée en donnant deux nominaux incompatibles à un prix unique.

### Coûts incorporés au prix

Pour chaque composante sensible au prix :

```text
spread_reference_price_status =
  included | excluded | unknown | not_applicable

slippage_reference_price_status =
  included | excluded | unknown | not_applicable
```

Un booléen brut est normalisé vers cet enum avant calcul. `unknown` n'est jamais assimilé à `excluded`.

Si le nominal est calculé au prix ask ou à un prix d'exécution attendu, une partie ou la totalité du spread ou du slippage peut déjà être incorporée. Ces montants ne sont alors pas ajoutés une deuxième fois à l'engagement cash.

Ils peuvent néanmoins rester dans la décomposition économique du cycle lorsque `G` est défini avant ces frictions. Les deux vues ne constituent pas un double comptage : l'une décrit le cash payé, l'autre mesure l'écart économique par rapport à une base brute explicitement alignée.

Toute incohérence, inclusion inconnue ou absence de relation quantité-prix retourne `cash_basis_conflicted` pour les sorties qui en dépendent.
## 5. Composantes immédiates

Dans le périmètre cash long, l'engagement immédiat peut comprendre :

```text
entry_asset_consideration_eur
entry_commission_eur
entry_contractual_fees_eur
entry_tax_eur
entry_fx_cash_cost_eur
user_defined_execution_cash_buffer_eur
```

Formule :

```text
entry_cash_requirement_eur =
  entry_asset_consideration_eur
  + entry_commission_eur
  + entry_contractual_fees_eur
  + entry_tax_eur
  + entry_fx_cash_cost_eur
  + user_defined_execution_cash_buffer_eur
```

Le buffer éventuel est fourni explicitement par l'utilisateur ou une politique contractuelle documentée. Breaktest ne choisit pas son niveau.

Dans l'entrée normalisée de la fondation synthétique, chaque composante immédiate est fournie explicitement, y compris lorsqu'elle vaut zéro. Une absence n'est jamais transformée silencieusement en zéro.

Lorsque les mêmes hypothèses existent dans les deux vues, elles se réconcilient :

```text
entry_commission_eur ≈ commission_per_side_eur
entry_fx_cash_cost_eur ≈ scenario_notional_eur * fx_rate_per_side
account_currency = quote_currency -> fx_rate_per_side = 0
account_currency = quote_currency -> entry_fx_cash_cost_eur = 0
```

Une hypothèse FX non nulle entre devises identiques invalide la géométrie de friction même lorsque la vue cash n'est pas fournie. Lorsque la vue cash existe, toute ligne FX non nulle est également conflictuelle. Une absence de cash ne peut donc pas rendre valide un événement de change économiquement impossible.

Une contradiction de cash produit `cash_basis_conflicted`. La fondation actuelle ne possède pas encore de champs de cycle pour réconcilier des taxes ou frais contractuels asymétriques entre entrée et sortie. Toute valeur d'entrée non nulle dans ces deux catégories produit `entry_fixed_costs_missing_from_lifecycle_model`, marque la friction de cycle comme incomplète et interdit tout constat Edge Survival dépendant d'un seuil complet. Le montant reste visible dans le cash immédiat ; il n'est ni supprimé, ni implicitement remplacé par zéro dans le seuil.

Le spread et le slippage ne sont ajoutés comme cash séparé que si la base du prix prouve qu'ils ne sont pas déjà incorporés.

## 6. Composantes du cycle

Le coût économique complet conserve la logique Capital Efficiency :

```text
lifecycle_fixed_cost_eur
lifecycle_variable_floor_rate
lifecycle_variable_cost_eur
lifecycle_friction_eur
lifecycle_break_even_gross_rate
```

Il peut inclure :

- entrée ;
- sortie ;
- change à chaque côté ;
- spread total ;
- slippage total ;
- taxes ou frais récurrents documentés.

Les frais de sortie futurs ne sont pas automatiquement soustraits du cash disponible à l'entrée. Ils restent néanmoins dans le seuil économique du cycle.

## 7. Faisabilité immédiate

### 7.1 Normaliser le cash de la source

Une source de cash doit déclarer :

```text
available_settled_cash_eur
available_settled_cash_basis =
  gross_before_declared_holds
  | net_of_listed_holds
source_included_hold_ids[]
```

Chaque réservation ou engagement possède un `hold_id` stable et un statut d'inclusion. Seuls les montants prouvés non déjà retranchés par la source entrent dans `deductible_hold_ids[]`.

`source_included_hold_ids[]` est la vue canonique fournie par la source. Elle doit correspondre exactement aux `hold_id` dont `included_in_available_settled_cash = true` dans le ledger : aucun identifiant inconnu, manquant ou dupliqué n'est accepté.

Invariants de base :

```text
gross_before_declared_holds -> source_included_hold_ids = []
net_of_listed_holds -> chaque hold inclus est nommé explicitement
user_reserve -> jamais déjà retranché par la source dans ce prototype
```

La réserve utilisateur est appliquée après normalisation du cash de la source. Si la source la déclare déjà incluse, la base est conflictuelle au lieu de la soustraire une seconde fois.

```text
account_free_settled_cash_eur =
  available_settled_cash_eur
  - sum(amount_eur des deductible_hold_ids)
  - user_defined_cash_reserve_eur
```

Un même `hold_id` ne peut apparaître qu'une fois dans le ledger de déduction. Si la base de la source ou l'inclusion d'un hold est inconnue, l'état est `cash_basis_missing` ou `cash_basis_conflicted` ; le moteur ne soustrait pas « par prudence » une seconde fois.

### 7.2 Respecter l'allocation déclarée à la stratégie

Lorsque l'utilisateur déclare une allocation plus basse que son cash de compte :

```text
strategy_capital_eur
strategy_capital_committed_eur
strategy_allocation_headroom_eur =
  strategy_capital_eur - strategy_capital_committed_eur

capital_feasibility_cash_eur =
  min(
    account_free_settled_cash_eur,
    strategy_allocation_headroom_eur
  )
```

Les engagements déjà comptés dans le cash du compte peuvent aussi être présents dans `strategy_capital_committed_eur` : ce n'est pas une double soustraction, car les deux montants créent deux plafonds indépendants combinés par `min`, jamais par addition.

`reference_capital_eur` ne remplace pas `strategy_capital_eur`. Si l'allocation de stratégie ou son capital déjà engagé est nécessaire mais absent, la faisabilité de stratégie reste non évaluée. Le moteur ne suppose jamais que 100 % du compte est affecté au scénario.

### 7.3 État

Invariants :

```text
available_settled_cash_eur >= 0
user_defined_cash_reserve_eur >= 0
strategy_capital_eur >= 0
strategy_capital_committed_eur >= 0
account_free_settled_cash_eur est fini
strategy_allocation_headroom_eur est fini
aucun hold_id déduit deux fois
```

`account_free_settled_cash_eur` ou `strategy_allocation_headroom_eur` peut être négatif ; cela produit un constat de dépassement, pas un nombre non fini.

État :

```text
entry_cash_feasibility =
  feasible_within_declared_strategy_cash
  insufficient_declared_strategy_cash
  cash_basis_missing
  cash_basis_conflicted
  unsupported_capital_model
```

La condition :

```text
entry_cash_requirement_eur <= capital_feasibility_cash_eur
```

signifie uniquement que l'engagement immédiat tient à la fois dans le cash réglé réconcilié et dans l'allocation de stratégie déclarée du snapshot. Elle ne signifie ni prudence, ni adéquation, ni conseil.
## 8. Cash réglé contre cash affiché

Ne jamais confondre :

```text
account_equity
buying_power
cash_balance
settled_cash
withdrawable_cash
```

Le premier périmètre sans marge utilise `available_settled_cash_eur`.

Si une source ne permet pas de distinguer le cash réglé, l'état est `cash_basis_missing` ou `unsupported_capital_model`.

## 9. Ordres en attente et réservations

Tout ordre d'achat non exécuté ou partiellement exécuté peut réserver du cash.

Le snapshot conserve un ledger à composants mutuellement exclusifs :

```text
hold_id
hold_type =
  pending_order
  | open_position
  | other_strategy
  | user_reserve
amount_eur
included_in_available_settled_cash
included_in_strategy_capital_committed
```

Chaque montant est rattaché à un seul `hold_id`. Les agrégats tels que `reserved_cash_eur` ou `pending_cash_commitments_eur` sont des vues de réconciliation, jamais deux sources à soustraire ensemble sans leurs identifiants.

Invariants :

```text
sum(unique account-side holds not already included)
  == sum(deductible_hold_ids)

aucun hold_id n'est compté dans deux catégories account-side
aucun montant pending n'est soustrait à la fois comme reserved et pending
```

Aucune réservation ne peut être ignorée parce qu'elle n'a pas encore produit de PnL.
## 10. Sortie future et produit de cession

Cost Gate ne suppose pas que le produit d'une vente future financera l'entrée actuelle, sauf séquence et règlement explicitement modélisés.

Pour un aller-retour, la sortie future :

- contribue au coût économique du cycle ;
- ne crée pas du cash disponible à l'entrée ;
- n'est pas garantie ;
- ne permet pas d'ignorer les besoins de règlement.

## 11. Positions simultanées

La faisabilité d'un ordre isolé ne prouve pas celle d'une série d'ordres.

Une couche portefeuille future doit réutiliser :

- réservation chronologique du nominal ;
- sorties avant entrées de même date selon la convention validée ;
- PnL disponible uniquement à la sortie ;
- capital libre réconcilié ;
- absence de réduction silencieuse de taille.

## 12. Sorties à afficher

Au minimum :

- cash réglé déclaré ;
- réservations et engagements en attente ;
- réserve utilisateur ;
- cash libre calculé ;
- engagement immédiat ;
- coût économique complet du cycle ;
- base du nominal ;
- composants déjà incorporés au prix ;
- couches non modélisées.

## 13. Tests requis

Tester :

- nominal basé sur mid avec spread externe ;
- nominal basé sur ask avec spread déjà inclus ;
- conflit de base provoquant un refus ;
- aller-retour avec frais de sortie exclus du besoin immédiat ;
- cash exactement égal au besoin ;
- cash inférieur d'un centime ;
- cash non réglé ;
- ordre en attente avec source brute avant holds ;
- source déjà nette du même ordre en attente, sans double retrait ;
- contradiction entre base brute et hold déclaré déjà inclus ;
- désaccord entre `source_included_hold_ids[]` et les indicateurs du ledger ;
- réserve utilisateur déclarée déjà retranchée par la source ;
- allocation de stratégie inférieure au cash total du compte ;
- capital de stratégie déjà engagé ;
- réserve utilisateur ;
- coût nul ;
- taxe ou frais contractuel d'entrée non nul sans contrepartie de cycle : cash conflictuel, friction incomplète et Edge Survival non évalué ;
- change à l'entrée ;
- contradiction entre devises identiques et change non nul, avec et sans vue cash ;
- devises identiques et change nul, conservés comme cas valide ;
- divergence commission ou change entre entrée et cycle ;
- dérivé, short ou marge non supportés ;
- aucun double comptage par `hold_id` ;
- réconciliation quantité × prix × devise ;
- achat simple à un côté et aller-retour à deux côtés ;
- contradiction portée / côtés refusée avant synthèse favorable ;
- aucune utilisation du produit de sortie future pour financer l'entrée.

## 14. Gate d'implémentation

Avant d'afficher une faisabilité de capital :

1. fixer le périmètre cash long ;
2. définir `notional_basis` ;
3. séparer coût incorporé au prix et coût ajouté ;
4. disposer du cash réglé, de sa base d'inclusion, des réservations et de l'allocation de stratégie ;
5. tester la réconciliation par `hold_id` avec C1 et C4 ;
6. vérifier les conventions de règlement de la source ;
7. ne pas présenter l'état comme recommandation.

## 15. Statut

Le sous-ensemble cash long synthétique est implémenté dans `cost_gate_foundation/`. Les oracles de la version `1` distinguent `502,25 EUR` de cash immédiat et `5,50 EUR` de friction du cycle, plafonnent le cash par l'allocation libre de stratégie, empêchent la double déduction des holds et refusent une contradiction entre portée et nombre de côtés. Ces correctifs réussissent au head fonctionnel `2ebf0e3e37852e4f3252e54149e147aa0d5712c3` dans le run `#608`, puis au head documentaire `9d38ce31e33b41159d0c6180205c3747c3bb6f1d` dans le run `#610`.

La version `cost-gate-foundation-2-synthetic` ajoute les réconciliations nominal, base de cash, devise et coûts entrée/cycle. Elle est validée techniquement sur le head exact `faafd348da55217e96ba67efd9f9434be62725ca` par le run `#612` (`29342135098`) et l'artefact `8314518122` inspecté. Cette preuve reste synthétique et n'établit ni solde réel, ni règle de règlement d'un courtier, ni exhaustivité fiscale.

La révision locale `cost-gate-foundation-3-synthetic` étend le conflit même devise/FX à la friction sans dépendre de la présence du cash et rend explicitement incomplète la friction lorsqu'une taxe ou un frais contractuel d'entrée n'a pas de contrepartie de cycle. Elle reste une prévalidation jusqu'à un head distant, une CI exact-head et un artefact inspecté.

Cette preuve ne comporte aucune connexion de compte, donnée réelle ou capacité d'ordre. Le contrat complète `CAPITAL_FEASIBILITY_CONTRACT.md` pour le domaine immédiat uniquement.
