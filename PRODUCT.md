# Breaktest - définition actuelle du produit

## Vision

Breaktest est une couche de contrôle qualité pour les backtests et journaux de trading. L'utilisateur importe un journal ou un résultat existant ; Breaktest teste ce qui subsiste après des hypothèses plus réalistes et documente les fragilités de la conclusion.

## Promesse actuelle

> Importer. Stresser. Vérifier ce qui reste.

Breaktest ne vend pas une promesse de surperformance. Il aide à déterminer si une performance historique résiste aux coûts, aux gagnants extrêmes, à une séparation temporelle entre historique et décisions, aux contraintes de turnover et de financement, et aux incohérences de données.

## Utilisateur cible provisoire

Investisseur particulier ou trader autonome, principalement francophone, déjà habitué aux tableurs, brokers ou outils de charting, mais ne souhaitant pas coder lui-même un protocole de validation statistique.

## Problèmes traités

- coûts, spreads, slippage et frais fixes sous-estimés ;
- performance dominée par un petit nombre de trades ;
- divergence entre backtest et live-test ;
- fuite temporelle entre historique d'entraînement et décisions rejouées ;
- allocation rétrospective du budget de turnover ;
- positions simultanées incompatibles avec le capital disponible ;
- gains ou pertes affichés avant leur réalisation réelle ;
- journal incohérent avec le résultat publié ;
- faible profondeur d'échantillon ;
- résultats difficiles à expliquer et à partager.

## Expérience cible

1. Importer un CSV ou ouvrir une démonstration.
2. Choisir capital, base de coûts et scénario.
3. Modifier une hypothèse à la fois.
4. Lire le résultat, le reality gap et les fragilités.
5. Examiner le laboratoire de robustesse et l'audit des données.
6. Exporter un rapport ou un fichier de scénario.

## Modules actuels du prototype

- Capital Fit ;
- Cost X-Ray ;
- Evidence Lab ;
- Trade Gate ;
- import CSV local ;
- scénarios et presets de coûts ;
- analyse des trades conservés ou retirés ;
- exports locaux.

La version actuelle utilise, pour chaque décision rejouée, uniquement un historique backtest antérieur, applique le plafond de turnover dans l'ordre chronologique sur une fenêtre glissante de 365,25 jours, réserve le nominal des positions financées entre leur entrée et leur sortie, puis applique leur PnL net uniquement à leur date de sortie.

Les sorties d'une date sont traitées avant les nouvelles entrées de cette date. Le gain ou la perte réalisé modifie donc la trésorerie disponible uniquement à partir de sa réalisation. La courbe affichée est une **courbe de trésorerie réalisée aux sorties**, agrégée par date, et non une valorisation mark-to-market.

Cette chaîne ne doit toujours pas être présentée comme une simulation complète de portefeuille : elle ne valorise pas les positions ouvertes entre entrée et sortie et ne gère pas le levier, les appels de marge, les intérêts, les dividendes ou les flux externes.

## Différenciation

Breaktest ne cherche pas prioritairement à créer une stratégie, des signaux ou un moteur d'exécution. Son angle est de vérifier et expliquer une performance déjà produite.

## Non-objectifs actuels

- recommandations d'investissement personnalisées ;
- promesse de rendement futur ;
- exécution automatique d'ordres ;
- synchronisation courtier complète ;
- données temps réel ;
- validation commerciale déjà démontrée.

## Direction évolutive

Cette définition représente la direction actuelle. Elle peut être modifiée lorsque de nouveaux apprentissages ou retours rendent une autre direction plus forte.
