import { useQuery } from '@tanstack/react-query';

import { medicationsApi } from '@/api/calls/medications';

import type { MedicationStatus } from '@/types/medication';

interface UseMedicationsParams {
  page?: number;
  pageSize?: number;
  status?: MedicationStatus;
}

export const useMedications = (patientId: string, params: UseMedicationsParams = {}) =>
  useQuery({
    queryKey: ['medications', patientId, params],
    queryFn: () => medicationsApi.list(patientId, params),
    enabled: Boolean(patientId)
  });
