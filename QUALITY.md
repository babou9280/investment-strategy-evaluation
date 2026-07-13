# Breaktest — standard de qualité

## 1. Ordre de priorité

1. Exactitude financière et quantitative.
2. Fonctionnement réel.
3. Utilité décisionnelle.
4. Auditabilité et provenance.
5. Cohérence entre code, interface et discours.
6. Simplicité cognitive.
7. Sécurité, confidentialité et accessibilité.
8. Crédibilité commerciale et académique.
9. Qualité visuelle.
10. Richesse fonctionnelle.

Une amélioration située plus bas dans cette liste ne peut jamais dégrader une exigence supérieure.

## 2. Définition d'une fonctionnalité terminée

Une fonction n'est pas terminée parce qu'elle est visible ou parce que sa CI est verte.

Elle doit :

- répondre à un problème utilisateur explicite ;
- posséder une définition financière sans ambiguïté ;
- produire un résultat déterministe et reproductible ;
- gérer absence, invalidité, zéro, valeur négative et frontières pertinentes ;
- afficher unité, dénominateur, provenance et domaine de validité ;
- être couverte par des oracles, invariants ou tests adaptés ;
- fonctionner dans le navigateur et aux largeurs prévues ;
- ne pas dégrader les fonctions déjà validées ;
- être cohérente avec les contrats et fichiers canoniques ;
- déclarer les limites non vérifiées ;
- avoir fait l'objet d'une recherche d'angles morts adjacents et rétrospectifs.

## 3. Niveaux de validation

Toujours distinguer :

- **spécifié** : contrat écrit, non exécuté ;
- **implémenté** : code présent ;
- **testé localement** : commandes exécutées dans un environnement identifié ;
- **validé techniquement** : suites pertinentes vertes sur le head exact ;
- **inspecté visuellement** : captures ou appareil réel examinés ;
- **compris par utilisateur** : observation réelle sans coaching excessif ;
- **commercialement validé** : comportement répété et paiement réel ;
- **juridiquement revu** : analyse professionnelle ou procédure adaptée ;
- **prêt à publier** : gates techniques, produit, juridique et opérationnel satisfaits.

Aucun niveau ne doit être déduit d'un niveau inférieur.

## 4. Données et provenance

Toute valeur doit être qualifiée comme :

- `observed` : présente dans une source identifiée ;
- `contractual` : issue d'un barème daté et sourcé ;
- `estimated` : calculée par une méthode documentée ;
- `derived` : reconstruite depuis d'autres valeurs valides ;
- `user_assumption` : saisie sans preuve externe ;
- `synthetic_demo` : exemple construit et explicitement non observé.

Règles :

- ne jamais présenter une estimation comme un montant payé ;
- conserver source, date, devise, unité et transformation ;
- distinguer `missing`, `invalid` et zéro réel ;
- ne jamais remplacer silencieusement une valeur invalide ;
- conserver tout fallback et sa provenance ;
- pouvoir réconcilier un agrégat avec ses lignes sources ;
- ne jamais préremplir une hypothèse synthétique en la qualifiant de saisie utilisateur.

## 5. Validation numérique stricte

- Toute entrée numérique est classée avant calcul.
- Une donnée obligatoire absente ou invalide bloque le calcul concerné.
- Une donnée facultative absente rend uniquement les sorties dépendantes indisponibles.
- Les nombres non finis sont refusés.
- `-0` est normalisé.
- L'arrondi est réservé à l'affichage.
- Les calculs internes conservent la précision disponible.
- Aucun `NaN`, `Infinity` ou `-0` ne doit être visible ou présent dans l'arbre validé.
- Toute version modifiant un contrat numérique reçoit un identifiant distinct.

## 6. Contrat de friction

Pour un nominal `N`, `k` côtés, commission par côté `C`, change par côté `F`, spread total `S` et slippage total `L` :

```text
fixed_cost_eur = k * C
variable_floor_rate = k * F + S + L
variable_cost_eur = N * variable_floor_rate
total_cost_eur = fixed_cost_eur + variable_cost_eur
break_even_gross_rate = total_cost_eur / N
```

Exigences :

- commission et change sont par côté ;
- spread et slippage couvrent le scénario complet ;
- aucune friction n'est comptée deux fois ;
- le seuil reste supérieur ou égal au plancher variable ;
- la fréquence ne modifie pas le seuil par opération ;
- la sensibilité à la taille converge vers le plancher variable lorsque le coût fixe existe ;
- toute friction non modélisée reste déclarée.

## 7. Contrat Edge Survival ponctuel

Lorsque le brut `G` est fourni :

```text
net_edge_rate = G - break_even_gross_rate
gross_edge_eur = N * G
net_edge_eur = gross_edge_eur - total_cost_eur
```

Si `G > 0` :

```text
edge_absorption_rate = break_even_gross_rate / G
edge_retained_rate = net_edge_rate / G
```

Règles :

- `G` est une moyenne brute par opération complète, gains et pertes inclus, avant coûts ;
- taux de réussite, gain moyen des gagnants, CAGR, Sharpe et performance nette ne sont pas des substituts ;
- une marge ou rétention négative n'est jamais tronquée ;
- les ratios sont indisponibles si `G <= 0` ;
- l'égalité au seuil selon la tolérance n'est pas une marge positive ;
- un point positif sans cible de rétention reçoit un état explicite ;
- le mode point et une fourchette dégénérée doivent rester cohérents aux frontières.

Le contrat sémantique complet est `docs/standards/GROSS_EDGE_INPUT_CONTRACT.md`.

## 8. Contrat Edge Range

Trois modes seulement sont autorisés :

- `threshold_only` : aucune valeur brute ;
- `point_estimate` : une valeur ponctuelle seule ;
- `range_estimate` : basse, centrale et haute seules.

Interdictions :

- point et fourchette simultanés ;
- fourchette partielle ;
- réordonnancement ou complétion silencieuse ;
- conversion silencieuse d'une fourchette dégénérée ;
- langage de probabilité, confiance ou prévision sans méthode statistique validée.

États :

```text
survives_full_range
crosses_break_even
fails_full_range
above_variable_floor_full_range
variable_floor_crossing
structurally_unreachable_full_range
```

Les mêmes helpers de tolérance gouvernent point, fourchette, seuil et plancher.

## 9. Entrées annuelles facultatives

Capital et fréquence sont facultatifs pour le seuil par opération et Edge Survival.

- fréquence absente : opérations annuelles, coût annuel et projections annuelles indisponibles avec `frequency_missing` ;
- capital absent : ratios au capital indisponibles avec `capital_missing` ;
- fréquence égale à zéro : valeur explicite et valide ;
- aucune valeur cachée ou défaut silencieux ;
- une frontière de fréquence sous budget peut être calculée depuis capital et budget sans fréquence actuelle ;
- toute projection annuelle reste arithmétique, sans capitalisation, chevauchement ou variation de nominal.

## 10. Contraintes inverses

Une frontière ne peut être affichée que si :

- sa condition utilisateur est visible ;
- sa formule et son dénominateur sont définis ;
- les cas indisponibles sont explicites ;
- l'égalité est traitée selon le contrat ;
- un coût fixe nul ne produit pas un faux ordre recommandé à zéro ;
- une contrainte impossible produit `structurally_unreachable`, jamais `Infinity` ;
- la formulation reste descriptive et non prescriptive.

Une frontière mathématique n'établit pas encore sa faisabilité avec le capital disponible. Cette couche future suit `docs/product/CAPITAL_FEASIBILITY_CONTRACT.md`.

## 11. Résultats et fraîcheur

- Toute modification d'une entrée masque immédiatement le résultat précédent.
- Une erreur de validation masque les anciens résultats.
- Un changement de mode ne conserve aucune sortie incompatible.
- Le résultat annonce sa mise à jour par `aria-live`.
- Le focus rejoint le premier champ invalide ou le nouveau résultat selon le cas.
- Aucun résultat ne doit sembler correspondre à des hypothèses qui ont déjà changé.

## 12. UX et accessibilité

- Français concret avant jargon.
- Résultat principal avant détails.
- Une contrainte avancée à la fois.
- Aucune hypothèse financière préremplie comme valeur utilisateur.
- Démonstration synthétique activée explicitement.
- Labels persistants et unités visibles.
- Navigation clavier complète.
- Focus visible.
- `aria-live` utile, non bavard.
- Contraste suffisant.
- `prefers-reduced-motion` respecté.
- Aucun débordement horizontal à 390, 768, 1024 et 1440 px.
- La barre fixe ne doit pas masquer le résultat après défilement.
- Safari/iPad doit être vérifié avant livraison à Ayman.
- La compréhension en moins de 90 secondes reste une hypothèse tant qu'elle n'est pas observée.

## 13. Design

Chaque composant doit servir à :

- comprendre ;
- diagnostiquer ;
- comparer ;
- paramétrer ;
- prouver ;
- exporter.

Éviter :

- cartes décoratives ;
- scores opaques ;
- chiffres sans origine ;
- animations gratuites ;
- interactions factices ;
- apparence de casino, crypto ou signaux ;
- terminal institutionnel factice ;
- dashboard générique reconnaissable comme produit par IA ;
- densité qui masque la valeur ;
- apparence promettant plus que le moteur réel.

## 14. Règles historiques H1–H2/C1–C4

Le moteur historique conserve :

- validation ferme des données ;
- séparation des bases observées et simulées ;
- dérivation avec provenance ;
- isolation temporelle stricte ;
- turnover consommé chronologiquement ;
- réservation du nominal complet ;
- sorties avant entrées le même jour selon la convention validée ;
- PnL appliqué une seule fois à la sortie ;
- réconciliation du capital réalisé, réservé et libre ;
- expression « trésorerie réalisée aux sorties », jamais mark-to-market sans implémentation.

Toute évolution du nouveau produit doit préserver ces non-régressions lorsque les composants sont partagés.

## 15. Sécurité et confidentialité

Le prototype interne reste local-only :

- aucune requête réseau ;
- aucun compte ;
- aucun cookie ;
- aucun stockage persistant ;
- aucun analytics ;
- aucun email ;
- aucun paiement ;
- aucun secret ;
- aucune dépendance distante.

Avant tout import réel : modèle de menace, XSS, fichiers hostiles, CSV injection, limites de taille et confidentialité doivent être traités.

## 16. Livraison hors ligne

Le futur livrable de critique doit respecter `docs/delivery/OFFLINE_HTML_DELIVERABLE_STANDARD.md` :

- HTML autonome ou bundle ZIP avec `index.html` ;
- ressources relatives locales ;
- interaction réelle ;
- même moteur que celui validé ;
- méthode, preuve et limites ;
- manifeste et SHA-256 ;
- test du package exact ;
- aucun besoin de serveur lourd lorsque techniquement évitable.

Les captures sont des preuves de revue, pas le livrable principal.

## 17. Recherche d'angles morts

Toute tâche matérielle applique `docs/governance/BLIND_SPOT_REGISTER.md`.

Chercher au minimum :

- défaut visible ;
- défaut adjacent ;
- défaut rétrospectif ;
- hypothèse utilisateur irréaliste ;
- incohérence de dénominateur ou horizon ;
- risque de conseil implicite ;
- limitation de données ;
- erreur de provenance ;
- échec de marché ;
- dette opérationnelle ;
- faiblesse de preuve académique.

Une CI verte est une preuve technique partielle, jamais une preuve d'exhaustivité, d'utilité, de conformité ou de demande.

## 18. Validation commerciale

- Un compliment n'est pas une activation.
- Une activation n'est pas une seconde utilisation.
- Une intention n'est pas un paiement.
- Une réservation n'est pas un abonnement actif.
- Une économie simulée n'est pas une économie observée.
- Conserver objections, abandons et trafic non qualifié.
- Ne jamais fabriquer avis, compteurs, partenaires ou rareté.
- Le protocole doit pouvoir conclure à l'abandon.

## 19. Gate de fusion

Avant fusion d'une évolution :

- head exact identifié ;
- build réussi ;
- oracles et invariants verts ;
- tests navigateur verts ;
- captures générées et inspectées ;
- syntaxe et intégrité locales vertes ;
- non-régressions historiques et Q0 vertes ;
- fichiers canoniques et registre synchronisés ;
- limites restantes déclarées ;
- aucun hors-périmètre ajouté.

Ne jamais déclarer un contrôle réussi sans preuve exécutée.