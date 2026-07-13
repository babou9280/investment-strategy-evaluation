# Mission — Capital Efficiency Lab

## Statut

- Branche : `strategy/capital-efficiency-core`
- Base : `breaktest-bootstrap`
- Phase : prototype interne de valeur produit
- Publication externe : interdite
- `main` : strictement hors périmètre

## Objectif unique

Construire un laboratoire interne isolé qui démontre la valeur du noyau Capital Efficiency défini dans :

- `docs/product/CAPITAL_EFFICIENCY_CORE.md` ;
- `docs/standards/EDGE_SURVIVAL_CONTRACT.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md`.

Le laboratoire doit répondre à la question :

> Quelle part d'un avantage brut survit aux frictions, et quelles contraintes économiques doivent être satisfaites pour qu'il subsiste ?

## Périmètre autorisé

Créer un dossier isolé `capital_efficiency_lab/` contenant :

- moteur JavaScript déterministe sans dépendance externe ;
- interface web locale responsive ;
- scénario synthétique principal ;
- tests Node ;
- tests Chromium ;
- documentation de validation.

Ne pas modifier :

- `app/Breaktest_Studio.html` ;
- `validation_site/` sauf correction indispensable de documentation, sans changement fonctionnel ;
- H3 à H6 ;
- `main`.

## Entrées minimales

- capital facultatif ;
- montant d'ordre ;
- achat simple ou aller-retour ;
- fréquence mensuelle ;
- commission par côté ;
- change par côté ;
- spread total ;
- slippage total ;
- avantage brut moyen facultatif ;
- part cible d'avantage conservé facultative ;
- budget annuel de friction facultatif ;
- cible nette facultative.

Aucune valeur d'avantage brut ne doit être inventée dans le formulaire vide. Le scénario de démonstration doit être explicitement marqué `synthetic_demo`.

## Sorties minimales

### Toujours calculables lorsque les coûts sont valides

- coût fixe ;
- coût variable ;
- coût total ;
- seuil brut de couverture ;
- plancher variable ;
- part fixe et variable ;
- courbe de seuil selon la taille d'ordre ;
- coût annuel et ratio au capital lorsque disponible.

### Lorsque l'avantage brut est fourni

- marge nette en taux, points de base et euros ;
- part absorbée ;
- part conservée ;
- taille minimale de couverture ou impossibilité structurelle ;
- taille minimale pour la rétention cible ou impossibilité structurelle ;
- projection annuelle arithmétique clairement qualifiée.

### Lorsque le budget annuel est fourni

- fréquence frontière sous budget, présentée comme contrainte mathématique et non comme recommandation.

### Lorsque la cible nette est fournie

- rendement brut nécessaire pour cette cible nette.

## Expérience produit

Le premier chiffre mis en avant doit être :

- le seuil brut nécessaire si aucun avantage brut n'est fourni ;
- la part d'avantage conservée et la marge nette si l'avantage brut est fourni.

Le coût en euros reste une explication, pas le résultat principal.

L'interface doit montrer explicitement :

- ce qui est diluable avec la taille ;
- ce qui constitue un plancher variable ;
- si une contrainte est mathématiquement impossible avec les hypothèses saisies ;
- les hypothèses et dénominateurs ;
- la provenance `user_assumption` ou `synthetic_demo`.

Les états descriptifs autorisés sont ceux du contrat. Aucun score opaque, feu tricolore arbitraire ou recommandation.

## Design

- conserver la direction financière épurée déjà validée ;
- priorité à la hiérarchie de décision et à la lisibilité ;
- pas de nouveau prototype visuel décoratif ;
- aucun look crypto, casino, signal ou terminal institutionnel fictif ;
- aucun texte ou graphique sans utilité décisionnelle ;
- responsive 390, 768, 1024 et 1440 px ;
- navigation clavier et annonces accessibles.

## Tests obligatoires

Tous les tests de `docs/standards/EDGE_SURVIVAL_CONTRACT.md`, notamment :

- cas principal exact ;
- réconciliations ;
- cas structurellement impossible ;
- seuil de rétention ;
- budget annuel ;
- coût nul ;
- capital absent ;
- avantage absent, nul, négatif et positif ;
- monotonicité du seuil selon la taille ;
- convergence vers le plancher variable ;
- fréquence sans effet sur le seuil par opération ;
- coût annuel proportionnel à la fréquence ;
- absence de `NaN`, `Infinity` et `-0` visible ;
- erreurs avec focus utile ;
- Chromium aux quatre largeurs ;
- absence de débordement horizontal ;
- syntaxe JavaScript ;
- non-régression du moteur historique et du site de validation existant.

## Interdictions

- aucune publication ;
- aucun analytics, réseau, stockage persistant, email ou paiement ;
- aucun tarif réel de courtier ;
- aucun import ;
- aucun calcul statistique avancé ;
- aucune recommandation de fréquence, taille, courtier, actif ou transaction ;
- aucun changement de la stratégie canonique présenté comme commercialement validé.

## Livrables de branche

- `capital_efficiency_lab/index.html` ;
- `capital_efficiency_lab/engine.js` ;
- `capital_efficiency_lab/app.js` ;
- `capital_efficiency_lab/styles.css` ;
- tests Node et Chromium ;
- `docs/validation/CAPITAL_EFFICIENCY_LAB.md` ;
- mises à jour minimales des fichiers canoniques avec ce qui a réellement été exécuté.

## Définition de terminé

La mission est techniquement terminée uniquement si :

- les formules sont conformes au contrat ;
- les oracles indépendants passent ;
- les tests historiques restent verts ;
- l'interface fonctionne réellement dans Chromium ;
- les limitations sont visibles ;
- la branche n'a activé aucun service externe ;
- aucune affirmation commerciale n'est ajoutée sans preuve utilisateur.
