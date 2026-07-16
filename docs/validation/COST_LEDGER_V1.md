# Validation — Cost Ledger v1

## 1. Statut courant

- Périmètre : moteur analytique isolé, adaptateur legacy, enveloppe synthétique et contrats.
- Version moteur : `cost-ledger-engine-1-synthetic`.
- Schéma : `cost-ledger-1`.
- Politique de compatibilité : `legacy-four-costs-1`.
- Interface : aucune modification fonctionnelle.
- Données : manuelles ou synthétiques uniquement.
- État de preuve : tranche initiale validée sur `df3ff7fc970c7a2d1030ceea9e7473fcf79fb0f5`, puis contrat renforcé et lié au contexte économique sur le head fonctionnel distant exact `fbc0d545b3ceff69dca9ceda00bc4f30e92c98ec` ; artefacts, journaux et captures inspectés.

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
Cost Ledger v1 frozen scenario matrix: PASS (CL-01 to CL-38 registered)
Cost Ledger v1 property tests: PASS (10 parity cases)
Cost Ledger v1 static integrity: PASS
```

Les suites numériques et statiques préexistantes ont aussi réussi après ajout du ledger : H1, H2, Cost Intelligence, Capital Efficiency, Cost Gate foundation et Cost Gate critique.

La tentative locale des régressions navigateur n'a pas produit de résultat fonctionnel : Python Playwright a été installé dans un environnement temporaire, mais aucun exécutable Chromium utilisable n'était disponible et son téléchargement a été bloqué par l'environnement. Aucun échec produit n'en a été déduit. Les suites navigateur ont ensuite réussi dans GitHub Actions sur le head fonctionnel exact.

Le contrôle local `package_integrity.py` dépend d'un package reconstruit avec le SHA Git exact. Il a donc été réservé au build GitHub exact-head afin de ne pas commettre un artefact généré depuis un head local différent du head distant ; il y a réussi.

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
- dénominateur réconcilié à sa base, y compris avec coûts fixes seuls ;
- dépendances non vides refusées tant que leur sémantique n'existe pas ;
- `edgeInclusion = not_applicable` refusé pour un coût ;
- contexte instrument/place/horizon conservé et hashé ;
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

## 7. Preuve distante exécutée

Preuve fonctionnelle du 16 juillet 2026 :

- head : `df3ff7fc970c7a2d1030ceea9e7473fcf79fb0f5` ;
- tree : `8f90cedc5bf9918a79c75557311448f5b9aeae12` ;
- run : `29526270376` (`#650`), job `87715371308`, `success` ;
- artefact : `8386829836`, 8 864 767 octets ;
- digest GitHub et digest recalculé : `sha256:113902646e43330d59ea2760a96357e7c05fd40e63610b75dbdee21ed4e4409d` ;
- HTML autonome : 152 525 octets, SHA-256 `2de1dd902768fc25808e70c6b22384120e6290ba2d4951629a7a2505bcd020e2` ;
- ZIP interne : SHA-256 `5341f88a2e04d58b0af17dbb4e6809c00e287365700f80dd058a1c8e262c9f1f` ;
- manifeste : source `df3ff7fc970c7a2d1030ceea9e7473fcf79fb0f5`, génération `2026-07-16T19:01:35Z`, Chromium `149.0.7827.55`.

Le checkout, le build déterministe, CL-01 à CL-31, les dix propriétés de parité, les suites historiques, l'intégrité du package, la syntaxe et les régressions navigateur ont réussi. Les 24 captures Capital Efficiency et les six captures Cost Gate ont été produites. Les vues Cost Gate neutre, favorable et égalité au seuil ont été réellement ouvertes à 390 et 1 440 px : pas de débordement global, coupure, lien d'évitement parasite, valeur non finie ou contradiction visible. À l'égalité, le texte indique qu'aucune marge positive ne subsiste, les trois marges sont nulles et l'état moteur reste `edge_fully_absorbed`.

Renforcement fonctionnel du même jour :

- head : `fbc0d545b3ceff69dca9ceda00bc4f30e92c98ec` ;
- tree : `0f221d07c4c7811aadaf53e0db53381d424122c3` ;
- run : `29529414199` (`#654`), job `87725842725`, `success` ;
- artefact : `8388042099`, 8 867 539 octets, digest vérifié `sha256:4f1c10239b9e18b690cea4e4dd3788ea3598e9c9b0b13c81142133c2f00009bd`.

Cette seconde preuve couvre CL-01 à CL-38. Elle ajoute la réconciliation stricte du dénominateur, le refus des dépendances sans sémantique, le refus de l'inclusion d'avantage non applicable pour un coût, les limites de projection et la conservation hashée du contexte instrument/place/horizon. La Cost Survival Surface réexécute l'alignement canonique et lie chaque cellule au ledger projeté correspondant.

Les non-régressions, l'archive et les captures 390/1 440 px ont de nouveau été inspectées. L'avertissement GitHub Actions sur Node 20/24 et l'avertissement `punycode` ne sont pas des échecs produit. Ces preuves valident l'exécution du contrat synthétique, pas la complétude des coûts réels, la calibration, l'utilité, la demande, le droit ou la cohorte.
