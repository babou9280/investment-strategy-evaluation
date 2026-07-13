# Breaktest — revue visuelle de l’expérience progressive

## Statut

- Revue fondée sur les captures Chromium produites par GitHub Actions.
- Largeurs inspectées : 390, 768 et 1 440 pixels.
- Aucun utilisateur réel n’a encore exécuté le parcours.
- Safari et iPad natif restent non vérifiés.

## 1. Problème observé dans la première version

La première version techniquement validée présentait simultanément :

- capital ;
- fréquence ;
- six paramètres de coûts et d’activité ;
- avantage brut ;
- rétention cible ;
- budget annuel ;
- marge nette cible ;
- quatre contraintes, y compris celles non demandées ;
- structure, sensibilité, preuve et limites.

Sur mobile, la page était exacte mais excessivement longue. Le produit demandait à l’utilisateur de comprendre l’architecture complète avant d’obtenir la valeur principale.

Cette densité risquait de masquer la différenciation réelle : le seuil brut, le plancher variable, la part conservée et l’impossibilité structurelle.

## 2. Correction implémentée

Le parcours est maintenant progressif.

### Étape 1 — seuil

Visible immédiatement :

- montant de l’ordre ;
- achat simple ou aller-retour ;
- commission ;
- change ;
- spread ;
- slippage.

Le bouton principal indique « Calculer le seuil brut ».

Capital et fréquence sont placés dans une section facultative distincte.

### Étape 2 — rendement brut

Le champ de rendement brut est placé dans une section facultative :

- Breaktest précise qu’il ne prédit pas cette valeur ;
- la valeur doit provenir de la méthode, d’un test ou d’une mesure externe ;
- le bouton devient « Mesurer ce qui reste du rendement brut ».

### Étape 3 — contrainte

L’utilisateur choisit une seule question avancée :

- marge positive ;
- part du brut conservée ;
- budget annuel ;
- marge nette cible.

Seul le champ nécessaire à cette question est affiché. Le résultat ne contient qu’une seule contrainte sélectionnée.

## 3. Résultats de l’inspection visuelle

### Mobile 390 px — mode seuil

Points positifs :

- la hiérarchie en trois étapes est immédiatement visible ;
- aucun rendement ou capital n’est exigé avant le calcul du seuil ;
- les sections avancées sont repliées ;
- le bouton principal décrit le résultat obtenu ;
- le résultat principal est lisible avant les détails ;
- les détails méthodologiques sont repliables ;
- aucun débordement horizontal n’a été détecté.

Limites :

- six paramètres restent nécessaires pour un calcul complet ;
- le parcours demeure plus long qu’un calculateur grand public minimal ;
- le vocabulaire spread et slippage nécessite probablement une aide contextuelle lors d’un test réel.

### Mobile 390 px — exemple Edge Survival

Points positifs :

- le résultat `45 %` conservé domine clairement ;
- la marge nette, la part absorbée et le brut saisi sont réconciliés ;
- une seule contrainte est affichée ;
- le coût total est visuellement secondaire ;
- méthode et limites restent disponibles sans occuper l’écran initial.

Limites :

- l’exemple complet ouvre volontairement toutes les sections et reste long ;
- la répétition entre le résultat principal et la carte « part conservée » devra être testée auprès d’utilisateurs ;
- le rendement brut moyen reste le concept le plus exigeant.

### Desktop 1 440 px

Points positifs :

- la structure entrée/résultat reste efficace ;
- le seuil, le plancher et la part conservée ont une hiérarchie financière claire ;
- la contrainte choisie est isolée ;
- la preuve et les limites ne concurrencent plus le diagnostic principal ;
- l’interface demeure sobre et compatible avec une présentation professionnelle.

Limites :

- l’exemple complet utilise encore une densité élevée dans la colonne de saisie ;
- la qualité perçue devra être jugée avec du contenu réel et non uniquement synthétique ;
- aucune observation ne confirme encore la compréhension en 90 secondes.

## 4. Éléments volontairement non ajoutés

La correction n’a ajouté :

- aucune nouvelle métrique financière ;
- aucun score ;
- aucune recommandation ;
- aucun tarif de courtier ;
- aucune donnée réelle ;
- aucun service externe ;
- aucune animation décorative.

L’amélioration provient de la hiérarchie et de la réduction de la charge cognitive.

## 5. Validation technique

Le head correspondant a réussi dans GitHub Actions :

- oracles Edge Survival ;
- cas limites ;
- non-régressions historiques et Q0 ;
- Chromium à 390, 768, 1 024 et 1 440 pixels ;
- parcours progressif ;
- mode seuil ;
- exemple complet ;
- contrainte structurellement impossible ;
- frontière à coût fixe nul ;
- intégrité locale ;
- syntaxe ;
- capture des écrans de revue.

## 6. Conclusion

L’expérience progressive corrige le principal défaut visible de la première version : elle ne demande plus de comprendre tout le produit avant d’obtenir le seuil.

La prochaine incertitude n’est plus principalement technique. Elle est humaine :

> une personne qualifiée comprend-elle spontanément le seuil, le plancher et la part conservée, et relie-t-elle au moins une contrainte à une décision réelle ?
