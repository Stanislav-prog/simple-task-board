# ADR 0001: Implementation stack

**Status:** Implemented

**Date:** 2026-07-19

## Decision

The browser client is implemented in TypeScript with React. pnpm is the package
manager and Vite is the build tooling. Vitest and React Testing Library provide
automated application tests, and Playwright provides end-to-end coverage.

This decision preserves the browser-only persistence boundary: tasks remain in
browser `localStorage`, and no backend, API, account, or synchronization
capability is introduced.

## Context

The repository originally contained documentation only. Issue #6 approved the
first application vertical slice using this stack while preserving the
`localStorage` boundary and excluding a backend.

The package manifest, lockfile, application source, and test configuration now
make the selected stack verifiable.

## Rationale and tradeoffs

- TypeScript makes task and persistence contracts explicit; it adds compile-time
  and configuration overhead compared with plain JavaScript.
- React supports a small interactive task-board client with reusable UI
  boundaries.
- pnpm provides lockfile-based dependency reproducibility.
- Vite provides the development server and production build.
- Vitest and React Testing Library cover focused application behavior, while
  Playwright covers a browser-level user workflow.

## Consequences

- Implementation and configuration align with these choices unless a later
  approved decision changes them.
- Exact dependency resolutions are recorded in `pnpm-lock.yaml`; developer
  commands are recorded in `package.json` and `docs/development.md`.
- The browser baseline requires `crypto.randomUUID()`; no identifier fallback
  is implemented.
- This ADR does not change the `localStorage`/no-backend product boundary.
