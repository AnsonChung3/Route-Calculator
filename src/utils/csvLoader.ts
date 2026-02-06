import Papa from 'papaparse';
import nodesRaw from '../data/nodes.csv?raw';
import type { Node } from '../types';

interface NodeRow {
    ID: string;
    Town: string;
    Latitude: string;
    Longitude: string;
    Postcode: string;
    Address: string;
    Notes: string;
}

export function loadNodes(): Node[] {
    const { data } = Papa.parse<NodeRow>(nodesRaw, {
        header: true,
        skipEmptyLines: true,
    });

    return data.map((row) => ({
        id: Number(row.ID),
        town: row.Town,
        latitude: Number(row.Latitude),
        longitude: Number(row.Longitude),
    }));
}
