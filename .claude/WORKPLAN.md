# Route Calculator - Work Plan

## Phase 1: Project Setup & Configuration

- [ ] Configure Tailwind CSS with Vite (follow official guide)
- [x] Install remaining dependencies (`react-zoom-pan-pinch`, `papaparse`, `@types/papaparse`)
- [ ] Add UK outline SVG to `public/` folder

## Phase 2: Foundation

- [ ] Create type definitions (`src/types/index.ts`) - `Node`, `Edge`, `Tier`, and state interfaces
- [ ] Create CSV loader utility (`src/utils/csvLoader.ts`) - PapaParse wrapper
- [x] Create sample data files (`src/data/nodes.csv`, `src/data/edges.csv`) - UK locations and routes

## Phase 3: Core Components

- [ ] Create Node component (`src/components/Node.tsx`) - Clickable location button positioned on map
- [ ] Create Edge component (`src/components/Edge.tsx`) - SVG line between nodes with value label, selectable
- [ ] Create ScorePanel component (`src/components/ScorePanel.tsx`) - Running total, selected routes, tier display

## Phase 4: Main Container & State

- [ ] Create Map component (`src/components/Map.tsx`) - Container with zoom/pan, renders nodes and edges
- [ ] Wire up App.tsx - Load data, render Map and ScorePanel, manage state with `useReducer`

## Phase 5: Polish & Features

- [ ] Implement tier rewards system - Configure tiers (targets + stop limits), display qualification
- [ ] Add styling refinements - Selection feedback, hover states, responsive layout
- [ ] Testing & edge cases - Validate route building logic, score calculation
