import * as types from '../types';
import * as routeUtils from '../utils/routeUtils';
import { getTiersForCategory } from '../data/tiers';

const TIER_LABELS: Record<types.TierName, string> = {
    chrome: 'Chrome',
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    specialGold: 'Special Gold',
    platinum: 'Platinum',
};

interface RoutePanelProps {
    route: types.Route;
    category: types.RouteCategory;
    targetTier: types.TierName;
    tierEvaluation: types.TierEvaluation;
    onChangeCategory: (cat: types.RouteCategory) => void;
    onChangeTargetTier: (tier: types.TierName) => void;
}

export default function RoutePanel({
    route,
    category,
    targetTier,
    tierEvaluation,
    onChangeCategory,
    onChangeTargetTier,
}: RoutePanelProps) {
    const total = routeUtils.getRouteTotal(route);
    const head = routeUtils.getHead(route);
    const tail = routeUtils.getTail(route);
    const edgeCount = route.edges.length;
    const tiers = getTiersForCategory(category);
    const tierDef = tiers.find((t) => t.name === targetTier)!;

    return (
        <div className="border-2 border-accent-600 rounded-lg bg-surface-raised p-4 overflow-y-auto min-w-[320px]">
            {/* Declaration controls */}
            <div className="mb-4 space-y-3">
                <div className="flex gap-1">
                    {(['short', 'long'] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onChangeCategory(cat)}
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                category === cat
                                    ? 'bg-accent-600 text-surface-base'
                                    : 'bg-surface-overlay text-content-muted hover:text-content-base'
                            }`}
                        >
                            {cat === 'short' ? 'Short' : 'Long'}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-1">
                    {tiers.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => onChangeTargetTier(t.name)}
                            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                                targetTier === t.name
                                    ? 'bg-accent-600 text-surface-base'
                                    : 'bg-surface-overlay text-content-muted hover:text-content-base'
                            }`}
                        >
                            {TIER_LABELS[t.name]}
                        </button>
                    ))}
                </div>
            </div>

            <h2 className="text-lg font-bold mb-4 text-content-base">Selected Edges</h2>

            {edgeCount === 0 ? (
                <p className="text-content-faint">No edges selected</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-content-muted border-b border-neutral-700">
                            <th className="text-left py-1 pr-2">#</th>
                            <th className="text-left py-1 pr-2">Edge</th>
                            <th className="text-right py-1 pr-2">Value</th>
                            <th className="text-right py-1 pr-2">Total</th>
                            <th className="text-right py-1">End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {route.edges.map((_, i) => (
                            <EdgeRow
                                key={i}
                                index={i}
                                route={route}
                                edgeCount={edgeCount}
                            />
                        ))}
                    </tbody>
                </table>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-700 text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-content-muted">Total value</span>
                    <span className="text-accent-400 font-bold">{total}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-content-muted">Edges</span>
                    <span className="text-content-base">{edgeCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-content-muted">Head</span>
                    <span className="text-content-base">{head ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-content-muted">Tail</span>
                    <span className="text-content-base">{tail ?? '—'}</span>
                </div>
            </div>

            {/* Tier status */}
            <div className="mt-6 pt-4 border-t border-neutral-700 text-sm space-y-2">
                <h3 className="font-bold text-content-base">
                    Tier Status: {TIER_LABELS[targetTier]}
                </h3>
                <ConstraintRow
                    label="Edges"
                    current={tierEvaluation.edgeCount}
                    requirement={formatEdgeRequirement(tierDef)}
                    met={tierEvaluation.constraints.edgeCountMet}
                />
                <ConstraintRow
                    label="Points"
                    current={tierEvaluation.total}
                    requirement={formatPointRequirement(tierDef)}
                    met={tierEvaluation.constraints.totalMet}
                />
                {tierDef.minSpecialNodes > 0 && (
                    <ConstraintRow
                        label="Special nodes"
                        current={tierEvaluation.specialNodeCount}
                        requirement={`min ${tierDef.minSpecialNodes}`}
                        met={tierEvaluation.constraints.specialNodesMet}
                    />
                )}
                <div className={`mt-2 pt-2 border-t border-neutral-700 font-bold ${
                    tierEvaluation.allMet ? 'text-success-500' : 'text-content-muted'
                }`}>
                    {tierEvaluation.allMet ? 'All constraints met' : 'Constraints not met'}
                </div>
            </div>
        </div>
    );
}

/** Renders a single row in the selected edges table with position, endpoints, value, running total, and head/tail label. */
function EdgeRow({ index, route, edgeCount }: { index: number; route: types.Route; edgeCount: number }) {
    const from = route.nodeSequence[index];
    const to = route.nodeSequence[index + 1];
    const value = route.edges[index].value;
    const runningTotal = route.edges
        .slice(0, index + 1)
        .reduce((sum, e) => sum + e.value, 0);
    const endLabel = edgeCount === 1
        ? 'Head / Tail'
        : index === 0
            ? 'Head'
            : index === edgeCount - 1
                ? 'Tail'
                : '';

    return (
        <tr className="border-b border-neutral-700/50">
            <td className="py-1 pr-2 text-content-muted">{index + 1}</td>
            <td className="py-1 pr-2 text-content-base">{from} → {to}</td>
            <td className="py-1 pr-2 text-right text-content-base">{value}</td>
            <td className="py-1 pr-2 text-right text-accent-400">{runningTotal}</td>
            <td className="py-1 text-right text-content-faint text-xs">{endLabel}</td>
        </tr>
    );
}

function ConstraintRow({ label, current, requirement, met }: {
    label: string;
    current: number;
    requirement: string;
    met: boolean;
}) {
    return (
        <div className="flex justify-between">
            <span className="text-content-muted">{label}</span>
            <span className={met ? 'text-success-500' : 'text-error-500'}>
                {current} / {requirement}
            </span>
        </div>
    );
}

function formatEdgeRequirement(tier: types.TierDefinition): string {
    if (tier.edgeCount.max === null) return `min ${tier.edgeCount.min}`;
    if (tier.edgeCount.min === tier.edgeCount.max) return `${tier.edgeCount.min}`;
    return `${tier.edgeCount.min}–${tier.edgeCount.max}`;
}

function formatPointRequirement(tier: types.TierDefinition): string {
    if (tier.pointRange.min === tier.pointRange.max) return `${tier.pointRange.min}`;
    return `${tier.pointRange.min}–${tier.pointRange.max}`;
}
