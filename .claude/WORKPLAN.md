# Route Calculator - Work Plan

## Phase 1: Project Setup & Configuration

- [x] Configure Tailwind CSS with Vite (follow official guide)
- [x] Install remaining dependencies (`react-zoom-pan-pinch`, `papaparse`, `@types/papaparse`)

## Phase 2: Node Display Prototype

- [x] Create `Node` type definition (`src/types/index.ts`)
- [x] Create sample data files (`src/data/nodes.csv`, `src/data/edges.csv`)
- [x] Create CSV loader utility (`src/utils/csvLoader.ts`)
- [x] Create coordinate conversion utility (`src/utils/coordinates.ts`) - lat/long to canvas x/y
- [x] Create MapCanvas component (`src/components/MapCanvas.tsx`) - empty square container
- [x] Create Node component (`src/components/Node.tsx`) - basic styled dot/marker
- [x] Wire up App.tsx - load nodes, convert coordinates, render on canvas

## Phase 3: Edge Display & Selection

- [ ] Add `Edge` type definition to `src/types/index.ts`
- [ ] Create Edge component (`src/components/Edge.tsx`) - SVG line between two points with value label
- [ ] Load edge data from CSV in App.tsx
- [ ] Connect edges to node positions (lookup by name)
- [ ] Render edges on MapCanvas
- [ ] Add selection state for edges (click to toggle, track in App state)
- [ ] Style selected vs unselected edges differently (colour/thickness)

## Phase 4: MVP Completion

- [ ] Calculate sum of selected edge values
- [ ] Display running total on screen
- [ ] Add clear/reset selection button
- [ ] Show list of currently selected routes
- [ ] Verify full flow works: load data → display map → select edges → see updated total
- [ ] Code QA and refactoring — extract hardcoded magic numbers into named constants or configuration; general cleanup and structural improvements

## Phase 5: Polish & Features

- [ ] Add UK outline SVG to `public/` and display as map background
- [ ] Integrate `react-zoom-pan-pinch` for pan/zoom
- [ ] Create ScorePanel component - display selected routes and running total
- [ ] Add `Tier` type definition and tier configuration data
- [ ] Implement tier calculation logic (check target met, stop count valid)
- [ ] Display tier qualification status in ScorePanel
- [ ] Add hover states and selection feedback styling
- [ ] Responsive layout adjustments
- [ ] Test route building and score calculation edge cases
