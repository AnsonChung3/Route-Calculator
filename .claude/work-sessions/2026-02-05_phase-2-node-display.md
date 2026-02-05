# Phase 2: Node Display Prototype

**Date:** 2026-02-05
**Branch:** create-map-view

---

## Type Definitions

- [ ] Create `src/types/index.ts`
- [ ] Define `Node` interface (`id: number`, `name: string`, `latitude: number`, `longitude: number`)
- [ ] Define `CanvasNode` type — `Node` extended with `x: number`, `y: number` (canvas pixel coordinates)

## CSV Loader Utility

- [ ] Create `src/utils/csvLoader.ts`
- [ ] Implement generic CSV fetch+parse helper using PapaParse (header mode, skip empty lines)
- [ ] Implement `loadNodes()` — fetches `/src/data/nodes.csv`, maps rows to `Node[]`
- [ ] Map the `Name2` CSV column to the `name` field during parsing

## Coordinate Conversion Utility

- [ ] Create `src/utils/coordinates.ts`
- [ ] Implement `projectNodes(nodes, canvasWidth, canvasHeight)` that:
  - Derives lat/long bounding box from the node array
  - Applies padding so edge nodes aren't clipped against the canvas border
  - Maps longitude to X (left→right)
  - Maps latitude to Y with inversion (higher lat → lower Y, since canvas Y grows downward)
  - Returns `CanvasNode[]`

## MapCanvas Component

- [ ] Create `src/components/MapCanvas.tsx`
- [ ] Render a fixed-dimension square container (e.g. 800x800)
- [ ] Use `position: relative` so children can be absolutely placed by x/y
- [ ] Apply a subtle background or border so the canvas boundary is visible during dev

## Node Component

- [ ] Create `src/components/Node.tsx`
- [ ] Accept props: `x`, `y`, `name`
- [ ] Render as a small circle (`position: absolute`, translated to x/y)
- [ ] Show location name as a tooltip or adjacent label

## Wire Up App.tsx

- [ ] Remove the existing colour swatch test content
- [ ] Add `useState` for the loaded `CanvasNode[]`
- [ ] Add `useEffect` to call `loadNodes()` on mount, then project to canvas coordinates
- [ ] Render `<MapCanvas>` containing a `<Node>` for each entry
- [ ] Smoke-test: verify nodes appear and their relative positions roughly match UK geography
