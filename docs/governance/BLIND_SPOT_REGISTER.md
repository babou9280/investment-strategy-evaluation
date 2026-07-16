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
| BS-008 | P1 | Navigateur | Compatibilité Safari/iPad au-delà du lecteur fondateur non prouvée | Livrable inutilisable dans une autre application ou version | mitigated | Fichier exact fonctionnel sur l'iPad fondateur confirmé le 16 juillet 2026 ; matrice d'applications et versions seulement avant revendication générale |
| BS-009 | P1 | Business | Calcul utile sans usage répété | Faible rétention | open | Deuxième usage non sollicité et demande d'import |
| BS-010 | P1 | Données | Hypothèses de coûts difficiles à saisir | Garbage in, garbage out | open | Test sans assistance et sources documentées |
| BS-011 | P1 | Validation | Testeurs proches surévaluent le produit | Faux signal | mitigated | Protocole neutre et proximité consignée dans `COST_GATE_OFFLINE_CRITIQUE.md` ; recrutement et observations réels encore requis |
| BS-012 | P1 | Livraison | Bundle offline divergeant du moteur | Démo fausse | validated | Bundle généré depuis les moteurs canoniques, parité Node/navigateur, hashes et package exact ; head `7ce11bde`, run `#633` |
| BS-013 | P1 | Sécurité | Imports futurs : XSS, CSV injection, fichiers hostiles | Atteinte locale | deferred | Modèle de menace avant import |
| BS-014 | P1 | Gouvernance | CI verte prise pour validation produit | Surconfiance | mitigated | Séparation technique, UX, marché et droit |
| BS-015 | P2 | Opérations | Barèmes obsolètes | Coûts contractuels faux | deferred | Source, version, date, expiration et procédure de mise à jour |
| BS-016 | P2 | Marché | Courtier intégrant gratuitement une fonction similaire | Faible défensibilité | open | Valider historique, multi-courtiers, benchmarks et neutralité |
| BS-017 | P2 | Réputation | Assistance IA réduisant la crédibilité | Faible valeur académique | open | Dossier de preuves et capacité d'explication orale |
| BS-018 | P2 | International | Frais, devise, fiscalité et droit varient | Généralisation abusive | deferred | Périmètre pays/instrument explicite |
| BS-019 | P3 | Supply chain | Runtime CI évolutif | Pipeline interrompu | deferred | Le run `#633` réussit mais signale la dépréciation Node 20 des actions ; réévaluer les versions avant enforcement du runner |
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
| BS-038 | P0 | Cost Gate / quantitatif | Avantage brut d'un autre horizon, instrument ou type d'ordre appliqué au trade | Comparaison incohérente | mitigated | `GROSS_EDGE_ALIGNMENT_KEY.md` ; moteur et tests d'alignement requis |
| BS-039 | P1 | Cost Gate / exécution | Exécution partielle, annulation ou multi-venue changeant les frictions | Écart ex ante/ex post | open | Scénarios et réconciliation ultérieure sans probabilité inventée |
| BS-040 | P0 | Cost Gate / capital | Coût complet aller-retour utilisé comme besoin de cash immédiat | Faisabilité surestimée ou double comptage | validated | 502,25 EUR contre 5,50 EUR, CG-06/CG-07, run `#604` ; données réelles restent hors scope |
| BS-041 | P0 | Cost Gate / prix | Spread ou slippage déjà incorporé au prix puis ajouté à nouveau | Cash et coût faux | validated | Conflit et double ajout testés dans le moteur synthétique, run `#604` |
| BS-042 | P0 | Cost Gate / temps | Snapshot valide au calcul mais obsolète au moment d'usage | Faux sentiment d'actualité | validated | `compareSnapshots` inactive les anciens constats après expiration à hash inchangé ; transition fraîche→stale testée, head `2ebf0e3`, run `#608` |
| BS-043 | P1 | Cost Gate / orchestration | Synthèse unique supprimant plusieurs constats matériels | Diagnostic incomplet | validated | Stale et conflit de source sont émis indépendamment et testés ensemble, head `2ebf0e3`, run `#608` |
| BS-044 | P1 | Cost Gate / scope | Modèle cash long appliqué silencieusement à marge, short ou dérivé | Résultat invalide | validated | `unsupported_scope` démontré par CG-15, run `#604` |
| BS-045 | P1 | Cost Gate / règlement | Produit de vente futur supposé disponible pour financer l'entrée | Faisabilité fausse | mitigated | Contrat cash/cycle ; aucun financement par sortie future |
| BS-046 | P1 | Cost Gate / texte | Catalogue de constats généré librement par IA | Explication variable ou prescriptive | mitigated | Catalogue versionné déterministe ; IA non canonique |
| BS-047 | P0 | Cost Gate / cash | Hold déjà retranché par la source puis soustrait une seconde fois | Faux cash insuffisant | validated | Sources brute/nette, hold dupliqué et réserve testés, CG-14 + propriétés, run `#604` |
| BS-048 | P0 | Cost Gate / capital | Cash total du compte utilisé malgré une allocation de stratégie plus basse | Faux diagnostic de faisabilité | validated | Plafond `min(cash réconcilié, allocation libre)` et CG-14C, run `#604` |
| BS-049 | P1 | Cost Gate / preuve | Hash du snapshot circulaire ou dépendant de l'heure du recalcul | Reproduction impossible ou faux changement | validated | Hash de contenu, instance séparée et ordre des clés testés, run `#604` |
| BS-050 | P0 | Cost Gate / avantage | Performance issue de prix exécutés traitée comme brute puis spread/slippage soustraits de nouveau | Marge nette sous-estimée | validated | Prix exécuté rejeté sans reconstruction versionnée ; seuil indépendant conservé, run `#604` |
| BS-051 | P1 | Cost Gate / orchestration | Donnée manquante reléguant un fait dur indépendant | Facteur principal trompeur | validated | Politique dépendante des preuves et CG-12, run `#604` |
| BS-052 | P1 | Cost Gate / provenance | Quote stale synthétique présentée comme donnée externe réellement observée | Preuve et capacité exagérées | validated | CG-09 limité à `synthetic_demo` + intégrité sans réseau, run `#604` |
| BS-053 | P0 | Cost Gate / unités | Quantité, prix, devise et nominal incohérents mais acceptés | Cash et seuil calculés sur deux bases | validated | Quantité × prix réconciliée avec cash et nominal économique ; régression exact-head, head `faafd3`, run `#612` |
| BS-054 | P0 | Cost Gate / unités | `operation_scope` incohérent avec `side_count` mais synthèse favorable produite | Frictions sous- ou surévaluées | validated | Mapping strict achat simple = 1, aller-retour = 2 ; sortie seule non supportée ; régressions exact-head, head `2ebf0e3`, run `#608` |
| BS-055 | P1 | Cost Gate / preuve | Ordre arbitraire des holds, sources, contraintes ou exclusions changeant le `snapshot_id` ou les constats | Faux changement et audit instable | validated | Ensembles triés avant hash et évaluation ; snapshot et constats invariants par permutation, changement matériel distinct, head `2ebf0e3`, run `#608` |
| BS-056 | P1 | Cost Gate / orchestration | Erreur de friction empêchant un constat de cash indépendant | Diagnostic incomplet | validated | Validation cash isolée des erreurs de friction ; constat cash conservé sous coût invalide, head `2ebf0e3`, run `#608` |
| BS-057 | P1 | Cost Gate / vocabulaire | Avantage absorbé résumé comme contrainte utilisateur dépassée sans contrainte saisie | Provenance de la limite fausse | validated | `edge_not_surviving_modelled_friction` distinct ; `constraint_breach` réservé aux limites explicites, head `2ebf0e3`, run `#608` |
| BS-058 | P0 | Cost Gate / cash | Base globale brute/nette en contradiction avec les holds déclarés inclus | Cash libre surestimé ou sous-estimé | validated | `source_included_hold_ids[]`, ledger et base brute/nette réconciliés ; contradictions et réserve déjà nette bloquées, head `faafd3`, run `#612` |
| BS-059 | P0 | Cost Gate / temps | Source observée après l'heure d'évaluation classée actuelle | Utilisation d'une donnée qui n'existait pas encore | validated | `snapshot_temporally_inconsistent` et constat bloquant ; régression exact-head, head `faafd3`, run `#612` |
| BS-060 | P1 | Cost Gate / temps | Source non critique raccourcissant l'expiration de tout le snapshot | Constats indépendants invalidés trop tôt | validated | `expires_at_utc` limité aux sources critiques et comparaison temporelle testée, head `faafd3`, run `#612` |
| BS-061 | P0 | Cost Gate / entrées | Ledger, sources ou contraintes fournis comme objet puis assimilés à une liste vide | Hold, provenance ou contrainte matérielle supprimés silencieusement | validated | Non-tableaux, éléments mal formés et identifiants de source/contrainte dupliqués rejetés ; holds, sources, contraintes et exclusions testés, head `faafd3`, run `#612` |
| BS-062 | P0 | Cost Gate / devise | Frais FX non nuls malgré une devise de compte identique à la devise de cotation | Friction et cash sans événement de change réel | validated | Friction bloquée même sans vue cash et cas FX nul valide ; head `753152d`, run `#616` |
| BS-063 | P0 | Cost Gate / coûts | Commission ou change d'entrée différents des hypothèses par côté du cycle | Cash immédiat et seuil décrivent deux économies incompatibles | validated | Commission et change d'entrée réconciliés avec le modèle de cycle, head `faafd3`, run `#612` |
| BS-064 | P0 | Cost Gate / coûts | Taxe ou frais contractuel d'entrée présent mais absent du seuil du cycle | Avantage net surestimé | validated | Cash conflictuel, friction incomplète et Edge Survival indisponible jusqu'à contrepartie de cycle ; head `753152d`, run `#616` |
| BS-065 | P0 | Cost Gate / provenance | Source sans instrument, place, devise ou caractère critique explicite classée actuelle | Donnée non attribuable ou expiration arbitraire | validated | Identité non vide et booléen `critical` obligatoires ; snapshot incomplet, aucun constat positif ; head `753152d`, run `#616` |
| BS-066 | P0 | Cost Gate / temps | Heure d'évaluation absente ou invalide laissant les anciens constats actifs à hash identique | Ancien diagnostic réutilisé sans instant de contrôle valide | validated | Snapshot incomplet et anciens constats inutilisables à hash identique ; head `753152d`, run `#616` |
| BS-067 | P1 | Cost Gate / explication | Régression pouvant faire coexister une source non critique stale et « toutes les sources actuelles » | Explication contradictoire et confiance dégradée | validated | Régression explicite sans expiration des constats indépendants ; head `753152d`, run `#616` |
| BS-068 | P1 | Gouvernance / gates | Numérotation parallèle entre la direction Cost Gate et la matrice MVP | Mauvaise phase lancée ou preuve attribuée au mauvais gate | validated | `COST_GATE_MVP_GATE_MATRIX.md` devient l'autorité unique ; `AGENTS.md` et la direction imposent sa réutilisation sans renumérotation |
| BS-069 | P0 | Cost Gate / fraîcheur UX | Résultat Cost Gate restant visible après modification d'une hypothèse | Snapshot affiché avec des entrées différentes | validated | Résultat retiré du DOM immédiatement, message de recalcul et régression navigateur CGU-09 ; head `7ce11bde`, run `#633` |
| BS-070 | P0 | Cost Gate / explication | Synthèse d'interface cachant un constat matériel ou une couche non évaluée | Faux sentiment de compatibilité complète | validated | Tous les `findings[]` et `unassessedLayers` rendus, comptés et inspectés ; parité CGU-11/CGU-13, head `7ce11bde`, run `#633` |
| BS-071 | P1 | Cost Gate / provenance | Démonstration synthétique modifiée requalifiée en donnée utilisateur ou réelle | Provenance fausse et ancrage masqué | validated | Étiquette persistante « démonstration synthétique modifiée », saisie vide distincte, navigateur et captures ; head `7ce11bde`, run `#633` |
| BS-072 | P1 | Livraison / preuve | Package construit depuis un commit ou moteur différent de celui déclaré | Prototype exact non reproductible | validated | Checkout forcé et vérifié, build refusant un commit divergent, hashes, manifeste, reconstruction et archive inspectée ; head `7ce11bde`, run `#633` |
| BS-073 | P1 | Cost Gate / UX | Parcours sous trois minutes obtenu en cachant des hypothèses financières matérielles | Rapidité trompeuse et conclusion sur une base invisible | open | Hypothèses fixées visibles, couches non évaluées proches du résultat et observation CGU-12 + protocole Gate 1 |
| BS-074 | P1 | Accessibilité | Défilement JavaScript doux malgré la préférence de mouvement réduit | Inconfort ou désorientation | validated | `matchMedia` pilote le défilement et la régression Chromium émule `reduce` ; head `7ce11bde`, run `#633` |
| BS-075 | P1 | Cost Gate / confiance | Exception interne présentée comme erreur du nominal utilisateur | Fausse attribution et correction financière inutile | validated | Erreur technique générale, résultat masqué, aucun champ financier invalidé ; régression navigateur, head `7ce11bde`, run `#633` |
| BS-076 | P2 | Livraison / sûreté | Build supprimant des fichiers sans rapport dans le dossier de sortie | Perte d'artefacts ou de travail | validated | Nettoyage limité au package et à son ZIP ; fichier sentinelle conservé par la régression, head `7ce11bde`, run `#633` |
| BS-077 | P1 | Accessibilité / preuve | Mode mouvement réduit créant une micro-transition globale et laissant temporairement le lien d'évitement hors viewport au premier `Tab` | Accès clavier non visible et test exact-head instable | validated | Transitions réellement nulles sous `reduce` ; document actif, `:focus` et géométrie du lien vérifiés ; head `7177da36`, run `#639` |
| BS-078 | P0 | Livraison / iPad | Le lecteur ouvre le bundle multifichier sans exécuter ses scripts relatifs ; le bouton soumet alors le formulaire, recharge la page et efface les champs | Prototype inutilisable et observation faussée | validated | Défaut reproduit puis fichier autonome exact retesté avec succès par Ayman sur le même iPad le 16 juillet 2026 ; bouton non soumetteur, avertissement et régression sans JavaScript ; head `e42bce2`, run `#647` |
| BS-079 | P0 | Cost Gate / architecture de coût | La formule fixe + proportionnelle est prise pour un modèle complet alors que barèmes, asymétries, impact, attente et non-exécution peuvent suivre d'autres géométries | Fausse précision et mauvaises frontières de taille | mitigated | Prototype requalifié en sonde ; Cost Ledger validé techniquement ; formes réservées refusées, mais barèmes et coûts implicites restent à modéliser |
| BS-080 | P0 | Cost Gate / benchmark | Le champ legacy `slippageTotalRate` ne nomme aucun benchmark, prix, instant ou convention de signe | Coût non interprétable et future TCA impossible à réconcilier | mitigated | Adaptateur qualifiant le champ d'hypothèse de coût d'exécution sans benchmark, testé sur head `df3ff7fc`, run `#650` ; toute mesure observée exigera un benchmark nommé |
| BS-081 | P1 | Cost Gate / incertitude | Un coût implicite ponctuel masque la variabilité du spread, de l'impact et de l'exécution | Conclusion instable présentée avec une précision excessive | mitigated | Enveloppe basse/centrale/haute synthétique non probabiliste et ordonnée, testée sur head `df3ff7fc`, run `#650` ; aucune calibration réelle revendiquée |
| BS-082 | P0 | Cost Gate / type de preuve | Coût contractuel, estimation ex ante et mesure ex post agrégés comme s'ils avaient la même nature | Double comptage, fuite temporelle et comparaison trompeuse | validated | Types de preuve séparés dans le contrat et refus des combinaisons incompatibles ; CL-01 à CL-31 sur head `df3ff7fc`, run `#650` |
| BS-083 | P1 | Cost Gate / modèle d'impact | Une loi de market impact issue de la littérature est hardcodée sans domaine ni calibration Breaktest | Sophistication factice et coûts faux selon instrument, venue ou régime | mitigated | Modèle enfichable seulement avec échantillon, période, paramètres, erreur, preuve hors échantillon et fallback nul ; implémentation suspendue |
| BS-084 | P0 | Cost Gate / complétude | Une liste de coûts valide est présentée comme complète sans politique nommant les événements attendus | Coût oublié, seuil sous-estimé et faux état favorable | validated | `coverage.policyId` et `expectedEconomicEventIds` obligatoires ; sortie limitée à `complete_under_declared_policy` ; composante absente testée sur head `df3ff7fc`, run `#650` |
| BS-085 | P0 | Cost Gate / double comptage | Le moteur promet de reconnaître une même économie à travers deux lignes sans identité économique distincte de l'identité technique | Déduplication non implémentable ou faux positifs | mitigated | `economicEventId` obligatoire et unique ; doublons exclus sur head `df3ff7fc`, run `#650` ; risque résiduel déclaré si deux sources nomment différemment le même événement |
| BS-086 | P1 | Cost Gate / preuve | Une hypothèse arithmétiquement calculable est implicitement traitée comme fiable ou actuelle | Précision et actualité inventées | validated | `calculationStatus`, `evidenceStatus` et `temporalStatus` séparés et testés ; conclusions dépendantes respectant chaque axe sur head `df3ff7fc`, run `#650` |
| BS-087 | P0 | Cost Gate / dénominateur | Le seuil utilise un `returnDenominator` libre, absent de `basisValues` ou d'un montant différent | Seuil exact sur une base fictive | mitigated | Réconciliation clé-montant-devise et scénario fixe seul CL-32 ; preuve distante requise |
| BS-088 | P1 | Cost Gate / dépendances | `dependencies` est accepté sans propagation, cycles ni sémantique de calcul | Composant calculé malgré une dépendance invalide | mitigated | Liste non vide refusée en v1, CL-33 ; future sémantique devra être versionnée |
| BS-089 | P0 | Cost Gate / projection | Un snapshot de coût est extrapolé comme fonction de taille sans domaine | Courbe précise mais non justifiée | mitigated | Politique de projection et domaine synthétique séparés ; CSS-09 à CSS-15 ; preuve distante requise |
| BS-090 | P0 | Cost Gate / capacité de l'avantage | Le même avantage est appliqué à toutes les tailles sans dire qu'il peut décroître | Grandes tailles artificiellement favorables | mitigated | Mode constant qualifié `edge_capacity_not_modelled` ou profil explicite par taille sans interpolation |
| BS-091 | P0 | Cost Gate / scénarios | Coûts et avantages bas/central/haut sont appariés seulement en diagonale | Six scénarios hostiles cachés | mitigated | Produit cartésien neuf cellules par taille, CSS-01/02 et invariant de cardinalité |
| BS-092 | P1 | Cost Gate / cycle | Nominal de sortie legacy maintenu égal au nominal d'entrée alors qu'il peut dépendre du rendement | Coût de sortie insensible au résultat du trade | open | Convention visible `legacy_exit_notional_ratio_preserved` ; modèle de sortie dépendant du chemin non autorisé en v1 |
| BS-093 | P1 | Cost Gate / exécutabilité | Un nominal continu est présenté comme ordre réellement plaçable | Taille incompatible avec prix, quantité, lot, tick ou minimum | mitigated | Surface `notional_only_not_executable` ; couche quantité toujours non évaluée |
| BS-094 | P1 | Cost Gate / incertitude jointe | Les bornes de plusieurs coûts sont additionnées comme si elles pouvaient coïncider | Enveloppe prise pour distribution conjointe | mitigated | Limite `component_cost_scenarios_not_joint_distribution` ; aucune probabilité ou couverture revendiquée |
| BS-095 | P1 | Cost Gate / borne | `knownCostFloor` est pris pour borne universelle malgré de futurs rebates ou améliorations signées | Mauvaise borne après extension TCA | mitigated | Qualification `known_floor_requires_nonnegative_cost_ontology` ; TCA signée séparée |
| BS-096 | P1 | Cost Gate / frontière | Une frontière est interpolée entre tailles dont l'avantage ou les coûts changent librement | Seuil inventé et fausse monotonie | mitigated | Formule exacte seulement sous linéarité prouvée ; profil explicite limité à des intervalles sans interpolation |
| BS-097 | P0 | Cost Gate / égalité | L'arrondi flottant transforme l'égalité au seuil en marge positive | État économique faux à la frontière | mitigated | Tolérance relative versionnée, état `at_threshold_no_positive_margin`, CSS-03/04 et propriété dédiée |
| BS-098 | P1 | Cost Gate / UX | Une grille ou frontière devient implicitement un optimiseur de taille | Conseil ou approbation perçue | mitigated | Aucun optimum, score, classement ou taille proposée dans le contrat et CSS-28 |
| BS-099 | P0 | Cost Gate / fréquence et capital | Une surface par trade est multipliée en fréquence sans durée, règlement ou chevauchement | Faisabilité annuelle et capital disponibles faux | open | Couche `capital_timeline_settlement_and_frequency` toujours non évaluée ; traitement reporté à une tranche temporelle distincte |
| BS-100 | P0 | Cost Gate / alignement | Le ledger perd instrument, place et horizon puis est confronté à un avantage seulement auto-déclaré aligné | Coûts d'un scénario comparés à l'avantage d'un autre | mitigated | `scenarioContext` et hash dans le ledger ; évaluateur canonique d'alignement réexécuté par la surface ; correspondance stricte et CSS-20/31/32 ; preuve distante requise |

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
24. La source a-t-elle déjà retranché chaque hold ?
25. L'allocation de stratégie plafonne-t-elle le cash du compte ?
26. Les hashes identifient-ils le contenu sans se hasher eux-mêmes ?
27. La base de prix de `G` contient-elle déjà des frictions ?
28. Une donnée manquante masque-t-elle un fait indépendant ?
29. Quantité, prix, devise et nominal se réconcilient-ils ?
30. La base brute ou nette concorde-t-elle avec chaque hold inclus par la source ?
31. Une donnée a-t-elle été observée après l'heure d'évaluation ?
32. Seules les sources critiques pilotent-elles l'expiration agrégée ?
33. Une collection mal formée peut-elle être assimilée silencieusement à une liste vide ?
34. Un coût FX existe-t-il alors que compte et cotation ont la même devise ?
35. Les coûts immédiats communs se réconcilient-ils avec les hypothèses du cycle ?
36. Une taxe ou un frais d'entrée manque-t-il au seuil économique complet ?
37. Chaque source possède-t-elle une identité complète et un caractère critique explicite ?
38. L'heure d'évaluation est-elle valide avant d'activer ou de réactiver des constats ?
39. Un constat positif d'actualité contredit-il une source stale encore visible ?
40. Les identifiants de gate correspondent-ils à la matrice d'autorité sans numérotation parallèle ?
41. Un résultat disparaît-il dès qu'une hypothèse Cost Gate change ?
42. L'interface conserve-t-elle chaque constat et chaque couche non évaluée ?
43. Une démonstration modifiée conserve-t-elle sa provenance synthétique ?
44. Le package prouve-t-il le moteur et le commit exacts qu'il déclare ?
45. La rapidité du parcours repose-t-elle sur des simplifications visibles plutôt que sur des hypothèses cachées ?
46. Les mouvements déclenchés par script respectent-ils aussi la préférence de mouvement réduit ?
47. Une erreur interne peut-elle être attribuée à tort à une entrée financière de l'utilisateur ?
48. Un build peut-il supprimer un fichier voisin qui ne lui appartient pas ?
49. Le mode mouvement réduit supprime-t-il réellement toute transition résiduelle sur le premier focus clavier ?
50. Le fichier exact remis à l'utilisateur est-il autonome, testé directement et incapable d'effacer les champs si son moteur ne démarre pas ?
51. Chaque coût déclare-t-il une forme de calcul compatible avec son économie plutôt qu'un taux proportionnel par défaut ?
52. Tout slippage ou coût d'exécution nomme-t-il son benchmark, son instant, sa devise et sa convention de signe ?
53. Une fourchette de sensibilité est-elle clairement distincte d'un intervalle statistique ?
54. Coût contractuel, estimation ex ante et observation ex post restent-ils séparés et réconciliables ?
55. Tout modèle d'impact déclare-t-il domaine, calibration, erreur, validité et absence de fallback silencieux ?
56. Une liste de coûts est-elle qualifiée par une politique nommant chaque événement attendu plutôt que déclarée complète par sa seule présence ?
57. L'identité de représentation reste-t-elle distincte de l'identité de l'événement économique afin de détecter les doubles comptes réellement détectables ?
58. Calculabilité, qualité de preuve et actualité restent-elles séparées dans le moteur et dans le langage affiché ?

## 7. Règle de clôture

Un angle mort n'est pas `validated` parce qu'il est discuté. La preuve peut être oracle, invariant, test navigateur, inspection, test utilisateur, paiement, revue juridique, source contractuelle, benchmark ou incident simulé.

Une limite devient `accepted_limit` uniquement si :

- visible ;
- non trompeuse ;
- conséquence comprise ;
- gate de réexamen défini.

Réviser ce registre à chaque changement de proposition de valeur, calcul, cible, donnée, canal, réglementation, livraison ou architecture.
