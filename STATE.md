# Breaktest - état actuel

## Version

Prototype local-first 0.1, consolidé le 12 juillet 2026.

## Matériel existant

- un prototype HTML autonome d'environ 130 Ko ;
- quatre fichiers de lancement qui contiennent le même code et diffèrent seulement par le titre et la vue initiale : Capital Fit, Cost X-Ray, Evidence Lab et Trade Gate ;
- un pitch deck ;
- un product blueprint ;
- un guide utilisateur ;
- un journal de backtest ;
- un journal de live-test ;
- un rapport académique d'évaluation de stratégie.

## Consolidation réalisée

`app/Breaktest_Studio.html` devient le fichier canonique provisoire. Les quatre variantes originales sont conservées dans `source_material/` à titre d'archive.

## Ce qui paraît implémenté dans le HTML

- navigation entre plusieurs vues ;
- modification du capital ;
- presets de courtier et paramètres de coûts ;
- import CSV ;
- export des décisions ;
- filtres et recherche dans le ledger ;
- modal méthodologique ;
- calculs et affichages locaux en JavaScript.


## Vérifications utilisateur réalisées le 12 juillet 2026

- `app/Breaktest_Studio.html` s'ouvre sur iPad dans un navigateur compatible.
- Les vues et les contrôles de capital sont interactifs.
- Les indicateurs affichés se recalculent lorsque le capital change.
- Cette vérification confirme l'interactivité de base, pas l'exactitude quantitative des formules.

## Ce qui n'est pas encore considéré comme validé

- exactitude de chaque formule ;
- conformité des calculs aux rapports sources ;
- comportement de l'import sur des fichiers variés ;
- robustesse des exports ;
- tests automatiques ;
- compatibilité complète iPad, mobile et navigateurs ;
- absence de bugs silencieux ;
- sécurité du parsing CSV ;
- cohérence de toutes les métriques ;
- reproductibilité du Breaktest Score ;
- cohérence entre produit, deck et chiffres ;
- valeur commerciale réelle et disposition à payer.

## Risques immédiats

1. Le prototype est un fichier HTML monolithique, difficile à tester et maintenir.
2. Les quatre fichiers de lancement peuvent créer des divergences futures alors qu'ils dupliquent la même application.
3. L'interface peut donner une impression de maturité supérieure au niveau de validation technique réel.
4. Les métriques au niveau des trades peuvent être confondues avec des métriques temporelles classiques.
5. Les chiffres de démonstration doivent rester clairement séparés de résultats commerciaux ou prédictifs.

## Prochaine étape recommandée

Réaliser un audit reproductible du fichier canonique :

1. inventorier les fonctions et formules ;
2. construire des jeux de données de référence ;
3. vérifier les résultats manuellement ;
4. ajouter une première suite de tests ;
5. corriger les défauts bloquants ;
6. seulement ensuite refactorer l'architecture.

## Hébergement GitHub initial — 12 juillet 2026

- Dépôt utilisé pour l'amorçage : `babou9280/investment-strategy-evaluation`.
- Branche isolée : `breaktest-bootstrap`.
- La branche `main` et le projet universitaire d'origine restent inchangés.
- Le code canonique, les documents canoniques et les instructions Codex sont placés sur la branche d'amorçage pour permettre le premier audit.
- Les PDF et autres binaires du pack local ne sont pas requis pour la première passe de l'audit HTML et restent, à ce stade, dans le pack local vérifié par manifeste.
- Cet hébergement est réversible : le produit pourra être transféré vers un dépôt dédié sans modifier l'historique universitaire de `main`.

## Prochaine exécution autorisée

Lancer dans Codex, sur `breaktest-bootstrap`, l'audit technique en lecture seule défini dans `NEXT_CODEX_PROMPT.md`. Aucune refonte n'est autorisée avant restitution de cet audit.
