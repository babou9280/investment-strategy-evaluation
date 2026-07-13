# Breaktest — preuves de marché et hypothèses

- Dernière mise à jour : 13 juillet 2026
- Direction étudiée : Capital Efficiency et Edge Survival pour investisseurs particuliers
- Règle : distinguer faits, inférences et hypothèses commerciales

## 1. Preuve fondatrice interne

Le rapport académique `Évaluation Stratégie - Projet Ayman BESBAS 3.pdf` établit un mécanisme économiquement pertinent : pour un capital limité, les frictions peuvent absorber une part disproportionnée d'une prime brute étroite.

Éléments observés dans cette étude :

- le backtest utilisait une modélisation simplifiée des coûts ;
- le live-test ajoutait frais fixes, change, slippage et spread selon des règles explicites ;
- la performance brute subsistait en live, mais le résultat net était contraint par un budget de friction trop important ;
- le turnover annualisé du live-test était estimé autour de 180 %, contre 26,8 % dans le backtest, sous réserve de la courte fenêtre d'observation ;
- la conclusion du rapport demandait d'identifier les composantes dominantes et la frontière de viabilité nette.

Cette étude démontre qu'un écart brut/net peut être matériel. Elle ne démontre ni la fréquence de ce problème chez les particuliers, ni leur volonté de payer.

## 2. Signaux externes établis

### Outils de portefeuille payants

Sharesight propose actuellement une offre gratuite et plusieurs plans payants comprenant notamment rapports de performance, contribution, multidevise et risque.

Source : [Sharesight — Pricing](https://www.sharesight.com/pricing/), consultée le 13 juillet 2026.

**Interprétation prudente :** les particuliers paient pour un suivi et un reporting étendus. Cela ne prouve pas qu'ils paieront pour un produit centré uniquement sur les frictions.

### Journaux de trading payants

TradeZella affiche notamment :

- des offres mensuelles de 29 et 49 USD ;
- import ou synchronisation de comptes ;
- backtesting, replay et analyse ;
- prise en compte des commissions et frais ;
- paramètres de breakeven ;
- position sizing, rapports et nombreuses analyses de performance.

Source : [TradeZella — Pricing](https://www.tradezella.com/pricing), consultée le 13 juillet 2026.

**Interprétation prudente :** le total de commissions et une fonction de breakeven existent déjà dans un produit beaucoup plus large. Breaktest ne peut pas se différencier par un calculateur de frais ou un seuil isolé. L'espace potentiel se situe dans la relation transparente entre avantage brut, plancher variable, capital, taille, fréquence et contraintes inverses.

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
| Journal de trading | TradeZella, Tradervue, Edgewonk | Import, analyse, frais, breakeven, psychologie, replay | Contraintes économiques inverses et plancher variable explicitement reliés à l'avantage brut |
| Suivi de portefeuille | Sharesight et outils de brokers | Performance, dividendes, fiscalité, multidevise | Planification pré-transaction et décomposition explicite de l'Edge Survival |
| Courtier | Tableaux de frais et rapports du courtier | Données propriétaires, intégration | Analyse indépendante et multi-source |
| Comparateurs | Sites d'affiliation | Acquisition SEO et grilles tarifaires | Personnalisation mathématique sans dépendance au classement sponsorisé |
| Tableur personnel | Excel, Google Sheets | Gratuit et flexible | Réduction du temps de configuration, contraintes inverses, hypothèses versionnées et auditabilité |

## 4. Problèmes encore mal résolus — inférences

Les opportunités suivantes sont des inférences à valider :

1. Les grilles affichent les frais, mais rarement le rendement brut minimal qu'ils imposent au niveau exact du capital et de l'ordre.
2. L'utilisateur ne distingue pas facilement la part fixe diluable du plancher variable non diluable.
3. Un total de frais ne dit pas si un avantage brut subsiste après friction.
4. Les outils existants peuvent afficher une performance nette sans calculer les conditions inverses : taille minimale, avantage requis ou fréquence frontière.
5. Les coûts explicites, le change et les coûts implicites restent dispersés entre plusieurs sources.
6. Le particulier ne sait pas facilement distinguer coût observé, contractuel, estimé et hypothèse.
7. Un historique de « part d'avantage absorbée » pourrait créer davantage de rétention qu'un calcul ponctuel.

## 5. Hypothèses critiques

| Hypothèse | Statut | Test prévu |
|---|---|---|
| La cible dispose d'un avantage brut explicite ou d'un historique permettant de l'estimer | Non validée | Prototype et entretiens post-usage |
| Le seuil brut et le plancher variable révèlent une information nouvelle | Non validée | Test de compréhension |
| Les contraintes inverses influencent une décision de planification réelle | Non validée | Question sur la décision concrète |
| Le problème survient au moins mensuellement chez la cible | Non validée | Retours et seconde simulation |
| Les utilisateurs fourniront leurs frais ou importeront un historique | Non validée | Demande d'import et fichiers réels |
| Le résultat est assez utile pour être sauvegardé ou partagé | Non validée | Taux de sauvegarde et partage |
| 39 à 59 EUR par an est acceptable | Non validée | Paiement ou réservation réelle |
| Le gain perçu dépasse le prix du produit | Non validée | Entretien post-paiement et valeur identifiée |
| Les coûts implicites peuvent être estimés de manière crédible | Partiellement technique | Scénarios explicites, intervalles et comparaison aux données réelles |
| Une base anonymisée d'exécution est légalement et commercialement possible | Non validée | Plus tard, après consentement et avis juridique |

## 6. Paradoxe économique

Les utilisateurs qui souffrent le plus des frais disposent souvent du capital le plus faible et de la volonté de payer la plus limitée.

Conséquence stratégique :

- très petits capitaux : acquisition gratuite ;
- cible payante : utilisateurs avec méthode répétable, avantage brut et besoin de suivi ;
- monétisation future : abonnement, API, données ou partenariats, sans sacrifier la neutralité.

## 7. Frontière réglementaire

Le produit doit rester une analyse de paramètres et de données. Une recommandation personnalisée sur une transaction concernant un instrument financier peut relever d'un service régulé, y compris lorsqu'elle est fournie en ligne.

Source de référence déjà identifiée dans le projet : AMF, Position DOC-2008-23, version modifiée le 13 février 2024.

Conséquences :

- pas de conseil sur l'instrument à acheter ;
- pas d'adaptation à la tolérance au risque ou au patrimoine ;
- pas d'ordre transmis ;
- pas de taille ou fréquence « optimale » ;
- pas de classement influencé silencieusement par l'affiliation ;
- conseil juridique avant extension vers recommandations, marketplace ou exécution.

## 8. Conclusion probatoire

Il existe :

- un mécanisme financier démontré dans le projet ;
- un marché payant adjacent pour le suivi et l'analyse ;
- une attention durable aux coûts ;
- des concurrents qui couvrent déjà le simple suivi des commissions et le breakeven ;
- une lacune plausible autour de l'Edge Survival, du plancher variable et des contraintes inverses.

Il n'existe pas encore de preuve que cette lacune soit assez douloureuse, fréquente et monétisable. La prochaine étape correcte est un laboratoire interne rigoureux, puis un test utilisateur ciblé, pas une publication du calculateur Q0 comme produit final.
