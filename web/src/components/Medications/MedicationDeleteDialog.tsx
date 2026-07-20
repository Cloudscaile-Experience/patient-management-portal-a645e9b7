import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { Medication } from '@/types/medication';

interface MedicationDeleteDialogProps {
  ns: string;
  medication: Medication | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading?: boolean;
}

const MedicationDeleteDialog: React.FC<MedicationDeleteDialogProps> = ({
  ns,
  medication,
  onClose,
  onConfirm,
  loading = false
}) => {
  const { t } = useTranslation(ns);

  return (
    <Dialog open={Boolean(medication)} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('delete.message', { name: medication?.name ?? '' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('delete.cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={() => medication && onConfirm(medication.id)}
        >
          {t('delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicationDeleteDialog;
