# Breaktest — cas de décision à forte valeur

## Statut

Carte interne des problèmes à tester. Aucun cas n'est commercialement validé.

## 1. Petit ordre récurrent

### Décision réelle

> Mon versement régulier est-il assez grand pour que la commission fixe ne domine pas le rendement brut nécessaire ?

### Entrées connues ou accessibles

- montant d'ordre ;
- fréquence ;
- commission ;
- capital facultatif.

### Sorties utiles

- seuil brut ;
- part fixe du coût ;
- sensibilité à la taille ;
- budget annuel.

### Limite

Ne recommande ni produit ni périodicité.

## 2. Exposition en devise étrangère

### Décision réelle

> Quel rendement brut supplémentaire doit compenser la conversion de devise et les autres frictions ?

### Entrées

- frais de change par côté ;
- commission ;
- spread et slippage estimés ;
- achat simple ou aller-retour.

### Sorties

- plancher variable ;
- seuil brut ;
- part attribuable au change ;
- marge nette si un brut externe est fourni.

### Limite

Ne modélise pas le risque de change de l'actif lui-même.

## 3. Méthode systématique ou règle de trading

### Décision réelle

> L'avantage brut mesuré dans un test ou un historique survit-il aux frictions réalistes ?

### Entrées

- avantage brut provenant d'une source documentée ;
- nominal ;
- fréquence ;
- frictions explicites et implicites.

### Sorties

- part conservée ;
- marge nette ;
- seuil ;
- contrainte de taille ;
- impossibilité structurelle.

### Limite

Breaktest ne valide pas la qualité statistique de l'avantage brut dans le laboratoire actuel.

## 4. Rééquilibrage fréquent

### Décision réelle

> Quel budget annuel de friction implique la fréquence de rééquilibrage envisagée ?

### Entrées

- fréquence ;
- coût moyen par opération ;
- capital ;
- budget annuel choisi.

### Sorties

- coût annuel arithmétique ;
- coût relatif au capital ;
- fréquence frontière sous budget.

### Limite

Ne compare pas les bénéfices attendus du rééquilibrage et ne recommande pas une fréquence.

## 5. Rendement net cible

### Décision réelle

> Quel rendement brut faudrait-il obtenir pour laisser une marge nette donnée après les coûts ?

### Entrées

- marge nette cible ;
- structure de coûts ;
- nominal.

### Sortie

- rendement brut requis.

### Limite

Le résultat ne dit rien sur la probabilité d'atteindre ce rendement.

## 6. Comparaison ex ante / ex post future

### Décision réelle

> Les frictions réellement observées correspondent-elles aux hypothèses utilisées avant les transactions ?

### Entrées futures

- historique de transactions ;
- coûts observés ;
- barèmes contractuels datés ;
- benchmarks de coûts implicites.

### Sorties futures

- écart attendu/observé ;
- réconciliation brut/net ;
- dérive du plancher variable ;
- historique des hypothèses.

### Gate

Import réel uniquement après demandes répétées et formats représentatifs.

## 7. Comparaison de comptes ou intermédiaires future

### Décision réelle

> Pourquoi le même comportement produit-il une Capital Efficiency différente selon le compte ou le marché ?

### Sorties futures

- comparaison de composantes homogènes ;
- provenance et date des barèmes ;
- écarts observés ;
- benchmark indépendant.

### Risque

Conflits d'intérêts, mise à jour des données et frontière avec une recommandation personnalisée.

## 8. Ordre de validation recommandé

1. seuil d'un petit ordre ;
2. plancher lié au change ;
3. Edge Survival d'une méthode documentée ;
4. budget annuel ;
5. cible nette ;
6. import ex post ;
7. comparaison indépendante.

Les cinq premiers cas peuvent être testés sans compte, données réelles ou intégration externe. Les deux derniers nécessitent une décision distincte.

## 9. Critère de valeur

Un cas est conservé si l'utilisateur :

- avait réellement la décision à prendre ;
- ne possédait pas déjà une réponse simple ;
- comprend la sortie ;
- distingue calcul et recommandation ;
- revient ou demande un suivi ;
- estime que la valeur ou le temps gagné peut dépasser le prix du produit.
