# Breaktest - décisions du projet

## D001 - Vendre l'audit, pas les signaux

- Statut : active
- Décision : Breaktest se positionne d'abord comme une couche de vérification de stratégies et journaux existants.
- Conséquence : la V0 n'a pas besoin de créer des recommandations ou d'exécuter des ordres.

## D002 - Fonctionnement avant apparence

- Statut : active
- Décision : une fonction visuellement réussie ne peut pas être déclarée terminée sans validation réelle.

## D003 - Local-first pour le prototype

- Statut : active
- Décision : le traitement du CSV reste local dans le navigateur pour la V0.
- Conséquence : confidentialité et simplicité d'essai, mais limitations de stockage, synchronisation et calcul à grande échelle.

## D004 - Pas de filtrage rétrospectif trompeur

- Statut : active
- Décision : un trade ne peut pas être retiré d'une stratégie exploitable uniquement parce qu'il s'est révélé perdant.
- Conséquence : séparer strictement filtres ex ante et analyses ex post.

## D005 - Direction évolutive

- Statut : active
- Décision : les orientations peuvent être remplacées au fil de la conversation.
- Conséquence : conserver l'historique, mais ne pas maintenir simultanément des visions incompatibles.

## D006 - Implication minimale du fondateur

- Statut : active
- Décision : Ayman intervient principalement pour valider, rejeter ou réorienter.
- Conséquence : ChatGPT et Codex prennent en charge la décomposition, les choix techniques ordinaires, les tests et la mise à jour documentaire.

## D007 - Un fichier HTML canonique

- Statut : active
- Décision : `app/Breaktest_Studio.html` est la version canonique provisoire.
- Justification : les quatre fichiers HTML fournis sont identiques à l'exception du titre et de la vue initiale.
- Conséquence : les anciennes variantes sont archivées, pas développées séparément.

## D008 - Amorçage GitHub isolé avant dépôt produit définitif

- Statut : active
- Décision : utiliser temporairement la branche `breaktest-bootstrap` du dépôt académique `babou9280/investment-strategy-evaluation` pour la première mission Codex.
- Justification : préserver `main`, conserver la filiation avec le travail universitaire et éviter de bloquer l'audit sur une opération de création de dépôt.
- Conséquence : aucune modification Breaktest n'est fusionnée dans `main` avant l'audit ; une migration vers un dépôt produit dédié reste possible après clarification de l'architecture et des besoins de confidentialité.
