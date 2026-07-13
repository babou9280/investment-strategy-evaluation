# Breaktest — registre permanent des angles morts

## 1. Rôle

Ce registre transforme une exigence permanente du projet en processus vérifiable : Breaktest doit rechercher activement ce qui a été oublié, mal défini, supposé à tort, insuffisamment testé ou présenté avec une confiance excessive.

La recherche d'angles morts ne s'arrête pas aux calculs. Elle couvre le produit, la finance, la méthode quantitative, les données, l'expérience utilisateur, la réglementation, la sécurité, l'ingénierie, le modèle économique, la distribution, les opérations, la réputation, la valeur académique et la gouvernance du projet.

Ce document reste actif jusqu'à ce qu'Ayman déclare explicitement le projet terminé.

## 2. Principe de travail

Pour toute modification matérielle :

1. reconstruire l'état réellement validé ;
2. identifier le problème visible ;
3. chercher au moins un défaut adjacent ou rétrospectif ;
4. distinguer erreur, limite, hypothèse, risque et décision différée ;
5. corriger immédiatement les défauts locaux réversibles ;
6. créer une règle permanente lorsqu'un défaut peut se reproduire ;
7. ajouter un test ou une preuve empêchant son retour lorsqu'il est testable ;
8. propager les conséquences dans les calculs, l'interface, les documents et les livrables ;
9. ne jamais confondre absence de défaut détecté avec preuve d'exhaustivité.

## 3. Classification

Chaque angle mort reçoit :

- un identifiant stable ;
- un domaine ;
- une description falsifiable ;
- un niveau : `P0`, `P1`, `P2` ou `P3` ;
- un statut : `open`, `mitigated`, `validated`, `accepted_limit`, `deferred` ou `rejected` ;
- une conséquence possible ;
- une méthode de détection ;
- une action ou une justification de report ;
- une preuve attendue ;
- le composant concerné ;
- la date ou le gate de réexamen.

### Priorité

- `P0` : peut rendre un calcul faux, trompeur, dangereux, juridiquement problématique ou invalider la proposition de valeur ;
- `P1` : peut empêcher la compréhension, l'usage, la confiance ou la validation externe ;
- `P2` : peut dégrader l'échelle, l'exploitation, la rétention ou la défensibilité ;
- `P3` : amélioration utile mais non bloquante.

## 4. Domaines obligatoires de revue

### A. Finance et microstructure

Vérifier notamment :

- double comptage ou omission d'une friction ;
- commission minimale, fixe, proportionnelle ou par palier ;
- spread total contre spread par côté ;
- slippage, délai, impact de marché et liquidité ;
- frais de change, devise du prix, devise du compte et moment de conversion ;
- taxes, frais de place, frais réglementaires, financement et intérêts ;
- achat simple, aller-retour, vente à découvert, ordres partiels et multi-leg ;
- dividendes, coupons, corporate actions et flux externes ;
- règlement-livraison, capital immobilisé et positions simultanées ;
- limites du modèle pour dérivés, levier et marge.

### B. Quantitatif et statistique

Vérifier notamment :

- dénominateur, unité, horizon et convention de signe ;
- confusion rendement par opération / rendement calendaire ;
- annualisation incohérente ;
- dépendance sérielle, hétéroscédasticité et non-stationnarité ;
- changement de régime ;
- échantillon insuffisant ;
- multiple testing, sélection du meilleur modèle et data snooping ;
- look-ahead, survivorship bias, selection bias et leakage ;
- incertitude de l'avantage brut ;
- sensibilité aux hypothèses et stabilité des conclusions ;
- cas limites, égalités, monotonie, convergence et non-finis.

### C. Données et provenance

Vérifier notamment :

- origine, date, devise et fraîcheur ;
- observé, contractuel, estimé, hypothèse ou synthétique ;
- champ absent contre zéro réel ;
- valeurs incohérentes entre PnL, rendement et nominal ;
- duplications, agrégations et transformations non traçables ;
- versions de barèmes ;
- qualité des imports futurs ;
- capacité à réconcilier chaque agrégat avec les lignes sources.

### D. Produit et utilité

Vérifier notamment :

- problème réellement fréquent et coûteux ;
- valeur supérieure à un calcul gratuit ;
- information nouvelle produite ;
- action ou décision réellement améliorée ;
- capacité de la cible à fournir les entrées ;
- fréquence naturelle de retour ;
- coût de configuration et de maintenance ;
- fonction impressionnante mais non utile ;
- risque que le produit devienne lui-même un coût supplémentaire ;
- adéquation entre cible gratuite, payeur et bénéficiaire.

### E. UX, accessibilité et compréhension

Vérifier notamment :

- vocabulaire compréhensible sans expertise préalable ;
- hiérarchie avant détail ;
- risque d'ancrage causé par les valeurs par défaut ;
- surcharge cognitive ;
- interprétation d'un seuil comme prévision ou conseil ;
- états loading, empty, error, partial et success ;
- focus, clavier, lecteur d'écran, contraste et mouvement réduit ;
- mobile, tablette, desktop et Safari/iPad ;
- persistance de résultats obsolètes après erreur ;
- affichage d'arrondis trompeurs ou de fausse précision.

### F. Réglementation, droit et éthique

Vérifier notamment :

- frontière information / recommandation personnalisée ;
- formulation des comparaisons et contraintes inverses ;
- revendications GIPS, MiFID, certification ou conformité ;
- conflits d'intérêts et affiliation ;
- marketing financier et preuves des affirmations ;
- confidentialité, consentement et minimisation des données ;
- conditions d'utilisation, responsabilité et droit de rétractation futurs ;
- propriété intellectuelle, licences et marque ;
- public vulnérable ou compréhension insuffisante des risques.

### G. Ingénierie et qualité logicielle

Vérifier notamment :

- déterminisme et reproductibilité ;
- divergence entre moteurs ou copies de formules ;
- compatibilité navigateur et fonctionnement hors ligne ;
- sécurité de `file://` et chemins relatifs ;
- régressions entre moteur historique, Q0 et Capital Efficiency ;
- performance et mémoire sur données plus grandes ;
- versionnement des contrats ;
- dépendances, supply chain et licences ;
- intégrité des builds et empreintes ;
- observabilité future sans collecte abusive.

### H. Sécurité et confidentialité

Vérifier notamment :

- XSS, injection CSV/formule et fichiers malveillants ;
- exfiltration réseau involontaire ;
- stockage local non annoncé ;
- secrets dans le dépôt ou le bundle ;
- données personnelles dans les exports et partages ;
- modèle de menace des imports futurs ;
- suppression, sauvegarde et récupération futures ;
- dépendances externes et contenu distant.

### I. Business model et marché

Vérifier notamment :

- volonté de payer réelle ;
- économies supérieures au prix ;
- taille du segment payeur ;
- rétention et fréquence d'usage ;
- concurrence gratuite et substitution par le courtier ;
- coût d'acquisition ;
- distribution organique réelle ;
- dépendance à l'affiliation ;
- marge brute et coût de support ;
- trajectoire vers données, intégrations, API ou marketplace sans présumer leur réussite.

### J. Validation et expérimentation

Vérifier notamment :

- test qui peut réellement réfuter l'hypothèse ;
- échantillon et recrutement biaisés ;
- questions orientées ;
- compliment confondu avec valeur ;
- intention confondue avec paiement ;
- première utilisation confondue avec rétention ;
- trafic non qualifié ;
- critères d'arrêt modifiés après observation ;
- métrique choisie parce qu'elle est favorable ;
- absence de groupe ou baseline pertinente lorsque nécessaire.

### K. Opérations et exploitation

Vérifier notamment :

- mise à jour des barèmes ;
- support utilisateur ;
- correction et communication d'une erreur de calcul ;
- incident, rollback et version affectée ;
- sauvegardes futures ;
- gestion des remboursements ;
- conformité des contenus publiés ;
- coût humain de maintenance ;
- dépendance à une seule personne ou à un seul outil.

### L. Réputation, candidature et preuve de travail

Vérifier notamment :

- distinction entre travail assisté par IA et preuve personnelle ;
- capacité à expliquer les choix et limites ;
- reproductibilité par un évaluateur ;
- absence de chiffres, partenaires ou utilisateurs inventés ;
- cohérence entre ambition et niveau réellement exécuté ;
- traçabilité des décisions et corrections ;
- qualité du dossier de preuve plutôt que quantité de fonctions ;
- possibilité de défendre le projet oralement sans surpromesse.

### M. Gouvernance du projet

Vérifier notamment :

- fichiers canoniques obsolètes ou contradictoires ;
- scope creep ;
- branche ou PR incorrecte ;
- confusion entre actif historique et feuille de route ;
- dette documentaire ;
- automatisation qui agit sur un état dépassé ;
- décision réversible inutilement soumise à Ayman ;
- décision stratégique prise sans validation ;
- absence de propriétaire ou de gate de réexamen ;
- faux sentiment de complétude créé par une CI verte.

## 5. Angles morts actifs prioritaires

| ID | Priorité | Domaine | Angle mort | Risque | Statut | Gate / preuve attendue |
|---|---|---|---|---|---|---|
| BS-001 | P0 | Quantitatif | Une fourchette utilisateur peut être prise pour une estimation statistique | Fausse confiance | mitigated | Langage, provenance, tests d'absence de probabilité et revue utilisateur |
| BS-002 | P0 | Produit | L'utilisateur peut ne pas disposer d'un avantage brut défendable | Le cœur Edge Survival devient inutilisable | open | Tester seuil seul, point et fourchette avec utilisateurs ; mesurer la source réelle de G |
| BS-003 | P0 | Finance | Certaines frictions réelles restent hors modèle | Seuil sous-estimé | open | Inventaire explicite par instrument et juridiction avant toute donnée réelle |
| BS-004 | P0 | UX / réglementation | Une frontière mathématique peut être comprise comme recommandation | Risque réglementaire et mauvais usage | mitigated | Revue de langage + observation utilisateur sans coaching |
| BS-005 | P0 | Ingénierie | Des résultats anciens peuvent rester visibles après entrée invalide ou changement de mode | Résultat trompeur | mitigated | Suite navigateur exacte-head verte sur erreurs, transitions, focus et masquage ; inspection manuelle encore requise avant livraison |
| BS-006 | P0 | Quantitatif | Égalités au seuil/plancher et tolérance peuvent changer l'état | Classification fausse aux frontières | mitigated | Oracles `edge_range.test.js` couvrant égalité, plage dégénérée, tolérance, zéro négatif et non-finis ; revue indépendante requise avant `validated` |
| BS-007 | P1 | UX | La densité progressive peut rester trop élevée sur mobile | Abandon ou mauvaise compréhension | open | Inspection 390/768 et test de compréhension en moins de 90 secondes |
| BS-008 | P1 | Navigateur | Le comportement Safari/iPad n'est pas prouvé | Livrable non exploitable par Ayman | open | Exécution réelle sur Safari/iPad avant livraison |
| BS-009 | P1 | Business | Un calcul utile peut ne pas créer d'usage répété | Faible rétention et faible revenu | open | Deuxième usage non sollicité et demande d'import après test externe |
| BS-010 | P1 | Données | Les hypothèses de coûts peuvent être difficiles à obtenir correctement | Garbage in, garbage out | open | Tester la saisie sans assistance et documenter les sources possibles |
| BS-011 | P1 | Validation | Les premiers testeurs proches peuvent surévaluer le projet | Faux signal de demande | open | Protocole neutre, objections conservées, recrutement qualifié distinct |
| BS-012 | P1 | Livraison | Un bundle hors ligne peut diverger du moteur validé | Démo fausse malgré CI verte | open | Un seul moteur source, manifeste, hashes et tests sur le package exact |
| BS-013 | P1 | Sécurité | Les futurs imports ouvrent XSS, CSV injection et fichiers hostiles | Atteinte locale ou export dangereux | deferred | Modèle de menace et tests avant reprise de l'import |
| BS-014 | P1 | Gouvernance | Une CI verte peut être interprétée comme validation produit | Surconfiance | mitigated | État canonique séparant technique, UX, marché et réglementation |
| BS-015 | P2 | Opérations | Les futurs barèmes peuvent devenir obsolètes | Résultats contractuels faux | deferred | Version, date, source, expiration et procédure de mise à jour |
| BS-016 | P2 | Marché | Le courtier peut intégrer gratuitement une fonction équivalente | Faible défensibilité | open | Valider la valeur des données multi-courtiers, historiques et benchmarks |
| BS-017 | P2 | Réputation | L'assistance IA peut diminuer la crédibilité si la preuve n'est pas défendable | Faible valeur académique/professionnelle | open | Dossier de preuves, décisions, tests et capacité d'explication orale |
| BS-018 | P2 | International | Devise, fiscalité, langue et structure de frais varient par pays | Produit non généralisable | deferred | Ne pas généraliser avant périmètre pays/instrument explicite |
| BS-019 | P3 | Supply chain CI | Les runtimes Node des actions GitHub évoluent et peuvent rendre le pipeline obsolète | Validation interrompue sans défaut produit | deferred | Surveiller les avis de dépréciation et mettre à jour les actions avant retrait forcé ; run 434 fonctionne sous Node 24 |

## 6. Gate de revue multidisciplinaire

Aucune version ne peut être qualifiée de prête pour critique externe tant que les questions suivantes n'ont pas une réponse explicite :

1. Quel problème financier exact est résolu ?
2. Quel calcul ou diagnostic est réellement nouveau pour l'utilisateur ?
3. Quelles hypothèses peuvent rendre le résultat faux ou inutilisable ?
4. Quelles frictions ne sont pas modélisées ?
5. Quel résultat peut être mal interprété comme conseil ou prévision ?
6. Quelles entrées l'utilisateur ne sait probablement pas fournir ?
7. Quel scénario casse le modèle ou son interface ?
8. Quelle régression rétrospective a été recherchée ?
9. Quelle preuve distingue fonctionnement technique, compréhension, usage répété et paiement ?
10. Quelle partie serait supprimée si elle n'améliore ni diagnostic, ni preuve, ni décision ?
11. Le livrable exact fonctionne-t-il hors ligne sur les appareils cibles ?
12. Un évaluateur peut-il reproduire les résultats et comprendre les limites sans croire une affirmation d'autorité ?

## 7. Règle de clôture

Un angle mort n'est pas `validated` parce qu'il a été discuté. Il faut une preuve adaptée : oracle, invariant, test navigateur, inspection, test utilisateur, paiement, revue juridique, source contractuelle, benchmark, incident simulé ou autre preuve explicitement définie.

Une limite peut être `accepted_limit` uniquement si :

- elle est visible pour l'utilisateur concerné ;
- elle ne rend pas la promesse centrale trompeuse ;
- sa conséquence est comprise ;
- son gate de réexamen est défini.

Le registre doit être révisé à chaque changement de proposition de valeur, de calcul, de cible, de donnée, de canal, de réglementation, de format de livraison ou d'architecture.