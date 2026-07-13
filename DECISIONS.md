# Breaktest — décisions du projet

## D001 — Vendre l'audit, pas les signaux

- Statut : **remplacée par D017**
- Décision historique : Breaktest se positionnait d'abord comme une couche de vérification de stratégies et journaux existants.
- Élément conservé : aucune génération de signaux ni promesse de surperformance.

## D002 — Fonctionnement avant apparence

- Statut : active
- Décision : une fonction visuellement réussie ne peut pas être déclarée terminée sans validation réelle.

## D003 — Local-first pour le prototype

- Statut : active
- Décision : le traitement des données financières reste local lorsque cela est possible.
- Conséquence : confidentialité et faibles coûts, avec des limites pour les comptes, synchronisations et calculs à grande échelle.

## D004 — Pas de filtrage rétrospectif trompeur

- Statut : active
- Décision : un trade ne peut pas être retiré d'une stratégie exploitable uniquement parce qu'il s'est révélé perdant.
- Conséquence : séparer strictement filtres ex ante et analyses ex post.

## D005 — Direction évolutive

- Statut : active
- Décision : les orientations peuvent être remplacées au fil des preuves.
- Conséquence : conserver l'historique, sans maintenir simultanément des visions incompatibles.

## D006 — Implication minimale du fondateur

- Statut : active
- Décision : Ayman intervient principalement pour valider, rejeter ou réorienter.
- Conséquence : ChatGPT et Codex prennent en charge la décomposition, les choix techniques ordinaires, les tests et la mise à jour documentaire.

## D007 — Un fichier HTML canonique technique

- Statut : active
- Décision : `app/Breaktest_Studio.html` reste l'actif technique canonique provisoire.
- Conséquence : les anciennes variantes sont archivées, pas développées séparément. La page de validation commerciale doit rester isolée de ce moteur.

## D008 — Amorçage GitHub isolé avant dépôt produit définitif

- Statut : active
- Décision : utiliser temporairement `breaktest-bootstrap` dans `babou9280/investment-strategy-evaluation`.
- Conséquence : aucune modification Breaktest dans `main` ; migration vers un dépôt produit dédié après validation possible.

## D009 — Codex travaille depuis le dépôt

- Statut : active
- Décision : les missions Codex prennent pour source les fichiers versionnés dans le dépôt et la branche associés à l'environnement.

## D010 — Audit local recevable avec empreinte

- Statut : active
- Décision : un audit local est recevable lorsque le fichier est identifié par SHA-256 et que les comportements déclarés ont été exécutés.

## D011 — Les données numériques source échouent fermement

- Statut : active
- Décision : une valeur numérique obligatoire explicitement invalide ne peut jamais devenir zéro ni être remplacée silencieusement.
- Conséquence : `missing`, `invalid` et zéro réel sont distingués ; toute dérivation conserve sa provenance.

## D012 — Un modèle distinct et antérieur pour chaque décision

- Statut : active pour le moteur historique
- Décision : chaque trade rejoué utilise uniquement les lignes backtest sorties strictement avant son entrée.

## D013 — Le budget de turnover est consommé chronologiquement

- Statut : active pour le moteur historique
- Décision : le plafond est appliqué décision après décision sur une fenêtre glissante de 365,25 jours.

## D014 — Le nominal est réservé entre l'entrée et la sortie

- Statut : active pour le moteur historique
- Décision : une décision conservée doit réserver son nominal complet jusqu'à sa sortie.

## D015 — Le PnL devient disponible uniquement à la sortie

- Statut : active pour le moteur historique
- Décision : le PnL d'une position financée est appliqué une seule fois à sa sortie valide.

## D016 — Les résultats observés restent séparés des scénarios simulés

- Statut : active
- Décision : brut observé, net fixe observé, full-cost observé et résultat simulé sont des bases distinctes et auditables.
- Conséquence : une base observée ne peut pas être écrasée par une estimation ou subir une seconde soustraction des coûts.

## D017 — Pivot vers Breaktest Cost Intelligence

- Statut : **active, validée par Ayman le 13 juillet 2026**
- Décision : Breaktest devient une application web installable centrée sur l'impact économique des commissions, du change, du spread, du slippage et de la rotation pour les petits et moyens portefeuilles.
- Client initial : investisseur autonome, environ 2 000 à 50 000 EUR de capital, avec usage régulier et complexité de coûts suffisante.
- Justification : cette direction exploite l'insight le plus fort du projet académique, réduit le besoin d'autorité humaine préalable et permet une validation grand public rapide.
- Conséquence : le moteur d'audit de stratégie devient un actif réutilisable, non la feuille de route automatique.

## D018 — Valider le marché avant d'étendre le produit

- Statut : active
- Décision : le prochain risque traité est la demande commerciale.
- Gate : usage répété, demande d'import, paiement réel et automatisation suffisante avant développement du Cost Tracker.
- Conséquence : H3 à H6, application native, connexion courtier, marketplace, API et fonctions d'audit étendu sont suspendus sauf preuve client directe.

## D019 — Le premier produit est un calculateur, pas un conseiller

- Statut : active
- Décision : la page de validation calcule les conséquences de paramètres saisis sans recommander un instrument, un courtier, une taille ou une fréquence.
- Conséquence : elle peut comparer des scénarios, mais ne doit jamais désigner automatiquement une option optimale.

## D020 — Les coûts gardent leur nature et leur provenance

- Statut : active
- Décision : distinguer dans toute évolution :
  - coût observé dans un relevé ;
  - coût contractuel issu d'un barème daté ;
  - coût implicite estimé ;
  - hypothèse utilisateur.
- Conséquence : aucune estimation de spread ou slippage ne peut être présentée comme un montant réellement payé.

## D021 — Les très petits capitaux sont d'abord un canal gratuit

- Statut : active
- Décision : les utilisateurs les plus sensibles aux coûts ne sont pas supposés être les meilleurs payeurs.
- Conséquence : calculateur gratuit pour l'acquisition ; cœur payant initial centré sur les investisseurs dont la fréquence et le capital permettent une économie potentielle supérieure au prix.

## D022 — L'affiliation ne doit jamais déterminer le classement

- Statut : active
- Décision : toute future rémunération d'un courtier doit être divulguée et séparée de la méthodologie de comparaison.
- Conséquence : aucune affiliation avant politique publique de neutralité et revue juridique.

## D023 — La défensibilité viendra des données et intégrations, pas de l'IA seule

- Statut : active
- Décision : l'IA, l'interface et un calculateur sont copiables.
- Actifs défensifs recherchés : barèmes versionnés, parseurs, historique utilisateur, données consenties, benchmarks, API, intégrations et réputation de neutralité.

## D024 — Fermeture de la mission H3

- Statut : active
- Décision : la pull request `#14` est fermée sans fusion après le pivot.
- Conséquence : son code reste non validé et ne peut être repris qu'après démonstration d'un besoin direct pour le produit retenu.