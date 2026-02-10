import type { Route, RouteCategory, TierName, TierEvaluation } from '../types';
import { getTiersForCategory } from '../data/tiers';
import { getRouteTotal } from './routeUtils';

export function countSpecialNodes(nodeSequence: string[], specialNodeNames: Set<string>): number {
    return nodeSequence.filter((name) => specialNodeNames.has(name)).length;
}

export function evaluateRoute(
    route: Route,
    category: RouteCategory,
    targetTier: TierName,
    specialNodeNames: Set<string>,
): TierEvaluation {
    const tiers = getTiersForCategory(category);
    const tier = tiers.find((t) => t.name === targetTier)!;

    const edgeCount = route.edges.length;
    const total = getRouteTotal(route);
    const specialNodeCount = countSpecialNodes(route.nodeSequence, specialNodeNames);

    const edgeCountMet = edgeCount >= tier.edgeCount.min
        && (tier.edgeCount.max === null || edgeCount <= tier.edgeCount.max);
    const totalMet = total >= tier.pointRange.min && total <= tier.pointRange.max;
    const specialNodesMet = specialNodeCount >= tier.minSpecialNodes;

    return {
        edgeCount,
        total,
        specialNodeCount,
        constraints: { edgeCountMet, totalMet, specialNodesMet },
        allMet: edgeCountMet && totalMet && specialNodesMet,
    };
}
