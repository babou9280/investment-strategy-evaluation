# Validation — Cost Gate Gate 1, critique hors ligne

## Statut

- Pull request : `#26`, ouverte en brouillon vers `breaktest-bootstrap`.
- Branche : `strategy/cost-gate-offline-critique`.
- Base : `56fb50954afd7394baf1689e0f1b7220a1fd73fc`.
- Head fonctionnel exact : `7ce11bde2195fdb5c95cb184263072b2314e4b6e`.
- Tree fonctionnel : `7046eb366a62aa5b12b55414367fe7e116c341e2`.
- GitHub Actions : run `29417944829` (`#633`), job `87360744261`, `success`.
- Artefact : `8343971281`, 8 797 175 octets.
- Digest de l'artefact : `sha256:b4b2259ca3fda6cbb4bef2135d7e7d4c1a5ec011f791036a3e36a4bf17b80778`.
- Archive interne : `breaktest-cost-gate-gate1-internal-review.zip`, 39 362 octets.
- SHA-256 de l'archive interne : `6464cfac98b56705bbb8a66a2c6a323120498578fb2fb2e80e6fcbd955400e6e`.
- Moteur : `cost-gate-foundation-3-synthetic`.
- Nature de la preuve : technique, quantitative, synthétique, responsive et interne.
- Participants réellement observés : **0 sur 5**.
- Statut de Gate 1 : **preuve technique prête ; validation utilisateur non commencée ; Gate non clôturée**.

Le run `#633` teste le head fonctionnel exact. La présente synchronisation documentaire exige à son tour un run exact-head avant toute décision de fusion. Une CI verte ne répond pas à la question de compréhension préenregistrée.

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

Le package exact a été ouvert sous `file://` dans Google Chrome for Testing `149.0.7827.55`. La suite a réussi à 390, 768, 1 024 et 1 440 pixels.

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
- aucun appel réseau : toutes les requêtes observées restent `file://`.

Safari et iPad réels ne sont pas testés et ne sont pas revendiqués.

## Package et provenance exacts

Les logs du checkout montrent explicitement :

```text
ref = 7ce11bde2195fdb5c95cb184263072b2314e4b6e
HEAD = 7ce11bde2195fdb5c95cb184263072b2314e4b6e
```

Le workflow refuse désormais un écart entre le head attendu et le checkout. Le build refuse aussi un `source_commit` différent de `HEAD` et sa régression vérifie ce refus.

Le package contient huit fichiers, manifeste inclus, pour 156 555 octets. Le manifeste déclare le head exact, les versions, les hashes des moteurs, chaque fichier, le navigateur cible et les limites. L'archive a été téléchargée, son digest externe réconcilié, son SHA-256 interne recalculé et ses huit entrées ouvertes sans erreur.

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
5. le constat rare d'échec de sérialisation du snapshot n'avait pas de libellé explicite ; le mapping et sa régression sont ajoutés.

## Ce qui est réellement validé

- calculs synthétiques et oracles déclarés ;
- parité du moteur navigateur avec le moteur canonique ;
- provenance, fraîcheur du résultat et conservation des constats ;
- comportement hors ligne et absence de persistance ou réseau ;
- clavier, focus, mouvement réduit et responsive Chromium ;
- package exact, manifeste, hashes, reconstruction et archive ;
- non-régressions historiques, Capital Efficiency, Edge Survival et fondation Cost Gate ;
- captures du head fonctionnel exact à 390 et 1 440 pixels.

## Ce qui n'est pas validé

- compréhension autonome par un utilisateur réel ;
- premier résultat en moins de 180 secondes ;
- disponibilité réelle des entrées ;
- usage réel, répétition, demande ou paiement ;
- donnée, compte, cash, liquidité, spread, slippage ou exécution réels ;
- Safari/iPad ;
- conformité juridique ou réglementaire ;
- marché, prix, distribution ou viabilité commerciale.

La prochaine preuve indispensable est humaine : cinq observations qualifiées selon le protocole préenregistré. Aucun résultat ne doit être ajouté avant une observation réelle.
