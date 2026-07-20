import { useQuery } from '@tanstack/react-query';

import { vitalsApi } from '@/api/calls/vitals';

export const useVitalsTrend = (patientId: string) =>
  useQuery({
    queryKey: ['vitals-trend', patientId],
    queryFn: () => vitalsApi.list(patientId, { page: 1, pageSize: 60 }),
    enabled: Boolean(patientId),
    staleTime: 30_000
  });
