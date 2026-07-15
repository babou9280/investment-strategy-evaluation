# Breaktest — définition actuelle du produit

- Direction validée : 13 juillet 2026
- Raffinement actif : Capital Efficiency et Edge Survival
- Extension stratégique validée : Breaktest Cost Gate, 14 juillet 2026
- Phase : Gate 1 Cost Gate, prototype de critique techniquement prêt et cinq observations qualifiées à exécuter avant tout test commercial externe
- Nom de travail actuel : **Breaktest Cost Intelligence**
- Nom de travail futur : **Breaktest Cost Gate**

## 1. Vision

Breaktest aide un investisseur autonome à comprendre si une méthode, une opération répétée ou un avantage brut conserve une marge économique après les frictions réellement pertinentes pour son scénario.

La promesse n'est plus « additionner des frais ».

> Breaktest montre le rendement brut nécessaire pour couvrir les frictions, ce qui reste d'un avantage lorsqu'il est fourni, ce qui peut être dilué par la taille et ce qui constitue un plancher structurel.

Breaktest ne recommande pas un instrument, un courtier, une taille, une fréquence ou une transaction. Il ne prédit aucun rendement et n'exécute aucun ordre.

À terme, Cost Gate devra appliquer ce noyau à un trade envisagé avant envoi, en tenant compte du capital libre, de la taille proposée, de la liquidité et de la qualité des données, sans transformer automatiquement l'analyse en recommandation.

## 2. Utilisateur cible initial

Investisseur ou trader autonome qui :

- dispose généralement d'environ 2 000 à 50 000 EUR ;
- effectue plusieurs opérations, versements ou rééquilibrages ;
- utilise une méthode répétable, même simple ;
- subit des commissions, frais de change, spread, slippage ou rotation significatifs ;
- souhaite distinguer performance brute, frictions et marge nette ;
- peut parfois fournir une hypothèse brute par opération, mais doit aussi pouvoir utiliser le produit sans cette valeur.

Les très petits capitaux restent un canal gratuit pertinent, mais ne sont pas supposés être le principal segment payeur.

## 3. Problème utilisateur

Une grille tarifaire ou un total de frais ne répond pas directement à ces questions :

- quel rendement brut minimal couvre les frictions de cette opération ?
- quelle partie du coût peut être diluée par une taille supérieure ?
- quel plancher proportionnel subsiste quelle que soit la taille ?
- quelle part d'une hypothèse brute reste nette ?
- la conclusion demeure-t-elle stable dans une fourchette d'hypothèses ?
- une contrainte de taille est-elle mathématiquement atteignable ?
- une fréquence reste-t-elle sous un budget de friction défini par l'utilisateur ?
- une frontière mathématique dépasse-t-elle potentiellement le capital réellement disponible ?
- un trade envisagé reste-t-il cohérent avec le cash libre, la liquidité et les données disponibles ?

La faisabilité immédiate du cash est démontrée dans le moteur synthétique isolé fusionné par la PR `#24`. La faisabilité générale du portefeuille, des positions simultanées et des comptes réels reste non implémentée : `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md`.

La direction pré-trade est documentée dans `docs/product/COST_GATE_DIRECTION.md`. Sa fondation analytique synthétique est implémentée. Une interface hors ligne limitée à la critique de Gate 1 est techniquement exécutée ; sa compréhension réelle, le produit connecté, ses données réelles et son marché ne le sont pas.

## 4. Architecture de valeur

### 4.1 Géométrie de friction

Le produit sépare :

- coût fixe en euros ;
- coût variable proportionnel ;
- coût total par opération ;
- seuil brut de couverture ;
- plancher variable ;
- sensibilité du seuil à la taille ;
- coût annuel uniquement lorsque la fréquence est explicitement fournie.

Le coût en euros explique le diagnostic ; il n'est pas le résultat principal.

### 4.2 Edge Survival — valeur ponctuelle

Lorsque l'utilisateur fournit une valeur brute compatible :

- marge nette en taux et en euros ;
- part absorbée et part conservée ;
- taille frontière pour une marge positive ;
- taille frontière pour conserver une part choisie ;
- cas structurellement impossible lorsque le brut ne dépasse pas le plancher variable ;
- rendement brut requis pour une marge nette cible.

Une valeur brute positive sans cible de rétention conserve un état explicite. Une égalité numérique au seuil n'est jamais présentée comme une marge positive.

### 4.3 Edge Survival Envelope — fourchette

L'utilisateur peut fournir trois hypothèses ordonnées : basse, centrale et haute.

Breaktest montre :

- les trois marges nettes ;
- si toute la fourchette dépasse le seuil ;
- si elle traverse le seuil ;
- si même la borne haute ne le couvre pas ;
- sa relation au plancher variable ;
- les frontières conditionnelles par hypothèse lorsque la question choisie le permet.

Cette fourchette est une analyse de sensibilité déterministe. Elle n'est ni une probabilité, ni une prévision, ni un intervalle de confiance.

### 4.4 Contraintes inverses

Le produit peut résoudre une seule question avancée à la fois :

- taille frontière pour une marge nette positive ;
- taille frontière pour une rétention cible ;
- fréquence frontière sous un budget annuel ;
- rendement brut requis pour une marge nette cible.

Ces sorties décrivent des conditions sous hypothèses. Elles ne constituent aucune prescription.

### 4.5 Faisabilité du capital — fondation partielle

Une frontière mathématique peut dépasser le cash réellement disponible ou ignorer le chevauchement de positions.

La fondation synthétique distingue déjà capital de référence, allocation de stratégie, cash réglé, holds et engagement immédiat. La future couche générale devra encore couvrir exposition, positions simultanées et réservation chronologique du capital déjà validée dans le moteur historique.

Cette fondation est une preuve technique interne. Elle ne prouve ni lecture d'un compte réel, ni utilité utilisateur, ni capacité de portefeuille.

### 4.6 Cost Gate — fondation synthétique et couche pré-trade future

Le moteur synthétique isolé orchestre déjà les dimensions disponibles dans un périmètre cash long strict. Le futur produit devra réunir, pour un trade envisagé :

- frictions explicites et implicites ;
- capital de référence, cash libre et nominal déjà réservé ;
- taille proposée ;
- avantage brut ponctuel ou fourchette fournie ;
- liquidité, spread, type d'ordre et fraîcheur des données lorsque ces informations seront légalement et techniquement disponibles ;
- contraintes définies par l'utilisateur.

La sortie future conserve plusieurs constats explicables dans `findings[]` : géométrie de friction, alignement de l'avantage, cash et allocation de stratégie, qualité des données, exécution, contraintes utilisateur et limites de périmètre.

Une synthèse interne peut choisir un facteur principal parmi `invalid_input`, `unsupported_scope`, `snapshot_unusable`, `structurally_non_viable`, `edge_not_surviving_modelled_friction`, `capital_not_feasible`, `execution_cost_risk`, `constraint_breach`, `insufficient_data` et `no_incompatibility_detected_under_assumptions`.

Cette dernière formule signifie seulement qu'aucune incompatibilité n'a été détectée dans les couches évaluées. Les couches non évaluées restent visibles. Aucun identifiant interne n'est une recommandation, une autorisation d'ordre ou une prévision.

### 4.7 Data Quality Gate — préalable obligatoire

Aucun résultat dépendant d'une donnée externe ne pourra être produit sans contrôle visible de :

- source ;
- timestamp et fraîcheur ;
- instrument, place et devise ;
- couverture ;
- provenance observée, contractuelle, estimée ou dérivée ;
- valeurs manquantes ou contradictoires ;
- niveau d'incertitude ;
- licence et droit d'utilisation.

Une donnée stale, partielle, conflictuelle ou indisponible doit limiter ou bloquer la conclusion concernée.

## 5. Définition de l'avantage brut

L'entrée brute actuelle signifie :

> moyenne brute par opération complète, gains, pertes et opérations nulles inclus, avant les coûts saisis, rapportée au nominal compatible avec le scénario.

Elle ne doit pas être remplacée silencieusement par :

- taux de réussite ;
- gain moyen des seuls gagnants ;
- CAGR ou rendement annuel ;
- Sharpe ratio ;
- performance totale du compte ;
- résultat déjà net de frais ;
- objectif personnel de rendement.

Le contrat complet figure dans `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md`.

## 6. Expérience produit active

Le parcours reste progressif :

1. saisir le scénario d'opération et les frictions ;
2. calculer le seuil sans capital, fréquence ou avantage brut obligatoires ;
3. ajouter facultativement capital et fréquence pour les sorties annuelles ;
4. choisir explicitement seuil seul, valeur unique ou fourchette ;
5. résoudre au maximum une contrainte avancée ;
6. consulter formule, provenance, convention et limites.

Règles UX actives :

- aucun chiffre financier prérempli comme s'il venait de l'utilisateur ;
- aucune sélection implicite achat simple / aller-retour ;
- le bouton d'exemple charge une démonstration explicitement synthétique ;
- toute modification d'entrée masque immédiatement le résultat devenu obsolète ;
- erreurs avec focus utile ;
- clavier, `aria-live`, mouvement réduit et responsive ;
- vocabulaire concret avant le jargon.

La future expérience Cost Gate devra rester progressive : scénario manuel d'abord, qualité des données ensuite, puis explication du facteur limitant. Elle ne doit pas devenir un mur de paramètres de microstructure.

## 7. État technique des actifs

### Moteur historique

Actif réutilisable avec :

- import/export local ;
- validation numérique stricte ;
- séparation observé / simulé ;
- isolation temporelle ;
- turnover chronologique ;
- réservation du nominal ;
- trésorerie réalisée aux sorties ;
- audit et provenance.

Il n'est pas la feuille de route automatique du nouveau produit.

### Calculateur Q0

Le calculateur descriptif `validation_site/` est techniquement validé et gelé. Sa publication a été suspendue parce que sa valeur restait trop proche d'un totalisateur de coûts.

### Capital Efficiency Lab

`capital_efficiency_lab/` contient le prototype actif :

- moteur déterministe ;
- modes seuil, point et fourchette ;
- contraintes inverses ;
- provenance ;
- cas limites ;
- tests Node et Chromium ;
- captures de revue interne.

La version moteur en cours de validation est `capital-efficiency-lab-4-optional-annual`.

### Cost Gate

Cost Gate reste une direction stratégique non commercialement validée. Un moteur de fondation isolé, `cost_gate_foundation/`, orchestre désormais des hypothèses manuelles ou `synthetic_demo` dans le seul périmètre compte cash, achat long, action/ETF au comptant.

Cette preuve technique produit des `findings[]`, réconcilie cash immédiat et coût du cycle, plafonne la faisabilité par l'allocation de stratégie et invalide les snapshots modifiés. Gate 1 l'expose maintenant dans un prototype `internal_review` hors ligne techniquement validé sur son head exact ; cela ne constitue ni une compréhension utilisateur démontrée, ni un produit validé, ni un moteur de données de marché, ni une lecture de compte réel.

Aucun compte utilisateur, stockage, réseau, donnée réelle, connexion courtier, recommandation ou exécution n'est implémenté.

## 8. Positionnement

Breaktest est une couche de **capital-efficiency intelligence** destinée à évoluer vers un **pre-trade cost and feasibility gate** explicable.

Ce n'est pas :

- un courtier ;
- un robo-advisor ;
- une application de signaux ;
- un journal de trading généraliste ;
- un comparateur sponsorisé opaque ;
- une certification ;
- un terminal institutionnel factice ;
- un simple totalisateur de frais.

## 9. Différenciation recherchée

À court terme :

- seuil brut et plancher variable ;
- analyse de survie de l'avantage ;
- sensibilité basse / centrale / haute sans fausse statistique ;
- contraintes inverses ;
- provenance et domaines de validité ;
- traitement local ;
- calculs auditables ;
- détection explicite des cas impossibles ;
- expérience accessible et progressive.

À long terme, uniquement après validation :

- dérivation de l'avantage depuis des historiques réels ;
- incertitude statistique adaptée aux données ;
- faisabilité du capital et positions simultanées ;
- contrôle pré-trade Cost Gate ;
- Data Quality Gate ;
- barèmes versionnés ;
- parseurs multi-courtiers ;
- historique d'Edge Survival ;
- benchmarks indépendants ;
- API et intégrations.

L'IA, l'interface et un calculateur isolé ne sont pas considérés comme des avantages défendables à eux seuls.

## 10. Livraison future

Les livrables remis à Ayman pour critique devront être :

- réellement interactifs ;
- utilisables hors ligne ;
- ouverts sans serveur lourd lorsque possible ;
- fournis en HTML autonome ou bundle ZIP local avec `index.html` ;
- accompagnés de la méthode, des preuves, des limites, du commit exact et des empreintes.

Les images restent des preuves visuelles, jamais le livrable principal.

## 11. Non-objectifs actuels

- recommandation d'achat, vente ou conservation ;
- choix automatique d'un courtier ;
- taille ou fréquence qualifiée d'optimale ;
- profilage de risque ;
- allocation personnalisée ;
- transmission ou exécution d'ordres ;
- ordre limite conseillé ;
- probabilité d'exécution ;
- regroupement temporel automatisé ;
- levier ou marge ;
- données temps réel payantes ;
- import réel dans le nouveau produit ;
- comptes et stockage persistant ;
- analytics, email ou paiement ;
- application native ;
- marketplace ou affiliation ;
- métriques statistiques avancées sans données suffisantes ;
- reprise automatique de H3 à H6.

## 12. Gates

### Avant fusion technique d'une PR

- contrats réconciliés ;
- oracles et invariants réussis ;
- égalités et tolérances cohérentes entre modes ;
- entrées annuelles réellement facultatives ;
- résultats obsolètes masqués ;
- provenance correcte ;
- Chromium aux largeurs prévues ;
- non-régression H1–H2/C1–C4 et Q0 ;
- fichiers canoniques synchronisés ;
- registre des angles morts mis à jour.

### Avant critique externe

- package HTML hors ligne testé sur sa version exacte ;
- Safari/iPad vérifié ;
- compréhension sans coaching ;
- aucune confusion entre hypothèse, prévision et conseil.

### Avant prototype Cost Gate

- noyau Edge Survival stabilisé ;
- utilité du diagnostic actuel observée ;
- contrat de faisabilité du capital validé ;
- états pré-trade non prescriptifs testés ;
- Data Quality Gate défini ;
- scénario synthétique manuel avant toute donnée externe.

### Avant donnée externe

- source, coût, licence et couverture vérifiés ;
- fraîcheur et fallback contractuels ;
- sécurité et confidentialité ;
- kill switch ;
- décision explicite d'Ayman.

### Avant développement commercial étendu

- révélation d'une contrainte économique nouvelle ;
- seconde utilisation ;
- demande d'import ou de suivi ;
- paiement réel ;
- automatisation suffisante ;
- valeur perçue supérieure au prix ;
- test capable de conduire à l'abandon.

La direction Cost Gate est stratégique et sa fondation synthétique est techniquement démontrée dans son domaine restreint. Cela ne prouve ni demande, ni précision sur données réelles, ni disponibilité des données, ni conformité réglementaire.
