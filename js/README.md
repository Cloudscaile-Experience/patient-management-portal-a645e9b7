# Patient Management Portal — API

Fastify v5 REST API for managing patient records. Backed by PostgreSQL with Drizzle ORM, validated with TypeBox, and documented with Swagger UI.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| **Fastify v5** | HTTP framework |
| **TypeScript** | Strict typing |
| **Drizzle ORM** | Type-safe PostgreSQL queries and migrations |
| **PostgreSQL 16** | Database |
| **TypeBox** | Request/response schema validation |
| **Vitest** | Unit and integration tests |
| **Biome** | Linter + formatter |
| **Docker** | Containerised database (dev) and full stack (prod) |

---

## Project structure

```
js/
├── src/
│   ├── app.ts                        # Fastify app factory (plugins + routes)
│   ├── server.ts                     # Entry point — binds and listens
│   ├── db/
│   │   ├── index.ts                  # Drizzle client singleton
│   │   ├── migrate.ts                # Migration runner
│   │   └── schema/
│   │       ├── index.ts              # Re-exports all tables
│   │       └── patients.ts           # patients table + types
│   ├── hooks/
│   │   └── auth.ts                   # JWT decode decorator (gateway validates signature)
│   ├── modules/
│   │   └── patients/
│   │       ├── patients.controller.ts  # Route handlers
│   │       ├── patients.routes.ts      # Fastify plugin — registers routes
│   │       ├── patients.schema.ts      # TypeBox schemas for req/res
│   │       ├── patients.service.ts     # Business logic + DB queries
│   │       └── __tests__/
│   │           └── patients.test.ts    # Vitest tests
│   ├── plugins/
│   │   ├── db.ts                     # Drizzle plugin
│   │   ├── env.ts                    # @fastify/env — typed config
│   │   └── swagger.ts                # @fastify/swagger + swagger-ui
│   └── types/
│       └── index.ts                  # Shared TypeScript types
├── drizzle/                          # Generated SQL migration files
├── drizzle.config.ts                 # Drizzle Kit config
├── docker-compose.yml                # Production: app + db
├── docker-compose.dev.yml            # Development: db only
├── Dockerfile                        # Multi-stage production image
├── .env.example                      # Environment variable template
├── biome.json                        # Biome config
└── package.json
```

---

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```sh
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | | `development` | `development` or `production` |
| `PORT` | | `8000` | Port the server listens on |
| `HOST` | | `0.0.0.0` | Bind address |
| `PG_HOST` | | `localhost` | PostgreSQL host |
| `PG_PORT` | | `5432` | PostgreSQL port |
| `PG_USERNAME` | Yes | — | PostgreSQL username |
| `PG_PASSWORD` | Yes | — | PostgreSQL password |
| `PG_DB` | Yes | — | PostgreSQL database name |
| `GATEWAY_BASE_URL` | | — | Optional — adds a server entry in Swagger UI |

---

## Getting started

### Local development

```sh
# 1. Start PostgreSQL
docker compose -f docker-compose.dev.yml up -d

# 2. Install dependencies
npm install

# 3. Run migrations
npm run db:migrate

# 4. Start dev server (hot-reload via tsx)
npm run dev
```

The API is available at `http://localhost:8000`.  
Swagger UI is at `http://localhost:8000/open/docs`.

### Production (Docker)

```sh
# Build and start app + database
docker compose up -d
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot-reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Test coverage report |
| `npm run check` | Biome lint + format check |
| `npm run check:fix` | Apply all Biome auto-fixes |
| `npm run db:generate` | Generate a new migration from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push schema directly to DB (dev only) |
| `npm run db:studio` | Open Drizzle Studio (visual DB browser) |

---

## API endpoints

All routes under `/v1/*` require a JWT `Authorization: Bearer <token>` header. The gateway validates the signature; this service only reads the payload.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/open/health` | Health check — no auth required |
| `GET` | `/v1/patients/` | List patients (paginated, searchable) |
| `POST` | `/v1/patients/` | Create a patient |
| `GET` | `/v1/patients/:id` | Get a patient by UUID |
| `PATCH` | `/v1/patients/:id` | Partially update a patient |
| `DELETE` | `/v1/patients/:id` | Delete a patient |

### Query parameters for `GET /v1/patients/`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer ≥ 1 | `1` | Page number |
| `pageSize` | integer 1–100 | `20` | Results per page |
| `search` | string ≤ 100 chars | — | Filter by name or email |

Full schema documentation is available in the Swagger UI at `/docs`.

---

## Database schema

```
patients
├── id            uuid        PRIMARY KEY (auto-generated)
├── name          varchar(255) NOT NULL
├── date_of_birth varchar(10)  NOT NULL  (YYYY-MM-DD)
├── email         varchar(255) NOT NULL UNIQUE
├── phone         varchar(30)
├── gender        enum('male','female','other','prefer_not_to_say')
├── address       varchar(500)
├── created_at    timestamp   NOT NULL DEFAULT now()
└── updated_at    timestamp   NOT NULL DEFAULT now()
```

---

## Architecture notes

- **Plugin registration order**: `env` → security (`helmet`, `rate-limit`) → `db` → `swagger` → `auth` → feature routes. Each plugin depends on the ones before it. CORS is handled by the API gateway upstream.
- **Auth is decode-only**: The `authenticate` decorator decodes the JWT from the gateway; it does not verify the signature (the gateway already did).
- **Error handling**: A global error handler normalises all errors. 5xx responses return a generic message to avoid leaking internals.
