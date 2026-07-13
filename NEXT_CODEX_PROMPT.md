# Prochaine mission Codex — Edge Survival Envelope

## Statut

Le moteur Capital Efficiency, l'expérience progressive et la matrice de scénarios synthétiques sont fusionnés dans `breaktest-bootstrap`.

La mission active étend le laboratoire avec une fourchette déterministe d'avantage brut afin de réduire la fausse précision d'une valeur ponctuelle.

- Branche : `strategy/edge-survival-envelope`
- Base : `breaktest-bootstrap`
- Publication externe : interdite
- `main` : strictement hors périmètre

Ne fusionne rien automatiquement.

## Avant de travailler

Lire intégralement :

- `AGENTS.md` ;
- les six fichiers canoniques ;
- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `docs/product/CAPITAL_EFFICIENCY_CORE.md` ;
- `docs/product/EDGE_SURVIVAL_ENVELOPE.md` ;
- `docs/product/WORLD_CLASS_PLATFORM_THESIS.md` ;
- `docs/product/DIFFERENTIATION_AND_EVIDENCE_PLAN.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- `docs/tasks/EDGE_SURVIVAL_ENVELOPE.md` ;
- les validations, revues, scénarios et fichiers de `capital_efficiency_lab/`.

## Objectif unique

Permettre trois modes sans prédire le rendement :

1. seuil seulement ;
2. valeur brute unique ;
3. fourchette basse, centrale et haute fournie par l'utilisateur.

Le produit doit montrer si la conclusion survit dans toute la fourchette, traverse le seuil ou échoue dans toute la fourchette, et distinguer ce qui peut être dilué de ce que le plancher variable rend structurellement impossible.

## Contrat

Implémente strictement `docs/standards/EDGE_RANGE_CONTRACT.md`.

Exigences critiques :

- fourchette complète obligatoire ;
- `G_low <= G_base <= G_high` ;
- aucune permutation, déduction ou valeur par défaut silencieuse ;
- valeurs négatives autorisées si explicites ;
- égalité au seuil non qualifiée de marge positive ;
- marges et frontières réconciliées ;
- version moteur distincte ;
- rétrocompatibilité du mode point ;
- aucune valeur non finie ou `-0`.

## Expérience

Le parcours reste progressif :

- le seuil fonctionne seul ;
- le choix valeur unique/fourchette est facultatif ;
- la fourchette ne doit pas surcharger le premier écran ;
- une phrase concrète précède les détails ;
- afficher les marges basse, centrale et haute ;
- afficher une seule contrainte inverse à la fois ;
- montrer provenance, unités, dénominateurs et limites.

Interdire les mots et concepts suivants comme résultat produit :

- probabilité de succès ;
- intervalle de confiance ;
- prévision Breaktest ;
- scénario optimal ;
- recommandation de taille, fréquence, actif ou transaction.

## Tests obligatoires

- oracles indépendants des trois modes ;
- fourchette partielle et ordre invalide ;
- bornes égales ;
- égalité au seuil ;
- survie complète, traversée et échec complet ;
- relation au plancher variable ;
- hypothèses négatives et nulles ;
- coûts fixes nuls ;
- invariants et monotonies ;
- matrice synthétique existante inchangée ;
- Chromium 390, 768, 1024 et 1440 px ;
- clavier, focus, `aria-live` et absence de débordement ;
- captures internes des états principaux ;
- intégrité locale, syntaxe ;
- non-régressions H1–H2/C1–C4 et Q0.

## Interdictions

- aucune donnée réelle, import, courtier ou tarif réel ;
- aucun compte, stockage, réseau, analytics, email ou paiement ;
- aucune publication ;
- aucune statistique avancée ;
- aucune modification de `app/Breaktest_Studio.html` ;
- aucune modification fonctionnelle de `validation_site/` ;
- aucune reprise H3 à H6.

## Livrables

- moteur et interface mis à jour sous `capital_efficiency_lab/` ;
- tests Node et Chromium ;
- captures de revue ;
- `docs/validation/EDGE_SURVIVAL_ENVELOPE.md` ;
- synchronisation canonique minimale fondée sur les exécutions réelles.

## Définition de terminé

La mission est terminée uniquement si le head exact est entièrement vert, que les captures ont été inspectées, que la fourchette réduit réellement la fausse précision sans alourdir le parcours, et qu'aucune affirmation statistique, commerciale ou réglementaire n'est ajoutée.
