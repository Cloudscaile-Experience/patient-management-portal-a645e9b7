import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patientsApi } from '@/api/calls/patients';
import { extensionManager } from '@/utils/extension';

import type { CreatePatientPayload, UpdatePatientPayload } from '@/types/patient';

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => patientsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      extensionManager.toast('Patient created successfully', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to create patient', 'error');
    }
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePatientPayload }) =>
      patientsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients', id] });
      extensionManager.toast('Patient updated successfully', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to update patient', 'error');
    }
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      extensionManager.toast('Patient deleted successfully', 'success');
    },
    onError: () => {
      extensionManager.toast('Failed to delete patient', 'error');
    }
  });
};
