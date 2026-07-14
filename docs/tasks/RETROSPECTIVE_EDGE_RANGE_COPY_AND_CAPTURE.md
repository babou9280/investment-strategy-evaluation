# Retrospective correction — exact-threshold copy and capture focus

## Scope

This task remains strictly inside pull request #23 and the active Edge Survival Envelope stabilization.

## Defect 1 — exact-threshold degenerate range

At a degenerate range where low = base = high = the break-even threshold, the current primary copy incorrectly says that no hypothesis covers frictions.

Required behavior:

- keep `fails_full_range` because no hypothesis is strictly above break-even;
- keep all three net margins equal to zero within the contractual tolerance;
- replace the primary copy with: `Aucune hypothèse ne produit de marge positive`;
- retain the explanatory threshold-equality wording;
- add a browser regression asserting the exact primary text and the three zero margins;
- add a permanent copy rule: equality may be described as covering frictions without positive margin, never as failing to cover frictions.

## Defect 2 — review captures

Full-page review captures must not display the skip link merely because the capture script left an element focused.

Required behavior:

- neutralize focus only inside the capture script before full-page screenshots;
- preserve the real skip link and keyboard behavior in the product;
- assert before each full-page capture that `.skip-link` is outside the viewport;
- regenerate all review captures and inspect 390 and 1440 full-page artifacts.

## Gates

Do not mark this task complete until:

1. the remote branch contains both corrections;
2. exact-head CI is green;
3. the browser regression passes at 390, 768, 1024 and 1440;
4. regenerated full-page captures do not show the skip link;
5. the validation file and blind-spot register cite the exact head and inspected artifacts.
