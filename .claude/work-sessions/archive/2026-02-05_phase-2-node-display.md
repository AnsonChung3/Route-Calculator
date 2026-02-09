# Phase 2: Node Display Prototype

**Date:** 2026-02-05
**Branch:** create-map-view

---

## Type Definitions

- [x] Create `src/types/index.ts`
- [x] Define `Node` interface (`id: number`, `name: string`, `latitude: number`, `longitude: number`)
- [x] Define `CanvasNode` type — `Node` extended with `x: number`, `y: number` (canvas pixel coordinates)

## CSV Loader Utility

- [x] Create `src/utils/csvLoader.ts`
- [x] Implement generic CSV fetch+parse helper using PapaParse (header mode, skip empty lines)
- [x] Implement `loadNodes()` — fetches `/src/data/nodes.csv`, maps rows to `Node[]`
- [x] Map the `Name2` CSV column to the `name` field during parsing

## Coordinate Conversion Utility

- [x] Create `src/utils/coordinates.ts`
- [x] Implement `projectNodes(nodes, canvasWidth, canvasHeight)` that:
  - Derives lat/long bounding box from the node array
  - Applies padding so edge nodes aren't clipped against the canvas border
  - Maps longitude to X (left→right)
  - Maps latitude to Y with inversion (higher lat → lower Y, since canvas Y grows downward)
  - Returns `CanvasNode[]`

## MapCanvas Component

- [x] Create `src/components/MapCanvas.tsx`
- [x] Render a fixed-dimension square container (e.g. 800x800)
- [x] Use `position: relative` so children can be absolutely placed by x/y
- [x] Apply a subtle background or border so the canvas boundary is visible during dev

## Node Component

- [x] Create `src/components/Node.tsx`
- [x] Accept props: `x`, `y`, `name`
- [x] Render as a small circle (`position: absolute`, translated to x/y)
- [x] Show location name as a tooltip or adjacent label

## Wire Up App.tsx

- [x] Remove the existing colour swatch test content
- [x] Render `<MapCanvas>` containing a `<Node>` for each entry
- [ ] Smoke-test: verify nodes appear and their relative positions roughly match UK geography

## Notes

- Used Vite `?raw` imports instead of async fetch — data is small and bundled at build time
- Added `src/vite-env.d.ts` for TypeScript to recognise Vite import suffixes
- Data loading is synchronous (module-level), so no `useState`/`useEffect` needed

## Plan Reference

Implementation plan: `C:\Users\user\.claude\plans\noble-hopping-deer.md`
