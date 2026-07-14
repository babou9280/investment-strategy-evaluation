# Validation — Edge Survival Envelope

## Statut

- Branche : `strategy/edge-survival-envelope`
- Head fonctionnel exact inspecté : `714e9628e893d419474c00a9c982f25492b7a164`
- Pull request : `#23`
- GitHub Actions : run `29330727579` (`#540`)
- Conclusion : `success`
- Moteur : `capital-efficiency-lab-4-optional-annual`
- Nature de la preuve : technique, quantitative, responsive et interne
- Publication externe : non autorisée
- Cost Gate : direction stratégique documentée, aucune implémentation dans ce run

Une nouvelle exécution exact-head reste obligatoire après toute synchronisation documentaire ultérieure.

## Objet validé

Le laboratoire Capital Efficiency accepte exactement trois modes :

1. seuil de couverture sans hypothèse de rendement brut ;
2. valeur brute ponctuelle fournie par l'utilisateur ;
3. fourchette basse, centrale et haute entièrement fournie par l'utilisateur.

Le mode fourchette mesure si une conclusion reste stable après les frictions saisies. Il ne produit ni probabilité, ni intervalle de confiance, ni prévision, ni recommandation.

Le capital et la fréquence sont facultatifs pour le seuil par opération. Ils deviennent nécessaires uniquement pour les sorties annuelles ou contraintes qui les utilisent.

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
- capital et fréquence absents, nuls, invalides ou présents ;
- cohérence profonde entre point et fourchette dégénérée ;
- rétrocompatibilité du seuil, du mode ponctuel et des six scénarios synthétiques antérieurs ;
- résultat masqué après modification d'une entrée ;
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

## Cas exact au seuil

Entrées :

```text
G_low = G_base = G_high = 1,10 %
```

Résultats attendus et observés :

```text
range_shape = degenerate
range_state = fails_full_range
marges basse / centrale / haute = 0,00 %
aucune marge strictement positive
```

Le texte principal est désormais :

```text
Aucune hypothèse ne produit de marge positive
```

Il ne dit plus que les frictions ne sont pas couvertes, car une hypothèse exactement au seuil couvre les frictions sans produire de marge positive.

## Commandes exécutées dans GitHub Actions

### Numérique

```text
node tests/h1_strict_numeric_validation.test.js
node tests/h2_journal_net_bases.test.js
node tests/validation_calculator.test.js
node capital_efficiency_lab/tests/engine.test.js
node capital_efficiency_lab/tests/scenario_matrix.test.js
node capital_efficiency_lab/tests/edge_range.test.js
node capital_efficiency_lab/tests/point_range_consistency.test.js
node capital_efficiency_lab/tests/optional_annual_inputs.test.js
```

Résultat :

```text
Capital Efficiency engine tests passed
Capital Efficiency scenario matrix passed: 6 synthetic cases
Edge Survival Envelope tests passed
Point/range consistency regression tests passed
Optional annual input regression tests passed
```

### Intégrité locale

```text
python3 tests/validation_static_integrity.py
python3 capital_efficiency_lab/tests/static_integrity.py
```

Résultat :

```text
Static integrity passed: 7 local references, 43171 active bytes, no network or persistence capability
Capital Efficiency static integrity passed: 86142 bytes, local-only assets
```

### Navigateur

Les suites historiques, Q0 et Capital Efficiency ont été exécutées dans Chromium. Le parcours Envelope a été exécuté à :

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

- formulaire initial neutre ;
- skip link réellement accessible au premier `Tab` ;
- parcours progressif ;
- seuil autonome sans capital ni fréquence ;
- mode ponctuel ;
- mode fourchette ;
- changement de signe autour du seuil ;
- fourchette dégénérée exactement au seuil ;
- ordre invalide et focus sur la première erreur ;
- masquage immédiat d'un résultat devenu obsolète ;
- navigation clavier ;
- annonce `aria-live` ;
- absence de débordement horizontal ;
- position finale des résultats sous le header sticky après stabilisation du défilement ;
- absence de termes probabilistes ou prescriptifs interdits.

## Défauts découverts et corrigés

### Header recouvrant le résultat

Une première inspection a montré que le header sticky pouvait recouvrir le titre pendant le défilement vers les résultats.

Un test de position a été ajouté. La correction ajoute une marge de défilement adaptée et attend la fin du défilement doux avant mesure.

### Résultat obsolète après modification

Le résultat calculé pouvait rester visible alors que les hypothèses avaient changé. La couche dédiée `result_freshness.js` neutralise les valeurs initiales et masque le résultat après toute modification utilisateur fiable.

Le comportement est testé dans Chromium. Une duplication accidentelle de cette logique dans `app.js` a été détectée puis supprimée afin de conserver une source unique pour cette responsabilité.

### Sémantique de l'égalité au seuil

La formule classait correctement une fourchette dégénérée exactement au seuil, mais le texte principal disait à tort que les hypothèses ne couvraient pas les frictions.

La formulation a été corrigée et protégée par :

- un oracle numérique explicite ;
- un test navigateur ;
- une inspection des captures à 390 et 1 440 pixels.

### Artefacts des captures full-page

Les captures Chromium pleine page pouvaient répéter artificiellement le skip link ou déplacer le header sticky pendant l'assemblage des tuiles. Il s'agissait d'un défaut de preuve visuelle, pas du produit.

Le générateur applique désormais uniquement pendant la capture :

- un focus hors écran ;
- le masquage du skip link ;
- le passage du header sticky en flux normal.

Ces overrides sont retirés immédiatement après la capture. Le comportement réel du skip link reste vérifié séparément par le test clavier.

## Captures inspectées

L'artefact du run contient, à 390, 768 et 1 440 pixels :

- formulaire seuil neutre ;
- résultat seuil ;
- résultat ponctuel ;
- fourchette traversant le seuil ;
- fourchette entièrement au-dessus du seuil ;
- fourchette entièrement sous le seuil ;
- fourchette dégénérée au seuil ;
- vue pleine page du scénario principal.

Inspection interne du run `29330727579` :

- hiérarchie financière claire ;
- titre complet visible ;
- skip link absent des captures sans dégrader sa fonction réelle ;
- header représenté une seule fois en position normale ;
- coût en euros maintenu au rang explicatif ;
- conclusion de stabilité prioritaire ;
- marges basse, centrale et haute lisibles ;
- égalité au seuil formulée sans contradiction ;
- frontières présentées comme conditions, sans prescription ;
- mise en page mobile longue mais ordonnée et sans débordement ;
- aucune apparence de signal, casino, terminal institutionnel fictif ou gadget IA.

## Non-régressions

Le build historique reste inchangé :

```text
taille = 166 862 octets
SHA-256 = dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf
```

Les suites H1, H2, C1, C2, C3, C4, Q0, Capital Efficiency, point/range et matrice synthétique ont réussi dans le même run.

## Artefact

- Nom : `breaktest-validation-logs`
- Run : `29330727579`
- Head : `714e9628e893d419474c00a9c982f25492b7a164`
- Digest fourni par GitHub : `sha256:ba78f49b8f39ae270ffa30864ae8498a148d3157d8c8f09c040cec3ae3b6c1e2`

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
- qu'un rendement futur est probable ;
- que Cost Gate est fonctionnel, précis, juridiquement acceptable ou commercialement utile.

Aucune donnée réelle, connexion, stockage, analytics, email, paiement, import, courtier, recommandation ou publication n'est actif.