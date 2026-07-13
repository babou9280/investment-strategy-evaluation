# Prochaine mission Codex — page de validation Cost Intelligence

## Statut

Mission préparée après validation stratégique du 13 juillet 2026. Elle remplace la priorité H3. Elle ne doit être exécutée que sur une branche isolée créée depuis `breaktest-bootstrap` après fusion des documents stratégiques.

Ne modifie jamais `main`. Ne fusionne rien automatiquement.

## Avant de travailler

Lire intégralement :

- `AGENTS.md` ;
- `PRODUCT.md` ;
- `QUALITY.md` ;
- `STATE.md` ;
- `DECISIONS.md` ;
- `METHODOLOGY.md` ;
- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `go_to_market/LANDING_PAGE_COPY.md` ;
- `go_to_market/VALIDATION_FORM.md` ;
- `go_to_market/DEMO_SCENARIOS.md` ;
- `docs/TECHNICAL_AUDIT.md`.

## Objectif unique

Construire une **page statique de validation commerciale**, mobile-first et sans backend, comprenant un calculateur déterministe de cost drag. Cette page n'est pas la V1 du produit.

## Périmètre autorisé

Créer un dossier isolé, par exemple `validation_site/`, sans refondre `app/Breaktest_Studio.html`.

La page doit :

1. reprendre fidèlement le texte de `go_to_market/LANDING_PAGE_COPY.md` ;
2. permettre la saisie des paramètres du scénario ;
3. calculer et afficher séparément :
   - commissions aller-retour ;
   - change aller-retour ;
   - spread estimé ;
   - slippage estimé ;
   - coût total par aller-retour ;
   - coût en pourcentage de l'ordre ;
   - coût annuel ;
   - coût annuel en pourcentage du capital ;
   - rendement brut nécessaire pour couvrir les coûts ;
4. comparer trois scénarios sans recommander le meilleur ;
5. inclure les cinq démonstrations de `go_to_market/DEMO_SCENARIOS.md` ;
6. inclure le formulaire de validation sous forme locale ou de lien configurable ;
7. inclure des emplacements clairement configurables pour analytics, email et paiement, désactivés par défaut ;
8. permettre de copier ou partager un résumé textuel sans inclure de donnée personnelle ;
9. fonctionner sur iPhone, iPad et desktop ;
10. afficher la mention réglementaire et l'état « version de validation ».

## Formules

Pour un aller-retour :

- `commission = 2 × commission_par_côté` ;
- `change = 2 × taux_change_par_côté × montant_ordre` ;
- `spread = taux_spread_aller_retour × montant_ordre` ;
- `slippage = taux_slippage_aller_retour × montant_ordre` ;
- `coût_total = somme des composantes` ;
- `coût_ordre_pct = coût_total / montant_ordre` ;
- `coût_annuel = coût_total × allers_retours_mensuels × 12` ;
- `coût_capital_pct = coût_annuel / capital` ;
- `seuil_brut_pct = coût_ordre_pct`.

Le calcul interne utilise des nombres non arrondis. L'arrondi est uniquement d'affichage.

## Validation numérique

- distinguer `0`, valeur absente et valeur invalide ;
- refuser nombres négatifs, infinis ou non numériques ;
- capital et montant d'ordre strictement positifs ;
- fréquence supérieure ou égale à zéro ;
- taux compris entre 0 et 100 % ;
- aucune division par zéro ;
- messages d'erreur utiles ;
- ne jamais remplacer silencieusement une valeur invalide.

## Tests obligatoires

Ajouter des tests automatiques couvrant :

- les cinq scénarios de démonstration et leurs valeurs exactes ;
- tous les coûts à zéro ;
- fréquence nulle ;
- zéro valide ;
- capital ou ordre absent ;
- valeurs négatives, texte, `NaN` et infini ;
- indépendance des composantes ;
- arrondis d'affichage ;
- partage sans données personnelles ;
- fonctionnement clavier ;
- rendu Chromium aux largeurs 390, 768, 1024 et 1440 px ;
- absence de débordement horizontal ;
- syntaxe JavaScript.

## Interdictions

- ne pas intégrer de courtier réel ni de tarif présenté comme actuel ;
- ne pas construire d'import CSV ;
- ne pas ajouter de compte utilisateur ;
- ne pas ajouter de recommandation ;
- ne pas choisir un scénario « optimal » ;
- ne pas envoyer de données financières à un service tiers ;
- ne pas installer de tracking actif ;
- ne pas ajouter de paiement réel ;
- ne pas modifier le moteur canonique Breaktest ;
- ne pas reprendre H3 à H6.

## Livrables

- page statique autonome ;
- tests ;
- README d'exécution ;
- fichier de configuration des liens externes désactivés ;
- rapport `docs/validation/COST_INTELLIGENCE_VALIDATION_SITE.md` contenant commandes, résultats et limites ;
- mise à jour minimale de `STATE.md` uniquement avec ce qui a réellement été exécuté.

## Définition de terminé

La mission est terminée seulement si :

- les calculs correspondent aux scénarios de référence ;
- les tests sont exécutés ;
- la page est ouverte réellement dans Chromium ;
- les quatre largeurs sont contrôlées ;
- les limitations commerciales et réglementaires sont visibles ;
- aucune fonctionnalité de produit non nécessaire à la validation n'a été ajoutée.

Ouvrir une pull request vers `breaktest-bootstrap`. Ne pas fusionner.