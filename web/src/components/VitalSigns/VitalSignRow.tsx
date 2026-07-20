import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { VitalSign } from '@/types/vital';
import { dateTimeView } from '@/utils/dateTime';

interface VitalSignRowProps {
  ns: string;
  record: VitalSign;
  onEdit: (record: VitalSign) => void;
  onDelete: (record: VitalSign) => void;
}

const fmt = (v: number | null, suffix = '') => (v == null ? '—' : `${v}${suffix}`);

const VitalSignRow: React.FC<VitalSignRowProps> = ({ ns, record, onEdit, onDelete }) => {
  const { t } = useTranslation(ns);

  const bp =
    record.systolicBp != null && record.diastolicBp != null
      ? `${record.systolicBp}/${record.diastolicBp}`
      : '—';

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2">{dateTimeView(record.recordedAt)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{fmt(record.heartRate, ' bpm')}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{fmt(record.respiratoryRate, '/min')}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{fmt(record.spo2, '%')}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{bp}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{fmt(record.temperature, '°C')}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{fmt(record.weight, ' kg')}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{fmt(record.painScore)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{record.recordedBy ?? '—'}</Typography>
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title={t('actions.edit')}>
            <IconButton size="small" onClick={() => onEdit(record)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.delete')}>
            <IconButton size="small" color="error" onClick={() => onDelete(record)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default VitalSignRow;
