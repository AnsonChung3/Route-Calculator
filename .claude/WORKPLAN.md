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

- [x] Add `Edge` type definition to `src/types/index.ts`
- [x] Create Edge component (`src/components/Edge.tsx`) - SVG line between two points with value label
- [x] Load edge data from CSV in App.tsx
- [x] Connect edges to node positions (lookup by name)
- [x] Render edges on MapCanvas
- [x] Add selection state for edges (click to toggle, track in App state)
- [x] Style selected vs unselected edges differently (colour/thickness)

## Phase 4: Route Logic & Constraints

- [ ] Define Route type (ordered edge list with head/tail tracking)
- [ ] Implement route state management (replace unordered Set with ordered model)
- [ ] Implement edge eligibility logic (which edges can legally be selected next)
- [ ] Enforce continuity rule: selected edge must connect to head or tail of current route
- [ ] Enforce no-repeat-node rule: reject edges whose other node is already in the route
- [ ] Implement constrained deselection (only allow removing from route ends)
- [ ] Calculate and expose sum of selected edge values
- [ ] Visual feedback: distinguish eligible vs ineligible edges on the map

## Phase 5: MVP Completion

- [ ] Display running total on screen
- [ ] Add clear/reset selection button
- [ ] Show list of currently selected routes (ordered)
- [ ] Verify full flow works: load data → display map → select edges → see updated total
- [ ] Code QA and refactoring — extract hardcoded magic numbers into named constants or configuration; general cleanup and structural improvements

## Phase 6: Polish & Features

- [ ] Add UK outline SVG to `public/` and display as map background
- [ ] Integrate `react-zoom-pan-pinch` for pan/zoom
- [ ] Create ScorePanel component - display selected routes and running total
- [ ] Add `Tier` type definition and tier configuration data
- [ ] Implement tier calculation logic (check target met, stop count valid)
- [ ] Display tier qualification status in ScorePanel
- [ ] Add hover states and selection feedback styling
- [ ] Responsive layout adjustments
- [ ] Test route building and score calculation edge cases
