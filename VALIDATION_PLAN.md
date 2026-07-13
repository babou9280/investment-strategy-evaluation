# Breaktest — plan de validation commerciale

- Période externe prévue : 30 jours
- Produit testé : Breaktest Capital Efficiency
- Statut actuel : laboratoire interne validé techniquement, publication suspendue
- Objectif : vérifier utilité décisionnelle, usage répété, demande d'import et paiement avant développement étendu

## 1. Question décisive

> Des investisseurs autonomes trouvent-ils plus utile de connaître la part de leur avantage brut qui survit aux frictions et les contraintes économiques associées que de simplement connaître le montant des frais ?

Le test ne vise pas à recueillir des compliments, des inscriptions gratuites ou des intentions abstraites.

## 2. Hypothèses à valider

1. La cible rencontre au moins mensuellement une décision liée aux frais, à la taille d'ordre, à la fréquence, au change ou à la performance nette.
2. Le seuil brut de couverture est compris sans explication longue.
3. Une partie de la cible peut fournir une hypothèse d'avantage brut ou une cible économique explicite.
4. La part d'avantage conservée et la marge nette créent plus de valeur que le total des coûts.
5. Les contraintes inverses répondent à une question réelle : taille frontière, fréquence sous budget ou brut requis.
6. Le plancher variable permet d'identifier les cas qu'une taille supérieure ne peut pas résoudre.
7. L'utilisateur distingue coûts observés, contractuels, estimés et hypothèses.
8. Il revient réaliser une seconde analyse.
9. Il demande un import de transactions ou un suivi automatique.
10. Une fraction accepte une réservation payante ou un abonnement annuel faible.
11. Le produit peut fonctionner avec peu de nettoyage ou de support manuel.

## 3. Définition d'un utilisateur qualifié

Un participant est qualifié s'il déclare au moins trois des caractéristiques suivantes :

- capital investi supérieur ou égal à 2 000 EUR ;
- au moins deux opérations ou versements par mois ;
- investissement sur des actifs en devise étrangère ;
- plusieurs courtiers ou comptes ;
- utilisation d'un tableur, journal ou outil de suivi ;
- difficulté récente à comprendre les frais ou la performance nette ;
- stratégie ou règle d'investissement avec une hypothèse de rendement brut ;
- besoin récent de choisir une taille ou une fréquence d'exécution.

Les personnes sans hypothèse d'avantage brut restent admissibles au mode seuil seul. Elles ne doivent pas être forcées à inventer une performance.

## 4. Phase interne avant publication

### Objectif

Vérifier que le laboratoire est assez utile et compréhensible pour mériter un test externe.

### Protocole

Présenter successivement :

1. un scénario sans avantage brut ;
2. la même situation avec avantage brut explicite ;
3. une rétention cible atteignable ;
4. une rétention structurellement impossible ;
5. un budget annuel de friction.

### Preuves recherchées

- l'utilisateur reformule correctement le seuil brut ;
- il explique la différence entre coût fixe et plancher variable ;
- il comprend que la part conservée peut être négative ;
- il comprend qu'une frontière mathématique n'est pas une recommandation ;
- il identifie au moins une sortie qui éclaire une décision réelle ;
- il ne confond pas le scénario synthétique avec une observation de marché.

### Gate interne

Le laboratoire peut devenir le prototype externe uniquement si, sur cinq revues internes qualifiées :

- quatre participants sur cinq comprennent le seuil sans correction ;
- quatre sur cinq comprennent la marge nette ;
- au moins trois identifient une contrainte inverse utile ;
- aucun ne croit que Breaktest prédit le rendement ou recommande une transaction ;
- le parcours principal est terminé en moins de cinq minutes ;
- aucun défaut bloquant de calcul, navigation ou lisibilité n'apparaît.

Ces seuils sont des règles de décision internes, pas une preuve statistique de marché.

## 5. Expérience minimale externe

### Page de validation

La page devra proposer :

- une promesse claire autour de la survie de l'avantage ;
- un mode seuil sans avantage brut ;
- un mode Edge Survival avec avantage explicite ;
- les contraintes inverses conditionnelles ;
- une démonstration synthétique clairement identifiée ;
- un rapport partageable ;
- une mention explicite : outil d'information, pas conseil en investissement.

### Paramètres demandés

- capital facultatif ;
- taille moyenne d'ordre ;
- nombre d'opérations mensuelles ;
- achat simple ou aller-retour ;
- commission par côté ;
- frais de change ;
- spread et slippage comme hypothèses ;
- avantage brut hypothétique facultatif ;
- part cible d'avantage conservé facultative ;
- budget annuel de friction facultatif ;
- marge nette cible facultative.

### Résultats

Toujours :

- seuil brut de couverture ;
- plancher variable ;
- coût fixe et coût variable ;
- coût annuel arithmétique ;
- sensibilité à la taille.

Lorsque l'avantage brut est fourni :

- marge nette ;
- part absorbée ;
- part conservée ;
- frontière de taille pour une marge positive ;
- frontière de taille pour une rétention cible ;
- impossibilité structurelle explicite.

Lorsque les conditions sont fournies :

- fréquence frontière sous budget ;
- brut requis pour une marge nette cible.

Aucune recommandation sur un actif, un courtier, une taille ou une fréquence ne doit être générée.

## 6. Calendrier externe envisagé

### Jours 1 à 3 — préparation

- figer le message et les calculs ;
- corriger uniquement les défauts issus de la critique interne ;
- préparer cinq scénarios de démonstration ;
- préparer la mesure d'événements minimale ;
- vérifier le langage réglementaire ;
- vérifier Safari/iPad.

### Jours 4 à 10 — premiers utilisateurs

- diffuser auprès de communautés qualifiées ;
- obtenir 100 visiteurs qualifiés ;
- mesurer le passage du seuil seul au mode Edge Survival ;
- observer les abandons ;
- interroger seulement les personnes ayant terminé une analyse ;
- ne corriger que les blocages de compréhension ou de fonctionnement.

### Jours 11 à 20 — récurrence et import

- proposer de sauvegarder localement ou de partager le résultat selon une conception approuvée ;
- inviter à une seconde analyse sans promesse commerciale ;
- recueillir des demandes d'import et des formats représentatifs ;
- mesurer si les utilisateurs reviennent pour un nouveau scénario ;
- tester l'intérêt pour une vue historique.

### Jours 21 à 30 — paiement

Uniquement après revue juridique et décision explicite :

- tester une réservation faible et remboursable ;
- afficher clairement que le produit complet n'est pas encore disponible ;
- documenter les objections ;
- traiter les remboursements sans friction ;
- décider continuer, modifier ou abandonner.

## 7. Événements à mesurer

- `landing_view` ;
- `threshold_mode_start` ;
- `threshold_mode_complete` ;
- `edge_mode_start` ;
- `edge_mode_complete` ;
- `inverse_constraint_view` ;
- `structurally_unreachable_view` ;
- `sensitivity_view` ;
- `report_share` ;
- `return_visit` ;
- `import_request` ;
- `founder_pass_click` ;
- `founder_pass_paid` ;
- `refund_request`.

Aucune donnée financière détaillée ne doit être envoyée à un outil d'analytics. Les événements doivent rester agrégés et minimisés.

## 8. Seuils externes

### Gate positif

À la fin des 30 jours :

- 300 visiteurs qualifiés ;
- 100 analyses complètes ;
- au moins 40 passages volontaires au mode Edge Survival ;
- 20 utilisateurs ayant réalisé une seconde analyse ;
- 10 rapports partagés ;
- 10 réservations ou précommandes payées ;
- au moins cinq demandes spontanées d'import ou de suivi automatique ;
- moins de 20 % des cas nécessitant une intervention manuelle ;
- au moins 60 % des utilisateurs interrogés pouvant reformuler correctement le résultat principal.

### Signal intermédiaire

Le produit peut être poursuivi avec modification si :

- au moins cinq paiements ;
- forte demande d'import ;
- seconde utilisation significative ;
- valeur forte des contraintes inverses, même si l'avantage brut est rarement saisi ;
- le faible paiement provient principalement d'un problème de confiance ou de distribution identifiable.

### Gate négatif

Abandon ou pivot si, après trafic réellement qualifié :

- moins de cinq paiements après 500 visiteurs qualifiés ;
- moins de 10 % reviennent ;
- la majorité ne peut pas fournir d'avantage brut ni de contrainte utile ;
- les contraintes inverses ne modifient aucune décision réelle ;
- presque aucun utilisateur ne demande import ou suivi ;
- les économies ou informations produites sont généralement inférieures au prix ;
- la majorité recherche uniquement une recommandation de courtier ou d'actif ;
- l'acquisition nécessite exclusivement de la publicité payante ;
- le maintien des tarifs ou imports exige un travail humain non scalable.

## 9. Questions post-usage

Les questions sont posées après une utilisation réelle :

1. Quelle décision concrète essayais-tu de prendre ?
2. Quel résultat as-tu compris en premier ?
3. Que signifie pour toi le seuil brut nécessaire ?
4. L'avantage brut saisi venait-il d'une mesure, d'un backtest ou d'une intuition ?
5. Une contrainte calculée a-t-elle changé ton raisonnement ?
6. Comment faisais-tu ce calcul auparavant ?
7. Dans quel délai referais-tu cette analyse ?
8. Qu'attendrais-tu d'un import automatique ?
9. Qu'est-ce qui t'empêcherait de payer un prix annuel faible ?
10. Le résultat t'a-t-il fait économiser du temps ou identifier une friction supérieure au prix du produit ?

Ne pas demander « aimerais-tu ce produit ? » comme preuve de demande.

## 10. Garde-fous

- Ne pas modifier les calculs pour produire un résultat plus spectaculaire.
- Ne pas inventer un avantage brut ou un coût implicite.
- Préférer une plage ou une sensibilité à une fausse précision.
- Ne pas collecter d'identifiants de compte ou de données inutiles.
- Ne pas acheter de trafic avant d'avoir vérifié l'activation organique.
- Ne pas construire l'import complet avant demandes réelles et fichiers représentatifs.
- Ne pas utiliser de faux avis, compteurs ou économies.
- Ne pas présenter une réservation comme un produit déjà disponible.
- Ne pas présenter une frontière mathématique comme une prescription.

## 11. Décisions après le test

### Continuer

Construire le Cost Tracker minimal et prioriser les formats réellement reçus.

### Modifier

- seuil compris mais avantage brut rarement disponible : centrer le produit sur les contraintes de couverture et le suivi ex post ;
- contraintes inverses utiles mais peu de récurrence : produit ponctuel ou widget à tester ;
- forte demande d'import : prioriser les parseurs ;
- forte demande de comparaison : base de barèmes et neutralité ;
- demande de conseil : maintenir la frontière réglementaire ;
- intérêt gratuit mais peu de paiement : tester distribution ou B2B sans construire prématurément.

### Abandonner

Conserver le moteur, les contrats et les preuves techniques, puis réévaluer un autre problème si les critères négatifs sont atteints.

## 12. Développement autorisé avant le test externe

Uniquement :

- correction de bugs ;
- amélioration de compréhension directement liée au protocole ;
- scénarios synthétiques ;
- tests ;
- export méthodologique local ;
- préparation de la revue interne ;
- vérification Safari/iPad.

Restent interdits sans nouvelle décision : import réel, compte, stockage persistant, analytics actif, email, paiement, données de courtier, affiliation, API, conseil et exécution.
