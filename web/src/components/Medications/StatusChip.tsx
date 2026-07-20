import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { MedicationStatus } from '@/types/medication';

const STATUS_COLOR: Record<MedicationStatus, 'success' | 'error' | 'default' | 'warning'> = {
  active: 'success',
  discontinued: 'error',
  completed: 'default',
  on_hold: 'warning'
};

interface StatusChipProps {
  ns: string;
  status: MedicationStatus;
}

const StatusChip: React.FC<StatusChipProps> = ({ ns, status }) => {
  const { t } = useTranslation(ns);
  return (
    <Chip
      label={t(`status.${status}`)}
      color={STATUS_COLOR[status]}
      size="small"
      variant="outlined"
    />
  );
};

export default StatusChip;
