# Simple Task Board

Simple Task Board is a small Kanban-style task board organized into three columns:

- **To Do** — tasks that have not been started.
- **In Progress** — tasks currently being worked on.
- **Done** — completed tasks.

## Core behavior

- Create a task and place it in the **To Do** column.
- Move tasks between the three columns as their status changes.
- Delete tasks when they are no longer needed.
- Persist tasks in the browser's `localStorage` so they remain available after the page is reloaded in the same browser.

## Out of scope

The project does not include accounts, collaboration, deadlines, notifications, or a backend.
