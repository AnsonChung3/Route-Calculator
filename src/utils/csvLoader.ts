import Papa from 'papaparse';
import nodesRaw from '../data/nodes.csv?raw';
import type { Node } from '../types';

interface NodeRow {
    id: string;
    Name2: string;
    Latitude: string;
    Longitude: string;
}

export function loadNodes(): Node[] {
    const { data } = Papa.parse<NodeRow>(nodesRaw, {
        header: true,
        skipEmptyLines: true,
    });

    return data.map((row) => ({
        id: Number(row.id),
        name: row.Name2,
        latitude: Number(row.Latitude),
        longitude: Number(row.Longitude),
    }));
}
