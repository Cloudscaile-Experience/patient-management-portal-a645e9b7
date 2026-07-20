---
name: use-shared-axios
description: Make API calls using the shared Axios instance from the host application. Use when creating an API service, making a network request, or fetching/mutating data.
when_to_use: Triggered when the user asks to call an API, fetch data, create a service file, or make a network request. Always use this pattern — never instantiate Axios directly.
allowed-tools: Read Bash(npm install *)
---

Never instantiate Axios directly or use the native `fetch` API. The host configures auth headers, base URL, and error interceptors.

## Pattern — API service class

```typescript
// src/api/calls/patients.ts
import { extensionManager } from '@/utils/extension';
import type { Patient } from '@/types';

class PatientsApi {
  private get axios() {
    return extensionManager.getExtAxios();
  }

  async getAll(): Promise<Patient[]> {
    const { data } = await this.axios.get<Patient[]>('/api/v1/patients');
    return data;
  }

  async getById(id: string): Promise<Patient> {
    const { data } = await this.axios.get<Patient>(`/api/v1/patients/${id}`);
    return data;
  }

  async create(payload: Omit<Patient, 'id'>): Promise<Patient> {
    const { data } = await this.axios.post<Patient>('/api/v1/patients', payload);
    return data;
  }

  async update(id: string, payload: Partial<Patient>): Promise<Patient> {
    const { data } = await this.axios.patch<Patient>(`/api/v1/patients/${id}`, payload);
    return data;
  }

  async remove(id: string): Promise<void> {
    await this.axios.delete(`/api/v1/patients/${id}`);
  }
}

export const patientsApi = new PatientsApi();
```

## Use with TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from '@/api/calls/patients';

export function usePatients() {
  return useQuery({ queryKey: ['patients'], queryFn: patientsApi.getAll });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] })
  });
}
```

## Error handling

The shared Axios instance has built-in interceptors — a 401 triggers the host login flow and failures show a host toast. Only add `.catch()` when you have specific per-call fallback logic.
