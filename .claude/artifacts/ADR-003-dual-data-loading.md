# ADR-003: Dual Data Loading — Bundled Auto-Load and User Upload

## Status
Accepted

## Date
2026-02-11

## Context
The application needs to support two deployment contexts:

1. **Development** — CSV data files exist on the local filesystem (`src/data/`), already `.gitignore`-d so they never reach the remote repo. The developer expects data to load automatically on `vite dev` without manual upload.
2. **Production (GitHub Pages)** — CSV files are not in the repo and not in the build output. The user must upload them at runtime.

ADR-002 established the pattern for user upload: module-scope variables with a boolean state flag to trigger re-render. The question is how to support both auto-load and upload from a single codebase on a single branch.

## Decision
**Use a Vite environment variable (`VITE_BUNDLE_DATA`) to gate auto-loading of bundled CSVs. Support user upload in all builds.**

- `.env.development` sets `VITE_BUNDLE_DATA=true`
- `.env.production` sets `VITE_BUNDLE_DATA=false`
- On mount, if the env flag is true, a dynamic `import()` loads the `?raw` CSV modules and parses them into module-scope variables. The `dataLoaded` flag is set to true.
- If the env flag is false (or the dynamic import fails), the app renders an upload screen.
- The upload screen uses the same parse functions and writes to the same module-scope variables.
- Once `dataLoaded` is true, the app renders identically regardless of how data arrived.

### Data flow

```
App mounts
├── VITE_BUNDLE_DATA=true → dynamic import ?raw CSVs → parse → module scope → setDataLoaded(true)
└── VITE_BUNDLE_DATA=false → render UploadScreen
                                 └── user selects files → parse → module scope → setDataLoaded(true)
                                     └── App re-renders with data
```

## Rationale
- **Single branch, single codebase.** No branch divergence between dev and prod. Vite's built-in env file system handles the split at build time.
- **No data leakage.** CSVs are in `.gitignore`. The `?raw` imports are gated behind `VITE_BUNDLE_DATA`, which is false in production builds. Even if someone ran `vite build` locally, the production env flag prevents the dynamic import from executing, so CSV contents are not embedded in the bundle.
- **Shared parse logic.** Both paths use the same `parseNodes` / `parseEdges` functions. No duplication.
- **Consistent with ADR-002.** Module-scope storage with a boolean re-render flag. The only addition is the auto-load path.

## Trade-offs
- **Data loading becomes async in dev.** The current synchronous module-scope calls (`loadNodes()`, `loadEdges()` at import time) are replaced by a `useEffect` with dynamic `import()`. This introduces a brief frame where `dataLoaded` is false, even in dev. Imperceptible in practice but a structural change from the current pattern.
- **Dynamic imports are less transparent.** The `?raw` imports move from static top-level imports (visible in the module graph) to runtime dynamic imports inside an effect. Vite still resolves them correctly, but they're less obvious when reading the code.
- **Build configuration responsibility.** The env files must be kept in sync with intent. Misconfiguring `.env.production` to `true` would attempt to bundle CSVs that don't exist in the production build, causing a build or runtime error.
