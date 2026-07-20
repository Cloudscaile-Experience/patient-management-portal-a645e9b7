import { useQuery } from '@tanstack/react-query';

import { patientsApi } from '@/api/calls/patients';

interface UsePatientListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const usePatients = (params: UsePatientListParams = {}) =>
  useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientsApi.list(params)
  });

export const usePatient = (id: string) =>
  useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientsApi.getById(id),
    enabled: Boolean(id)
  });
