import { useState, useCallback, useMemo } from 'react';
import './styles/App.css';
import MapCanvas from './components/MapCanvas';
import { loadEdges } from './utils/csvLoader';
import * as routeUtils from './utils/routeUtils';
import type { Route } from './types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

const edges = loadEdges();

function App() {
    const [route, setRoute] = useState<Route>(routeUtils.createEmptyRoute);

    const handleEdgeClick = useCallback((edgeKey: string) => {
        setRoute((prev) => toggleEdgeInRoute(prev, edgeKey));
    }, []);

    const selectedEdgeKeys = useMemo(
        () => new Set(route.edges.map(routeUtils.getEdgeKey)),
        [route],
    );

    const eligibleEdgeKeys = useMemo(
        () => buildEligibleSet(route),
        [route],
    );

    return (
        <div className="container">
            <h1 className="text-4xl font-bold mb-8">Route Calculator</h1>
            <div className="flex flex-row items-stretch gap-4">
                <MapCanvas
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    edges={edges}
                    selectedEdgeKeys={selectedEdgeKeys}
                    eligibleEdgeKeys={eligibleEdgeKeys}
                    onToggleEdge={handleEdgeClick}
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
