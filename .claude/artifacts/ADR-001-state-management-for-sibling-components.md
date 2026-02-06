# ADR-001: State Management for Sibling Components

## Status
Accepted

## Date
2026-02-06

## Context
The application has two sibling components beneath `App`: `MapCanvas` (user selects edges on the map) and a planned `Calculator` component (displays selected edge values and totals). Both need access to shared selection state.

Three approaches were considered:

1. **Lift state to App (Option A)** — App owns the state and passes props to both children.
2. **React Context with a provider wrapper (Option B)** — A `SelectionProvider` owns the state; both siblings consume via `useContext`.
3. **State inside MapCanvas, exposed via Context (rejected)** — MapCanvas owns state and pushes it into Context for Calculator to read.

## Decision
**Option A: Lift state to App.**

```
App (owns selectedEdges state)
├── MapCanvas (receives state + onSelect callback)
└── Calculator (receives state, computes totals)
```

## Rationale
- Both consumers are direct children of App — there is no prop drilling problem to solve.
- Lifting state is the simplest idiomatic React pattern for sibling communication.
- Context adds ceremony (provider, custom hook, separate file) with no practical benefit at this depth.
- Option C was rejected outright: placing state inside a child component while exposing it via Context conflates UI rendering with state ownership and creates an awkward provider/consumer relationship.

## Trade-offs
- If the component tree deepens significantly (e.g. Calculator has nested sub-components that also need selection data), prop drilling could become cumbersome.
- In that case, refactoring to Option B (Context) is straightforward: move state from App into a `SelectionProvider` and swap props for `useContext` calls.

## Fallback
**Option B** remains a viable upgrade path. Refactoring cost is low — the state shape and handlers stay the same; only the delivery mechanism changes from props to Context.
