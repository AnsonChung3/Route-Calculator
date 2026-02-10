import * as types from '../types';
import * as routeUtils from '../utils/routeUtils';

interface RoutePanelProps {
    route: types.Route;
    category: types.RouteCategory;
    targetTier: types.TierName;
    tierEvaluation: types.TierEvaluation;
    onChangeCategory: (cat: types.RouteCategory) => void;
    onChangeTargetTier: (tier: types.TierName) => void;
}

export default function RoutePanel({ route }: RoutePanelProps) {
    const total = routeUtils.getRouteTotal(route);
    const head = routeUtils.getHead(route);
    const tail = routeUtils.getTail(route);
    const edgeCount = route.edges.length;

    return (
        <div className="border-2 border-accent-600 rounded-lg bg-surface-raised p-4 overflow-y-auto min-w-[320px]">
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
