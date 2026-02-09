# Phase 4: Route Logic & Calculator Component

**Date:** 2026-02-09
**Branch:** route-logic-and-constraints

---

## Context

Phase 3 delivered edge rendering and toggle selection using an unordered `Set<string>` in App. Phase 4 replaces that with an ordered route model, enforces graph-traversal constraints, and introduces the `RoutePanel` sibling component (per ADR-001: state lifted to App, passed as props to both children).

### Key decisions

- **Route model**: An ordered `Edge[]` array replaces `Set<string>`. Head and tail nodes are derived from the first/last edge in the array. This is the minimal structure that supports continuity checks and ordered display.
- **Component name**: `RoutePanel` (not "Calculator" — it displays route details, not just a total).
- **Layout**: App renders MapCanvas and RoutePanel in a horizontal flex row, same height. RoutePanel has a full coloured border for visual division.
- **Data access**: Edge data loading is lifted from MapCanvas to App so both children can receive the full edge list as props. Node data loading stays in MapCanvas (RoutePanel doesn't need coordinates).
- **RoutePanel scope**: Intentionally over-populated with information at this stage. Later phases will trim what's shown.

### Route type definition

```ts
// src/types/index.ts
export interface Route {
    edges: Edge[];       // ordered list of selected edges
    nodeSequence: string[]; // ordered list of visited town names (derived)
}
```

`nodeSequence` is derived from `edges` — the first edge contributes both its nodes (in traversal order), each subsequent edge contributes its "new" node. This gives us O(1) head/tail access and O(n) membership checks for the no-repeat-node rule.

### Edge eligibility rules

An edge is **eligible** for selection when:
1. The route is empty (any edge may start a route), OR
2. Exactly one of the edge's endpoints matches the route's head or tail, AND the edge's *other* endpoint is not already in the route's `nodeSequence`.

An edge is **eligible for deselection** only if it is the first or last edge in the route (constrained removal from ends).

---

## Commit 1: Route type and state model

### Types

- [ ] Add `Route` interface to `src/types/index.ts` with fields: `edges: Edge[]`, `nodeSequence: string[]`
- [ ] Confirm existing `Edge` type is unchanged (`from`, `to`, `value`)

### Route utility module

- [ ] Create `src/utils/routeUtils.ts` with the following pure functions:
  - `createEmptyRoute(): Route` — returns `{ edges: [], nodeSequence: [] }`
  - `canAddEdge(route: Route, edge: Edge): boolean` — implements the eligibility rules above
  - `addEdge(route: Route, edge: Edge): Route` — returns a new Route with the edge appended (at head or tail depending on which endpoint matches), updating `nodeSequence` accordingly. If the route is empty, convention: `from` is head, `to` is tail
  - `canRemoveEdge(route: Route, edgeKey: string): boolean` — true only if edgeKey matches the first or last edge
  - `removeEdge(route: Route, edgeKey: string): Route` — returns a new Route with the end edge removed, trimming `nodeSequence` accordingly
  - `getEdgeKey(edge: Edge): string` — returns `${edge.from}-${edge.to}`
  - `getRouteTotal(route: Route): number` — sums `edge.value` for all edges in the route
  - `getHead(route: Route): string | null` — returns first node in `nodeSequence`, or null if empty
  - `getTail(route: Route): string | null` — returns last node in `nodeSequence`, or null if empty

### Notes

- All functions are pure (no mutation). Each returns a new object.
- `addEdge` must determine whether the new edge connects at the head or the tail and orient `nodeSequence` accordingly. E.g. if tail is "York" and the new edge is `{ from: "York", to: "Leeds" }`, append "Leeds" to `nodeSequence`. If head is "York" and the new edge is `{ from: "Leeds", to: "York" }`, prepend "Leeds".
- Edge direction in the data is arbitrary (edges are undirected). `addEdge` must handle both orientations: the matching endpoint could be `from` or `to`.

---

## Commit 2: Replace selection state in App with route model

### Lift edge data to App

- [ ] Move `loadEdges()` call from MapCanvas module scope to App module scope
- [ ] Pass full `edges` array to MapCanvas as a new prop (update MapCanvasProps)
- [ ] Remove the `loadEdges()` call and `edges` import from MapCanvas
- [ ] Confirm MapCanvas still renders correctly with edges received via props

### Replace state

- [ ] Replace `selectedEdgeKeys: Set<string>` state in App with `route: Route` state (initialised via `createEmptyRoute()`)
- [ ] Replace `handleToggleEdge` with `handleEdgeClick(edgeKey: string)`:
  - Look up the full `Edge` object from the edges array using the key
  - If the edge is already in the route and `canRemoveEdge` is true, call `removeEdge`
  - Else if the edge is not in the route and `canAddEdge` is true, call `addEdge`
  - Otherwise, do nothing (invalid action)
- [ ] Derive `selectedEdgeKeys: Set<string>` from `route.edges` for passing to MapCanvas (keeps MapCanvas interface stable for now)
- [ ] Pass `handleEdgeClick` to MapCanvas as `onToggleEdge` (signature is unchanged: `(edgeKey: string) => void`)
- [ ] Verify selection still works for the first edge (any edge selectable), and that subsequent edges must connect to the route

---

## Commit 3: Edge eligibility visual feedback on MapCanvas

- [ ] Compute an `eligibleEdgeKeys: Set<string>` in App by iterating all edges and checking `canAddEdge` for each
- [ ] Also include edges where `canRemoveEdge` is true (removable ends)
- [ ] Pass `eligibleEdgeKeys` to MapCanvas as a new prop
- [ ] Update MapCanvas to pass an `eligible` boolean prop to each Edge component
- [ ] Update Edge component to accept `eligible` prop
- [ ] Style ineligible edges: reduced opacity (e.g. 0.3) and `pointer-events: none` or `cursor: not-allowed`
- [ ] Style eligible-but-unselected edges: normal opacity, default cursor
- [ ] Selected edges retain their current accent styling regardless of eligibility
- [ ] Verify: after selecting one edge, only connecting edges remain clickable; others are visually dimmed

---

## Commit 4: App layout — horizontal flex row

- [ ] Restructure App's JSX: wrap MapCanvas and RoutePanel in a flex row container
  ```
  <div className="flex flex-row items-stretch gap-4">
      <MapCanvas ... />
      <RoutePanel ... />
  </div>
  ```
- [ ] Update `.container` in `App.css`: change layout direction from centred-column to something compatible with the new row (may need adjusting `align-items`, removing `max-width` constraints on children, etc.)
- [ ] Ensure the flex row does not exceed viewport width — MapCanvas keeps its fixed 800px width; RoutePanel takes remaining space (or a sensible fixed/min width, e.g. 320px)
- [ ] Both children should have equal height (achieved by `items-stretch` on the parent)
- [ ] Heading (`<h1>`) stays above the flex row, full width

---

## Commit 5: RoutePanel component — scaffold and display

### Create component

- [ ] Create `src/components/RoutePanel.tsx`
- [ ] Define `RoutePanelProps`:
  ```ts
  interface RoutePanelProps {
      route: Route;
      edges: Edge[];           // full edge list (for reference/future use)
  }
  ```
- [ ] RoutePanel receives these props from App

### Styling

- [ ] Apply a full coloured border for visual division (e.g. `border-2 border-amber-500 rounded-lg` or similar — pick from existing Tailwind palette, contrasting with the map's neutral border)
- [ ] Match the map's height (inherited from flex parent's `items-stretch`)
- [ ] Add internal padding (`p-4`) and `overflow-y-auto` for scrolling if content overflows
- [ ] Set a background that distinguishes it from the map area (e.g. `bg-neutral-900` if the page is dark, or `bg-white` if light — match existing theme)

### Displayed information (intentionally verbose — trim later)

- [ ] **Route summary section**:
  - Heading: "Route Summary"
  - Total value: sum of all selected edge values (from `getRouteTotal`)
  - Number of edges selected: `route.edges.length`
  - Number of nodes visited: `route.nodeSequence.length`
  - Head node: `getHead(route)` or "—" if empty
  - Tail node: `getTail(route)` or "—" if empty

- [ ] **Node sequence section**:
  - Heading: "Nodes Visited"
  - Ordered list of node names from `route.nodeSequence` (numbered 1, 2, 3...)
  - Empty-state text: "No nodes selected"

- [ ] **Edge list section**:
  - Heading: "Selected Edges"
  - Each edge shown as a row: `from → to` with value displayed (e.g. "York → Leeds — 15 pts")
  - Edges listed in route order (traversal order, not alphabetical)
  - Empty-state text: "No edges selected"

- [ ] **Statistics section** (extra info for later trimming):
  - Heading: "Statistics"
  - Average edge value (total / count, or "—" if no edges)
  - Highest-value edge in route (name and value, or "—")
  - Lowest-value edge in route (name and value, or "—")
  - Remaining capacity: placeholder text, e.g. "—/— edges used" (constraint limits not yet defined)

### Wire up in App

- [ ] Import RoutePanel in App
- [ ] Render RoutePanel inside the flex row, after MapCanvas
- [ ] Pass `route` and `edges` as props
- [ ] Verify RoutePanel updates live as edges are selected/deselected on the map

---

## Notes

- `nodeSequence` derivation in `addEdge`/`removeEdge` is the trickiest part. The order matters: when an edge connects at the head, prepend the new node; when it connects at the tail, append. When removing from the head, shift the first node; when removing from the tail, pop the last node. But the *first* edge is a special case: it contributes two nodes.
- Edge data is undirected in the CSV but stored with a `from`/`to` direction. The route logic must treat edges as undirected — matching either endpoint against head/tail.
- The existing `Set<string>` derivation for MapCanvas is a compatibility shim. In a later phase, MapCanvas could accept the `Route` directly and do its own eligibility styling, but keeping the interface stable reduces churn in this commit.
- RoutePanel is deliberately information-heavy. The intent is to see everything working end-to-end, then refine the display in phase 5/6.
