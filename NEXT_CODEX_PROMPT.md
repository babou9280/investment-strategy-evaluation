# Prochaine mission — H2 bases nettes observées du journal

Travaille uniquement sur une nouvelle branche créée depuis le dernier `breaktest-bootstrap` après fusion contrôlée de C4. Ne modifie et ne fusionne rien dans `main`.

Lis d'abord `AGENTS.md`, les six fichiers canoniques, `docs/TECHNICAL_AUDIT.md` et les validations H1, C2, C3, C1 et C4.

## Objectif unique

Corriger H2 : lorsqu'un journal fournit explicitement des résultats nets de frais fixes ou full-cost, Breaktest doit les normaliser, les conserver et les distinguer des scénarios de coûts simulés au lieu de les ignorer et de recalculer silencieusement le net à partir du brut.

## Périmètre fonctionnel

Inspecter les données sources et le parseur existant pour confirmer et documenter les noms de colonnes et alias réellement supportés. Le noyau minimal attendu couvre :

- `fixed_net_pnl_eur` et son rendement associé ;
- `full_cost_net_pnl_eur` et son rendement associé ;
- les alias équivalents déjà présents dans les journaux ou la source ;
- la provenance de chaque valeur : observée, dérivée ou fallback explicite.

## Politique retenue

1. Distinguer au minimum trois bases par ligne : brut observé, net fixe observé et full-cost observé.
2. Une valeur explicitement fournie mais non numérique, `NaN` ou infinie doit faire échouer fermement le lot ; elle ne peut pas être remplacée par le brut ni par une simulation.
3. Un zéro numérique réel est une valeur observée valide.
4. Pour chaque base, si le PnL est présent mais le rendement manque, dériver le rendement par `PnL / nominal` uniquement avec un nominal valide.
5. Si le rendement est présent mais le PnL manque, dériver le PnL par `rendement × nominal` uniquement avec un nominal valide.
6. Si PnL et rendement manquent tous deux pour une base optionnelle, appliquer le fallback documenté vers la base précédente et marquer explicitement cette provenance.
7. Ne jamais écraser une base observée par le résultat d'un scénario de coûts simulés.
8. Conserver séparément :
   - résultats observés du journal ;
   - résultats recalculés par Breaktest sous les hypothèses de coûts choisies.
9. Les verdicts, tableaux et exports doivent indiquer sans ambiguïté quelle base est affichée.
10. Les fallbacks et dérivations doivent être auditables par ligne et agrégés dans l'audit des données.
11. Ne pas résoudre silencieusement une incohérence lorsque PnL et rendement sont tous deux fournis mais incompatibles : conserver l'anomalie pour H4 ou la signaler explicitement sans modifier les valeurs observées.
12. Ne pas modifier les règles H1, C2, C3, C1 ou C4, sauf adaptation minimale nécessaire pour transporter la base de PnL choisie avec une provenance explicite.

## Invariants obligatoires

- une valeur nette observée survit à l'import et n'est pas remplacée par le brut ;
- modifier les hypothèses de coûts simulés ne modifie jamais la valeur nette observée du journal ;
- le zéro observé reste zéro ;
- une valeur nette explicitement invalide refuse le lot ;
- une dérivation ne se produit que lorsque l'autre membre de la paire et le nominal sont valides ;
- un fallback n'est utilisé que lorsque la base optionnelle est entièrement absente et reste visible ;
- le PnL appliqué par C4 provient de la base explicitement sélectionnée et documentée, sans double comptage des coûts ;
- l'ajout de colonnes nettes à une ligne ne modifie pas les décisions historiques utilisant une autre base tant que l'utilisateur ne sélectionne pas cette base ;
- les agrégats d'une base égalent la somme des valeurs ligne par ligne de cette même base ;
- aucune régression H1, C2, C3, C1 ou C4.

## Tests obligatoires

- brut, net fixe et full-cost tous fournis et distincts : conservation exacte des trois bases ;
- PnL net fourni, rendement manquant : dérivation correcte ;
- rendement net fourni, PnL manquant : dérivation correcte ;
- zéro net observé ;
- base optionnelle entièrement absente : fallback explicite et provenance visible ;
- valeur `abc`, `NaN`, infinie ou vide explicitement ambiguë dans une colonne fournie ;
- coûts simulés modifiés sans changement des bases observées ;
- sélection brut/net fixe/full-cost produisant les agrégats attendus ;
- absence de double soustraction des coûts ;
- import, ledger et export conservant la base et la provenance ;
- réexécution intégrale des suites H1, C2, C3, C1 et C4 ;
- build déterministe, lancement Chromium et `node --check`.

## Documentation et limites

- créer `docs/validation/H2_JOURNAL_NET_BASES.md` avec commandes, empreintes et résultats exacts ;
- ajouter une règle permanente sur la séparation entre résultat observé et scénario simulé ;
- mettre à jour les fichiers canoniques uniquement avec les résultats démontrés ;
- H3 à H6 restent ouverts ;
- H4 reste responsable de la politique complète de réconciliation entre PnL, rendement et nominal lorsqu'ils sont tous fournis ;
- ne pas refondre l'application ;
- ne rien fusionner automatiquement.

## Résultat attendu

Des bases brut, net fixe et full-cost réellement importées et auditables, des fallbacks et dérivations explicites, une séparation stricte entre observation et simulation, des invariants reproductibles et une pull request isolée vers `breaktest-bootstrap`.
