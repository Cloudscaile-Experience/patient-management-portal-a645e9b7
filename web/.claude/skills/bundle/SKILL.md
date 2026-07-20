---
name: bundle
description: Build the Webpack bundle for production or development. Use when asked to build, compile, or bundle the application.
disable-model-invocation: true
allowed-tools: Bash(npm run build) Bash(npm run build:dev) Bash(npm run type-check)
---

## Type check only (no output)

```bash
npm run type-check
```

## Production bundle (minified, optimised)

```bash
npm run build
```

Output lands in `dist/`. This is what gets deployed or federated into the host.

## Development bundle (source maps, no minification)

```bash
npm run build:dev
```

## Bundle analysis

```bash
npm run analyze
```

Opens an interactive treemap of the production bundle to identify large dependencies.
