# Validation — Cost Gate Gate 1, critique hors ligne

## Statut

- Pull request : `#26`, ouverte en brouillon vers `breaktest-bootstrap`.
- Branche : `strategy/cost-gate-offline-critique`.
- Base : `56fb50954afd7394baf1689e0f1b7220a1fd73fc`.
- Head fonctionnel exact : `bb50550bde077c19b6966e1715e4f7f31dcfe901`.
- Tree fonctionnel : `021d3ec909d21723332fa420c2ca45127ee6fc67`.
- GitHub Actions : run `29458950246` (`#645`), job `87498198402`, `success`.
- Artefact : `8360442727`, 8 865 607 octets.
- Digest de l'artefact : `sha256:798c36f33c8bebef178cc785af82ed4591230aa70a9b9f68d373da289efe3e33`.
- HTML autonome : `Breaktest_Cost_Gate_Gate_1.html`, 152 525 octets, SHA-256 `98458817fb59b603955cf5c6c7b309390869b5ab622a314915d0e4bd5e9e3014`.
- Archive interne : `breaktest-cost-gate-gate1-internal-review.zip`, 74 022 octets.
- SHA-256 de l'archive interne : `3938acbfea3324ddcc34f938322c2e8eb996f39cbf189bf52a7f7ca52e156263`.
- Moteur : `cost-gate-foundation-3-synthetic`.
- Nature de la preuve : technique, quantitative, synthétique, responsive et interne.
- Participants réellement observés : **0 sur 5**.
- Statut de Gate 1 : **défaut iPad reproduit puis atténué techniquement ; nouvel essai réel requis ; validation utilisateur non commencée ; Gate non clôturée**.

Le run `#645` teste le head fonctionnel exact. La présente synchronisation documentaire exige à son tour un run exact-head avant toute décision de fusion. Une CI verte ne prouve pas le fonctionnement dans le lecteur iPad qui a reproduit le défaut et ne répond pas à la question de compréhension préenregistrée.

## Ordre de préenregistrement

Le protocole, les seuils, les règles d'arrêt et la matrice CGU-01 à CGU-18 ont été poussés au commit distant `400811fc67feeef0f9129fc99edbc594ac7ca85e` avant le premier code d'interface, poussé ensuite au commit `2716101e56acb336100374f6c25b892152e11f85`.

Aucune observation utilisateur ni aucun résultat commercial n'existait à ces commits. Les seuils restent ceux de `docs/tasks/COST_GATE_OFFLINE_CRITIQUE.md`.

## Périmètre réellement exécuté

Le package accepte uniquement :

```text
compte cash
achat long
action ou ETF au comptant
achat simple ou friction aller-retour
hypothèses manuelles ou synthetic_demo
EUR comme devise du compte
aucune donnée de marché actuelle
aucun ordre transmis
```

Le navigateur charge un bundle généré automatiquement depuis :

```text
capital_efficiency_lab/engine.js
sha256 = ce5d303a361000f51ef69c6c7e0dedf06ee42273cc14d4cd0920ea98f1748e08

cost_gate_foundation/engine.js
sha256 = ebfc2382a2e2d0a3a374fe3618b60f736056f5d94903c9c4fca4234de4473773
```

La présentation ne recopie pas les formules financières. La parité entre le résultat Node canonique et le résultat du bundle navigateur est comparée sur l'objet complet du scénario de démonstration.

## Oracle synthétique principal

Entrées :

```text
nominal = 500,00 EUR
commission = 1,00 EUR par côté
change = 0,25 % par côté
spread = 0,10 % total
slippage = 0,10 % total
avantage brut fourni = 2,00 %
cash réglé avant réserve = 1 000,00 EUR
allocation libre = 1 000,00 EUR
```

Résultats exécutés :

```text
coût fixe = 2,00 EUR
plancher variable = 0,70 %
friction du cycle = 5,50 EUR
seuil brut = 1,10 %
marge nette = 0,90 % = 4,50 EUR
engagement d'entrée = 502,25 EUR
plafond de cash déclaré = 1 000,00 EUR
```

Ces nombres sont fictifs. Ils prouvent le calcul du scénario, pas un tarif, une performance ou un marché réel.

## Frontières sémantiques exécutées

- avantage ponctuel exactement au seuil : titre `Aucune marge positive ne subsiste après les frictions modélisées`, marge nulle ;
- fourchette basse, centrale et haute exactement au seuil : même sémantique, trois marges nulles en taux et en euros ;
- fourchette entièrement sous le seuil : titre distinct `Aucune hypothèse ne produit de marge positive` ;
- ancienne phrase `Aucune hypothèse ne couvre les frictions` absente ;
- mode seuil : aucune performance inventée et aucune carte de marge ;
- cash insuffisant : cash et allocation identifiés comme facteur principal ;
- état favorable maximal : `Aucune incompatibilité n’a été détectée dans les couches évaluées`, immédiatement suivi de l'avertissement que le résultat n'est ni recommandation, ni autorisation, ni prévision ;
- aucune valeur `NaN`, `Infinity`, `-Infinity` ou `-0` dans l'arbre ou l'interface.

## Navigateur, accessibilité et responsive

Le fichier autonome exact a été ouvert directement sous `file://` dans Google Chrome for Testing `149.0.7827.55`. La suite a réussi à 390, 768, 1 024 et 1 440 pixels. Une seule requête locale, celle du fichier HTML lui-même, est observée.

Les régressions exécutées couvrent :

- ouverture neutre sans nombre financier prérempli ;
- premier `Tab` sur le lien d'évitement, lien visible dans le viewport puis focus transféré au contenu ;
- résultat masqué et retiré du DOM dès qu'une hypothèse change ;
- provenance `synthetic_demo` conservée après modification ;
- focus sur le titre d'un nouveau résultat et sur la synthèse d'erreurs ;
- erreur interne annoncée comme technique, sans désigner faussement une entrée financière ;
- défilement automatique, et non doux, lorsque le mouvement réduit est demandé ;
- contrôles nommés, annonces, absence de piège clavier et absence de débordement horizontal ;
- footer et guide du package accessibles ;
- aucun appel réseau : toutes les requêtes observées restent `file://` ;
- démarrage du moteur attesté avant interaction ;
- contexte JavaScript désactivé : avertissement visible, valeur `500` conservée après clic sur l'analyse, URL inchangée, résultat absent et aucune requête supplémentaire.

Le bundle multifichier a réellement échoué sur l'iPad d'Ayman. Le fichier autonome corrigé n'y est pas encore revalidé ; aucune revendication Safari/iPad n'est faite.

## Package et provenance exacts

Les logs du checkout montrent explicitement :

```text
ref = bb50550bde077c19b6966e1715e4f7f31dcfe901
HEAD = bb50550bde077c19b6966e1715e4f7f31dcfe901
```

Le workflow refuse désormais un écart entre le head attendu et le checkout. Le build refuse aussi un `source_commit` différent de `HEAD` et sa régression vérifie ce refus.

Le package contient huit fichiers, manifeste inclus, pour 311 039 octets. Le manifeste déclare le head exact, les versions, les hashes des moteurs, chaque fichier, le navigateur cible et les limites. L'HTML autonome direct est byte-à-byte identique à l'`index.html` emballé et son hash concorde avec le manifeste. L'artefact a été téléchargé, son digest externe réconcilié, l'archive interne et ses huit entrées ouvertes sans erreur.

Le build déterministe reconstruit la même archive avec les mêmes entrées et ne supprime plus les fichiers voisins du dossier de sortie ; un fichier sentinelle protège ce comportement.

## Captures inspectées

Six captures du run exact ont été réellement ouvertes :

- neutre à 390 × 1 000 et 1 440 × 1 000 ;
- favorable à 390 × 8 021 et 1 440 × 5 061 ;
- égalité au seuil à 390 × 8 021 et 1 440 × 5 036.

Constats de l'inspection :

- aucun lien d'évitement visible par erreur ;
- aucun débordement horizontal ou contenu tronqué ;
- provenance, hypothèses, résultats, couches non évaluées, constats, limites et preuve du package restent ordonnés ;
- titre favorable non prescriptif et avertissement immédiat visibles ;
- égalité au seuil, seuil `1,10 %` et marge `0,00 %` cohérents ;
- version mobile longue mais entièrement structurée ;
- header et footer représentés sans duplication artificielle.

Le script de capture ne modifie ni CSS ni accessibilité de production. Il retire seulement le focus créé par sa propre automatisation, revient en haut et vérifie géométriquement que le lien d'évitement est hors viewport avant la capture neutre.

## Défauts trouvés puis corrigés pendant la revue hostile

La revue a produit des corrections et régressions, sans modification des formules économiques :

1. le head était déclaré au manifeste sans checkout explicitement forcé sur ce commit ; le workflow et le build vérifient maintenant l'identité exacte ;
2. le build supprimait tout le dossier de sortie ; il ne nettoie plus que son package et son ZIP ;
3. une exception interne du moteur était attribuée au champ nominal ; elle est maintenant présentée comme erreur technique générale ;
4. le défilement JavaScript restait explicitement doux malgré une préférence de mouvement réduit ; le comportement est maintenant conditionnel et testé ;
5. le constat rare d'échec de sérialisation du snapshot n'avait pas de libellé explicite ; le mapping et sa régression sont ajoutés ;
6. les runs exacts `#635` et `#637` ont montré qu'une durée globale de `0,01 ms` créait encore une transition du lien d'évitement en mode mouvement réduit. Les transitions sont maintenant réellement nulles, et la régression vérifie que le document est actif, que le premier `Tab` cible le lien, que `:focus` s'applique et que le lien est dans le viewport. Le run exact `#639` valide la correction sans changement de formule.
7. l'essai fondateur réel du bundle multifichier sur iPad a montré que le lecteur pouvait afficher l'HTML sans exécuter ses scripts relatifs ; l'action native rechargeait alors le formulaire et effaçait les chiffres. La remise primaire est maintenant un HTML autonome avec tous les styles et scripts incorporés, l'analyse est un bouton non soumetteur, un avertissement apparaît si le moteur ne démarre pas et une régression JavaScript désactivé protège les champs. Le premier run `#643` de cette régression a échoué uniquement parce que le contexte de test n'émulait pas le mouvement réduit avant l'auto-défilement ; le contexte a été stabilisé sans changement du produit et le run exact `#645` réussit. La preuve iPad reste en attente.

## Ce qui est réellement validé

- calculs synthétiques et oracles déclarés ;
- parité du moteur navigateur avec le moteur canonique ;
- provenance, fraîcheur du résultat et conservation des constats ;
- comportement du fichier autonome hors ligne, repli sans JavaScript et absence de persistance ou réseau ;
- clavier, focus, mouvement réduit et responsive Chromium ;
- fichier autonome et package exacts, manifeste, hashes, reconstruction et archive ;
- non-régressions historiques, Capital Efficiency, Edge Survival et fondation Cost Gate ;
- captures du head fonctionnel exact à 390 et 1 440 pixels.

## Ce qui n'est pas validé

- compréhension autonome par un utilisateur réel ;
- premier résultat en moins de 180 secondes ;
- disponibilité réelle des entrées ;
- usage réel, répétition, demande ou paiement ;
- donnée, compte, cash, liquidité, spread, slippage ou exécution réels ;
- fonctionnement du fichier autonome dans le même lecteur iPad que celui ayant reproduit le blocage ;
- Safari/iPad au-delà de ce nouvel essai ciblé ;
- conformité juridique ou réglementaire ;
- marché, prix, distribution ou viabilité commerciale.

La prochaine preuve indispensable est d'abord l'essai fondateur du fichier autonome exact sur le même iPad ; il ne compte pas comme participant. Après réussite seulement viennent cinq observations qualifiées selon le protocole préenregistré. Aucun résultat utilisateur ne doit être ajouté avant une observation réelle.
