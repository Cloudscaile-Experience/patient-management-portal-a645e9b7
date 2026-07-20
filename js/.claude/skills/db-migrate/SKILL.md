---
name: db-migrate
description: Run Drizzle Kit commands to manage PostgreSQL schema migrations. Use when asked to run migrations, push schema changes, open Drizzle Studio, or generate migration files.
disable-model-invocation: true
allowed-tools: Bash(npm run db:*) Bash(npx drizzle-kit *)
---

This project uses **Drizzle Kit** for schema management. All table definitions live in `src/db/schema/`.

## Development — push schema directly (no migration files)

Best for rapid local iteration:

```bash
npm run db:push
```

## Production workflow — generate then apply

Step 1: Generate SQL migration files from schema changes:

```bash
npm run db:generate
```

Migration files are written to `drizzle/migrations/`.

Step 2: Apply pending migrations to the database:

```bash
npm run db:migrate
```

## Open Drizzle Studio (visual DB browser)

```bash
npm run db:studio
```

## Notes

- Ensure `PG_HOST`, `PG_PORT`, `PG_USERNAME`, `PG_PASSWORD`, and `PG_DB` are set in `.env` before running any DB commands.
- Never edit generated files in `drizzle/migrations/` manually.
- Schema changes must be exported through `src/db/schema/index.ts` to be picked up by Drizzle Kit.
- Use `db:push` in development only — always use generate → migrate for staging/production.
