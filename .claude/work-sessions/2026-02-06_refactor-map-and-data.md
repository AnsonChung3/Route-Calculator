# Refactor: Map internals & data alignment

**Date:** 2026-02-06
**Branch:** create-map-view

---

## Commit 1: Align Node type properties with CSV headers

- [ ] Rename `Node.name` to `Node.town` in `src/types/index.ts` (matches CSV `Town` column)
- [ ] Update `csvLoader.ts` mapping to use `town` instead of `name`
- [ ] Update all consumers: `App.tsx`, `Node.tsx` (props), `coordinates.ts`

## Commit 2: Rename `projectNodes` to `createVisualNodes`

- [ ] Rename function in `src/utils/coordinates.ts`
- [ ] Update import in `App.tsx`

## Commit 3: Move Node rendering and visual-node creation into MapCanvas

- [ ] Move `Node` import from `App.tsx` into `MapCanvas.tsx`
- [ ] Move `createVisualNodes` call and node-mapping logic into `MapCanvas`
- [ ] Have `MapCanvas` accept raw `Node[]` (plus canvas dimensions) instead of `children`; keep `CANVAS_WIDTH` and `CANVAS_HEIGHT` defined in `App.tsx`
- [ ] Extract internal helpers within `MapCanvas` where sensible (e.g. node-rendering function)
- [ ] Clean up `App.tsx` — remove now-unused imports and the top-level `canvasNodes` call

## Commit 4: Remove direct Node import from App.tsx

- [ ] Confirm `Node.tsx` is only imported by `MapCanvas.tsx`
- [ ] Confirm `App.tsx` has no reference to `Node` component
