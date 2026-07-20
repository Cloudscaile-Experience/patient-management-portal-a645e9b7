---
name: run-tests
description: Run the Vitest test suite for the Fastify TypeScript project. Use when asked to run tests, check test coverage, or verify a feature works.
disable-model-invocation: true
allowed-tools: Bash(npm test) Bash(npm run test:*) Bash(npx vitest *)
---

This project uses **Vitest** with Fastify's built-in `fastify.inject()` — no Supertest needed.

## Run all tests

```bash
npm test
```

## Watch mode (during development)

```bash
npm run test:watch
```

## Run a specific test file

```bash
npx vitest run src/modules/patients/__tests__/patients.test.ts
```

## Run tests matching a name pattern

```bash
npx vitest run -t "should return 404"
```

## Run with V8 coverage report

```bash
npm run test:coverage
```

Coverage output lands in `coverage/`.

## Notes

- Test files live at `src/modules/[domain]/__tests__/[domain].test.ts`
- Import `buildApp` from `@/app.js` — never import from `@/server.ts` (binds a port)
- Mock services with `vi.mock("@/modules/[domain]/[domain].service.js")`
- Always call `await app.close()` in `afterAll` to release the Fastify instance
