# Breaktest — protocole de revue utilisateur interne

## Statut

- Préparation interne uniquement.
- Aucun recrutement, envoi de lien ou collecte externe n'est autorisé par ce document.
- Le protocole vise la compréhension et l'utilité, pas la validation statistique d'un marché.

## 1. Objectif

Déterminer si Breaktest Capital Efficiency permet à une personne qualifiée de comprendre :

1. le rendement brut nécessaire pour couvrir les frictions ;
2. la différence entre coût fixe diluable et plancher variable ;
3. la marge qui subsiste après les coûts ;
4. une contrainte inverse conditionnelle ;
5. les limites du calcul.

## 2. Participants

Cinq participants suffisent pour cette revue exploratoire.

Chercher une diversité minimale :

- deux investisseurs particuliers actifs ;
- un utilisateur de tableur ou journal de trading ;
- une personne compétente en finance mais non spécialiste de microstructure ;
- une personne raisonnablement à l'aise avec les chiffres mais peu expérimentée en investissement.

Ne pas présenter le fondateur, la technologie ou l'ambition avant la tâche : cela créerait un biais de bienveillance.

## 3. Consignes au participant

Texte exact :

> « Cet outil est un prototype. Il ne recommande aucune transaction et ne prédit aucun rendement. Je souhaite vérifier s'il explique clairement l'effet des coûts. Utilise-le en pensant à un scénario plausible pour toi. Dis à voix haute ce que tu comprends. Je ne t'aiderai qu'en cas de blocage technique. »

## 4. Parcours

### Tâche A — seuil seul

Demander :

> « Sans saisir de rendement supposé, détermine ce que l'opération doit générer brut pour seulement couvrir les frictions. »

Mesurer :

- temps jusqu'au résultat ;
- erreurs ;
- reformulation spontanée du seuil ;
- compréhension du plancher variable.

### Tâche B — avantage brut

Donner une hypothèse synthétique explicite :

> « Suppose maintenant que ta méthode produit 2 % brut par opération. Que reste-t-il après les frictions ? »

Mesurer :

- compréhension de la part conservée ;
- compréhension de la marge nette ;
- confusion éventuelle entre hypothèse et prévision.

### Tâche C — contrainte inverse

Demander au participant de choisir une seule question :

- quelle taille est compatible avec une marge positive ?
- quelle taille est compatible avec une part conservée choisie ?
- quelle fréquence reste sous un budget annuel ?
- quel brut est requis pour une marge nette cible ?

Mesurer :

- utilité de la réponse ;
- perception comme calcul ou recommandation ;
- capacité à expliquer la condition.

### Tâche D — impossibilité structurelle

Présenter un scénario où l'avantage brut est inférieur au plancher variable.

Demander :

> « Est-ce qu'augmenter la taille suffit à résoudre ce scénario ? Pourquoi ? »

La bonne compréhension est : non, car la composante variable proportionnelle reste supérieure ou égale à l'avantage brut.

## 5. Questions après usage

Ne pas demander « est-ce que tu aimes ? ».

Demander :

1. Quel résultat as-tu compris en premier ?
2. Explique le seuil brut avec tes propres mots.
3. Quelle différence fais-tu entre coût fixe et plancher variable ?
4. D'où viendrait ton hypothèse d'avantage brut dans la réalité ?
5. Quel résultat pourrait changer une décision réelle ?
6. Quelle partie semble être une recommandation alors qu'elle ne devrait pas l'être ?
7. Quel champ supprimerais-tu du premier écran ?
8. Dans quel délai referais-tu cette analyse ?
9. Quelles données souhaiterais-tu importer ?
10. Qu'est-ce qui rendrait le résultat suffisamment fiable pour payer ?

## 6. Grille d'observation

Pour chaque participant, conserver uniquement :

- profil qualifié, sans identité inutile ;
- tâche réelle envisagée ;
- temps seuil seul ;
- temps parcours complet ;
- compréhension seuil : correcte / partielle / incorrecte ;
- compréhension marge nette : correcte / partielle / incorrecte ;
- compréhension plancher : correcte / partielle / incorrecte ;
- contrainte jugée utile ;
- confusion avec conseil ou prévision : oui / non ;
- demande spontanée d'import : oui / non ;
- intention de réutilisation et horizon ;
- objection principale ;
- citation courte uniquement avec consentement.

## 7. Interdictions pendant la session

- ne pas expliquer le résultat avant la reformulation ;
- ne pas défendre le produit ;
- ne pas orienter vers une contrainte particulière ;
- ne pas présenter le scénario synthétique comme réel ;
- ne pas demander de donnée de compte ;
- ne pas noter seulement les retours favorables ;
- ne pas modifier le prototype entre participants sans consigner la version.

## 8. Gate interne

Passage possible vers un prototype externe si :

- 4/5 comprennent correctement le seuil ;
- 4/5 comprennent la marge nette ;
- 3/5 trouvent au moins une contrainte inverse utile ;
- 0/5 croient que Breaktest prédit le rendement ou recommande une transaction ;
- médiane du mode seuil inférieure à 90 secondes ;
- médiane du parcours complet inférieure à cinq minutes ;
- aucun défaut technique bloquant ;
- les objections restantes peuvent être traitées sans élargissement majeur.

## 9. Gate négatif

Revoir profondément l'expérience si :

- moins de trois participants comprennent le seuil ;
- l'avantage brut est systématiquement inventé sans base ;
- les contraintes sont interprétées comme prescriptions ;
- personne n'identifie de décision concrète ;
- la majorité demande uniquement un comparateur de courtiers ou une recommandation d'actif ;
- la valeur dépend d'une explication humaine longue.

## 10. Sortie attendue

Après cinq sessions, produire :

- résultats bruts anonymisés ;
- défauts classés ;
- éléments à supprimer ;
- corrections de compréhension ;
- décision continuer / modifier / abandonner ;
- aucune affirmation de marché au-delà de ces cinq observations.