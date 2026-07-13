# Breaktest — définition actuelle du produit

- Direction validée : 13 juillet 2026
- Raffinement produit actif : 13 juillet 2026
- Phase : conception et prototype interne avant validation commerciale externe
- Nom de travail : Breaktest Cost Intelligence

## Vision

Breaktest devient une application web installable qui aide les investisseurs particuliers à comprendre si un avantage brut, une méthode répétable ou un plan d'investissement conserve une marge économique après commissions, change, spread, slippage, frais fixes et rotation.

Le calcul des coûts reste nécessaire, mais n'est plus considéré comme une proposition de valeur suffisante à lui seul.

## Promesse actuelle

> Montrer si un avantage brut survit aux frictions avec le capital réel de l'utilisateur — et quelles contraintes économiques doivent être satisfaites pour qu'il subsiste.

Breaktest ne recommande pas un instrument, ne prédit pas un rendement et n'exécute pas d'ordre. Il transforme les paramètres saisis ou, plus tard, les transactions importées en conséquences économiques explicites.

## Utilisateur cible initial

Investisseur ou trader autonome :

- capital approximatif de 2 000 à 50 000 EUR ;
- plusieurs opérations, versements ou rééquilibrages par mois ;
- applique une méthode répétable, même simple ;
- connaît ou peut estimer un rendement brut moyen par opération, ou souhaite connaître le seuil brut imposé par ses coûts ;
- exposition possible à plusieurs devises, marchés ou courtiers ;
- utilise déjà un courtier, un tableur ou un outil de suivi ;
- veut comprendre sa performance nette sans recevoir de recommandation personnalisée.

Les capitaux plus faibles constituent un public gratuit pertinent, mais ne sont pas supposés être la principale source de revenu.

## Problème initial reformulé

Les grilles tarifaires indiquent des frais isolés, mais ne répondent pas facilement aux questions suivantes :

- quel rendement brut minimal une opération doit-elle produire pour seulement couvrir les frictions ?
- quelle part d'un avantage brut est absorbée ?
- une augmentation de la taille peut-elle réellement diluer le problème ?
- existe-t-il un plancher de coût variable qu'aucune taille d'ordre ne peut éliminer ?
- quelle taille minimale permet de conserver une part explicite de l'avantage ?
- quelle fréquence reste sous un budget annuel de friction défini par l'utilisateur ?
- les coûts affichés par le journal se réconcilient-ils avec le résultat net ?

Le projet académique d'origine a illustré ce mécanisme : une prime brute pouvait subsister alors que la viabilité nette se détériorait sous l'effet du budget de friction et d'une rotation plus élevée. Cet exemple démontre le mécanisme, pas la demande commerciale.

## Architecture de valeur

### 1. Géométrie de friction

- coût fixe et coût variable ;
- seuil brut de couverture ;
- plancher variable ;
- coût par opération, annuel et relatif au capital ;
- sensibilité à la taille et à la fréquence.

### 2. Edge Survival

Lorsque l'utilisateur fournit un avantage brut attendu ou historique :

- marge nette après friction ;
- part absorbée et part conservée ;
- PnL brut et net par opération ;
- taille minimale de couverture ;
- taille minimale pour conserver une part cible ;
- impossibilité structurelle lorsque les coûts variables dépassent la capacité de l'avantage.

### 3. Frontière de capital et de fréquence

Lorsque le capital et un budget de friction sont disponibles :

- budget annuel consommé ;
- fréquence frontière sous ce budget ;
- grille taille × fréquence ;
- scénarios de stress transparents.

Aucune frontière n'est une recommandation. Chaque résultat dépend des hypothèses saisies et doit conserver son dénominateur, sa formule et sa provenance.

## Expérience cible

### Avant une transaction ou un cycle de stratégie

1. Saisir capital, montant moyen, fréquence et coûts.
2. Distinguer coûts fixes, coûts variables et hypothèses de microstructure.
3. Choisir entre : fournir un avantage brut ou calculer uniquement le seuil nécessaire.
4. Lire d'abord le seuil brut ou la part de l'avantage conservée.
5. Comprendre ce qui est diluable avec la taille et ce qui constitue un plancher.
6. Tester des contraintes de taille, fréquence ou budget sans recommandation automatique.
7. Partager un résumé des hypothèses et résultats.

### Après les transactions — uniquement après preuve de demande

1. Importer un historique.
2. Séparer performance brute, nette observée et scénario simulé.
3. Ventiler commissions, change, spread, slippage estimé et turnover.
4. Dériver l'avantage brut depuis les données avec incertitude visible.
5. Suivre la part d'avantage absorbée dans le temps.
6. Comparer comptes, marchés, devises et tailles d'ordre.

## Produit d'entrée révisé à valider

Le premier produit externe ne doit plus être publié tant que le noyau de valeur n'a pas été testé en interne.

Le prototype interne autorisé comprend :

- moteur déterministe Capital Efficiency ;
- seuil brut de couverture ;
- plancher variable ;
- marge nette et Edge Survival lorsque l'avantage brut est fourni ;
- tailles minimales calculées ;
- budget annuel et fréquence frontière ;
- sensibilité non prescriptive ;
- scénarios synthétiques ;
- tests quantitatifs et navigateur.

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

La page de validation fusionnée reste une fondation d'interface et un calculateur Q0, mais elle n'est plus prête à être publiée comme proposition de valeur finale.

Ces capacités ne doivent pas dicter la feuille de route.

## Positionnement

Breaktest est une couche de **capital-efficiency intelligence**, et non :

- un journal de trading complet ;
- un courtier ;
- un robo-advisor ;
- un comparateur sponsorisé opaque ;
- une certification ;
- un service de signaux ou de conseil personnalisé ;
- un simple totalisateur de frais.

## Différenciation recherchée

À court terme :

- seuil brut et plancher variable ;
- relation explicite entre avantage brut, capital, taille, fréquence et coûts ;
- séparation claire entre coûts observés, contractuels et estimés ;
- contraintes inverses calculées : taille minimale, rendement requis, fréquence frontière ;
- calcul transparent et auditabilité ;
- traitement local et confidentialité ;
- neutralité vis-à-vis des courtiers.

À long terme, uniquement si validé :

- dérivation de l'avantage depuis des historiques réels ;
- intervalles d'incertitude adaptés aux données ;
- barèmes versionnés ;
- parseurs de nombreux courtiers ;
- historique de coûts et d'Edge Survival ;
- données d'exécution consenties et agrégées ;
- benchmarks indépendants ;
- API et intégrations.

L'IA et l'interface ne sont pas considérées comme des avantages défendables à elles seules.

## Non-objectifs actuels

- recommandation d'achat, de vente ou de conservation ;
- choix automatique d'un courtier ;
- fréquence ou taille qualifiée d'optimale ;
- allocation adaptée au profil de risque ;
- exécution ou transmission d'ordres ;
- données temps réel payantes ;
- application native ;
- synchronisation courtier complète ;
- marketplace ;
- certification de stratégie ;
- métriques statistiques avancées sans données suffisantes ;
- reprise de H3 à H6 sans besoin démontré.

## Gate de validation

Avant toute publication externe, le prototype doit démontrer techniquement :

- formules réconciliées ;
- cas structurellement impossibles correctement identifiés ;
- absence de scores arbitraires ;
- compréhension claire des hypothèses et dénominateurs ;
- non-régression du moteur historique et du site Q0.

Avant tout développement produit étendu, il faut ensuite obtenir une preuve réelle de :

- révélation d'une contrainte économique nouvelle pour l'utilisateur ;
- usage répété ;
- demande d'import ou de suivi ;
- paiement réel ;
- automatisation suffisante ;
- valeur perçue supérieure au prix.

Les formules détaillées figurent dans `docs/standards/EDGE_SURVIVAL_CONTRACT.md`. Le noyau produit figure dans `docs/product/CAPITAL_EFFICIENCY_CORE.md`.
