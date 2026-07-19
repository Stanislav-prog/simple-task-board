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

## Unrecorded decisions

**Unknown:** Concrete dependencies, tool versions and configuration, task schema, validation, ordering, serialization, storage key, backend, authentication, and deployment decisions have not been made or are not present in the repository.

**Source:** repository inspection; approved task contract.
