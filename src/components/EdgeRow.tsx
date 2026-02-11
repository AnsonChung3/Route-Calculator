import * as types from '../types';

/** Renders a single row in the selected edges table with position, endpoints, value, running total, and head/tail label. */
export default function EdgeRow({ index, route, edgeCount }: { index: number; route: types.Route; edgeCount: number }) {
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
