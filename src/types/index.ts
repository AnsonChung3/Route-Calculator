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

export type RouteCategory = 'short' | 'long';

export type TierName = 'chrome' | 'bronze' | 'silver' | 'gold' | 'specialGold' | 'platinum';

export interface TierDefinition {
    name: TierName;
    edgeCount: { min: number; max: number | null };
    pointRange: { min: number; max: number };
    minSpecialNodes: number;
}

export interface TierEvaluation {
    edgeCount: number;
    total: number;
    specialNodeCount: number;
    constraints: {
        edgeCountMet: boolean;
        totalMet: boolean;
        specialNodesMet: boolean;
    };
    allMet: boolean;
}
