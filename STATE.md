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

`main` reste inchangé et hors périmètre.

Nouvelle branche active :

```text
strategy/cost-gate-foundation
```

Pull request active : `#24`, laissée en brouillon.

Preuve fonctionnelle Cost Gate :

```text
functional head = cfa88e861c2ad0715b183af2bac2368a2d7bbdb4
GitHub Actions = 29334708343 (#604)
conclusion = success
artifact = 8311484443
digest = sha256:f95dfd83ba47ca1b1896dece5259a0831db96ff7156d0e194088fb40e6a24b46
```

Dernier head documentaire synchronisé :

```text
head = be6aa09d2b87bb07bd19258f393b496e522580a1
GitHub Actions = 29335825348 (#606)
conclusion = success
artifact = 8311933256
digest = sha256:13f4dc9fbd1add1252d85a88094cc8675152b47c4e61cdb99629efa242010030
```

Une revue automatisée demandée sur ce head exact a révélé trois défauts rétrospectifs : une erreur de friction pouvait masquer un constat cash indépendant, l'expiration pouvait laisser les anciens constats actifs à hash inchangé, et une source stale pouvait masquer un conflit instrument/place/devise. L'audit adjacent a aussi détecté une incohérence possible entre portée et nombre de côtés, un hash sensible à l'ordre d'ensembles économiques et une synthèse attribuant à tort un avantage absorbé à une contrainte utilisateur.

La révision `cost-gate-foundation-1-synthetic` corrige ces causes et ajoute leurs régressions. Elle est désormais prouvée à distance :

```text
functional head = 2ebf0e3e37852e4f3252e54149e147aa0d5712c3
GitHub Actions = 29338189190 (#608)
conclusion = success
artifact = 8312898043
digest = sha256:c22d2973aefe1c4d2cbef06cbae12ad67a6b08342c413e0198622078752d9183
```

Les 25 blobs poussés correspondent aux fichiers testés localement. Les logs, l'archive et les captures 390/1 440 px ont été inspectés. La synchronisation documentaire de cette preuve doit encore réussir sur son propre head exact avant de traiter les fils de revue.

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
- Cost Gate foundation version `1`, CG-01 à CG-18 et régressions rétrospectives, exécutée sur le head fonctionnel exact dans le périmètre cash long déclaré ;
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

1. synchroniser la documentation avec la preuve distante de la version `1` dans la PR `#24` ;
2. exécuter la validation exact-head de cette synchronisation ;
3. traiter puis résoudre les trois nouveaux commentaires de revue uniquement après ce dernier run ;
4. conserver la PR en brouillon, sans fusion ni publication ;
5. après clôture séparée de la fondation, ouvrir une mission distincte pour le HTML hors ligne de critique ;
6. aucune donnée externe avant les gates utilisateur, juridique, économique et qualité.

Aucune action d'Ayman n'est requise actuellement.
