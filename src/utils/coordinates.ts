import type { Node, CanvasNode } from '../types';

export function createVisualNodes(
    nodes: Node[],
    width: number,
    height: number,
    padding = 40,
): CanvasNode[] {
    const lats = nodes.map((n) => n.latitude);
    const lons = nodes.map((n) => n.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const latRange = maxLat - minLat;
    const lonRange = maxLon - minLon;

    const drawWidth = width - 2 * padding;
    const drawHeight = height - 2 * padding;

    return nodes.map((node) => ({
        ...node,
        x: padding + ((node.longitude - minLon) / lonRange) * drawWidth,
        y: padding + ((maxLat - node.latitude) / latRange) * drawHeight,
    }));
}
