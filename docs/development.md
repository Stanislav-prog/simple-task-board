# Development

## Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm 10

The repository records the pnpm release in `package.json`.

## Commands

Install dependencies:

```sh
pnpm install
```

Start the Vite development server:

```sh
pnpm dev
```

Run the TypeScript check, unit/UI suite, and production build:

```sh
pnpm typecheck
pnpm test --run
pnpm build
```

Install the Playwright Chromium runtime once on a new machine, then run the
end-to-end suite:

```sh
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm test` starts Vitest in watch mode for development. The configured
Playwright command starts and stops the Vite development server automatically.

## Documentation language

Documentation and application-owned UI copy are English UTF-8. No localization
catalogs are present.

## Scope guidance

Changes should preserve the three stable statuses, create tasks in `todo`,
support explicit status movement and immediate deletion, and keep persistence
within browser `localStorage` unless an approved task changes that boundary.
