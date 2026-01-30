# Route Calculator

An interactive React TypeScript app that displays nodes (UK locations) and edges (routes) on a map. Users select edges to build routes and see cumulative scores, with tiered rewards based on achieving target scores within a limited number of stops.

## Features

- Interactive UK map with zoomable/pannable view
- Nodes displayed as clickable buttons at approximate geographic positions
- Edges connecting nodes with associated values
- Route selection with configurable limits per tier
- Running score calculation
- Tiered reward qualification display

## Tech Stack

| Category       | Choice                    | Purpose                       |
| -------------- | ------------------------- | ----------------------------- |
| Build Tool     | Vite                      | Fast dev server and bundling  |
| Framework      | React 18                  | UI components                 |
| Language       | TypeScript                | Type safety                   |
| Styling        | Tailwind CSS              | Utility-based CSS             |
| Zoom/Pan       | react-zoom-pan-pinch      | Map zoom and pan interactions |
| CSV Parsing    | PapaParse                 | Import nodes/edges from CSV   |
| Map Background | UK outline SVG            | Static geographic reference   |
| State          | React useState/useReducer | Selection and score tracking  |

## Project Structure

```
Route Calculator/
├── src/
│   ├── components/
│   │   ├── Map.tsx           # Main container with zoom
│   │   ├── Node.tsx          # Clickable location button
│   │   ├── Edge.tsx          # SVG line with value label
│   │   └── ScorePanel.tsx    # Running total and tier display
│   ├── data/
│   │   ├── nodes.csv         # id, name, latitude, longitude
│   │   └── edges.csv         # from, to, value
│   ├── types/
│   │   └── index.ts          # Node, Edge, Tier interfaces
│   └── utils/
│       └── csvLoader.ts      # PapaParse wrapper
├── public/
│   └── uk-outline.svg
└── config files
```

## Installation

```bash
# Install base dependencies (if not already done)
npm install

# Install additional project dependencies
npm install react-zoom-pan-pinch papaparse
npm install -D @types/papaparse tailwindcss @tailwindcss/vite
```

## Configuration

### Tailwind CSS

After installing, configure Tailwind by updating `vite.config.ts` and adding a CSS import. See [Tailwind Vite guide](https://tailwindcss.com/docs/installation/using-vite).

### Data Files

Create CSV files in `src/data/`:

**nodes.csv**

```csv
id,name,latitude,longitude
1,London,51.5074,-0.1278
2,Manchester,53.4808,-2.2426
```

**edges.csv**

```csv
from,to,value
London,Manchester,10
```

Coordinates use WGS84 decimal degrees (latitude/longitude as used by GPS).

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```
