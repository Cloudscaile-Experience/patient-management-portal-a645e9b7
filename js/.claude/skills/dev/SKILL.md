---
name: dev
description: Start the Fastify development server with hot-reload. Use when asked to start the server, run the app locally, or launch the dev environment.
disable-model-invocation: true
allowed-tools: Bash(npm run dev)
---

Start the development server with hot-reload via `tsx watch`:

```bash
npm run dev
```

TypeScript is compiled on-the-fly — no build step needed. The server restarts automatically on file changes.

## Default URLs

| Resource       | URL                                   |
| -------------- | ------------------------------------- |
| API Base       | `http://localhost:8000/v1`            |
| Health Check   | `http://localhost:8000/open/health`   |
| Swagger UI     | `http://localhost:8000/open/docs`     |
| Swagger JSON   | `http://localhost:8000/open/docs/json`|
| Swagger YAML   | `http://localhost:8000/open/docs/yaml`|

## Prerequisites

- Copy `.env.example` to `.env` and fill in the values.
- `PG_HOST`, `PG_PORT`, `PG_USERNAME`, `PG_PASSWORD`, and `PG_DB` must be set to point to a running PostgreSQL instance.
- `JWT_SECRET` must be set (any non-empty string in development).
- Use `NODE_ENV=development` to enable `pino-pretty` log formatting.
