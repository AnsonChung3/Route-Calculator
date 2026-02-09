# Phase 3: Edge Display & Selection

**Date:** 2026-02-06
**Branch:** create-edge-view

---

## Context

Phase 2 established the node display pipeline: CSV → typed data → canvas coordinates → rendered dots. Phase 3 adds edges (routes between nodes) with selection interactivity.

Key decisions carried forward:

- **ADR-001**: Selection state lives in App, passed as props to children
- **csvLoader pattern**: `loadEdges()` added alongside `loadNodes()` in the same file (no generic abstraction — only two consumers)
- **Rendering approach**: SVG layer in MapCanvas for edge lines, div nodes rendered on top. Each edge renders two `<line>` elements inside a `<g>` — a transparent wide hit-area line (12-16px stroke) on top for click targets, and a thin visible line underneath for display.
- **Testing**: All interactivity is tested manually (visual check in browser). Do NOT run build commands.

### Edge identifier

Each edge is uniquely identified by its `from-to` town pair. A derived string key (`${from}-${to}`) is used for selection tracking in App state.

---

## Commit 1: Edge type and CSV loader

- [x] Add `Edge` interface to `src/types/index.ts` — fields: `from` (string), `to` (string), `value` (number)
- [x] Add `loadEdges()` to `src/utils/csvLoader.ts` — import `edges.csv?raw`, define `EdgeRow` interface, parse and map to `Edge[]`
- [x] Verify edges load without errors (console check or dev tools)

## Commit 2: Edge component and SVG rendering

- [x] Create `src/components/Edge.tsx` — accepts `x1`, `y1`, `x2`, `y2`, `value`, `selected`, `edgeKey`, `onClick` props
    - Renders a `<g>` wrapper carrying the `onClick` handler and `cursor: pointer`
    - Inside `<g>`: a visible `<line>` (thin, muted colour) and a `<text>` label at the midpoint showing the value
    - On top: a transparent hit-area `<line>` (12-16px `strokeWidth`, `stroke: transparent`) for reliable click targets
    - `onClick` logs to console: `console.log('Edge clicked:', edgeKey)`
    - Default (unselected) style: thin, muted colour
- [x] Add SVG layer to `MapCanvas` — full-size `<svg>` element positioned behind the node divs
- [x] Load edges in `MapCanvas` (call `loadEdges()` at module scope, same pattern as nodes)
- [x] Build a position lookup: map canvasNode town names to `{ x, y }` for resolving edge endpoints
- [x] Render `Edge` components inside the SVG layer, passing resolved coordinates
- [x] Confirm edges render correctly between the right nodes (visual check)

## Commit 3: Selection state and interactivity

- [x] Add `selectedEdgeKeys` state to `App` (`Set<string>`, per ADR-001)
- [x] Add `handleToggleEdge` handler in `App` — toggles a key in/out of the set
- [x] Pass `selectedEdgeKeys` and `onToggleEdge` as props to `MapCanvas`
- [x] Update `MapCanvas` props interface to accept selection state and callback
- [x] Wire each `Edge` component's `onClick` to call `onToggleEdge` with the edge's key (`${from}-${to}`)
- [x] Pass `selected` boolean to each `Edge` (derived from `selectedEdgeKeys.has(key)`)
- [x] Style selected edges distinctly — thicker stroke, accent colour
- [x] Verify toggle works: click edge to select, click again to deselect (visual check)

---

## Notes

- Node loading stays inside MapCanvas (only consumer of node positions). Edge loading also lives in MapCanvas for the same reason. When Phase 4 introduces Calculator, edge data access will need revisiting — either lift loading to App or have Calculator import from csvLoader directly.
- `Set<string>` for selection state keeps App decoupled from the full edge data shape. App doesn't need to know edge values or coordinates — just which keys are selected.
- The SVG hit-area trick (invisible wider line behind the visible one) avoids frustrating click targets on thin lines.
