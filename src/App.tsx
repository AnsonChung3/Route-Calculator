import { useState, useCallback, useMemo, useEffect } from 'react';
import './styles/App.css';
import MapCanvas from './components/MapCanvas';
import RoutePanel from './components/RoutePanel';
import { parseEdges, parseNodes } from './utils/csvLoader';
import * as routeUtils from './utils/routeUtils';
import { evaluateRoute } from './utils/tierEval';
import { getTiersForCategory } from './data/tiers';
import type { Node, Edge, Route, RouteCategory, TierName } from './types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

// Module-scope data storage (per ADR-002). Populated once via auto-load or
// user upload, then never mutated. React doesn't track these — only the
// dataLoaded flag triggers re-render.
let nodes: Node[] = [];
let edges: Edge[] = [];

function App() {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [route, setRoute] = useState<Route>(routeUtils.createEmptyRoute);
    const [category, setCategory] = useState<RouteCategory>('short');
    const [targetTier, setTargetTier] = useState<TierName>('chrome');

    useEffect(() => {
        if (import.meta.env.VITE_BUNDLE_DATA !== 'true') return;

        Promise.all([
            import('./data/nodes.csv?raw'),
            import('./data/edges.csv?raw'),
        ]).then(([nodesMod, edgesMod]) => {
            nodes = parseNodes(nodesMod.default);
            edges = parseEdges(edgesMod.default);
            setDataLoaded(true);
        });
    }, []);

    const handleChangeCategory = useCallback((cat: RouteCategory) => {
        setCategory(cat);
        setTargetTier(getTiersForCategory(cat)[0].name);
    }, []);

    const handleEdgeClick = useCallback((edgeKey: string) => {
        setRoute((prev) => toggleEdgeInRoute(prev, edgeKey));
    }, []);

    // Referential stability: preserves Set identity when route hasn't changed,
    // preventing unnecessary MapCanvas re-renders from category/tier toggles.
    const selectedEdgeKeys = useMemo(
        () => new Set(route.edges.map(routeUtils.getEdgeKey)),
        [route],
    );

    const eligibleEdgeKeys = useMemo(
        () => buildEligibleSet(route),
        [route],
    );

    // Static data: nodes never change, so compute once and cache permanently.
    const specialNodeNames = useMemo(
        () => new Set(nodes.filter((n) => n.special).map((n) => n.town)),
        [],
    );

    // Recomputes on route/category/tier changes; skips redundant work when
    // unrelated state updates trigger a re-render.
    const tierEvaluation = useMemo(
        () => evaluateRoute(route, category, targetTier, specialNodeNames),
        [route, category, targetTier, specialNodeNames],
    );

    if (!dataLoaded) {
        return <div className="container"><p className="text-content-muted">Loading data…</p></div>;
    }

    return (
        <div className="container">
            <h1 className="text-4xl font-bold mb-8">Route Calculator</h1>
            <div className="flex flex-row items-stretch gap-4">
                <MapCanvas
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    nodes={nodes}
                    edges={edges}
                    selectedEdgeKeys={selectedEdgeKeys}
                    eligibleEdgeKeys={eligibleEdgeKeys}
                    onToggleEdge={handleEdgeClick}
                />
                <RoutePanel
                    route={route}
                    category={category}
                    targetTier={targetTier}
                    tierEvaluation={tierEvaluation}
                    onChangeCategory={handleChangeCategory}
                    onChangeTargetTier={setTargetTier}
                />
            </div>
        </div>
    );
}

/** Returns the set of edge keys that are currently eligible for add or remove. */
function buildEligibleSet(route: Route): Set<string> {
    const keys = new Set<string>();
    for (const edge of edges) {
        const key = routeUtils.getEdgeKey(edge);
        if (routeUtils.canAddEdge(route, edge) || routeUtils.canRemoveEdge(route, key)) {
            keys.add(key);
        }
    }
    return keys;
}

/** Applies add/remove logic for a clicked edge against the current route. */
function toggleEdgeInRoute(route: Route, edgeKey: string): Route {
    const edge = edges.find((e) => routeUtils.getEdgeKey(e) === edgeKey);
    if (!edge) return route;

    const isInRoute = route.edges.some((e) => routeUtils.getEdgeKey(e) === edgeKey);

    if (isInRoute && routeUtils.canRemoveEdge(route, edgeKey)) {
        return routeUtils.removeEdge(route, edgeKey);
    }
    if (!isInRoute && routeUtils.canAddEdge(route, edge)) {
        return routeUtils.addEdge(route, edge);
    }
    return route;
}

export default App;
