# Development

## Current state

**Verified:** The repository contains no application implementation, configuration, build, dependency, or backend files. Therefore there is no verified development workflow.

**Source:** repository inspection.

## Commands

**Verified:** No install, run, build, test, lint, format, or deployment commands are documented or discoverable in the inspected repository.

**Source:** repository inspection.

## Planned tooling guidance

**Planned:** Future implementation will use pnpm to manage dependencies, TypeScript with React for the client, and Vite for local development and production builds.

**Planned:** Once package configuration is added, its scripts should expose the project’s install, development, build, and test workflows. This documentation does not assert command names or that any commands currently work.

**Planned:** Future test setup will use Vitest and React Testing Library for automated application tests, with Playwright providing end-to-end coverage.

**Source:** [ADR 0001: Planned implementation stack](decisions/0001-planned-implementation-stack.md).

## Change guidance

**Planned:** Any future implementation should preserve the three stable statuses, create tasks in `todo`, support status changes and deletion, and keep persistence within browser `localStorage` unless an approved task changes that boundary.

**Source:** approved task contract; README.md.

## Documentation language

**Verified:** Documentation produced for this task is English UTF-8. No localization catalogs are added.

**Source:** approved task contract.
