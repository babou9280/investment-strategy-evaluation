# Validation — Cost Survival Surface v1

## 1. Statut courant

- Version : `cost-survival-surface-engine-1-synthetic`.
- Schéma : `cost-survival-surface-1`.
- Politique : `linear-ledger-sensitivity-1`.
- Interface : aucune modification.
- Données : synthétiques ou hypothèses utilisateur uniquement.
- État de preuve : tranche technique synthétique exécutée sur le head fonctionnel distant exact `fbc0d545b3ceff69dca9ceda00bc4f30e92c98ec` ; run, journaux, archive et captures de non-régression inspectés.

## 2. Actifs

- `cost_gate_model_vnext/survival_surface.js` ;
- `cost_gate_model_vnext/tests/survival_surface.test.js` ;
- `cost_gate_model_vnext/tests/survival_surface_properties.test.js` ;
- `cost_gate_model_vnext/tests/survival_surface_static_integrity.py` ;
- `docs/standards/COST_SURVIVAL_SURFACE_CONTRACT.md` ;
- `docs/scenarios/COST_SURVIVAL_SURFACE_V1_MATRIX.md` ;
- `docs/review/COST_GATE_MODEL_VNEXT_HOSTILE_REVIEW.md`.

## 3. Exécution fonctionnelle du 16 juillet 2026

```text
Cost Ledger v1 contract tests: PASS
Cost Ledger v1 frozen scenario matrix: PASS (CL-01 to CL-38 registered)
Cost Ledger v1 property tests: PASS (10 parity cases)
Cost Ledger v1 static integrity: PASS
Cost Survival Surface v1 contract tests: PASS (CSS-01 to CSS-32)
Cost Survival Surface v1 property tests: PASS
Cost Survival Surface v1 static integrity: PASS
```

Ces suites ont d'abord réussi localement, puis dans GitHub Actions après checkout du head fonctionnel exact. La syntaxe du moteur et de tous ses tests réussit. Cette tranche ne modifie aucune page ; une capture spécifique de surface n'est donc ni produite ni présentée comme preuve.

## 4. Oracles indépendants

Fixture centrale :

```text
F = 2 EUR
V = 0,70 %
N = 500 EUR
C = 2 + 500 × 0,007 = 5,50 EUR
seuil = 1,10 %
G = 1,10 % -> brut = 5,50 EUR -> net = 0 EUR
état = at_threshold_no_positive_margin
```

Frontière avec `G = 2 %` :

```text
N* = 2 / (0,020 - 0,007) = 153,846153846... EUR
marge positive strictement au-dessus
```

À trois tailles, trois scénarios de coût et trois hypothèses d'avantage, l'oracle exige `3 × 3 × 3 = 27` cellules.

## 5. Propriétés démontrées techniquement

- produit cartésien complet coût × avantage ;
- somme, seuil, brut et marge réconciliés cellule par cellule ;
- égalité distincte d'une marge positive ;
- coût plus élevé ne pouvant améliorer une cellule à taille et avantage constants ;
- avantage plus élevé ne pouvant réduire la marge à taille et coût constants ;
- frontière exacte cohérente avec les cellules seulement sous géométrie linéaire ;
- profil explicite par taille sans interpolation ;
- composant, base, domaine, hash ou alignement invalide refusé ;
- contexte instrument/place/horizon du ledger et de l'avantage réconcilié ;
- hash de chaque ledger projeté rattaché à ses cellules ;
- ratio indisponible pour avantage non positif ;
- ordre des composants source sans effet ;
- aucun `NaN`, `Infinity` ou `-0`.

## 6. Limites non levées

- domaine de taille synthétique, non calibré ;
- paramètres de coût supposés constants dans ce domaine ;
- capacité et décroissance de l'avantage non modélisées en mode constant ;
- scénarios de coût coordonnés, sans modèle joint ;
- nominal non converti en quantité exécutable ;
- aucun impact, fill, capital temporel ou fréquence ;
- aucune donnée actuelle ;
- aucune compréhension, utilité, conformité, demande ou volonté de payer validée.

## 7. Preuve distante exécutée

Preuve fonctionnelle exacte :

- head : `fbc0d545b3ceff69dca9ceda00bc4f30e92c98ec` ;
- tree : `0f221d07c4c7811aadaf53e0db53381d424122c3` ;
- run : `29529414199` (`#654`), job `87725842725`, `success` ;
- artefact : `8388042099`, 8 867 539 octets ;
- digest GitHub et digest recalculé : `sha256:4f1c10239b9e18b690cea4e4dd3788ea3598e9c9b0b13c81142133c2f00009bd` ;
- HTML autonome reconstruit : 152 544 octets, SHA-256 `71f487e139c22e4402e3af2b08ae7050f15b8d93516ffa832ad24f023fd64be7` ;
- ZIP interne : SHA-256 `a5b7c047f43b0d8fddc06d87c2a93be10eca1af65014d66933d0c6db33d24467` ;
- manifeste : source `fbc0d545b3ceff69dca9ceda00bc4f30e92c98ec`, génération `2026-07-16T19:48:20Z`, Chrome for Testing `149.0.7827.55`.

Le checkout exact, le build déterministe, CL-01 à CL-38, CSS-01 à CSS-32, les propriétés, les oracles, les suites historiques, l'intégrité locale, la syntaxe et les régressions navigateur ont réussi. L'archive s'ouvre sans erreur et son manifeste lie le package au bon commit.

Les 24 captures Capital Efficiency et les six captures Cost Gate ont été produites. Les vues à 390 et 1 440 px ont été réellement ouvertes : le texte d'égalité est correct, les marges affichées sont nulles, l'ancienne phrase est absente, le lien d'évitement n'apparaît pas, et aucun débordement ou nombre non fini n'est visible. Le test navigateur conserve néanmoins le lien comme premier focus au clavier ; le script de capture neutralise puis restaure uniquement son propre focus et son état temporaire.

Les avertissements Node 20/24 et `punycode` du runner ne sont pas des échecs produit. Cette preuve valide l'exécution du contrat synthétique et sa non-régression, pas la calibration des coûts, l'exécutabilité d'une taille, l'utilité, la demande, le droit ou une cohorte.
