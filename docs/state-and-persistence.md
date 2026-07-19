# State and persistence

## State boundary

Tasks persist in the browser's `localStorage` so they remain available after a
page reload in the same browser. There is no backend boundary. Persistence is
limited to the same browser profile and storage area; it is not shared across
browsers, devices, users, or profiles.

## State transitions

- A new task starts with status `todo`.
- A task may move among `todo`, `in_progress`, and `done`.
- Deletion removes the task from the board and its persisted client-side state.

## Persistence contract

The implemented key is `simple-task-board:v1`; the envelope is
`{ version: 1, tasks: Task[] }`; and every task is validated before loading.
Malformed JSON, invalid envelopes or versions, invalid task collections, and
partially invalid envelopes recover as an empty v1 state and overwrite bad
storage when available.

Read unavailability and write failures preserve a usable in-memory state and
show a non-blocking warning. A later state change retries persistence. See
[MVP data and interaction contract](decisions/mvp-data-and-interaction-contract.md)
for the complete rules.

## Boundary rule

The implementation preserves a local browser storage/no-backend boundary. It
does not define a server, API, database, authentication, account, or
synchronization behavior.
