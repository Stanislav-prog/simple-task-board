# ADR 0001: Planned implementation stack

**Status:** Planned (approved for future implementation; not yet configured or verified in repository files)

**Date:** 2026-07-19

## Decision

**Planned:** Implement the browser client in TypeScript with React. Use pnpm as the package manager and Vite as the build tooling. Use Vitest and React Testing Library for automated application tests, and Playwright for end-to-end coverage.

This decision preserves the existing browser-only persistence boundary: tasks remain in browser `localStorage`, and no backend, API, account, or synchronization capability is introduced.

## Context

**Verified:** The repository currently has documentation only: it contains no application source, package manifest, dependency lockfile, build configuration, or test configuration. The only verified technology boundary is browser `localStorage`, and the documented product excludes a backend.

The project needs an approved, coherent future implementation stack without representing it as already installed or configured.

## Rationale and tradeoffs

- TypeScript is selected to make task and persistence data contracts explicit as implementation begins; it adds compile-time and configuration overhead compared with plain JavaScript.
- React is selected for a small interactive task-board client with reusable UI boundaries; alternatives such as vanilla DOM code or another UI framework would reduce or change framework dependencies, but are not selected for this planned baseline.
- pnpm is selected for dependency management and lockfile-based reproducibility; npm and Yarn were alternatives, but are not selected for this planned baseline.
- Vite is selected for a lightweight client development and build workflow; alternatives such as a bespoke bundler configuration or another build framework are not selected.
- Vitest and React Testing Library are selected for focused automated tests of application behavior and rendered UI; Playwright is selected to cover browser-level end-to-end workflows. These tools add setup and maintenance work, but distinguish fast application tests from end-to-end coverage.

## Consequences

- Future implementation and configuration should align with these choices unless a later approved decision changes them.
- Exact package versions, scripts, browser-support policy, test scope, and tool configuration remain unspecified until implementation work defines them.
- Until package and configuration files exist, no install, development, build, or test command is verified to work.
- This ADR does not change the localStorage/no-backend product boundary or add application code.
