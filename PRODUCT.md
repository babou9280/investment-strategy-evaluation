# Breaktest — définition actuelle du produit

- Direction validée : 13 juillet 2026
- Phase : validation commerciale
- Nom de travail : Breaktest Cost Intelligence

## Vision

Breaktest devient une application web installable qui aide les investisseurs particuliers à comprendre comment commissions, change, spread, slippage, frais fixes et rotation absorbent la performance d'un petit ou moyen portefeuille.

## Promesse actuelle

> Comprendre ce que les ordres coûtent réellement avant que les frictions n'absorbent la performance.

Breaktest ne recommande pas un instrument, ne prédit pas un rendement et n'exécute pas d'ordre. Il transforme les paramètres saisis ou les transactions importées en conséquences économiques explicites.

## Utilisateur cible initial

Investisseur autonome :

- capital approximatif de 2 000 à 50 000 EUR ;
- plusieurs opérations ou versements par mois ;
- exposition possible à plusieurs devises, marchés ou courtiers ;
- utilise déjà un courtier, un tableur ou un outil de suivi ;
- veut comprendre sa performance nette sans recevoir de recommandation personnalisée.

Les capitaux plus faibles constituent un public gratuit pertinent, mais ne sont pas supposés être la principale source de revenu.

## Problème initial

Les grilles tarifaires indiquent des frais isolés, mais ne répondent pas facilement aux questions suivantes :

- quel pourcentage d'un petit ordre est absorbé ?
- combien la fréquence coûte-t-elle sur un an ?
- quelle part d'un rendement brut disparaît après frictions ?
- comment commissions, change et coûts implicites se combinent-ils ?
- les coûts affichés par le journal se réconcilient-ils avec le résultat net ?

Le projet académique d'origine a illustré ce mécanisme : une prime brute pouvait subsister alors que la viabilité nette se détériorait sous l'effet du budget de friction et d'une rotation plus élevée. Cet exemple démontre le mécanisme, pas la demande commerciale.

## Expérience cible

### Avant une transaction

1. Saisir capital, montant moyen, fréquence et coûts.
2. Distinguer coûts contractuels et hypothèses de microstructure.
3. Lire le coût par opération, annuel et relatif au capital.
4. Comparer des scénarios sans recommandation automatique.
5. Partager un résumé des hypothèses et résultats.

### Après les transactions — uniquement après preuve de demande

1. Importer un historique.
2. Séparer performance brute, nette observée et scénario simulé.
3. Ventiler commissions, change, spread, slippage estimé et turnover.
4. Suivre le cost drag dans le temps.
5. Comparer comptes, marchés, devises et tailles d'ordre.

## Produit d'entrée à valider

- page statique mobile-first ;
- calculateur déterministe sans compte ;
- cinq scénarios de démonstration ;
- comparaison de tailles ou fréquences ;
- rapport partageable ;
- formulaire de demande ;
- Founder Pass présenté comme réservation, sous réserve de conformité du paiement.

Le produit payant complet n'est pas encore construit.

## Actifs techniques réutilisables

Le prototype canonique existant reste un actif :

- import CSV local ;
- scénarios de coûts ;
- séparation brut/net et observé/simulé ;
- validation numérique stricte ;
- turnover chronologique ;
- réservation du capital ;
- trésorerie réalisée aux sorties ;
- audit, provenance et export ;
- tests reproductibles.

Ces capacités ne sont pas toutes nécessaires au premier test commercial. Elles ne doivent pas dicter la feuille de route.

## Positionnement

Breaktest est une couche de **cost intelligence**, et non :

- un journal de trading complet ;
- un courtier ;
- un robo-advisor ;
- un comparateur sponsorisé opaque ;
- une certification ;
- un service de signaux ou de conseil personnalisé.

## Différenciation recherchée

À court terme :

- impact relatif au capital et à la fréquence ;
- séparation claire entre coûts observés, contractuels et estimés ;
- calcul transparent ;
- traitement local et confidentialité ;
- neutralité vis-à-vis des courtiers.

À long terme, uniquement si validé :

- barèmes versionnés ;
- parseurs de nombreux courtiers ;
- historique de coûts ;
- données d'exécution consenties et agrégées ;
- benchmarks indépendants ;
- API et intégrations.

L'IA et l'interface ne sont pas considérées comme des avantages défendables à elles seules.

## Non-objectifs actuels

- recommandation d'achat, de vente ou de conservation ;
- choix automatique d'un courtier ;
- allocation adaptée au profil de risque ;
- exécution ou transmission d'ordres ;
- données temps réel payantes ;
- application native ;
- synchronisation courtier complète ;
- marketplace ;
- certification de stratégie ;
- reprise de H3 à H6 sans besoin démontré.

## Gate de validation

Aucun développement produit étendu avant preuve de :

- usage répété ;
- demande d'import ou de suivi ;
- paiement réel ;
- automatisation suffisante ;
- valeur perçue supérieure au prix.

Les seuils sont définis dans `VALIDATION_PLAN.md`. La stratégie détaillée figure dans `STRATEGY.md`.