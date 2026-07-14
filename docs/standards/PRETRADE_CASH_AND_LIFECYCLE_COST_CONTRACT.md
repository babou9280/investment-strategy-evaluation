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

### Risque de double comptage

Si le nominal est calculé au prix ask ou à un prix d'exécution attendu, une partie ou la totalité du spread peut déjà être incorporée.

Si le nominal est calculé au mid, le spread et le slippage peuvent modifier le cash requis.

Le modèle doit exposer :

```text
spread_included_in_reference_price
slippage_included_in_reference_price
```

Toute incohérence retourne `cash_basis_conflicted`.

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

Définir :

```text
free_settled_cash_eur =
  available_settled_cash_eur
  - reserved_cash_eur
  - pending_cash_commitments_eur
  - user_defined_cash_reserve_eur
```

Invariants :

```text
available_settled_cash_eur >= 0
reserved_cash_eur >= 0
pending_cash_commitments_eur >= 0
user_defined_cash_reserve_eur >= 0
```

État :

```text
entry_cash_feasibility =
  feasible_within_declared_settled_cash
  insufficient_declared_settled_cash
  cash_basis_missing
  cash_basis_conflicted
  unsupported_capital_model
```

La condition :

```text
entry_cash_requirement_eur <= free_settled_cash_eur
```

signifie uniquement que l'engagement immédiat tient dans le cash déclaré selon le snapshot. Elle ne signifie ni prudence, ni adéquation, ni conseil.

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

Le snapshot doit distinguer :

```text
pending_order_reserved_cash_eur
open_position_reserved_cash_eur
other_strategy_reserved_cash_eur
```

La somme se réconcilie avec `reserved_cash_eur` ou `pending_cash_commitments_eur` selon la convention choisie.

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

## 13. Tests futurs

Tester :

- nominal basé sur mid avec spread externe ;
- nominal basé sur ask avec spread déjà inclus ;
- conflit de base provoquant un refus ;
- aller-retour avec frais de sortie exclus du besoin immédiat ;
- cash exactement égal au besoin ;
- cash inférieur d'un centime ;
- cash non réglé ;
- ordre en attente ;
- réserve utilisateur ;
- coût nul ;
- taxe d'entrée ;
- change à l'entrée ;
- dérivé, short ou marge non supportés ;
- aucun double comptage ;
- aucune utilisation du produit de sortie future pour financer l'entrée.

## 14. Gate d'implémentation

Avant d'afficher une faisabilité de capital :

1. fixer le périmètre cash long ;
2. définir `notional_basis` ;
3. séparer coût incorporé au prix et coût ajouté ;
4. disposer du cash réglé et des réservations ;
5. tester la réconciliation avec C1 et C4 ;
6. vérifier les conventions de règlement de la source ;
7. ne pas présenter l'état comme recommandation.

## 15. Statut

Contrat de conception non implémenté. Il complète `CAPITAL_FEASIBILITY_CONTRACT.md` sans autoriser de connexion de compte ou d'ordre réel.