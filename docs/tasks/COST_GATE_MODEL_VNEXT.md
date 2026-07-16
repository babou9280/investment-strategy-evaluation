# Mission active — conception Cost Gate vNext

## 1. Décision

Ayman a décidé le 16 juillet 2026 de ne pas lancer la cohorte Gate 1 avec le prototype actuel. Le projet dispose encore de temps et doit approfondir intelligemment le modèle avant de chercher à fermer la gate.

Cette décision ne nie aucune preuve technique de la PR `#26`. Elle requalifie son HTML comme sonde technique et empêche de confondre « fonctionne » avec « modèle suffisamment bon ».

Statut d'exécution : contrat, matrice CL-01 à CL-31, moteur isolé, adaptateur legacy, enveloppe synthétique et oracles sont techniquement validés sur `df3ff7fc`, run `#650`. La revue hostile est exécutée. Les renforcements CL-32 à CL-38 et la Cost Survival Surface v1 CSS-01 à CSS-32 sont implémentés localement et attendent leur preuve distante. Aucune migration de la fondation ou de l'interface n'est engagée.

## 2. Objectif de la première tranche — atteint techniquement

Concevoir puis prouver un Cost Ledger v1 rétrocompatible qui sépare explicitement composant, côté, portée, base, devise, benchmark, provenance, inclusion et incertitude.

Le ledger doit préparer une future enveloppe de coût et une surface de contraintes sans implémenter encore une donnée réelle ou un modèle de market impact non calibré.

## 3. Sources d'autorité

- `docs/product/COST_GATE_MODEL_ARCHITECTURE_VNEXT.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` ;
- `docs/standards/GROSS_EDGE_ALIGNMENT_KEY.md` ;
- `docs/product/COST_GATE_MVP_GATE_MATRIX.md` ;
- `docs/scenarios/COST_LEDGER_V1_MATRIX.md`.

La numérotation de cette matrice reste l'unique numérotation de gate.

## 4. Première tranche autorisée — exécutée

- contrat du ledger ;
- matrice de scénarios avant code ;
- adaptateur des quatre composantes existantes ;
- mêmes résultats financiers sur tous les scénarios rétrocompatibles ;
- détection de doublon de représentation et d'événement économique, couverture incomplète, conflit de base, benchmark absent et forme non supportée ;
- oracles indépendants ;
- documentation et registre des angles morts.

## 5. Hors périmètre

- donnée de marché ou courtier ;
- modèle d'impact calibré ou loi de puissance hardcodée ;
- probabilité de fill ;
- suggestion de prix limite, taille, timing ou type d'ordre ;
- exécution ;
- nouvelle interface grand public ;
- cohorte utilisateur avant décision fondatrice ultérieure ;
- modification de `main`.

## 6. Gate technique de la tranche

- schéma versionné et validation stricte ;
- parité exacte entre entrée legacy et ledger ;
- somme, devise, portée et signe réconciliés ;
- aucun double comptage ;
- complétude qualifiée par une politique déclarée, jamais auto-déduite d'une liste ;
- calculabilité, preuve et temps séparés ;
- mutation invalidant les anciens constats ;
- erreurs et inconnues distinctes de zéro ;
- tests de propriétés et oracle indépendant ;
- CI du head exact, artefact et preuves inspectés ;
- aucune revendication utilisateur, commerciale ou réglementaire.

## 7. Étape suivante active

Valider sur head distant exact les corrections de la revue hostile et la surface descriptive taille × coût × avantage. Cette surface ne choisit pas d'optimum et ne sera pas exposée à une cohorte sans nouvelle décision explicite d'Ayman.
