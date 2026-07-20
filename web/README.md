# Patient Management Portal — Frontend (Micro-Frontend)

React 19 micro-frontend that exposes a `PatientManagement` component via Webpack Module Federation. Consumed by the host application — never runs standalone in production.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| **React 19** | UI library |
| **TypeScript** | Strict typing |
| **Webpack 5 + Module Federation** | Bundler + remote component export |
| **MUI v7** | Component library (theme provided by host) |
| **TanStack Query v5** | Server-state, caching, and pagination |
| **Formik + Yup** | Form state and validation |
| **react-i18next** | Translations registered with host i18n instance |
| **Redux Toolkit** | State slices injected into host store |
| **cs-ext-utils** | Host bridge — Axios, store, theme, toast, i18n |
| **Biome** | Linter + formatter (replaces ESLint + Prettier) |
| **Tailwind CSS v4** | Utility classes via PostCSS |

---

## Project structure

```
web/
├── src/
│   ├── api/
│   │   └── calls/
│   │       └── patients.ts           # PatientsApi class (list, get, create, update, delete)
│   ├── components/
│   │   ├── ui/                       # Shared atomic components
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── PageHeader.tsx
│   │   └── PatientManagement/        # Feature components
│   │       ├── index.tsx             # Root — search bar, wires table + dialogs
│   │       ├── PatientTable.tsx      # Paginated table with skeleton loading
│   │       ├── PatientRow.tsx        # Single table row with edit/delete actions
│   │       ├── PatientForm.tsx       # Add / Edit dialog (Formik + Yup)
│   │       └── PatientDeleteDialog.tsx # Delete confirmation dialog
│   ├── containers/
│   │   ├── PatientManagementContainer.tsx  # Host-mounted entry point
│   │   └── index.ts
│   ├── hooks/
│   │   ├── usePatients.ts            # TanStack Query — list + get by id
│   │   └── usePatientMutations.ts    # create / update / delete mutations
│   ├── locales/
│   │   └── patients.json             # All user-facing strings
│   ├── types/
│   │   └── patient.d.ts              # Patient, Gender, payload types
│   ├── utils/
│   │   ├── dateTime.ts               # Date formatting helpers
│   │   ├── extension.ts              # ExtensionManager singleton
│   │   └── helpers.ts                # General utilities
│   ├── App.tsx                       # ThemeProvider + QueryClientProvider (dev only)
│   ├── bootstrap.tsx                 # Dev entry — renders PatientManagement
│   ├── index.css                     # Tailwind import
│   └── index.tsx                     # Async import of bootstrap
├── env/
│   ├── .env.development
│   └── .env.production
├── public/
│   └── index.html
├── webpack/
│   ├── webpack.common.cjs            # Shared config — Module Federation exposes
│   ├── webpack.dev.cjs               # Dev server + HMR
│   └── webpack.prod.cjs              # Production build
├── biome.json
├── postcss.config.cjs
└── tsconfig.json
```

---

## Module Federation export

The host application consumes this micro-frontend via:

```js
// remoteEntry.js exposed module
'./PatientManagement' → src/containers/PatientManagementContainer
```

The container sets up `ThemeProvider`, `QueryClientProvider`, `ErrorBoundary`, and registers i18n translations before mounting `<PatientManagement />`.

---

## Getting started

```sh
npm install
npm start        # Webpack dev server — http://localhost:4000
```

The dev server renders the `PatientManagement` component standalone using a local `App.tsx` wrapper. In production the host mounts `PatientManagementContainer` directly via Module Federation.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server with HMR |
| `npm run build` | Production bundle |
| `npm run build:dev` | Dev bundle (no minification) |
| `npm run check` | Biome lint + format check (CI gate) |
| `npm run check:fix` | Apply all Biome auto-fixes |
| `npm run type-check` | TypeScript check without emit |

---

## Architecture constraints

This app is **never** the root application. It is mounted by a host.

| Concern | Rule |
|---------|------|
| **HTTP** | Never use `fetch` or instantiate Axios. Use `extensionManager.getExtAxios()`. |
| **Redux** | Never render `<Provider store={...}>`. Inject slices via `extensionManager.injectReducers()`. |
| **Theming** | Never call `createTheme()`. Wrap with `<ThemeProvider theme={extensionManager.getTheme()}>`. |
| **Toasts** | Never use a local toast library. Use `extensionManager.toast()`. |
| **Routing** | Never use `<BrowserRouter>` or `<Routes>`. The host controls URLs. |

---

## Styling conventions

- All styling via MUI `sx` prop or `styled()` — no `.css`, `.scss`, or `.module.css`.
- Layout with `Stack`, `Box`, `Grid`. Text with `Typography` — no raw `<p>` or `<h1>`.
- Theme tokens only (`primary.main`, `text.secondary`, etc.) — no hardcoded hex values.

---

## Translations

All user-facing strings live in `src/locales/patients.json` and are registered with the host i18n instance at startup. Components receive the scoped namespace string as a prop and call `useTranslation(ns)`.

---

## Code quality

Biome enforces: no `console.log`, no unused variables, consistent imports, single quotes, 2-space indent, 100-char line width, no trailing commas.

Pre-commit hooks (via Lefthook at the repo root) run `biome check` and `tsc --noEmit` on every commit.
