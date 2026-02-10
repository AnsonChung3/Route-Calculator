import Papa from 'papaparse';
import nodesRaw from '../data/nodes.csv?raw';
import edgesRaw from '../data/edges.csv?raw';
import type { Node, Edge } from '../types';

interface NodeRow {
    ID: string;
    Town: string;
    Latitude: string;
    Longitude: string;
    Postcode: string;
    Address: string;
    Notes: string;
    Special: string;
}

interface EdgeRow {
    ID: string;
    From: string;
    To: string;
    Value: string;
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
        special: row.Special === '1',
    }));
}

export function loadEdges(): Edge[] {
    const { data } = Papa.parse<EdgeRow>(edgesRaw, {
        header: true,
        skipEmptyLines: true,
    });

    return data.map((row) => ({
        from: row.From,
        to: row.To,
        value: Number(row.Value),
    }));
}
