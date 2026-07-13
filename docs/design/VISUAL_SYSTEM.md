# Breaktest Cost Intelligence — système visuel de validation

## 1. Intention

L'interface doit paraître :

- rigoureuse ;
- calme ;
- contemporaine ;
- financière sans codes de trading agressifs ;
- accessible à un particulier ;
- transparente sur ses hypothèses.

Elle ne doit pas ressembler :

- à un terminal institutionnel imité ;
- à une application de signaux ;
- à un casino ou une plateforme crypto ;
- à un dashboard générique généré par IA ;
- à une page de vente remplie de fausses preuves.

## 2. Direction esthétique

Style recommandé : **instrument de mesure premium et sobre**.

Références abstraites :

- densité maîtrisée d'un outil financier ;
- lisibilité d'un calculateur de haute qualité ;
- hiérarchie d'un rapport d'audit ;
- chaleur suffisante pour ne pas sembler réservé aux professionnels.

## 3. Mise en page

- largeur maximale de contenu : environ 1180 px ;
- largeur maximale des paragraphes : 65 à 75 caractères ;
- grille desktop : 12 colonnes ou équivalent simple ;
- espace vertical généreux entre sections ;
- bordures et séparateurs utilisés pour structurer, pas pour décorer ;
- résultats alignés numériquement lorsque possible.

## 4. Typographie

Utiliser une famille système ou libre déjà disponible, sans ajout de fichier de police.

Hiérarchie :

- titre hero : fort mais non spectaculaire ;
- résultat principal : chiffres tabulaires ou alignement stable ;
- labels : courts et explicites ;
- corps : taille confortable, minimum 16 px sur mobile ;
- microtexte : jamais sous 13–14 px.

Les chiffres financiers doivent utiliser des chiffres tabulaires si la police le permet.

## 5. Couleurs

Le système doit fonctionner avec peu de couleurs.

Rôles sémantiques :

- fond principal ;
- surface secondaire ;
- texte principal ;
- texte secondaire ;
- accent d'action ;
- information ;
- avertissement ;
- erreur ;
- focus.

Ne pas utiliser automatiquement vert pour « bon » et rouge pour « mauvais » dans les comparaisons de scénarios. Une baisse de coût peut être indiquée par un signe et un texte, sans suggérer une recommandation financière.

Chaque couleur doit respecter un contraste accessible.

## 6. Composants

### Boutons

- un bouton principal dominant par zone ;
- verbes d'action précis ;
- état focus visible ;
- état désactivé accompagné d'une explication lorsque nécessaire ;
- aucune animation excessive.

### Champs

- label persistant ;
- unité intégrée visuellement sans masquer la saisie ;
- aide sous le champ ;
- erreur locale ;
- taille tactile suffisante ;
- pas de dépendance au placeholder.

### Cartes de résultat

- un seul chiffre principal ;
- unité immédiatement lisible ;
- contexte sous le chiffre ;
- provenance ou hypothèse accessible ;
- éviter les icônes décoratives.

### Aides contextuelles

Préférer une courte définition visible ou une divulgation accessible à un tooltip uniquement survolable.

### Comparaison

- structure identique pour les trois scénarios ;
- scénario actuel clairement identifié ;
- variations alignées ;
- aucun ruban, trophée ou classement.

## 7. Visualisation de la décomposition

Option recommandée : barres horizontales empilées ou liste de barres individuelles.

Exigences :

- valeur absolue toujours visible ;
- part relative secondaire ;
- légende explicite ;
- lecture possible sans couleur ;
- état zéro dédié ;
- les barres très faibles restent identifiables par texte.

Éviter :

- donut sans chiffres ;
- jauge de score ;
- graphique 3D ;
- animation qui déforme les proportions ;
- visualisation donnant l'impression d'une prévision.

## 8. Mouvement

Animations autorisées :

- transition courte lors de l'apparition du résultat ;
- déplacement de focus ;
- ouverture/fermeture d'une section de méthode.

Durée courte, respect de `prefers-reduced-motion`.

Animations interdites :

- compteurs artificiellement lents ;
- confettis ;
- pulsation continue ;
- graphiques animés pour dramatiser le coût ;
- parallax.

## 9. Confiance

La confiance doit venir de la structure, pas de badges fictifs.

Éléments utiles :

- formule accessible ;
- version du calcul ;
- indication `Exemple synthétique` ;
- distinction `Saisi` / `Hypothèse` ;
- limites visibles ;
- absence de compte requis ;
- traitement local ;
- aucune donnée envoyée tant qu'aucun endpoint n'est configuré.

Éléments interdits :

- faux avis ;
- nombre d'utilisateurs inventé ;
- logos de partenaires inexistants ;
- compte à rebours ;
- rareté artificielle ;
- badge de conformité ou de certification.

## 10. Mobile

À 390 px :

- aucun panneau latéral ;
- une seule colonne ;
- bouton principal collant uniquement si cela n'occulte pas le contenu ;
- résultat principal sur une carte pleine largeur ;
- décomposition sous forme de liste ;
- comparaison empilée ;
- footer compact ;
- aucun texte critique dans une infobulle non accessible.

## 11. Desktop

À partir de 1024 px :

- formulaire et résultat peuvent être côte à côte ;
- le résultat peut rester visible pendant la modification, sans empêcher la lecture du formulaire ;
- ne pas transformer la page en tableau de bord multi-panneaux ;
- conserver une trajectoire verticale claire.

## 12. Critères de revue visuelle

La page doit être rejetée si :

- elle ressemble à une application de trading ou de signaux ;
- l'utilisateur ne sait pas distinguer données saisies et estimées ;
- le CTA commercial domine le résultat ;
- des cartes décoratives augmentent la densité sans information ;
- les résultats sont trop petits sur mobile ;
- la couleur seule communique une comparaison ;
- le design laisse croire à des tarifs réels ou une recommandation ;
- le contenu déborde horizontalement ;
- l'apparence promet un produit complet alors qu'il s'agit d'une validation.
