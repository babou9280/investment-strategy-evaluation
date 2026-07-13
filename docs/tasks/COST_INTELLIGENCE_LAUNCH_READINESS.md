# Mission — préparation contrôlée du test utilisateur Cost Intelligence

- Branche : `strategy/cost-intelligence-launch-readiness`
- Base : `breaktest-bootstrap` après fusion de la pull request `#16`, commit `aadef6dec71a6882f9746ea4b2721ee91a3ee1f3`
- Statut : préparation documentaire en cours
- `main` : strictement hors périmètre

## Objectif

Préparer tout ce qui peut l'être sans engagement externe afin que le premier test utilisateur réel puisse être lancé avec une seule décision d'Ayman.

## Livrables

- checklist de lancement statique ;
- protocole exact de test utilisateur ;
- frontière minimale de confidentialité ;
- état canonique synchronisé ;
- prochaine mission Codex limitée à la préparation locale et à la vérification Safari/iPad lorsque l'environnement le permet ;
- aucun hébergement ou service externe activé.

## Interdictions

- aucun achat de domaine ;
- aucun déploiement public ;
- aucune collecte email ;
- aucun analytics ;
- aucun paiement ;
- aucune donnée de courtier réelle ;
- aucun import de transactions ;
- aucune modification des formules validées ;
- aucune reprise H3–H6 ;
- aucune modification de `main`.

## Décision externe future

Lorsque la préparation interne sera complète, présenter à Ayman une recommandation unique concernant le lancement statique. La décision devra préciser :

- hébergeur proposé et coût ;
- URL ou domaine ;
- données éventuellement collectées ;
- risques et possibilité de rollback ;
- première population de test ;
- action unique nécessaire.

Aucune de ces décisions n'est implicite dans la présente branche.
