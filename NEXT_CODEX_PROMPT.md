# Prochaine mission Codex — quantité admissible et trajectoire de capital

## Statut reconstruit

La direction **Breaktest Cost Gate** est validée stratégiquement. Gate 0 est clôturée. Le prototype hors ligne de la PR `#26` est une sonde technique, pas le produit à tester. Ayman a suspendu la cohorte Gate 1 pour approfondir le modèle ; le compteur reste `0/5`.

Le Cost Ledger v1 renforcé et la Cost Survival Surface v1 sont techniquement exécutés. La surface croise coût × avantage sur des nominales explicites, mais elle refuse à juste titre de prétendre qu'un nominal est une quantité plaçable ou qu'une succession de trades tient dans le capital au fil du temps.

```text
pull request = #26, draft
base = breaktest-bootstrap
base head = 56fb50954afd7394baf1689e0f1b7220a1fd73fc
active branch = strategy/cost-gate-offline-critique
functional model proof head = fbc0d545b3ceff69dca9ceda00bc4f30e92c98ec
functional model proof tree = 0f221d07c4c7811aadaf53e0db53381d424122c3
functional proof run = 29529414199 (#654), success
functional proof artifact = 8388042099
functional proof artifact digest = 4f1c10239b9e18b690cea4e4dd3788ea3598e9c9b0b13c81142133c2f00009bd
Cost Ledger engine = cost-ledger-engine-1-synthetic
Cost Survival Surface engine = cost-survival-surface-engine-1-synthetic
participants observed = 0/5
cohort = suspended by founder
main = 6e8c8e801e9821fe212651d684c8fad75dc6abee, unchanged
```

Vérifier ces identifiants sur GitHub à chaque reprise. Une preuve historique ou locale ne remplace jamais le head et le run actuels.

## Objectif unique

Concevoir, avant toute nouvelle interface et avant tout branchement de données, les contrats minimaux permettant de répondre honnêtement à deux questions distinctes :

1. le nominal envisagé correspond-il à une quantité admissible selon des règles d'instrument explicitement fournies ?
2. les décaissements, règlements, réserves et opérations qui se chevauchent tiennent-ils dans une trajectoire de capital explicitement fournie ?

Ces couches décrivent une compatibilité sous hypothèses. Elles ne choisissent jamais une taille, une fréquence, un prix, un ordre ou un moment.

## Autorité

- architecture : `docs/product/COST_GATE_MODEL_ARCHITECTURE_VNEXT.md` ;
- ledger : `docs/standards/COST_LEDGER_CONTRACT.md` ;
- surface : `docs/standards/COST_SURVIVAL_SURFACE_CONTRACT.md` ;
- cash et cycle : `docs/standards/PRETRADE_CASH_AND_LIFECYCLE_COST_CONTRACT.md` ;
- capital : `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md` ;
- standards quantitatifs : `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- angles morts : BS-092, BS-093 et BS-099 dans `docs/governance/BLIND_SPOT_REGISTER.md`.

La matrice MVP reste l'unique numérotation de gate.

## Tranche active — conception avant code

1. effectuer une revue hostile des bases, unités, arrondis, dates de valeur, règlements et chevauchements ;
2. séparer un contrat **quantité admissible** d'un contrat **trajectoire de capital** ;
3. définir leurs entrées minimales, provenance, fraîcheur, inconnues et motifs de refus ;
4. définir les événements de cash sans confondre engagement d'entrée, coût du cycle et produit futur de sortie ;
5. écrire les matrices de scénarios et oracles indépendants avant le moteur ;
6. réconcilier chaque résultat avec le ledger et le contexte économique hashé ;
7. n'autoriser le code qu'après absence de contradiction entre contrats.

## Règles critiques

- aucun prix, pas de cotation, lot, quantité minimale ou délai de règlement n'est inventé ;
- un arrondi de quantité n'est jamais silencieux et ne devient jamais une taille recommandée ;
- un nominal continu reste `notional_only_not_executable` tant que les règles nécessaires manquent ;
- produit de sortie, frais de sortie et cash disponible restent séparés tant que le chemin du trade est inconnu ;
- du cash non réglé n'est pas automatiquement réutilisable ;
- une fréquence annuelle ne se déduit jamais par simple multiplication d'un trade isolé ;
- deux opérations peuvent être valides isolément et incompatibles lorsqu'elles se chevauchent ;
- une inconnue produit `indeterminate` ou `not_evaluated`, jamais zéro ;
- aucun optimum, score global, feu vert, ordre ou probabilité d'exécution ;
- `main` reste hors périmètre.

## Travail suspendu

- nouvelle interface grand public ;
- cohorte Gate 1 ;
- donnée de marché ou courtier ;
- calibration de liquidité, impact ou fill ;
- import, compte, stockage ou réseau ;
- recommandation, transmission ou exécution ;
- publication, acquisition ou paiement ;
- fusion de la PR `#26` avant une nouvelle décision explicite.

## Condition de sortie de la conception

Les deux contrats doivent être séparables, falsifiables, compatibles avec le ledger et capables de laisser une réponse indéterminée. La revue doit démontrer qu'ils ne comptent pas deux fois le cash ou les coûts, ne réutilisent pas des fonds non réglés, ne transforment pas une nominale en ordre fictif et ne recommandent aucune taille ni fréquence.

Cette sortie autorisera au plus une implémentation synthétique isolée avec oracles. Elle ne validera ni donnée réelle, ni utilisabilité, ni conseil, ni marché.
