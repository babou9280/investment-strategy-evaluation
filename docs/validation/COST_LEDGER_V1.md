# Validation — Cost Ledger v1

## 1. Statut courant

- Périmètre : moteur analytique isolé, adaptateur legacy, enveloppe synthétique et contrats.
- Version moteur : `cost-ledger-engine-1-synthetic`.
- Schéma : `cost-ledger-1`.
- Politique de compatibilité : `legacy-four-costs-1`.
- Interface : aucune modification fonctionnelle.
- Données : manuelles ou synthétiques uniquement.
- État de preuve : exécution locale réussie pour les tests numériques, contractuels, de propriétés, de syntaxe et d'intégrité ; preuve GitHub exact-head et artefact encore à établir.

Cette preuve ne rouvre pas la cohorte Gate 1.

## 2. Actifs

- `cost_gate_model_vnext/ledger.js` ;
- `cost_gate_model_vnext/tests/ledger.test.js` ;
- `cost_gate_model_vnext/tests/properties.test.js` ;
- `cost_gate_model_vnext/tests/scenario_matrix.test.js` ;
- `cost_gate_model_vnext/tests/static_integrity.py` ;
- `docs/standards/COST_LEDGER_CONTRACT.md` ;
- `docs/scenarios/COST_LEDGER_V1_MATRIX.md` ;
- `docs/product/COST_GATE_MODEL_ARCHITECTURE_VNEXT.md`.

## 3. Résultats locaux réellement exécutés

Le 16 juillet 2026 :

```text
Cost Ledger v1 contract tests: PASS
Cost Ledger v1 frozen scenario matrix: PASS (CL-01 to CL-31 registered)
Cost Ledger v1 property tests: PASS (10 parity cases)
Cost Ledger v1 static integrity: PASS
```

Les suites numériques et statiques préexistantes ont aussi réussi après ajout du ledger : H1, H2, Cost Intelligence, Capital Efficiency, Cost Gate foundation et Cost Gate critique.

La tentative locale des régressions navigateur n'a pas produit de résultat fonctionnel : Python Playwright a été installé dans un environnement temporaire, mais aucun exécutable Chromium utilisable n'était disponible et son téléchargement a été bloqué par l'environnement. Aucun échec produit n'est déduit de cette limite. Les suites navigateur restent à exécuter dans GitHub Actions sur le head exact.

Le contrôle local `package_integrity.py` dépend d'un package reconstruit avec le SHA Git exact. Il reste réservé au build GitHub exact-head afin de ne pas commettre un artefact généré depuis un head local différent du head distant.

## 4. Oracles numériques indépendants

Aller-retour de référence :

```text
N = 500 EUR
commission = 2 × 1 EUR = 2 EUR
taux proportionnel = 2 × 0,0025 + 0,001 + 0,001 = 0,007
coût proportionnel = 500 × 0,007 = 3,50 EUR
coût total = 5,50 EUR
seuil = 5,50 / 500 = 1,10 %
plancher variable = 0,70 %
```

Jambe d'entrée :

```text
coût total = 1 + 500 × (0,0025 + 0,001 + 0,001) = 3,25 EUR
seuil = 0,65 %
```

Sensibilité synthétique du coût d'exécution :

```text
total bas / central / haut = 5,25 / 5,50 / 6,00 EUR
seuil bas / central / haut = 1,05 % / 1,10 % / 1,20 %
```

La fourchette est explicitement non probabiliste.

## 5. Propriétés démontrées localement

- parité exacte des coûts fixes, proportionnels, totaux, seuils et planchers sur dix cas legacy ;
- parité des sous-totaux lorsque chaque composante legacy est retirée tour à tour ;
- ordre des composants sans effet sur le hash ou l'agrégat ;
- zéro explicite distinct d'une absence ;
- politique déclarée distincte de la couverture effectivement satisfaite ;
- doublons de représentation et d'événement économique refusés ;
- montant brut calculable séparé des inclusions prix, avantage et cash ;
- catégorie ou forme réservée non approximée ;
- monotonie des coûts ;
- enveloppe ordonnée ;
- plancher structurel publié uniquement avec comportement d'échelle prouvé ;
- hash modifié par toute mutation économique testée ;
- aucun nombre non fini ni `-0` dans les sorties.

## 6. Limites non levées

- `complete_under_declared_policy` ne prouve pas que la politique contient tous les coûts réels ;
- l'identité économique dépend encore de la qualité des `economicEventId` fournis ;
- les hypothèses de spread et d'exécution n'ont aucun benchmark de marché ;
- aucun modèle d'impact, fill, délai ou coût d'opportunité n'est implémenté ;
- aucune donnée externe ou actuelle n'est utilisée ;
- aucune surface taille × coût × avantage n'est encore intégrée au produit ;
- aucune compréhension, utilité, demande, conformité ou volonté de payer n'est validée.

## 7. Preuve distante à compléter

Avant de considérer cette tranche techniquement validée :

- pousser réellement les fichiers sur la branche de la PR `#26` ;
- vérifier le nouveau head distant ;
- inspecter le run GitHub Actions attaché à ce head exact ;
- contrôler les logs numériques, statiques, navigateur, build et syntaxe ;
- inspecter l'artefact et les captures de non-régression ;
- inscrire ici les identifiants et limites réellement observés.
