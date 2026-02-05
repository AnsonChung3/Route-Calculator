import type { ReactNode } from 'react';

interface MapCanvasProps {
    width: number;
    height: number;
    children: ReactNode;
}

export default function MapCanvas({ width, height, children }: MapCanvasProps) {
    return (
        <div
            className="relative border border-neutral-700 rounded-lg"
            style={{ width, height }}
        >
            {children}
        </div>
    );
}
