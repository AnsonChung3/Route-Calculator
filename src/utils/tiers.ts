import type { TierDefinition, RouteCategory } from '../types';

export const SHORT_TIERS: TierDefinition[] = [
    { name: 'chrome', edgeCount: { min: 4, max: 4 }, pointRange: { min: 120, max: 175 }, minSpecialNodes: 0 },
    { name: 'bronze', edgeCount: { min: 7, max: null }, pointRange: { min: 180, max: 220 }, minSpecialNodes: 0 },
    { name: 'silver', edgeCount: { min: 10, max: null }, pointRange: { min: 225, max: 285 }, minSpecialNodes: 0 },
    { name: 'gold', edgeCount: { min: 12, max: null }, pointRange: { min: 290, max: 326 }, minSpecialNodes: 0 },
];

export const LONG_TIERS: TierDefinition[] = [
    { name: 'bronze', edgeCount: { min: 12, max: null }, pointRange: { min: 300, max: 395 }, minSpecialNodes: 1 },
    { name: 'silver', edgeCount: { min: 16, max: null }, pointRange: { min: 400, max: 495 }, minSpecialNodes: 1 },
    { name: 'gold', edgeCount: { min: 20, max: null }, pointRange: { min: 500, max: 540 }, minSpecialNodes: 1 },
    { name: 'specialGold', edgeCount: { min: 22, max: 22 }, pointRange: { min: 540, max: 540 }, minSpecialNodes: 2 },
    { name: 'platinum', edgeCount: { min: 23, max: 23 }, pointRange: { min: 560, max: 560 }, minSpecialNodes: 2 },
];

export function getTiersForCategory(category: RouteCategory): TierDefinition[] {
    return category === 'short' ? SHORT_TIERS : LONG_TIERS;
}
