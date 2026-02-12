import { useState, useCallback } from 'react';
import { parseNodes, parseEdges } from '../utils/csvLoader';
import type { Node, Edge } from '../types';

interface UploadScreenProps {
    onDataLoaded: (nodes: Node[], edges: Edge[]) => void;
}

export default function UploadScreen({ onDataLoaded }: UploadScreenProps) {
    const [nodesFile, setNodesFile] = useState<File | null>(null);
    const [edgesFile, setEdgesFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLoad = useCallback(() => {
        if (!nodesFile || !edgesFile) return;
        setError(null);

        Promise.all([nodesFile.text(), edgesFile.text()])
            .then(([nodesRaw, edgesRaw]) => {
                const nodes = parseNodes(nodesRaw);
                const edges = parseEdges(edgesRaw);

                if (nodes.length === 0 || edges.length === 0) {
                    setError('One or both files produced no data. Check the CSV format.');
                    return;
                }

                onDataLoaded(nodes, edges);
            })
            .catch(() => {
                setError('Failed to read files.');
            });
    }, [nodesFile, edgesFile, onDataLoaded]);

    return (
        <div className="container">
            <h1 className="text-4xl font-bold mb-8">Route Calculator</h1>
            <div className="border-2 border-accent-600 rounded-lg bg-surface-raised p-8 max-w-md space-y-6">
                <p className="text-content-muted text-sm">
                    Upload your nodes and edges CSV files to get started.
                </p>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-content-base">Nodes CSV</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setNodesFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-content-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-surface-overlay file:text-content-base hover:file:bg-neutral-600 file:cursor-pointer"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-content-base">Edges CSV</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setEdgesFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-content-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-surface-overlay file:text-content-base hover:file:bg-neutral-600 file:cursor-pointer"
                    />
                </div>

                {error && (
                    <p className="text-error-500 text-sm">{error}</p>
                )}

                <button
                    onClick={handleLoad}
                    disabled={!nodesFile || !edgesFile}
                    className="w-full px-4 py-2 text-sm font-medium rounded transition-colors bg-accent-600 text-surface-base hover:bg-accent-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Load data
                </button>
            </div>
        </div>
    );
}
