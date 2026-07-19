# Architecture

## Verified boundary

**Verified:** The documented product boundary is a browser task board with three columns and browser `localStorage` persistence. No backend is included in the documented scope.

**Source:** README.md.

## Conceptual flow

**Planned:** A user action creates a task with canonical status `todo`; a status action changes that status to `todo`, `in_progress`, or `done`; a delete action removes the task. The current status determines the column in which the task is shown.

**Source:** approved task contract; README.md.

## Planned client boundary

**Planned:** The browser client will be implemented with React and TypeScript. It will render the task board and keep task persistence within browser `localStorage`; it does not introduce a backend, API, account, or synchronization boundary.

**Source:** [ADR 0001: Planned implementation stack](decisions/0001-planned-implementation-stack.md); README.md.

## Not established

**Unknown:** The repository does not establish module structure, component boundaries, event mechanism, state-management library, persistence adapter, or error-handling strategy.

**Source:** repository inspection.

**Verified:** No implementation or configuration should be inferred from this document.

**Source:** repository inspection; approved task contract.
