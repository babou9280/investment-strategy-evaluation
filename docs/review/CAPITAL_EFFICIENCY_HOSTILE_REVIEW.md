# Breaktest — revue hostile du Capital Efficiency Lab

## Statut

- Revue interne fondée sur le code, les contrats, les tests et l'expérience simulée.
- Aucun participant réel n'a encore été observé.
- Les jugements d'utilité et de compréhension restent des hypothèses jusqu'au protocole utilisateur.

## 1. Verdict actuel

Le laboratoire dépasse effectivement le calculateur Q0 sur le fond :

- il sépare le coût fixe du plancher variable ;
- il met en avant le seuil brut lorsque l'avantage est absent ;
- il mesure la marge nette et la part conservée lorsque le brut est fourni ;
- il résout des contraintes inverses ;
- il explique qu'une taille supérieure ne résout pas toujours le problème ;
- il conserve la provenance, les limites et les états indisponibles.

Il ne constitue toutefois pas encore une expérience grand public évidente. Sa valeur dépend d'un concept difficile : **l'avantage brut moyen par opération**. Beaucoup d'investisseurs particuliers ne disposent pas d'une estimation défendable de cette valeur.

La thèse la plus forte n'est donc pas « chacun connaît son edge ». Elle est :

> Breaktest commence par le seuil que les coûts imposent, puis permet à ceux qui disposent d'une hypothèse ou d'un historique de mesurer ce qui subsiste réellement.

## 2. Ce qui différencie réellement le produit

### Fort

1. **Plancher variable** — montre la limite qu'une taille supérieure ne dilue pas.
2. **Part d'avantage conservée** — relie directement la friction à la valeur économique supposée.
3. **Impossibilité structurelle** — refuse une pseudo-solution numérique.
4. **Calcul inverse** — transforme une description en contrainte.
5. **Preuve auditable** — formule, provenance, version et limites restent visibles.

### Faible ou copiable

- total des frais ;
- cartes de KPI ;
- courbe de sensibilité simple ;
- interface élégante ;
- explication générée en langage naturel ;
- scénario « montant ×2 » ou « fréquence ÷2 » pris isolément.

## 3. Objections par discipline

### 3.1 Utilisateur particulier

**Objection :** « Je ne connais pas mon avantage brut. »

Réponse produit honnête : ne rien inventer. Le mode seuil doit être autonome et utile sans `G`. Le mode Edge Survival doit être présenté comme une couche avancée.

**Objection :** « Les mots edge, rétention et plancher variable sont abstraits. »

Risque : compréhension insuffisante malgré l'exactitude.

Correction probable : privilégier une phrase concrète avant le terme technique :

- « rendement brut nécessaire pour couvrir les frictions » ;
- « part de ton rendement brut qui reste » ;
- « part des coûts qui ne diminue pas quand l'ordre grossit ».

**Objection :** « La taille frontière ressemble à un conseil. »

Réponse : rattacher chaque frontière à une condition saisie et afficher simultanément la formule et la limite. Ne jamais utiliser « tu devrais ».

### 3.2 Professionnel de marché

**Objection :** le spread et le slippage ne sont pas définis par benchmark ou horodatage.

Réponse : dans le laboratoire, ce sont des hypothèses globales. Toute future TCA réelle exigera benchmark, sens, prix et timestamp conformément aux standards quantitatifs.

**Objection :** un avantage brut moyen peut être instable, dépendant du régime et surajusté.

Réponse : Breaktest ne l'estime pas et ne l'endosse pas. Une future importation devra séparer in-sample, out-of-sample et live, montrer la taille d'échantillon et traiter l'incertitude.

**Objection :** la projection annuelle arithmétique peut être trompeuse.

Réponse : ne pas la mettre en avant dans le parcours principal. La conserver uniquement comme diagnostic qualifié.

### 3.3 Produit fintech

**Objection :** la fréquence d'usage pré-transaction peut être faible.

Conséquence : la rétention dépend probablement du suivi ex post, des imports et des budgets de friction, pas seulement du calculateur.

**Objection :** trop de champs facultatifs augmentent l'abandon.

Conséquence : le parcours final devra être progressif :

1. seuil seul ;
2. révélation optionnelle d'Edge Survival ;
3. contraintes avancées à la demande.

**Objection :** aucune distribution n'est prouvée.

Réponse : ne pas élargir le produit avant les tests d'usage et de partage.

### 3.4 Ingénierie

**Forces :**

- moteur pur et déterministe ;
- validation stricte ;
- états indisponibles explicites ;
- tests d'invariants et cas limites ;
- intégrité locale ;
- non-régressions cumulatives.

**Faiblesses :**

- JavaScript sans types statiques ;
- domaine et présentation encore proches ;
- pas de schéma versionné des entrées/sorties ;
- pas de tests de propriété génératifs ;
- pas de benchmark de performance nécessaire à ce stade ;
- aucune compatibilité Safari/iPad exécutée.

Aucune de ces faiblesses ne justifie une refonte avant la revue utilisateur, sauf défaut réel.

### 3.5 Évaluateur d'école prestigieuse

Le projet est crédible s'il est présenté comme :

- un problème économique issu d'un travail empirique ;
- un pivot fondé sur critique ;
- un contrat quantitatif ;
- une construction testée ;
- une stratégie de validation ;
- une démonstration d'arbitrages et de limites.

Il perdrait sa crédibilité s'il était présenté comme :

- une plateforme mondiale déjà prouvée ;
- une IA capable de trouver des stratégies rentables ;
- une solution conforme à des standards sans audit ;
- une entreprise avec traction inexistante ;
- une architecture complexe construite avant le besoin.

## 4. Revue de la hiérarchie de l'interface

### Ce qui doit rester principal

Sans avantage brut :

1. seuil brut ;
2. plancher variable ;
3. explication fixe/variable ;
4. sensibilité à la taille.

Avec avantage brut :

1. part conservée ;
2. marge nette ;
3. seuil brut ;
4. contrainte inverse demandée ;
5. preuve et limites.

### Ce qui doit rester secondaire

- coût total en euros ;
- part fixe et variable détaillée ;
- projection annuelle ;
- égalité fixe-variable ;
- toutes les contraintes non demandées.

### Ce qui pourrait être supprimé du parcours initial

- quatre contraintes affichées simultanément lorsque leurs entrées sont absentes ;
- vocabulaire technique avant explication simple ;
- diagnostics annuels qui ne répondent pas à la décision active ;
- répétition des avertissements.

## 5. Défauts et risques classés

### Blocants avant test externe

1. Compatibilité Safari/iPad non exécutée.
2. Compréhension du champ avantage brut non observée.
3. Risque de surcharge dû aux champs avancés visibles immédiatement.
4. Risque de confusion entre frontière mathématique et recommandation.

### Importants

1. Absence de plage d'incertitude pour les coûts implicites.
2. Absence de scénario guidé selon le niveau utilisateur.
3. Aucune preuve de récurrence.
4. Aucune preuve que les contraintes inverses changent une décision.
5. Terminologie partiellement anglicisée.

### Différables

1. TypeScript ou schéma formel machine-readable.
2. Tests de propriété génératifs.
3. Historique et import.
4. Benchmarks anonymisés.
5. API et intégrations.

## 6. Décision produit issue de la revue

Ne pas ajouter de nouvelle métrique.

La priorité de la prochaine itération est de **réduire la charge cognitive sans réduire le fond** :

- seuil seul d'abord ;
- avantage brut comme étape optionnelle ;
- une seule contrainte avancée affichée selon la question choisie ;
- preuves et limites accessibles mais non envahissantes ;
- langage français concret avant les termes techniques.

## 7. Critères de réussite de la revue utilisateur interne

Sur cinq personnes qualifiées :

- quatre reformulent correctement le seuil ;
- quatre comprennent la marge nette ;
- trois trouvent une contrainte inverse pertinente ;
- aucune ne croit recevoir une prédiction ou une recommandation ;
- le mode seuil est terminé en moins de 90 secondes ;
- le mode complet est terminé en moins de cinq minutes ;
- au moins trois indiquent une décision réelle où l'outil aurait été utile.

## 8. Conclusion

Le noyau quantitatif est différenciant par sa structure, pas encore par sa distribution ou ses données.

La prochaine amélioration de valeur ne vient pas d'une formule supplémentaire. Elle vient d'une expérience progressive qui rend les formules déjà validées immédiatement compréhensibles et testables.