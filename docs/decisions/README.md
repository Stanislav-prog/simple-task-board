# Architecture decisions

**Verified:** This directory records approved decisions.

**Source:** repository inspection; approved task contract.

## Current decisions

### Local browser persistence

**Verified:** The project boundary uses browser `localStorage` for task persistence and does not include a backend.

**Source:** README.md.

### Stable statuses

**Verified:** The canonical status vocabulary is `todo`, `in_progress`, and `done`.

**Source:** approved task contract.

### Planned implementation stack

**Planned:** [ADR 0001: Planned implementation stack](0001-planned-implementation-stack.md) approves TypeScript, React, pnpm, Vite, Vitest, React Testing Library, and Playwright for future implementation. It does not establish that these tools are configured or in use.

**Source:** ADR 0001.

### MVP data and interaction contract

**Verified:** The approved task schema, validation, deterministic ordering, keyboard interaction and focus behavior, and local-storage recovery contract are recorded in [MVP data and interaction contract](mvp-data-and-interaction-contract.md).

**Source:** approved task contract.

## Unrecorded decisions

**Unknown:** Concrete dependencies, tool versions and configuration, backend, authentication, and deployment decisions have not been made or are not present in the repository. The concrete MVP task schema, validation, ordering, serialization, and storage key are defined in [MVP data and interaction contract](mvp-data-and-interaction-contract.md).

**Source:** repository inspection; approved task contract.
