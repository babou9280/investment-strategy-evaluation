# Breaktest — stratégie validée et raffinée

- Date de décision initiale : 13 juillet 2026
- Raffinement produit : 13 juillet 2026
- Extension stratégique : 14 juillet 2026
- Statut : **direction Cost Intelligence active ; proposition de valeur approfondie en Capital Efficiency ; trajectoire Cost Gate validée**
- Nom de travail actuel : **Breaktest Cost Intelligence**
- Nom de travail de la couche pré-trade : **Breaktest Cost Gate**
- Phase actuelle : prototype Gate 1 requalifié en sonde technique ; conception Cost Gate vNext et Cost Ledger v1 avant toute cohorte, sans donnée réelle ni validation externe acquise

## 1. Direction

Breaktest devient une application web installable destinée aux investisseurs particuliers disposant de petits ou moyens portefeuilles. Elle mesure la part de performance absorbée par les frictions d'exécution et, surtout, détermine si un avantage brut fourni par l'utilisateur subsiste après ces frictions.

La promesse de travail devient :

> Montrer si un avantage brut survit aux frictions avec le capital réel de l'utilisateur — et quelles contraintes économiques doivent être satisfaites pour qu'il subsiste.

Breaktest ne recommande pas un instrument financier et ne prédit pas son rendement. Il calcule et explique les conséquences économiques d'hypothèses fournies par l'utilisateur ou, plus tard, de transactions importées.

## 2. Insight fondateur

Le projet académique d'Ayman a montré que les frictions deviennent disproportionnées lorsque le capital est limité et que la rotation augmente. Dans le live-test étudié, la prime brute subsistait, mais la rentabilité nette restait contrainte par un budget de friction trop important. Le turnover annualisé observé était nettement supérieur à celui du backtest, sous les réserves méthodologiques propres à une fenêtre courte.

L'insight commercial n'est donc pas seulement « les coûts existent », mais :

> Un avantage brut peut sembler réel tout en étant économiquement inexploitable avec un capital, une taille d'ordre et une structure de coûts donnés.

Cet exemple constitue une preuve du mécanisme, pas une preuve de marché ni une estimation de sa fréquence dans la population.

## 3. Client initial

### Cible payante prioritaire

Investisseur ou trader autonome :

- capital investi approximatif de 2 000 à 50 000 euros ;
- au moins deux opérations, versements ou rééquilibrages par mois ;
- applique une méthode répétable ;
- connaît, estime ou veut dériver un rendement brut moyen par opération ;
- exposition possible à plusieurs devises, marchés, courtiers ou produits ;
- utilise déjà un courtier, un tableur, TradingView ou un outil de suivi ;
- souhaite comprendre sa performance nette sans recevoir de recommandation d'achat.

### Public gratuit

Les capitaux inférieurs à 2 000 euros restent un public pertinent pour l'acquisition et l'éducation. Ils ne sont pas considérés comme le cœur économique initial, car le prix du produit peut représenter lui-même une friction disproportionnée.

## 4. Tâche client

> Avec mon avantage brut, mon capital, mes montants d'ordre, ma fréquence, mes devises et mes frais, quelle marge subsiste réellement, et quelles contraintes de taille ou de fréquence doivent être satisfaites pour qu'elle ne soit pas absorbée ?

Le produit doit réduire quatre travaux manuels :

1. reconstituer des barèmes dispersés ;
2. convertir les frais en impact comparable sur l'ordre, le capital et la performance ;
3. distinguer coût fixe diluable et plancher variable non diluable ;
4. relier les coûts à l'avantage brut ou à l'historique réel plutôt qu'à une hypothèse abstraite.

## 5. Produit d'entrée révisé

### Couche gratuite — seuil et géométrie de friction

Entrées minimales :

- capital facultatif ;
- montant moyen par ordre ;
- fréquence ;
- commissions ;
- frais de change ;
- spread et slippage comme hypothèses identifiées.

Sorties :

- coût fixe et variable ;
- seuil brut de couverture ;
- plancher variable ;
- coût en euros, pourcentage et points de base ;
- coût annuel et relatif au capital ;
- courbe du seuil selon la taille d'ordre.

### Couche de valeur — Edge Survival

Entrée supplémentaire : avantage brut moyen par opération, directement saisi ou plus tard dérivé depuis un historique.

Sorties :

- marge nette en taux, points de base et euros ;
- part absorbée et part conservée ;
- taille minimale pour une marge positive ;
- taille minimale pour conserver une part cible ;
- impossibilité structurelle si l'avantage brut ne dépasse pas le plancher variable ;
- rendement brut requis pour une cible nette ;
- projection annuelle arithmétique clairement limitée.

### Frontière de capital et de fréquence

Lorsque le capital et un budget annuel de friction sont fournis :

- coût annuel rapporté au capital ;
- fréquence frontière sous budget ;
- grille de sensibilité taille × fréquence ;
- stress tests de coûts.

Aucune sortie n'est une recommandation. Les contraintes sont mathématiques et dépendent des hypothèses visibles.

### Payant — suivi réel, après preuve de demande

- import de transactions ;
- comparaison brut/net ;
- ventilation commission, change, spread, slippage estimé et turnover ;
- dérivation de l'avantage brut depuis les données ;
- historique mensuel de la part d'avantage absorbée ;
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
- une promesse de réduction garantie des frais ;
- un simple calculateur de commissions.

Breaktest est une couche indépendante de **capital-efficiency intelligence** : elle transforme des frais explicites, des hypothèses de friction et un avantage brut en contraintes économiques compréhensibles et auditables.

## 7. Séquence stratégique

1. **Capital Efficiency Lab interne** — valider les formules, les contraintes inverses et l'expérience de valeur.
2. **Prototype utilisateur contrôlé** — vérifier que le seuil, le plancher variable et la part d'avantage conservée révèlent une information réellement utile.
3. **Cost Tracker** — valider l'import, la récurrence et le paiement annuel.
4. **Capital Feasibility synthétique** — distinguer capital de référence, capital alloué, cash disponible et nominal réservé ; fondation immédiate exécutée, portefeuille encore futur.
5. **Cost Gate synthétique** — moteur interne et interface de critique hors ligne exécutés sans données externes ni recommandation ; cohorte suspendue pour approfondir le modèle de coûts avant de tester la compréhension.
6. **Base de barèmes et parseurs** — réduire la saisie manuelle.
7. **Data Quality Gate et donnée externe limitée** — une source et un univers restreints, après décision explicite.
8. **Benchmarks anonymisés** — comparer les coûts réellement observés, sous consentement.
9. **Comparateur indépendant** — ajouter les courtiers sans laisser l'affiliation déterminer le classement.
10. **API et widgets** — distribuer le moteur chez des médias, communautés et fintechs.
11. **Infrastructure de transaction-cost intelligence** — données, benchmarks et intégrations B2B.

L'extension des étapes 4 et 5 au-delà du domaine synthétique, ainsi que les étapes 6 à 11, reste conditionnelle. Elle exige les preuves d'usage, de volume, de qualité des données, de consentement, de viabilité économique et de conformité juridique correspondant à chaque gate.

## 8. Défensibilité recherchée

Les calculs et l'IA ne constituent pas seuls un avantage durable. Les actifs défensifs potentiels sont :

- une bibliothèque rigoureuse de contraintes économiques et de tests ;
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
- Un seuil, une taille minimale ou une fréquence frontière est un résultat mathématique fondé sur les paramètres saisis, pas une décision d'investissement.
- Ne jamais qualifier une taille ou une fréquence d'« optimale ».
- Distinguer coûts observés, coûts contractuels et coûts implicites estimés.
- Afficher les hypothèses, la source et la date de chaque barème.
- Ne pas exécuter ni transmettre d'ordre.
- Obtenir un avis juridique avant conseil personnalisé, affiliation, connexion transactionnelle ou marketplace.

## 10. Gate commercial

Aucune publication externe n'est autorisée avant que le laboratoire interne :

- réconcilie toutes les formules ;
- identifie correctement les cas impossibles ;
- fonctionne sans score arbitraire ;
- conserve hypothèses, unités, dénominateurs et provenance ;
- ne dégrade aucune validation historique.

Après cela, aucune nouvelle fonctionnalité de fond ne doit être construite avant d'obtenir la preuve suivante :

- utilisateurs qualifiés comprenant la contrainte révélée ;
- utilisateurs revenant effectuer une seconde analyse ;
- demande d'import ou de suivi automatique ;
- au moins cinq paiements ou réservations payantes après exposition suffisante ;
- coût de support et de nettoyage compatible avec un produit automatisé.

## 11. Travaux suspendus

- publication du calculateur Q0 actuel comme produit final ;
- H3 à H6, sauf nécessité directe démontrée ;
- certification de stratégies ;
- score global de recommandation ;
- application native ;
- synchronisation courtier complète ;
- marketplace, affiliation et API ;
- conseil, signaux, allocation et exécution ;
- statistiques avancées sans données suffisantes.

Le code existant demeure un actif technique réutilisable. Le coût déjà engagé ne justifie pas la poursuite d'une fonction sans preuve client.

## 12. Direction stratégique Cost Gate

Le 14 juillet 2026, Ayman a validé une trajectoire vers **Breaktest Cost Gate**, couche de contrôle pré-trade personnalisée. La fondation synthétique est depuis exécutée dans un domaine cash long strict ; le produit utilisateur reste futur.

La question de travail devient :

> Ce trade envisagé reste-t-il économiquement compatible avec les frictions, le capital libre, la taille proposée, la liquidité disponible et l'avantage brut explicitement fourni ?

Cette direction :

- conserve Cost Intelligence comme moteur de friction ;
- conserve Capital Efficiency comme moteur de contraintes ;
- conserve Edge Survival Envelope comme moteur de sensibilité ;
- ajoute à terme la faisabilité du capital, la qualité des données et la microstructure ;
- ne transforme pas encore Breaktest en conseiller, courtier ou moteur d'exécution.

La fondation conserve tous les constats dans `findings[]`. Une synthèse interne peut signaler `invalid_input`, `unsupported_scope`, `snapshot_unusable`, `structurally_non_viable`, `edge_not_surviving_modelled_friction`, `capital_not_feasible`, `execution_cost_risk`, `constraint_breach`, `insufficient_data` ou `no_incompatibility_detected_under_assumptions`. `constraint_breach` reste réservé à une contrainte utilisateur explicite. La dernière formule signifie seulement qu'aucune incompatibilité n'a été détectée dans les couches évaluées ; elle ne constitue jamais un feu vert.

Aucun état ne peut être produit à partir d'une donnée externe sans **Data Quality Gate** vérifiant source, timestamp, fraîcheur, couverture, instrument, place, devise, provenance, valeurs manquantes, incertitude et droit d'utilisation.

Le vocabulaire « exécuter », « rejeter », « ordre limite conseillé », « taille optimale » ou tout équivalent prescriptif reste interdit avant validation juridique, réglementaire et produit distincte.

La définition détaillée figure dans `docs/product/COST_GATE_DIRECTION.md`. La direction est validée stratégiquement, sa fondation et le prototype hors ligne seulement techniquement dans un domaine synthétique. Ayman a suspendu l'expérience de compréhension pour construire d'abord un modèle vNext fondé sur un ledger de coûts auditable. Rien n'est encore validé commercialement, juridiquement, par des utilisateurs ou sur donnée réelle.
