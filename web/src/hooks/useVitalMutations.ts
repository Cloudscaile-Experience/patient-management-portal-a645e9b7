import { useMutation, useQueryClient } from '@tanstack/react-query';

import { vitalsApi } from '@/api/calls/vitals';
import { extensionManager } from '@/utils/extension';

import type { CreateVitalSignPayload, UpdateVitalSignPayload } from '@/types/vital';

export const useCreateVital = (patientId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVitalSignPayload) => vitalsApi.create(patientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals', patientId] });
      extensionManager.toast('Vital signs recorded successfully', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to record vital signs', 'error');
    }
  });
};

export const useUpdateVital = (patientId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVitalSignPayload }) =>
      vitalsApi.update(patientId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals', patientId] });
      extensionManager.toast('Vital signs updated successfully', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to update vital signs', 'error');
    }
  });
};

export const useDeleteVital = (patientId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vitalsApi.remove(patientId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals', patientId] });
      extensionManager.toast('Vital sign record deleted', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to delete vital sign record', 'error');
    }
  });
};
