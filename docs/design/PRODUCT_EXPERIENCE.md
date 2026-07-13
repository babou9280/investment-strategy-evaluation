# Breaktest Cost Intelligence — conception produit

## 1. Objectif de l'expérience

Le site de validation doit permettre à un investisseur particulier de répondre en moins de 90 secondes à une question précise :

> Quelle part de mon capital et de mon ordre est absorbée par les frictions de ce scénario ?

L'expérience ne doit pas chercher à impressionner par la quantité de métriques. Elle doit transformer un problème diffus en une séquence courte :

1. saisir un scénario ;
2. voir immédiatement le coût total ;
3. comprendre quelle composante domine ;
4. comparer deux variations simples ;
5. décider si le problème mérite un suivi plus complet.

## 2. Public initial

Utilisateur principal : investisseur autonome disposant d'environ 2 000 à 50 000 EUR, effectuant plusieurs opérations par mois et ne sachant pas précisément mesurer l'effet combiné des commissions, du change, du spread, du slippage et de la fréquence.

L'interface doit également rester compréhensible pour un capital inférieur à 2 000 EUR, sans supposer de connaissances en microstructure de marché.

## 3. Principes d'expérience

### P1 — Une seule décision cognitive à la fois

Ne jamais présenter tous les champs, explications et résultats comme un tableau dense. La progression doit être évidente : scénario, frictions, comparaison, limites, intérêt pour la suite.

### P2 — Résultat avant pédagogie longue

Le premier écran explique le bénéfice, puis conduit rapidement au calculateur. Les définitions détaillées restent accessibles par aide contextuelle ou section méthodologique.

### P3 — Aucun faux niveau de précision

Les résultats exacts issus des entrées sont calculés sans arrondi interne. L'affichage doit distinguer clairement :

- données saisies par l'utilisateur ;
- hypothèses estimées ;
- résultats calculés ;
- données synthétiques de démonstration.

### P4 — Montrer les composantes, pas seulement un score

Le coût total doit être décomposé en :

- commissions ;
- change ;
- spread ;
- slippage.

Aucun score opaque ne remplace cette décomposition.

### P5 — Comparer sans recommander

Le produit peut montrer qu'un scénario coûte davantage qu'un autre. Il ne doit jamais conclure qu'une taille, une fréquence, un actif ou un courtier est optimal.

### P6 — Les petits écrans sont prioritaires

Le parcours doit être utilisable à une main sur téléphone. Aucun tableau critique ne doit nécessiter un défilement horizontal.

## 4. Parcours principal

### Écran 1 — Comprendre la promesse

Contenu obligatoire au-dessus de la ligne de flottaison :

- titre : `Combien tes ordres coûtent-ils vraiment ?` ;
- phrase d'explication d'une ligne ;
- bouton principal : `Calculer mon cost drag` ;
- quatre garanties courtes : immédiat, sans compte, paramètres visibles, sans recommandation.

Le bouton fait défiler vers le calculateur et place le focus sur le premier champ.

### Écran 2 — Définir le scénario

Le formulaire est séparé en deux blocs visibles :

**Portefeuille et activité**

- capital investi ;
- montant moyen par ordre ;
- type de fréquence : achat simple ou aller-retour ;
- nombre d'opérations par mois.

**Frictions**

- commission par côté ;
- frais de change par côté ;
- spread estimé ;
- slippage estimé.

Chaque champ possède :

- unité visible ;
- exemple non contraignant ;
- aide courte ;
- état d'erreur précis.

Les valeurs de démonstration ne doivent pas être présentées comme des tarifs réels.

### Écran 3 — Lire le résultat principal

Ordre visuel obligatoire :

1. coût par opération ou aller-retour en EUR ;
2. coût en pourcentage du montant de l'ordre ;
3. coût annuel selon la fréquence ;
4. coût annuel rapporté au capital initial.

Le premier nombre doit être le plus visible. Les autres restent importants mais secondaires.

Phrase d'interprétation autorisée :

> Selon ce scénario, la performance brute doit d'abord couvrir X % de frictions par opération.

Phrase interdite :

> Tu devrais attendre, regrouper, acheter moins souvent ou choisir un autre courtier.

### Écran 4 — Comprendre ce qui coûte

Afficher une décomposition visuelle simple :

- barres horizontales ou liste proportionnelle ;
- valeur en EUR ;
- part du coût total ;
- provenance de la composante : saisie utilisateur ou hypothèse.

Lorsque le coût total vaut zéro, afficher un état dédié plutôt qu'un graphique vide.

### Écran 5 — Tester deux variations

Afficher exactement trois scénarios :

- scénario actuel ;
- montant d'ordre multiplié par deux ;
- fréquence divisée par deux.

La comparaison montre les écarts absolus et relatifs. Aucun badge `meilleur`, `recommandé`, `optimal` ou équivalent.

Si la fréquence est déjà nulle ou trop faible pour être divisée proprement, le scénario comparatif doit rester mathématiquement explicite et ne pas inventer de valeur.

### Écran 6 — Prouver la transparence

Afficher avant toute offre :

- ce qui est calculé ;
- ce qui est estimé ;
- ce qui n'est pas inclus ;
- la formule simplifiée ;
- la mention non-prescriptive.

### Écran 7 — Mesurer l'intérêt réel

L'appel final ne promet pas un produit existant. Il propose :

- `Recevoir l'ouverture` ;
- emplacement configurable pour une future réservation, désactivé par défaut.

Le formulaire doit demander le minimum nécessaire à la validation commerciale.

## 5. Architecture de l'information

Ordre recommandé de la page :

1. navigation minimale ;
2. hero ;
3. calculateur ;
4. résultat ;
5. décomposition ;
6. comparaison ;
7. cas fondateur ;
8. méthode et limites ;
9. intérêt pour la suite ;
10. footer légal.

Ne pas intercaler d'offre commerciale avant que l'utilisateur ait obtenu un résultat.

## 6. Hiérarchie visuelle

### Niveau 1

- résultat principal ;
- titre de la promesse ;
- action de calcul.

### Niveau 2

- coût annuel ;
- impact sur le capital ;
- décomposition ;
- comparaison.

### Niveau 3

- explications ;
- provenance ;
- détails méthodologiques ;
- offre future.

Les cartes décoratives, chiffres de vanité et animations sans rôle décisionnel sont interdits.

## 7. Terminologie

### Termes utilisateurs

- `frictions` : ensemble des coûts explicites et implicites ;
- `coût par opération` ;
- `coût annuel estimé` ;
- `part du capital absorbée` ;
- `seuil de couverture des frais` ;
- `hypothèse de spread` ;
- `hypothèse de slippage`.

### Termes à éviter dans l'interface principale

- points de base sans équivalent en pourcentage ;
- alpha ;
- microstructure ;
- optimal ;
- signal ;
- recommandation ;
- rentabilité attendue.

`Cost drag` peut être conservé comme nom de concept, mais doit toujours être expliqué en français lors de sa première apparition.

## 8. États essentiels

### Avant calcul

Afficher une explication concise, pas un résultat vide.

### Entrée invalide

- message au niveau du champ ;
- message récapitulatif si plusieurs erreurs ;
- focus placé sur la première erreur ;
- aucune conversion silencieuse ;
- conserver les autres saisies valides.

### Tous les coûts à zéro

Afficher :

> Ce scénario ne contient aucune friction saisie. Le résultat est donc nul ; cela ne signifie pas qu'une exécution réelle serait sans coût.

### Fréquence nulle

- coût annuel nul ;
- coût par opération toujours calculable si les autres données le permettent ;
- aucune division impossible.

### Capital nul ou absent

Le coût par opération peut être calculé si le montant d'ordre est valide, mais le ratio annuel sur capital doit rester indisponible avec une explication. Ne jamais afficher `Infinity`, `NaN` ou zéro inventé.

### Partage

Le lien ou texte partagé ne doit contenir ni email, ni capital exact, ni autre donnée personnelle. Il peut contenir uniquement les hypothèses de calcul explicitement choisies pour le rapport partagé.

## 9. Accessibilité et ergonomie

- navigation complète au clavier ;
- focus visible ;
- labels persistants, jamais remplacés uniquement par des placeholders ;
- contraste suffisant ;
- zones tactiles d'au moins 44 px ;
- aucune information transmise uniquement par couleur ;
- résultats annoncés aux technologies d'assistance après calcul ;
- unités lisibles et attachées aux champs ;
- ordre de tabulation logique ;
- respect de `prefers-reduced-motion`.

## 10. Critères de réussite du design

Le design est acceptable uniquement si :

- un nouvel utilisateur peut expliquer le résultat principal après 30 secondes ;
- la différence entre coût saisi, estimation et résultat calculé est visible ;
- le calcul complet tient sans zoom sur 390 px ;
- aucun écran ne donne l'impression qu'un courtier ou une opération est recommandé ;
- l'utilisateur voit le résultat avant l'offre ;
- le produit paraît sérieux sans prétendre être institutionnel ;
- les limites sont lisibles sans dominer le premier écran ;
- la page fonctionne sans compte, backend ou donnée réelle de courtier.

## 11. Non-objectifs de cette version

- personnalisation selon objectifs patrimoniaux ;
- choix automatique d'un courtier ;
- recommandation de fréquence ;
- import de transactions ;
- suivi historique ;
- compte utilisateur ;
- paiement actif ;
- notification ;
- connexion courtier ;
- score global de qualité d'investissement ;
- promesse d'économie réelle.
