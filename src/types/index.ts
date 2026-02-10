export interface Node {
    id: number;
    town: string;
    latitude: number;
    longitude: number;
    special: boolean;
}

export type CanvasNode = Node & {
    x: number;
    y: number;
};

export interface Edge {
    from: string;
    to: string;
    value: number;
}

export interface Route {
    edges: Edge[];
    nodeSequence: string[];
}
