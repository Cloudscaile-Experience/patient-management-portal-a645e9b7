---
name: lint
description: Run Biome to check and auto-fix linting and formatting issues in the TypeScript codebase. Use when asked to lint, format, check code style, or fix Biome errors.
disable-model-invocation: true
allowed-tools: Bash(npm run check) Bash(npm run check:fix) Bash(npx @biomejs/biome *)
---

This project uses **Biome** as the single tool for linting and formatting — it replaces ESLint and Prettier.

## Check for issues (no writes)

```bash
npm run check
```

## Auto-fix all safe issues (lint + format + organize imports)

```bash
npm run check:fix
```

## Target a specific file or directory

```bash
npx @biomejs/biome check src/modules/patients/
npx @biomejs/biome check --write src/app.ts
```

All changes must pass `npm run check` before being considered complete. In CI, `biome ci` runs and exits non-zero on any issue.
