# Validation — Cost Gate foundation synthétique

## Statut

- Branche : `strategy/cost-gate-foundation`
- Head fonctionnel version `0` : `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4`
- Head documentaire version `0` : `be6aa09d2b87bb07bd19258f393b496e522580a1`
- Pull request : `#24`
- GitHub Actions version `0` : runs `29334708343` (`#604`) et `29335825348` (`#606`), `success`
- Head fonctionnel version `1` : `2ebf0e3e37852e4f3252e54149e147aa0d5712c3`
- GitHub Actions version `1` : run `29338189190` (`#608`), `success`
- Moteur prouvé à distance : `cost-gate-foundation-1-synthetic`
- Artefact version `1` : `8312898043`, digest `sha256:c22d2973aefe1c4d2cbef06cbae12ad67a6b08342c413e0198622078752d9183`
- Nature de la preuve : technique, quantitative, synthétique et interne
- Interface Cost Gate : aucune dans ce run
- Publication, donnée réelle et connexion : interdites

Le run `#604` valide le head fonctionnel de la version `0` et le run `#606` sa synchronisation documentaire. Le run `#608` valide la version `1` sur son head fonctionnel exact. La présente mise à jour de preuve reste documentaire et exige à son tour un run exact-head avant clôture de la stabilisation.

## Revue rétrospective de la version `0`

La revue automatisée demandée sur le head exact `be6aa09d2b87bb07bd19258f393b496e522580a1` a ouvert trois défauts :

- une erreur de friction pouvait empêcher le constat cash pourtant calculable indépendamment ;
- l'expiration d'une source pouvait laisser les anciens constats actifs lorsque le hash de contenu restait identique ;
- une source stale pouvait masquer un conflit instrument/place/devise indépendant.

L'audit adjacent a révélé trois autres causes :

- `entry_leg` avec deux côtés ou `complete_round_trip` avec un seul côté restait accepté ;
- l'ordre des holds, sources, contraintes ou exclusions pouvait modifier l'identité d'un snapshot économiquement identique ;
- un avantage absorbé pouvait être résumé comme `constraint_breach` sans contrainte utilisateur explicite.

La version `1` corrige ces causes sans modifier les formules économiques de seuil, de cash ou d'avantage. Elle ajoute des oracles distincts pour le cas strictement inférieur, l'égalité au seuil, la contrainte utilisateur réelle, l'expiration à hash inchangé, les constats stale et conflit simultanés, l'indépendance des couches et l'ordre des ensembles. Ces changements sont prouvés à distance par le run `#608`.

### Prévalidation locale puis validation distante de la version `1`

Les commandes moteur, scénarios, propriétés, syntaxe et intégrité ont été réellement exécutées sur les fichiers locaux corrigés :

```text
Cost Gate foundation engine tests passed
Cost Gate foundation scenario matrix passed: CG-01 to CG-18
Cost Gate foundation property tests passed
Cost Gate foundation static integrity passed: 5 local files, 72619 bytes, no network or persistence capability
```

Les non-régressions numériques et statiques historiques, Q0, Capital Efficiency et Edge Survival réussissent aussi localement. Playwright et Chromium n'étaient pas présents dans cet environnement local ; GitHub Actions a donc exécuté les régressions navigateur et les captures sur le head poussé exact.

## Périmètre exécuté

Le moteur isolé `cost_gate_foundation/` accepte uniquement :

```text
cash_account
long_cash_purchase
spot_equity ou spot_etf
account_currency = EUR
user_assumption ou synthetic_demo
aucune transmission d'ordre
```

Marge, short, dérivés, autres modèles de capital et provenance externe sont refusés par `unsupported_scope` ou entrée invalide. Le moteur ne contient ni réseau, ni persistance, ni fournisseur de données, ni compte, ni interface, ni recommandation.

## Défauts révélés puis corrigés par la revue hostile

### Cash du compte contre allocation de stratégie

La première formule pouvait qualifier l'entrée avec tout le cash réglé du compte, même si l'utilisateur avait déclaré une allocation de stratégie plus basse.

La base exécutée devient :

```text
account_free_settled_cash_eur =
  available_settled_cash_eur
  - holds non déjà inclus par la source
  - user_defined_cash_reserve_eur

strategy_allocation_headroom_eur =
  strategy_capital_eur
  - strategy_capital_committed_eur

capital_feasibility_cash_eur = min(
  account_free_settled_cash_eur,
  strategy_allocation_headroom_eur
)
```

CG-14 prouve qu'un compte avec 1 000 EUR de cash ne rend pas finançable un engagement de 400 EUR lorsque l'allocation libre de stratégie n'est que de 350 EUR.

### Holds déjà inclus par la source

Chaque réservation possède un `hold_id` unique et deux indicateurs d'inclusion. Un hold déjà retranché du cash publié par la source n'est pas déduit une seconde fois.

Les tests couvrent :

- source brute avant hold ;
- source déjà nette du même hold ;
- hold dupliqué ;
- réserve utilisateur présente dans le ledger sans double retrait ;
- réconciliation des holds déjà inclus dans le capital engagé de stratégie.

### Cash immédiat contre friction du cycle

Oracle principal :

```text
nominal économique = 500,00 EUR
commission aller-retour = 2,00 EUR
change aller-retour = 2,50 EUR
spread + slippage du cycle = 1,00 EUR
lifecycle_friction_eur = 5,50 EUR
break_even_gross_rate = 1,10 %

entry_asset_consideration = 500,00 EUR
commission d'entrée = 1,00 EUR
change d'entrée = 1,25 EUR
entry_cash_requirement_eur = 502,25 EUR
```

Les coûts futurs de sortie et les effets de prix déjà incorporés ne sont pas ajoutés au cash d'entrée. Les sommes `505 EUR` et `505,50 EUR` sont explicitement rejetées comme oracles de ce cas.

### Identité du snapshot

Le moteur sépare :

- hash du scénario ;
- hash des entrées ;
- hash des sources ;
- hash de contenu du snapshot ;
- identifiant d'instance de calcul.

Les timestamps générés et identifiants ne se hashent pas eux-mêmes. Deux instances du même contenu donnent le même `snapshot_id`. Une modification de taille donne un nouvel identifiant et rend les anciens constats inactifs. Le passage du temps peut expirer une source sans changer son contenu hashé.

### Alignement de l'avantage brut

Le moteur vérifie instrument, place, direction, portée, règles d'entrée/sortie, horizon, dénominateur, base de prix, devise, traitement FX, base brute/nette, coûts exclus, estimateur, période, observations et version de règle.

Une performance provenant de prix d'exécution est rejetée comme brut avant friction sans reconstruction versionnée. Le seuil de couverture indépendant reste calculable ; Edge Survival reste non évalué.

### Constats et synthèse

La sortie canonique conserve `findings[]`. La synthèse ne supprime aucun constat.

CG-12 prouve simultanément :

- donnée synthétique d'exécution stale non critique ;
- cash insuffisant ;
- avantage sous le plancher variable.

L'impossibilité structurelle démontrée reste le facteur principal. La donnée stale et le cash insuffisant restent présents. Si le plancher dépendait de la donnée manquante, le moteur n'inventerait pas le constat structurel.

L'ancien vocabulaire `compatible_under_assumptions` / `adjustment_required` est retiré. La synthèse favorable maximale est `no_incompatibility_detected_under_assumptions`, avec couches non évaluées visibles.

## Matrice CG-01 à CG-18

Les 18 scénarios documentés sont exécutés :

| Scénario | Preuve principale |
|---|---|
| CG-01 | seuil calculé sans inventer `G` ni capital |
| CG-02 | avantage aligné, cash suffisant, exécution non évaluée |
| CG-03 | exact seuil, marge nulle, pas de marge positive |
| CG-04 | sous plancher, frontière structurellement indisponible |
| CG-05 | avantage survivant et cash insuffisant simultanés |
| CG-06 | 502,25 EUR immédiats distincts de 5,50 EUR de cycle |
| CG-07 | spread incorporé non ajouté deux fois au cash |
| CG-08 | statut d'inclusion inconnu conservé comme conflit |
| CG-09 | quote stale strictement `synthetic_demo` |
| CG-10 | conflit instrument/place/devise |
| CG-11 | avantage brut mal aligné rejeté, seuil conservé |
| CG-12 | trois constats indépendants sans perte |
| CG-13 | mutation de taille, ancien snapshot obsolète |
| CG-14 | holds et allocation de stratégie réconciliés |
| CG-15 | marge, short et option non supportés |
| CG-16 | égalité à une contrainte `<=` classée satisfaite |
| CG-17 | composantes connues visibles, total complet indisponible |
| CG-18 | aucune incompatibilité détectée, liquidité non évaluée visible |

Les tests de propriétés ajoutent monotonie du seuil, plafonnement du cash, ordre stable des constats, hash indépendant de l'ordre des clés et des ensembles économiquement non ordonnés, ainsi que le rejet d'une clé `G` réellement incompatible malgré un statut déclaré aligné.

## Commandes exécutées par GitHub Actions

### Cost Gate foundation

```text
node cost_gate_foundation/tests/engine.test.js
node cost_gate_foundation/tests/scenario_matrix.test.js
node cost_gate_foundation/tests/properties.test.js
python3 cost_gate_foundation/tests/static_integrity.py
```

Résultat :

```text
Cost Gate foundation engine tests passed
Cost Gate foundation scenario matrix passed: CG-01 to CG-18
Cost Gate foundation property tests passed
Cost Gate foundation static integrity passed: 5 local files, 64260 bytes, no network or persistence capability
```

### Non-régressions

Le même run exécute :

- build déterministe historique ;
- H1–H2 et C1–C4 ;
- Q0 Cost Intelligence ;
- Capital Efficiency ;
- Edge Survival point et fourchette ;
- entrées annuelles facultatives ;
- intégrité locale ;
- navigateur Chromium à 390, 768, 1 024 et 1 440 px ;
- syntaxe Python et JavaScript.

Résultats observés :

```text
build historique = 166862 octets
SHA-256 = dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf
Cost Intelligence browser tests passed at 390/768/1024/1440 px
Edge Survival Envelope browser tests passed: 390/768/1024/1440
```

## Artefact et inspection

- Nom : `breaktest-validation-logs`
- Artifact ID : `8311484443`
- Run : `29334708343`
- Head : `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4`
- Digest GitHub : `sha256:f95dfd83ba47ca1b1896dece5259a0831db96ff7156d0e194088fb40e6a24b46`

L'archive téléchargée possède le même SHA-256 que le digest GitHub.

La capture Edge Survival à 390 px du cas dégénéré confirme le texte exact au seuil. La capture à 1 440 px du cas traversant confirme la mise en page desktop. Toutes deux sont sans skip link parasite, header répété, coupure ou débordement visible. Elles prouvent une non-régression de l'interface fusionnée, pas une interface Cost Gate.

La synchronisation documentaire version `0` a aussi produit :

- Artifact ID : `8311933256` ;
- Run : `29335825348` (`#606`) ;
- Head : `be6aa09d2b87bb07bd19258f393b496e522580a1` ;
- Digest GitHub : `sha256:13f4dc9fbd1add1252d85a88094cc8675152b47c4e61cdb99629efa242010030`.

Cet artefact historique ne prouve pas la version `1`, dont la preuve distincte figure ci-dessous.

### Artefact et inspection de la version `1`

- Nom : `breaktest-validation-logs` ;
- Artifact ID : `8312898043` ;
- Run : `29338189190` (`#608`) ;
- Head : `2ebf0e3e37852e4f3252e54149e147aa0d5712c3` ;
- Digest GitHub et archive téléchargée : `sha256:c22d2973aefe1c4d2cbef06cbae12ad67a6b08342c413e0198622078752d9183`.

Les logs prouvent :

- moteur, CG-01 à CG-18 et propriétés réussis ;
- intégrité Cost Gate réussie sur cinq fichiers et `72 619` octets ;
- build historique déterministe inchangé à `166 862` octets et SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf` ;
- H1–H2, C1–C4, Q0, Capital Efficiency et Edge Survival réussis ;
- Chromium réussi à 390, 768, 1 024 et 1 440 px ;
- captures et syntaxe réussies.

La capture réelle à 390 px du cas dégénéré montre le texte `Aucune hypothèse ne produit de marge positive`, les trois marges nettes à `0,00 %` et la mention que l'hypothèse haute ne dépasse pas le seuil. L'ancienne phrase est absente. La capture à 1 440 px du cas traversant, ainsi que les formulaires neutres aux deux largeurs, ne montrent ni lien d'évitement parasite, ni header dupliqué, ni coupure ou débordement visible.

Le test navigateur prouve aussi que le lien d'évitement reste le premier élément atteint par Tab et visible au focus. Le script de capture focalise uniquement un élément temporaire hors écran, vérifie que le lien est déjà hors viewport, applique ses ajustements uniquement pendant la capture puis restaure les styles et supprime cet élément. Aucun CSS produit ni comportement d'accessibilité réel n'a été modifié pour les captures.

## Limites restantes

Cette validation ne prouve pas :

- une donnée de marché réelle, actuelle ou licenciée ;
- la lecture d'un compte, d'un cash réglé ou de holds réels ;
- une précision d'exécution ;
- une probabilité d'exécution ;
- un moteur marge, short, dérivés ou portefeuille ;
- une interface Cost Gate ;
- une compréhension utilisateur ;
- une amélioration de décision réelle ;
- un usage répété ou un paiement ;
- une conformité juridique ou réglementaire ;
- une validation commerciale ;
- un package HTML prêt à remettre.

Le moteur démontre uniquement que les contrats de fondation peuvent être orchestrés de façon déterministe sur des hypothèses manuelles ou synthétiques dans le domaine restreint déclaré.
