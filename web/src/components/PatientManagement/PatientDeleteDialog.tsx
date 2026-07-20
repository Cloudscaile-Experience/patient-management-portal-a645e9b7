import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { Patient } from '@/types/patient';

interface PatientDeleteDialogProps {
  ns: string;
  patient: Patient | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading?: boolean;
}

const PatientDeleteDialog: React.FC<PatientDeleteDialogProps> = ({
  ns,
  patient,
  onClose,
  onConfirm,
  loading = false
}) => {
  const { t } = useTranslation(ns);

  return (
    <Dialog open={Boolean(patient)} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('delete.message', { name: patient?.name ?? '' })}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('delete.cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={() => patient && onConfirm(patient.id)}
        >
          {t('delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDeleteDialog;
