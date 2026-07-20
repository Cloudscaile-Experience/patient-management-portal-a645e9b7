import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import type { Patient } from '@/types/patient';
import { getPatientAvatarColor, getPatientInitials } from '@/utils/helpers';

const calcAge = (dob: string) => {
  const years = dayjs().diff(dayjs(dob), 'year');
  return Number.isNaN(years) || years < 0 ? null : years;
};

interface PatientRowProps {
  ns: string;
  patient: Patient;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const PatientRow: React.FC<PatientRowProps> = ({ ns, patient, onView, onEdit, onDelete }) => {
  const { t } = useTranslation(ns);
  const age = calcAge(patient.dateOfBirth);

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <TableRow
      hover
      onClick={() => onView(patient)}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover .row-actions': { opacity: 1 }
      }}
    >
      {/* Patient */}
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: getPatientAvatarColor(patient.name),
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            {getPatientInitials(patient.name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {patient.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {patient.email}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      {/* Date of Birth + Age */}
      <TableCell>
        <Typography variant="body2">{patient.dateOfBirth}</Typography>
        {age !== null && (
          <Typography variant="caption" color="text.secondary">
            {age} {t('table.yearsOld')}
          </Typography>
        )}
      </TableCell>

      {/* Gender */}
      <TableCell>
        {patient.gender ? (
          <Chip
            label={t(`gender.${patient.gender}`)}
            size="small"
            variant="outlined"
            sx={{ fontSize: 11, height: 22 }}
          />
        ) : (
          <Typography variant="body2" color="text.disabled">
            —
          </Typography>
        )}
      </TableCell>

      {/* Phone */}
      <TableCell>
        {patient.phone ? (
          <Typography variant="body2">{patient.phone}</Typography>
        ) : (
          <Typography variant="body2" color="text.disabled">
            —
          </Typography>
        )}
      </TableCell>

      {/* Actions — fade in on row hover */}
      <TableCell align="right">
        <Stack
          direction="row"
          spacing={0.25}
          justifyContent="flex-end"
          className="row-actions"
          sx={{ opacity: 0, transition: 'opacity 0.15s' }}
        >
          <Tooltip title={t('actions.edit')}>
            <IconButton size="small" onClick={stop(() => onEdit(patient))}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.delete')}>
            <IconButton size="small" color="error" onClick={stop(() => onDelete(patient))}>
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default PatientRow;
