---
name: micro-frontend-integration
description: Micro-frontend integration rules for network requests, state, theming, toasts, and routing. Load when adding features, making API calls, managing state, or wiring up navigation.
user-invocable: false
---

This application runs **exclusively as a micro-frontend** inside a host application via `cs-ext-utils`. It is never standalone in production. The rules below are non-negotiable.

## Network Requests

**Never** use `fetch` or instantiate a new Axios client. The host manages auth tokens and interceptors.

```typescript
// ✅
const axios = extensionManager.getExtAxios();
const { data } = await axios.get('/api/v1/patients');

// ❌
const response = await fetch('/api/v1/patients');
const axios = axios.create({ baseURL: '...' });
```

## State Management (Redux)

**Never** render `<Provider store={...}>`. Inject slices into the host store.

```typescript
// ✅
extensionManager.injectReducers({ mySlice: mySliceReducer }, [], ['mySlice']);

// ❌
<Provider store={localStore}>...</Provider>
```

## Theming

**Never** call `createTheme()`. Retrieve the host theme.

```typescript
// ✅
<ThemeProvider theme={extensionManager.getTheme()}>

// ❌
const theme = createTheme({ palette: { primary: { main: '#0250D9' } } });
```

## Notifications / Toasts

**Never** install `react-toastify`, `notistack`, or any local toast library.

```typescript
// ✅
extensionManager.toast('Saved successfully', 'success');

// ❌
toast.success('Saved successfully');
```

## Routing

**Never** use `<BrowserRouter>`, `<Routes>`, or any router that controls the URL. The host mounts components directly by route — this app only exports components.
