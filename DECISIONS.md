# Breaktest — décisions du projet

## D001 — Vendre l'audit, pas les signaux

- Statut : **remplacée par D017**
- Décision historique : Breaktest se positionnait d'abord comme une couche de vérification de stratégies et journaux existants.
- Élément conservé : aucune génération de signaux ni promesse de surperformance.

## D002 — Fonctionnement avant apparence

- Statut : active
- Décision : une fonction visuellement réussie ne peut pas être déclarée terminée sans validation réelle.

## D003 — Local-first pour le prototype

- Statut : active
- Décision : le traitement des données financières reste local lorsque cela est possible.
- Conséquence : confidentialité et faibles coûts, avec des limites pour les comptes, synchronisations et calculs à grande échelle.

## D004 — Pas de filtrage rétrospectif trompeur

- Statut : active
- Décision : un trade ne peut pas être retiré d'une stratégie exploitable uniquement parce qu'il s'est révélé perdant.
- Conséquence : séparer strictement filtres ex ante et analyses ex post.

## D005 — Direction évolutive

- Statut : active
- Décision : les orientations peuvent être remplacées au fil des preuves.
- Conséquence : conserver l'historique, sans maintenir simultanément des visions incompatibles.

## D006 — Implication minimale du fondateur

- Statut : active
- Décision : Ayman intervient principalement pour valider, rejeter ou réorienter.
- Conséquence : ChatGPT et Codex prennent en charge la décomposition, les choix techniques ordinaires, les tests et la mise à jour documentaire.

## D007 — Un fichier HTML canonique technique

- Statut : active
- Décision : `app/Breaktest_Studio.html` reste l'actif technique canonique provisoire.
- Conséquence : les anciennes variantes sont archivées, pas développées séparément. La page de validation commerciale doit rester isolée de ce moteur.

## D008 — Amorçage GitHub isolé avant dépôt produit définitif

- Statut : active
- Décision : utiliser temporairement `breaktest-bootstrap` dans `babou9280/investment-strategy-evaluation`.
- Conséquence : aucune modification Breaktest dans `main` ; migration vers un dépôt produit dédié après validation possible.

## D009 — Codex travaille depuis le dépôt

- Statut : active
- Décision : les missions Codex prennent pour source les fichiers versionnés dans le dépôt et la branche associés à l'environnement.

## D010 — Audit local recevable avec empreinte

- Statut : active
- Décision : un audit local est recevable lorsque le fichier est identifié par SHA-256 et que les comportements déclarés ont été exécutés.

## D011 — Les données numériques source échouent fermement

- Statut : active
- Décision : une valeur numérique obligatoire explicitement invalide ne peut jamais devenir zéro ni être remplacée silencieusement.
- Conséquence : `missing`, `invalid` et zéro réel sont distingués ; toute dérivation conserve sa provenance.

## D012 — Un modèle distinct et antérieur pour chaque décision

- Statut : active pour le moteur historique
- Décision : chaque trade rejoué utilise uniquement les lignes backtest sorties strictement avant son entrée.

## D013 — Le budget de turnover est consommé chronologiquement

- Statut : active pour le moteur historique
- Décision : le plafond est appliqué décision après décision sur une fenêtre glissante de 365,25 jours.

## D014 — Le nominal est réservé entre l'entrée et la sortie

- Statut : active pour le moteur historique
- Décision : une décision conservée doit réserver son nominal complet jusqu'à sa sortie.

## D015 — Le PnL devient disponible uniquement à la sortie

- Statut : active pour le moteur historique
- Décision : le PnL d'une position financée est appliqué une seule fois à sa sortie valide.

## D016 — Les résultats observés restent séparés des scénarios simulés

- Statut : active
- Décision : brut observé, net fixe observé, full-cost observé et résultat simulé sont des bases distinctes et auditables.
- Conséquence : une base observée ne peut pas être écrasée par une estimation ou subir une seconde soustraction des coûts.

## D017 — Pivot vers Breaktest Cost Intelligence

- Statut : **active, validée par Ayman le 13 juillet 2026**
- Décision : Breaktest devient une application web installable centrée sur l'impact économique des commissions, du change, du spread, du slippage et de la rotation pour les petits et moyens portefeuilles.
- Client initial : investisseur autonome, environ 2 000 à 50 000 EUR de capital, avec usage régulier et complexité de coûts suffisante.
- Justification : cette direction exploite l'insight le plus fort du projet académique, réduit le besoin d'autorité humaine préalable et permet une validation grand public rapide.
- Conséquence : le moteur d'audit de stratégie devient un actif réutilisable, non la feuille de route automatique.

## D018 — Valider le marché avant d'étendre le produit

- Statut : active
- Décision : le prochain risque traité est la demande commerciale.
- Gate : usage répété, demande d'import, paiement réel et automatisation suffisante avant développement du Cost Tracker.
- Conséquence : H3 à H6, application native, connexion courtier, marketplace, API et fonctions d'audit étendu sont suspendus sauf preuve client directe.

## D019 — Le premier produit est un calculateur, pas un conseiller

- Statut : active
- Décision : la page de validation calcule les conséquences de paramètres saisis sans recommander un instrument, un courtier, une taille ou une fréquence.
- Conséquence : elle peut comparer des scénarios, mais ne doit jamais désigner automatiquement une option optimale.

## D020 — Les coûts gardent leur nature et leur provenance

- Statut : active
- Décision : distinguer dans toute évolution :
  - coût observé dans un relevé ;
  - coût contractuel issu d'un barème daté ;
  - coût implicite estimé ;
  - hypothèse utilisateur.
- Conséquence : aucune estimation de spread ou slippage ne peut être présentée comme un montant réellement payé.

## D021 — Les très petits capitaux sont d'abord un canal gratuit

- Statut : active
- Décision : les utilisateurs les plus sensibles aux coûts ne sont pas supposés être les meilleurs payeurs.
- Conséquence : calculateur gratuit pour l'acquisition ; cœur payant initial centré sur les investisseurs dont la fréquence et le capital permettent une économie potentielle supérieure au prix.

## D022 — L'affiliation ne doit jamais déterminer le classement

- Statut : active
- Décision : toute future rémunération d'un courtier doit être divulguée et séparée de la méthodologie de comparaison.
- Conséquence : aucune affiliation avant politique publique de neutralité et revue juridique.

## D023 — La défensibilité viendra des données et intégrations, pas de l'IA seule

- Statut : active
- Décision : l'IA, l'interface et un calculateur sont copiables.
- Actifs défensifs recherchés : barèmes versionnés, parseurs, historique utilisateur, données consenties, benchmarks, API, intégrations et réputation de neutralité.

## D024 — Fermeture de la mission H3

- Statut : active
- Décision : la pull request `#14` est fermée sans fusion après le pivot.
- Conséquence : son code reste non validé et ne peut être repris qu'après démonstration d'un besoin direct pour le produit retenu.

## D025 — Le coût devient une explication, pas le résultat principal

- Statut : **active, issue de la critique d'Ayman du 13 juillet 2026**
- Décision : Breaktest doit mettre en avant le seuil brut nécessaire lorsque l'avantage brut est absent, puis la part d'avantage conservée et la marge nette lorsqu'il est explicitement fourni.
- Conséquence : un total de frais isolé ne suffit plus à justifier une fonctionnalité centrale.

## D026 — Les contraintes inverses structurent la Capital Efficiency

- Statut : active
- Décision : le produit peut calculer des frontières mathématiques conditionnelles — taille, fréquence, budget et brut requis — sans les présenter comme recommandations.
- Conséquence : un cas impossible doit être nommé `structurally_unreachable`, jamais remplacé par `Infinity` ou une pseudo-solution.

## D027 — La barre mondiale repose sur la preuve et l'utilité

- Statut : active
- Décision : la différenciation recherchée combine calcul inverse, plancher variable, rétention de l'avantage, provenance, cas limites, auditabilité et expérience compréhensible.
- Conséquence : aucune métrique, visualisation ou fonction n'entre dans le produit uniquement parce qu'elle paraît sophistiquée ou valorisante pour une candidature.

## D028 — Les livrables de critique sont interactifs et hors ligne

- Statut : **active, validée par Ayman le 14 juillet 2026**
- Décision : les futurs livrables principaux remis pour critique doivent être de véritables expériences HTML navigables, utilisables sans internet et sans navigation lourde ; des images seules ne sont pas recevables.
- Conséquence : privilégier un fichier HTML autonome ou, lorsque la séparation des ressources est nécessaire, un bundle ZIP local avec `index.html`, chemins relatifs, manifeste, empreintes et aucune dépendance distante.
- Gate : aucun package n'est remis comme version aboutie avant stabilisation rigoureuse du fond, des calculs, de l'UX et des preuves sur le package exact.

## D029 — La recherche des angles morts est permanente et multidisciplinaire

- Statut : **active, validée par Ayman le 14 juillet 2026**
- Décision : jusqu'à déclaration explicite de fin du projet, ChatGPT et Codex doivent rechercher activement les défauts visibles, adjacents et rétrospectifs dans tous les domaines liés au projet, et pas seulement dans les calculs.
- Domaines minimaux : finance, quantitatif, données, produit, UX, accessibilité, réglementation, droit, sécurité, ingénierie, business model, marché, validation, distribution, opérations, réputation, valeur académique et gouvernance.
- Conséquence : toute critique doit produire selon le cas une correction locale, une règle permanente, un test de non-régression, une limite explicite ou un gate de réexamen.
- Registre d'autorité : `docs/governance/BLIND_SPOT_REGISTER.md`.
- Limite : une CI verte ne prouve ni l'exhaustivité, ni l'utilité, ni la conformité, ni la demande commerciale.

## D030 — L'avantage brut possède une définition financière stricte

- Statut : active
- Décision : l'avantage brut demandé par Edge Survival désigne une moyenne brute par opération complète, gains, pertes et opérations nulles inclus, avant les coûts saisis, sur un nominal compatible.
- Conséquence : taux de réussite, gain moyen des gagnants, CAGR, Sharpe, performance totale du compte, objectif personnel et résultat déjà net ne peuvent jamais servir de substituts silencieux.
- Contrat : `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md`.
- Gate : avant toute dérivation automatique, préciser estimateur, échantillon, période, univers, base brute/nette et provenance.

## D031 — Capital et fréquence sont réellement facultatifs pour le diagnostic par opération

- Statut : active
- Décision : le seuil, le plancher et Edge Survival doivent fonctionner sans capital ni fréquence mensuelle.
- Conséquence : l'absence de fréquence rend les sorties annuelles indisponibles avec `frequency_missing` ; l'absence de capital rend uniquement les ratios au capital indisponibles avec `capital_missing`.
- Interdiction : aucun défaut silencieux à quatre opérations mensuelles ou à un capital fictif.

## D032 — Le formulaire initial reste neutre et les résultats obsolètes disparaissent

- Statut : active
- Décision : aucune hypothèse financière synthétique ne doit être préremplie comme saisie utilisateur ; achat simple / aller-retour doit être choisi explicitement.
- Conséquence : le scénario de démonstration est chargé par une action volontaire et marqué `synthetic_demo`.
- Règle de fraîcheur : toute modification d'entrée masque immédiatement le résultat précédent et demande un nouveau calcul.
- Justification : éviter ancrage, provenance fausse et coexistence d'un diagnostic avec des hypothèses déjà modifiées.

## D033 — Une frontière mathématique ne prouve pas la faisabilité du capital

- Statut : active ; faisabilité immédiate démontrée dans le périmètre synthétique cash long, faisabilité générale non implémentée
- Décision : distinguer capital de référence, capital alloué, cash disponible, nominal réservé et exposition avant de qualifier une taille frontière de faisable.
- Conséquence : le produit actuel ne doit ni supposer un levier, ni affirmer qu'une frontière tient dans le capital disponible.
- Contrat futur : `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md`.
- Gate : stabiliser Edge Survival, valider l'utilité de cette information, définir les positions simultanées, puis réutiliser C1/C4.

## D034 — Breaktest Cost Gate devient la trajectoire pré-trade validée

- Statut : **active comme direction stratégique, validée par Ayman le 14 juillet 2026 ; fondation synthétique implémentée, produit et marché non validés**
- Décision : Breaktest doit pouvoir évoluer vers une couche de contrôle pré-trade personnalisée qui confronte un trade envisagé aux frictions, au capital et cash libres, à la taille proposée, à la liquidité, aux paramètres utilisateur et à un avantage brut ou une fourchette explicitement fournis.
- Articulation : Cost Intelligence, Capital Efficiency et Edge Survival Envelope restent le noyau analytique de cette future couche ; leur travail en cours n'est ni annulé ni interrompu.
- Sortie autorisée : `findings[]` conserve chaque constat. La synthèse interne peut utiliser `invalid_input`, `unsupported_scope`, `snapshot_unusable`, `structurally_non_viable`, `edge_not_surviving_modelled_friction`, `capital_not_feasible`, `execution_cost_risk`, `constraint_breach`, `insufficient_data` ou `no_incompatibility_detected_under_assumptions`, sans afficher un feu vert. `constraint_breach` désigne uniquement une contrainte utilisateur explicite.
- Data Quality Gate : toute conclusion utilisant une donnée externe exige source, timestamp, fraîcheur, instrument, place, devise, couverture, provenance, valeurs manquantes, incertitude, licence et domaine de validité visibles.
- Interdictions actuelles : aucune donnée temps réel, connexion courtier, compte, stockage, réseau, exécution, probabilité d'exécution, ordre limite conseillé ou recommandation personnalisée sans décisions et validations distinctes.
- Frontière réglementaire : le vocabulaire « exécuter », « rejeter », « acheter », « vendre », « ordre limite conseillé », « taille optimale » ou équivalent prescriptif reste interdit avant revue juridique et produit.
- Contrat de direction : `docs/product/COST_GATE_DIRECTION.md`.
- Gates : Edge Survival fusionné ; réconciliation hostile des contrats ; éventuel moteur synthétique cash long avec oracles ; prototype utilisateur local ; Data Quality Gate, validation économique et revue juridique avant toute extension externe.

## D035 — La première preuve Cost Gate reste un moteur synthétique isolé

- Statut : **active comme décision technique interne, 14 juillet 2026**
- Décision : la PR `#24` démontre les contrats Cost Gate dans `cost_gate_foundation/`, sans ajouter d'interface, de donnée externe, de compte, de stockage, de réseau ni de capacité d'ordre.
- Domaine exécuté : compte cash, achat long sans levier, action ou ETF au comptant, devise de compte EUR, hypothèses manuelles ou `synthetic_demo`.
- Invariants : cash immédiat distinct de la friction du cycle, cash plafonné par l'allocation libre de stratégie, holds non déduits deux fois, quantité/prix/devise réconciliés, avantage brut réellement aligné, snapshots déterministes et constats multiples conservés.
- Preuve fonctionnelle : head `cfa88e861c2ad0715b183af2bac2368a2d7bbdb4`, run GitHub Actions `29334708343` (`#604`), CG-01 à CG-18 et non-régressions réussis.
- Limite : cette preuve est technique et synthétique. Elle ne valide ni interface, ni donnée réelle, ni utilité, ni conformité, ni offre commerciale.
- Validation : `docs/validation/COST_GATE_FOUNDATION.md`.

## D036 — La revue du head final impose une seconde version synthétique

- Statut : **active comme correction technique rétrospective, 14 juillet 2026**
- Décision : `cost-gate-foundation-1-synthetic` corrige les dépendances silencieuses entre couches, l'expiration des anciens constats, la coexistence stale/conflit, l'ordre canonique des ensembles et l'alignement `operation_scope` / `side_count`.
- Politique : `edge_not_surviving_modelled_friction` décrit un avantage absorbé sans inventer une contrainte utilisateur ; `constraint_breach` reste réservé à une limite explicitement fournie.
- Versionnement : snapshot `2`, politique de synthèse `2` et catalogue de constats `2` ; les anciennes preuves `#604` et `#606` restent des preuves de la version `0`, pas de cette correction.
- Preuve : head fonctionnel `2ebf0e3e37852e4f3252e54149e147aa0d5712c3`, run GitHub Actions `29338189190` (`#608`), artefact `8312898043` inspecté ; synchronisation documentaire `9d38ce31e33b41159d0c6180205c3747c3bb6f1d`, run `#610`. Les trois fils associés ont été résolus après ces preuves.

## D037 — La cohérence Cost Gate doit être réconciliée entre toutes les couches

- Statut : **active comme correction technique rétrospective, 14 juillet 2026**
- Décision : `cost-gate-foundation-2-synthetic` bloque toute synthèse favorable lorsque quantité × prix, nominal, base de cash, holds inclus, devise ou coûts communs d'entrée et de cycle décrivent des économies incompatibles.
- Temps et provenance : une source observée après l'évaluation est invalide ; seules les sources critiques pilotent l'expiration agrégée ; collections, éléments et identifiants stables mal formés ne sont jamais assimilés silencieusement à une absence.
- Coûts non encore modélisés : une taxe ou un frais contractuel d'entrée non nul bloque la synthèse favorable tant qu'une contrepartie explicite n'existe pas dans le modèle de cycle. Ce refus est une limite, pas une estimation fiscale.
- Versionnement : snapshot `3`, politique de synthèse `3` et catalogue de constats `3` ; les preuves des versions `0` et `1` ne valident pas cette correction.
- Preuve : head fonctionnel exact `faafd348da55217e96ba67efd9f9434be62725ca`, run GitHub Actions `29342135098` (`#612`), artefact `8314518122` et captures inspectés, digest `sha256:12b2b247607237b3b5ce2725bd4fbb49a5f6c4b67122ad6f52530b3f29bcda9b`.
- Gate : la synchronisation documentaire `6cfc43e4bbb015c8512c0ae26aad02d04503c897` a réussi dans le run `#614` et les quatre fils ont été résolus avec preuves. La relecture automatisée suivante n'a pas été exécutée faute de quota ; la revue hostile indépendante a conduit à D038. Cette décision n'autorise ni donnée externe, ni interface, ni fusion.

## D038 — Une couche incomplète ne peut pas conserver un constat favorable dépendant

- Statut : **active comme correction technique rétrospective, 14 juillet 2026**
- Décision : `cost-gate-foundation-3-synthetic` invalide un coût FX non nul entre devises identiques même sans cash, rend la friction incomplète lorsqu'une taxe ou un frais d'entrée manque au cycle, et bloque alors tout constat Edge Survival dépendant du total.
- Temps et provenance : chaque source exige instrument, place, devise et booléen critique explicites ; une heure d'évaluation invalide rend le snapshot incomplet et les anciens constats inutilisables, même à hash de contenu identique.
- Explication : une source non critique stale peut laisser actifs les constats indépendants, mais ne peut jamais coexister avec un constat affirmant que toutes les sources sont actuelles.
- Versionnement : snapshot `4`, politique de synthèse `4` et catalogue de constats `4` ; les preuves des versions antérieures ne valident pas ces garde-fous.
- Preuve : head fonctionnel exact `753152d9cce1feabba48e54b32b4eed2ce3f5e07`, tree `574ec387391a995cec167149cc099e87c1f92c02`, run GitHub Actions `29345208179` (`#616`), artefact `8315786779` inspecté, digest `sha256:67b4603cfd95271a4916ee04e36ed229cb352a6526b0a25f40fd1089dcb8b614`.
- Gate : la synchronisation documentaire doit réussir sur son propre head exact. La revue automatisée finale demandée sur la version `2` n'a pas été exécutée faute de quota ; la revue hostile indépendante a produit cette correction. Aucune donnée externe, interface ou fusion n'est autorisée par cette décision.
