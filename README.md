# Simple Task Board

Simple Task Board is a browser-only Kanban-style board with three stable
statuses: `todo`, `in_progress`, and `done`.

The responsive React application lets users create tasks in To Do, move tasks
with explicit controls, delete tasks, and retain valid task data in the same
browser through `localStorage`. It has no accounts, collaboration, deadlines,
notifications, backend, or drag-and-drop interaction.

## Development

Prerequisites:

- Node.js 20.19+ or 22.12+
- pnpm 10

Install and start the development server:

```sh
pnpm install
pnpm dev
```

Run verification:

```sh
pnpm typecheck
pnpm test --run
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

The Playwright browser installation is a one-time requirement on a new
development machine.

## Documentation

- [Project overview](docs/project-overview.md)
- [Architecture](docs/architecture.md)
- [Technical stack](docs/technical-stack.md)
- [Development](docs/development.md)
- [State and persistence](docs/state-and-persistence.md)
- [Task model](docs/task-model.md)
- [Backend](docs/backend.md)
- [Architecture decisions](docs/decisions/README.md)
