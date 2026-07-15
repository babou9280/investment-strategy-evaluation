# Breaktest — état actuel

## 1. Direction active

Ayman a validé :

- **Breaktest Cost Intelligence** le 13 juillet 2026 ;
- son approfondissement en **Capital Efficiency / Edge Survival** ;
- **Breaktest Cost Gate**, contrôle pré-trade personnalisé, le 14 juillet 2026.

Cost Gate n'annule pas Cost Intelligence ni Edge Survival. Il doit les orchestrer avec la faisabilité du cash, la qualité des données, le risque de coût d'exécution et les contraintes explicitement fournies par l'utilisateur.

Cost Gate est validé stratégiquement. Sa fondation synthétique est fonctionnelle dans un domaine technique restreint ; le produit connecté, l'interface, les données réelles, le droit et le marché ne sont pas validés.

## 2. État GitHub

La pull request `#23` — Edge Survival Envelope — a été fusionnée par squash dans `breaktest-bootstrap` :

```text
merge commit = 5f1281b49fde9363dcb38e0225a5d48d34589475
exact head = 2c9663b1325b23e11b3ca1c855fe7f320f8e6595
GitHub Actions = 29331537069 (#556)
conclusion = success
```

`main` reste inchangé au commit `6e8c8e801e9821fe212651d684c8fad75dc6abee` et hors périmètre.

Nouvelle branche active :

```text
strategy/cost-gate-foundation
```

Pull request active : `#24`, ouverte, fusionnable et laissée en brouillon. Sa base est `breaktest-bootstrap` au commit `5f1281b49fde9363dcb38e0225a5d48d34589475`.

Les versions `1` et `2` restent historiquement prouvées par les runs `#608` à `#614`. Les neuf fils de revue inline ont été résolus après vérification des corrections, des heads exacts et des artefacts. Une dernière revue automatisée a été demandée sur `6cfc43e4bbb015c8512c0ae26aad02d04503c897`, mais n'a pas été exécutée faute de quota.

La revue hostile indépendante a ensuite révélé quatre défauts adjacents : contrôle même devise/FX dépendant du cash, friction encore qualifiée complète malgré une taxe ou un frais d'entrée absent du cycle, heure d'évaluation invalide laissant le snapshot paraître actuel, et identité ou caractère critique de source incomplets. Elle a aussi verrouillé le risque de contradiction entre source stale et constat positif d'actualité globale.

La révision `cost-gate-foundation-3-synthetic` est prouvée à distance :

```text
functional head = 753152d9cce1feabba48e54b32b4eed2ce3f5e07
tree = 574ec387391a995cec167149cc099e87c1f92c02
GitHub Actions = 29345208179 (#616)
conclusion = success
artifact = 8315786779
digest = sha256:67b4603cfd95271a4916ee04e36ed229cb352a6526b0a25f40fd1089dcb8b614
```

Les dix blobs de cette révision correspondent au tree distant. Les jobs, logs et l'archive ont été inspectés. Les 24 captures sont identiques à la preuve précédente ; les vues 390 et 1 440 px ont été réellement ouvertes et restent sans débordement, coupure, header dupliqué ni lien d'évitement parasite. La synchronisation documentaire version `3` doit encore réussir sur son propre head exact.

La phase reste synthétique : moteur local isolé, contrats, revue hostile et preuves. Aucune donnée externe, interface Cost Gate ou publication.

## 3. Actifs validés techniquement

### Moteur historique

`app/Breaktest_Studio.html` conserve :

- H1 et H2 ;
- C1 à C4 ;
- isolation temporelle ;
- turnover chronologique ;
- réservation du nominal ;
- trésorerie réalisée aux sorties ;
- bases observées et simulées séparées.

Build historique :

```text
taille = 166 862 octets
SHA-256 = dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf
```

### Q0 Cost Intelligence

`validation_site/` est techniquement validé et gelé. Sa publication reste suspendue car sa valeur était principalement descriptive.

### Capital Efficiency et Edge Survival

Sont techniquement validés dans le périmètre synthétique documenté :

- seuil brut ;
- plancher variable ;
- coûts fixes et variables ;
- marge nette ;
- absorption et rétention ;
- contraintes inverses ;
- impossibilité structurelle ;
- point et fourchette basse/centrale/haute ;
- cohérence point/fourchette ;
- capital et fréquence facultatifs ;
- résultat obsolète masqué ;
- exact seuil sans fausse marge positive ;
- formulaire neutre ;
- accessibilité clavier ;
- responsive Chromium ;
- intégrité locale.

La fusion de la PR `#23` valide techniquement ce périmètre. Elle ne prouve ni compréhension réelle, ni utilité, ni marché.

## 4. Défauts rétrospectifs corrigés avant fusion

- texte faux à l'égalité exacte au seuil ;
- résultat ancien restant visible après modification ;
- duplication accidentelle de la logique d'invalidation ;
- artefacts de skip link et header sticky dans les captures full-page ;
- preuve visuelle séparée du comportement clavier réel.

Chaque correction possède un test ou une preuve correspondante.

## 5. Fondation Cost Gate en cours

Documents déjà présents ou ajoutés :

- `docs/product/COST_GATE_DIRECTION.md` ;
- `docs/product/COST_GATE_MVP_GATE_MATRIX.md` ;
- `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md` ;
- `docs/standards/COST_GATE_METHOD_CONTRACT.md` ;
- `docs/standards/COST_GATE_PERSONALIZATION_BOUNDARY.md` ;
- `docs/standards/COST_GATE_SNAPSHOT_CONTRACT.md` ;
- `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- `docs/standards/COST_GATE_FINDINGS_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_ALIGNMENT_KEY.md` ;
- `docs/scenarios/COST_GATE_FOUNDATION_MATRIX.md` ;
- `docs/tasks/COST_GATE_FOUNDATION.md` ;
- `docs/validation/COST_GATE_FOUNDATION.md`.

La fondation impose notamment :

- personnalisation limitée aux contraintes explicites ;
- aucun profil de risque ou suitability implicite ;
- snapshot versionné et invalidé à chaque changement ;
- donnée stale ou conflictuelle non utilisée comme actuelle ;
- cash réglé distinct du capital de référence ;
- coût du cycle distinct du besoin de cash immédiat ;
- prix mid/ask/exécuté et spread incorporé explicitement distingués ;
- constats multiples conservés ;
- aucune synthèse transformée en feu vert ;
- périmètre initial cash long, actions et ETF au comptant ;
- instruments, marge, short et dérivés non supportés au premier stade.

Le moteur `cost_gate_foundation/` exécute maintenant ce contrat pour des hypothèses manuelles ou `synthetic_demo`. Il réutilise le moteur Capital Efficiency sans le modifier.

La revue hostile a aussi imposé :

- plafonnement par le minimum entre cash réglé réconcilié et allocation libre de stratégie ;
- ledger de holds par identifiant, sans second retrait d'un montant déjà inclus par la source ;
- séparation entre hash de contenu et identifiant d'instance ;
- réconciliation quantité × prix × devise ;
- rejet d'une performance issue de prix exécutés comme brut avant friction sans reconstruction ;
- priorité des constats dépendante de leurs preuves.

La stabilisation rétrospective ajoute :

- cohérence obligatoire entre `entry_leg`/un côté et `complete_round_trip`/deux côtés ;
- ordre canonique des holds, sources, contraintes et exclusions ;
- inactivation des anciens constats dès l'expiration ;
- coexistence des constats stale et conflit ;
- calcul indépendant du cash malgré une erreur dans la friction ;
- synthèse distincte pour un avantage absorbé, sans inventer une contrainte utilisateur.

## 6. Matrice synthétique

`docs/scenarios/COST_GATE_FOUNDATION_MATRIX.md` définit 18 scénarios, notamment :

- seuil sans avantage ;
- avantage positif et cash suffisant ;
- égalité exacte au seuil ;
- avantage sous le plancher ;
- avantage survivant mais cash insuffisant ;
- frais de sortie exclus du cash immédiat ;
- spread déjà incorporé au prix ;
- base de nominal conflictuelle ;
- quote stale ;
- conflit instrument/place/devise ;
- avantage brut mal aligné ;
- plusieurs violations simultanées ;
- snapshot invalidé ;
- ordre en attente ;
- modèle non supporté ;
- sous-calcul utile malgré donnée manquante.

Ces scénarios sont exécutés par `cost_gate_foundation/tests/scenario_matrix.test.js` et ont réussi sur le head fonctionnel et le run exact cités ci-dessus.

## 7. Ce qui est validé

### Stratégiquement

- Cost Intelligence ;
- Capital Efficiency ;
- Cost Gate comme trajectoire pré-trade ;
- livrables HTML hors ligne ;
- recherche permanente des angles morts.

### Techniquement

- moteur historique H1–H2/C1–C4 ;
- Q0 ;
- Capital Efficiency ;
- Edge Survival Envelope fusionné ;
- Cost Gate foundation version `3`, CG-01 à CG-18 et régressions rétrospectives, exécutée sur le head fonctionnel exact `753152d9` dans le périmètre cash long déclaré ;
- absence de réseau et persistance dans les prototypes contrôlés.

## 8. Ce qui n'est pas validé

- produit ou interface Cost Gate ;
- moteur Cost Gate sur donnée, compte ou ordre réels ;
- données de marché ;
- Data Quality Gate exécuté ;
- snapshot réel ;
- faisabilité réelle d'un compte ;
- précision pré-trade ;
- personnalisation juridiquement acceptable ;
- compréhension sans coaching ;
- usage répété ;
- paiement ;
- coût et licence des données ;
- comparaison ex ante/ex post ;
- Safari/iPad du futur package ;
- package HTML de critique.

## 9. Angles morts prioritaires

Le registre couvre notamment :

- avantage brut absent, fragile ou mal aligné ;
- frictions omises ;
- tarif conditionnel mal appliqué ;
- capital confondu avec cash réglé ;
- cash du compte contournant une allocation de stratégie plus basse ;
- ordres en attente et réservations ;
- hold déjà retranché puis déduit une seconde fois ;
- frais de sortie confondus avec cash immédiat ;
- spread compté deux fois ;
- donnée stale ;
- identité de snapshot circulaire ou dépendante de l'heure du recalcul ;
- mapping instrument/place/devise ;
- exécution partielle ;
- profondeur ne garantissant pas l'exécution ;
- personnalisation glissant vers le conseil ;
- coût et licence des flux ;
- confidentialité des intentions d'ordre ;
- responsabilité et incident ;
- substitution gratuite par un courtier ;
- crédibilité du travail assisté par IA.

Source : `docs/governance/BLIND_SPOT_REGISTER.md`.

## 10. Travaux suspendus

- publication et déploiement ;
- H3 à H6 ;
- import réel ;
- compte et stockage ;
- réseau ;
- donnée ou tarif réel ;
- broker ou fournisseur ;
- analytics, email et paiement ;
- marketplace, affiliation et API ;
- recommandation, conseil, signal ou exécution ;
- levier, marge, short et dérivés ;
- probabilité d'exécution ;
- interface Cost Gate finale.

## 11. Livrable futur

Le prochain livrable de critique sera un HTML autonome interactif ou un ZIP local avec `index.html`, utilisable hors ligne, avec :

- moteur réellement validé ;
- méthode et preuves ;
- limites ;
- versions ;
- manifeste et SHA-256 ;
- tests sur le package exact ;
- vérification Safari/iPad lorsque possible.

Les captures restent des preuves, pas le produit remis.

## 12. Prochaine séquence

1. pousser la synchronisation documentaire de la version `3` dans la PR `#24` ;
2. exécuter et inspecter la validation exact-head de cette synchronisation ;
3. mettre à jour la preuve de PR et vérifier qu'aucun fil de revue n'est rouvert ;
4. conserver la PR en brouillon, sans fusion ni publication, jusqu'à l'accord explicite d'Ayman ;
5. après clôture séparée de la fondation, ouvrir une mission distincte pour le HTML hors ligne de critique ; aucune donnée externe avant les gates utilisateur, juridique, économique et qualité.

Aucune action d'Ayman n'est requise actuellement.
