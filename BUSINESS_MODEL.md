# Breaktest — modèle économique

- Statut : hypothèses à tester
- Direction : Breaktest Cost Intelligence
- Date : 13 juillet 2026

## 1. Principe

Le calculateur gratuit acquiert et qualifie les utilisateurs. Le suivi annuel des coûts, les imports et l'historique constituent le premier produit payant. Les revenus de plateforme, de données et d'API sont des options ultérieures, non des hypothèses nécessaires à la première validation.

Le produit ne doit pas devenir une friction supérieure aux coûts qu'il aide à comprendre.

## 2. Segments

| Segment | Besoin | Offre envisagée | Rôle économique |
|---|---|---|---|
| Capital inférieur à 2 000 EUR | Comprendre l'effet des petits ordres | Calculateur gratuit | Acquisition et éducation |
| Investisseur autonome, 2 000 à 50 000 EUR | Suivre et réduire le cost drag | Pro annuel | Cœur payant initial |
| Trader actif ou multi-comptes | Imports, ventilation et comparaisons avancées | Active annuel | Panier moyen supérieur |
| Créateur ou communauté | Widget et rapports pédagogiques | Partenaire | Distribution |
| Média, fintech ou courtier | Calculateur, benchmark ou API | B2B plus tard | Expansion |

## 3. Offres à tester

### Gratuit

- une simulation pré-transaction ;
- comparaison de trois tailles ou fréquences ;
- résultats en euros et pourcentage ;
- rapport partageable ;
- aucun compte obligatoire au premier usage.

### Founder Pass — test initial

- réservation payante de **9 EUR**, remboursable selon les conditions affichées ;
- conversion en première année Pro à **39 EUR** lors de l'ouverture de la bêta ;
- le solde n'est exigé qu'à la mise à disposition du produit annoncé ;
- nombre limité de places pour éviter une promesse de livraison disproportionnée.

Cette construction est une hypothèse destinée à obtenir une preuve monétaire à faible friction. Les modalités de paiement, remboursement, TVA et information du consommateur doivent être vérifiées avant activation.

### Pro — prix cible après validation

**49 à 59 EUR par an**, à tester.

- imports ;
- historique mensuel ;
- ventilation des coûts ;
- plusieurs scénarios ;
- export ;
- suivi multidevise ;
- alertes de dégradation non prescriptives.

### Active — plus tard

**99 à 149 EUR par an**, uniquement après preuve de demande.

- plusieurs comptes ;
- volumes plus importants ;
- analyses d'exécution ;
- règles et catégories personnalisées ;
- rapports avancés.

## 4. Pourquoi une tarification annuelle

- le problème peut ne pas justifier un paiement mensuel visible ;
- le prix annuel limite le sentiment d'ajouter une nouvelle friction ;
- le suivi peut être mensuel sans nécessiter une décision de paiement chaque mois ;
- la comparaison avec les outils adjacents reste favorable, sans chercher à gagner uniquement par le prix.

Sharesight facture actuellement de 7 à 23,25 USD par mois en facturation annuelle selon le plan. TradeZella affiche notamment 29 et 49 USD par mois. Ces repères démontrent des budgets adjacents, pas le prix acceptable pour Breaktest.

## 5. Économie initiale — hypothèses

| Niveau | Hypothèse | Revenu annuel brut |
|---|---|---:|
| Première preuve | 25 clients à 39 EUR | 975 EUR |
| Signal initial | 250 clients à 49 EUR | 12 250 EUR |
| Base de recrutement prudente | 2 000 clients à 59 EUR | 118 000 EUR |
| SaaS de niche | 20 000 clients à 69 EUR | 1 380 000 EUR |
| Plateforme européenne | 200 000 clients à 69 EUR | 13 800 000 EUR |

Ces scénarios excluent TVA, remboursements, frais de paiement, support, acquisition, données et salaires. Ils ne constituent pas des prévisions.

## 6. Structure de coûts probable

### Faibles au départ

- calcul local ;
- hébergement statique ;
- développement assisté par IA ;
- absence de données temps réel payantes ;
- peu ou pas de stockage de données financières.

### Risques de coûts élevés

- maintien des barèmes de courtiers ;
- parseurs de relevés hétérogènes ;
- support d'import ;
- sécurité et conformité ;
- données de spread ou d'exécution ;
- acquisition payante ;
- remboursement et administration des abonnements.

Hypothèse de marge brute logicielle à terme : élevée, potentiellement supérieure à 80 %, uniquement si la majorité des imports et mises à jour est automatisée. Cette marge n'est pas validée.

## 7. Sources de revenus ultérieures

### Affiliation

Autorisation uniquement si :

- les commissions sont divulguées ;
- la méthodologie de comparaison est indépendante ;
- le courtier qui paie le plus ne reçoit aucun avantage algorithmique ;
- une revue juridique a été réalisée.

### API et widgets

- calculateur de cost drag ;
- seuil de couverture des frais ;
- comparaison de scénarios ;
- décomposition des coûts ;
- rapports intégrables.

### Données et benchmarks

Uniquement avec consentement, anonymisation robuste, volume suffisant et conseil juridique :

- coût effectif par taille d'ordre ;
- écarts de change ;
- slippage ;
- comparaison annoncé/observé ;
- benchmarks par marché et courtier.

### Marketplace ou flux transactionnels

Hors périmètre initial. Ces activités pourraient créer des revenus importants, mais elles augmentent fortement le risque réglementaire, les conflits d'intérêts et les besoins en capital.

## 8. Chemin vers une grande entreprise

Un abonnement grand public seul possède un plafond exigeant : à 50 EUR par an, un milliard de revenu demanderait 20 millions de clients payants.

Le scénario de grande valeur nécessite une combinaison :

1. audience grand public ;
2. données et benchmarks ;
3. API intégrée ;
4. distribution par partenaires ;
5. marketplace ou infrastructure transactionnelle légalement encadrée.

Ce chemin est structurellement possible mais extrêmement improbable. Il ne doit pas influencer les décisions des trente premiers jours, qui portent uniquement sur problème, usage répété et paiement.

## 9. Règles de décision

- Ne pas augmenter le prix avant d'avoir livré une valeur mesurée.
- Ne pas ajouter une offre B2B avant cinq usages récurrents comparables.
- Ne pas acheter de données avant que des utilisateurs en demandent explicitement l'usage.
- Ne pas construire de connexion courtier avant une demande répétée et un modèle de sécurité.
- Ne pas activer l'affiliation avant une politique de neutralité publique.
- Suspendre le modèle payant si le produit fait économiser moins que son prix à la majorité de la cible.

## 10. Indicateurs économiques de validation

- conversion visiteur qualifié → simulation ;
- simulation → sauvegarde ou email ;
- simulation → réservation payante ;
- coût d'acquisition organique et payé ;
- seconde analyse à 30 jours ;
- coût manuel par import ;
- remboursements ;
- revenu annuel par utilisateur ;
- économies ou coûts identifiés par rapport au prix payé.

La métrique initiale principale est : **nombre d'utilisateurs qualifiés qui reviennent et paient pour suivre leur cost drag**, pas le nombre total de visiteurs.