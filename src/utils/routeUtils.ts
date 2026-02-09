// Pure utility functions for manipulating the ordered Route model.
//
// - Construction:  createEmptyRoute, getEdgeKey
// - Accessors:     getHead, getTail, getRouteTotal
// - Mutation guards: canAddEdge, canRemoveEdge
// - Immutable transforms: addEdge, removeEdge

import type { Edge, Route } from '../types';

export function createEmptyRoute(): Route {
    return { edges: [], nodeSequence: [] };
}

export function getEdgeKey(edge: Edge): string {
    return `${edge.from}-${edge.to}`;
}

export function getHead(route: Route): string | null {
    return route.nodeSequence[0] ?? null;
}

export function getTail(route: Route): string | null {
    return route.nodeSequence[route.nodeSequence.length - 1] ?? null;
}

export function getRouteTotal(route: Route): number {
    return route.edges.reduce((sum, edge) => sum + edge.value, 0);
}

export function canAddEdge(route: Route, edge: Edge): boolean {
    if (route.edges.length === 0) return true;

    const head = getHead(route)!;
    const tail = getTail(route)!;
    const nodes = new Set(route.nodeSequence);

    const endpoints = [edge.from, edge.to];

    // Check tail connection: one endpoint matches tail, the other is new
    if (endpoints.includes(tail)) {
        const other = edge.from === tail ? edge.to : edge.from;
        if (!nodes.has(other)) return true;
    }

    // Check head connection: one endpoint matches head, the other is new
    if (endpoints.includes(head)) {
        const other = edge.from === head ? edge.to : edge.from;
        if (!nodes.has(other)) return true;
    }

    return false;
}

export function addEdge(route: Route, edge: Edge): Route {
    if (route.edges.length === 0) {
        return {
            edges: [edge],
            nodeSequence: [edge.from, edge.to],
        };
    }

    const head = getHead(route)!;
    const tail = getTail(route)!;

    // Try appending at tail
    if (edge.from === tail) {
        return {
            edges: [...route.edges, edge],
            nodeSequence: [...route.nodeSequence, edge.to],
        };
    }
    if (edge.to === tail) {
        return {
            edges: [...route.edges, edge],
            nodeSequence: [...route.nodeSequence, edge.from],
        };
    }

    // Try prepending at head
    if (edge.to === head) {
        return {
            edges: [edge, ...route.edges],
            nodeSequence: [edge.from, ...route.nodeSequence],
        };
    }
    if (edge.from === head) {
        return {
            edges: [edge, ...route.edges],
            nodeSequence: [edge.to, ...route.nodeSequence],
        };
    }

    return route;
}

export function canRemoveEdge(route: Route, edgeKey: string): boolean {
    if (route.edges.length === 0) return false;

    const firstKey = getEdgeKey(route.edges[0]);
    const lastKey = getEdgeKey(route.edges[route.edges.length - 1]);

    return edgeKey === firstKey || edgeKey === lastKey;
}

export function removeEdge(route: Route, edgeKey: string): Route {
    if (route.edges.length === 0) return route;

    const firstKey = getEdgeKey(route.edges[0]);
    const lastKey = getEdgeKey(route.edges[route.edges.length - 1]);

    if (route.edges.length === 1 && edgeKey === firstKey) {
        return createEmptyRoute();
    }

    if (edgeKey === firstKey) {
        return {
            edges: route.edges.slice(1),
            nodeSequence: route.nodeSequence.slice(1),
        };
    }

    if (edgeKey === lastKey) {
        return {
            edges: route.edges.slice(0, -1),
            nodeSequence: route.nodeSequence.slice(0, -1),
        };
    }

    return route;
}
