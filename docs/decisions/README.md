# Architecture decisions

This directory records approved decisions.

## Current decisions

### Local browser persistence

The project uses browser `localStorage` for task persistence and does not
include a backend.

### Stable statuses

The canonical status vocabulary is `todo`, `in_progress`, and `done`.

### Implementation stack

[ADR 0001: Implementation stack](0001-planned-implementation-stack.md) records
the implemented TypeScript, React, pnpm, Vite, Vitest, React Testing Library,
and Playwright stack.

### MVP data and interaction contract

The approved task schema, validation, deterministic ordering, keyboard
interaction and focus behavior, and local-storage recovery contract are
recorded in
[MVP data and interaction contract](mvp-data-and-interaction-contract.md).

## Remaining undecided areas

Deployment, backend, authentication, and synchronization decisions have not
been made and remain outside the MVP boundary. Concrete dependencies and tool
configuration are present in the repository.
