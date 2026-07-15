# Breaktest Cost Gate — matrice de scénarios Gate 1 hors ligne

## 1. Statut

- Gate : **Gate 1 — valeur compréhensible sans donnée réelle**.
- Branche : `strategy/cost-gate-offline-critique`.
- Enregistrée avant code d'interface et avant toute observation utilisateur.
- Autorité financière : moteur fusionné `cost-gate-foundation-3-synthetic` et contrats Cost Gate.
- Nature : scénarios synthétiques et hypothèses manuelles uniquement.

Les identifiants `CGU-*` désignent des scénarios de compréhension et d'interface. Ils ne créent aucune numérotation de gate parallèle.

## 2. Oracles indépendants de référence

Pour un nominal `N`, `k` côtés, une commission par côté `C`, un taux de change par côté `F`, un spread total `S` et un slippage total `L` :

```text
coût_fixe = k × C
plancher_variable = k × F + S + L
friction_cycle = coût_fixe + N × plancher_variable
seuil_brut = friction_cycle / N
marge_nette = avantage_brut - seuil_brut
cash_entrée = nominal_entrée + commission_entrée + change_entrée
cash_faisable = min(cash_réglé_libre, allocation_stratégie_libre)
```

Le cash d'entrée n'inclut pas silencieusement le coût complet d'un futur aller-retour. Spread et slippage ne sont pas ajoutés au cash lorsqu'ils sont déclarés incorporés au prix d'entrée.

## 3. Matrice préenregistrée

| ID | Cas | Attendu falsifiable |
|---|---|---|
| CGU-01 | Ouverture neutre | Aucun nombre financier prérempli, aucun résultat visible, choix volontaire entre saisie vide et démonstration synthétique |
| CGU-02 | Démonstration synthétique favorable | Provenance `synthetic_demo` visible ; texte maximal « Aucune incompatibilité n'a été détectée dans les couches évaluées » ; avertissement immédiat que ce n'est ni une recommandation ni une autorisation |
| CGU-03 | Avantage exactement égal au seuil | Marge nette nulle ; phrase « Aucune marge positive ne subsiste après les frictions modélisées » ; aucune ancienne formulation prétendant que les frictions ne sont pas couvertes |
| CGU-04 | Avantage au niveau ou sous le plancher variable | Facteur structurel visible ; aucune taille pseudo-finie, aucun `Infinity`, `NaN` ou `-0` |
| CGU-05 | Cash ou allocation libre insuffisant | Facteur principal capital ; engagement d'entrée, cash réglé libre, allocation libre et plafond effectif visibles séparément |
| CGU-06 | Avantage brut absent | Seuil disponible ; Edge Survival explicitement non évalué ; aucune performance inventée ; résultat global non favorable |
| CGU-07 | Fourchette traversant le seuil | Marges basse, centrale et haute conservées ; état traversant ; aucune réduction de la fourchette au seul point central |
| CGU-08 | Entrée requise absente ou invalide | Résultat précédent masqué ; erreur liée au champ et synthèse d'erreurs accessible ; aucun fallback vers zéro |
| CGU-09 | Modification après calcul | Ancien résultat immédiatement caché ; message de recalcul ; nouveau snapshot seulement après action explicite |
| CGU-10 | Démonstration modifiée | Étiquette « démonstration synthétique modifiée » ; aucune requalification en donnée utilisateur ou réelle |
| CGU-11 | Constats multiples | Tous les `findings[]` et toutes les couches non évaluées restent accessibles ; le premier message ne supprime aucun constat matériel |
| CGU-12 | Qualité des données | Hypothèses manuelles/synthétiques distinguées des données de marché ; liquidité et exécution restent non évaluées |
| CGU-13 | Parité moteur | Sorties navigateur identiques aux sorties Node pour CGU-02 à CGU-07, y compris snapshot, codes, marges et cash |
| CGU-14 | Hors ligne | Ouverture fonctionnelle sous `file://` ; aucun CDN, requête, iframe, police ou script distant ; aucun stockage ou analytics |
| CGU-15 | Clavier et focus | Premier Tab sur le lien d'évitement ; ordre logique ; erreur et résultat annoncés ; aucun piège clavier ; focus visible |
| CGU-16 | Responsive | Aucun débordement horizontal à 390, 768, 1 024 et 1 440 px ; contenu, unités, footer et actions utilisables |
| CGU-17 | Package exact | Manifeste, commit source, versions, fichiers et SHA-256 réconciliés ; archive ouverte et point d'entrée testé |
| CGU-18 | Langage non prescriptif | Aucun feu vert, ordre, achat/vente, taille optimale ou probabilité ; limites proches du résultat, pas seulement dans une page secondaire |

## 4. Cas numérique de démonstration

Entrées synthétiques :

```text
N = 500 EUR
k = 2
C = 1 EUR
F = 0,25 % par côté
S = 0,10 % total
L = 0,10 % total
G = 2,00 %
cash réglé libre = 1 000 EUR
allocation stratégie libre = 1 000 EUR
```

Oracle :

```text
coût fixe = 2 EUR
plancher variable = 0,70 %
friction cycle = 5,50 EUR
seuil brut = 1,10 %
marge nette = 0,90 % = 4,50 EUR
cash d'entrée = 502,25 EUR
cash faisable = 1 000 EUR
```

La liquidité, la profondeur, la probabilité d'exécution, la donnée de marché actuelle, les taxes et frais non modélisés restent non évalués.

## 5. Condition de clôture technique

Chaque ligne doit posséder un test automatisé ou une inspection explicitement enregistrée. Une ligne non exécutée reste `not_run`. La réussite technique de cette matrice n'est pas la réussite utilisateur de Gate 1.
