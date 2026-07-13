# Breaktest — scénarios de démonstration

Les chiffres ci-dessous sont synthétiques. Ils servent à démontrer le mécanisme du calculateur, pas à représenter les tarifs actuels d'un courtier.

## Convention commune

Pour un aller-retour :

`coût total = commissions achat + vente + change achat + vente + spread estimé + slippage estimé`

Le calculateur doit afficher chaque composante séparément.

## Scénario 1 — très petit capital et petits ordres

- capital : 500 EUR
- montant d'ordre : 100 EUR
- 4 allers-retours par mois
- commission : 1 EUR par côté
- change : 0,25 % par côté
- spread aller-retour : 0,10 %
- slippage aller-retour : 0,10 %

Résultats de référence :

- commission : 2,00 EUR
- change : 0,50 EUR
- spread : 0,10 EUR
- slippage : 0,10 EUR
- coût aller-retour : **2,70 EUR**
- coût / ordre : **2,70 %**
- coût annuel estimé : **129,60 EUR**
- coût annuel / capital initial : **25,92 %**

Message : `Un tarif fixe apparemment faible devient dominant lorsque l'ordre est très petit.`

## Scénario 2 — capital intermédiaire

- capital : 5 000 EUR
- montant d'ordre : 500 EUR
- 4 allers-retours par mois
- commission : 1 EUR par côté
- change : 0,25 % par côté
- spread aller-retour : 0,10 %
- slippage aller-retour : 0,10 %

Résultats de référence :

- commission : 2,00 EUR
- change : 2,50 EUR
- spread : 0,50 EUR
- slippage : 0,50 EUR
- coût aller-retour : **5,50 EUR**
- coût / ordre : **1,10 %**
- coût annuel estimé : **264 EUR**
- coût annuel / capital initial : **5,28 %**

Message : `Le poids des frais fixes diminue, mais le change et la fréquence restent matériels.`

## Scénario 3 — investissement mensuel en euros

- capital : 5 000 EUR
- achat mensuel : 300 EUR
- pas de vente dans l'année
- commission d'achat : 1 EUR
- change : 0 %
- spread estimé à l'achat : 0,05 %
- slippage estimé à l'achat : 0,05 %

Résultats de référence :

- coût par achat : **1,30 EUR**
- coût / achat : **0,433 %** environ
- coût annuel : **15,60 EUR**
- coût annuel / capital initial : **0,312 %**

Message : `La fréquence n'est pas nécessairement destructrice lorsque les coûts fixes et le change restent faibles.`

## Scénario 4 — commission affichée à zéro, mais change et microstructure

- capital : 10 000 EUR
- montant d'ordre : 1 000 EUR
- 2 allers-retours par mois
- commission : 0 EUR
- change : 0,25 % par côté
- spread aller-retour : 0,10 %
- slippage aller-retour : 0,10 %

Résultats de référence :

- change : 5,00 EUR
- spread : 1,00 EUR
- slippage : 1,00 EUR
- coût aller-retour : **7,00 EUR**
- coût / ordre : **0,70 %**
- coût annuel : **168 EUR**
- coût annuel / capital initial : **1,68 %**

Message : `Commission nulle ne signifie pas exécution sans coût.`

## Scénario 5 — comparaison de taille

Hypothèses :

- commission : 1 EUR par côté
- aucun change
- spread + slippage aller-retour : 0,20 %

| Taille d'ordre | Coût fixe | Coût variable | Total | Total / ordre |
|---:|---:|---:|---:|---:|
| 100 EUR | 2,00 | 0,20 | 2,20 EUR | 2,20 % |
| 500 EUR | 2,00 | 1,00 | 3,00 EUR | 0,60 % |
| 1 000 EUR | 2,00 | 2,00 | 4,00 EUR | 0,40 % |

Message : `Le calculateur montre le compromis mathématique ; il ne recommande pas de retarder ou regrouper une opération.`

## Tests obligatoires du calculateur

- tous les coûts à zéro donnent exactement zéro ;
- un zéro réel n'est pas traité comme une valeur manquante ;
- valeurs négatives ou non numériques refusées ;
- fréquence nulle donne un coût annuel nul ;
- aucune division par zéro si capital ou ordre manque ;
- les pourcentages utilisent le bon dénominateur ;
- modifier un paramètre ne change que les résultats qui en dépendent ;
- les arrondis d'affichage ne modifient pas les valeurs internes ;
- aucune phrase ne transforme le calcul en recommandation.