# Breaktest — méthodologie actuelle

## 1. Statut méthodologique

Breaktest possède deux couches distinctes :

1. **moteur historique validé** : audit de journaux et backtests, fusionné jusqu'à H2 ;
2. **produit Cost Intelligence à valider** : calculateur pré-transaction et futur suivi des frictions.

La seconde couche ne doit pas être présentée comme implémentée ni validée avant exécution de sa mission dédiée.

## 2. Méthodologie du calculateur de validation

Le calculateur utilise uniquement des paramètres fournis par l'utilisateur et des scénarios synthétiques explicitement identifiés.

### Entrées

- capital en euros, strictement positif ;
- montant d'ordre en euros, strictement positif ;
- nombre d'allers-retours mensuels, supérieur ou égal à zéro ;
- commission par côté, supérieure ou égale à zéro ;
- taux de change par conversion, compris entre 0 et 100 % ;
- spread aller-retour estimé, compris entre 0 et 100 % ;
- slippage aller-retour estimé, compris entre 0 et 100 %.

### Formules

Pour un aller-retour :

- `commission = 2 × commission_par_côté` ;
- `change = 2 × taux_change_par_côté × montant_ordre` ;
- `spread = taux_spread_aller_retour × montant_ordre` ;
- `slippage = taux_slippage_aller_retour × montant_ordre` ;
- `coût_total = commission + change + spread + slippage` ;
- `coût_ordre_pct = coût_total / montant_ordre` ;
- `coût_annuel = coût_total × allers_retours_mensuels × 12` ;
- `coût_capital_pct = coût_annuel / capital` ;
- `seuil_brut_pct = coût_ordre_pct`.

Le `seuil_brut_pct` indique le rendement brut nécessaire pour couvrir les frictions du scénario. Il ne constitue ni un objectif de rendement ni une recommandation d'effectuer l'opération.

### Précision

- les calculs internes utilisent les nombres non arrondis ;
- l'arrondi intervient uniquement à l'affichage ;
- chaque composante reste visible avant l'agrégat ;
- les scénarios sont comparés sans classement automatique ;
- une valeur nulle réelle reste valide ;
- absence, valeur invalide et zéro sont distingués.

### Provenance des coûts

Chaque coût doit porter une nature explicite :

- `observed` : présent dans un relevé ;
- `contractual` : issu d'un barème sourcé et daté ;
- `estimated` : spread, slippage ou autre estimation ;
- `user_assumption` : paramètre librement saisi.

Une estimation ne peut jamais être présentée comme un coût réellement payé. Une valeur contractuelle ne peut pas être présentée comme actuelle sans source et date.

## 3. Limites du calculateur de validation

Le calculateur initial ne modélise pas :

- fiscalité personnelle ;
- rendement futur ;
- qualité globale d'un courtier ;
- probabilité de gain ;
- coût d'opportunité ;
- impact de marché calibré sur des données temps réel ;
- intérêts, financement ou appels de marge ;
- transmission ou exécution d'ordres.

Il ne recommande ni actif, ni courtier, ni fréquence, ni taille d'ordre.

## 4. Méthodologie future du Cost Tracker

Cette couche reste conditionnelle à la validation commerciale.

Lorsqu'un historique est importé, Breaktest devra distinguer :

- commissions observées ;
- frais de change observés ou contractuels ;
- coûts implicites estimés ;
- performance brute observée ;
- performance nette observée ;
- scénarios recalculés.

Toute agrégation devra se réconcilier avec les lignes sources. Les coûts estimés devront être affichés séparément et accompagnés d'un intervalle ou d'une hypothèse explicite lorsque l'incertitude est matérielle.

## 5. Bases de résultat du moteur historique — règle H2

Le moteur validé conserve quatre bases séparées :

- **Brut observé** : PnL/rendement brut fourni par la ligne ;
- **Net fixe observé** : PnL/rendement net fixe fourni ; fallback explicite vers le brut lorsque la paire est entièrement absente ;
- **Full-cost observé** : PnL/rendement full-cost fourni ; fallback explicite vers le net fixe lorsque la paire est entièrement absente ;
- **Simulé par Breaktest** : brut observé redimensionné au nominal de la position, diminué des coûts du scénario actif.

Pour chaque base observée :

- une valeur explicitement invalide refuse le lot ;
- un zéro réel reste valide ;
- si seul le PnL est présent, le rendement est dérivé par `PnL / nominal` ;
- si seul le rendement est présent, le PnL est dérivé par `rendement × nominal` ;
- si la paire optionnelle est entièrement absente, le fallback et sa base d'origine sont conservés ;
- si PnL et rendement sont tous deux présents mais incompatibles, les deux valeurs sont conservées et l'anomalie est signalée pour H4 ;
- lors d'un redimensionnement, le PnL fourni est mis à l'échelle par `nominal simulé / nominal source` ;
- la provenance `observed`, `derived`, `fallback` ou `simulated` reste attachée à la ligne.

Le mode historique par défaut reste **simulé par Breaktest**. Les hypothèses de coûts ne modifient jamais une base observée et ne sont jamais soustraites une seconde fois d'un net observé.

## 6. Normalisation numérique historique — règle H1

- le nominal investi doit être présent, fini et strictement positif ;
- au moins un des champs `gross_pnl_eur` ou `gross_return` doit être présent et valide ;
- une valeur fournie non numérique, `NaN` ou infinie entraîne le refus du lot ;
- une dérivation n'est autorisée qu'à partir d'une autre valeur et d'un nominal valides ;
- un zéro réel reste une observation valide ;
- la provenance est conservée.

## 7. Isolation temporelle — règle C2

Chaque trade rejoué est évalué avec son propre modèle :

- seules les lignes `backtest` peuvent entraîner le modèle ;
- la ligne elle-même est exclue ;
- les dates doivent être valides et cohérentes ;
- la sortie d'entraînement doit être strictement antérieure à l'entrée de la décision ;
- sorties de même date, lignes futures et lignes live sont exclues ;
- une décision à date invalide est classée `observe` ;
- modèle, profondeur et exclusions sont conservés.

## 8. Turnover — règle C3

- les évaluations sont ordonnées par date d'entrée croissante ;
- le budget est consommé sur une fenêtre glissante de 365,25 jours ;
- les décisions `remove` ou `observe` ne consomment rien ;
- les dates différentes ne sont jamais triées globalement selon l'edge ;
- les opportunités de même date suivent une priorité déterministe ;
- une opportunité future ne peut jamais changer une décision antérieure.

## 9. Réservation du capital — règle C1

- les évaluations sont groupées par date d'entrée ;
- les décisions du groupe suivent la priorité C3 ;
- seules les décisions `keep` réservent le nominal complet ;
- aucune réduction implicite du nominal n'est autorisée ;
- une position du groupe n'est pas libérée au milieu de ce groupe ;
- les données invalides produisent `observe` ;
- capital réalisé, réservé et libre restent auditables.

## 10. Trésorerie réalisée — règle C4

- la simulation commence au capital initial ;
- les sorties sont traitées avant les entrées de même date ;
- une sortie libère le nominal et applique une seule fois le PnL sélectionné ;
- le PnL ne modifie jamais la trésorerie avant sa sortie ;
- une décision `remove` ou `observe` n'applique aucun PnL ;
- le dernier point égale le capital initial plus les PnL sélectionnés des positions financées ;
- la courbe reste une **courbe de trésorerie réalisée aux sorties**, pas une valorisation mark-to-market.

## 11. Stress tests historiques

- augmentation des coûts ;
- retrait des meilleurs trades pour mesurer la concentration ;
- comparaison backtest/live-test ;
- risque de queue au niveau des trades ;
- réconciliation entre lignes et agrégats ;
- bootstrap conditionnel à l'échantillon fourni.

## 12. Limites techniques ouvertes

- H3 : provenance de devise du prix d'entrée ;
- H4 : politique définitive de réconciliation PnL/rendement/nominal ;
- H5 : protection de l'export contre l'injection de formule ;
- H6 : performances sur imports moyens et grands ;
- absence de valorisation mark-to-market ;
- absence de levier, intérêts, dividendes et flux externes ;
- bootstrap sans correction du biais de sélection, de dépendance temporelle ou de changement de régime.

H3 à H6 sont suspendus jusqu'à démonstration d'un besoin produit direct.

## 13. Breaktest Score historique

La proposition de score reste non prioritaire et non commercialement validée :

- résilience aux coûts : 25 % ;
- résilience aux outliers : 25 % ;
- hors-échantillon : 25 % ;
- risque de queue : 15 % ;
- profondeur : 10 %.

Aucun score global ne doit être utilisé dans la page Cost Intelligence. Un score composite est un indice d'évidence, pas une prédiction.