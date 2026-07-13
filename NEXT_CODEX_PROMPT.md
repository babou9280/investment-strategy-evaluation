# Prochaine mission — H3 provenance de devise du prix d'entrée

Travaille uniquement sur une nouvelle branche créée depuis le dernier `breaktest-bootstrap` après fusion contrôlée de H2. Ne modifie et ne fusionne rien dans `main`.

Lis d'abord `AGENTS.md`, les six fichiers canoniques, `docs/TECHNICAL_AUDIT.md` et les validations H1, C2, C3, C1, C4 et H2.

## Objectif unique

Corriger H3 : un prix explicitement fourni en euros ne doit jamais être reconverti par `eurPerQuoteCurrency`, tandis qu'un prix fourni dans une devise de cotation doit être converti exactement une fois avec une provenance explicite.

## Défaut démontré

La normalisation actuelle choisit une valeur parmi `entry_price_eur`, `entry_price_usd` et `entry_price`, puis la stocke dans un champ commun. Le dimensionnement multiplie ensuite ce champ par `eurPerQuoteCurrency`. Ainsi, `entry_price_eur = 100` avec un taux de 0,92 peut produire un prix unitaire de 92 €, ce qui est faux.

## Politique retenue

1. Conserver séparément la valeur du prix, sa devise/provenance et la clé source utilisée.
2. `entry_price_eur` est déjà libellé en euros : facteur de conversion égal à 1.
3. `entry_price_usd` est libellé en dollars : convertir exactement une fois avec le taux USD/EUR configuré.
4. Le champ générique `entry_price` ne doit pas recevoir silencieusement une devise inventée :
   - utiliser un champ explicite de devise/quote currency lorsqu'il existe et qu'il est supporté ;
   - sinon conserver une provenance `unspecified` et ne pas prétendre à une conversion certaine ;
   - choisir une politique fail-safe explicite pour le dimensionnement des titres entiers, documentée et testée.
5. Une valeur explicitement invalide, négative ou infinie doit produire un diagnostic ou un refus conforme à H1 ; elle ne peut pas devenir zéro silencieusement.
6. Un prix absent reste distinct d'un prix nul ou invalide.
7. Pour les positions fractionnées, le nominal ne doit pas dépendre artificiellement du prix unitaire, mais le prix et sa provenance restent auditables.
8. Pour les titres entiers, le nombre d'unités doit utiliser le prix réellement converti en euros.
9. Modifier `eurPerQuoteCurrency` doit modifier uniquement les prix qui nécessitent réellement cette conversion.
10. L'interface, l'audit et l'export doivent pouvoir indiquer la valeur source, la devise, le facteur appliqué et le prix final en euros.
11. Ne pas modifier les règles H1, H2, C2, C3, C1 ou C4 sauf adaptation minimale du transport de provenance.

## Invariants obligatoires

- `entry_price_eur = 100`, taux 0,92 : prix final 100 € ;
- `entry_price_usd = 100`, taux 0,92 : prix final 92 € ;
- changer le taux ne modifie pas un prix EUR ;
- changer le taux modifie proportionnellement un prix USD une seule fois ;
- aucune double conversion ;
- la priorité des colonnes ne masque pas une valeur explicitement invalide dans une colonne fournie ;
- un prix générique sans devise ne peut pas être présenté comme USD ou EUR certain ;
- le nombre d'unités entières et le nominal résultant utilisent le prix EUR corrigé ;
- une position fractionnée conserve son nominal attendu ;
- prix absent, zéro, négatif, `NaN`, infini et texte invalide couverts ;
- import, ledger, audit et export conservent la provenance ;
- aucune régression H1, H2, C2, C3, C1 ou C4.

## Tests obligatoires

- prix EUR et USD de même valeur nominale avec taux différent de 1 ;
- changement de taux sur EUR puis USD ;
- présence simultanée de plusieurs colonnes avec règle de priorité documentée ;
- colonne prioritaire explicitement invalide ;
- prix générique avec devise explicite supportée ;
- prix générique sans devise ;
- position entière avec capital juste au-dessus ou en dessous d'une unité ;
- position fractionnée ;
- prix nul, négatif, absent, non numérique et infini ;
- contrôle du prix final, des unités, du nominal, des coûts dépendant du nominal et des champs exportés ;
- réexécution intégrale de H1, H2, C2, C3, C1 et C4 ;
- build déterministe, Chromium et `node --check`.

## Documentation et limites

- créer `docs/validation/H3_PRICE_CURRENCY_PROVENANCE.md` ;
- ajouter une règle permanente interdisant toute conversion sans provenance de devise ;
- documenter les devises explicitement supportées et le comportement fail-safe des devises inconnues ;
- mettre à jour les fichiers canoniques uniquement avec les résultats démontrés ;
- H4 à H6 restent ouverts ;
- ne pas ajouter un moteur FX multi-devises général hors du besoin H3 ;
- ne pas refondre l'application ;
- ne rien fusionner automatiquement.

## Résultat attendu

Un prix d'entrée normalisé avec valeur, devise, clé source et facteur de conversion auditables, aucune reconversion des prix EUR, une conversion unique des prix USD, un dimensionnement entier correct et une pull request isolée vers `breaktest-bootstrap`.
