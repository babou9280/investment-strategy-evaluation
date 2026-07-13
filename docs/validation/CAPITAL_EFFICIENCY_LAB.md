# Validation — Capital Efficiency Lab

## Statut

- Branche : `strategy/capital-efficiency-core`
- Pull request : `#20`
- Version moteur : `capital-efficiency-lab-2`
- Head code et contrat validé : `9ac41ecedb2e6e7937859f3963ae9cd940a08b9f`
- GitHub Actions run : `29278627744`
- Conclusion du job `validate` : **success**
- Publication externe : aucune
- `main` : inchangé

Une exécution antérieure avait déjà validé le noyau initial. La version 2 ajoute et teste explicitement les cas limites où les coûts fixes sont nuls, afin d'éviter de présenter un ordre nul comme recommandation ou de classer à tort une cible exactement satisfaite comme impossible.

## Périmètre exécuté

Le laboratoire isolé `capital_efficiency_lab/` contient :

- `engine.js` : moteur déterministe Edge Survival ;
- `index.html`, `styles.css`, `app.js` : interface locale responsive ;
- `tests/engine.test.js` : oracles et invariants Node ;
- `tests/browser.py` : contrôles Chromium ;
- `tests/static_integrity.py` : interdiction de réseau, persistance et intégrations actives.

Le moteur historique `app/Breaktest_Studio.html` et `validation_site/` n'ont pas été modifiés fonctionnellement.

## Résultats de référence vérifiés

Scénario synthétique principal :

- capital : `5 000 EUR` ;
- nominal : `500 EUR` ;
- aller-retour ;
- quatre opérations mensuelles ;
- commission : `1 EUR` par côté ;
- change : `0,25 %` par côté ;
- spread total : `0,10 %` ;
- slippage total : `0,10 %` ;
- avantage brut : `2,00 %` ;
- rétention cible : `50 %` ;
- budget annuel : `3,00 %` du capital ;
- cible nette : `1,00 %`.

Oracles exacts :

- coût fixe : `2 EUR` ;
- plancher variable : `0,70 %` ;
- coût variable : `3,50 EUR` ;
- coût total : `5,50 EUR` ;
- seuil brut : `1,10 %` ;
- marge nette : `0,90 %`, soit `4,50 EUR` ;
- part absorbée : `55 %` ;
- part conservée : `45 %` ;
- frontière de taille pour une marge positive : `153,84615384615384 EUR` ;
- frontière de taille pour conserver `50 %` : `666,6666666666666 EUR` ;
- coût annuel arithmétique : `264 EUR` ;
- coût annuel / capital : `5,28 %` ;
- fréquence frontière sous budget : `2,272727272727273` opérations mensuelles ;
- brut requis pour une cible nette de `1 %` : `2,10 %`.

## Tests Node

Commande :

```bash
node capital_efficiency_lab/tests/engine.test.js
```

Résultat : **succès**.

Couverture :

- cas principal exact ;
- achat simple contre aller-retour ;
- coûts nuls ;
- coût fixe nul avec frontière zéro explicitement qualifiée ;
- cible de rétention exactement satisfaite avec coût fixe nul ;
- cible de rétention réellement impossible avec coût fixe nul ;
- avantage absent, nul, négatif et positif ;
- avantage au seuil et au plancher variable ;
- rétention atteignable et structurellement impossible ;
- budget annuel et coût nul ;
- capital absent ;
- fréquence nulle ;
- valeurs absentes, chaînes, `NaN` et infinis ;
- réconciliations coût, PnL et parts ;
- monotonie du seuil avec la taille ;
- convergence vers le plancher variable ;
- indépendance du seuil par rapport à la fréquence ;
- proportionnalité du coût annuel à la fréquence ;
- absence de valeurs non finies et de `-0` dans l'arbre de sortie.

## Tests Chromium

Commande CI :

```bash
python3 capital_efficiency_lab/tests/browser.py
```

Résultat : **succès**.

Contrôles exécutés :

- largeurs `390`, `768`, `1024` et `1440` pixels ;
- scénario synthétique principal ;
- résultat `45 %` conservé ;
- marge nette `0,90 %` ;
- frontière de rétention `666,67 EUR` ;
- absence de débordement horizontal ;
- absence de `NaN`, `Infinity` et `-0` visibles ;
- focus sur le premier champ invalide ;
- cas structurellement impossible visible ;
- cas à coût fixe nul affiché comme « aucun minimum positif imposé », et non comme ordre recommandé à zéro.

La preuve navigateur recevable provient de GitHub Actions, qui installe et exécute Chromium.

## Non-régressions

Le run `29278627744` a également réussi :

- build déterministe historique ;
- H1 validation numérique stricte ;
- H2 bases observées et simulées ;
- calculateur Q0 ;
- intégrité statique Q0 ;
- H1 smoke Chromium ;
- C2 isolation temporelle ;
- C3 turnover chronologique ;
- C1 réservation du capital ;
- C4 trésorerie réalisée et capital libre négatif ;
- H2 Chromium ;
- Chromium Q0 ;
- syntaxe JavaScript et Python.

## Intégrité et confidentialité

Commande :

```bash
python3 capital_efficiency_lab/tests/static_integrity.py
```

Résultat : **succès**.

Le contrôle refuse notamment :

- requête réseau ;
- WebSocket ou EventSource ;
- cookies ;
- `localStorage`, `sessionStorage` et IndexedDB ;
- analytics ;
- paiement ;
- références d'assets externes.

## Ce qui est validé

- formules du contrat Edge Survival dans le périmètre testé ;
- seuil brut et plancher variable ;
- marge nette et réconciliation en euros ;
- absorption et rétention lorsque l'avantage brut est positif ;
- contraintes inverses ;
- états indisponibles explicites ;
- impossibilité structurelle sans affichage infini ;
- absence de faux minimum positif lorsque les coûts fixes sont nuls ;
- budget annuel et fréquence frontière ;
- cible nette ;
- sensibilité à la taille ;
- provenance `user_assumption` et `synthetic_demo` ;
- interface locale responsive et accessible dans les scénarios testés.

## Limites

- aucun utilisateur réel ;
- aucune donnée de courtier ou transaction réelle ;
- avantage brut fourni par l'utilisateur ou synthétique, jamais estimé par Breaktest ;
- aucune incertitude probabiliste ;
- aucune capitalisation ;
- aucune position simultanée ;
- aucune fiscalité, financement, market impact calibré ou exécution réelle ;
- aucune preuve de disposition à payer ;
- Safari/iPad non exécuté ;
- le laboratoire n'est pas une recommandation, une prévision ou un conseil.

## Conclusion

Le laboratoire est **techniquement validé sur le head et le run indiqués**. Cette conclusion n'est pas une validation commerciale et n'autorise ni publication, ni paiement, ni import réel, ni extension automatique du produit.