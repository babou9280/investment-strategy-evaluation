# Mission — Cost Survival Surface v1

## 1. Décision

La revue hostile du Cost Ledger v1 montre qu'un snapshot ne doit pas être extrapolé directement sur plusieurs tailles. La tranche active sépare donc projection, domaine et profil d'avantage avant toute nouvelle interface.

## 2. Objectif

Prouver une surface synthétique qui croise :

- tailles explicites ;
- coûts bas, central et haut issus du ledger ;
- avantages bas, central et haut explicitement fournis.

Chaque taille possède neuf cellules. La sortie distingue sous-seuil, égalité sans marge positive et marge positive sous hypothèses.

## 3. Autorité

- `docs/review/COST_GATE_MODEL_VNEXT_HOSTILE_REVIEW.md` ;
- `docs/standards/COST_SURVIVAL_SURFACE_CONTRACT.md` ;
- `docs/scenarios/COST_SURVIVAL_SURFACE_V1_MATRIX.md` ;
- `docs/standards/COST_LEDGER_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_ALIGNMENT_KEY.md`.

## 4. Périmètre

- ledger EUR, cash long, action ou ETF au comptant ;
- coûts fixes et proportionnels seulement ;
- politique linéaire synthétique dans un domaine déclaré ;
- avantage constant qualifié ou fourni séparément par taille ;
- aucun optimum, classement ou conseil ;
- aucun changement de l'interface existante.

## 5. Hors périmètre

- donnée externe ;
- quantité, lot, tick ou minimum exécutable ;
- liquidité, impact ou fill ;
- fréquence, chevauchement, règlement et trajectoire de capital ;
- modèle de capacité de l'avantage ;
- cohorte utilisateur ;
- modification de `main`.

## 6. Gate technique

- ledger renforcé sur dénominateur, dépendances et inclusion edge ;
- CL-01 à CL-38 réussis ;
- CSS-01 à CSS-32 réussis ;
- produit cartésien exact ;
- oracles de cellules et de frontières indépendants ;
- refus des domaines, profils ou formes non supportés ;
- contexte instrument/place/horizon du ledger réconcilié avec celui de l'avantage ;
- aucune valeur non finie ;
- CI du head exact, logs et artefact inspectés ;
- documentation et registre synchronisés.

## 7. Condition de sortie

La réussite clôt uniquement une tranche analytique synthétique. Elle n'autorise ni nouvelle interface, ni cohorte, ni donnée réelle, ni revendication de capacité ou d'exécution.
