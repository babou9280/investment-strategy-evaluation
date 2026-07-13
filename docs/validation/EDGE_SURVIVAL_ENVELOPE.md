# Validation — Edge Survival Envelope

## Statut

- Branche validée : `strategy/edge-survival-envelope`
- Head fonctionnel exact : `1ad572c07e200793a10c60467b8ed465570177ff`
- Pull request : `#23`
- GitHub Actions : run `29285336970`
- Conclusion du run : `success`
- Moteur : `capital-efficiency-lab-3-edge-range`
- Nature de la preuve : technique, quantitative, responsive et interne
- Publication externe : non autorisée

## Objet validé

Le laboratoire Capital Efficiency accepte désormais exactement trois modes :

1. seuil de couverture sans hypothèse de rendement brut ;
2. valeur brute ponctuelle fournie par l'utilisateur ;
3. fourchette basse, centrale et haute entièrement fournie par l'utilisateur.

Le mode fourchette mesure si la conclusion reste stable après frictions sans produire de probabilité, d'intervalle de confiance, de prévision ou de recommandation.

## Contrat exécuté

La validation couvre :

- détection non ambiguë des trois modes ;
- rejet d'une fourchette partielle ;
- rejet du mélange entre valeur ponctuelle et fourchette ;
- absence de permutation, complétion ou conversion silencieuse ;
- contrainte `G_low <= G_base <= G_high` ;
- conservation explicite des fourchettes dégénérées ;
- valeurs nulles et négatives ;
- même tolérance absolue-relative que le moteur ponctuel ;
- égalité au seuil non qualifiée de marge positive ;
- égalité au plancher variable qualifiée d'inatteignable pour une marge strictement positive ;
- marges nettes basse, centrale et haute en taux et en euros ;
- états `survives_full_range`, `crosses_break_even` et `fails_full_range` ;
- états par rapport au plancher variable ;
- frontières de taille conditionnelles par hypothèse ;
- réconciliations et ordre monotone des marges ;
- ordre inverse des tailles frontières lorsque calculables ;
- rétrocompatibilité du seuil, du mode ponctuel et des six scénarios synthétiques antérieurs ;
- absence de `NaN`, `Infinity` et `-0` dans l'arbre et l'interface.

## Cas synthétique principal inspecté

Entrées :

```text
capital = 5 000 EUR
ordre = 500 EUR
aller-retour
commission = 1 EUR par côté
change = 0,25 % par côté
spread total = 0,10 %
slippage total = 0,10 %
G_low = 0,80 %
G_base = 2,00 %
G_high = 3,00 %
```

Résultats :

```text
coût fixe = 2,00 EUR
plancher variable = 0,70 %
coût total = 5,50 EUR
seuil brut = 1,10 %

marge basse = -0,30 % = -1,50 EUR
marge centrale = 0,90 % = 4,50 EUR
marge haute = 1,90 % = 9,50 EUR

état = crosses_break_even
frontière basse = ordre strictement supérieur à 2 000 EUR
frontière centrale = ordre strictement supérieur à 153,846153846... EUR
frontière haute = ordre strictement supérieur à 86,956521739... EUR
```

Ces valeurs sont des oracles synthétiques. Elles ne décrivent aucun rendement, tarif ou utilisateur réel.

## Commandes exécutées dans GitHub Actions

### Numérique

```text
node tests/h1_strict_numeric_validation.test.js
node tests/h2_journal_net_bases.test.js
node tests/validation_calculator.test.js
node capital_efficiency_lab/tests/engine.test.js
node capital_efficiency_lab/tests/scenario_matrix.test.js
node capital_efficiency_lab/tests/edge_range.test.js
```

Résultat : toutes les suites ont réussi, dont :

```text
Capital Efficiency engine tests passed
Capital Efficiency scenario matrix passed: 6 synthetic cases
Edge Survival Envelope tests passed
```

### Intégrité locale

```text
python3 tests/validation_static_integrity.py
python3 capital_efficiency_lab/tests/static_integrity.py
```

Résultat :

```text
Static integrity passed: 7 local references, 43171 active bytes, no network or persistence capability
Capital Efficiency static integrity passed: 82422 bytes, local-only assets
```

### Navigateur

Les suites historiques, Q0 et Capital Efficiency ont été exécutées dans Chromium, puis le parcours Envelope à :

```text
390 px
768 px
1024 px
1440 px
```

Résultat :

```text
Cost Intelligence browser tests passed at 390/768/1024/1440 px
Edge Survival Envelope browser tests passed: 390/768/1024/1440
```

Le test couvre notamment :

- parcours progressif ;
- seuil autonome ;
- mode ponctuel ;
- mode fourchette ;
- changement de signe autour du seuil ;
- fourchette dégénérée ;
- ordre invalide et focus sur la première erreur ;
- navigation clavier ;
- annonce `aria-live` ;
- absence de débordement horizontal ;
- position finale des résultats sous le header sticky après stabilisation du défilement.

## Défaut découvert et corrigé

Une première inspection des captures a montré que le header sticky pouvait recouvrir visuellement le titre pendant le défilement vers les résultats.

Un test de position a été ajouté. Il a échoué sur le head `8f71303d3d332cc0b00862f0844d15be0166f78e`, avec le résultat commençant au-dessus de la limite du header.

La correction ajoute une marge de défilement adaptée sur le panneau de résultats et attend la fin du défilement doux avant mesure et capture. Le run final `29285336970` valide la position finale aux quatre largeurs.

## Captures inspectées

Les artefacts du run contiennent les vues suivantes à 390, 768 et 1 440 pixels :

- formulaire seuil ;
- résultat seuil ;
- résultat ponctuel ;
- fourchette traversant le seuil ;
- fourchette entièrement au-dessus du seuil ;
- fourchette entièrement sous le seuil ;
- fourchette dégénérée au seuil.

Inspection interne :

- hiérarchie financière claire ;
- titre complet visible sous le header ;
- coût en euros maintenu au rang explicatif ;
- conclusion de stabilité prioritaire ;
- marges basse, centrale et haute lisibles ;
- frontières présentées comme conditions, sans prescription ;
- mise en page mobile longue mais ordonnée et sans débordement ;
- aucune apparence de signal, casino, terminal institutionnel fictif ou gadget IA.

## Non-régressions

Le build historique reste inchangé :

```text
taille = 166 862 octets
SHA-256 = dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf
```

Les suites H1, H2, C1, C2, C3, C4, Q0, Capital Efficiency et matrice synthétique ont réussi dans le même run.

## Artefact

- Nom : `breaktest-validation-logs`
- Run : `29285336970`
- Digest fourni par GitHub : `sha256:6a107b196e1c541222b1b1c1a6141124094e4bd68deb860c4a19a885c9b18bbc`

## Limites restantes

Cette validation ne prouve pas :

- que les utilisateurs savent construire une fourchette crédible ;
- que les bornes représentent correctement l'incertitude de leur méthode ;
- que l'interface est comprise sans aide en moins de 90 secondes ;
- que le produit modifie une décision réelle ;
- qu'il produit une seconde utilisation ;
- qu'un import réel est demandé ;
- qu'un utilisateur paiera ;
- que Safari ou l'iPad natif reproduisent exactement Chromium ;
- qu'une stratégie possède réellement un avantage ;
- qu'une taille ou une fréquence est appropriée ;
- qu'un rendement futur est probable.

Aucune donnée réelle, connexion, stockage, analytics, email, paiement, import, courtier, recommandation ou publication n'est actif.
