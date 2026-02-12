import Papa from 'papaparse';
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

export function parseNodes(raw: string): Node[] {
    const { data } = Papa.parse<NodeRow>(raw, {
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

export function parseEdges(raw: string): Edge[] {
    const { data } = Papa.parse<EdgeRow>(raw, {
        header: true,
        skipEmptyLines: true,
    });

    return data.map((row) => ({
        from: row.From,
        to: row.To,
        value: Number(row.Value),
    }));
}
