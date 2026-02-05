export interface Node {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export type CanvasNode = Node & {
    x: number;
    y: number;
};
