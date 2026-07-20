---
name: dev
description: Start the Webpack development server with HMR. Use when asked to start the app, run locally, or launch the dev environment.
disable-model-invocation: true
allowed-tools: Bash(npm start)
---

Start the development server with Hot Module Replacement:

```bash
npm start
```

Webpack compiles TypeScript on-the-fly and reloads the browser on file changes.

## Default URLs

| Resource | URL |
| --- | --- |
| App | `http://localhost:3001` |

## Prerequisites

- `env/.env.development` must exist with required values.
- The host application must be running for `cs-ext-utils` bridge calls to resolve.
- In standalone mode (`NODE_ENV=development`), the app renders from `public/index.html`.
