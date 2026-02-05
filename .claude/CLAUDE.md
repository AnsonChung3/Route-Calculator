# Route Calculator - Project Instructions

## Project Overview

A companion tool for a driving game challenge. Players select routes between UK locations, each with assigned point values, aiming to maximise their score within node/edge limits to unlock tiered rewards.

## Personal Goal

This project is being developed almost entirely through LLM-assisted coding, with minimal manual code intervention. It serves as both a practical experiment in AI-augmented development workflows and a portfolio piece demonstrating my ability to leverage modern tools to ship a functional, polished product efficiently.

## Tech Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- react-zoom-pan-pinch
- PapaParse (CSV import)

## Code Conventions

<!-- Add project-specific conventions here -->

## File Structure Notes

- `src/components/` - React components
- `src/data/` - CSV data files (nodes, edges)
- `src/types/` - TypeScript interfaces
- `src/utils/` - Utility functions

## Data Format

Nodes: `id, name, latitude, longitude` (WGS84 decimal degrees)
Edges: `from, to, value` (from/to are location names)

## Testing

<!-- Add testing instructions here -->

## Build & Deploy

<!-- Add deployment notes here -->
