# Task model

## Conceptual model

**Verified:** A task has three conceptual parts:

- **Identity:** a way to distinguish one task from another.
- **User-visible content:** the information shown to the user for the task.
- **Canonical status:** one of `todo`, `in_progress`, or `done`.

**Source:** approved task contract; [MVP data and interaction contract](decisions/mvp-data-and-interaction-contract.md).

## Lifecycle

**Verified:** Tasks are created in To Do, can move between the three statuses, and can be deleted.

**Source:** README.md; approved task contract.

## Concrete schema

**Verified:** A serialized task has exactly `id`, `title`, `status`, and `createdAt`. Titles are trimmed and must be 1-120 characters; statuses are canonical; identifiers are non-empty envelope-unique strings; and timestamps are valid ISO-8601 UTC strings that parse to finite instants. Ordering is `createdAt` descending, then serialized `id` lexical descending. See [MVP data and interaction contract](decisions/mvp-data-and-interaction-contract.md) for the complete validation and generation contract.

**Source:** approved task contract.

## Status vocabulary

**Verified:** The stable canonical status values are exactly `todo`, `in_progress`, and `done`. User-facing labels may be To Do, In Progress, and Done.

**Source:** approved task contract; README.md.
