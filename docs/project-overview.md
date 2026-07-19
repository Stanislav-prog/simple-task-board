# Project overview

## Purpose

Simple Task Board is a small browser-only Kanban board organized around To Do,
In Progress, and Done columns.

## User-visible behavior

A user can create a task in To Do, move it between the three columns, and
delete it. Tasks remain available after a page reload in the same browser
through `localStorage`. The approved data, interaction, and recovery details
are in [MVP data and interaction contract](decisions/mvp-data-and-interaction-contract.md).

## Boundaries

The implemented scope excludes accounts, collaboration, deadlines,
notifications, title editing, undo, filters, drag-and-drop, and a backend.

## Implemented vertical slice

The repository contains a React and TypeScript browser client, Vite and pnpm
configuration, Vitest and React Testing Library coverage, and a Playwright
end-to-end flow.

The implementation follows the concrete task fields, validation rules,
ordering behavior, serialization format, storage key, and interaction/focus
rules defined in the MVP contract.
