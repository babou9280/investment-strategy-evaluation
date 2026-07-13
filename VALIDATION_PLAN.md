# Breaktest — plan de validation

- Produit actuellement testé : **Breaktest Capital Efficiency / Edge Survival**
- Direction future validée : **Breaktest Cost Gate**
- Statut : prototype interne ; publication, données externes et paiement suspendus
- Principe : valider chaque couche séparément et permettre l'abandon

## 1. Question actuelle décisive

> Des investisseurs autonomes trouvent-ils plus utile de connaître le seuil brut, la part de leur avantage qui survit aux frictions et les contraintes économiques associées que de simplement connaître le montant des frais ?

Le test ne vise pas les compliments, inscriptions gratuites ou intentions abstraites.

## 2. Hypothèses Capital Efficiency à valider

1. La cible rencontre régulièrement une décision liée aux frais, à la taille, à la fréquence, au change ou à la performance nette.
2. Le seuil brut est compris sans explication longue.
3. Le plancher variable et le coût fixe diluable sont distingués.
4. Une partie de la cible peut fournir une hypothèse brute ou une fourchette défendable.
5. Marge nette, part conservée et contraintes inverses créent plus de valeur que le total des coûts.
6. Les cas structurellement impossibles sont compris.
7. L'utilisateur distingue donnée observée, contractuelle, estimée, hypothèse et démonstration synthétique.
8. Une frontière mathématique n'est pas prise pour une recommandation.
9. L'utilisateur revient réaliser une seconde analyse.
10. Il demande import, suivi ou automatisation.
11. Une fraction paie réellement.
12. Le produit fonctionne avec peu de support manuel.

## 3. Utilisateur qualifié initial

Un participant est qualifié s'il possède au moins trois caractéristiques :

- capital investi d'au moins 2 000 EUR ;
- au moins deux opérations ou versements par mois ;
- actifs en devise étrangère ;
- plusieurs courtiers ou comptes ;
- tableur, journal ou outil de suivi ;
- difficulté récente avec frais ou performance nette ;
- méthode ou règle d'investissement ;
- besoin récent de choisir taille ou fréquence.

Les personnes sans avantage brut utilisent le mode seuil. Elles ne doivent jamais inventer une performance.

## 4. Gate interne de la PR active

Avant toute critique externe :

- contrats Edge Survival et Edge Range réconciliés ;
- égalités et tolérances cohérentes entre modes ;
- capital et fréquence réellement facultatifs ;
- résultat obsolète masqué après modification ;
- aucune valeur synthétique préremplie comme donnée utilisateur ;
- cas seuil exact distingué d'une marge positive ;
- oracles Node et invariants verts ;
- Chromium 390, 768, 1024 et 1440 px ;
- clavier, focus, `aria-live`, mouvement réduit et absence de débordement ;
- non-régressions H1–H2/C1–C4 et Q0 ;
- fichiers canoniques et registre des angles morts synchronisés ;
- package HTML hors ligne ultérieur non fabriqué prématurément.

Une CI verte prouve seulement les comportements testés.

## 5. Revue interne de compréhension

Présenter successivement :

1. seuil seul ;
2. point brut ;
3. fourchette basse / centrale / haute ;
4. rétention atteignable ;
5. contrainte structurellement impossible ;
6. budget annuel ;
7. frontière dépassant potentiellement le capital disponible.

Gate sur cinq participants qualifiés :

- quatre comprennent le seuil ;
- quatre comprennent la marge nette ;
- trois identifient une contrainte utile ;
- aucun ne croit que Breaktest prédit ou recommande ;
- parcours principal inférieur à cinq minutes ;
- aucun défaut bloquant.

Ces seuils sont des règles internes, pas une preuve statistique.

## 6. Expérience externe Capital Efficiency — 30 jours

### Jours 1 à 3

- figer formules, langage et scénarios ;
- vérifier Safari/iPad ;
- préparer mesure minimale ;
- aucune donnée financière détaillée dans l'analytics ;
- revue juridique avant paiement.

### Jours 4 à 10

- 100 premiers visiteurs qualifiés ;
- mesurer seuil → Edge Survival ;
- observer abandons ;
- interroger seulement après usage réel ;
- corriger uniquement compréhension et fonctionnement.

### Jours 11 à 20

- mesurer seconde analyse ;
- recueillir demandes d'import ;
- tester l'intérêt pour historique et Evidence Ledger ;
- ne pas construire l'import complet.

### Jours 21 à 30

Après validation explicite seulement :

- réservation faible et remboursable ;
- produit futur clairement indiqué ;
- objections et remboursements conservés ;
- décision continuer, modifier ou abandonner.

## 7. Mesures Capital Efficiency

- analyse seuil commencée et terminée ;
- passage volontaire au point ou à la fourchette ;
- contrainte inverse consultée ;
- cas structurellement impossible consulté ;
- rapport partagé ;
- seconde analyse ;
- demande d'import ;
- réservation payée ;
- remboursement ;
- compréhension correcte du résultat ;
- décision réelle éclairée ;
- support manuel nécessaire.

## 8. Seuils externes initiaux

### Gate positif

Après 30 jours :

- 300 visiteurs qualifiés ;
- 100 analyses complètes ;
- 40 passages volontaires à Edge Survival ;
- 20 secondes analyses ;
- 10 rapports partagés ;
- 10 réservations ou précommandes payées ;
- cinq demandes spontanées d'import ou suivi ;
- moins de 20 % de cas nécessitant intervention manuelle ;
- 60 % des personnes interrogées reformulant correctement le résultat.

### Signal intermédiaire

Poursuite avec modification si :

- au moins cinq paiements ;
- demande d'import forte ;
- seconde utilisation significative ;
- contraintes utiles même si G est rarement saisi ;
- problème de confiance ou distribution identifiable.

### Gate négatif

Abandon ou pivot si :

- moins de cinq paiements après 500 visiteurs qualifiés ;
- moins de 10 % reviennent ;
- G ou une autre contrainte utile est rarement disponible ;
- les résultats ne modifient aucun raisonnement réel ;
- presque aucune demande d'import ;
- valeur généralement inférieure au prix ;
- utilisateurs recherchant surtout conseil ou sélection ;
- acquisition uniquement payante ;
- maintenance humaine non scalable.

## 9. Questions post-usage

1. Quelle décision essayais-tu de prendre ?
2. Quel résultat as-tu compris en premier ?
3. Que signifie le seuil brut ?
4. D'où venait l'avantage brut ou la fourchette ?
5. Une contrainte a-t-elle changé ton raisonnement ?
6. Comment faisais-tu auparavant ?
7. Quand referais-tu l'analyse ?
8. Qu'attendrais-tu d'un import ?
9. Qu'est-ce qui empêcherait de payer ?
10. Quelle information était inutile ou trompeuse ?

Ne jamais demander seulement « aimerais-tu ce produit ? ».

## 10. Direction Cost Gate : validation séparée

La validation stratégique du 14 juillet 2026 n'autorise pas l'implémentation immédiate. Cost Gate suit des gates distincts.

### CG0 — noyau

- Edge Survival stabilisé ;
- utilité actuelle observée ;
- package hors ligne testé ;
- absence de confusion avec une recommandation.

### CG1 — problème pré-trade

Vérifier auprès d'utilisateurs qualifiés :

- fréquence réelle des analyses avant ordre ;
- décisions où coûts, capital libre ou liquidité posent problème ;
- outils utilisés aujourd'hui ;
- coût d'une erreur ;
- acceptation d'une saisie manuelle ;
- réaction à un résultat `insufficient_data`.

Kill criteria : problème rare, usage uniquement curieux ou saisie plus coûteuse que la décision.

### CG2 — prototype synthétique manuel

Sans réseau ni donnée réelle :

- scénario de trade manuel ;
- cash libre et nominal réservé ;
- point ou fourchette brute ;
- hypothèses synthétiques de liquidité ;
- états non prescriptifs ;
- Data Quality Gate simulé et identifié.

Mesurer :

- compréhension ;
- facteur limitant correctement identifié ;
- absence de faux feu vert ;
- modification volontaire d'un scénario ;
- répétition d'usage.

### CG3 — faisabilité du capital

Avant toute donnée externe :

- capital de référence, capital de stratégie, cash disponible et nominal réservé séparés ;
- positions simultanées ;
- aucun levier implicite ;
- réutilisation des invariants C1/C4 ;
- cas de concurrence du capital ;
- validation utilisateur de l'utilité.

### CG4 — Data Quality Gate

Pour chaque source potentielle :

- source et licence ;
- timestamp, fraîcheur et fuseau ;
- instrument, place et devise ;
- couverture et valeurs manquantes ;
- cohérence inter-sources ;
- fallback et kill switch ;
- coût par utilisateur ;
- sécurité et confidentialité.

Aucune conclusion dépendante d'une donnée externe sans état `data_ready`.

### CG5 — source externe limitée

Après décision explicite d'Ayman :

- une seule source ;
- univers restreint ;
- aucune exécution ;
- comparaison hypothèse utilisateur / donnée observée ;
- mesure des données stale et indisponibles ;
- aucune promesse de précision générale.

### CG6 — juridique et commercial

Avant vocabulaire ou action prescriptive :

- revue information / recommandation ;
- responsabilité et communication d'erreur ;
- conditions d'utilisation ;
- conflits d'intérêts ;
- volonté de payer ;
- coût des données et support ;
- taux de faux blocage et faux sentiment de sécurité.

### CG7 — intégration ou exécution

Hors périmètre. Exige une décision stratégique, juridique, technique et économique distincte.

## 11. Mesures futures Cost Gate

À activer seulement au gate correspondant :

- usage volontaire avant une opération ;
- délai analyse → décision ;
- réutilisation pré-trade ;
- proportion `insufficient_data` ;
- proportion de données stale ;
- changement de nominal, timing ou type d'ordre sans qualifier ce changement de bon ;
- abandon causé par la saisie ;
- confusion avec une recommandation ;
- coût de données par utilisateur actif ;
- incident ou correction de diagnostic ;
- volonté de payer spécifique au contrôle pré-trade.

## 12. Garde-fous permanents

- Ne pas modifier les calculs pour produire un résultat spectaculaire.
- Ne pas inventer avantage, coût ou donnée de marché.
- Préférer sensibilité et indisponibilité à la fausse précision.
- Ne pas collecter de données inutiles.
- Ne pas acheter de données avant demande et économie démontrées.
- Ne pas construire l'import ou la connexion courtier prématurément.
- Ne pas utiliser de faux avis, économies ou rareté.
- Ne pas présenter une frontière ou un état comme prescription.
- Ne pas appeler Cost Gate commercialement validé.
- Le test doit pouvoir conclure à l'abandon.

## 13. Développement autorisé actuellement

Uniquement :

- correction des défauts de la PR #23 ;
- tests, oracles et revue hostile ;
- synchronisation documentaire ;
- scénarios synthétiques indispensables ;
- préparation du protocole utilisateur ;
- package HTML hors ligne après stabilisation ;
- définition conceptuelle de Cost Gate et de ses gates.

Restent interdits : données externes, import réel, compte, stockage, réseau applicatif, analytics actif, email, paiement, connexion courtier, recommandation, ordre limite conseillé, transmission et exécution.