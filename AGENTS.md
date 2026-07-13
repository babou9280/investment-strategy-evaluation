# Breaktest - instructions permanentes pour Codex

## Avant de travailler

Lire :

- `PRODUCT.md` ;
- `QUALITY.md` ;
- `STATE.md` ;
- `DECISIONS.md` ;
- `METHODOLOGY.md` ;
- les fichiers de code et tests concernés.

Traiter chaque demande comme une évolution du produit existant, pas comme un nouveau projet.

## Autonomie

Prendre seul les décisions techniques réversibles et ordinaires. Ne pas demander à l'utilisateur de choisir une bibliothèque, une structure de fichier, un type de test ou un détail d'implémentation lorsque ces choix peuvent être évalués techniquement.

Demander une validation seulement pour une décision stratégique, coûteuse, irréversible ou substantiellement subjective. Dans ce cas, proposer une recommandation et au maximum deux alternatives.

## Processus obligatoire

1. Inspecter l'existant.
2. Identifier le delta demandé et ses conséquences.
3. Établir un plan interne si la tâche est complexe.
4. Modifier le minimum de code cohérent.
5. Ajouter ou corriger les tests.
6. Exécuter les validations pertinentes.
7. Corriger les défauts détectés.
8. Rechercher les régressions.
9. Mettre à jour les documents canoniques.
10. Résumer le résultat, les preuves et les limites restantes.

## Règles critiques

- Ne jamais inventer une donnée, un résultat ou un test réussi.
- Ne jamais masquer silencieusement une erreur avec une valeur par défaut.
- Signaler tout fallback de données ou de calcul.
- Ne jamais présenter une interaction factice comme fonctionnelle.
- Toute nouvelle formule importante doit être documentée et testée.
- Toute correction de bug doit ajouter un test de non-régression lorsqu'il est pertinent.
- Séparer filtrage ex ante et analyse ex post.
- Ne jamais retirer des perdants rétrospectivement pour améliorer artificiellement une stratégie.
- Pour toute décision rejouée, interdire qu'une observation future, de même date ou issue d'un échantillon non autorisé influence son modèle.
- Conserver la provenance du modèle et la profondeur d'entraînement au niveau de chaque décision.
- Consommer le budget de turnover dans l'ordre des dates d'entrée ; ne jamais classer globalement des opportunités de dates différentes selon leur edge avant allocation.
- Autoriser un classement par edge uniquement entre opportunités simultanément disponibles à la même date, avec un dernier départage déterministe.
- Garantir par test que l'ajout, la suppression ou la modification d'une opportunité future ne change pas une décision antérieure.
- Conserver les diagnostics de turnover au niveau de chaque décision : budget avant, unités demandées, budget après, rang simultané et motif.
- Réserver le nominal complet des positions financées entre l'entrée et la sortie ; ne jamais redimensionner silencieusement un trade pour le faire entrer dans le capital libre.
- Libérer les positions antérieures avant un groupe de même date, mais ne jamais recycler au milieu du groupe une position nouvellement ouverte ce même jour.
- Préserver l'ordre de priorité C3 entre entrées simultanées lors du financement.
- Appliquer le PnL net d'une position financée une seule fois, uniquement à sa date de sortie valide.
- Traiter et agréger les sorties d'une date avant de financer les entrées de cette même date.
- Garantir par test qu'aucun PnL ne modifie la courbe ou le financement avant sa sortie.
- Garantir par test qu'un événement futur ne modifie ni une décision ni un point de courbe antérieurs.
- Réconcilier à chaque événement `capital libre = capital réalisé - nominal réservé`.
- Garantir que la courbe commence au capital initial et que son dernier point égale le capital initial plus les PnL nets des positions financées et sorties valides.
- Conserver les diagnostics de financement et d'événement par décision : capital réalisé, réservé et libre avant/après, nominal demandé, décision, date de libération, PnL appliqué et motif.
- Recalculer les métriques de turnover sur les décisions finalement financées.
- Employer uniquement « courbe de trésorerie réalisée aux sorties » pour la courbe C4.
- Ne pas employer « mark-to-market », « valorisation quotidienne » ou « portefeuille entièrement simulé » tant que ces comportements ne sont pas implémentés et validés.
- Préserver la cohérence entre code, produit, méthodologie, deck et guide.

## Fichier canonique actuel

`app/Breaktest_Studio.html` est la version canonique provisoire.

Les quatre variantes dans `source_material/` sont des archives et ne doivent pas être modifiées indépendamment.

## Définition de terminé

Une tâche n'est terminée que lorsque :

- le comportement demandé fonctionne réellement ;
- les tests pertinents ont été exécutés et réussissent ;
- le lancement ou build pertinent a réussi ;
- les cas d'erreur essentiels ont été vérifiés ;
- les limites non vérifiées sont déclarées ;
- les documents canoniques sont mis à jour lorsque nécessaire.

## Rapport final

Présenter :

1. résultat obtenu ;
2. changements importants ;
3. validations réellement exécutées ;
4. limites restantes ;
5. une seule action utilisateur, uniquement si nécessaire.
