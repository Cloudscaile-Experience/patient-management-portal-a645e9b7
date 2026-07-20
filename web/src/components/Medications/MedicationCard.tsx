import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MedicationIcon from '@mui/icons-material/Medication';
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { Medication } from '@/types/medication';

import StatusChip from './StatusChip';

interface MedicationCardProps {
  ns: string;
  medication: Medication;
  onEdit: (m: Medication) => void;
  onDelete: (m: Medication) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ ns, medication, onEdit, onDelete }) => {
  const { t } = useTranslation(ns);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 3 }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                mt: 0.25
              }}
            >
              <MedicationIcon sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {medication.name}
                </Typography>
                <StatusChip ns={ns} status={medication.status} />
              </Stack>
              {medication.genericName && (
                <Typography variant="caption" color="text.secondary">
                  {medication.genericName}
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack direction="row" spacing={0.25} flexShrink={0}>
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
        </Stack>

        <Divider sx={{ my: 1.25 }} />

        <Stack direction="row" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Dosage
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {medication.dosage}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {t('table.route')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {t(`route.${medication.route}`)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              {t('table.frequency')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {medication.frequency}
            </Typography>
          </Box>
          {medication.prescriber && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {t('card.prescribedBy')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {medication.prescriber}
              </Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 1.25 }}>
          <Typography variant="caption" color="text.secondary">
            {t('card.since')} <strong>{medication.startDate}</strong>
          </Typography>
          {medication.endDate ? (
            <Typography variant="caption" color="text.secondary">
              {t('card.until')} <strong>{medication.endDate}</strong>
            </Typography>
          ) : (
            <Typography variant="caption" color="success.main" fontWeight={500}>
              {t('card.noEnd')}
            </Typography>
          )}
        </Stack>

        {medication.notes && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {medication.notes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
