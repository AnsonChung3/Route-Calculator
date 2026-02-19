# Phase 5: MVP Completion

**Date:** 2026-02-11
**Branch:** phase-5-mvp-completion

---

## Context

Phase 4B delivered the tiered award system. Phase 5 finishes the MVP: a clear/reset button, node tooltips, and a batch of RoutePanel layout and UX fixes. Each commit is a self-contained change.

---

## Commit 1: Remove 'End' column from EdgeRow

Small cleanup — the End column duplicates information that will be better served by the head/tail display line (tracked separately in Known Issues).

- [ ] Remove `endLabel` logic from `EdgeRow.tsx`
- [ ] Remove the `<td>` rendering it
- [ ] Remove the `End` `<th>` from the table header in `RoutePanel.tsx`

---

## Commit 2: Remove redundant section between route table and tier status

The summary block (total value, edges, head, tail) between the edge table and the tier status section is redundant — total and edge count are already shown in the tier status constraints.

- [ ] Remove the `mt-6 pt-4 border-t` summary `<div>` from `RoutePanel.tsx` (the one containing Total value, Edges, Head, Tail)

---

## Commit 3: Consolidate constraint display at bottom of RoutePanel

Constraint status should sit at the bottom. Special node row should only appear when relevant (i.e. `minSpecialNodes > 0`). Format to match edge count style: `Special nodes 1/2`.

- [ ] Confirm special node `ConstraintRow` is already conditionally rendered (it is — `{tierDef.minSpecialNodes > 0 && ...}`)
- [ ] Move tier status section to the very bottom of the panel if not already
- [ ] Ensure consistent formatting across all constraint rows

---

## Commit 4: Add clear/reset selection button

- [ ] Add a "Clear route" button to `RoutePanel` (below the declaration controls, above the edge list)
- [ ] Wire it to reset route state in `App.tsx` — pass `onClearRoute` callback that calls `setRoute(routeUtils.createEmptyRoute)`
- [ ] Disable the button when the route is already empty

---

## Commit 5: Make MapCanvas responsive

Replace hardcoded `CANVAS_WIDTH`/`CANVAS_HEIGHT` with a CSS-driven square that fills available viewport height. Use a thin ResizeObserver to read the rendered pixel size back for the coordinate system.

### Layout approach

CSS `aspect-ratio: 1` on the canvas container, with height derived from the viewport (`h-[calc(100vh-Xrem)]` where X accounts for header/padding). Width follows automatically. The container sizes itself; JS just reads the result.

### Implementation

- [ ] Remove `CANVAS_WIDTH` and `CANVAS_HEIGHT` constants from `App.tsx`
- [ ] Add a `useRef` on the MapCanvas wrapper div and a `ResizeObserver` to read its rendered width
- [ ] Store the measured size in state (single number — it's a square)
- [ ] Apply `aspect-square` and viewport-relative height class to the canvas wrapper
- [ ] Pass the measured size as `width` and `height` to `MapCanvas` internals (SVG dimensions, coordinate conversion)
- [ ] Guard against initial render before measurement (size = 0): render nothing or a placeholder until the first observation fires

### Notes

- `createVisualNodes` already scales to the given dimensions, so coordinate conversion needs no changes beyond receiving the new size.
- The ResizeObserver isn't deciding the size — CSS is. The observer just bridges the gap between CSS layout and the JS coordinate maths.

---

## Commit 6: Force RoutePanel to match MapCanvas height

- [ ] Set RoutePanel's outer `<div>` to match the canvas height (receive `height` as prop or use a shared constant)
- [ ] Apply `max-h` and `flex flex-col` so the panel doesn't exceed the canvas height

---

## Commit 7: Make route table scrollable

Depends on Commit 6 (panel has a fixed height to scroll within).

- [ ] Wrap the `<table>` in a `<div>` with `overflow-y-auto` and `flex-1` so it fills remaining space and scrolls when content overflows
- [ ] Ensure table header stays visible (sticky thead or separate header row outside the scroll container)

---

## Commit 8: Add tooltip to nodes on hover

Show all node information (id, town, lat/long, special status) on hover.

- [ ] Pass full node data to the `Node` component (currently receives `x, y, town, special` — also pass `id, latitude, longitude`)
- [ ] Replace the plain `title` attribute with a custom tooltip element (CSS-only or lightweight React approach)
- [ ] Tooltip content: node id, town name, coordinates (lat/long), special status
- [ ] Show on hover after a short delay; hide on mouse leave
- [ ] Position tooltip near the node, avoiding canvas edge clipping where practical

---

## Commit 9: Code QA pass

General cleanup. Not a feature commit — housekeeping only.

- [ ] Review for any remaining hardcoded magic numbers
- [ ] General structural cleanup as needed

---

## Notes

- Commits 1–4 are independent and can be done in any order. Listed in this order because the table changes (1–3) are quick wins that simplify the panel before adding the clear button (4).
- Commits 5, 6, and 7 are sequential — responsive canvas (5) determines the height that the panel matches (6), and scrolling (7) only makes sense once the panel has a constrained height.
- Commit 8 (tooltip) is independent of everything else.
- Commit 9 (QA) goes last as a sweep over the final state.
