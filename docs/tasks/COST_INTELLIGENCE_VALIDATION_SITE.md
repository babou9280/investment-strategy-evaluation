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
- `go_to_market/DEMO_SCENARIOS.md` ;
- `docs/design/PRODUCT_EXPERIENCE.md` ;
- `docs/design/UX_SPEC.md` ;
- `docs/design/CALCULATION_CONTRACT.md` ;
- `docs/design/VISUAL_SYSTEM.md` ;
- `docs/standards/QUANT_FINANCE_STANDARDS.md`.

En cas de contradiction, les contrats de calcul et les standards quantitatifs les plus spécifiques priment sur les exemples de texte ou de mise en page.

## Interdictions

- aucun changement de `app/Breaktest_Studio.html` ;
- aucun tarif réel de courtier ;
- aucun backend ;
- aucun tracking actif ;
- aucun paiement réel ;
- aucun import de transaction ;
- aucune recommandation ;
- aucune reprise de H3 à H6 ;
- aucune métrique quantitative avancée non justifiée ;
- aucune revendication de conformité GIPS ou MiFID II ;
- aucune fusion automatique.

## Preuve attendue

- cinq scénarios de référence exacts ;
- convention achat simple / aller-retour testée ;
- commission et change multipliés par le nombre de côtés, spread et slippage non remultipliés ;
- validation ferme des entrées ;
- capital absent traité comme ratio indisponible, sans invalider le coût par opération ;
- aucun `NaN`, `Infinity` ou `-0` visible ;
- provenance `user_assumption` visible pour les coûts saisis ;
- tests navigateur à 390, 768, 1024 et 1440 px ;
- clavier, focus d'erreur, annonce accessible du résultat, partage sans donnée personnelle ni capital exact par défaut, absence de débordement ;
- respect de `prefers-reduced-motion` ;
- syntaxe JavaScript ;
- rapport de validation avec commandes et résultats exacts ;
- preuve que le moteur historique n'a pas changé ;
- pull request isolée vers `breaktest-bootstrap`.