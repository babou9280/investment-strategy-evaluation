# Mission — Edge Survival Envelope

## Statut

- Branche : `strategy/edge-survival-envelope`
- Base : `breaktest-bootstrap`
- Phase : prototype interne
- Publication externe : interdite
- `main` : hors périmètre

## Objectif unique

Étendre le laboratoire Capital Efficiency afin qu'un utilisateur puisse tester une valeur brute ponctuelle ou une fourchette basse/centrale/haute sans que Breaktest prédise le rendement.

Le prototype doit répondre :

> La conclusion reste-t-elle stable dans toute la fourchette d'avantage brut que l'utilisateur a lui-même fournie ?

## Sources obligatoires

Lire intégralement :

- `AGENTS.md` ;
- les six fichiers canoniques ;
- `STRATEGY.md` ;
- `VALIDATION_PLAN.md` ;
- `docs/product/CAPITAL_EFFICIENCY_CORE.md` ;
- `docs/product/EDGE_SURVIVAL_ENVELOPE.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/EDGE_RANGE_CONTRACT.md` ;
- les validations du laboratoire et de la revue interne.

## Périmètre d'implémentation

Modifier uniquement les fichiers nécessaires sous `capital_efficiency_lab/`, les tests, le workflow et la documentation de validation.

Préserver fonctionnellement :

- `app/Breaktest_Studio.html` ;
- `validation_site/` ;
- le moteur historique ;
- `main`.

## Expérience attendue

### Mode 1 — Seuil seulement

Aucune valeur brute n'est requise. Le seuil et le plancher restent les sorties principales.

### Mode 2 — Valeur unique

Compatibilité complète avec le comportement Edge Survival actuel.

L'entrée historique `gross_edge_rate` reste la source canonique de ce mode.

### Mode 3 — Fourchette

L'utilisateur saisit :

- hypothèse basse ;
- hypothèse centrale ;
- hypothèse haute.

L'interface montre :

- les trois marges nettes ;
- une phrase descriptive selon `survives_full_range`, `crosses_break_even` ou `fails_full_range` ;
- la relation de la fourchette au plancher variable ;
- au maximum une frontière de taille à la fois ;
- la provenance et les limites.

Le vocabulaire « intervalle de confiance », « probabilité » et « prévision » est interdit.

## Moteur

Implémenter strictement `docs/standards/EDGE_RANGE_CONTRACT.md`.

Exigences :

- aucun arrondi interne ;
- aucune fourchette partielle acceptée ;
- aucune permutation silencieuse des bornes ;
- aucun mélange silencieux entre `gross_edge_rate` et la fourchette ;
- états indisponibles explicites ;
- compatibilité du mode point ;
- version moteur exacte `capital-efficiency-lab-3-edge-range` ;
- arbre numérique fini ;
- invariants exposés et testés ;
- tolérance numérique identique au moteur historique ;
- égalité au seuil ou au plancher non considérée comme marge strictement positive.

### Détection des modes

Les cas autorisés sont exactement :

- aucune valeur brute ;
- `gross_edge_rate` seule ;
- les trois bornes seules.

Tout autre mélange est invalide pour la couche Edge Range. Les coûts de base peuvent rester visibles, mais aucune sortie de fourchette ou de valeur ponctuelle ne doit être inventée.

### Rétrocompatibilité

Comparer par test profond les sorties historiques pertinentes avant et après extension :

- seuil sans avantage ;
- point positif ;
- point nul ;
- point négatif ;
- les six scénarios de `scenarios.json`.

## Tests Node

Ajouter des oracles indépendants couvrant tous les cas limites du contrat, notamment :

- trois modes ;
- point et fourchette simultanés ;
- bornes invalides et dégénérées ;
- égalité au seuil ;
- égalité au plancher variable ;
- tolérance autour du seuil et du plancher ;
- survie complète, traversée et échec complet ;
- plancher variable ;
- marges négatives ;
- coût fixe nul ;
- ordre monotone des marges ;
- ordre inverse des tailles minimales ;
- absence de non-finis ;
- rétrocompatibilité des cas de la matrice synthétique existante.

Les oracles ne doivent pas recopier les fonctions internes du moteur. Ils doivent partir des équations contractuelles et de valeurs attendues explicites.

## Tests navigateur

Chromium aux largeurs 390, 768, 1024 et 1440 px :

- sélection des trois modes ;
- affichage progressif ;
- erreurs de fourchette avec focus utile ;
- conflit point/fourchette avec message utile ;
- phrase descriptive correcte ;
- marges basse/centrale/haute visibles ;
- fourchette dégénérée explicitement identifiée ;
- aucune terminologie probabiliste ;
- navigation clavier ;
- annonce `aria-live` ;
- aucun débordement horizontal ;
- captures de revue interne pour chaque état principal.

La vue initiale ne doit pas exposer simultanément toutes les métriques avancées. Le résultat principal doit rester compréhensible en moins de 90 secondes : seuil, puis stabilité de la marge dans la fourchette.

## Non-régressions

Exécuter :

- H1–H2 ;
- C1–C4 ;
- calculateur Q0 ;
- moteur Capital Efficiency existant ;
- matrice de scénarios ;
- intégrité statique ;
- syntaxe JavaScript et Python.

## Interdictions

- aucune donnée réelle ;
- aucun import ;
- aucun courtier ou tarif réel ;
- aucun compte, stockage, réseau, analytics, email ou paiement ;
- aucune recommandation ;
- aucune statistique avancée ou estimation de probabilité ;
- aucune publication ;
- aucune reprise H3–H6.

## Livrables

- moteur et interface mis à jour ;
- tests Node et Chromium ;
- captures de revue ;
- `docs/validation/EDGE_SURVIVAL_ENVELOPE.md` ;
- mises à jour canoniques minimales fondées uniquement sur les résultats exécutés.

## Définition de terminé

La mission est terminée uniquement si :

- les trois modes fonctionnent ;
- les conflits et fourchettes partielles sont rejetés sans ambiguïté ;
- le contrat est démontré par oracles indépendants ;
- les captures ont été inspectées ;
- l'expérience reste compréhensible et progressive ;
- toutes les non-régressions réussissent sur le head exact ;
- aucune affirmation statistique, commerciale ou réglementaire n'est ajoutée ;
- aucune publication ou intégration externe n'est active.