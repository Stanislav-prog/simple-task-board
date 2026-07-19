# State and persistence

## State boundary

**Verified:** Tasks are documented as persisting in the browser's `localStorage` so they remain available after a page reload in the same browser. There is no backend boundary in the current scope.

**Source:** README.md.

## Conceptual state transitions

**Planned:**

- A new task starts with status `todo`.
- A task may move among `todo`, `in_progress`, and `done`.
- Deletion removes the task from the board and its persisted client-side state.

**Source:** approved task contract; README.md.

## Unspecified persistence details

**Unknown:** The storage key, serialization format, schema versioning, migration behavior, malformed-data handling, quota handling, synchronization behavior, and ordering persistence are not verified.

**Source:** repository inspection.

## Boundary rule

**Verified:** This documentation preserves a local browser storage/no-backend boundary. It does not define a server, API, database, authentication, account, or synchronization behavior.

**Source:** README.md; approved task contract.
