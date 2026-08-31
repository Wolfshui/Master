
# Testing and CI/CD

## Test pyramid

- **Unit:** core types, manifest validation, permission evaluation, lifecycle orchestration.
- **Integration:** worker routes with D1-backed services, event publishing, migration smoke tests.
- **E2E:** Playwright flows for setup, login, dashboard navigation, and knowledge-base CRUD once the UI is wired to APIs.

## Tooling

- **Vitest** for unit and integration tests.
- **Miniflare** for worker-adjacent integration environment.
- **Playwright** for browser journeys.

## CI workflow

1. checkout
2. setup pnpm and Node 20
3. install workspace dependencies
4. run `pnpm typecheck`
5. run `pnpm lint`
6. run `pnpm test`
7. run `pnpm build`

The pipeline blocks merges on type, lint, or test failures and should later add artifact publishing for module packages.
