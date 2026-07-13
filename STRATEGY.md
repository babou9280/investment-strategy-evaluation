# Breaktest — stratégie validée

- Date de décision : 13 juillet 2026
- Statut : **active et validée par Ayman**
- Nom de travail : **Breaktest Cost Intelligence**
- Phase actuelle : validation commerciale, avant reprise du développement produit

## 1. Direction

Breaktest devient une application web installable destinée aux investisseurs particuliers disposant de petits ou moyens portefeuilles. Elle mesure, avant et après les transactions, la part de performance absorbée par les frictions d'exécution.

La promesse de travail est :

> Comprendre ce que les ordres coûtent réellement avant que les frais, le change, le spread, le slippage et la rotation n'absorbent la performance.

Breaktest ne recommande pas un instrument financier et ne prédit pas son rendement. Il calcule et explique les conséquences économiques d'hypothèses fournies par l'utilisateur ou de transactions importées.

## 2. Insight fondateur

Le projet académique d'Ayman a montré que les frictions deviennent disproportionnées lorsque le capital est limité et que la rotation augmente. Dans le live-test étudié, la prime brute subsistait, mais la rentabilité nette restait contrainte par un budget de friction trop important. Le turnover annualisé observé était nettement supérieur à celui du backtest, sous les réserves méthodologiques propres à une fenêtre courte.

Sources internes de référence :

- `Évaluation Stratégie - Projet Ayman BESBAS 3.pdf`, 10 mars 2026 ;
- journaux backtest et live-test du projet ;
- `docs/TECHNICAL_AUDIT.md` et validations H1 à H2.

Cet exemple constitue une preuve du mécanisme, pas une preuve de marché ni une estimation de la fréquence du problème dans la population.

## 3. Client initial

### Cible payante prioritaire

Investisseur autonome :

- capital investi approximatif de 2 000 à 50 000 euros ;
- au moins deux opérations ou versements par mois ;
- exposition possible à plusieurs devises, marchés, courtiers ou produits ;
- utilise déjà un courtier, un tableur, TradingView ou un outil de suivi ;
- souhaite comprendre sa performance nette sans recevoir de recommandation d'achat.

### Public gratuit

Les capitaux inférieurs à 2 000 euros restent un public pertinent pour l'acquisition et l'éducation. Ils ne sont pas considérés comme le cœur économique initial, car le prix du produit peut représenter lui-même une friction disproportionnée.

## 4. Tâche client

> Avec mon capital, mes montants d'ordre, ma fréquence, mes devises et mes frais, quelle part de ma performance est absorbée, et à partir de quel niveau mes opérations deviennent-elles économiquement significatives ?

Le produit doit réduire trois travaux manuels :

1. reconstituer des barèmes dispersés ;
2. convertir les frais en impact comparable sur l'ordre, le capital et la performance ;
3. relier les coûts à l'historique réel plutôt qu'à une hypothèse abstraite.

## 5. Produit d'entrée

### Gratuit — calculateur pré-transaction

Entrées minimales :

- capital ;
- montant moyen par ordre ;
- fréquence ;
- devise ;
- commissions et frais de change saisis ou sélectionnés ;
- spread et slippage laissés comme hypothèses clairement identifiées.

Sorties minimales :

- coût aller-retour en euros ;
- coût en pourcentage de l'ordre et du capital ;
- coût annuel selon la fréquence ;
- rendement brut nécessaire pour couvrir les frictions ;
- comparaison de plusieurs tailles ou fréquences ;
- rapport partageable.

### Payant — suivi des coûts réels

Après preuve de demande :

- import de transactions ;
- comparaison brut/net ;
- ventilation commission, change, spread, slippage estimé et turnover ;
- historique mensuel ;
- comparaisons par courtier, marché, devise et taille d'ordre ;
- scénarios et exports ;
- traitement local lorsque possible.

## 6. Positionnement

Breaktest n'est pas :

- un courtier ;
- un robo-advisor ;
- un assistant de sélection d'actions ;
- un journal psychologique de trading ;
- une certification ;
- une promesse de réduction garantie des frais.

Breaktest est une couche indépendante de **cost intelligence** : elle transforme des frais explicites et des hypothèses de friction en conséquences économiques compréhensibles.

## 7. Séquence stratégique

1. **Calculateur gratuit** — valider que le problème attire un trafic qualifié.
2. **Cost Tracker** — valider l'import, la récurrence et le paiement annuel.
3. **Base de barèmes et parseurs** — réduire la saisie manuelle.
4. **Benchmarks anonymisés** — comparer les coûts réellement observés, sous consentement.
5. **Comparateur indépendant** — ajouter les courtiers sans laisser l'affiliation déterminer le classement.
6. **API et widgets** — distribuer le moteur chez des médias, communautés et fintechs.
7. **Infrastructure de transaction-cost intelligence** — données, benchmarks et intégrations B2B.

Les étapes 4 à 7 sont des options. Elles ne sont autorisées qu'après preuves de volume, de consentement, de qualité des données et de viabilité juridique.

## 8. Défensibilité recherchée

Les calculs et l'IA ne constituent pas seuls un avantage durable. Les actifs défensifs potentiels sont :

- une base de barèmes versionnée ;
- des parseurs couvrant de nombreux formats de courtiers ;
- un historique personnel difficile à migrer ;
- des données d'exécution agrégées et consenties ;
- des benchmarks par taille d'ordre, marché et courtier ;
- des intégrations et une API ;
- une réputation de neutralité et de transparence méthodologique.

## 9. Règles de conformité produit

- Présenter des calculs et scénarios, pas une recommandation personnalisée sur un instrument.
- Ne jamais écrire « achète », « vends », « conserve » ou « ce courtier est le meilleur pour toi ».
- Un seuil de coût est un résultat mathématique fondé sur les paramètres saisis, pas une décision d'investissement.
- Distinguer coûts observés, coûts contractuels et coûts implicites estimés.
- Afficher les hypothèses, la source et la date de chaque barème.
- Ne pas exécuter ni transmettre d'ordre.
- Obtenir un avis juridique avant conseil personnalisé, affiliation, connexion transactionnelle ou marketplace.

## 10. Gate commercial

Aucune nouvelle fonctionnalité de fond ne doit être construite avant d'obtenir la preuve suivante :

- utilisateurs qualifiés revenant effectuer une seconde analyse ;
- demande d'import ou de suivi automatique ;
- au moins cinq paiements ou réservations payantes après exposition suffisante ;
- coût de support et de nettoyage compatible avec un produit automatisé.

Les critères exacts sont définis dans `VALIDATION_PLAN.md`.

## 11. Travaux suspendus

- H3 à H6, sauf nécessité directe démontrée par la validation commerciale ;
- certification de stratégies ;
- score global de recommandation ;
- application native ;
- synchronisation courtier complète ;
- marketplace, affiliation et API ;
- conseil, signaux, allocation et exécution.

Le code existant demeure un actif technique réutilisable. Le coût déjà engagé ne justifie pas la poursuite d'une fonction sans preuve client.