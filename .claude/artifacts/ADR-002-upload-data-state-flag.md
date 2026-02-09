# ADR-002: Module-Scope Data with Boolean State Flag for User Upload

## Status
Accepted

## Date
2026-02-06

## Context
The application is moving from build-time bundled CSV data (via Vite `?raw` imports) to user-uploaded CSV data at runtime, to support hosting on GitHub Pages without shipping game data in the repository.

Node and edge data is static once loaded — it does not mutate after parsing and rendering. The only interactive state is edge selection (covered by ADR-001). The question was whether uploaded data needs to live in `useState`.

## Decision
**Keep parsed data in module-scope variables. Use a single `useState<boolean>` flag to trigger re-render after upload.**

```
// Module scope — plain variables, not React state
let nodes: VisualNode[] = [];
let edges: ResolvedEdge[] = [];

function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  function handleUpload(rawNodes, rawEdges) {
    nodes = parseAndProcess(rawNodes);
    edges = parseAndProcess(rawEdges);
    setDataLoaded(true);
  }

  if (!dataLoaded) return <UploadView onUpload={handleUpload} />;
  return <MapCanvas nodes={nodes} edges={edges} />;
}
```

## Rationale
- Node and edge data is immutable after upload — it has no reason to be reactive state.
- The only problem `useState` solves here is **timing**: React must re-render once data becomes available. A boolean flag is sufficient for that.
- Putting large arrays into `useState` would create unnecessary overhead: React would track them for changes that never come, and each `setState` call would create a new reference even though the data is identical.
- Module-scope variables match the current pattern established when data was bundled at build time.

## Trade-offs
- Module-scope variables sit outside React's lifecycle. If the app ever needed to support re-uploading different data within the same session, the flag would need to be reset and components would need to react to the new data. This is a minor refactor if needed.
- The pattern is slightly unconventional — most React tutorials would reach for `useState` by default. A brief comment in the code explaining the choice is worthwhile.
