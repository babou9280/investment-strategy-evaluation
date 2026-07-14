# Breaktest — registre permanent des angles morts

## 1. Rôle

Breaktest recherche activement ce qui a été oublié, mal défini, supposé à tort, insuffisamment testé ou présenté avec une confiance excessive.

Cette recherche couvre calculs, finance, microstructure, données, produit, UX, accessibilité, réglementation, droit, sécurité, ingénierie, business model, marché, validation, distribution, opérations, réputation, valeur académique et gouvernance.

Le registre reste actif jusqu'à déclaration explicite de fin du projet.

## 2. Processus

Pour toute modification matérielle :

1. reconstruire l'état réellement validé ;
2. identifier le problème visible ;
3. chercher un défaut adjacent ou rétrospectif ;
4. distinguer erreur, hypothèse, limite, risque et report ;
5. corriger les défauts réversibles ;
6. créer une règle permanente si le défaut peut revenir ;
7. ajouter un test ou une preuve ;
8. propager aux calculs, interface, documents et livrables ;
9. ne jamais confondre absence de défaut détecté et exhaustivité.

## 3. Classification

Chaque angle mort possède :

- identifiant stable ;
- domaine ;
- description falsifiable ;
- priorité `P0`, `P1`, `P2` ou `P3` ;
- statut `open`, `mitigated`, `validated`, `accepted_limit`, `deferred` ou `rejected` ;
- conséquence ;
- preuve attendue ;
- composant et gate de réexamen.

Priorités :

- `P0` : calcul faux, résultat trompeur, danger, risque juridique ou proposition de valeur invalidée ;
- `P1` : compréhension, usage, confiance ou validation externe empêchés ;
- `P2` : échelle, exploitation, rétention ou défensibilité dégradées ;
- `P3` : amélioration utile non bloquante.

## 4. Domaines obligatoires

### Finance et microstructure

Double comptage, frais omis, commission minimale ou par palier, spread par côté ou total, slippage, impact, liquidité, change, taxes, financement, type d'ordre, ordres partiels, dérivés, règlement-livraison, positions simultanées et levier.

### Quantitatif et statistique

Unités, dénominateurs, horizons, annualisation, dépendance sérielle, régimes, échantillon, multiple testing, leakage, look-ahead, survivorship bias, incertitude de G, sensibilités, égalités, monotonie, convergence et non-finis.

### Données et provenance

Source, date, devise, fraîcheur, observé/contractuel/estimé/dérivé/synthétique, zéro/absence/invalidité, duplications, réconciliation, versions, licences, couverture et valeurs manquantes.

### Produit et utilité

Fréquence et coût du problème, information réellement nouvelle, capacité à fournir les entrées, retour naturel, friction créée par le produit, valeur supérieure au prix, payeur différent du bénéficiaire et substitution gratuite.

### UX et accessibilité

Langage, hiérarchie, ancrage, surcharge, confusion avec prévision ou conseil, états vide/erreur/partiel, clavier, lecteur d'écran, contraste, mouvement réduit, mobile, Safari/iPad, résultats obsolètes et fausse précision.

### Réglementation, droit et éthique

Information contre recommandation, comparaison personnalisée, marketing financier, conformité non auditée, conflits d'intérêts, consentement, responsabilité, conditions, propriété intellectuelle et publics vulnérables.

### Ingénierie, sécurité et confidentialité

Déterminisme, moteurs divergents, offline, `file://`, performance, supply chain, build, XSS, injection CSV, fichiers hostiles, exfiltration, secrets, stockage non annoncé, partages et modèle de menace.

### Business, marché et distribution

Volonté de payer, économies, rétention, concurrence, CAC, affiliation, marge brute, support, coût des données, intégrations et trajectoire de plateforme non présumée.

### Validation et opérations

Test réfutable, biais de recrutement, questions orientées, intention contre paiement, critères modifiés après observation, trafic non qualifié, incident, rollback, mise à jour des barèmes, support, remboursements et dépendance à une personne ou un outil.

### Réputation et gouvernance

Preuve personnelle malgré assistance IA, reproductibilité, absence de chiffres inventés, capacité à défendre oralement, fichiers canoniques contradictoires, scope creep, mauvaise branche, automatisation obsolète et faux sentiment de complétude.

## 5. Angles morts actifs

| ID | Priorité | Domaine | Angle mort | Risque | Statut | Gate / preuve attendue |
|---|---|---|---|---|---|---|
| BS-001 | P0 | Quantitatif | Une fourchette utilisateur peut être prise pour une estimation statistique | Fausse confiance | mitigated | Langage, provenance, tests et revue utilisateur |
| BS-002 | P0 | Produit | L'utilisateur peut ne pas disposer d'un avantage brut défendable | Edge Survival inutilisable | open | Tester seuil, point et fourchette ; mesurer source réelle de G |
| BS-003 | P0 | Finance | Certaines frictions réelles restent hors modèle | Seuil sous-estimé | open | Inventaire par instrument et juridiction avant donnée réelle |
| BS-004 | P0 | UX / réglementation | Une frontière mathématique peut être comprise comme recommandation | Mauvais usage et risque juridique | mitigated | Revue de langage et observation sans coaching |
| BS-005 | P0 | Ingénierie | Résultat ancien visible après modification ou erreur | Résultat trompeur | validated | `result_freshness.js`, tests navigateur exact-head et fusion PR `#23` |
| BS-006 | P0 | Quantitatif | Tolérance différente entre modes ou frontières | Classification incohérente | validated | Oracles point/range, égalité exacte et voisinage des seuils, PR `#23` |
| BS-007 | P1 | UX | Densité mobile trop élevée | Abandon | open | Inspection et compréhension en moins de 90 secondes |
| BS-008 | P1 | Navigateur | Safari/iPad non prouvé | Livrable inutilisable par Ayman | open | Exécution réelle avant livraison |
| BS-009 | P1 | Business | Calcul utile sans usage répété | Faible rétention | open | Deuxième usage non sollicité et demande d'import |
| BS-010 | P1 | Données | Hypothèses de coûts difficiles à saisir | Garbage in, garbage out | open | Test sans assistance et sources documentées |
| BS-011 | P1 | Validation | Testeurs proches surévaluent le produit | Faux signal | open | Recrutement qualifié distinct et protocole neutre |
| BS-012 | P1 | Livraison | Bundle offline divergeant du moteur | Démo fausse | open | Moteur unique, manifeste, hashes et tests du package exact |
| BS-013 | P1 | Sécurité | Imports futurs : XSS, CSV injection, fichiers hostiles | Atteinte locale | deferred | Modèle de menace avant import |
| BS-014 | P1 | Gouvernance | CI verte prise pour validation produit | Surconfiance | mitigated | Séparation technique, UX, marché et droit |
| BS-015 | P2 | Opérations | Barèmes obsolètes | Coûts contractuels faux | deferred | Source, version, date, expiration et procédure de mise à jour |
| BS-016 | P2 | Marché | Courtier intégrant gratuitement une fonction similaire | Faible défensibilité | open | Valider historique, multi-courtiers, benchmarks et neutralité |
| BS-017 | P2 | Réputation | Assistance IA réduisant la crédibilité | Faible valeur académique | open | Dossier de preuves et capacité d'explication orale |
| BS-018 | P2 | International | Frais, devise, fiscalité et droit varient | Généralisation abusive | deferred | Périmètre pays/instrument explicite |
| BS-019 | P3 | Supply chain | Runtime CI évolutif | Pipeline interrompu | deferred | Surveiller dépréciations et versions |
| BS-020 | P0 | Cost Gate / données | Donnée de marché stale utilisée comme actuelle | Diagnostic pré-trade faux | open | Data Quality Gate avec timestamp, fraîcheur, kill switch et tests |
| BS-021 | P0 | Cost Gate / réglementation | `compatible` interprété comme autorisation d'exécuter | Recommandation implicite | open | Findings explicites, revue juridique et test utilisateur |
| BS-022 | P0 | Cost Gate / capital | Capital de référence confondu avec cash disponible | Faisabilité fausse | open | Cash réglé, réservations et invariants C1/C4 |
| BS-023 | P0 | Cost Gate / microstructure | Profondeur visible ou spread ne garantit pas l'exécution | Coût réel supérieur au diagnostic | open | Domaine de validité et comparaison ex post |
| BS-024 | P0 | Cost Gate / données | Instrument, place ou devise mal réconciliés | Mauvaise donnée appliquée | open | Identifiants canoniques, mapping testé et refus des conflits |
| BS-025 | P1 | Cost Gate / produit | Saisie pré-trade trop lourde | Absence d'usage récurrent | open | Prototype synthétique manuel et mesure de l'abandon |
| BS-026 | P1 | Cost Gate / économie | Coût des flux, licences et support supérieur au revenu | Marge négative | open | Modèle de coût par utilisateur avant achat de données |
| BS-027 | P1 | Cost Gate / UX | Trop de prudence produit uniquement `insufficient_data` | Produit inutilisable | open | Mesurer indisponibilité et sous-calculs utiles |
| BS-028 | P1 | Cost Gate / risque | État favorable créant un faux sentiment de sécurité | Mauvaise décision | open | Absence de feu vert et test de compréhension |
| BS-029 | P1 | Cost Gate / ordre | Ordre limite non exécuté ou marché déplacé après analyse | Diagnostic non réalisé | open | Séparer coût, faisabilité et exécution |
| BS-030 | P1 | Cost Gate / responsabilité | Erreur de source ou calcul sans processus d'incident | Perte de confiance et risque juridique | open | Version, incident, rollback et communication |
| BS-031 | P2 | Cost Gate / concurrence | Courtier reproduisant un simple contrôle de frais | Fonction banalisée | open | Provenance, capital, sensibilité et réconciliation ex post |
| BS-032 | P2 | Cost Gate / confidentialité | Portefeuille et intentions d'ordre exposés | Risque utilisateur | open | Local-first, minimisation, modèle de menace et consentement |
| BS-033 | P1 | Validation visuelle | Assertion DOM différente du rendu full-page assemblé | Preuve visuelle fausse | validated | Capture-only overrides restaurés, vrai clavier testé, artefacts PR `#23` inspectés |
| BS-034 | P0 | Cost Gate / personnalisation | Contraintes personnalisées glissant vers suitability ou conseil | Changement de régime réglementaire | mitigated | Contrat de personnalisation ; revue juridique avant usage réel |
| BS-035 | P0 | Cost Gate / coûts | Tarif dépendant du plan, palier, volume, juridiction ou statut fiscal mal appliqué | Seuil faux | open | Barème versionné avec conditions d'éligibilité |
| BS-036 | P0 | Cost Gate / capital | Ordres en attente, cash non réglé, marge ou emprunt ignorés | Faisabilité fausse | mitigated | Contrat cash/cycle ; moteur et source encore à tester |
| BS-037 | P1 | Cost Gate / portefeuille | Corrélation, netting et marge portefeuille non modélisés | Généralisation abusive | accepted_limit | Premier périmètre cash long ; moteur portefeuille futur séparé |
| BS-038 | P0 | Cost Gate / quantitatif | Avantage brut d'un autre horizon, instrument ou type d'ordre appliqué au trade | Comparaison incohérente | mitigated | `GROSS_EDGE_INPUT_CONTRACT.md` ; tests d'alignement requis |
| BS-039 | P1 | Cost Gate / exécution | Exécution partielle, annulation ou multi-venue changeant les frictions | Écart ex ante/ex post | open | Scénarios et réconciliation ultérieure sans probabilité inventée |
| BS-040 | P0 | Cost Gate / capital | Coût complet aller-retour utilisé comme besoin de cash immédiat | Faisabilité surestimée ou double comptage | mitigated | Contrat cash/cycle et scénarios CG-06/CG-07 ; moteur à tester |
| BS-041 | P0 | Cost Gate / prix | Spread ou slippage déjà incorporé au prix puis ajouté à nouveau | Cash et coût faux | mitigated | `notional_basis` et indicateurs d'inclusion ; refus des conflits |
| BS-042 | P0 | Cost Gate / temps | Snapshot valide au calcul mais obsolète au moment d'usage | Faux sentiment d'actualité | mitigated | Contrat snapshot, expiration et invalidation ; implémentation à tester |
| BS-043 | P1 | Cost Gate / orchestration | Synthèse unique supprimant plusieurs constats matériels | Diagnostic incomplet | mitigated | `findings[]` obligatoire et scénarios multi-violations |
| BS-044 | P1 | Cost Gate / scope | Modèle cash long appliqué silencieusement à marge, short ou dérivé | Résultat invalide | mitigated | Domaine initial explicite et état `unsupported` |
| BS-045 | P1 | Cost Gate / règlement | Produit de vente futur supposé disponible pour financer l'entrée | Faisabilité fausse | mitigated | Contrat cash/cycle ; aucun financement par sortie future |
| BS-046 | P1 | Cost Gate / texte | Catalogue de constats généré librement par IA | Explication variable ou prescriptive | mitigated | Catalogue versionné déterministe ; IA non canonique |

## 6. Gate de revue multidisciplinaire

Aucune version n'est prête pour critique externe sans réponse explicite :

1. Quel problème financier exact est résolu ?
2. Quel diagnostic est nouveau ?
3. Quelles hypothèses peuvent le rendre faux ?
4. Quelles frictions manquent ?
5. Quel résultat peut être pris pour un conseil ?
6. Quelles entrées l'utilisateur ne sait pas fournir ?
7. Quel scénario casse le modèle ou l'interface ?
8. Quelle régression rétrospective a été recherchée ?
9. Quelle preuve distingue technique, compréhension, répétition et paiement ?
10. Quelle fonction supprimer si elle n'améliore ni diagnostic, ni preuve, ni décision ?
11. Le livrable exact fonctionne-t-il hors ligne sur les appareils cibles ?
12. Un évaluateur peut-il reproduire résultats et limites ?
13. Les données sont-elles fraîches, licenciées et réconciliées ?
14. Un état peut-il être compris comme autorisation ?
15. Le cash libre et les positions simultanées sont-ils modélisés ?
16. L'avantage brut est-il aligné ?
17. La personnalisation reste-t-elle une application de contraintes explicites ?
18. Les tarifs conditionnels sont-ils correctement identifiés ?
19. Le cash immédiat est-il séparé du coût du cycle ?
20. Le nominal précise-t-il si spread et slippage sont incorporés ?
21. Le snapshot est-il encore valide au moment affiché ?
22. Tous les constats matériels restent-ils visibles ?
23. Le domaine cash long est-il empêché de s'étendre silencieusement ?

## 7. Règle de clôture

Un angle mort n'est pas `validated` parce qu'il est discuté. La preuve peut être oracle, invariant, test navigateur, inspection, test utilisateur, paiement, revue juridique, source contractuelle, benchmark ou incident simulé.

Une limite devient `accepted_limit` uniquement si :

- visible ;
- non trompeuse ;
- conséquence comprise ;
- gate de réexamen défini.

Réviser ce registre à chaque changement de proposition de valeur, calcul, cible, donnée, canal, réglementation, livraison ou architecture.