# Validation — Cost Gate foundation synthétique

## Statut

- Branche : `strategy/cost-gate-foundation`
- Head fonctionnel exact : `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4`
- Pull request : `#24`
- GitHub Actions : run `29334708343` (`#604`)
- Conclusion : `success`
- Moteur : `cost-gate-foundation-0-synthetic`
- Nature de la preuve : technique, quantitative, synthétique et interne
- Interface Cost Gate : aucune dans ce run
- Publication, donnée réelle et connexion : interdites

Le run `#604` valide le head fonctionnel ci-dessus. Une exécution exact-head reste obligatoire après la synchronisation documentaire qui ajoute le présent fichier.

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

Les tests de propriétés ajoutent monotonie du seuil, plafonnement du cash, ordre stable des constats, hash indépendant de l'ordre des clés et rejet d'une clé `G` réellement incompatible malgré un statut déclaré aligné.

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
