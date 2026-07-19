# Architecture

## Browser boundary

The product is a React and TypeScript browser client with three task columns
and `localStorage` persistence. It does not introduce a backend, API, account,
or synchronization boundary.

## State flow

A valid user action creates a task with canonical status `todo`; an explicit
move action changes that status to `todo`, `in_progress`, or `done`; and a
delete action removes the task. The current status determines the rendered
column. Every successful state change attempts to persist the full current
envelope.

The interaction, keyboard, focus, ordering, persistence, and recovery
requirements are defined in
[MVP data and interaction contract](decisions/mvp-data-and-interaction-contract.md).

## Implemented modules

- `src/task.ts` owns the exact task schema, validation, status vocabulary, and
  deterministic ordering.
- `src/persistence.ts` owns the v1 envelope, complete validation, recovery, and
  storage writes.
- `src/App.tsx` owns in-memory task state, user interactions, warning state,
  and focus management.
- React component state is sufficient for the vertical slice; no external
  state-management dependency is used.
