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

    return (
        <div className="container">
            <h1 className="text-4xl font-bold mb-8">Route Calculator</h1>
            <MapCanvas
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                edges={edges}
                selectedEdgeKeys={selectedEdgeKeys}
                onToggleEdge={handleEdgeClick}
            />
        </div>
    );
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
