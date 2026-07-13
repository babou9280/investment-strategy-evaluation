# Breaktest Cost Intelligence — spécification UX de la page de validation

## 1. Contrat d'usage

La page doit être utile sans inscription, sans donnée de courtier et sans lecture préalable de la méthodologie.

Objectif comportemental : obtenir un premier calcul valide en moins de 90 secondes sur mobile.

## 2. Structure d'écran

### Barre supérieure

- marque `BREAKTEST` ;
- sous-label `Cost Intelligence` ;
- lien `Méthode et limites` ;
- aucune navigation produit fictive.

### Hero

- sur-titre : `POUR PETITS ET MOYENS PORTEFEUILLES` ;
- titre : `Combien tes ordres coûtent-ils vraiment ?` ;
- sous-titre en deux lignes maximum sur desktop ;
- bouton principal : `Calculer mon cost drag` ;
- preuves courtes sous le bouton.

### Calculateur

Desktop : deux colonnes maximum, formulaire à gauche et aperçu/résultat à droite après calcul.

Mobile : une seule colonne, formulaire puis résultat. Aucun résultat critique ne doit rester hors écran après l'action ; le calcul doit faire défiler vers le bloc résultat et lui donner le focus logique.

## 3. Modèle de formulaire

### Groupe A — portefeuille

#### Capital investi

- type : champ numérique ;
- unité : EUR ;
- précision : centimes acceptés, affichage arrondi à deux décimales si nécessaire ;
- minimum : strictement supérieur à zéro pour calculer le ratio annuel sur capital ;
- aide : `Capital de référence utilisé pour mesurer le poids annuel des frictions.`

#### Montant moyen par ordre

- type : champ numérique ;
- unité : EUR ;
- minimum : strictement supérieur à zéro ;
- aide : `Montant notionnel d'un achat ou d'une vente.`

#### Type d'activité

Contrôle segmenté :

- `Achat simple` ;
- `Aller-retour`.

Par défaut : `Aller-retour`, car les scénarios de référence utilisent principalement cette convention. Le changement doit adapter les libellés des commissions et du change sans modifier silencieusement les valeurs.

#### Fréquence mensuelle

- type : champ numérique ;
- unité dynamique : `achats/mois` ou `allers-retours/mois` ;
- minimum : zéro ;
- décimales autorisées pour représenter une fréquence trimestrielle ou occasionnelle ;
- aide : `Exemple : 0,33 correspond environ à une opération tous les trois mois.`

### Groupe B — frictions

#### Commission par côté

- type : champ numérique ;
- unité : EUR ;
- minimum : zéro ;
- provenance affichée : `Saisie utilisateur`.

#### Change par conversion

- type : champ numérique ;
- unité : % ;
- minimum : zéro ;
- aide : `Mets 0 si l'opération ne nécessite pas de conversion de devise.`

#### Spread estimé

- type : champ numérique ;
- unité : % ;
- minimum : zéro ;
- aide : `Écart achat-vente total attribué au scénario.`

#### Slippage estimé

- type : champ numérique ;
- unité : % ;
- minimum : zéro ;
- aide : `Écart hypothétique entre le prix attendu et le prix exécuté.`

## 4. Valeurs initiales

La page peut préremplir le scénario synthétique intermédiaire suivant :

- capital : 5 000 EUR ;
- ordre : 500 EUR ;
- type : aller-retour ;
- fréquence : 4 par mois ;
- commission : 1 EUR par côté ;
- change : 0,25 % par côté ;
- spread : 0,10 % aller-retour ;
- slippage : 0,10 % aller-retour.

Une mention adjacente doit préciser :

> Exemple synthétique modifiable — aucun tarif de courtier réel.

Les valeurs ne doivent pas être calculées avant action explicite si cela réduit la compréhension du lien entre saisie et résultat. Un aperçu discret peut être actualisé, mais le résultat principal doit nécessiter `Voir l'impact` pour créer un événement mesurable.

## 5. Validation des saisies

### Règles

- chaîne vide : `missing` ;
- texte non numérique : `invalid` ;
- valeur négative : `invalid` ;
- zéro : valeur valide pour les coûts et la fréquence ;
- zéro : invalide pour le montant de l'ordre ;
- zéro ou absent pour le capital : ratio annuel sur capital indisponible, sans empêcher les autres calculs ;
- valeurs infinies ou hors capacité numérique : `invalid`.

### Messages

- champ absent obligatoire : `Indique un montant supérieur à 0.` ;
- valeur négative : `La valeur ne peut pas être négative.` ;
- valeur non numérique : `Entre un nombre valide.` ;
- capital indisponible : `Le coût par opération reste calculable, mais pas son poids annuel dans le capital.`

Ne jamais afficher un message générique unique lorsque le défaut peut être localisé.

## 6. Action principale

Bouton : `Voir l'impact`.

Comportement :

1. valider tous les champs ;
2. si erreur, focus sur le premier champ invalide ;
3. sinon calculer avec les valeurs internes non arrondies ;
4. afficher le résultat ;
5. faire défiler le résultat dans la zone visible ;
6. annoncer `Résultat mis à jour` via une région `aria-live` non intrusive.

La touche Entrée dans le formulaire déclenche la même action, sauf dans un contrôle où elle a une fonction native différente.

## 7. Résultat principal

### Carte 1 — coût par opération

Valeur principale : `5,50 EUR`.

Sous-valeur : `1,10 % du montant de l'ordre`.

Libellé selon le mode :

- `Coût estimé par achat` ;
- `Coût estimé par aller-retour`.

### Carte 2 — impact annuel

- `264 EUR par an` ;
- `5,28 % du capital de référence` ;
- fréquence récapitulée.

Si le capital n'est pas disponible, le second ratio est remplacé par une mention d'indisponibilité.

### Carte 3 — seuil de couverture

Texte :

> Le résultat brut doit couvrir au moins 1,10 % par aller-retour pour compenser les frictions saisies.

Microtexte obligatoire :

> Ce seuil mathématique n'indique ni la probabilité de gain ni l'intérêt de réaliser l'opération.

## 8. Décomposition

Afficher une liste classée par montant décroissant, mais conserver la même couleur et le même ordre sémantique dans tous les scénarios :

1. commissions ;
2. change ;
3. spread ;
4. slippage.

Pour chaque ligne :

- libellé ;
- valeur EUR ;
- pourcentage du coût total ;
- marqueur `Saisi` ou `Hypothèse`.

Le classement visuel par montant ne doit pas modifier l'ordre dans le texte partagé ou dans les données de test.

## 9. Comparaison de scénarios

Trois cartes de largeur égale sur desktop, empilées sur mobile :

- `Scénario actuel` ;
- `Ordre ×2` ;
- `Fréquence ÷2`.

Chaque carte montre uniquement :

- coût par opération ;
- coût relatif à l'ordre ;
- coût annuel ;
- impact annuel sur capital.

Les variations par rapport au scénario actuel peuvent être affichées avec `+` ou `−`, sans couleur normative ni vocabulaire valorisant.

Exemples autorisés :

- `−48 EUR/an par rapport au scénario actuel` ;
- `+0,20 point de coût par ordre`.

Exemples interdits :

- `économie optimale` ;
- `meilleur choix` ;
- `recommandé pour toi`.

## 10. Partage

### Action

Bouton : `Partager ce résultat`.

### Contenu partageable

- type de scénario ;
- taille d'ordre arrondie ;
- fréquence ;
- composantes de coût ;
- coût par opération ;
- coût annuel ;
- lien vers la page.

### Contenu exclu

- email ;
- pseudonyme ;
- capital exact si l'utilisateur n'active pas explicitement son inclusion ;
- toute donnée collectée dans le formulaire final.

Le comportement de validation par défaut doit produire un texte copiable ou utiliser l'API de partage si disponible, avec fallback vers le presse-papiers.

## 11. Formulaire d'intérêt

Le formulaire apparaît après les résultats et limites.

Champs visibles au premier niveau :

- email ;
- tranche de capital ;
- fréquence ;
- besoin prioritaire.

Options supplémentaires sous divulgation progressive :

- import anonymisé ;
- participation à un entretien ;
- commentaire libre.

Le bouton de paiement reste désactivé et accompagné de :

> Réservation non ouverte dans cette version de validation.

Le bouton email peut être configurable, mais sans endpoint actif dans le dépôt.

## 12. Ton et microcopy

### Ton

- factuel ;
- direct ;
- non culpabilisant ;
- pédagogique sans infantiliser ;
- prudent sans devenir juridique ou anxiogène.

### Formulations préférées

- `Selon les hypothèses saisies…` ;
- `Le calcul estime…` ;
- `Cette composante représente…` ;
- `Tu peux tester une autre valeur.`

### Formulations interdites

- `Tu perds` lorsqu'il s'agit d'une estimation ;
- `mauvais courtier` ;
- `trade non rentable` ;
- `fais plutôt` ;
- `économise automatiquement` ;
- `garanti` ;
- `intelligent` sans comportement concret.

## 13. Responsive

### 390 px

- une colonne ;
- champs pleine largeur ;
- boutons pleine largeur ;
- résultat principal visible sans zoom ;
- comparaison empilée ;
- aucune table horizontale.

### 768 px

- formulaire toujours simple ;
- résultat peut passer en deux colonnes ;
- comparaison en une ou deux colonnes selon l'espace réel.

### 1024 px et 1440 px

- largeur de lecture plafonnée ;
- calculateur et résultat côte à côte ;
- ne pas étirer les lignes de texte ;
- aucune densification artificielle.

## 14. Critères d'acceptation UX

- premier calcul sans souris ;
- aucune valeur coupée ou masquée à 390 px ;
- aucun débordement horizontal aux quatre largeurs testées ;
- labels et unités visibles après saisie ;
- focus visible dans tous les états ;
- résultat annoncé après calcul ;
- comparaison compréhensible sans couleur ;
- partage ne contenant aucune donnée personnelle ;
- mention synthétique visible près des valeurs initiales ;
- mention non-prescriptive visible près du seuil de couverture ;
- offre seulement après le résultat et les limites.
