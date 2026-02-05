import './styles/App.css';
import { loadNodes } from './utils/csvLoader';
import { projectNodes } from './utils/coordinates';
import MapCanvas from './components/MapCanvas';
import Node from './components/Node';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

const canvasNodes = projectNodes(loadNodes(), CANVAS_WIDTH, CANVAS_HEIGHT);

function App() {
    return (
        <div className="container">
            <h1 className="text-4xl font-bold mb-8">Route Calculator</h1>
            <MapCanvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                {canvasNodes.map((node) => (
                    <Node key={node.id} x={node.x} y={node.y} name={node.name} />
                ))}
            </MapCanvas>
        </div>
    );
}

export default App;
