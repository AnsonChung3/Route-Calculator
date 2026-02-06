interface NodeProps {
    x: number;
    y: number;
    town: string;
}

export default function Node({ x, y, town }: NodeProps) {
    return (
        <div
            className="absolute w-2.5 h-2.5 rounded-full bg-accent-500 -translate-x-1/2 -translate-y-1/2"
            style={{ left: x, top: y }}
            title={town}
        />
    );
}
