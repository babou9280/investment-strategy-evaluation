# Prochaine mission Codex — observations Gate 1 Cost Gate

## Statut reconstruit

La direction **Breaktest Cost Gate** est validée stratégiquement. Gate 0 est clôturée. Le premier essai fondateur du bundle Gate 1 sur iPad a reproduit un blocage de démarrage et d'effacement des champs. Un HTML autonome exact et un repli sans JavaScript sont maintenant validés techniquement dans Chromium ; leur nouvel essai sur le même iPad reste obligatoire. Gate 1 n'est pas validée par des utilisateurs.

```text
pull request = #26, draft
base = breaktest-bootstrap
base head = 56fb50954afd7394baf1689e0f1b7220a1fd73fc
active branch = strategy/cost-gate-offline-critique
functional head = bb50550bde077c19b6966e1715e4f7f31dcfe901
functional tree = 021d3ec909d21723332fa420c2ca45127ee6fc67
exact run = 29458950246 (#645), success
artifact = 8360442727
artifact digest = 798c36f33c8bebef178cc785af82ed4591230aa70a9b9f68d373da289efe3e33
standalone html sha256 = 98458817fb59b603955cf5c6c7b309390869b5ab622a314915d0e4bd5e9e3014
internal package sha256 = 3938acbfea3324ddcc34f938322c2e8eb996f39cbf189bf52a7f7ca52e156263
current engine = cost-gate-foundation-3-synthetic
main = 6e8c8e801e9821fe212651d684c8fad75dc6abee, unchanged
participants observed = 0/5
iPad blocker = mitigated technically, real-device retest pending
```

Vérifier ces identifiants sur GitHub à chaque reprise. Une preuve historique ou locale ne remplace jamais le head et le run actuels.

## Objectif immédiat

Faire ouvrir à Ayman le fichier exact `Breaktest_Cost_Gate_Gate_1.html` sur le même iPad et vérifier que la démonstration synthétique produit réellement un résultat. Cet essai fondateur ne compte pas parmi les cinq participants. En cas d'échec, conserver le défaut ouvert et consigner l'application utilisée ; ne pas lancer la cohorte.

## Objectif après réussite de l'essai iPad

Observer cinq participants qualifiés selon `docs/tasks/COST_GATE_OFFLINE_CRITIQUE.md`, sans modifier silencieusement le protocole, puis appliquer exactement les seuils préenregistrés.

La question est :

> Un investisseur autonome comprend-il sans coaching le facteur principal, les couches non évaluées et la limite non prescriptive du résultat, tout en obtenant un premier résultat en trois minutes ou moins ?

## Autorité

- protocole et seuils : `docs/tasks/COST_GATE_OFFLINE_CRITIQUE.md` ;
- matrice technique : `docs/scenarios/COST_GATE_OFFLINE_CRITIQUE_MATRIX.md` ;
- preuve technique : `docs/validation/COST_GATE_OFFLINE_CRITIQUE.md` ;
- gates : `docs/product/COST_GATE_MVP_GATE_MATRIX.md` ;
- formules : moteurs et contrats Cost Gate fusionnés.

## Seuils inchangés

Gate 1 réussit seulement avec cinq observations réelles et si :

- au moins 4 sur 5 identifient le facteur principal sans coaching ;
- 0 sur 5 prennent l'état favorable pour une recommandation, une autorisation ou un feu vert ;
- au moins 3 sur 5 identifient un cas d'usage réel ;
- au moins 3 sur 5 distinguent les entrées disponibles de celles qui leur manquent ;
- au moins 4 sur 5 obtiennent un premier résultat en 180 secondes ou moins ;
- aucun défaut technique bloquant ne fausse une observation.

Une nouvelle cohorte après correction reste séparée de la première. Aucun résultat, verbatim, abandon, paiement ou utilisateur ne peut être inventé.

## Travail autorisé

- préparer le fichier HTML autonome exact pour une session locale ;
- appliquer le script neutre ;
- chronométrer et consigner seulement les observations réelles minimales ;
- corriger un défaut technique réellement reproduit, ajouter sa régression et retester un nouveau head exact ;
- maintenir preuves et angles morts.

## Interdictions

- aucune modification de `main` ;
- aucune nouvelle fonctionnalité Cost Gate avant les observations ;
- aucune donnée réelle, réseau, compte, stockage, analytics ou connexion ;
- aucune recommandation, probabilité, transmission ou exécution ;
- aucune publication, acquisition, email ou paiement ;
- aucune revendication Safari/iPad au-delà du comportement réellement réexécuté, ni revendication juridique, commerciale ou utilisateur non démontrée ;
- aucune fusion de la PR `#26` tant que les cinq observations et la décision Gate 1 ne sont pas documentées.

## Décision après les cinq observations

Documenter l'une des décisions prévues : continuer vers Gate 2, corriger puis retester Gate 1, réduire au seuil et au cash, réorienter ou abandonner. Ne demander l'aide d'Ayman que pour le recrutement ou l'observation humaine réellement indispensable.
