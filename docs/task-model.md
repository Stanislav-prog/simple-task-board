# Task model

## Conceptual model

**Planned:** A task has three conceptual parts:

- **Identity:** a way to distinguish one task from another.
- **User-visible content:** the information shown to the user for the task.
- **Canonical status:** one of `todo`, `in_progress`, or `done`.

**Source:** approved task contract.

## Lifecycle

**Verified:** Tasks are created in To Do, can move between the three statuses, and can be deleted.

**Source:** README.md; approved task contract.

## Concrete schema

**Unknown:** Concrete field names, identifier type and generation, required fields, validation constraints, maximum lengths, ordering rules, serialization shape, and storage keys are not verified. No implementation or schema files are present.

**Source:** repository inspection; approved task contract.

## Status vocabulary

**Verified:** The stable canonical status values are exactly `todo`, `in_progress`, and `done`. User-facing labels may be To Do, In Progress, and Done.

**Source:** approved task contract; README.md.
