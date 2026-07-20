# Patient Management Portal — Backend

## Project Overview

TypeScript REST API built with Fastify, Drizzle ORM, and Biome. Follows a module-based layered architecture optimised for maintainability and type safety.

## Tech Stack

| Tool                                       | Purpose                                                    |
| ------------------------------------------ | ---------------------------------------------------------- |
| **Fastify v5**                             | Web framework — schema-validated, TypeScript-first         |
| **Drizzle ORM**                            | Type-safe PostgreSQL ORM with migration support            |
| **Biome**                                  | Unified linter + formatter (replaces ESLint + Prettier)    |
| **TypeBox**                                | JSON Schema + TypeScript type generation for route schemas |
| **Vitest**                                 | Test runner and assertion library                          |
| **@fastify/swagger + @fastify/swagger-ui** | OpenAPI 3.0 docs served at `/docs`                         |
| **@fastify/jwt**                           | JWT authentication                                         |
| **@fastify/helmet**                        | Security headers                                           |
| **@fastify/rate-limit**                    | Rate limiting                                              |
| **Pino**                                   | Structured logging (built into Fastify)                    |

## Project Structure

```
src/
├── app.ts                          # Fastify instance, plugin registration, hooks
├── server.ts                       # Entry point — binds port and starts listening
├── config/
│   └── env.ts                      # Typed env config — validates at startup, throws on missing vars
├── db/
│   ├── index.ts                    # Drizzle client + pg Pool
│   └── schema/
│       ├── index.ts                # Schema barrel export
│       └── patients.ts             # pgTable definitions for patients domain
├── plugins/
│   ├── db.ts                       # Registers Drizzle as fastify.db decorator (uses fastify-plugin)
│   └── swagger.ts                  # Registers @fastify/swagger + @fastify/swagger-ui
├── hooks/
│   └── auth.ts                     # JWT verification hook — attach to routes as onRequest
├── modules/
│   └── [domain]/
│       ├── [domain].routes.ts      # Route plugin — registers typed routes on FastifyInstance
│       ├── [domain].controller.ts  # Thin HTTP handlers — extract typed request → call service → send reply
│       ├── [domain].service.ts     # Business logic + Drizzle queries (no HTTP types)
│       └── [domain].schema.ts      # TypeBox schemas for body, params, querystring, response
└── types/
    └── index.ts                    # Shared FastifyInstance type augmentations
```

## Architecture Rules

### Layered Architecture

- **Routes** (`*.routes.ts`): Export a Fastify plugin. Call `fastify.route()`. No business logic.
- **Controllers** (`*.controller.ts`): Extract typed request data, call the service, return reply. No DB access.
- **Services** (`*.service.ts`): All business logic and Drizzle ORM queries. No `FastifyRequest`/`FastifyReply` types.
- **Schemas** (`*.schema.ts`): TypeBox schemas used as both JSON Schema (Fastify validation/serialisation) and TypeScript types via `Static<typeof Schema>`.

### Plugin Architecture

- Register third-party plugins in `src/app.ts` before feature modules.
- Feature modules register as Fastify plugins via `fastify.register()` — they are **encapsulated** (no `fastify-plugin`).
- Use `fastify-plugin` (`fp`) only when a plugin must expose decorators to the parent scope (e.g., `fastify.db`, `fastify.authenticate`).
- Plugin registration order: security plugins → db → swagger → auth hooks → feature modules.

### App vs Server Separation

- `src/app.ts` builds and returns the Fastify instance. It NEVER calls `fastify.listen()`.
- `src/server.ts` imports `buildApp()` and calls `fastify.listen()`.
- This allows test files to import `buildApp()` without binding a port.

## Fastify Conventions

### Route Schemas (TypeBox)

Every route MUST define an explicit TypeBox schema. This drives both runtime validation and OpenAPI docs:

```typescript
import { Type, Static } from "@sinclair/typebox";

const CreatePatientBody = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
  dateOfBirth: Type.String({ format: "date" }),
  email: Type.String({ format: "email" }),
});
type CreatePatientBody = Static<typeof CreatePatientBody>;
```

### Typed Route Handlers

Use Fastify's generic interface to type request body, params, querystring, and reply:

```typescript
fastify.post<{ Body: CreatePatientBody; Reply: PatientResponse }>(
  "/patients",
  { schema: { body: CreatePatientBody, response: { 201: PatientResponse } } },
  controller.create,
);
```

### Error Handling

- Set a global error handler in `app.ts` via `fastify.setErrorHandler()` to format all errors consistently.
- Throw HTTP errors using `fastify.httpErrors` (from `@fastify/sensible`) or set `reply.status(code).send({ message })`.
- Fastify catches async handler rejections automatically — no try/catch wrapper needed for standard errors.
- Never let a generic `Error` propagate to the client with a stack trace.

### Logging

- Fastify integrates Pino. Use `request.log.info()` inside handlers and `fastify.log.info()` at app level.
- Never use `console.log()` — it bypasses structured logging.
- Use `pino-pretty` in development (`NODE_ENV=development`), JSON in production.

### Swagger Documentation

- Every route schema MUST include `description`, `summary`, and `tags` for Swagger.
- All public/open routes use the `/open/` prefix — no auth required.
- Swagger UI: `/open/docs` · OpenAPI JSON: `/open/docs/json` · Health: `/open/health`.
- Register `@fastify/swagger` before all routes in `src/plugins/swagger.ts`.

## Drizzle ORM Conventions

### Schema Definition

- Define tables in `src/db/schema/[domain].ts` using `pgTable` from `drizzle-orm/pg-core`.
- Export all tables through `src/db/schema/index.ts` (barrel export).
- Column naming: `snake_case` in DB, accessed via camelCase in TypeScript (Drizzle maps automatically).

```typescript
export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Query Patterns

- Access `db` through `fastify.db` decorator (registered by `src/plugins/db.ts`).
- Import `eq`, `and`, `or`, `desc`, `asc` from `drizzle-orm` for conditions.
- Use `.returning()` after insert/update to get back the created/updated row.
- Always pass the `db` instance into service functions — services must not import the db singleton directly.

```typescript
// insert
const [patient] = await db.insert(patients).values(data).returning();
// select with condition
const patient = await db.select().from(patients).where(eq(patients.id, id));
// update
await db.update(patients).set({ name }).where(eq(patients.id, id)).returning();
// delete
await db.delete(patients).where(eq(patients.id, id));
```

### Migrations

- Migration files live in `drizzle/migrations/`.
- Development: use `npm run db:push` for rapid schema iteration (no migration files).
- Production: use `npm run db:generate` then `npm run db:migrate`.

## TypeScript Standards

- **Strict mode** is enabled — no implicit `any`.
- Use `unknown` for external/unvalidated data; narrow with type guards before use.
- `const` by default. `let` only when reassignment is required.
- `camelCase` for variables and functions. `PascalCase` for types, interfaces, and classes.
- Use early returns (guard clauses) to reduce nesting depth.
- `async/await` exclusively — no `.then()/.catch()` chains.

## Biome (Linting & Formatting)

Biome is the single tool for linting and formatting. It replaces ESLint and Prettier.

- Config lives in `biome.json` at project root.
- `npm run check` — lint + format check (CI gate).
- `npm run check:fix` — apply all safe auto-fixes.
- Biome enforces: no unused variables, no `console.log`, consistent imports, trailing commas, double quotes, tabs for indentation.
- CI pipeline must pass `biome ci` before merging any branch.

## API & Security Standards

### RESTful Design

- URLs use kebab-case nouns: `/v1/patients`, `/v1/patients/:id/appointments`.
- No verbs in paths — use HTTP method semantics.
- Collection endpoints return paginated responses: `{ data: T[], total: number, page: number, pageSize: number }`.
- Standard HTTP status codes: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.

### Security

- Helmet: enabled for all routes by default.
- Rate limiting: applied globally and tightened on auth endpoints.
- JWT: validate using `fastify.authenticate` hook on protected routes via `onRequest`.
- Input: TypeBox schemas enforce type, format, and constraints at the framework level before handlers execute.

## Testing Standards

### Framework

- **Vitest** as test runner and assertion library (Jest-compatible API).
- Use Fastify's built-in `fastify.inject()` for HTTP testing — no Supertest needed.
- Import `buildApp()` from `src/app.ts` to create a test instance without binding a port.

```typescript
const app = await buildApp();
const response = await app.inject({ method: "GET", url: "/v1/patients" });
expect(response.statusCode).toBe(200);
```

### Structure

- Test files: `src/modules/[domain]/__tests__/[domain].test.ts`.
- Follow **Arrange-Act-Assert (AAA)** in every test.
- Mock services in route/controller tests using `vi.mock()`. Unit-test services against a real test DB.
- Descriptive names: `it('should return 404 when patient id does not exist', ...)`.

## Development Commands

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start dev server with `tsx --watch` |
| `npm run build`         | Compile TypeScript to `dist/`       |
| `npm start`             | Run compiled output                 |
| `npm run check`         | Biome lint + format check           |
| `npm run check:fix`     | Biome lint + format with auto-fix   |
| `npm test`              | Run Vitest test suite               |
| `npm run test:coverage` | Run tests with V8 coverage          |
| `npm run db:generate`   | Generate Drizzle migration files    |
| `npm run db:migrate`    | Apply pending migrations            |
| `npm run db:push`       | Push schema directly — dev only     |
| `npm run db:studio`     | Open Drizzle Studio                 |
