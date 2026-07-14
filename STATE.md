# Breaktest — état actuel

## 1. Direction active

Ayman a validé successivement :

- **Breaktest Cost Intelligence** le 13 juillet 2026 ;
- son approfondissement en **Capital Efficiency / Edge Survival** ;
- la trajectoire future **Breaktest Cost Gate** le 14 juillet 2026.

Cost Gate est une direction stratégique pré-trade. Elle n'annule pas Cost Intelligence ni Edge Survival : elle devra les orchestrer avec la faisabilité du capital, la liquidité et un Data Quality Gate.

Cette direction n'est ni implémentée, ni juridiquement validée, ni commercialement validée.

## 2. Phase active

La phase active reste la stabilisation interne de la pull request `#23`, branche `strategy/edge-survival-envelope`, vers `breaktest-bootstrap`.

La PR reste en brouillon. `main` est inchangé et hors périmètre.

Le travail actuel porte sur :

- cohérence point / fourchette ;
- égalités et tolérance ;
- entrées annuelles facultatives ;
- fraîcheur des résultats ;
- UX progressive ;
- accessibilité et responsive ;
- non-régressions ;
- synchronisation canonique ;
- recherche permanente des angles morts.

## 3. État des actifs

### Moteur historique

`app/Breaktest_Studio.html` reste l'actif historique provisoire.

Validation conservée :

- H1 et H2 ;
- C1 à C4 ;
- isolation temporelle ;
- turnover chronologique ;
- réservation du nominal ;
- trésorerie réalisée aux sorties ;
- bases observées et simulées séparées.

Build historique H2 :

- taille : `166 862` octets ;
- SHA-256 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf`.

### Calculateur Q0

`validation_site/` est techniquement validé et gelé. Sa publication a été suspendue parce que sa valeur restait trop descriptive.

### Capital Efficiency

La PR `#20` a fusionné le noyau au commit `b68b0257e9ea506c98a607976bbdd9456c890dcc`.

Fonctions validées techniquement :

- seuil brut ;
- plancher variable ;
- coût fixe et variable ;
- marge nette ;
- absorption et rétention ;
- contraintes inverses ;
- cas structurellement impossible ;
- coûts fixes nuls ;
- budget annuel ;
- cible nette ;
- monotonie et convergence.

### Edge Survival Envelope

La PR `#23` ajoute et stabilise :

- modes seuil, point et fourchette ;
- basse / centrale / haute ;
- états de survie et de traversée ;
- cohérence point / fourchette ;
- définition stricte de l'avantage brut ;
- capital et fréquence facultatifs ;
- suppression des résultats obsolètes ;
- formulaire initial neutre ;
- contrats de faisabilité du capital futurs ;
- registre des angles morts ;
- standard de livraison HTML hors ligne.

Le dernier head technique entièrement vert avant la synchronisation Cost Gate est `2e9703280667a29e30fa55f62dc70c7ec4519255`, run GitHub Actions `29294107398` (`#502`).

Les commits documentaires Cost Gate exigent une nouvelle exécution exacte-head avant toute fusion.

## 4. Direction Cost Gate documentée

Documents ajoutés ou mis à jour :

- `docs/product/COST_GATE_DIRECTION.md` ;
- `docs/standards/COST_GATE_METHOD_CONTRACT.md` ;
- `STRATEGY.md` ;
- `PRODUCT.md` ;
- `DECISIONS.md` avec D034 ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `AGENTS.md` ;
- `docs/governance/BLIND_SPOT_REGISTER.md`.

Cost Gate devra, à terme, confronter un trade envisagé :

- aux frictions ;
- au capital et cash libres ;
- au nominal réservé ;
- à la taille proposée ;
- à la liquidité et aux conditions de marché ;
- aux paramètres utilisateur ;
- à un avantage brut ou une fourchette explicitement fournis.

États analytiques de travail :

```text
compatible_under_assumptions
adjustment_required
structurally_non_viable
capital_not_feasible
execution_cost_risk
insufficient_data
```

Ils ne constituent pas une recommandation.

## 5. Data Quality Gate futur

Aucune conclusion utilisant une donnée externe sans contrôle visible de :

- source et licence ;
- timestamp, fuseau et fraîcheur ;
- instrument, place et devise ;
- couverture ;
- provenance ;
- valeurs manquantes ou conflictuelles ;
- incertitude ;
- fallback et kill switch.

Aucune donnée externe, source temps réel ou connexion courtier n'est actuellement active.

## 6. Ce qui est réellement validé

### Validé techniquement

- moteur historique H1–H2/C1–C4 ;
- calculateur Q0 ;
- noyau Capital Efficiency ;
- parcours progressif antérieur ;
- Edge Survival Envelope sur le dernier head technique vert cité ;
- intégrité locale et absence de capacités réseau dans les prototypes testés.

### Validé stratégiquement

- Cost Intelligence ;
- Capital Efficiency comme proposition de valeur ;
- livrables HTML hors ligne ;
- revue multidisciplinaire permanente des angles morts ;
- Cost Gate comme trajectoire pré-trade.

### Non validé

- demande commerciale ;
- compréhension réelle sans coaching ;
- seconde utilisation ;
- paiement ;
- import réel ;
- capacité à fournir un avantage brut ;
- faisabilité du capital ;
- données de marché ;
- Data Quality Gate exécuté ;
- précision pré-trade ;
- cadre juridique de Cost Gate ;
- ordre limite, probabilité d'exécution ou exécution ;
- Safari/iPad du futur package ;
- package HTML final.

## 7. Travaux suspendus

- publication ;
- déploiement ;
- H3 à H6 ;
- import réel ;
- compte et stockage ;
- données ou tarifs réels ;
- réseau applicatif ;
- analytics, email et paiement ;
- connexion courtier ;
- marketplace, affiliation et API ;
- recommandation, conseil, signaux et exécution ;
- statistiques avancées sans données suffisantes ;
- code Cost Gate hors prototype synthétique futur autorisé.

## 8. Angles morts prioritaires

Le registre actif couvre notamment :

- avantage brut indisponible ou mal défini ;
- frictions manquantes ;
- frontières prises pour recommandations ;
- capital de référence confondu avec cash libre ;
- donnée stale ;
- instrument, place ou devise mal réconciliés ;
- profondeur ne garantissant pas l'exécution ;
- coût des flux ;
- faux sentiment de sécurité ;
- responsabilité en cas d'erreur ;
- confidentialité des intentions d'ordre ;
- concurrence gratuite ;
- crédibilité du travail assisté par IA.

Source : `docs/governance/BLIND_SPOT_REGISTER.md`.

## 9. Livrable futur

Le prochain livrable remis à Ayman pour critique sera :

- un HTML autonome interactif ou un ZIP local avec `index.html` ;
- utilisable hors ligne ;
- sans dépendance distante ;
- accompagné de méthode, preuves, limites, version et SHA-256 ;
- testé sur le package exact ;
- vérifié sur Safari/iPad lorsque possible.

Les captures restent des preuves de test, pas le produit remis.

## 10. Prochaine séquence autorisée

1. terminer les contrôles exact-head de la PR `#23` ;
2. corriger toute régression issue de la synchronisation documentaire ;
3. inspecter les artefacts et captures ;
4. synchroniser les preuves de validation ;
5. fusionner uniquement vers `breaktest-bootstrap` si tout est cohérent ;
6. ne rien publier ;
7. préparer ensuite la critique HTML hors ligne du noyau actuel ;
8. ne commencer un prototype Cost Gate synthétique qu'après le gate utilisateur et une mission isolée.

Aucune action d'Ayman n'est requise tant qu'une décision stratégique, juridique, coûteuse, irréversible ou externe n'apparaît pas.