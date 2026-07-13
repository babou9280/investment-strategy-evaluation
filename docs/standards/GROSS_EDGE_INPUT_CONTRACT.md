# Breaktest — contrat de l'hypothèse d'avantage brut

## 1. Objet

Le moteur Edge Survival n'est utile que si l'entrée d'avantage brut est définie sur une base compatible avec les frictions calculées.

Ce contrat interdit de traiter comme équivalentes des grandeurs qui ne le sont pas : rendement annuel, performance de compte, gain moyen des gagnants, taux de réussite, alpha, espérance par trade et rendement brut par opération.

Breaktest ne prédit pas l'avantage brut. Il doit cependant empêcher qu'une entrée mal définie produise une conclusion apparemment précise.

## 2. Grandeur canonique actuelle

Dans le prototype, `gross_edge_rate` désigne :

> le rendement brut arithmétique moyen par opération complète correspondant exactement au scénario de coûts choisi, avant les frictions saisies, rapporté au nominal de cette opération.

Pour une opération `i` :

```text
gross_return_i = gross_pnl_i / order_notional_i
```

Lorsque les opérations ont des notionnels variables, deux agrégations sont possibles et ne doivent pas être confondues :

```text
trade_equal_weighted_mean = mean(gross_return_i)
capital_weighted_rate = sum(gross_pnl_i) / sum(order_notional_i)
```

Le prototype actuel accepte une valeur fournie par l'utilisateur sans choisir silencieusement entre ces deux estimateurs. La provenance et la méthode d'agrégation doivent donc être déclarées avant toute dérivation automatique future.

## 3. Correspondance avec l'opération modélisée

La définition du brut doit correspondre au scénario :

- `achat simple` : rendement et coûts couvrent le même côté de l'opération ;
- `aller-retour` : rendement brut et coûts couvrent l'entrée et la sortie complètes ;
- la fréquence mensuelle compte le même type d'opération complète ;
- le nominal utilisé au dénominateur doit être compatible avec celui du moteur ;
- les coûts ne doivent pas être déjà soustraits de la valeur qualifiée de brute.

Une performance nette issue d'un relevé ne peut pas être saisie comme brut sans réconciliation ou reconstitution documentée.

## 4. Ce que l'entrée doit inclure

Une estimation historique défendable doit inclure selon la population définie :

- opérations gagnantes ;
- opérations perdantes ;
- opérations nulles ;
- frais exclus du brut mais conservés séparément ;
- même stratégie ou règle de décision ;
- même définition d'entrée et de sortie ;
- même univers ou un univers dont l'agrégation est explicitement justifiée ;
- une période et un régime déclarés ;
- tous les trades admissibles, sans suppression rétrospective des perdants.

Les annulations ou ordres non exécutés ne sont inclus que si leur coût et leur rôle dans le processus sont modélisés explicitement.

## 5. Grandeurs interdites comme substituts silencieux

Ne jamais interpréter automatiquement comme `gross_edge_rate` :

- taux de réussite ;
- gain moyen des seuls gagnants ;
- payoff ratio ;
- rendement annuel ou CAGR ;
- performance totale du portefeuille ;
- alpha d'une régression ;
- Sharpe ratio ;
- rendement d'un actif de référence ;
- objectif personnel de rendement ;
- meilleur trade ou meilleure période ;
- résultat net déjà diminué de frais ;
- rendement calculé sur un autre nominal ou un autre horizon.

## 6. Provenance minimale

Toute valeur ou fourchette doit être qualifiée par une provenance :

```text
user_assumption
historical_observation
externally_measured
synthetic_demo
```

Le prototype actuel n'exécute pas encore la dérivation historique. Il expose principalement `user_assumption` et `synthetic_demo`.

Avant toute dérivation future, stocker au minimum :

- définition de l'opération ;
- estimateur utilisé ;
- nombre d'observations ;
- période ;
- univers ;
- devise et nominal ;
- base brute ou nette ;
- règles d'exclusion ;
- version du calcul ;
- source ou fichier d'origine.

## 7. Point contre fourchette

### Valeur unique

Une valeur unique est une hypothèse ponctuelle ou un estimateur ponctuel. Elle ne signifie pas certitude.

### Fourchette

Les valeurs basse, centrale et haute sont trois hypothèses ordonnées fournies par l'utilisateur.

Elles ne deviennent un intervalle statistique que si une méthode d'estimation, une couverture, un échantillon et des hypothèses statistiques ont été définis et validés. Ce n'est pas le cas du prototype actuel.

La fourchette doit être utilisée comme analyse de sensibilité :

> la conclusion change-t-elle lorsque l'hypothèse brute varie entre les valeurs saisies ?

## 8. Compatibilité avec la projection annuelle

Le produit peut calculer une projection arithmétique :

```text
annual_gross_edge_eur = gross_edge_eur_per_operation * monthly_operations * 12
```

Cette projection n'est valide que comme multiplication descriptive sous hypothèses constantes. Elle ne modélise pas :

- capitalisation ;
- chevauchement de positions ;
- durée de détention ;
- variation de nominal ;
- contrainte de capital ;
- changement de fréquence causé par la stratégie ;
- dépendance entre opérations ;
- évolution de l'avantage dans le temps.

Elle ne peut pas être présentée comme rendement annuel attendu.

## 9. Échantillon et incertitude future

Lorsqu'un historique réel sera autorisé, la valeur brute dérivée devra afficher :

- taille d'échantillon ;
- dispersion ;
- concentration ;
- stabilité temporelle ;
- sensibilité aux valeurs extrêmes ;
- séparation entraînement / validation lorsque pertinente ;
- changement de régime ;
- incertitude adaptée aux données.

Aucun seuil universel de taille d'échantillon ne doit être inventé. L'indisponibilité ou la fragilité doit rester visible.

## 10. Tests et invariants

Avant automatisation, vérifier :

- brut et net non confondus ;
- opération et nombre de côtés cohérents ;
- unité décimale interne ;
- nominal strictement positif ;
- zéro et valeur négative conservés ;
- aucun fallback depuis une métrique incompatible ;
- aucune exclusion rétrospective des perdants ;
- même valeur ponctuelle donnant le même résultat dans les modes compatibles ;
- fourchette explicitement non probabiliste ;
- projection annuelle qualifiée d'arithmétique.

## 11. Exigence UX immédiate

Le formulaire doit expliquer en français simple que le brut saisi est :

> une moyenne brute par opération complète, gains et pertes inclus, avant les coûts saisis.

Tant que la provenance détaillée n'est pas collectée, l'interface doit qualifier la valeur de `non vérifiée` et ne pas la présenter comme une mesure validée.

## 12. Gate de produit

Avant de faire de l'Edge Survival le parcours principal externe, tester avec de vrais utilisateurs :

1. savent-ils distinguer brut, net, gain moyen et taux de réussite ?
2. disposent-ils réellement de la valeur demandée ?
3. peuvent-ils expliquer son calcul ?
4. la saisie change-t-elle une décision ou révèle-t-elle une contrainte ?
5. le mode seuil seul reste-t-il utile lorsqu'ils ne disposent pas de cette valeur ?

Si la majorité de la cible ne peut pas fournir une valeur compatible, le produit doit privilégier le seuil seul ou dériver le brut depuis des données réelles validées plutôt que demander une fausse précision.