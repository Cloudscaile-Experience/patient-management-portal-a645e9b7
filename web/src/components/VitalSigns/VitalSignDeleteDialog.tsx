import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { VitalSign } from '@/types/vital';
import { dateTimeView } from '@/utils/dateTime';

interface VitalSignDeleteDialogProps {
  ns: string;
  record: VitalSign | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading?: boolean;
}

const VitalSignDeleteDialog: React.FC<VitalSignDeleteDialogProps> = ({
  ns,
  record,
  onClose,
  onConfirm,
  loading = false
}) => {
  const { t } = useTranslation(ns);

  return (
    <Dialog open={Boolean(record)} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('delete.message', { date: record ? dateTimeView(record.recordedAt) : '' })}
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
          onClick={() => record && onConfirm(record.id)}
        >
          {t('delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VitalSignDeleteDialog;
