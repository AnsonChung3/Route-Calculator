interface EdgeProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    value: number;
    selected: boolean;
    edgeKey: string;
    onClick: (edgeKey: string) => void;
}

/**
 * Renders an edge as an SVG group: a visible line whose stroke colour and
 * width change with selection state, a midpoint value label, and a wider
 * invisible hit-area line on top for reliable click targets.
 */
export default function Edge({ x1, y1, x2, y2, value, selected, edgeKey, onClick }: EdgeProps) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return (
        <g onClick={() => onClick(edgeKey)} className="cursor-pointer">
            <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={selected ? 'var(--color-accent-500)' : 'var(--color-neutral-600)'}
                strokeWidth={selected ? 2.5 : 1}
            />
            <text
                x={midX} y={midY}
                textAnchor="middle"
                dy="-0.4em"
                className="text-[10px] fill-neutral-400 pointer-events-none select-none"
            >
                {value}
            </text>
            <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="transparent"
                strokeWidth={14}
            />
        </g>
    );
}
