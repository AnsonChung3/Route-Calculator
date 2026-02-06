import Node from './Node';
import { createVisualNodes } from '../utils/coordinates';
import { loadNodes } from '../utils/csvLoader';

interface MapCanvasProps {
    width: number;
    height: number;
}

const nodes = loadNodes();

export default function MapCanvas({ width, height }: MapCanvasProps) {
    const canvasNodes = createVisualNodes(nodes, width, height);

    return (
        <div
            className="relative border border-neutral-700 rounded-lg"
            style={{ width, height }}
        >
            {canvasNodes.map((node) => (
                <Node key={node.id} x={node.x} y={node.y} town={node.town} />
            ))}
        </div>
    );
}
