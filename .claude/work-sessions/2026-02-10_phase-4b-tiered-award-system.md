# Phase 4B: Tiered Award System

**Date:** 2026-02-10
**Branch:** game-logic-and-constraint

---

## Context

Phase 4 delivered the ordered route model, edge eligibility constraints, and RoutePanel. Phase 4B adds the tiered award system: players declare a route category (short/long) and target tier, then the system evaluates the current route against tier constraints in real time.

### Key decisions

- **Declarations are a lens, not a constraint.** `category` and `targetTier` live in App state, separate from `Route`. The route model remains a pure ordered graph structure with no knowledge of tiers. Changing declarations never clears or invalidates the route.
- **Tier configuration is static data.** Two arrays of `TierDefinition` objects in `src/data/tiers.ts`. Not logic, not state.
- **Evaluation is a pure function.** `evaluateRoute()` in `src/utils/tierEval.ts` takes route + config + special node set, returns a result object. No React dependency. Testable in isolation.
- **Special nodes are a data attribute, not a route concern.** The `special: boolean` field on `Node` is used only for evaluation. Route construction logic (`canAddEdge`, `addEdge`) remains unaware of special status.

### Type definitions

```ts
// src/types/index.ts — additions
export type RouteCategory = 'short' | 'long';

export type TierName = 'chrome' | 'bronze' | 'silver' | 'gold' | 'specialGold' | 'platinum';

export interface TierDefinition {
    name: TierName;
    edgeCount: { min: number; max: number | null }; // max = min for exact, null for open-ended
    pointRange: { min: number; max: number };
    minSpecialNodes: number;
}

export interface TierEvaluation {
    edgeCount: number;
    total: number;
    specialNodeCount: number;
    constraints: {
        edgeCountMet: boolean;
        totalMet: boolean;
        specialNodesMet: boolean;
    };
    allMet: boolean;
}
```

---

## Commit 1: Extend Node with special attribute

### Data model

- [x] Add `special: boolean` to `Node` interface in `src/types/index.ts`
- [x] Add `Special` column to `src/data/nodes.csv` (values: `0` / `1`)
- [x] Update `NodeRow` interface in `src/utils/csvLoader.ts` to include `Special: string`
- [x] Update `loadNodes()` parsing logic to map `Special` string to boolean

### Verification

- [x] Confirm `loadNodes()` returns nodes with correct `special` values (spot-check via console or temporary render)

---

## Commit 2: Define tier types and configuration

### Types

- [x] Add `RouteCategory`, `TierName`, `TierDefinition`, and `TierEvaluation` types to `src/types/index.ts`

### Configuration

- [x] Create `src/data/tiers.ts`
- [x] Define `SHORT_TIERS: TierDefinition[]` matching the short route tier table:
  - Chrome: 4 edges (exact), 120–175 points, 0 special nodes
  - Bronze: min 7 edges, 180–220 points, 0 special nodes
  - Silver: min 10 edges, 225–285 points, 0 special nodes
  - Gold: min 12 edges, 290–326 points, 0 special nodes
- [x] Define `LONG_TIERS: TierDefinition[]` matching the long route tier table:
  - Bronze: min 12 edges, 300–395 points, min 1 special node
  - Silver: min 16 edges, 400–495 points, min 1 special node
  - Gold: min 20 edges, 500–540 points, min 1 special node
  - Special Gold: exactly 22 edges, exactly 540 points, min 2 special nodes
  - Platinum: exactly 23 edges, exactly 560 points, min 2 special nodes
- [x] Export a helper `getTiersForCategory(category: RouteCategory): TierDefinition[]`

### Notes

- Commits 1 and 2 are independent and could be done in either order.
- `edgeCount.max` is `null` for "min N" tiers and equals `min` for "exactly N" tiers.
- `pointRange.min === pointRange.max` for "exactly X" point tiers (Special Gold, Platinum).

---

## Commit 3: Tier evaluation utility

### Create module

- [x] Create `src/utils/tierEval.ts`
- [x] Implement `countSpecialNodes(nodeSequence: string[], specialNodeNames: Set<string>): number`
  - Filters `nodeSequence` against the set. O(n) where n is route length.
- [x] Implement `evaluateRoute(route: Route, category: RouteCategory, targetTier: TierName, specialNodeNames: Set<string>): TierEvaluation`
  - Look up the `TierDefinition` from configuration using category and targetTier
  - Count edges: `route.edges.length`
  - Sum total: `getRouteTotal(route)`
  - Count special nodes via `countSpecialNodes`
  - Evaluate each constraint:
    - `edgeCountMet`: edge count >= min AND (max is null OR edge count <= max)
    - `totalMet`: total >= pointRange.min AND total <= pointRange.max
    - `specialNodesMet`: special node count >= minSpecialNodes
  - `allMet`: all three constraints are true
- [x] Export both functions

### Notes

- This module has no React dependency. It imports from `types` and `data/tiers` only.
- `getRouteTotal` is reused from `routeUtils.ts`.

---

## Commit 4: Wire declarations and evaluation into App state

### App state additions

- [x] Add `useState<RouteCategory>` for `category` (default: `'short'`)
- [x] Add `useState<TierName>` for `targetTier` (default: `'chrome'`)
- [x] When `category` changes, reset `targetTier` to the first tier in the new category's tier list (handle in the change handler, not a separate `useEffect`)

### Derived values

- [x] Add `useMemo` for `specialNodeNames: Set<string>` — derived from loaded nodes, filtering for `special === true`, mapping to town names. Stable dependency (nodes are static module-level data).
- [x] Add `useMemo` for `tierEvaluation: TierEvaluation` — calls `evaluateRoute(route, category, targetTier, specialNodeNames)`. Dependencies: `route`, `category`, `targetTier`, `specialNodeNames`.

### Props to RoutePanel

- [x] Extend `RoutePanelProps` with: `category`, `targetTier`, `tierEvaluation`, `onChangeCategory: (cat: RouteCategory) => void`, `onChangeTargetTier: (tier: TierName) => void`
- [x] Pass all new props from App to RoutePanel

### Verification

- [x] Confirm that changing category/tier in state (via React DevTools or temporary buttons) updates the evaluation
- [x] Confirm that changing the route updates the evaluation

---

## Commit 5: RoutePanel — declaration controls and constraint status

### Declaration controls (top of RoutePanel, above edge list)

- [x] Add a toggle or segmented control for short vs long route category
- [x] Add a dropdown or button group for target tier, populated from `getTiersForCategory(category)`
- [x] Wire controls to `onChangeCategory` and `onChangeTargetTier` callbacks

### Constraint status display (below edge list / route summary)

- [x] Add a "Tier Status" section showing:
  - Target tier name
  - Edge count: current / required (with met/unmet indicator)
  - Point total: current / required range (with met/unmet indicator)
  - Special nodes: current / required minimum (with met/unmet indicator, only shown for long routes or when minSpecialNodes > 0)
  - Overall status: all constraints met or not
- [x] Style met constraints distinctly from unmet (e.g. colour change)

### Visual distinction for special nodes on map (optional, low priority)

- [x] Pass `special` prop to Node component via MapCanvas
- [x] Render special nodes with a visual distinction (e.g. different colour or ring)

### Verification

- [x] User can freely toggle category and tier at any time without affecting the route
- [x] Constraint status updates in real time as the route changes
- [x] Changing category resets tier to a valid default

---

## Notes

- The evaluation function is deliberately decoupled from React. It can be unit tested with hand-crafted `Route` objects and a mock special node set.
- Special node status does not affect route construction. A player may build a route without enough special nodes — the evaluation simply reports the constraint as unmet.
- The `specialNodeNames` set is derived once and is stable because node data is loaded at module level and never changes.
- Edge count semantics vary: some tiers require exact counts, others require minimums. The `{ min, max }` shape with `max = null` for open-ended handles both cases.
