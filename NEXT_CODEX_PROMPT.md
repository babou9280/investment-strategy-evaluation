# Prochaine mission Codex — revue hostile et Cost Survival Surface v1

## Statut reconstruit

La direction **Breaktest Cost Gate** est validée stratégiquement. Gate 0 est clôturée. Le prototype hors ligne de la PR `#26` est techniquement exécuté et son défaut iPad ciblé a été retesté avec succès. Il reste une sonde, pas le produit à tester.

Le 16 juillet 2026, Ayman a refusé de passer immédiatement à cinq participants : le prototype est un début utile mais le modèle doit aller plus loin avant toute cohorte. Cette décision remplace l'observation comme mission active sans annuler le protocole préenregistré.

```text
pull request = #26, draft
base = breaktest-bootstrap
base head = 56fb50954afd7394baf1689e0f1b7220a1fd73fc
active branch = strategy/cost-gate-offline-critique
functional Cost Ledger proof head = df3ff7fc970c7a2d1030ceea9e7473fcf79fb0f5
functional Cost Ledger proof tree = 8f90cedc5bf9918a79c75557311448f5b9aeae12
functional proof run = 29526270376 (#650), success
functional proof artifact = 8386829836
functional proof artifact digest = 113902646e43330d59ea2760a96357e7c05fd40e63610b75dbdee21ed4e4409d
founder-tested standalone sha256 = 93d0f25d911a102e85847ab7ad884cafdfaf316215b82544a9e80be0a6e6df79
Cost Ledger engine = cost-ledger-engine-1-synthetic
participants observed = 0/5
cohort = suspended by founder
main = 6e8c8e801e9821fe212651d684c8fad75dc6abee, unchanged
```

Vérifier ces identifiants sur GitHub à chaque reprise. Une preuve historique ou locale ne remplace jamais le head et le run actuels.

## Objectif unique

Valider à distance les corrections de la **revue hostile** et la **Cost Survival Surface v1** descriptive déjà implémentées localement : pour plusieurs tailles et plusieurs hypothèses de coût et d'avantage explicitement fournies, montrer où l'avantage est absorbé, exactement couvert ou conservé.

Cette surface décrit des contraintes. Elle ne choisit jamais une taille, un type d'ordre, un prix ou un moment, et ne transforme aucune cellule en recommandation.

## Autorité

- architecture : `docs/product/COST_GATE_MODEL_ARCHITECTURE_VNEXT.md` ;
- contrat : `docs/standards/COST_LEDGER_CONTRACT.md` ;
- tâche : `docs/tasks/COST_GATE_MODEL_VNEXT.md` ;
- standards quantitatifs : `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- cash et cycle : `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- avantage : `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` et `GROSS_EDGE_ALIGNMENT_KEY.md` ;
- gates : `docs/product/COST_GATE_MVP_GATE_MATRIX.md`.

La matrice MVP reste l'unique numérotation de gate.

## Tranche active

1. vérifier CL-32 à CL-35 : dénominateur, dépendances, inclusion edge et qualification du plancher ;
2. vérifier CSS-01 à CSS-30 et leurs oracles indépendants ;
3. confirmer que chaque cellule appelle le ledger et que coût × avantage est cartésien ;
4. confirmer les trois états stricts : sous le seuil, égalité, marge positive ;
5. refuser toute géométrie, base, domaine ou profil non supporté ;
6. inspecter CI, logs, artefact et captures de non-régression du head exact ;
7. synchroniser preuves et limites sans autoriser interface, cohorte ou donnée externe.

## Règles critiques

- un coût manquant n'est pas zéro ;
- une somme partielle n'est pas une friction complète ;
- un taux n'existe pas sans dénominateur ;
- un slippage n'existe pas sans benchmark ; l'entrée legacy devient une hypothèse de coût d'exécution ;
- une fourchette synthétique n'est pas probabiliste ;
- contractuel, estimé ex ante et observé ex post restent séparés ;
- aucune loi de market impact n'est hardcodée sans calibration et domaine ;
- aucun type d'ordre, timing, taille ou prix n'est recommandé ;
- chaque modification invalide l'ancien snapshot ;
- `main` reste hors périmètre.

## Travail suspendu

- cohorte Gate 1 ;
- nouvelle interface grand public ;
- donnée de marché ou courtier ;
- import, compte, stockage ou réseau ;
- modèle de market impact calibré ;
- probabilité de fill ou prix limite ;
- conseil, transmission ou exécution ;
- publication, acquisition ou paiement ;
- fusion de la PR `#26` avant une nouvelle décision explicite.

## Condition de sortie

La surface doit être rétrocompatible, monotone seulement sous les hypothèses qui rendent cette propriété vraie, explicable cellule par cellule et falsifiée sur un head distant exact. Un seuil ou une frontière non identifiable doit rester `indeterminate`, jamais interpolé ou optimisé silencieusement. Cette preuve restera technique et synthétique. Elle n'autorisera pas automatiquement la cohorte, une donnée externe ou une revendication commerciale.
