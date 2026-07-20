import { useMutation, useQueryClient } from '@tanstack/react-query';

import { medicationsApi } from '@/api/calls/medications';
import { extensionManager } from '@/utils/extension';

import type { CreateMedicationPayload, UpdateMedicationPayload } from '@/types/medication';

export const useCreateMedication = (patientId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMedicationPayload) => medicationsApi.create(patientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', patientId] });
      extensionManager.toast('Medication added successfully', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to add medication', 'error');
    }
  });
};

export const useUpdateMedication = (patientId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMedicationPayload }) =>
      medicationsApi.update(patientId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', patientId] });
      extensionManager.toast('Medication updated successfully', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to update medication', 'error');
    }
  });
};

export const useDeleteMedication = (patientId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicationsApi.remove(patientId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', patientId] });
      extensionManager.toast('Medication deleted successfully', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to delete medication', 'error');
    }
  });
};
