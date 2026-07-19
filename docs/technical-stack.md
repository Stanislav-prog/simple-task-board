# Technical stack

## Implemented stack

- TypeScript and React for the browser client.
- pnpm for dependency management.
- Vite for development and production builds.
- Vitest and React Testing Library for unit and UI tests.
- Playwright with Chromium for browser-level end-to-end coverage.
- Browser `localStorage` for persistence.

Exact dependency resolutions are recorded in `pnpm-lock.yaml`.

## Runtime baseline

The development toolchain requires Node.js 20.19+ or 22.12+ as required by
Vite 7. The application targets modern browsers that provide
`crypto.randomUUID()` and `localStorage`. No identifier fallback is required
for this baseline.

`localStorage` can still be unavailable because of browser privacy,
permissions, or quota conditions; the application remains usable in memory and
shows a warning in those cases.
