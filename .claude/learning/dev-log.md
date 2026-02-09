# Developer Learning Log

## 2026-02-06 — Component structure and readability

**What went wrong:** First draft of `MapCanvas` crammed edge resolution logic, position lookup construction, and the click handler all inline within the component function body and JSX return. Three rewrites were rejected before acceptance.

**Why:** Prioritised getting it working over keeping it readable. Treated the component as a dumping ground instead of thinking about structure upfront.

**Rules to follow:**
- Extract helper functions out of the main component body; place them below the default export when safe to do so (plain functions, no hoisting issues).
- Use descriptive variable names — a map of positions keyed by town should say so (e.g. `positionsByTown`), not just `positions`.
- Add a JSDoc comment to every helper function explaining its purpose.
- Keep the component function focused on wiring data and rendering; derivation logic belongs in named helpers.
