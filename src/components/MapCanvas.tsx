import Node from './Node';
import Edge from './Edge';
import { createVisualNodes } from '../utils/coordinates';
import { loadNodes } from '../utils/csvLoader';
import type { CanvasNode, Edge as EdgeType } from '../types';

interface MapCanvasProps {
    width: number;
    height: number;
    edges: EdgeType[];
    selectedEdgeKeys: Set<string>;
    onToggleEdge: (edgeKey: string) => void;
}

const nodes = loadNodes();

export default function MapCanvas({
    width,
    height,
    edges,
    selectedEdgeKeys,
    onToggleEdge,
}: MapCanvasProps) {
    const canvasNodes = createVisualNodes(nodes, width, height);
    const positionsByTown = buildPositionLookup(canvasNodes);
    const resolvedEdges = resolveEdgePositions(edges, positionsByTown);

    return (
        <div
            className="relative border border-neutral-700 rounded-lg"
            style={{ width, height }}
        >
            <svg className="absolute inset-0 w-full h-full">
                {resolvedEdges.map((edge) => (
                    <Edge
                        key={edge.edgeKey}
                        x1={edge.from.x}
                        y1={edge.from.y}
                        x2={edge.to.x}
                        y2={edge.to.y}
                        value={edge.value}
                        selected={selectedEdgeKeys.has(edge.edgeKey)}
                        edgeKey={edge.edgeKey}
                        onClick={onToggleEdge}
                    />
                ))}
            </svg>
            {canvasNodes.map((node) => (
                <Node key={node.id} x={node.x} y={node.y} town={node.town} />
            ))}
        </div>
    );
}

/** Maps town names to their canvas {x, y} coordinates for fast lookup. */
function buildPositionLookup(canvasNodes: CanvasNode[]) {
    const lookup = new Map<string, { x: number; y: number }>();
    for (const node of canvasNodes) {
        lookup.set(node.town, { x: node.x, y: node.y });
    }
    return lookup;
}

/** Pairs each edge with its resolved endpoint coordinates, dropping any edges whose towns aren't in the lookup. */
function resolveEdgePositions(
    edges: EdgeType[],
    positionsByTown: Map<string, { x: number; y: number }>,
) {
    return edges
        .map((edge) => {
            const from = positionsByTown.get(edge.from);
            const to = positionsByTown.get(edge.to);
            if (!from || !to) return null;
            return {
                edgeKey: `${edge.from}-${edge.to}`,
                value: edge.value,
                from,
                to,
            };
        })
        .filter((e) => e !== null);
}
