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

## Phase 4B: Tiered Award System

### Game rules

Players declare a route category and a target tier before/during route building. Both are easy to change at any time.

**Short route tiers:**

| Tier   | Edge count | Point range |
|--------|-----------|-------------|
| Chrome | 4 edges   | 120–175     |
| Bronze | min 7     | 180–220     |
| Silver | min 10    | 225–285     |
| Gold   | min 12    | 290–326     |

**Long route tiers:**

| Tier         | Edge count  | Special nodes | Point range  |
|--------------|------------|---------------|--------------|
| Bronze       | min 12     | min 1         | 300–395      |
| Silver       | min 16     | min 1         | 400–495      |
| Gold         | min 20     | min 1         | 500–540      |
| Special Gold | exactly 22 | min 2         | exactly 540  |
| Platinum     | exactly 23 | min 2         | exactly 560  |

Point ranges have intentional gaps between tiers. Some edge counts are exact, others are minimums. "Special nodes" are a subset of map nodes flagged in the data.

### User declarations

`category: RouteCategory` (`'short'` | `'long'`) and `targetTier: TierName` live in App state, separate from `Route`. Declarations are a lens for evaluation, not a constraint on construction — changing them never clears or invalidates the route. When `category` changes, `targetTier` resets to the first tier in the new category's list.

### Data flow

App owns all state. Derived values (`specialNodeNames`, `tierEvaluation`) are computed via `useMemo`. RoutePanel receives declarations, evaluation result, and change callbacks as props. Data flows down, events flow up — no shared context or side effects.

### Special nodes

`special: boolean` is a data attribute on `Node`, parsed from the CSV. It plays no role in route construction (`canAddEdge`/`addEdge` are unaware of it). A `Set<string>` of special node names is derived once from loaded nodes and passed to the evaluation function, which counts how many route nodes are in the set.

### Implementation

Detailed plan with per-commit breakdown: `.claude/work-sessions/2026-02-10_phase-4b-tiered-award-system.md`

- [ ] Extend `Node` with `special: boolean`; update CSV and loader
- [ ] Add tier types to `src/types/index.ts`; define tier config in `src/data/tiers.ts`
- [ ] Create `src/utils/tierEval.ts` — pure `evaluateRoute()` and `countSpecialNodes()`
- [ ] Wire `category`, `targetTier`, and derived evaluation into App state; pass to RoutePanel
- [ ] Add declaration controls and constraint status display in RoutePanel

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
- [ ] Add hover states and selection feedback styling
- [ ] Responsive layout adjustments
- [ ] Test route building and score calculation edge cases

## Known bugs & UX issue

- [ ] Edges are set pairs. When new leg is added to the beginning/end of the array, shown legs reads weird.
