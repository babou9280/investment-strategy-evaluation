# Breaktest Cost Gate — Gate 1, protocole préenregistré de critique hors ligne

## 1. Statut et autorité

- Gate d'autorité : **Gate 1 — valeur compréhensible sans donnée réelle** de `docs/product/COST_GATE_MVP_GATE_MATRIX.md`.
- Validation fondateur : **Ayman, 15 juillet 2026**.
- Branche : `strategy/cost-gate-offline-critique`.
- Base exacte : `breaktest-bootstrap` au commit `56fb50954afd7394baf1689e0f1b7220a1fd73fc`.
- Statut à l'enregistrement : prototype non construit, aucun participant observé, aucun résultat utilisateur disponible.
- Nature attendue : prototype `internal_review`, jamais produit final, publication ou validation commerciale.

Ce document est enregistré avant toute observation utilisateur. Une modification ultérieure des seuils, questions ou règles de codage doit être datée et qualifiée d'amendement postérieur ; elle ne réécrit jamais le protocole initial.

## 2. Question falsifiable

> Un investisseur autonome peut-il comprendre sans coaching qu'un contrôle pré-trade sépare friction, avantage brut, cash déclaré et qualité des données, identifier le facteur limitant et ne pas prendre un état favorable pour une recommandation ?

La construction technique du prototype ne répond pas à cette question.

## 3. Périmètre du prototype

Le prototype peut uniquement :

- fonctionner hors ligne sous `file://` ou depuis un ZIP local avec `index.html` ;
- accepter des hypothèses manuelles ou une démonstration `synthetic_demo` explicitement chargée ;
- appeler le moteur fusionné `cost-gate-foundation-3-synthetic` sans recopier ses formules dans la couche d'interface ;
- afficher tous les `findings[]`, le facteur principal, les couches non évaluées, la provenance, le snapshot et l'expiration ;
- traiter un achat long cash d'action ou d'ETF au comptant, sans marge ;
- produire des descriptions conditionnelles et non prescriptives.

Il ne peut contenir aucune donnée réelle, ressource distante, connexion, compte, stockage, analytics, recommandation, probabilité d'exécution, transmission d'ordre ou publication.

## 4. Participants

Nombre préenregistré : **cinq participants réellement observés**.

Un participant est qualifié s'il possède au moins trois caractéristiques :

- capital investi d'au moins 2 000 EUR ;
- au moins deux opérations ou versements par mois ;
- actifs en devise étrangère ;
- plusieurs courtiers ou comptes ;
- tableur, journal ou outil de suivi ;
- difficulté récente avec frais ou performance nette ;
- méthode ou règle d'investissement ;
- besoin récent de choisir taille ou fréquence.

Une proximité personnelle ou professionnelle avec Ayman est consignée. Un échantillon de convenance ne permet aucune généralisation statistique.

## 5. Introduction neutre

Le facilitateur lit uniquement :

> « Voici un prototype hors ligne qui examine un scénario fourni. Il ne choisit pas un investissement et ne transmet aucun ordre. Explore-le comme si tu étais seul. Je n'expliquerai pas les écrans avant tes premières réponses. »

Il ne définit pas à l'avance le seuil, le facteur principal ou la bonne interprétation d'un résultat favorable.

## 6. Parcours observé

Le chronomètre démarre lorsque le participant voit l'écran initial.

1. Choisir volontairement une démonstration synthétique ou une saisie vide.
2. Obtenir un premier résultat sans aide. Si aucun avantage brut défendable n'est disponible, utiliser le parcours seuil ; aucune performance ne doit être inventée.
3. Dire, avec ses mots, ce qui limite ou permet le scénario et citer l'information qui le montre.
4. Expliquer ce que signifie un résultat favorable et ce qu'il ne prouve pas.
5. Identifier au moins une couche non évaluée ou une donnée manquante.
6. Modifier une entrée, constater que l'ancien résultat disparaît, puis recalculer.
7. Décrire une situation réelle d'usage et séparer les entrées disponibles de celles qui manquent.

Toute aide est consignée avec l'instant et la formulation. Une réponse obtenue après coaching ne compte pas comme compréhension autonome.

## 7. Données d'observation minimales

Pour chaque participant, conserver localement et sans détail financier inutile :

- critères de qualification et éventuelle proximité ;
- mode choisi : vide ou `synthetic_demo` ;
- temps jusqu'au premier résultat ;
- abandon ou étape bloquante ;
- facteur principal reformulé, correct ou incorrect ;
- nombre ou relation cité comme preuve ;
- interprétation du résultat favorable ;
- couche non évaluée identifiée ;
- situation réelle d'usage, oui ou non ;
- entrées qu'il sait fournir et entrées manquantes ;
- résultat périmé correctement compris après modification ;
- aide reçue ;
- verbatim bref utile, sans inventer ni embellir.

Aucune donnée personnelle, intention d'ordre détaillée ou information de compte n'est requise par le prototype.

## 8. Seuils de décision préenregistrés

Gate 1 réussit seulement si les cinq observations sont réelles et si :

- au moins **4 sur 5** identifient correctement le facteur principal sans coaching ;
- **0 sur 5** décrivent l'état favorable comme une recommandation, une autorisation ou un feu vert après lecture autonome ;
- au moins **3 sur 5** identifient une situation réelle dans laquelle ils auraient utilisé le contrôle ;
- au moins **3 sur 5** distinguent les entrées qu'ils peuvent fournir de celles qui leur manquent ;
- au moins **4 sur 5** obtiennent un premier résultat en **180 secondes ou moins**, le parcours seuil étant recevable lorsque l'avantage brut manque ;
- aucun défaut technique bloquant ne fausse une observation.

Ces seuils sont des règles internes de falsification. Ils ne prouvent ni marché, ni conformité, ni rétention, ni volonté de payer.

## 9. Règles d'arrêt et de correction

- Toute interprétation prescriptive du résultat favorable bloque la clôture de Gate 1 et déclenche une correction de langage ou de hiérarchie avant une nouvelle cohorte.
- Une mauvaise identification répétée du facteur principal conduit à simplifier ou réorienter l'explication, pas à coacher les participants.
- Une saisie trop lente ou abandonnée conduit à réduire le besoin d'entrée ou à privilégier le parcours seuil, sans inventer de valeurs.
- Si la majorité ne dispose pas d'un avantage brut défendable, l'avantage ne devient pas obligatoire : le seuil et la faisabilité restent le parcours principal à réévaluer en Gate 2.
- Une nouvelle cohorte après correction est séparée de la cohorte initiale ; les résultats ne sont pas agrégés silencieusement.

## 10. Preuves techniques requises avant observation

- parité du moteur navigateur avec le moteur Node sur les scénarios critiques ;
- oracles indépendants pour seuil, marge et cash ;
- disparition immédiate d'un résultat après modification d'entrée ;
- provenance manuelle ou synthétique visible et stable ;
- tous les constats et toutes les couches non évaluées accessibles ;
- aucune valeur non finie ;
- clavier, focus, annonces, mouvement réduit et contraste vérifiés ;
- absence de débordement à 390, 768, 1 024 et 1 440 px ;
- ouverture réelle sous `file://` ;
- package, manifeste et empreintes vérifiés ;
- CI verte sur le head distant exact et captures inspectées.

Safari/iPad réel reste requis avant toute revendication « testé iPad ».

## 11. Décision après cinq observations

La décision consignée doit être l'une de :

- continuer vers Gate 2 ;
- corriger puis retester Gate 1 ;
- réduire le périmètre au seuil et au cash ;
- réorienter le produit ;
- abandonner cette proposition.

Une appréciation positive, une CI verte ou cinq parcours terminés ne remplace pas l'application des seuils.

## 12. État d'exécution technique — 16 juillet 2026

Cette section est postérieure au préenregistrement et ne modifie aucun seuil, aucune question ni aucune règle de codage.

- Prototype `internal_review` construit et poussé sous forme de HTML autonome direct et de ZIP d'audit.
- Un essai fondateur du bundle multifichier sur iPad a révélé avant la cohorte un défaut bloquant : scripts relatifs non exécutés, rechargement du formulaire et effacement des champs au clic. Cet essai ne compte pas parmi les cinq participants.
- Head fonctionnel corrigé exact : `bb50550bde077c19b6966e1715e4f7f31dcfe901`.
- GitHub Actions : run `29458950246` (`#645`), `success`.
- Artefact, fichier autonome, package ZIP et six captures 390/1 440 px téléchargés et inspectés.
- Matrice technique, parité moteur, fichier autonome sous `file://`, fraîcheur, provenance, accessibilité, responsive et repli sans JavaScript réussis dans le périmètre documenté.
- Participants observés : **0 sur 5**.
- Défaut iPad : `mitigated`, pas `validated` ; prochaine condition : faire réussir le fichier autonome exact sur le même iPad, puis exécuter les cinq observations réelles sans modifier silencieusement le protocole.
