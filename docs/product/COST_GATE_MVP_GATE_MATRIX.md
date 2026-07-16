# Breaktest Cost Gate — matrice de gates avant MVP

## 1. Thèse produit

Cost Gate doit répondre avant un ordre :

> Quelles incompatibilités économiques ou informationnelles sont détectables pour ce scénario, avec mon cash déclaré, mes contraintes explicites et les données disponibles ?

La promesse n'est pas de déclarer un trade bon, sûr ou exécutable. La valeur vient de la réunion de couches habituellement séparées :

- friction et seuil ;
- survie de l'avantage ;
- faisabilité du cash ;
- qualité et fraîcheur des données ;
- risque de coût d'exécution ;
- contraintes explicites ;
- preuve et reproductibilité.

## 2. Périmètre MVP recommandé

Le premier périmètre testable est volontairement étroit :

```text
instruments = actions et ETF au comptant
position = achat long
account = cash, sans marge
currency_model = une devise de compte, change explicite si nécessaire
operation_scope = achat simple ou cycle aller-retour pour la friction économique
execution = aucune transmission d'ordre
market_data = hypothèses manuelles ou démonstration synthétique au premier test
```

Hors périmètre initial :

- options, futures, CFD et produits structurés ;
- vente à découvert ;
- levier ou marge ;
- portefeuille multi-devises complexe ;
- netting et marge portefeuille ;
- probabilité d'exécution ;
- optimisation ou recommandation d'ordre ;
- données temps réel non licenciées.

Ce resserrement protège la précision et la compréhension. Il n'est pas une décision définitive sur le marché futur.

## 3. Séquence de gates

Les identifiants ci-dessous font autorité pour toute la documentation Cost Gate. Un autre document peut détailler une étape, mais ne doit pas créer une numérotation parallèle.

### Gate 0 — cohérence interne

Preuves requises :

- contrats sans contradiction ;
- unités et bases alignées ;
- séparation cash immédiat / friction du cycle ;
- snapshot et invalidation ;
- findings multiples ;
- registre des angles morts ;
- aucune formulation prescriptive.

Sortie : autorise uniquement un moteur synthétique interne.

Statut de la version `0` : contrats corrigés et moteur synthétique CG-01 à CG-18 réussis au head fonctionnel `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4` dans GitHub Actions `#604`, puis documentation synchronisée au head `be6aa09d2b87bb07bd19258f393b496e522580a1` dans le run `#606`.

Une revue exacte de `be6aa09` a révélé trois défauts rétrospectifs et l'audit adjacent trois incohérences supplémentaires. La version `1` les corrige au head `2ebf0e3e37852e4f3252e54149e147aa0d5712c3`, validé par les runs exacts `#608` et `#610`. La revue suivante a ouvert quatre défauts de nominal, temps, expiration et collections ; la version `2` les corrige et a été validée par les runs `#612` et `#614`, puis les fils ont été résolus. La revue automatisée finale n'a pas pu s'exécuter faute de quota ; la revue hostile indépendante a révélé quatre défauts adjacents de complétude et provenance. La version `3` est validée techniquement au head `753152d9cce1feabba48e54b32b4eed2ce3f5e07` par le run `#616`, puis synchronisée au head `3fb6341d51ff46b70dd774546955fbb1c66a400e` par le run `#618`. La PR `#24` a été fusionnée par squash dans `breaktest-bootstrap` au commit `e61d166d81da54a7d4ee596db2c2447fcb418eb2`, dont le tree est identique au head final. **Gate 0 est clôturée.**

### Gate 1 — valeur compréhensible sans donnée réelle

Prototype : HTML hors ligne, hypothèses manuelles et scénarios synthétiques.

Statut : **autorisée par Ayman le 15 juillet 2026 et active sur `strategy/cost-gate-offline-critique`**. Le protocole et les seuils sont préenregistrés avant code et avant observation dans `docs/tasks/COST_GATE_OFFLINE_CRITIQUE.md`. Un premier essai fondateur du bundle multifichier sur iPad a révélé un blocage de démarrage et d'effacement des champs ; il ne compte pas comme observation. L'HTML autonome, son package exact et son repli sans JavaScript sont techniquement exécutés au head `e42bce2a29589000a95697aa2d7228645fe9b909`, run `#647`. Ayman a confirmé le 16 juillet 2026 que ce fichier exact charge la démonstration et produit le résultat sur le même iPad. Aucun résultat des cinq participants n'est encore disponible et Gate 1 n'est pas clôturée.

Questions :

- l'utilisateur comprend-il ce que le contrôle apporte au-delà d'un calculateur de frais ?
- distingue-t-il seuil, capital, donnée et exécution ?
- comprend-il qu'un état favorable n'est pas une autorisation ?
- identifie-t-il le facteur limitant sans aide ?
- la saisie est-elle réalisable en moins de trois minutes ?

Seuils de décision initiaux :

- au moins 4 participants sur 5 identifient correctement le facteur principal ;
- aucun participant ne décrit le résultat favorable comme une recommandation après lecture autonome ;
- au moins 3 sur 5 déclarent une situation réelle dans laquelle ils auraient utilisé le contrôle ;
- au moins 3 sur 5 savent quelles entrées ils peuvent fournir et lesquelles leur manquent.

Ces seuils sont préenregistrés comme règles internes de falsification du prototype. Avec cinq participants — surtout s'ils proviennent d'un échantillon de convenance — ils ne permettent aucune généralisation statistique ni preuve de marché. Tout changement après observation doit être documenté comme tel.

### Gate 2 — capacité à fournir les entrées

Mesurer séparément :

- connaissance des commissions ;
- capacité à estimer ou trouver le change ;
- capacité à comprendre spread/slippage ;
- disponibilité du cash réglé et des réservations ;
- capacité à fournir un avantage brut compatible ;
- compréhension de la provenance.

Décision :

- si la plupart des utilisateurs ne disposent pas de `G`, conserver le seuil et le capital comme parcours principal ;
- ne pas forcer une fausse précision ;
- dérivation automatique future uniquement depuis des données validées.

### Gate 3 — frontière réglementaire

Avant test public ou personnalisation réelle :

- revue juridique des formulations ;
- analyse de la frontière information / recommandation ;
- revue du mot « personnalisé » ;
- validation des conditions d'utilisation et limites ;
- politique de conflits d'intérêts ;
- aucune collecte de profil inutile.

Échec : retirer ou reformuler toute sortie interprétée comme suitability, conseil ou autorisation.

### Gate 4 — économie et licence des données

Avant achat ou intégration :

- inventaire des fournisseurs ;
- droits d'affichage, stockage, calcul dérivé et redistribution ;
- couverture instruments/places/devises ;
- coût fixe et variable ;
- latence et disponibilité ;
- qualité historique ;
- support et conditions de résiliation ;
- coût par utilisateur actif ;
- marge brute après données et support.

Aucun fournisseur n'est sélectionné uniquement pour faciliter la démonstration.

### Gate 5 — Data Quality Gate exécuté

Preuves :

- timestamps et fuseaux ;
- politiques de fraîcheur ;
- mapping instrument/place/devise ;
- valeurs manquantes et conflits ;
- fallback interdit ;
- kill switch ;
- incident simulé ;
- snapshot reproductible.

Une donnée externe ne devient jamais implicitement plus fiable qu'une hypothèse utilisateur sans preuve de provenance.

### Gate 6 — faisabilité du capital

Preuves :

- cash réglé distinct de l'equity et du buying power ;
- ordres en attente et ledger de holds sans double retrait ;
- allocation de stratégie plafonnant le cash total du compte ;
- réservations ;
- cash immédiat distinct du coût du cycle ;
- périmètre cash long ;
- réconciliation C1/C4 ;
- aucune suggestion de levier.

### Gate 7 — comparaison ex ante / ex post

Uniquement après données réelles autorisées :

- snapshot pré-trade conservé ;
- exécution observée séparée ;
- commissions observées ;
- change observé ou contractuel ;
- spread/slippage estimé séparés ;
- écart prévision/observation expliqué ;
- aucune réécriture rétrospective du snapshot.

Objectif : mesurer l'utilité et calibrer les limites, pas revendiquer une prédiction parfaite.

### Gate 8 — demande commerciale

Mesurer :

- deuxième utilisation non sollicitée ;
- ordre réel analysé volontairement ;
- demande de connexion/import ;
- volonté de payer ;
- paiement ;
- remboursement ;
- économie ou erreur évitée documentée sans surpromesse.

Aucun développement lourd de connexion, compte ou marketplace avant signal suffisant.

## 4. Critères d'abandon ou de réorientation

Réorienter ou arrêter Cost Gate si :

- les utilisateurs le confondent durablement avec une recommandation ;
- la majorité ne peut pas fournir les entrées et refuse toute connexion ;
- le taux `insufficient_data` rend le produit rarement utile ;
- les données nécessaires coûtent plus que la valeur capturable ;
- les courtiers fournissent gratuitement une solution équivalente et les couches indépendantes n'ajoutent pas de valeur ;
- la faisabilité du capital exige immédiatement un moteur portefeuille trop complexe ;
- la revue juridique impose un modèle incompatible avec la distribution visée ;
- aucune répétition d'usage n'apparaît après un test qualifié.

## 5. Différenciation recherchée

La différenciation ne repose pas sur un bouton « vérifier ».

Elle repose sur :

- séparation rigoureuse des couches ;
- provenance et fraîcheur ;
- constat multiple explicable ;
- cash réel et réservations ;
- contraintes explicites ;
- Edge Survival sans prédiction inventée ;
- cas structurellement impossible ;
- snapshot reproductible ;
- future réconciliation ex ante / ex post ;
- neutralité multi-courtiers ;
- local-first lorsque possible.

## 6. Valeur pour une entreprise ou une candidature

Le projet doit démontrer de manière vérifiable :

- compréhension de microstructure et coûts ;
- rigueur quantitative ;
- model governance ;
- product discovery et critères d'arrêt ;
- UX de systèmes complexes ;
- ingénierie déterministe et tests ;
- frontière réglementaire ;
- stratégie de données et unit economics ;
- capacité à trouver et corriger des défauts rétrospectifs.

La preuve est le dossier exécutable, les contrats, les tests et les limites — pas l'affirmation d'avoir créé « la meilleure plateforme ».

## 7. Prochaine construction autorisée

Après Gate 0 :

- un moteur synthétique interne peut orchestrer des constats sans donnée réelle ;
- aucun état ne déclenche ou recommande un ordre ;
- aucune intégration externe n'est activée.

Un HTML offline est autorisé après réussite des oracles CG-01 à CG-18, des non-régressions, d'une exécution exact-head, de la clôture de Gate 0 et de la validation explicite d'Ayman obtenue le 15 juillet 2026. Il sert uniquement à la critique de Gate 1 ; les captures seules ne constituent pas ce prototype.

Après Gate 1 et Gate 2 seulement, décider si la saisie manuelle mérite d'être approfondie ou si la valeur dépend d'une dérivation depuis données réelles.
