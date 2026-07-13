# Breaktest — plan de validation commerciale

- Période : 30 jours
- Produit testé : Breaktest Cost Intelligence
- Objectif : vérifier problème, usage répété, import et paiement avant développement étendu

## 1. Question décisive

> Des investisseurs autonomes reviennent-ils utiliser une analyse de coûts, demandent-ils un suivi de leurs transactions et acceptent-ils de payer un prix annuel faible pour cette valeur ?

Le test ne vise pas à recueillir des compliments, des inscriptions gratuites ou des préférences déclarées.

## 2. Hypothèses à valider

1. La cible rencontre au moins mensuellement une décision liée aux frais, à la taille d'ordre, à la fréquence ou au change.
2. Une simulation personnalisée est plus utile qu'une grille tarifaire générique.
3. L'utilisateur comprend la distinction entre coûts observés, contractuels et estimés.
4. Il revient réaliser une seconde simulation.
5. Il demande un import de transactions ou un suivi automatique.
6. Une fraction accepte une réservation payante de 9 EUR ou une précommande annuelle de 39 EUR.
7. Le produit peut fonctionner avec peu de nettoyage ou de support manuel.

## 3. Définition d'un utilisateur qualifié

Un visiteur est qualifié s'il déclare au moins trois des caractéristiques suivantes :

- capital investi supérieur ou égal à 2 000 EUR ;
- au moins deux opérations ou versements par mois ;
- investissement sur des actifs en devise étrangère ;
- plusieurs courtiers ou comptes ;
- utilisation d'un tableur, journal ou outil de suivi ;
- difficulté récente à comprendre les frais ou la performance nette.

## 4. Expérience minimale

### Page de validation

La page doit proposer :

- une promesse claire ;
- une simulation sans compte ;
- un résultat immédiatement lisible ;
- un comparatif de trois tailles ou fréquences ;
- un rapport partageable ;
- un appel à réserver le Founder Pass ;
- une mention explicite : outil d'information, pas conseil en investissement.

### Paramètres demandés

- capital ;
- taille moyenne d'ordre ;
- nombre d'ordres mensuels ;
- frais fixes aller et retour ;
- frais de change ;
- spread et slippage comme hypothèses optionnelles ;
- rendement brut hypothétique facultatif.

### Résultats

- coût par aller-retour ;
- coût annuel ;
- coût en pourcentage de l'ordre ;
- coût en pourcentage du capital ;
- part du rendement brut absorbée, uniquement si un rendement est saisi ;
- rendement brut nécessaire pour couvrir les coûts ;
- comparaison entre les scénarios.

Aucune recommandation sur un actif ou un courtier ne doit être générée.

## 5. Calendrier

### Jours 1 à 3 — préparation

- figer le message et les calculs ;
- créer la page, le formulaire et cinq scénarios de démonstration ;
- installer une mesure d'événements minimale ;
- préparer les messages de diffusion ;
- vérifier le langage réglementaire.

### Jours 4 à 10 — premiers utilisateurs

- diffuser dans des communautés qualifiées ;
- obtenir 100 visiteurs qualifiés ;
- observer les abandons ;
- interroger seulement les personnes ayant terminé la simulation ;
- ne corriger que les blocages de compréhension ou de fonctionnement.

### Jours 11 à 20 — récurrence et import

- proposer de sauvegarder le résultat ;
- envoyer un rappel non promotionnel pour une seconde simulation ;
- recueillir des exemples anonymisés de relevés ;
- mesurer les demandes d'import et de comparaison entre courtiers ;
- proposer le Founder Pass.

### Jours 21 à 30 — paiement

- tester la réservation à 9 EUR ;
- afficher clairement l'offre future à 39 EUR la première année ;
- documenter les objections ;
- traiter les remboursements sans friction ;
- décider continuer, modifier ou abandonner.

## 6. Événements à mesurer

- `landing_view` ;
- `calculator_start` ;
- `calculator_complete` ;
- `scenario_compare` ;
- `report_share` ;
- `email_submit` ;
- `return_visit` ;
- `import_request` ;
- `founder_pass_click` ;
- `founder_pass_paid` ;
- `refund_request`.

Aucune donnée financière détaillée ne doit être envoyée à un outil d'analytics pendant le test. Les événements doivent rester agrégés et minimisés.

## 7. Seuils

### Gate positif

À la fin des 30 jours :

- 300 visiteurs qualifiés ;
- 100 simulations complètes ;
- 30 sauvegardes ou emails ;
- 20 utilisateurs ayant réalisé une seconde simulation ;
- 10 rapports partagés ;
- 10 réservations ou précommandes payées ;
- au moins trois demandes spontanées d'import ou de suivi automatique ;
- moins de 20 % des cas nécessitant une intervention manuelle.

### Signal intermédiaire

Le produit peut être poursuivi avec modification si :

- au moins cinq paiements ;
- forte demande d'import ;
- seconde utilisation significative ;
- le faible paiement provient principalement d'un problème de prix ou de confiance identifiable.

### Gate négatif

Abandon ou pivot si, après trafic réellement qualifié :

- moins de cinq paiements après 500 visiteurs qualifiés ;
- moins de 10 % reviennent ;
- presque aucun utilisateur ne demande import ou suivi ;
- les économies potentielles sont généralement inférieures au prix ;
- la majorité recherche uniquement une recommandation de courtier ou d'actif ;
- l'acquisition nécessite exclusivement de la publicité payante ;
- le maintien des tarifs ou imports exige un travail humain non scalable.

## 8. Questions post-usage

Les questions sont posées après une utilisation réelle :

1. Quelle décision concrète essayais-tu de prendre ?
2. Quel chiffre t'a surpris ?
3. Comment faisais-tu ce calcul auparavant ?
4. Dans quel délai referais-tu cette analyse ?
5. Qu'attendrais-tu d'un import automatique ?
6. Qu'est-ce qui t'empêcherait de payer 39 EUR par an ?
7. Le résultat t'a-t-il fait économiser du temps ou identifier un coût supérieur au prix du produit ?

Ne pas demander « aimerais-tu ce produit ? » comme preuve de demande.

## 9. Garde-fous

- Ne pas modifier les calculs pour produire un résultat plus spectaculaire.
- Ne pas inventer un coût implicite : afficher un intervalle ou demander une hypothèse.
- Ne pas collecter d'identifiants de compte ou de données inutiles.
- Ne pas acheter de trafic avant d'avoir vérifié l'activation organique.
- Ne pas construire l'import complet avant trois demandes réelles et des fichiers représentatifs.
- Ne pas utiliser de faux avis, compteurs ou économies.
- Ne pas présenter la réservation comme un produit déjà disponible.

## 10. Décisions après le test

### Continuer

Construire le Cost Tracker minimal et prioriser les formats de fichiers réellement reçus.

### Modifier

- intérêt gratuit mais peu de paiement : comparateur/affiliation ou widget B2B à tester ;
- paiement mais peu de récurrence : offre ponctuelle de rapport ;
- forte demande d'import : prioriser les parseurs ;
- forte demande de comparaison : base de barèmes et neutralité ;
- demande de conseil : maintenir la frontière réglementaire et ne pas suivre cette demande sans avis juridique.

### Abandonner

Conserver le moteur technique et réévaluer un autre problème si les critères négatifs sont atteints.

## 11. Développement autorisé pendant la validation

Uniquement :

- page statique ;
- calculateur déterministe limité ;
- mesure d'événements minimale ;
- formulaire ;
- paiement ou réservation clairement présenté ;
- correction de bugs bloquants.

Tout autre développement est suspendu.