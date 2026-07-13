# Breaktest Cost Gate — direction stratégique validée

## 1. Statut

- Validation fondateur : **14 juillet 2026**
- Statut : **direction stratégique active, non implémentée et non commercialement validée**
- Nom de travail : **Breaktest Cost Gate**
- Relation avec l'existant : extension future de Breaktest Cost Intelligence, Capital Efficiency et Edge Survival Envelope
- Autorisation immédiate : documentation, contrats, recherche d'angles morts et validation conceptuelle
- Non autorisé à ce stade : données réelles, réseau, compte, stockage, connexion courtier, exécution, recommandation personnalisée ou vocabulaire prescriptif

## 2. Problème visé

Un investisseur ne décide pas seulement si une stratégie paraît rentable en moyenne. Il doit aussi déterminer si **le trade envisagé maintenant**, avec son capital, sa taille, son cash libre, ses coûts, sa liquidité et son hypothèse d'avantage, reste économiquement défendable.

Les outils existants séparent souvent :

- estimation des frais ;
- taille de position ;
- liquidité ;
- disponibilité du capital ;
- hypothèse de rendement ;
- choix de type d'ordre.

Breaktest Cost Gate vise à réunir ces dimensions dans une couche pré-trade explicable, auditée et indépendante.

## 3. Proposition de valeur de travail

> Avant d'envoyer un ordre, Breaktest explique si les hypothèses économiques du trade restent compatibles avec les frictions, le capital disponible et les conditions d'exécution renseignées.

Le produit ne prédit pas la performance et ne choisit pas le trade. Il vérifie la cohérence économique du scénario fourni.

## 4. Noyau analytique réutilisé

Cost Gate ne remplace pas les couches actuelles :

- **Cost Intelligence** décrit et décompose les frictions ;
- **Capital Efficiency** sépare coût fixe diluable, plancher variable et contraintes économiques ;
- **Edge Survival** mesure la marge nette sous une hypothèse brute explicite ;
- **Edge Survival Envelope** teste la stabilité de cette marge dans une fourchette basse, centrale et haute ;
- **Capital Feasibility**, future, vérifiera si une frontière mathématique tient réellement dans le cash et l'exposition disponibles.

Cost Gate orchestre ces briques autour d'une question pré-trade précise.

## 5. Entrées envisagées

### 5.1 Entrées économiques déjà couvertes ou documentées

- nominal proposé ;
- achat simple ou aller-retour ;
- commissions ;
- frais de change ;
- spread total ;
- slippage total ;
- capital de référence ;
- fréquence ;
- avantage brut ponctuel ou fourchette explicitement fournie ;
- budget annuel de friction ;
- marge nette ou rétention cible.

### 5.2 Entrées futures de faisabilité

- capital affecté à la stratégie ;
- cash réellement disponible ;
- nominal déjà réservé ;
- positions simultanées ;
- durée de détention estimée ;
- exposition maximale autorisée par l'utilisateur ;
- réserve de liquidité choisie par l'utilisateur.

### 5.3 Entrées futures de microstructure

- instrument et place ;
- devise de cotation et devise du compte ;
- bid, ask et timestamp ;
- profondeur ou liquidité disponible ;
- taille relative au volume ;
- type d'ordre envisagé ;
- délai maximal ou fenêtre d'exécution ;
- volatilité ou régime de marché explicitement sourcé.

Ces entrées ne seront pas ajoutées avant définition de leur source, fraîcheur, couverture, licence, coût et domaine de validité.

## 6. Data Quality Gate obligatoire

Aucun diagnostic utilisant une donnée externe ne peut être produit avant validation d'un **Data Quality Gate**.

Pour chaque donnée externe :

- source identifiée ;
- timestamp et fuseau ;
- fraîcheur maximale acceptable ;
- instrument, place et devise réconciliés ;
- couverture et profondeur connues ;
- valeur manquante distincte de zéro ;
- statut observé, contractuel, estimé ou dérivé ;
- incertitude ou intervalle d'hypothèses visible ;
- fallback interdit sauf règle explicite et provenance conservée ;
- licence et droit d'utilisation vérifiés.

États minimaux envisagés :

```text
data_ready
data_stale
data_partial
data_conflicted
data_unavailable
```

Un état différent de `data_ready` doit limiter ou empêcher les conclusions dépendantes de la donnée concernée.

## 7. Sorties analytiques envisagées

Tant que la frontière réglementaire n'est pas validée, les sorties restent descriptives :

- `compatible_under_assumptions` : les contraintes renseignées sont satisfaites ;
- `adjustment_required` : au moins une contrainte n'est pas satisfaite mais une frontière mathématique existe ;
- `structurally_non_viable` : le plancher variable ou une autre contrainte rend le scénario non viable dans le modèle ;
- `capital_not_feasible` : la frontière calculée dépasse le capital ou le cash autorisé ;
- `execution_cost_risk` : les hypothèses de liquidité ou de coût implicite sont insuffisantes ou défavorables ;
- `insufficient_data` : la qualité, la fraîcheur ou la couverture des données ne permettent pas de conclure.

Ces états ne sont ni des ordres, ni des recommandations, ni des prévisions.

## 8. Explication attendue

Chaque résultat doit répondre en langage concret :

1. **Ce qui bloque ou préserve la marge** ;
2. **Quelle donnée ou hypothèse produit ce résultat** ;
3. **Ce qui est diluable et ce qui ne l'est pas** ;
4. **Quelle frontière mathématique existe** ;
5. **Pourquoi cette frontière peut rester irréalisable avec le capital disponible** ;
6. **Quelle incertitude ou donnée manquante empêche une conclusion plus forte** ;
7. **Quelles limites du modèle restent actives**.

## 9. Frontière non prescriptive

Avant revue juridique et produit, Breaktest ne doit jamais afficher :

- « exécuter » ;
- « rejeter » ;
- « acheter » ou « vendre » ;
- « ordre limite conseillé » ;
- « taille optimale » ;
- « meilleur moment » ;
- « probabilité de réussite » ;
- « trade validé ».

Le produit peut expliquer qu'une hypothèse est compatible, qu'une contrainte n'est pas satisfaite ou qu'un scénario est non viable **dans le modèle et avec les données disponibles**.

## 10. Séquence de développement conditionnelle

### Gate 0 — stabiliser le noyau actuel

- terminer Edge Survival Envelope ;
- réconcilier tous les états et tolérances ;
- conserver l'expérience progressive ;
- valider le package HTML hors ligne ;
- effectuer les premières revues utilisateurs.

### Gate 1 — prototype Cost Gate synthétique

Sans réseau ni données réelles :

- scénario pré-trade saisi manuellement ;
- capital libre explicite ;
- coût et avantage sous hypothèses ;
- Data Quality Gate simulé mais clairement marqué synthétique ;
- états descriptifs non prescriptifs ;
- tests de compréhension et de confusion réglementaire.

### Gate 2 — faisabilité du capital

- contrat de cash disponible et nominal réservé ;
- positions simultanées ;
- réutilisation des invariants C1/C4 ;
- aucun levier implicite ;
- oracles et scénarios de concurrence du capital.

### Gate 3 — première donnée externe limitée

Seulement après décision explicite :

- une source ;
- un univers restreint ;
- fraîcheur visible ;
- coût connu ;
- licence vérifiée ;
- comparaison avec scénario utilisateur ;
- kill switch si source indisponible.

### Gate 4 — validation juridique et commerciale

- revue de la frontière information / recommandation ;
- test de volonté de payer ;
- mesure de répétition d'usage ;
- absence de dépendance à un support humain non scalable ;
- politique d'erreur et de responsabilité.

### Gate 5 — intégration ou exécution éventuelle

Hors périmètre tant qu'une décision stratégique, juridique, technique et économique distincte n'est pas validée.

## 11. Différenciation potentielle

La différenciation ne vient pas d'un feu vert ou rouge. Elle peut venir de :

- l'orchestration cohérente coûts + avantage + capital + liquidité ;
- la séparation entre impossibilité structurelle et ajustement mathématique ;
- la qualité et la provenance visibles ;
- l'explication des facteurs dominants ;
- le refus explicite de conclure lorsque les données sont insuffisantes ;
- la traçabilité des versions et hypothèses ;
- la réconciliation pré-trade / ex post future ;
- des benchmarks consentis et indépendants, seulement après volume.

## 12. Angles morts principaux

- l'utilisateur peut ne pas connaître son avantage brut ;
- une fourchette subjective peut rester trop optimiste ;
- le spread affiché peut être périmé avant l'ordre ;
- la profondeur visible ne garantit pas l'exécution ;
- un ordre limite peut ne pas être exécuté ;
- un ordre au marché peut subir un slippage non modélisé ;
- le capital libre peut changer entre analyse et envoi ;
- les positions peuvent être corrélées ou consommer une marge commune ;
- les taxes et frais spécifiques peuvent manquer ;
- le coût des flux temps réel peut dépasser la disposition à payer ;
- l'affichage d'un état peut être interprété comme conseil ;
- la responsabilité en cas d'erreur ou de donnée stale doit être définie ;
- un courtier peut reproduire une version simplifiée gratuitement ;
- un système trop prudent peut devenir inutilisable ;
- un système trop affirmatif peut devenir trompeur ou réglementé.

## 13. Preuves requises avant toute revendication forte

- exactitude des calculs sur oracles indépendants ;
- stabilité aux frontières et données manquantes ;
- compréhension utilisateur sans coaching ;
- absence de confusion avec une recommandation ;
- amélioration démontrable d'une décision réelle ;
- répétition d'usage ;
- volonté de payer ;
- qualité et coût soutenable des données ;
- revue juridique ;
- processus d'incident, correction et communication.

## 14. Règle d'autorité

La validation de Cost Gate est stratégique : elle fixe la trajectoire future. Elle ne transforme aucune hypothèse en fonctionnalité, aucune source en donnée disponible, aucun état en recommandation autorisée et aucune ambition en preuve commerciale.