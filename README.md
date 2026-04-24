# Toll Fee Challenge

Frontend implementation for the toll fee challenge.

The project is a pnpm monorepo with:

- `packages/backend` - Express API
- `packages/frontend` - Next.js frontend
- `docs` - original assignment and test scenarios

## Requirements

- Node.js >= 20.9 (required by Next.js 16)
- pnpm >= 8

The frontend uses Next.js 16, React 19, and TanStack Query.

## Installation

```bash
pnpm install
```

## Running the Project

Start backend and frontend together:

```bash
pnpm dev
```

Services:

- Backend: http://localhost:4000
- Frontend: http://localhost:3000

Run services separately:

```bash
pnpm dev:backend
pnpm dev:frontend
```

## Build

Build all packages:

```bash
pnpm build
```

Build packages separately:

```bash
pnpm build:backend
pnpm build:frontend
```

## Tests

Run all configured tests:

```bash
pnpm test
```

Backend tests:

```bash
pnpm test:backend
```

Frontend tests:

```bash
pnpm test:frontend
```

Frontend and backend tests are both run with Vitest.

## Frontend Code Quality

ESLint and Prettier are configured only for the frontend package.

```bash
pnpm --filter toll-fee-frontend lint
pnpm --filter toll-fee-frontend lint:fix
pnpm --filter toll-fee-frontend format:check
pnpm --filter toll-fee-frontend format:fix
```

They were not added to the backend package because the work was focused on the frontend. The backend was only touched for one small fix required by the implementation.

## Project Structure

```text
packages/
  backend/     Express API
  frontend/    Next.js application

docs/
  assignment.md    Original task description
  scenarios.md     Original test scenarios
```

## Original Assignment Documents

- [Assignment](docs/assignment.md)
- [Scenarios](docs/scenarios.md)

## Submission Notes

- [Implementation notes, assumptions, tradeoffs, and next steps](docs/submission-notes.md)
