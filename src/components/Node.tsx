interface NodeProps {
    x: number;
    y: number;
    town: string;
    special: boolean;
}

export default function Node({ x, y, town, special }: NodeProps) {
    return (
        <div
            className={`absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                special
                    ? 'bg-success-500 ring-2 ring-success-500/50'
                    : 'bg-accent-500'
            }`}
            style={{ left: x, top: y }}
            title={town}
        />
    );
}
