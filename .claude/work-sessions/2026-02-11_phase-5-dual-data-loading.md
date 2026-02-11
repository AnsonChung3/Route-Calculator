# Phase 5: Dual Data Loading

**Date:** 2026-02-11
**Branch:** dual-data-loading

---

## Context

The app currently loads CSV data via synchronous static `?raw` imports at module scope. This works for local development but prevents deployment to GitHub Pages (CSVs are `.gitignore`-d and absent from the repo).

Phase 5 introduces dual data loading per ADR-003: auto-load from bundled CSVs in dev, user upload in production. Both paths share the same parse functions and module-scope storage. A Vite environment variable gates which path runs.

### Key decisions

- **Environment variable, not runtime detection.** `VITE_BUNDLE_DATA` in `.env.development` / `.env.production` controls behaviour at build time.
- **Dynamic import for auto-load.** Static `?raw` imports are replaced by dynamic `import()` inside a `useEffect`, so they can be gated on the env flag and don't execute in production builds.
- **Module-scope storage preserved.** Per ADR-002, parsed data lives in module-scope variables. A single `dataLoaded` boolean state flag triggers re-render.
- **Parse functions are pure.** They accept raw CSV strings and return typed arrays. No import side effects, shared by both paths.

---

## Commit 1: Add Vite environment files

- [ ] Create `.env.development` with `VITE_BUNDLE_DATA=true`
- [ ] Create `.env.production` with `VITE_BUNDLE_DATA=false`
- [ ] Add `/// <reference types="vite/client" />` to `src/vite-env.d.ts` if not already present
- [ ] Add `VITE_BUNDLE_DATA` to the `ImportMetaEnv` interface in `src/vite-env.d.ts` for type safety

---

## Commit 2: Refactor csvLoader into pure parse functions

Extract parsing logic from `loadNodes` and `loadEdges` into pure functions that accept raw CSV strings. Remove the static `?raw` imports from `csvLoader.ts`.

- [ ] Rename `loadNodes()` → `parseNodes(raw: string): Node[]` — takes raw CSV string, returns parsed array
- [ ] Rename `loadEdges()` → `parseEdges(raw: string): Edge[]` — same pattern
- [ ] Remove `import nodesRaw from '../data/nodes.csv?raw'` and `import edgesRaw from '../data/edges.csv?raw'`
- [ ] Export both parse functions
- [ ] Temporarily update `App.tsx` to call the new signatures (pass raw strings via inline dynamic import or temporary static import) so the app still compiles. This is a transitional state — commit 3 will wire it up properly.

---

## Commit 3: Add dataLoaded state and auto-load path in App

Replace the current synchronous module-scope `loadNodes()` / `loadEdges()` calls with module-scope variables and an async auto-load effect.

- [ ] Declare module-scope `let nodes: Node[] = []` and `let edges: Edge[] = []` in `App.tsx`
- [ ] Add `useState<boolean>(false)` for `dataLoaded`
- [ ] Add `useEffect` that runs once on mount:
  - Check `import.meta.env.VITE_BUNDLE_DATA === 'true'`
  - If true: dynamic-import `../data/nodes.csv?raw` and `../data/edges.csv?raw`, parse with `parseNodes` / `parseEdges`, assign to module-scope variables, call `setDataLoaded(true)`
  - If false: do nothing (upload screen will render)
- [ ] Guard main app render: if `!dataLoaded`, render a placeholder (temporary — commit 5 adds the upload screen)
- [ ] Update `buildEligibleSet` and `toggleEdgeInRoute` — these already reference module-scope `edges`, so they continue to work. Confirm no stale references.

---

## Commit 4: Create UploadScreen component

- [ ] Create `src/components/UploadScreen.tsx`
- [ ] Accept `onDataLoaded: () => void` as prop
- [ ] Render two file inputs (or a single dropzone) for nodes CSV and edges CSV
- [ ] On file selection, read file contents via `FileReader`, parse with `parseNodes` / `parseEdges`
- [ ] Assign parsed data to the module-scope variables (import them or accept a setter callback)
- [ ] Call `onDataLoaded()` to flip the flag
- [ ] Basic styling consistent with the rest of the app

---

## Commit 5: Wire UploadScreen into App

- [ ] Import `UploadScreen` in `App.tsx`
- [ ] Replace the placeholder from commit 3: when `!dataLoaded`, render `<UploadScreen onDataLoaded={...} />`
- [ ] The `onDataLoaded` callback writes the parsed data to module-scope variables and calls `setDataLoaded(true)`

---

## Verification walkthrough

### Auto-load path (dev)

1. Run `npm run dev` (or `vite dev`). The app should load directly into the map view with nodes and edges visible — no upload screen.
2. Select a few edges to confirm route logic still works (running total updates, eligibility highlighting, tier evaluation).
3. Check the browser console for errors. There should be no failed imports or warnings.

### Upload path (simulated production)

1. Temporarily edit `.env.development` to set `VITE_BUNDLE_DATA=false`.
2. Restart the dev server (`npm run dev`).
3. The app should show the upload screen instead of the map.
4. Upload your local `nodes.csv` and `edges.csv` files via the file inputs.
5. After upload, the app should transition to the map view with all data rendered correctly.
6. Select edges, change category/tier — confirm everything works identically to the auto-load path.
7. Restore `.env.development` to `VITE_BUNDLE_DATA=true` and restart to confirm auto-load resumes.

### Production build

1. Run `npm run build` (or `vite build`).
2. Check the build output (`dist/`) — the CSV file contents should not appear in any generated JS bundle. A text search for a distinctive town name from the data across the `dist/assets/` files should return no matches.
3. Serve the build locally (`npm run preview` or `npx serve dist`).
4. Confirm the upload screen appears and the upload-to-map flow works.

---

## Open question: Does tier configuration need uploading in production?

**Status:** Pending client confirmation

`src/data/tiers.ts` currently lives alongside the CSVs in `src/data/`, and the entire `src/data/` folder is in `.gitignore`. This means `tiers.ts` also never reaches the remote repo.

**Current assessment:** `tiers.ts` is application logic (tier names, edge count thresholds, point ranges, special node requirements), not game data (towns, coordinates, edge values). It defines the scoring structure, which is meaningless without the actual map data. It should be safe to commit to the repo and bundle in all builds.

**Recommendation:** Move `tiers.ts` out of `src/data/` to make the boundary clear — e.g. `src/config/tiers.ts`. This separates committed code from `.gitignore`-d data files so there's no ambiguity about what ships in production.

**Action needed:** Confirm with client whether tier definitions are considered sensitive. If they are, `tiers.ts` would need to be uploaded alongside the CSVs, which adds a third file to the upload screen and requires the tier config to be parsed at runtime rather than imported as a module. If they're not sensitive, move the file and commit it.

---

## Notes

- Commits 1 and 2 are independent. Commits 3–5 are sequential.
- After this phase, `App.tsx` conditionally renders based on `dataLoaded`. All Phase 6 (MVP Completion) commits operate within the `dataLoaded === true` branch — no impact on their implementation. The one consideration is that the responsive canvas commit (Phase 6, Commit 5) adds a `ResizeObserver` to the MapCanvas wrapper, which only exists inside the loaded branch. This is naturally correct — no adjustment needed.
- The `specialNodeNames` `useMemo` in App currently depends on `nodes` being available at first render. After this change, it computes after `dataLoaded` flips to true, at which point `nodes` is populated. The empty-array dependency `[]` remains valid because module-scope data doesn't change after initial load.
