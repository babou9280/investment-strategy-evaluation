# Breaktest Cost Intelligence — protocole de test utilisateur

## 1. Question de recherche

Un investisseur autonome comprend-il en moins de 90 secondes l'impact combiné des frictions de son scénario, juge-t-il le résultat crédible et identifie-t-il une raison concrète de réutiliser l'outil ?

Le test ne cherche pas à obtenir des compliments. Il doit permettre de rejeter la proposition si le problème, le calcul ou l'usage répété ne sont pas suffisamment forts.

## 2. Participants initiaux

Première vague : 5 participants.

Critères :

- investit déjà avec son propre argent ou prévoit de le faire à court terme ;
- connaît approximativement son capital et sa fréquence ;
- a déjà vu une commission, un change, un spread ou un prix d'exécution ;
- n'a pas participé à la conception de Breaktest ;
- ne reçoit aucune rémunération conditionnée à un avis positif.

Composition recherchée :

- 2 capitaux inférieurs à 2 000 EUR ;
- 2 capitaux entre 2 000 et 10 000 EUR ;
- 1 capital supérieur à 10 000 EUR ;
- au moins 2 utilisateurs d'actifs ou marchés dans une autre devise ;
- au moins 1 utilisateur peu actif et 1 utilisateur effectuant plusieurs opérations par mois.

## 3. Déroulé de 15 minutes

### Préambule — 30 secondes

Texte exact :

> « Ce prototype mesure l'impact d'hypothèses de coûts. Il ne te dit pas quoi acheter. Je teste l'outil, pas tes connaissances. Utilise-le comme tu le ferais seul et dis à voix haute ce que tu comprends ou ne comprends pas. »

Ne pas expliquer les champs avant que le participant demande de l'aide.

### Tâche 1 — premier résultat

Instruction :

> « Utilise l'outil pour représenter une opération ou une habitude d'investissement qui te ressemble. »

Mesures :

- temps jusqu'au premier résultat ;
- champs nécessitant une aide ;
- erreurs de saisie ;
- interprétation spontanée des quatre chiffres principaux ;
- compréhension d'achat simple contre aller-retour ;
- compréhension de spread et slippage ;
- phrase spontanée décrivant le résultat.

### Tâche 2 — comparaison

Instruction :

> « Regarde les deux variations. Explique ce qui change et ce qui ne change pas. »

Le participant doit comprendre au minimum :

- que l'ordre ×2 ne réduit pas tous les coûts en euros ;
- que la fréquence ÷2 ne change pas le coût d'une opération ;
- qu'aucune variante n'est recommandée automatiquement.

### Tâche 3 — confiance

Questions exactes :

1. « Quel résultat te semble le plus utile ? »
2. « Quel résultat te semble le moins crédible ? »
3. « Qu'est-ce qui te manque pour faire confiance au calcul ? »
4. « D'où obtiendrais-tu les chiffres de spread et de slippage ? »
5. « Que ferais-tu sans cet outil ? »

### Tâche 4 — répétition et paiement

Questions exactes :

1. « À quel moment précis réutiliserais-tu cet outil ? »
2. « Qu'est-ce qui devrait être automatique pour que tu reviennes ? »
3. « Le calcul gratuit te suffit-il ? Pourquoi ? »
4. « Paierais-tu 39 EUR par an pour importer tes transactions et suivre ces coûts ? »
5. « Préférerais-tu payer 9 EUR une fois, 39 EUR par an, ou ne pas payer ? »

Une réponse déclarative n'est pas considérée comme un paiement.

## 4. Aide autorisée

Le facilitateur peut :

- reformuler une consigne ;
- rappeler que les chiffres sont des hypothèses ;
- arrêter le test en cas de donnée sensible saisie par erreur.

Il ne peut pas :

- expliquer la formule avant l'observation initiale ;
- défendre le produit ;
- contredire une objection ;
- suggérer le « bon » scénario ;
- présenter une fonctionnalité future comme existante ;
- qualifier une confusion d'erreur utilisateur.

## 5. Grille de mesure par participant

| Mesure | Valeur |
|---|---|
| Profil capital | `<2k / 2–10k / 10–50k / >50k` |
| Fréquence | `<1 / 1–2 / 3–10 / >10 opérations par mois` |
| Temps premier résultat | secondes |
| Aide nécessaire | oui/non + champ |
| Interprétation correcte coût/opération | oui/non |
| Interprétation correcte coût annuel | oui/non |
| Achat simple / aller-retour compris | oui/non |
| Spread compris | oui/non |
| Slippage compris | oui/non |
| Résultat jugé crédible | 1–5 + raison |
| Intention de réutilisation | situation précise ou aucune |
| Demande d'import | oui/non/pourquoi |
| Disposition déclarée à payer | montant/modalité/aucune |
| Comportement fort | partage, demande de retour, précommande réelle |
| Objection principale | texte exact |

## 6. Seuils de passage de la première vague

Pour cinq participants :

- au moins 4 obtiennent un résultat sans intervention structurante ;
- médiane du premier résultat ≤ 90 secondes ;
- au moins 4 interprètent correctement le coût par opération et le coût annuel ;
- au moins 3 décrivent une situation précise de réutilisation ;
- au moins 2 demandent spontanément l'import ou le suivi ;
- aucune confusion récurrente faisant prendre le résultat pour une recommandation ;
- aucune erreur de formule ou de convention révélée.

Un échec UX peut conduire à une correction locale. Un échec de récurrence ou de valeur perçue doit conduire à réviser la proposition, pas à ajouter arbitrairement des fonctions.

## 7. Seuils de validation commerciale ultérieure

Les critères canoniques restent ceux de `VALIDATION_PLAN.md`. Les signaux forts sont :

- paiement réel ;
- partage volontaire ;
- retour pour un deuxième calcul ;
- demande de connexion/import ;
- recommandation à un autre utilisateur.

Ne pas compter comme preuve commerciale :

- compliment ;
- clic isolé ;
- email sans usage ;
- intention non engagée ;
- réponse obtenue après pression du facilitateur.

## 8. Traitement des résultats

Après chaque vague :

1. conserver les observations factuelles ;
2. regrouper les défauts récurrents ;
3. distinguer problème UX, problème de calcul, problème de confiance et absence de besoin ;
4. transformer chaque défaut produit confirmé en correction, règle et test lorsque pertinent ;
5. ne modifier la stratégie que sur la base de comportements observés ;
6. mettre à jour `MARKET_EVIDENCE.md` sans extrapoler au marché entier.
