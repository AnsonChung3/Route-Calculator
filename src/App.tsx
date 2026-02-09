import { useState, useCallback } from 'react';
import './styles/App.css';
import MapCanvas from './components/MapCanvas';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

function App() {
    const [selectedEdgeKeys, setSelectedEdgeKeys] = useState<Set<string>>(new Set());

    const handleToggleEdge = useCallback((edgeKey: string) => {
        setSelectedEdgeKeys((prev) => {
            const next = new Set(prev);
            if (next.has(edgeKey)) {
                next.delete(edgeKey);
            } else {
                next.add(edgeKey);
            }
            return next;
        });
    }, []);

    return (
        <div className="container">
            <h1 className="text-4xl font-bold mb-8">Route Calculator</h1>
            <MapCanvas
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                selectedEdgeKeys={selectedEdgeKeys}
                onToggleEdge={handleToggleEdge}
            />
        </div>
    );
}

export default App;
