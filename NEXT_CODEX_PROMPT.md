# Prochaine mission Codex — Cost Gate vNext et Cost Ledger v1

## Statut reconstruit

La direction **Breaktest Cost Gate** est validée stratégiquement. Gate 0 est clôturée. Le prototype hors ligne de la PR `#26` est techniquement exécuté et le défaut iPad ciblé a été retesté avec succès.

Le 16 juillet 2026, Ayman a refusé de passer immédiatement à cinq participants : le prototype est un début utile mais le modèle doit aller plus loin avant toute cohorte. Cette décision remplace l'observation comme mission active sans annuler le protocole préenregistré.

```text
pull request = #26, draft
base = breaktest-bootstrap
base head = 56fb50954afd7394baf1689e0f1b7220a1fd73fc
active branch = strategy/cost-gate-offline-critique
last verified remote head = 6ab3393586583a609a6d4509a39c7e1460f1f177
last verified remote tree = 9788ca06585db4ff9d40557206561601239ee7c4
exact run = 29519178960 (#649), success
artifact = 8383998747
artifact digest = 7e844f153f094c00ddb79aaea7d2dab2f50c85f97bf10edc7e92796e92a47885
founder-tested standalone sha256 = 93d0f25d911a102e85847ab7ad884cafdfaf316215b82544a9e80be0a6e6df79
current engine = cost-gate-foundation-3-synthetic
participants observed = 0/5
cohort = suspended by founder
main = 6e8c8e801e9821fe212651d684c8fad75dc6abee, unchanged
```

Vérifier ces identifiants sur GitHub à chaque reprise. Une preuve historique ou locale ne remplace jamais le head et le run actuels.

## Objectif unique

Concevoir puis implémenter le **Cost Ledger v1** sans modifier silencieusement les formules économiques déjà validées.

La prochaine valeur vient d'une représentation correcte des coûts, pas d'une nouvelle interface : chaque composant doit déclarer côté, portée, base, devise, benchmark, inclusion, provenance, temps, incertitude et version.

## Autorité

- architecture : `docs/product/COST_GATE_MODEL_ARCHITECTURE_VNEXT.md` ;
- contrat : `docs/standards/COST_LEDGER_CONTRACT.md` ;
- tâche : `docs/tasks/COST_GATE_MODEL_VNEXT.md` ;
- standards quantitatifs : `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- cash et cycle : `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- avantage : `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md` et `GROSS_EDGE_ALIGNMENT_KEY.md` ;
- gates : `docs/product/COST_GATE_MVP_GATE_MATRIX.md`.

La matrice MVP reste l'unique numérotation de gate.

## Première tranche

1. figer une matrice de scénarios du ledger avant le code ;
2. implémenter schéma et validation stricte ;
3. adapter commission, FX, spread et coût d'exécution hypothétique actuels ;
4. démontrer la parité exacte des résultats legacy ;
5. bloquer doublons, conflits d'inclusion, base ou devise manquante et forme non supportée ;
6. ajouter oracle indépendant et propriétés ;
7. synchroniser preuves, registre et canonicals sur le head exact.

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

Le Cost Ledger v1 doit être rétrocompatible, auditable et falsifié par des scénarios hostiles sur un head distant exact. Cette preuve restera technique et synthétique. Elle n'autorisera pas automatiquement la cohorte, une donnée externe ou une revendication commerciale.
