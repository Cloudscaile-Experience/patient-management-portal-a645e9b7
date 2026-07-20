---
name: micro-frontend-architecture
description: cs-ext-utils API reference for host/extension resource access. Load when using extensionManager, getExtension, getExtAxios, getTheme, injectReducers, registerTranslation, toast, getUser, or validateUserPermission.
user-invocable: false
---

This micro-frontend uses `cs-ext-utils` to access all shared resources from the host.

## Extension object

Always create an extension object first:

```typescript
import { getExtension } from 'cs-ext-utils';
const extension = getExtension('<tenant>', '<extension>');
```

## Available resource functions

Pass the extension object as the first argument to every function:

| Function | Purpose |
| --- | --- |
| `getExtAxios(extension, config?)` | Shared Axios instance (auth, interceptors pre-configured) |
| `getReduxStore(extension)` | Host Redux store |
| `getEventBus(extension)` | Shared event bus |
| `injectReducers(extension, options)` | Inject Redux slices into host store |
| `registerTranslation(extension, options)` | Register i18n namespaces with host |
| `getNsForTranslation(extension, ns)` | Returns scoped namespace string |
| `getTheme(extension)` | Host MUI theme object |
| `toast(extension, message, type)` | Show host toast notification |
| `getUser(extension)` | Current user from host |
| `validateUserPermission(extension, permissions)` | Permission map for extension |
| `triggerLogin(extension, config?)` | Trigger host login flow |

## Error handling

These functions throw if `initializeHost()` was not called by the host before the micro-frontend loaded. Do not swallow those errors — let them surface so the integration issue is immediately visible.

## Host initialization (reference only — done by the host, not this app)

```typescript
import { initializeHost } from 'cs-ext-utils';
initializeHost({ extAxios, reduxStore, theme, toast, getUser, ... });
```
