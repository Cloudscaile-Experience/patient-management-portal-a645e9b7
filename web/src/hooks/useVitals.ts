import { useQuery } from '@tanstack/react-query';

import { vitalsApi } from '@/api/calls/vitals';

interface UseVitalsParams {
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
}

export const useVitals = (patientId: string, params: UseVitalsParams = {}) =>
  useQuery({
    queryKey: ['vitals', patientId, params],
    queryFn: () => vitalsApi.list(patientId, params),
    enabled: Boolean(patientId)
  });
