# Breaktest — preuves de marché et hypothèses

- Dernière mise à jour : 13 juillet 2026
- Direction étudiée : application de cost intelligence pour investisseurs particuliers
- Règle : distinguer faits, inférences et hypothèses commerciales

## 1. Preuve fondatrice interne

Le rapport académique `Évaluation Stratégie - Projet Ayman BESBAS 3.pdf` établit un mécanisme économiquement pertinent : pour un capital limité, les frictions peuvent absorber une part disproportionnée d'une prime brute étroite.

Éléments observés dans cette étude :

- le backtest utilisait une modélisation simplifiée des coûts ;
- le live-test ajoutait frais fixes, change, slippage et spread selon des règles explicites ;
- la performance brute subsistait en live, mais le résultat net était contraint par un budget de friction trop important ;
- le turnover annualisé du live-test était estimé autour de 180 %, contre 26,8 % dans le backtest, sous réserve de la courte fenêtre d'observation ;
- la conclusion du rapport demandait d'identifier les composantes de coûts dominantes et la frontière de viabilité nette.

Cette étude démontre qu'un écart brut/net peut être matériel. Elle ne démontre ni la fréquence de ce problème chez les particuliers, ni leur volonté de payer.

## 2. Signaux externes établis

### Outils de portefeuille payants

Sharesight propose actuellement :

- une offre gratuite limitée ;
- Starter à 7 USD par mois en facturation annuelle ;
- Standard à 18 USD ;
- Premium à 23,25 USD ;
- rapports de performance, contribution, multidevise et risque ;
- plus de 500 000 utilisateurs revendiqués.

Source : [Sharesight — Pricing](https://www.sharesight.com/pricing/), consultée le 13 juillet 2026.

**Interprétation prudente :** les particuliers paient pour un suivi et un reporting étendus. Cela ne prouve pas qu'ils paieront pour un produit centré uniquement sur les frictions.

### Journaux de trading payants

TradeZella affiche notamment :

- 29 USD par mois pour l'offre Essential mensuelle ;
- 49 USD par mois pour Premium ;
- import ou synchronisation de comptes ;
- backtesting, replay et analyse ;
- prise en compte des commissions et frais.

Source : [TradeZella — Pricing](https://www.tradezella.com/pricing), consultée le 13 juillet 2026.

**Interprétation prudente :** l'analyse des frais est déjà une fonctionnalité attendue dans les journaux avancés. Breaktest ne peut pas se différencier par un simple total de commissions.

### Transparence des coûts en Europe

L'accord européen sur la Retail Investment Strategy renforce l'attention portée à l'information claire sur les coûts et charges et à la comparaison de la valeur obtenue. Cette évolution soutient la durabilité du problème de transparence, mais ne crée pas automatiquement une demande directe pour une application indépendante.

Source secondaire : [Financial Times — EU agrees rules to boost retail investment in capital markets](https://www.ft.com/content/c5e74ffb-3877-41d6-8807-2b7e41a60f3d), consultée le 13 juillet 2026.

### Base économique

La littérature sur les coûts de transaction relie les frictions proportionnelles, le turnover et la prime de liquidité. Elle confirme le mécanisme général selon lequel une rotation plus forte exige une marge brute plus élevée.

Sources :

- Gerhold, Guasoni, Muhle-Karbe et Schachermayer, *Transaction Costs, Trading Volume, and the Liquidity Premium* ;
- Kallsen et Muhle-Karbe, *The General Structure of Optimal Investment and Consumption with Small Transaction Costs*.

Cette littérature ne valide pas le produit ni ses prix.

## 3. Concurrence et substituts

| Catégorie | Exemples | Force | Espace potentiel pour Breaktest |
|---|---|---|---|
| Journal de trading | TradeZella, Tradervue, Edgewonk | Import, analyse, psychologie, replay | Analyse indépendante de l'impact économique du capital, de la fréquence et des frictions |
| Suivi de portefeuille | Sharesight et outils de brokers | Performance, dividendes, fiscalité, multidevise | Planification pré-transaction et décomposition plus explicite des coûts implicites |
| Courtier | Tableaux de frais et rapports du courtier | Données propriétaires, intégration | Comparaison indépendante et multi-courtiers |
| Comparateurs | Sites d'affiliation | Acquisition SEO et grilles tarifaires | Personnalisation mathématique sans faire dépendre le classement de la commission d'affiliation |
| Tableur personnel | Excel, Google Sheets | Gratuit et flexible | Réduction du temps de configuration, hypothèses versionnées et explications |

## 4. Problèmes encore mal résolus — inférences

Les opportunités suivantes sont des inférences à valider :

1. Les grilles affichent les frais, mais pas toujours leur impact relatif au capital et à la fréquence réelle.
2. Les coûts explicites, le change et les coûts implicites restent dispersés entre plusieurs sources.
3. Le particulier ne sait pas facilement distinguer coût observé, coût contractuel et coût estimé.
4. Les comparateurs recommandent souvent un courtier générique plutôt qu'un scénario précis de taille et de fréquence.
5. Un rapport mensuel de « performance préservée ou absorbée » pourrait créer davantage de rétention qu'un calculateur ponctuel.

## 5. Hypothèses critiques

| Hypothèse | Statut | Test prévu |
|---|---|---|
| Le problème survient au moins mensuellement chez la cible | Non validée | Retours et seconde simulation |
| Les utilisateurs fourniront leurs frais ou importeront un historique | Non validée | Demande d'import et fichiers réels |
| Le résultat est assez utile pour être partagé | Non validée | Taux de partage du rapport |
| 39 à 49 EUR par an est acceptable | Non validée | Paiement ou réservation réelle |
| Le gain perçu dépasse le prix du produit | Non validée | Entretien post-paiement et économies estimées |
| Les tarifs peuvent être maintenus avec peu de travail manuel | Non validée | Temps de mise à jour et taux d'erreur |
| Les coûts implicites peuvent être estimés de manière crédible | Partiellement technique | Scénarios explicites, intervalles et comparaison aux données réelles |
| Une base anonymisée d'exécution est légalement et commercialement possible | Non validée | Plus tard, après consentement et avis juridique |

## 6. Paradoxe économique

Les utilisateurs qui souffrent le plus des frais disposent souvent du capital le plus faible et de la volonté de payer la plus limitée.

Conséquence stratégique :

- très petits capitaux : acquisition gratuite ;
- cible payante : investisseurs autonomes pour lesquels les économies et la fréquence justifient un abonnement annuel ;
- monétisation future : abonnement, API, données ou partenariats, sans sacrifier la neutralité.

## 7. Frontière réglementaire

Le produit doit rester une analyse de paramètres et de données. Une recommandation personnalisée sur une transaction concernant un instrument financier peut relever d'un service régulé, y compris lorsqu'elle est fournie en ligne.

Source de référence déjà identifiée dans le projet : AMF, Position DOC-2008-23, version modifiée le 13 février 2024.

Conséquences :

- pas de conseil sur l'instrument à acheter ;
- pas d'adaptation à la tolérance au risque ou au patrimoine ;
- pas d'ordre transmis ;
- pas de classement influencé silencieusement par l'affiliation ;
- conseil juridique avant extension vers recommandations, marketplace ou exécution.

## 8. Conclusion probatoire

Il existe :

- un mécanisme financier démontré dans le projet ;
- un marché payant adjacent pour le suivi et l'analyse ;
- une attention réglementaire durable aux coûts ;
- une lacune plausible entre grilles tarifaires et impact économique personnalisé.

Il n'existe pas encore de preuve que Breaktest puisse acquérir, retenir ou monétiser cette clientèle. La prochaine étape est donc une expérience commerciale instrumentée, pas un développement fonctionnel étendu.