# Validation — Cost Gate foundation synthétique

## Statut

- Branche réalisée : `strategy/cost-gate-foundation`
- Head fonctionnel version `0` : `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4`
- Head documentaire version `0` : `be6aa09d2b87bb07bd19258f393b496e522580a1`
- Pull request : `#24`
- GitHub Actions version `0` : runs `29334708343` (`#604`) et `29335825348` (`#606`), `success`
- Head fonctionnel version `1` : `2ebf0e3e37852e4f3252e54149e147aa0d5712c3`
- GitHub Actions version `1` : run `29338189190` (`#608`), `success`
- Head documentaire version `1` : `9d38ce31e33b41159d0c6180205c3747c3bb6f1d`
- GitHub Actions documentaire version `1` : run `29338812831` (`#610`), `success`
- Artefact documentaire final version `1` : `8313153630`, digest `sha256:5bb9c173f41636f484160ad5a54eb6ac28c8ef725620de6a68a593d6066abbae`
- Head fonctionnel version `2` : `faafd348da55217e96ba67efd9f9434be62725ca`
- GitHub Actions version `2` : run `29342135098` (`#612`), `success`
- Artefact fonctionnel version `2` : `8314518122`, digest `sha256:12b2b247607237b3b5ce2725bd4fbb49a5f6c4b67122ad6f52530b3f29bcda9b`
- Head documentaire version `2` : `6cfc43e4bbb015c8512c0ae26aad02d04503c897`
- GitHub Actions documentaire version `2` : run `29343483769` (`#614`), `success`
- Artefact documentaire version `2` : `8315079343`, digest `sha256:e4d864fa200f0d4c5b922ae2dcf87500ac85846e00fe7aa79edee20c7fb1f105`
- Head fonctionnel version `3` : `753152d9cce1feabba48e54b32b4eed2ce3f5e07`
- GitHub Actions version `3` : run `29345208179` (`#616`), `success`
- Moteur prouvé à distance : `cost-gate-foundation-3-synthetic`
- Artefact fonctionnel version `3` : `8315786779`, digest `sha256:67b4603cfd95271a4916ee04e36ed229cb352a6526b0a25f40fd1089dcb8b614`
- Head documentaire version `3` : `3fb6341d51ff46b70dd774546955fbb1c66a400e`
- GitHub Actions documentaire version `3` : run `29346211285` (`#618`), `success`
- Artefact documentaire version `3` : `8316213225`, digest `sha256:50096ccdf90c9bd5d190151f41e24f7f52d972f7cc3878a2c20f1e920ab7a996`
- Fusion : squash commit `e61d166d81da54a7d4ee596db2c2447fcb418eb2`, tree `62ad8094cfee5aff31e2d65fdd56da2ba057f5dc`
- Nature de la preuve : technique, quantitative, synthétique et interne
- Interface Cost Gate : aucune dans ce run
- Publication, donnée réelle et connexion : interdites

Le run `#604` valide le head fonctionnel de la version `0` et le run `#606` sa synchronisation documentaire. Les runs `#608`/`#610` et `#612`/`#614` valident respectivement les versions `1` et `2`, puis leur synchronisation. Le run `#616` valide la version `3` sur son head fonctionnel exact et le run `#618` sa synchronisation documentaire. La fondation est clôturée par la fusion en squash de la PR `#24`.

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

## Revue exacte de la version `1` et révision `2`

La revue automatisée demandée sur le head exact `9d38ce31e33b41159d0c6180205c3747c3bb6f1d` a ouvert quatre défauts :

- `order_notional_eur` pouvait différer de quantité × prix alors que la friction et le cash décrivaient ensuite deux montants différents ;
- une source observée après `evaluated_at_utc` pouvait être classée actuelle ;
- une source non critique pouvait raccourcir `expires_at_utc` de tout le snapshot ;
- un ledger, des sources, des contraintes ou des exclusions non-tableaux pouvaient être assimilés à une collection vide ou provoquer une erreur non contrôlée.

L'audit adjacent a reproduit quatre causes supplémentaires : `gross_before_declared_holds` pouvait coexister avec un hold marqué déjà inclus et surestimer le cash libre ; le scénario de référence facturait du change malgré deux devises EUR ; commission et change d'entrée pouvaient contredire le cycle ; une taxe ou un frais d'entrée pouvait rester absent du seuil économique.

La version `2` ajoute les réconciliations et refus correspondants. Les commandes ciblées réellement exécutées localement donnent :

```text
Cost Gate foundation engine tests passed
Cost Gate foundation scenario matrix passed: CG-01 to CG-18
Cost Gate foundation property tests passed
Cost Gate foundation static integrity passed: 5 local files, 88735 bytes, no network or persistence capability
```

Cette prévalidation a été confirmée à distance sur le head exact `faafd348da55217e96ba67efd9f9434be62725ca` par le run `#612`, puis sa synchronisation documentaire par le run `#614`. Les quatre fils ont été résolus avec ces preuves ; les neuf fils inline de la PR sont désormais résolus.

## Revue hostile indépendante et révision `3`

Une dernière revue automatisée a été demandée sur le head exact `6cfc43e4bbb015c8512c0ae26aad02d04503c897`, mais le service a répondu que le quota de revue était atteint. Aucun avis automatisé n'a donc été inventé ou assimilé à une réussite.

La revue hostile indépendante a reproduit quatre défauts adjacents :

- le conflit même devise / FX non nul dépendait de la présence de la vue cash ;
- une taxe ou un frais contractuel d'entrée absent du cycle bloquait la synthèse globale, mais la friction et Edge Survival pouvaient encore paraître complets ;
- une heure d'évaluation invalide ajoutait une erreur sans rendre le snapshot incomplet ni les anciens constats inactifs à hash identique ;
- une source sans instrument, place, devise ou booléen critique explicite pouvait encore recevoir un constat d'actualité.

La correction a aussi ajouté une régression explicite pour conserver la règle existante : une source non critique stale ne raccourcit pas l'expiration agrégée, mais ne peut pas coexister avec un constat affirmant que toutes les sources sont actuelles.

La version `3` a été prévalidée localement puis confirmée à distance sur le head exact `753152d9cce1feabba48e54b32b4eed2ce3f5e07` par le run `#616` :

```text
Cost Gate foundation engine tests passed
Cost Gate foundation scenario matrix passed: CG-01 to CG-18
Cost Gate foundation property tests passed
Cost Gate foundation static integrity passed: 5 local files, 94064 bytes, no network or persistence capability
```

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

La version `2` exige en plus que `source_included_hold_ids[]` corresponde exactement aux indicateurs du ledger. Une base brute avec un hold inclus, une liste divergente ou une réserve utilisateur déjà nette devient `cash_basis_conflicted` ; aucun cash favorable n'est calculé sur cette contradiction.

Les tests couvrent :

- source brute avant hold ;
- source déjà nette du même hold ;
- hold dupliqué ;
- réserve utilisateur présente dans le ledger sans double retrait ;
- réconciliation des holds déjà inclus dans le capital engagé de stratégie ;
- contradiction base brute / hold inclus ;
- divergence liste source / ledger ;
- réserve utilisateur déjà retranchée par la source.

### Nominal économique contre quantité et prix

La fondation utilise un seul prix de référence en devise du compte. Elle réconcilie donc quantité × prix avec `entry_asset_consideration_eur` et avec `order_notional_eur`. Le cas 5 × 100 EUR avec 500 EUR de cash mais 1 000 EUR de nominal économique produit désormais `cash_basis_conflicted` au lieu d'une synthèse favorable.

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

La cotation synthétique est désormais USD pour un compte EUR, ce qui rend le change de 0,25 % par côté cohérent. Les versions `2` et `3` bloquent aussi :

- un coût FX non nul lorsque compte et cotation ont la même devise ;
- ce même conflit dans la friction même lorsque la vue cash est absente, tout en conservant valide le cas FX nul ;
- une commission d'entrée différente de la commission par côté du modèle de cycle ;
- un coût FX d'entrée différent de `nominal × taux FX par côté` ;
- une taxe ou un frais contractuel d'entrée non nul tant que sa contrepartie de cycle n'est pas modélisée ; la friction devient incomplète et Edge Survival reste indisponible ;
- une composante cash absente au lieu d'un zéro explicite.

### Identité du snapshot

Le moteur sépare :

- hash du scénario ;
- hash des entrées ;
- hash des sources ;
- hash de contenu du snapshot ;
- identifiant d'instance de calcul.

Les timestamps générés et identifiants ne se hashent pas eux-mêmes. Deux instances du même contenu donnent le même `snapshot_id`. Une modification de taille donne un nouvel identifiant et rend les anciens constats inactifs. Le passage du temps peut expirer une source sans changer son contenu hashé.

La version `2` refuse une source observée après l'heure d'évaluation par `snapshot_temporally_inconsistent`. L'expiration agrégée est le minimum des seules sources critiques : une source non critique stale reste visible, mais ne périme pas à elle seule tous les constats ni leur comparaison.

La version `3` exige en plus instrument, place, devise de cotation et booléen critique non ambigus pour chaque source. Une heure d'évaluation absente ou invalide rend le snapshot incomplet ; à contenu identique, `compareSnapshots` rend alors les anciens constats inutilisables. Aucun constat positif d'actualité globale n'est émis pour une source incomplète, une heure invalide ou une collection contenant une source stale.

Les collections fournies comme objets au lieu de tableaux sont des entrées invalides. Leurs éléments doivent aussi être des objets valides avec identifiants stables et non dupliqués lorsqu'ils pilotent une source ou une contrainte. Les régressions couvrent `cash.holds`, `sources`, `userConstraints` et `costExclusions` afin qu'aucun hold, provenance ou contrainte ne disparaisse silencieusement.

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
Cost Gate foundation static integrity passed: 5 local files, 88735 bytes, no network or persistence capability
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

La synchronisation documentaire finale de la version `1` a ensuite produit :

- Run : `29338812831` (`#610`), `success` ;
- Head : `9d38ce31e33b41159d0c6180205c3747c3bb6f1d` ;
- Artifact ID : `8313153630` ;
- digest GitHub et archive téléchargée : `sha256:5bb9c173f41636f484160ad5a54eb6ac28c8ef725620de6a68a593d6066abbae`.

Les captures inspectées à 390 et 1 440 px sont identiques entre les runs `#608` et `#610`. Les 25 fichiers contrôlés correspondent à leurs blobs distants sur le head `9d38ce31e33b41159d0c6180205c3747c3bb6f1d`.

La capture réelle à 390 px du cas dégénéré montre le texte `Aucune hypothèse ne produit de marge positive`, les trois marges nettes à `0,00 %` et la mention que l'hypothèse haute ne dépasse pas le seuil. L'ancienne phrase est absente. La capture à 1 440 px du cas traversant, ainsi que les formulaires neutres aux deux largeurs, ne montrent ni lien d'évitement parasite, ni header dupliqué, ni coupure ou débordement visible.

Le test navigateur prouve aussi que le lien d'évitement reste le premier élément atteint par Tab et visible au focus. Le script de capture focalise uniquement un élément temporaire hors écran, vérifie que le lien est déjà hors viewport, applique ses ajustements uniquement pendant la capture puis restaure les styles et supprime cet élément. Aucun CSS produit ni comportement d'accessibilité réel n'a été modifié pour les captures.

### Artefact et inspection de la version `2`

- Nom : `breaktest-validation-logs` ;
- Run : `29342135098` (`#612`), `success` ;
- Head : `faafd348da55217e96ba67efd9f9434be62725ca` ;
- job : `87116343040`, toutes les étapes réussies ;
- Artifact ID : `8314518122` ;
- taille : `6 042 535` octets ;
- digest GitHub et archive téléchargée : `sha256:12b2b247607237b3b5ce2725bd4fbb49a5f6c4b67122ad6f52530b3f29bcda9b`.

Le workflow de pull request a testé le merge commit `81fb7c39f8f4dd27aee7e116d4ab69c51117fe57`, construit explicitement avec le head `faafd348da55217e96ba67efd9f9434be62725ca` et la base `5f1281b49fde9363dcb38e0225a5d48d34589475`. Les treize blobs modifiés par la version `2` ont été comparés à leurs fichiers locaux et correspondent au tree distant `c5720516ae36994035b6bc9d5be687a3f2d895ca`.

Les logs téléchargés prouvent :

- moteur, CG-01 à CG-18, propriétés et intégrité Cost Gate réussis ;
- build historique inchangé à `166 862` octets et SHA-256 `dfce9e53b7aefdbcdda126c490baa5dc669ea31e87f521f949280f75cf49dacf` ;
- H1–H2, C1–C4, Q0, Capital Efficiency et Edge Survival réussis ;
- Chromium réussi à 390, 768, 1 024 et 1 440 px ;
- captures, syntaxe Python et syntaxe JavaScript réussies.

Les captures suivantes ont été réellement ouvertes et inspectées :

- cas dégénéré à 390 px : texte exact `Aucune hypothèse ne produit de marge positive`, trois marges nettes à `0,00 %`, égalité au seuil visible et ancienne phrase absente ;
- page traversante complète à 390 px et 1 440 px : mise en page cohérente, sans débordement, coupure, header dupliqué ni lien d'évitement visible ;
- formulaires neutres à 390 px et 1 440 px : champs, unités, boutons et pied de page visibles sans artefact de focus.

Les empreintes des deux preuves visuelles principales sont `4462b0ca5e1dbe15b6dd5fe56e5bc5b7122d390ce630333cb634f5aa0459c06d` pour le résultat dégénéré mobile et `3a6c060ae296dd6c621d77ba41ee29b9ea27db203d80128001b0edc71daff08b` pour la page desktop complète. Cette inspection confirme des non-régressions de Capital Efficiency et Edge Survival ; elle ne prouve toujours aucune interface Cost Gate.

### Artefact et inspection de la version `3`

- Nom : `breaktest-validation-logs` ;
- Run : `29345208179` (`#616`), `success` ;
- Head : `753152d9cce1feabba48e54b32b4eed2ce3f5e07` ;
- tree : `574ec387391a995cec167149cc099e87c1f92c02` ;
- job : `87126973528`, toutes les étapes réussies ;
- Artifact ID : `8315786779` ;
- taille : `6 042 535` octets ;
- digest GitHub et archive téléchargée : `sha256:67b4603cfd95271a4916ee04e36ed229cb352a6526b0a25f40fd1089dcb8b614`.

Le workflow de pull request a testé le merge commit `eaf069558b191fde3c80740858641a19b5ae23c6`. La comparaison GitHub le place un commit au-dessus du head fonctionnel, sans différence de fichier, et la base reste exactement `5f1281b49fde9363dcb38e0225a5d48d34589475`. Les dix blobs de la version `3` correspondent aux empreintes locales et au tree distant.

Les logs téléchargés prouvent : moteur, CG-01 à CG-18, propriétés, intégrité `94 064` octets, build historique, H1–H2/C1–C4, Q0, Capital Efficiency, Edge Survival, navigateurs 390/768/1 024/1 440, captures et syntaxes réussis.

Les 24 captures sont bit à bit identiques à celles du run documentaire `#614`. Les captures dégénérée mobile, traversantes complètes 390/1 440 et formulaires neutres 390/1 440 ont été réellement ouvertes. Le texte exact, les trois marges nulles, l'égalité au seuil, le responsive, le footer, le header unique et l'absence de lien d'évitement parasite ou de débordement restent conformes. Les empreintes principales restent `4462b0ca5e1dbe15b6dd5fe56e5bc5b7122d390ce630333cb634f5aa0459c06d` et `3a6c060ae296dd6c621d77ba41ee29b9ea27db203d80128001b0edc71daff08b`.

### Synchronisation documentaire et fusion de la version `3`

- Run : `29346211285` (`#618`), `success` ;
- Head : `3fb6341d51ff46b70dd774546955fbb1c66a400e` ;
- tree : `62ad8094cfee5aff31e2d65fdd56da2ba057f5dc` ;
- job : `87130470167`, toutes les étapes réussies ;
- Artifact ID : `8316213225` ;
- digest GitHub et archive téléchargée : `sha256:50096ccdf90c9bd5d190151f41e24f7f52d972f7cc3878a2c20f1e920ab7a996`.

Les contenus extraits des artefacts `#616` et `#618` sont bit à bit identiques. Les 24 captures ont été confirmées et les vues 390 et 1 440 px ont été ouvertes à nouveau. Les neuf fils inline sont résolus.

La PR `#24` a été fusionnée par squash le 15 juillet 2026. `breaktest-bootstrap` pointe exactement sur `e61d166d81da54a7d4ee596db2c2447fcb418eb2`, dont le tree est identique au head final validé. `main` reste exactement à `6e8c8e801e9821fe212651d684c8fad75dc6abee`.

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
