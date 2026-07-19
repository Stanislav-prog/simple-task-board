# Project overview

## Purpose

**Verified:** The project is a small Kanban-style task board organized around To Do, In Progress, and Done columns.

**Source:** README.md.

## User-visible behavior

**Verified:** A user can create a task in To Do, move it between the three columns as its status changes, and delete it. Tasks remain available after a page reload in the same browser through `localStorage`. The approved data, interaction, and recovery details are in [MVP data and interaction contract](decisions/mvp-data-and-interaction-contract.md).

**Source:** README.md.

## Boundaries

**Verified:** The documented scope excludes accounts, collaboration, deadlines, notifications, and a backend. The repository also has no implementation or configuration files from which additional behavior can be verified.

**Source:** README.md; repository inspection.

## Repository baseline

**Verified:** At the beginning of this task, README.md was the only project file present. No implementation, configuration, build, dependency, or backend files existed. The nine approved documentation files are documentation outputs, not evidence of an application implementation.

**Source:** repository inspection; approved task contract.

## Defined MVP contract

**Verified:** The concrete task fields, validation rules, ordering behavior, serialization format, storage key, and interaction/focus rules are defined in [MVP data and interaction contract](decisions/mvp-data-and-interaction-contract.md). Runtime technology remains undecided.

**Source:** approved task contract.
