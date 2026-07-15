# Breaktest — plan de validation

- Actifs techniquement stabilisés : **Breaktest Capital Efficiency / Edge Survival** et fondation synthétique **Cost Gate**
- Test actif : **Gate 1 Cost Gate hors ligne**, autorisé le 15 juillet 2026 et préenregistré avant observation
- Statut : Gate 0 fusionnée ; défaut bloquant du bundle reproduit par Ayman sur iPad ; HTML autonome et repli sans JavaScript techniquement exécutés sur le head exact `bb50550` ; nouvel essai iPad requis ; cinq observations qualifiées non commencées ; publication, données externes et paiement suspendus
- Principe : valider chaque couche séparément et permettre l'abandon

## 1. Question décisive de Gate 1

> Des investisseurs autonomes comprennent-ils, sans coaching, la valeur d'un contrôle qui sépare seuil, avantage, cash et qualité des données, sans le prendre pour une recommandation ?

Le test ne vise pas les compliments, inscriptions gratuites ou intentions abstraites.

Le fichier autonome et le package techniques exacts sont validés dans Chromium par le run `#645` et documentés dans `docs/validation/COST_GATE_OFFLINE_CRITIQUE.md`. Cette preuve ne compte pour aucun seuil utilisateur. Le premier bundle remis ayant échoué sur iPad, le fichier autonome exact doit réussir un nouvel essai fondateur sur le même appareil avant d'autoriser les observations.

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

## 4. Gate interne de la fondation fusionnée

Edge Survival a satisfait son gate interne dans la PR `#23` fusionnée.

La PR `#24` a satisfait puis fusionné la fondation Cost Gate. Les conditions vérifiées avant fusion étaient :

- contrats cash, snapshot, findings, méthode et alignement de `G` réconciliés ;
- périmètre strict compte cash, achat long, action/ETF au comptant ;
- cash immédiat distinct de la friction du cycle ;
- cash du compte plafonné par l'allocation libre de stratégie ;
- holds identifiés et non déduits deux fois ;
- quantité, prix, devise et nominal réconciliés ;
- snapshot déterministe et anciens constats inactifs après mutation ;
- anciens constats inactifs après expiration même à contenu identique ;
- `findings[]` conservés sous violations multiples ;
- stale et conflit simultanément visibles ;
- portée achat simple / aller-retour cohérente avec un / deux côtés ;
- ordre des ensembles sans effet sur le snapshot ;
- couches cash et friction validées indépendamment ;
- CG-01 à CG-18 et propriétés réussis ;
- aucune donnée réelle, réseau, stockage, recommandation ou exécution ;
- non-régressions H1–H2/C1–C4, Q0, Capital Efficiency et Edge Survival ;
- fichiers canoniques, validation et registre synchronisés ;
- threads de revue traités ;
- package HTML Cost Gate non fabriqué dans cette PR.

Preuve finale : head `3fb6341d51ff46b70dd774546955fbb1c66a400e`, run `#618` réussi, artefact `8316213225` inspecté, puis squash commit `e61d166d81da54a7d4ee596db2c2447fcb418eb2` dans `breaktest-bootstrap`. Une CI verte prouve seulement les comportements testés.

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

La validation stratégique du 14 juillet 2026 autorise une progression par gates, pas un produit connecté ni une recommandation.

### Fondation contractuelle et moteur synthétique — preuve version `3` technique

Le head fonctionnel `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4` et le run `29334708343` (`#604`) couvrent :

- contrats réconciliés après revue hostile ;
- domaine strict cash long, action/ETF au comptant ;
- cash immédiat, allocation de stratégie et holds ;
- snapshot déterministe et constats multiples ;
- alignement complet de l'avantage brut ;
- scénarios CG-01 à CG-18 et non-régressions.

Cette preuve reste synthétique. Sa synchronisation documentaire a réussi sur `be6aa09d2b87bb07bd19258f393b496e522580a1` dans le run `29335825348` (`#606`). La revue exacte de ce head a ensuite révélé des défauts d'indépendance des couches, d'expiration et de coexistence stale/conflit ; l'audit adjacent a trouvé les incohérences portée/côtés, ordre des ensembles et vocabulaire de synthèse.

La version `1` corrige ces causes et ajoute les régressions correspondantes. Le head fonctionnel `2ebf0e3e37852e4f3252e54149e147aa0d5712c3` a réussi le run exact `29338189190` (`#608`) et sa synchronisation documentaire le run `#610`.

La revue exacte de ce dernier head a révélé quatre défauts supplémentaires de nominal, temps, expiration et collections. La version `2` y ajoute les réconciliations de base de cash, devise et coûts entrée/cycle. Le head fonctionnel `faafd348da55217e96ba67efd9f9434be62725ca` a réussi le run exact `29342135098` (`#612`) ; sa synchronisation documentaire `6cfc43e4bbb015c8512c0ae26aad02d04503c897` a réussi le run `#614` et les fils associés ont été résolus.

La relecture automatisée finale de la version `2` n'a pas été exécutée faute de quota. La revue hostile indépendante a trouvé quatre défauts adjacents de complétude FX/coûts et d'intégrité temporelle/provenance. La version `3` les corrige et ajoute une régression contre les constats d'actualité contradictoires. Le head fonctionnel `753152d9cce1feabba48e54b32b4eed2ce3f5e07` a réussi le run exact `29345208179` (`#616`) ; jobs, logs, artefact, digest et captures ont été inspectés. Sa synchronisation documentaire a réussi sur `3fb6341d51ff46b70dd774546955fbb1c66a400e` dans le run `#618`, puis la PR `#24` a été fusionnée par squash au commit `e61d166d81da54a7d4ee596db2c2447fcb418eb2`. Cette preuve reste technique et synthétique.

### Prototype utilisateur hors ligne — techniquement prêt, résultats non observés

Sur `strategy/cost-gate-offline-critique`, sans réseau ni donnée réelle :

- scénario de trade manuel ;
- cash libre et nominal réservé ;
- point ou fourchette brute ;
- hypothèses synthétiques explicitement étiquetées ;
- états non prescriptifs ;
- aucune couche Cost Gate simulée comme donnée réelle.

Mesurer auprès d'utilisateurs qualifiés :

- fréquence réelle des analyses avant ordre ;
- facteur limitant correctement identifié ;
- compréhension des couches non évaluées ;
- absence de faux feu vert ;
- effort et acceptation de la saisie ;
- réaction à `insufficient_data` ;
- modification puis répétition volontaire d'un scénario.

Critères d'arrêt : problème rare, usage uniquement curieux, saisie plus coûteuse que la décision ou confusion persistante avec une recommandation.

Le protocole d'autorité, les cinq participants, le script neutre, les seuils et la règle d'amendement sont préenregistrés dans `docs/tasks/COST_GATE_OFFLINE_CRITIQUE.md`. La matrice technique est `docs/scenarios/COST_GATE_OFFLINE_CRITIQUE_MATRIX.md`. Le premier essai fondateur du bundle multifichier sur iPad a échoué avant toute observation : le lecteur n'exécutait pas les scripts relatifs, l'action d'analyse rechargeait la page et effaçait les champs. Il ne compte pas parmi les cinq participants. Le head `bb50550` et le run `#645` prouvent dans Chromium un HTML autonome direct, une analyse réelle sous `file://` et un repli sans JavaScript qui garde la valeur saisie, l'URL et l'absence de faux résultat. Le défaut reste seulement atténué jusqu'au nouvel essai sur le même iPad ; aucun résultat utilisateur n'est consigné avant une observation réelle.

### Capacité à fournir les entrées et faisabilité générale — non validées

- commissions, change, spread et slippage réellement disponibles ;
- avantage brut compatible réellement disponible ;
- cash réglé, holds et allocation compris ;
- positions simultanées et concurrence du capital ;
- réutilisation des invariants C1/C4 au-delà du cas immédiat ;
- aucune inférence de levier ou de capital fictif.

### Donnée externe, droit et économie — non autorisés

Avant toute source : licence, coût, couverture, fraîcheur, fuseau, instrument, place, devise, valeurs manquantes, conflits, fallback, kill switch, sécurité et confidentialité doivent être décidés et testés. Aucune conclusion dépendante d'une donnée externe sans état `data_ready`.

Avant tout test public ou vocabulaire plus personnalisé : revue information/recommandation, responsabilité, communication d'erreur, conditions d'utilisation, conflits d'intérêts, volonté de payer, coût des données et taux de faux blocage ou faux sentiment de sécurité.

Toute source externe limitée, connexion ou exécution exige ensuite une décision explicite distincte d'Ayman. L'intégration et l'exécution restent hors périmètre.

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

La fondation est clôturée. Ayman a explicitement autorisé Gate 1 le 15 juillet 2026 ; cette autorisation est limitée au prototype de critique hors ligne.

Sont autorisés : nouvel essai fondateur du fichier autonome exact sur le même iPad, puis observation des cinq participants selon le protocole, correction d'un défaut réellement reproduit, maintien des preuves et package `internal_review` exact. Une nouvelle fonctionnalité ou une nouvelle donnée n'est pas autorisée par cette Gate.

Gate 1 ne sera pas déclarée réussie avant cinq observations qualifiées réelles et application des seuils préenregistrés.

Restent interdits : données externes, import réel, compte, stockage, réseau applicatif, analytics actif, email, paiement, connexion courtier, recommandation, ordre limite conseillé, transmission et exécution.
