# Revue hostile — Cost Gate vNext après Cost Ledger v1

## 1. Verdict

Le Cost Ledger v1 est une meilleure fondation que la formule à quatre champs : il sépare identité économique, couverture, calculabilité, preuve, temps, benchmark et inclusion. Sa parité legacy est démontrée.

Il n'est toutefois **pas encore un modèle de surface**. Il décrit un snapshot et une géométrie locale. L'utiliser directement pour tracer « coût selon la taille » ferait passer trois hypothèses non démontrées pour des faits : stabilité des paramètres, stabilité de l'avantage et exécutabilité des notionnels.

La suite correcte n'est donc ni une nouvelle interface ni un modèle d'impact emprunté à la littérature. Elle est une couche de projection séparée, falsifiable et explicitement synthétique.

## 2. Méthode

Revue croisée selon :

- finance de marché et microstructure ;
- calcul quantitatif et frontières ;
- capital, cycle de vie et règlement ;
- provenance et qualité des données ;
- architecture, sécurité et auditabilité ;
- UX, accessibilité et risque de recommandation implicite ;
- stratégie produit, différenciation et preuve commerciale.

Les constats portent sur les fichiers et tests réellement présents au head fonctionnel `df3ff7fc970c7a2d1030ceea9e7473fcf79fb0f5`. Une correction locale n'est considérée acquise qu'après push et validation exact-head ultérieurs.

## 3. Constats matériels

| Gravité | Constat | Risque | Traitement |
|---|---|---|---|
| P0 | `returnDenominator` pouvait nommer une base libre ou un montant différent de `basisValues` | seuil exact sur un dénominateur fictif, notamment avec coûts fixes seuls | réconciliation obligatoire et scénarios CL-32 |
| P1 | `dependencies` était accepté sans sémantique de propagation ou de cycle | composant calculé malgré une dépendance invalide | liste non vide refusée en v1, scénario CL-33 |
| P0 | le ledger ne possède aucun domaine de taille | extrapolation silencieuse d'un taux, minimum ou barème | snapshot et projection séparés ; domaine explicite requis |
| P0 | l'avantage peut diminuer avec la capacité | surface favorable obtenue en supposant silencieusement `G` constant | profil constant qualifié d'hypothèse ou profil explicite par taille |
| P0 | trois coûts et trois avantages peuvent être appariés en diagonale par erreur | six combinaisons hostiles invisibles | produit cartésien coût × avantage obligatoire |
| P1 | le nominal de sortie legacy égale le nominal d'entrée | frais de sortie insensibles au rendement et au chemin du trade | convention maintenue uniquement comme sensibilité nommée |
| P1 | un notional continu n'est pas nécessairement un ordre exécutable | tailles incompatibles avec quantité, prix, lot ou minimum | surface v1 `notional_only`, exécutabilité non évaluée |
| P1 | les bornes des composants sont additionnées comme si elles coïncidaient | enveloppe interprétée comme conjointe ou probabiliste | scénario coordonné explicitement non joint et non probabiliste |
| P1 | `knownCostFloor` suppose uniquement des coûts adverses non négatifs | future remise ou amélioration signée brise la borne | qualification d'ontologie et séparation future TCA signée |
| P0 | fréquence, chevauchement et règlement ne se déduisent pas d'un coût par trade | multiplication annuelle ou faisabilité de série fausse | couche temporelle exclue de la première surface |
| P1 | interpoler entre deux tailles discrètes peut fabriquer une frontière | seuil présenté comme observé alors qu'il est inféré | formule exacte seulement sous géométrie linéaire prouvée ; sinon simple intervalle discret |
| P0 | l'égalité numérique peut basculer selon l'arrondi | « marge positive » à quelques erreurs flottantes près | tolérance relative versionnée et état d'égalité distinct |
| P1 | absorption et rétention n'ont pas de sens pour un avantage nul ou négatif | division infinie ou vocabulaire absurde | ratios indisponibles ; marge et seuil restent affichables |
| P0 | formes par paliers, minimums et impact sont réservées | la surface linéaire paraît générale | projection refusée dès qu'un composant ou une base n'est pas supporté |
| P1 | une grille colorée peut ressembler à un optimiseur | conseil implicite malgré une formule descriptive | aucun optimum, classement, vert « favorable » ou taille proposée |

## 4. Décision d'architecture

La chaîne devient :

```text
Cost Ledger snapshot
  -> politique de projection déclarée
  -> tailles explicites dans un domaine déclaré
  -> coût low/base/high à chaque taille
  × avantage low/base/high à chaque taille
  -> cellules descriptives et frontières qualifiées
```

Le moteur de surface doit appeler le Cost Ledger pour chaque taille. Il ne recopie pas sa formule. Il accepte seulement une projection linéaire synthétique dans v1 et refuse toutes les formes réservées.

## 5. Ce que cette revue ne valide pas

- réalisme des hypothèses de spread ou d'exécution ;
- stabilité réelle avec la taille ;
- capacité d'une stratégie ;
- liquidité ou impact de marché ;
- quantité, lot, tick ou probabilité de fill ;
- capital temporel ou fréquence ;
- donnée actuelle ;
- compréhension utilisateur, droit, demande ou prix.

## 6. Condition de réexamen

Un nouveau prototype n'est justifié que lorsque la surface :

- refuse toute extrapolation non déclarée ;
- montre les neuf croisements coût × avantage ;
- distingue sous-seuil, égalité et marge positive ;
- ne produit une frontière exacte que sous une géométrie prouvée ;
- expose capacité, exécutabilité, capital temporel et données comme non évalués ;
- a réussi ses scénarios et propriétés sur un head distant exact.
