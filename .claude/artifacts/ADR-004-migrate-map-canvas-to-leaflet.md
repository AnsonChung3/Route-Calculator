# ADR-004: Migrate MapCanvas from SVG/DOM Rendering to Leaflet

## Status
Proposed

## Date
2026-02-12

## Context
The current `MapCanvas` renders the UK node/edge graph using SVG lines for edges and absolutely-positioned `<div>` elements for nodes, all inside a fixed 800x800 pixel container. This approach has several limitations:

- **No geographic context.** The map is a bare coordinate plot with no roads, coastline, or place names. For a driving game companion tool, the absence of real-world geography undermines the core use case.
- **Naive projection.** `coordinates.ts` performs a linear mapping from WGS84 lat/lng to pixel coordinates. This ignores the Web Mercator projection used by all standard web maps, producing visible distortion across the UK's latitude range.
- **No zoom or pan.** The 800x800 container is fixed. `react-zoom-pan-pinch` is listed in `package.json` (v3.7.0, ~13 KB gzipped) but is never imported anywhere in the source tree -- it is a dead dependency.
- **Fixed layout.** The pixel dimensions (`width`, `height`) are threaded through `MapCanvasProps` and into `createVisualNodes`. Changing the container size requires recalculating all node positions.

The `MapCanvas` component has a clean, purely presentational props interface. All selection state lives in `App.tsx` (per ADR-001), meaning the rendering internals can be swapped without upstream changes.

## Decision
Replace the `MapCanvas` rendering internals with **react-leaflet v4+** wrapping **Leaflet**.

### Specific changes

1. **Install `leaflet` and `react-leaflet`; add `@types/leaflet` as a dev dependency.**
2. **Remove `react-zoom-pan-pinch`** from dependencies (unused).
3. **Rewrite `MapCanvas.tsx`** to render a `<MapContainer>` with a `<TileLayer>` using a dark tile provider (Carto Dark Matter) to match the app's existing dark theme. The component will continue to accept the same props contract (`nodes`, `edges`, `selectedEdgeKeys`, `eligibleEdgeKeys`, `onToggleEdge`). The `width` and `height` props can be removed or ignored in favour of CSS-driven sizing, but the interface change is optional and can be deferred.
4. **Rewrite `Node.tsx`** as a Leaflet `CircleMarker` (or `Marker` with custom icon) placed at each node's `[latitude, longitude]`. Leaflet handles projection.
5. **Rewrite `Edge.tsx`** as a Leaflet `Polyline` between endpoint coordinates, with a `Tooltip` or custom overlay for the value label. Edge labels should be hidden below a zoom threshold to avoid clutter.
6. **Delete `coordinates.ts`** and the `CanvasNode` type from `src/types/index.ts`. The pixel-coordinate pipeline is no longer needed.
7. **Import Leaflet CSS** in the application entry point (or in `MapCanvas.tsx`).
8. **No changes to upstream consumers.** `App.tsx`, `RoutePanel`, `routeUtils`, `tierEval`, `csvLoader`, and `tiers` remain untouched.

### Dependency justification

| Criterion | Assessment |
|---|---|
| Problem solved | Real map tiles, correct projection, built-in zoom/pan, touch support |
| Existing alternative | `react-zoom-pan-pinch` provides zoom/pan but no tiles or projection; it is also currently unused |
| Maintenance | Leaflet: stable, ~40k GitHub stars, actively maintained. react-leaflet v4: stable, well-adopted |
| Licence | BSD-2-Clause (Leaflet), ISC (react-leaflet) -- compatible |
| Bundle impact | +~35 KB gzipped (leaflet + react-leaflet), minus ~13 KB (react-zoom-pan-pinch removal). Net: ~+22 KB |
| Community | De facto standard for interactive web maps in React |

## Rationale
- **Geographic context is a core requirement**, not a nice-to-have. Players are selecting driving routes across the UK; seeing roads and coastline directly supports decision-making.
- **Net simplification.** Despite adding two dependencies, the change deletes `coordinates.ts`, the `CanvasNode` type, the `buildPositionLookup` and `resolveEdgePositions` helper functions, and the manual pixel-coordinate pipeline. Leaflet subsumes all of this.
- **Correct projection out of the box.** No custom maths to maintain.
- **Foundation for future enhancements.** Road-snapped routing (e.g. OSRM), location search, and layer controls become straightforward with Leaflet's plugin ecosystem. These are not planned now but the migration removes the barrier.

## Trade-offs

### Positive
- Real map tiles with roads, coastline, and place names.
- Built-in zoom, pan, and touch/pinch support.
- Correct Web Mercator projection.
- Removes dead dependency (`react-zoom-pan-pinch`).

### Negative / Risks
- **Bundle size.** Net ~22 KB gzipped increase. Acceptable for a tool of this nature.
- **Edge label clutter.** At low zoom levels, value labels on edges will overlap. Mitigation: hide labels below a zoom threshold using Leaflet's `zoom` event or react-leaflet's `useMapEvents`.
- **Leaflet CSS is required.** Forgetting to import `leaflet/dist/leaflet.css` causes broken rendering with no obvious error. This is a known footgun; a comment in the import should suffice.
- **Tile provider usage policies.** Carto Dark Matter is free for personal/low-traffic use. Fine for this tool; would need review if usage scaled.
- **SSR incompatibility.** Leaflet accesses `window` at import time. This is not an issue with the current Vite client-only setup, but would block any future move to SSR or static-site generation. Given the app's nature (interactive map tool), SSR is unlikely to be relevant.

## Affected Files

| Action | File |
|---|---|
| Rewrite | `src/components/MapCanvas.tsx` |
| Rewrite | `src/components/Node.tsx` |
| Rewrite | `src/components/Edge.tsx` |
| Delete | `src/utils/coordinates.ts` |
| Delete (type only) | `CanvasNode` from `src/types/index.ts` |
| Add import | `leaflet/dist/leaflet.css` (entry point or MapCanvas) |
| Remove dep | `react-zoom-pan-pinch` from `package.json` |
| Add deps | `leaflet`, `react-leaflet`, `@types/leaflet` |
| No change | `App.tsx`, `RoutePanel`, `routeUtils`, `tierEval`, `csvLoader`, `tiers` |
