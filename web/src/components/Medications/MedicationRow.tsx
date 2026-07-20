import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { Medication } from '@/types/medication';

import StatusChip from './StatusChip';

interface MedicationRowProps {
  ns: string;
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
}

const MedicationRow: React.FC<MedicationRowProps> = ({ ns, medication, onEdit, onDelete }) => {
  const { t } = useTranslation(ns);

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {medication.name}
        </Typography>
        {medication.genericName && (
          <Typography variant="caption" color="text.secondary">
            {medication.genericName}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <Typography variant="body2">{medication.dosage}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{t(`route.${medication.route}`)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{medication.frequency}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{medication.startDate}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{medication.endDate ?? '—'}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{medication.prescriber ?? '—'}</Typography>
      </TableCell>
      <TableCell>
        <StatusChip ns={ns} status={medication.status} />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title={t('actions.edit')}>
            <IconButton size="small" onClick={() => onEdit(medication)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.delete')}>
            <IconButton size="small" color="error" onClick={() => onDelete(medication)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default MedicationRow;
