# Mission — site de validation Cost Intelligence

- Branche : `codex/cost-intelligence-validation-site`
- Base : `breaktest-bootstrap` après fusion du pivot stratégique, commit `a93a2ffd5e2590eea5d45abe09d34162d464e546`
- Statut : prêt pour implémentation
- `main` : strictement hors périmètre

## Objectif

Construire uniquement l'instrument de validation commerciale défini dans `NEXT_CODEX_PROMPT.md` : une page statique mobile-first et un calculateur déterministe de cost drag, isolés du moteur canonique historique.

## Sources obligatoires

Lire avant toute modification :

- `AGENTS.md` ;
- les six fichiers canoniques ;
- `STRATEGY.md` ;
- `MARKET_EVIDENCE.md` ;
- `BUSINESS_MODEL.md` ;
- `VALIDATION_PLAN.md` ;
- `NEXT_CODEX_PROMPT.md` ;
- `go_to_market/LANDING_PAGE_COPY.md` ;
- `go_to_market/VALIDATION_FORM.md` ;
- `go_to_market/DEMO_SCENARIOS.md`.

## Interdictions

- aucun changement de `app/Breaktest_Studio.html` ;
- aucun tarif réel de courtier ;
- aucun backend ;
- aucun tracking actif ;
- aucun paiement réel ;
- aucun import de transaction ;
- aucune recommandation ;
- aucune reprise de H3 à H6 ;
- aucune fusion automatique.

## Preuve attendue

- cinq scénarios de référence exacts ;
- validation ferme des entrées ;
- tests navigateur à 390, 768, 1024 et 1440 px ;
- clavier, partage sans donnée personnelle, absence de débordement ;
- syntaxe JavaScript ;
- rapport de validation avec commandes et résultats exacts ;
- pull request isolée vers `breaktest-bootstrap`.