# Prochaine mission Codex — observations Gate 1 Cost Gate

## Statut reconstruit

La direction **Breaktest Cost Gate** est validée stratégiquement. Gate 0 est clôturée. Le premier essai fondateur du bundle Gate 1 sur iPad a reproduit un blocage de démarrage et d'effacement des champs. Le fichier HTML autonome exact a ensuite été validé techniquement et Ayman a confirmé le 16 juillet 2026 qu'il charge la démonstration et produit le résultat sur le même iPad. Ce contrôle ciblé ne compte pas comme observation utilisateur. Gate 1 reste à valider auprès de cinq participants qualifiés.

```text
pull request = #26, draft
base = breaktest-bootstrap
base head = 56fb50954afd7394baf1689e0f1b7220a1fd73fc
active branch = strategy/cost-gate-offline-critique
founder-tested head = e42bce2a29589000a95697aa2d7228645fe9b909
founder-tested tree = 618ce47e5199355a56927ebc15cda3f1c10a2676
exact run = 29459481762 (#647), success
artifact = 8360626149
artifact digest = 27805ed2f698f84a3861b73353bd12524203b1a737c77c13ef8259e3fc8714dc
standalone html sha256 = 93d0f25d911a102e85847ab7ad884cafdfaf316215b82544a9e80be0a6e6df79
internal package sha256 = a70a0bac71df4ebe00b479ca86e951947928dc67bc70ce777158189d4f5b7300
current engine = cost-gate-foundation-3-synthetic
main = 6e8c8e801e9821fe212651d684c8fad75dc6abee, unchanged
participants observed = 0/5
iPad blocker = validated on the founder's tested reader; broader Safari/iPad coverage unvalidated
```

Vérifier ces identifiants sur GitHub à chaque reprise. Une preuve historique ou locale ne remplace jamais le head et le run actuels.

## Objectif unique

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
