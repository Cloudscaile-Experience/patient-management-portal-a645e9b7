---
name: inject-reducers
description: Add a Redux Toolkit slice and inject it into the host store via cs-ext-utils. Use when asked to add Redux state, create a slice, or manage global state in this micro-frontend.
when_to_use: Triggered when the user asks to add state management, create a Redux slice, use useSelector or useDispatch, or manage shared state between components.
allowed-tools: Read Bash(npm install *)
---

This micro-frontend shares the host's Redux store. Never create a local `<Provider>`.

## Step 1 — Create the slice

```typescript
// src/slice/myFeature.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface MyFeatureState {
  data: unknown[];
}

const initialState: MyFeatureState = { data: [] };

const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<unknown[]>) => {
      state.data = action.payload;
    }
  }
});

export const { setData } = myFeatureSlice.actions;
export default myFeatureSlice.reducer;
```

## Step 2 — Inject at startup

In `src/App.tsx` or the container that initialises the feature:

```typescript
import { extensionManager } from '@/utils/extension';
import myFeatureReducer from '@/slice/myFeature.slice';

extensionManager.injectReducers(
  { myFeature: myFeatureReducer },
  [],              // reducers to replace (usually empty)
  ['myFeature']   // whitelist for redux-persist
);
```

## Step 3 — Use in components

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '@/slice/myFeature.slice';

const data = useSelector((state: any) => state.myFeature.data);
const dispatch = useDispatch();

dispatch(setData(newData));
```

## Notes

- Slice files live in `src/slice/` and follow `camelCase.slice.ts` naming.
- Add the slice key to the persist whitelist only if the state should survive page reloads.
- Never type the RootState from a local store — use `any` or a shared host type.
