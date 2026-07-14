# Breaktest — état actuel

## 1. Direction active

Ayman a validé successivement :

- **Breaktest Cost Intelligence** le 13 juillet 2026 ;
- son approfondissement en **Capital Efficiency / Edge Survival** ;
- la trajectoire future **Breaktest Cost Gate** le 14 juillet 2026.

Cost Gate est une direction stratégique de contrôle pré-trade personnalisé. Elle n'annule pas Cost Intelligence ni Edge Survival : elle devra les orchestrer avec la faisabilité du capital, la qualité des données, la liquidité et les contraintes explicitement fournies par l'utilisateur.

Cost Gate n'est ni implémenté, ni juridiquement validé, ni commercialement validé.

## 2. Phase active

La phase active est la clôture technique et documentaire de la pull request `#23`, branche `strategy/edge-survival-envelope`, vers `breaktest-bootstrap`.

La PR reste en brouillon. `main` est inchangé et hors périmètre.

Le travail couvre :

- cohérence point / fourchette ;
- égalités et tolérance ;
- entrées annuelles facultatives ;
- fraîcheur des résultats ;
- UX progressive ;
- accessibilité et responsive ;
- qualité des preuves visuelles ;
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

`validation_site/` est techniquement validé et gelé. Sa publication a été suspendue parce que sa valeur restait principalement descriptive.

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

La PR `#23` stabilise :

- modes seuil, point et fourchette ;
- hypothèses basse / centrale / haute ;
- états de survie et de traversée ;
- cohérence point / fourchette ;
- définition stricte de l'avantage brut ;
- capital et fréquence facultatifs ;
- suppression des résultats obsolètes ;
- formulaire initial neutre ;
- skip link et navigation clavier ;
- contrat de faisabilité du capital futur ;
- registre permanent des angles morts ;
- standard de livraison HTML hors ligne.

Le head fonctionnel exact inspecté est :

`714e9628e893d419474c00a9c982f25492b7a164`

Il a réussi GitHub Actions :

- run `29330727579` (`#540`) ;
- conclusion `success` ;
- artefact `breaktest-validation-logs` ;
- digest `sha256:ba78f49b8f39ae270ffa30864ae8498a148d3157d8c8f09c040cec3ae3b6c1e2`.

Le run couvre H1–H2, C1–C4, Q0, Capital Efficiency, matrice synthétique, Edge Range, cohérence point/range, entrées annuelles facultatives, intégrité locale, Chromium et captures.

## 4. Défauts récents découverts et corrigés

### Égalité exacte au seuil

Le moteur produisait correctement une marge nulle, mais la phrase principale affirmait à tort que les frictions n'étaient pas couvertes.

Correction :

```text
Aucune hypothèse ne produit de marge positive
```

La régression est protégée par oracle numérique, test navigateur et captures inspectées.

### Résultat devenu obsolète

Un résultat pouvait rester visible après modification d'une entrée. La couche dédiée `result_freshness.js` le masque et demande un nouveau calcul.

Une duplication accidentelle de cette responsabilité dans `app.js` a été détectée puis supprimée.

### Preuve visuelle trompeuse

Les captures Chromium pleine page pouvaient répéter le skip link ou déplacer le header sticky pendant l'assemblage des tuiles.

Le générateur applique désormais des overrides strictement limités à la capture. Le vrai skip link reste contrôlé séparément au clavier.

## 5. Direction Cost Gate documentée

Documents de référence :

- `docs/product/COST_GATE_DIRECTION.md` ;
- `docs/standards/COST_GATE_METHOD_CONTRACT.md` ;
- `STRATEGY.md` ;
- `PRODUCT.md` ;
- `DECISIONS.md`, D034 ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `AGENTS.md` ;
- `docs/governance/BLIND_SPOT_REGISTER.md`.

Cost Gate devra confronter un trade envisagé :

- aux frictions ;
- au cash réellement disponible et au nominal réservé ;
- à la taille proposée ;
- à la liquidité et aux conditions de marché ;
- aux paramètres utilisateur explicitement fournis ;
- à un avantage brut ou une fourchette alignés avec l'instrument, l'horizon et le scénario ;
- à un Data Quality Gate.

États analytiques internes envisagés :

```text
compatible_under_assumptions
adjustment_required
structurally_non_viable
capital_not_feasible
execution_cost_risk
insufficient_data
```

Ces identifiants ne doivent pas être affichés bruts comme feu vert, verdict ou autorisation d'ordre.

## 6. Data Quality Gate futur

Aucune conclusion utilisant une donnée externe sans contrôle visible de :

- source et licence ;
- timestamp, fuseau et fraîcheur ;
- instrument, place et devise ;
- couverture ;
- provenance ;
- valeurs manquantes ou conflictuelles ;
- incertitude ;
- fallback et kill switch.

Aucune donnée externe, source temps réel ou connexion courtier n'est active.

## 7. Ce qui est réellement validé

### Validé techniquement

- moteur historique H1–H2/C1–C4 ;
- calculateur Q0 ;
- noyau Capital Efficiency ;
- parcours progressif ;
- Edge Survival Envelope sur le head fonctionnel cité ;
- égalité exacte au seuil ;
- fraîcheur des résultats ;
- intégrité locale ;
- absence de capacités réseau dans les prototypes testés ;
- captures internes corrigées et inspectées.

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
- capacité à fournir un avantage brut défendable ;
- faisabilité complète du capital ;
- données de marché ;
- Data Quality Gate exécuté ;
- précision pré-trade ;
- cadre juridique de Cost Gate ;
- personnalisation réglementairement acceptable ;
- ordre limite, probabilité d'exécution ou exécution ;
- Safari/iPad du futur package ;
- package HTML de critique.

## 8. Travaux suspendus

- publication et déploiement ;
- H3 à H6 ;
- import réel ;
- comptes et stockage ;
- données ou tarifs réels ;
- réseau applicatif ;
- analytics, email et paiement ;
- connexion courtier ;
- marketplace, affiliation et API ;
- recommandation, conseil, signaux et exécution ;
- statistiques avancées sans données suffisantes ;
- code Cost Gate avant une mission isolée et ses gates.

## 9. Angles morts prioritaires

Le registre actif couvre notamment :

- avantage brut indisponible, instable ou mal aligné ;
- frictions manquantes ou tarif conditionnel mal appliqué ;
- frontières prises pour recommandations ;
- capital de référence confondu avec cash libre ;
- ordres en attente et cash non réglé ;
- donnée stale ;
- instrument, place ou devise mal réconciliés ;
- profondeur ne garantissant pas l'exécution ;
- exécution partielle ;
- coût et licence des flux ;
- faux sentiment de sécurité ;
- personnalisation glissant vers le conseil ;
- responsabilité en cas d'erreur ;
- confidentialité des intentions d'ordre ;
- concurrence gratuite ;
- crédibilité du travail assisté par IA.

Source : `docs/governance/BLIND_SPOT_REGISTER.md`.

## 10. Livrable futur

Le prochain livrable remis à Ayman pour critique sera :

- un HTML autonome interactif ou un ZIP local avec `index.html` ;
- utilisable hors ligne ;
- sans dépendance distante ;
- accompagné de méthode, preuves, limites, version et SHA-256 ;
- testé sur le package exact ;
- vérifié sur Safari/iPad lorsque possible.

Les captures restent des preuves de test, pas le produit remis.

## 11. Prochaine séquence autorisée

1. obtenir une exécution verte sur le head documentaire final de la PR `#23` ;
2. vérifier qu'aucun fichier hors périmètre n'a changé ;
3. fusionner uniquement vers `breaktest-bootstrap` si les preuves restent cohérentes ;
4. ne rien publier ;
5. préparer ensuite une mission isolée pour le noyau conceptuel Cost Gate et le futur package HTML ;
6. ne connecter aucune donnée réelle avant les gates de qualité, droit, coût et utilité.

Aucune action d'Ayman n'est requise tant qu'une décision stratégique, juridique, coûteuse, irréversible ou externe n'apparaît pas.