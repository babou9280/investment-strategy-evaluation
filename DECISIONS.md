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
- Décision : utiliser temporairement la branche `breaktest-bootstrap` du dépôt académique `babou9280/investment-strategy-evaluation`.
- Justification : préserver `main`, conserver la filiation avec le travail universitaire et éviter de bloquer l'audit.
- Conséquence : aucune modification Breaktest n'est fusionnée dans `main` ; une migration vers un dépôt produit dédié reste possible.

## D009 - Codex travaille depuis le dépôt, sans dépendance à une pièce jointe ZIP

- Statut : active
- Décision : les missions Codex Cloud prennent pour source les fichiers versionnés dans le dépôt et la branche associés à l'environnement.
- Conséquence : toute source nécessaire doit être matérialisée et vérifiée dans GitHub.

## D010 - L'audit initial peut précéder la matérialisation GitHub du HTML

- Statut : active
- Décision : l'audit local est recevable lorsque le fichier est identifié par une empreinte SHA-256 et que les comportements déclarés sont réellement exécutés.
- Conséquence : aucune modification de code ne peut être acceptée sans correspondance vérifiée avec la source canonique.

## D011 - Les données numériques source échouent fermement

- Statut : active
- Décision : une valeur numérique obligatoire explicitement invalide ne peut jamais être transformée en zéro, ignorée ou remplacée silencieusement.
- Conséquence : `missing`, `invalid` et zéro réel sont distingués ; toute dérivation conserve sa provenance.

## D012 - Un modèle distinct et antérieur pour chaque décision

- Statut : active
- Décision : chaque trade rejoué utilise uniquement les lignes backtest sorties strictement avant son entrée.
- Conséquence : modèles et diagnostics sont conservés par décision ; les dates invalides produisent `observe`.

## D013 - Le budget de turnover est consommé chronologiquement

- Statut : active
- Décision : le plafond est appliqué décision après décision sur une fenêtre glissante de 365,25 jours.
- Conséquence : une opportunité future ne peut jamais modifier une décision antérieure ; le classement par edge est limité aux opportunités de même date.

## D014 - Le nominal est réservé entre l'entrée et la sortie

- Statut : active
- Décision : une décision conservée doit réserver son nominal complet jusqu'à sa sortie.
- Conséquence : les entrées simultanées préservent la priorité C3, aucun redimensionnement silencieux n'est autorisé et le capital libre est calculé à partir de la trésorerie réalisée.

## D015 - Le PnL devient disponible uniquement à la sortie

- Statut : active
- Décision : le PnL d'une position financée est appliqué une seule fois à sa sortie valide, avant les nouvelles entrées de même date.
- Conséquence : la courbe est une trésorerie réalisée aux sorties, jamais présentée comme mark-to-market.

## D016 - Les résultats observés restent séparés des scénarios simulés

- Statut : active
- Décision : le brut observé, le net fixe observé, le full-cost observé et le résultat simulé par Breaktest sont quatre bases distinctes, sélectionnables et auditables.
- Justification : soustraire silencieusement des coûts simulés d'une valeur déjà nette, ou remplacer une valeur du journal par une estimation, détruit la traçabilité et peut compter les coûts deux fois.
- Conséquence : les bases observées conservent leurs valeurs et provenance ; les fallbacks et dérivations sont explicites ; les valeurs invalides refusent le lot ; C4 utilise la base choisie sans double comptage ; les incohérences PnL/rendement sont signalées et laissées à H4 plutôt que corrigées silencieusement.
