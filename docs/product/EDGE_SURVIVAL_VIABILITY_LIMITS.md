# Breaktest — limites de la notion d'Edge Survival

## 1. Angle mort

Une méthode peut conserver une marge moyenne positive après les frictions saisies et rester néanmoins inexploitable, non robuste ou inadaptée.

Edge Survival mesure une condition économique nécessaire :

> l'hypothèse brute dépasse-t-elle les frictions modélisées ?

Il ne démontre pas à lui seul :

- que l'avantage brut existe ;
- qu'il persistera ;
- qu'il est statistiquement significatif ;
- que le capital peut financer les positions ;
- que le risque est acceptable ;
- que la stratégie peut être exécutée comme prévu ;
- que le résultat net final sera positif.

## 2. Terminologie autorisée

Formulations autorisées :

- « la marge subsiste après les frictions saisies » ;
- « l'hypothèse brute dépasse le seuil de couverture » ;
- « toute la fourchette saisie reste au-dessus du seuil » ;
- « la conclusion est stable face aux coûts dans les hypothèses saisies » ;
- « viabilité de coût » ou « cost viability » si la limite est visible.

Formulations interdites sans analyses supplémentaires :

- « stratégie viable » ;
- « stratégie rentable » ;
- « avantage prouvé » ;
- « investissement adapté » ;
- « probabilité de succès » ;
- « risque maîtrisé » ;
- « capital suffisant » ;
- « exécution réaliste garantie ».

## 3. Dimensions absentes du diagnostic actuel

### 3.1 Incertitude de l'avantage

Le prototype ne mesure pas :

- erreur d'estimation ;
- intervalle statistique ;
- puissance ;
- multiple testing ;
- data snooping ;
- stabilité hors échantillon ;
- changement de régime.

Une fourchette utilisateur reste une analyse de sensibilité, non une preuve statistique.

### 3.2 Risque et trajectoire

Le prototype ne mesure pas :

- volatilité ;
- drawdown ;
- risque de ruine ;
- queue de distribution ;
- séquence de pertes ;
- concentration ;
- corrélation entre positions ;
- liquidité en stress.

Deux méthodes ayant la même marge moyenne nette peuvent avoir des profils de risque radicalement différents.

### 3.3 Faisabilité du capital

Le prototype ne prouve pas :

- que le nominal tient dans le cash disponible ;
- que plusieurs positions peuvent être financées simultanément ;
- que les pertes n'épuisent pas le capital libre ;
- que la fréquence est compatible avec la durée de détention.

Voir `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md`.

### 3.4 Exécution

Les hypothèses de spread et slippage peuvent être erronées. Le moteur ne garantit pas :

- prix d'arrivée ;
- remplissage complet ;
- délai ;
- impact de marché ;
- capacité ;
- disponibilité de la liquidité ;
- exécution lors d'un régime extrême.

### 3.5 Coûts omis

Selon l'instrument et le pays, le modèle peut omettre :

- taxes ;
- frais de place ;
- frais réglementaires ;
- financement ;
- borrow fees ;
- intérêts ;
- droits de garde ;
- fiscalité personnelle ;
- coûts d'opportunité.

### 3.6 Comportement et opérations

Le modèle ne prouve pas :

- discipline d'exécution ;
- respect de la méthode ;
- capacité à supporter les pertes ;
- qualité des données ;
- continuité opérationnelle ;
- absence d'erreur humaine.

## 4. Hiérarchie correcte des preuves

```text
frictions correctement définies
        ↓
hypothèse brute compatible
        ↓
marge après coûts
        ↓
incertitude statistique
        ↓
risque et trajectoire
        ↓
faisabilité du capital
        ↓
exécution réelle
        ↓
utilité et comportement utilisateur
```

Edge Survival couvre principalement la troisième étape, sous réserve des deux premières.

## 5. Exigence d'interface

Toute vue Edge Survival doit afficher à proximité de la conclusion :

> Ce diagnostic teste uniquement la survie face aux frictions saisies. Il ne valide ni l'avantage, ni le risque, ni la faisabilité du capital, ni le rendement futur.

La formulation peut être raccourcie sur mobile, mais les quatre limites doivent rester accessibles sans navigation externe.

Une couleur positive ne doit jamais transformer la conclusion en verdict global.

## 6. Exigence de preuve académique et commerciale

Dans une présentation, candidature ou démonstration :

- présenter Edge Survival comme une couche de diagnostic ;
- montrer les équations et cas impossibles ;
- montrer les limites avant d'évoquer le potentiel ;
- distinguer preuve synthétique, preuve technique et preuve utilisateur ;
- ne jamais utiliser une marge positive synthétique comme preuve de performance réelle.

## 7. Gate avant extension vers un score

Aucun score global de viabilité ne peut être créé tant que :

- les dimensions incluses et exclues ne sont pas définies ;
- les pondérations ne sont pas justifiées ;
- les données ne sont pas suffisantes ;
- les utilisateurs ne comprennent pas la différence entre score et recommandation ;
- les risques réglementaires ne sont pas revus ;
- un score n'apporte pas plus de valeur qu'une décomposition transparente.

La préférence actuelle reste la décomposition explicite, sans score.

## 8. Test utilisateur requis

Demander après exposition au résultat, sans suggestion :

1. « Qu'est-ce que ce résultat prouve ? »
2. « Qu'est-ce qu'il ne prouve pas ? »
3. « Est-ce que tu considérerais la méthode comme rentable ou validée ? Pourquoi ? »
4. « Quelle information te manque avant de prendre une décision ? »

Échec du gate si une majorité interprète Edge Survival comme une validation globale malgré les explications.