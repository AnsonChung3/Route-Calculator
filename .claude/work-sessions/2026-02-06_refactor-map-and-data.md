# Refactor: Map internals & data alignment

**Date:** 2026-02-06
**Branch:** create-map-view

---

## Commit 1: Align Node type properties with CSV headers

- [x] Rename `Node.name` to `Node.town` in `src/types/index.ts` (matches CSV `Town` column)
- [x] Update `csvLoader.ts` mapping to use `town` instead of `name`
- [x] Update all consumers: `App.tsx`, `Node.tsx` (props), `coordinates.ts`

## Commit 2: Rename `projectNodes` to `createVisualNodes`

- [x] Rename function in `src/utils/coordinates.ts`
- [x] Update import in `App.tsx` (removed; now imported by `MapCanvas.tsx`)

## Commit 3: Move Node rendering and visual-node creation into MapCanvas

- [x] Move `Node` import from `App.tsx` into `MapCanvas.tsx`
- [x] Move `createVisualNodes` call and node-mapping logic into `MapCanvas`
- [x] Have `MapCanvas` accept raw `Node[]` (plus canvas dimensions) instead of `children`; keep `CANVAS_WIDTH` and `CANVAS_HEIGHT` defined in `App.tsx`
- [x] Clean up `App.tsx` — remove now-unused imports and the top-level `canvasNodes` call
- [x] Fix leftover `node.name` → `node.town` from partial Commit 1

## Commit 4: Remove direct Node import from App.tsx

- [x] Confirm `Node.tsx` is only imported by `MapCanvas.tsx`
- [x] Confirm `App.tsx` has no reference to `Node` component

> Commits 2–4 completed together in a single pass.
