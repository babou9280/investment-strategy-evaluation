# Breaktest — état actuel

## 1. Direction active

Le 13 juillet 2026, Ayman a validé le pivot vers **Breaktest Cost Intelligence** pour les petits et moyens portefeuilles.

Après critique des premiers prototypes, la direction a été raffinée en **Capital Efficiency** : le coût en euros devient explicatif ; le produit met en avant le seuil brut de couverture, le plancher variable, la marge nette, la part du rendement brut conservée et les contraintes économiques conditionnelles.

La phase active est la **revue interne du prototype progressif**, avant toute publication externe.

Documents de référence :

- `PRODUCT.md`, `QUALITY.md`, `STATE.md`, `DECISIONS.md`, `METHODOLOGY.md`, `AGENTS.md` ;
- `STRATEGY.md`, `MARKET_EVIDENCE.md`, `BUSINESS_MODEL.md`, `VALIDATION_PLAN.md` ;
- `docs/product/CAPITAL_EFFICIENCY_CORE.md` ;
- `docs/product/WORLD_CLASS_PLATFORM_THESIS.md` ;
- `docs/product/DIFFERENTIATION_AND_EVIDENCE_PLAN.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/validation/CAPITAL_EFFICIENCY_LAB.md` ;
- `docs/review/` ;
- `NEXT_CODEX_PROMPT.md`.

## 2. Calculateur Q0 construit mais non publié

La pull request `#16` a fusionné le calculateur descriptif `validation_site/` dans `breaktest-bootstrap` au commit `aadef6dec71a6882f9746ea4b2721ee91a3ee1f3`.

La pull request `#17` a ajouté la préparation de lancement et les contrôles d'intégrité, fusionnés au commit `3ffd20c845e0dcae8c7438fb866a18601ecc7ab3`.

Le site Q0 calcule correctement les coûts et le seuil, mais sa publication a été suspendue parce que sa valeur restait principalement descriptive.

## 3. Noyau Capital Efficiency fusionné

La pull request `#20` a été fusionnée par squash dans `breaktest-bootstrap` au commit :

`b68b0257e9ea506c98a607976bbdd9456c890dcc`.

Elle a ajouté `capital_efficiency_lab/` avec :

- seuil brut de couverture ;
- plancher variable ;
- séparation coût fixe / coût variable ;
- marge nette en taux et euros ;
- part du rendement brut absorbée et conservée ;
- taille frontière pour une marge positive ;
- taille frontière pour une rétention cible ;
- cas structurellement impossible ;
- traitement exact des coûts fixes nuls sans faux ordre recommandé à zéro ;
- fréquence frontière sous budget annuel ;
- rendement brut requis pour une marge nette cible ;
- sensibilité du seuil à la taille ;
- provenance et états indisponibles explicites.

Le head final de la pull request `3a9db5cfaaf7058482997a06d7faca20df01016a` a réussi le run GitHub Actions `29278815173` : build, oracles, invariants, intégrité, Chromium, syntaxe et non-régressions H1–H2/C1–C4 et Q0.

Le moteur validé est `capital-efficiency-lab-2`.

Cette validation est technique. Aucun utilisateur, paiement ou usage répété n'est validé.

## 4. Revue interne progressive active

Pull request active : `#21`, branche `strategy/capital-efficiency-internal-review`.

La revue hostile initiale a identifié un défaut principal : la première interface montrait simultanément toutes les hypothèses et toutes les contraintes, ce qui masquait la valeur sur mobile.

La correction implémentée organise désormais le parcours en trois étapes :

1. **calculer le seuil** avec les seules hypothèses de friction ;
2. **tester un rendement brut** facultatif, jamais prédit par Breaktest ;
3. **résoudre une seule contrainte** choisie par l'utilisateur.

Changements vérifiés :

- capital et fréquence placés dans une section annuelle facultative ;
- rendement brut placé dans une deuxième étape facultative ;
- une seule question avancée visible à la fois ;
- une seule contrainte rendue dans le résultat ;
- langage français concret avant le vocabulaire technique ;
- coût total visuellement secondaire ;
- méthode et limites repliables ;
- captures de revue à 390, 768 et 1 440 pixels.

Le head `cf4c50751565a05ca3760cc516567ebb46b2c4b4` a réussi le run GitHub Actions `29279747927`, incluant toutes les suites historiques, Q0, Capital Efficiency, Chromium, intégrité, syntaxe et captures visuelles.

L'inspection des captures confirme :

- hiérarchie nettement plus claire ;
- absence de débordement horizontal ;
- mode seuil autonome ;
- exemple complet mettant en avant `45 %` conservé, `0,90 %` de marge nette et une seule contrainte ;
- densité mobile réduite sans retrait de la substance financière.

Preuves internes :

- `docs/review/CAPITAL_EFFICIENCY_HOSTILE_REVIEW.md` ;
- `docs/review/PROGRESSIVE_EXPERIENCE_REVIEW.md` ;
- `docs/review/INTERNAL_USER_REVIEW_PROTOCOL.md`.

## 5. Build historique conservé

`app/Breaktest_Studio.html` demeure l'actif technique historique provisoire. Son build cumulatif H1, C2, C3, C1, C4 et H2 reste inchangé :

- SHA-256 après H2 : `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf` ;
- taille : 166 862 octets.

Le site Q0 et le laboratoire restent isolés de ce moteur.

## 6. Fonctionnalités réellement validées

### Moteur historique

- import/export, filtres et audit ;
- validation numérique stricte ;
- isolation temporelle ;
- turnover chronologique ;
- réservation du nominal ;
- trésorerie réalisée aux sorties ;
- bases observées et simulées séparées ;
- provenance et absence de double comptage dans les scénarios testés.

### Capital Efficiency

- contrat Edge Survival déterministe ;
- cas principal exact et réconcilié ;
- cas absent, nul, négatif, positif et inatteignable ;
- contraintes inverses ;
- limites à coût fixe nul ;
- budget annuel et cible nette ;
- monotonie et convergence ;
- parcours progressif responsive ;
- aucune recommandation, donnée réelle ou capacité réseau.

## 7. Développements suspendus

- publication externe ;
- H3 à H6 ;
- import réel ;
- comptes et stockage persistant ;
- données ou tarifs réels de courtiers ;
- analytics, email et paiement ;
- conseil, signaux et exécution ;
- application native ;
- marketplace, affiliation et API ;
- statistiques avancées sans données suffisantes.

## 8. Marché — état de preuve

### Établi

- les frictions peuvent absorber une prime brute ;
- le seuil, le plancher, la marge et les contraintes inverses sont calculables ;
- le prototype interne fonctionne et est techniquement contrôlé ;
- l'expérience progressive est plus claire que la première version selon l'inspection visuelle.

### Non validé

- compréhension réelle en moins de 90 secondes ;
- capacité de la cible à fournir un rendement brut défendable ;
- utilité réelle d'une contrainte inverse ;
- absence de confusion avec une recommandation ;
- seconde utilisation ;
- demande d'import ;
- paiement ;
- distribution et potentiel de plateforme.

## 9. Hébergement GitHub

- dépôt : `babou9280/investment-strategy-evaluation` ;
- branche produit : `breaktest-bootstrap` au commit `b68b0257e9ea506c98a607976bbdd9456c890dcc` ;
- pull request active : `#21` ;
- `main` reste inchangé et hors périmètre.

## 10. Prochaine exécution autorisée

1. obtenir une exécution verte sur le head documentaire final de la pull request `#21` ;
2. fusionner uniquement dans `breaktest-bootstrap` après revue finale ;
3. ne rien publier ;
4. préparer la version critique interne et le protocole de cinq participants ;
5. ne reprendre aucune extension de produit avant observations réelles et décision explicite.