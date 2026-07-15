# Breaktest — frontière de personnalisation de Cost Gate

## 1. Objet

Cost Gate est présenté comme un contrôle pré-trade personnalisé. Cette personnalisation doit rester une application déterministe de paramètres explicitement fournis par l'utilisateur. Elle ne doit pas devenir une évaluation implicite de son profil, de son appétence au risque ou de l'opportunité d'un investissement.

Ce contrat fixe la frontière produit avant toute donnée réelle, connexion de compte ou usage externe.

## 2. Personnalisation autorisée

Cost Gate peut utiliser uniquement des contraintes explicites, documentées et modifiables par l'utilisateur, notamment :

```text
strategy_capital_eur
available_settled_cash_eur
user_defined_cash_reserve_eur
reserved_cash_eur
pending_cash_commitments_eur
proposed_order_notional_eur
maximum_annual_friction_rate
minimum_edge_retention_rate
minimum_net_margin_rate
maximum_order_share_of_declared_strategy_capital
allowed_instrument_scope
allowed_account_currency
```

Chaque paramètre doit afficher :

- sa définition ;
- son unité ;
- sa provenance ;
- la condition qu'il impose ;
- les sorties qui en dépendent ;
- la possibilité de le supprimer ou de le modifier.

Le produit calcule la conséquence de la contrainte. Il ne choisit pas la contrainte à la place de l'utilisateur.

## 3. Personnalisation interdite sans changement de régime

Cost Gate ne doit pas :

- déduire une tolérance au risque ;
- inférer un objectif patrimonial ;
- déterminer si un produit convient à l'utilisateur ;
- recommander un actif, un courtier, un type d'ordre, une taille ou une fréquence ;
- proposer automatiquement une valeur de réserve de cash ;
- recommander du levier, de la marge ou une vente à découvert ;
- classer des instruments selon une préférence personnelle ;
- transformer âge, revenu, patrimoine, profession ou historique de pertes en décision produit ;
- utiliser un score comportemental ou psychologique ;
- présenter l'absence de conflit détecté comme une autorisation d'exécuter.

Toute évolution vers ces usages impose :

1. une décision stratégique distincte ;
2. une revue juridique spécialisée ;
3. une nouvelle architecture de consentement et de gouvernance ;
4. une validation explicite d'Ayman.

## 4. Règle de calcul

La personnalisation est une fonction pure :

```text
personalized_findings = apply(
  explicit_user_constraints,
  validated_scenario_outputs
)
```

Elle ne peut pas ajouter une hypothèse absente.

Pour chaque contrainte `c` :

```text
constraint_status(c) =
  satisfied
  breached
  not_computable
  not_applicable
```

`not_computable` est obligatoire si une entrée nécessaire manque, est invalide, stale ou conflictuelle.

Aucun fallback silencieux vers une valeur dite prudente, moyenne ou standard.

## 5. Sortie utilisateur

Les identifiants techniques ne doivent pas être présentés comme un feu de circulation.

### Formulations recevables

- « La friction annuelle calculée dépasse la limite de 1,00 % que vous avez saisie. »
- « La taille proposée dépasse le cash réglé déclaré après réservations. »
- « La fourchette brute saisie ne produit aucune marge strictement positive. »
- « Aucune incompatibilité n'a été détectée dans les contraintes calculables de ce snapshot. »
- « Cette couche n'a pas pu être évaluée faute de donnée suffisamment fraîche. »

### Formulations interdites

- « Trade validé » ;
- « Vous pouvez acheter » ;
- « Bon trade » ;
- « Taille recommandée » ;
- « Risque adapté à votre profil » ;
- « Compatible avec vous » ;
- « Feu vert » ou « feu rouge » sans explication ;
- « Refusez cet ordre ».

La formulation la plus favorable autorisée reste :

> Aucune incompatibilité n'a été détectée sous les hypothèses, données et contraintes affichées pour ce snapshot.

Elle doit être accompagnée des couches non évaluées et de la date d'expiration du snapshot.

## 6. Hiérarchie des contraintes

Une contrainte utilisateur ne peut jamais :

- remplacer une donnée de marché ;
- rendre valide une donnée stale ;
- annuler une incompatibilité de capital ;
- transformer une marge nulle en marge positive ;
- rendre calculable une couche incomplète ;
- masquer une limite de domaine.

Les résultats de chaque couche restent visibles séparément.

## 7. Données personnelles minimales

Le prototype initial n'a besoin d'aucun profil personnel général.

Il doit éviter de demander :

- âge ;
- salaire ;
- profession ;
- situation familiale ;
- patrimoine total ;
- expérience de trading ;
- questionnaire psychologique.

Il peut demander uniquement les variables économiques nécessaires au scénario, idéalement en traitement local.

## 8. Tests futurs

Tester au minimum :

- contrainte absente ;
- zéro réel ;
- limite exactement atteinte ;
- dépassement infinitésimal selon la tolérance documentée ;
- plusieurs contraintes simultanément dépassées ;
- contrainte non calculable ;
- changement d'une contrainte invalidant le résultat ;
- retrait d'une contrainte ;
- aucune inférence depuis une autre variable ;
- absence de vocabulaire prescriptif ;
- absence de couleur comme unique porteur de sens ;
- ordre stable des explications ;
- provenance visible.

## 9. Gate juridique et utilisateur

Avant toute exposition à des utilisateurs réels :

- revue juridique du parcours et des formulations ;
- test sans coaching sur la différence entre diagnostic et recommandation ;
- mesure de la proportion d'utilisateurs interprétant un état favorable comme autorisation ;
- abandon ou reformulation si cette confusion reste matérielle.

## 10. Statut

Ce contrat est une exigence de conception. Il ne constitue ni un avis juridique ni une preuve de conformité.