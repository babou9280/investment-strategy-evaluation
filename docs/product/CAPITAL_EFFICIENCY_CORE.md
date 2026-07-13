# Breaktest — noyau Capital Efficiency

## Statut

- Direction parente : Breaktest Cost Intelligence.
- Décision de travail : le calcul de coûts reste une fondation, mais ne constitue pas à lui seul une proposition de valeur suffisante.
- Phase : conception et prototype interne, sans publication externe.
- Aucun résultat de ce document ne constitue une recommandation d'investissement, de fréquence ou de taille d'ordre.

## 1. Problème produit reformulé

Le besoin utile n'est pas seulement :

> Combien cette opération coûte-t-elle ?

Le besoin à plus forte valeur est :

> Avec l'avantage brut que j'espère ou que mon historique suggère, mon capital et ma façon d'exécuter, quelle part de cet avantage survit réellement aux frictions ?

Le produit doit relier les coûts à une économie de stratégie ou de plan d'investissement. Il doit montrer :

- le rendement brut minimal nécessaire pour couvrir les frictions ;
- le plancher de friction qui ne disparaît pas lorsque l'ordre grossit ;
- la part d'un avantage brut absorbée par les coûts ;
- la marge nette attendue sous les hypothèses fournies ;
- la taille d'ordre minimale compatible avec un seuil explicite ;
- la fréquence compatible avec un budget annuel de friction ;
- les paramètres qui peuvent changer le résultat et ceux qui ne le peuvent pas.

## 2. Proposition de valeur

### Formulation de travail

> Breaktest montre si un avantage brut survit aux coûts avec ton capital réel — et quelles contraintes économiques doivent être satisfaites pour qu'il subsiste.

### Ce que le produit ne promet pas

Breaktest ne sait pas si l'avantage brut saisi se réalisera. Il ne prédit pas les marchés et ne recommande pas une opération. Il transforme une hypothèse ou un historique brut en contraintes de viabilité financière explicites.

## 3. Utilisateur initial affiné

Cible prioritaire de validation : investisseur ou trader autonome qui :

- dispose généralement de 2 000 à 50 000 EUR ;
- applique une méthode répétable, même simple ;
- connaît ou peut estimer un rendement brut moyen par opération ;
- effectue plusieurs opérations, versements ou rééquilibrages par mois ;
- subit des commissions fixes, du change ou des coûts implicites ;
- veut savoir si son avantage brut reste significatif après friction.

Le calculateur de coûts simple reste utile comme entrée gratuite. Le module d'« edge survival » vise une douleur plus forte et une disposition à payer potentiellement supérieure.

## 4. Architecture de valeur

### Couche A — géométrie de friction

Disponible sans hypothèse de rendement :

- coût total par opération ;
- coût relatif au montant de l'ordre ;
- coût annuel arithmétique selon la fréquence ;
- seuil brut de couverture ;
- plancher variable de friction ;
- part fixe et part variable du coût ;
- courbe du seuil de couverture selon la taille d'ordre.

Question résolue : « Quelle performance brute minimale cette structure de coûts exige-t-elle ? »

### Couche B — survie de l'avantage

Nécessite un rendement brut attendu ou historique, explicitement qualifié :

- rendement net attendu après friction ;
- PnL net attendu par opération ;
- part de l'avantage absorbée ;
- part de l'avantage conservée ;
- écart entre l'avantage brut et le seuil de couverture ;
- taille minimale pour conserver une part cible de l'avantage ;
- impossibilité structurelle lorsque les coûts variables dépassent le budget d'avantage.

Question résolue : « Mon avantage brut est-il encore présent après coûts, sous ces hypothèses ? »

### Couche C — frontière de capital et de fréquence

Nécessite le capital et un budget annuel de friction défini par l'utilisateur :

- coût annuel rapporté au capital ;
- fréquence mensuelle maximale compatible avec ce budget ;
- grille taille d'ordre × fréquence ;
- scénarios de stress sur les coûts ;
- sensibilité au capital.

Question résolue : « Quelles combinaisons de taille et de fréquence restent sous mon budget de friction ? »

### Couche D — dérivation de l'avantage, plus tard

Après validation seulement :

- saisie directe du rendement brut moyen ;
- ou dérivation transparente depuis taux de réussite, gain moyen et perte moyenne ;
- ou calcul depuis un historique importé ;
- incertitude statistique et échantillon uniquement avec données suffisantes.

## 5. Sorties à forte valeur

### 5.1 Seuil brut de couverture

Rendement brut par opération nécessaire pour compenser exactement les frictions.

### 5.2 Plancher variable de friction

Somme des coûts proportionnels qui ne peut pas être diluée en augmentant la taille de l'ordre. Si l'avantage brut est inférieur ou égal à ce plancher, aucune taille finie ne produit une marge nette positive dans le modèle.

### 5.3 Edge absorption

Part de l'avantage brut absorbée par les frictions. Elle est indisponible si l'avantage brut n'est pas strictement positif.

### 5.4 Edge retained

Part de l'avantage brut qui subsiste après friction. Elle peut être négative lorsque les coûts dépassent l'avantage.

### 5.5 Marge nette par opération

Différence entre le rendement brut fourni et le seuil brut de couverture, affichée en pourcentage, points de base et euros.

### 5.6 Taille minimale de couverture

Taille d'ordre minimale permettant une marge nette strictement positive lorsque l'avantage brut dépasse le plancher variable.

### 5.7 Taille minimale de rétention

Taille minimale permettant de conserver une part cible de l'avantage brut, par exemple 50 %. La cible appartient à l'utilisateur et doit rester visible.

### 5.8 Budget de friction annuel

Montant et pourcentage du capital consommés par les frictions selon la fréquence. La fréquence frontière est un résultat mathématique lié au budget choisi, pas une fréquence recommandée.

## 6. Expérience utilisateur cible

### Étape 1 — paramètres d'exécution

Capital, ordre, fréquence, nombre de côtés et composantes de coût.

### Étape 2 — avantage brut

Choix explicite :

- « Je connais mon rendement brut moyen par opération » ;
- « Je veux seulement connaître le seuil nécessaire ».

Aucune valeur d'avantage ne doit être inventée par défaut. Les démonstrations synthétiques restent marquées.

### Étape 3 — résultat principal

Le résultat principal n'est plus le coût en euros. Il est :

- **seuil brut nécessaire** lorsque l'avantage n'est pas fourni ;
- **part de l'avantage conservée** et **marge nette** lorsque l'avantage est fourni.

Le coût reste visible comme explication du résultat.

### Étape 4 — contraintes et leviers

Montrer séparément :

- coût fixe diluable ;
- plancher variable non diluable ;
- taille minimale calculable ou impossibilité structurelle ;
- fréquence frontière sous budget de friction.

### Étape 5 — sensibilité

Une carte ou une grille montre comment le résultat évolue selon :

- taille d'ordre ;
- fréquence ;
- coût variable ;
- avantage brut.

Aucun scénario n'est automatiquement qualifié de meilleur ou recommandé.

## 7. États descriptifs autorisés

Les états ne sont pas des scores opaques. Ils découlent de formules visibles :

- `threshold_only` : avantage brut absent ;
- `edge_fully_absorbed` : marge nette inférieure ou égale à zéro ;
- `edge_partially_retained` : marge positive, mais rétention inférieure à la cible utilisateur ;
- `retention_target_met` : rétention supérieure ou égale à la cible utilisateur ;
- `structurally_unreachable` : aucune taille finie ne peut satisfaire la contrainte en raison du plancher variable ;
- `not_computable` : données absentes ou invalides.

Formulations interdites : « bon trade », « mauvais trade », « rentable garanti », « taille optimale », « tu devrais », « stratégie validée ».

## 8. Pourquoi cette version apporte davantage de valeur

Le calcul de coûts décrit une conséquence. Le noyau Capital Efficiency répond à une décision économique :

- l'avantage brut est-il assez grand pour survivre ?
- l'augmentation de la taille peut-elle réellement aider ?
- le problème vient-il d'un coût fixe ou d'un plancher proportionnel ?
- quel niveau de marge reste après friction ?
- quelle contrainte est impossible à satisfaire sans changer l'hypothèse d'avantage ou les coûts variables ?

Le produit devient un moteur de contraintes économiques, pas un simple totalisateur de frais.

## 9. Première preuve à obtenir

Avant toute publication large, cinq utilisateurs qualifiés doivent être capables de répondre après usage :

1. quel seuil brut leur structure de coûts impose ;
2. quelle part de leur avantage brut est absorbée ;
3. si augmenter la taille peut ou non résoudre leur problème ;
4. quel paramètre domine réellement ;
5. quelle donnée ils souhaiteraient importer pour remplacer une hypothèse.

La preuve recherchée n'est pas « le calculateur est joli ». Elle est : « le produit révèle une contrainte économique que l'utilisateur ne calculait pas correctement auparavant et qu'il veut suivre dans le temps ».

## 10. Gate de développement

Autorisé maintenant, dans un prototype interne isolé :

- moteur déterministe des formules de ce document ;
- scénarios synthétiques ;
- tests d'invariants et cas limites ;
- interface de laboratoire sans déploiement externe ;
- comparaison de sensibilité non prescriptive.

Toujours suspendu :

- import réel ;
- compte utilisateur ;
- courtier réel ;
- barèmes présentés comme actuels ;
- conseil, signaux ou exécution ;
- analytics, paiement et publication publique ;
- métriques statistiques avancées sans données suffisantes.
