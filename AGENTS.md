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
- Ne pas employer les termes « OOS strict » ou « walk-forward » tant que l'intégralité de la chaîne de décision n'est pas chronologique et couverte par des invariants anti-look-ahead.
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
