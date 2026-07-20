# Patient Management Portal

A monorepo containing the backend API and React micro-frontend for the Patient Management Portal extension.

| Directory | Role |
|-----------|------|
| `js/` | Fastify REST API — patient CRUD, PostgreSQL via Drizzle ORM |
| `web/` | React 19 micro-frontend — Module Federation component consumed by the host |

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 22 |
| npm | ≥ 10 |
| Docker & Docker Compose | any recent version |

---

## Quick start

### Backend (API)

```sh
cd js
cp .env.example .env          # fill in DATABASE_URL and other values
docker compose -f docker-compose.dev.yml up -d   # start PostgreSQL
npm install
npm run db:migrate             # run schema migrations
npm run dev                    # http://localhost:8000
```

### Frontend (micro-frontend)

```sh
cd web
npm install
npm start                      # Webpack dev server — http://localhost:4000
```

> The micro-frontend is designed to run inside a host application in production. The dev server is for local development only.

---

## Repository structure

```
patient-management-portal/
├── js/          # Fastify API server (see js/README.md)
├── web/         # React micro-frontend (see web/README.md)
├── lefthook.yml # Pre-commit and pre-push git hooks for both packages
└── .gitignore
```

---

## Git hooks (Lefthook)

Hooks are installed automatically when you run `npm install` inside `js/`. To install manually:

```sh
cd js && npx lefthook install
```

| Hook | Jobs |
|------|------|
| `pre-commit` | Biome lint + format (both `js/` and `web/`), TypeScript check (both) |
| `pre-push` | Vitest test suite (`js/`) |

---

## Further reading

- [Backend API — `js/README.md`](./js/README.md)
- [Micro-frontend — `web/README.md`](./web/README.md)
