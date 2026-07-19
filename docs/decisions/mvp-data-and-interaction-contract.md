# MVP data and interaction contract

## Context

Simple Task Board is a small browser-only Kanban board. This record defines the approved, testable MVP data, interaction, accessibility, ordering, and recovery contract for its eventual implementation.

## Product boundary

- The only canonical statuses are `todo`, `in_progress`, and `done`.
- A newly created task always starts in `todo`.
- Tasks may move between canonical statuses or be deleted.
- Persistence is browser `localStorage` only. There is no backend, API, account, synchronization, or collaboration scope.

## Task data and validation

A task is serialized with exactly these required fields:

```text
{ id, title, status, createdAt }
```

No additional MVP task fields are introduced.

- `title` is trimmed before validation and storage. Its trimmed value must be 1-120 characters long. Whitespace-only, empty-after-trimming, and over-120-character titles are invalid; an invalid submission does not mutate in-memory state or storage.
- `status` must be exactly `todo`, `in_progress`, or `done`. Any non-canonical status is invalid.
- `id` must be a non-empty serialized string and must be unique within its envelope. Generate it with `crypto.randomUUID()` where available. If the eventual runtime requires a fallback, document that fallback before implementation.
- `createdAt` is created with the task as an ISO-8601 UTC timestamp string. It is valid only when it parses to a finite instant.

Every loaded task must contain all required fields with valid values. A missing, malformed, non-string, or non-unique `id` or `createdAt`, or any other invalid task field, invalidates the complete persisted envelope.

## Ordering

Within each status column, tasks are ordered newest first by parsed `createdAt` descending. Equal instants are ordered by their serialized `id` strings in descending lexical order. This ordering is deterministic across reloads and does not depend on incidental insertion order.

## Interaction and accessibility

- A valid form submission creates exactly one `todo` task when in-memory state is successfully updated.
- Use explicit move controls; drag-and-drop is not part of the MVP.
- Delete is immediate and requires no confirmation.
- Creation, moves, and deletion must be keyboard-operable. Controls and status changes must have accessible labels.
- After successful in-memory creation, clear and refocus the title input, even if the immediate storage write fails.
- After a move, retain focus on the move control that invoked it.
- After a delete, focus the next task's primary action in the same column; if none exists, focus the previous task's primary action in that column; if the column is empty, focus its empty-state/add-task control; if no such control exists, focus the title input.
- A persistence warning is visible and non-blocking, and never steals focus.

## Storage, loading, and recovery

Use the `simple-task-board:v1` key with this JSON envelope:

```text
{ version: 1, tasks: Task[] }
```

The serialized envelope contains `"version": 1` and a `"tasks"` array of task objects. Loading validates the envelope and every task.

- Malformed JSON, a non-object or malformed envelope, a version other than `1`, a non-array `tasks` value, or any invalid task recovers to a valid empty v1 state.
- When storage is available, recovery overwrites the bad local value with the valid empty v1 state.
- Never salvage valid-looking tasks from a partially invalid envelope; one invalid task rejects the entire envelope.
- A `localStorage` read exception or unavailable storage also starts a usable empty in-memory v1 state and shows the same visible, non-blocking persistence warning. The board remains usable and later state changes may retry persistence.
- A write failure preserves current in-memory state, shows the visible non-blocking warning, and is retried on later state changes. Resubmission after a failed write must not duplicate the task already created in memory.

Corrupt data must not crash the board.

## Persistence limitations

`localStorage` data is local to the same browser profile and storage area. It is not shared across browsers, devices, users, or profiles, and may be unavailable or fail because of quota, privacy mode, permissions, or runtime conditions.

## Non-goals

This record does not select a framework, runtime, tooling, or implementation approach. It also excludes title editing, undo, filters, user-facing dates, notifications, accounts, synchronization, a backend/API, drag-and-drop, and migrations from a prior production schema.
