export interface Node {
    id: number;
    town: string;
    latitude: number;
    longitude: number;
}

export type CanvasNode = Node & {
    x: number;
    y: number;
};
