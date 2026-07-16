# Validation — Cost Survival Surface v1

## 1. Statut courant

- Version : `cost-survival-surface-engine-1-synthetic`.
- Schéma : `cost-survival-surface-1`.
- Politique : `linear-ledger-sensitivity-1`.
- Interface : aucune modification.
- Données : synthétiques ou hypothèses utilisateur uniquement.
- État de preuve : suites locales réussies ; preuve GitHub exact-head encore requise avant clôture technique.

## 2. Actifs

- `cost_gate_model_vnext/survival_surface.js` ;
- `cost_gate_model_vnext/tests/survival_surface.test.js` ;
- `cost_gate_model_vnext/tests/survival_surface_properties.test.js` ;
- `cost_gate_model_vnext/tests/survival_surface_static_integrity.py` ;
- `docs/standards/COST_SURVIVAL_SURFACE_CONTRACT.md` ;
- `docs/scenarios/COST_SURVIVAL_SURFACE_V1_MATRIX.md` ;
- `docs/review/COST_GATE_MODEL_VNEXT_HOSTILE_REVIEW.md`.

## 3. Exécution locale du 16 juillet 2026

```text
Cost Ledger v1 contract tests: PASS
Cost Ledger v1 frozen scenario matrix: PASS (CL-01 to CL-38 registered)
Cost Ledger v1 property tests: PASS (10 parity cases)
Cost Ledger v1 static integrity: PASS
Cost Survival Surface v1 contract tests: PASS (CSS-01 to CSS-32)
Cost Survival Surface v1 property tests: PASS
Cost Survival Surface v1 static integrity: PASS
```

La syntaxe du moteur et de tous ses tests réussit. Cette tranche ne modifie aucune page ; une capture spécifique de surface n'est donc ni produite ni présentée comme preuve.

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

## 5. Propriétés démontrées localement

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

## 7. Preuve distante à compléter

- pousser les fichiers sur la branche existante de la PR `#26` ;
- vérifier le nouveau head ;
- inspecter le run exact-head, ses jobs et logs ;
- télécharger et contrôler l'artefact ;
- inspecter les captures de non-régression des interfaces existantes ;
- synchroniser cette preuve sans présenter la surface comme un produit validé.
