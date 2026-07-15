# Prochaine mission Codex — observations Gate 1 Cost Gate

## Statut reconstruit

La direction **Breaktest Cost Gate** est validée stratégiquement. Gate 0 est clôturée. Le prototype hors ligne de Gate 1 et son package exact sont techniquement prêts ; Gate 1 n'est pas validée par des utilisateurs.

```text
pull request = #26, draft
base = breaktest-bootstrap
base head = 56fb50954afd7394baf1689e0f1b7220a1fd73fc
active branch = strategy/cost-gate-offline-critique
functional head = 7ce11bde2195fdb5c95cb184263072b2314e4b6e
functional tree = 7046eb366a62aa5b12b55414367fe7e116c341e2
exact run = 29417944829 (#633), success
artifact = 8343971281
artifact digest = b4b2259ca3fda6cbb4bef2135d7e7d4c1a5ec011f791036a3e36a4bf17b80778
internal package sha256 = 6464cfac98b56705bbb8a66a2c6a323120498578fb2fb2e80e6fcbd955400e6e
current engine = cost-gate-foundation-3-synthetic
main = 6e8c8e801e9821fe212651d684c8fad75dc6abee, unchanged
participants observed = 0/5
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

- préparer le package exact pour une session locale ;
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
- aucune revendication Safari/iPad, juridique, commerciale ou utilisateur non démontrée ;
- aucune fusion de la PR `#26` tant que les cinq observations et la décision Gate 1 ne sont pas documentées.

## Décision après les cinq observations

Documenter l'une des décisions prévues : continuer vers Gate 2, corriger puis retester Gate 1, réduire au seuil et au cash, réorienter ou abandonner. Ne demander l'aide d'Ayman que pour le recrutement ou l'observation humaine réellement indispensable.
