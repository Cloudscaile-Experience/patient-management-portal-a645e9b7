import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type {
  CreateMedicationPayload,
  Medication,
  MedicationRoute,
  MedicationStatus,
  UpdateMedicationPayload
} from '@/types/medication';

const ROUTES: MedicationRoute[] = [
  'oral',
  'iv',
  'im',
  'subcutaneous',
  'topical',
  'inhaled',
  'sublingual',
  'other'
];

const STATUSES: MedicationStatus[] = ['active', 'discontinued', 'completed', 'on_hold'];

interface MedicationFormProps {
  ns: string;
  open: boolean;
  medication: Medication | null;
  onClose: () => void;
  onSubmit: (payload: CreateMedicationPayload | UpdateMedicationPayload) => void;
  loading?: boolean;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const MedicationForm: React.FC<MedicationFormProps> = ({
  ns,
  open,
  medication,
  onClose,
  onSubmit,
  loading = false
}) => {
  const { t } = useTranslation(ns);
  const isEdit = Boolean(medication);

  const validationSchema = Yup.object({
    name: Yup.string().required(t('errors.name')).max(255, t('errors.nameMax')),
    genericName: Yup.string().max(255, t('errors.genericNameMax')),
    dosage: Yup.string().required(t('errors.dosage')).max(100, t('errors.dosageMax')),
    route: Yup.string().required(t('errors.route')),
    frequency: Yup.string().required(t('errors.frequency')).max(100, t('errors.frequencyMax')),
    startDate: Yup.string()
      .required(t('errors.startDate'))
      .matches(DATE_RE, t('errors.startDateFormat')),
    endDate: Yup.string().matches(DATE_RE, t('errors.endDateFormat')).optional(),
    prescriber: Yup.string().max(255, t('errors.prescriberMax')),
    notes: Yup.string().max(2000, t('errors.notesMax'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: medication?.name ?? '',
      genericName: medication?.genericName ?? '',
      dosage: medication?.dosage ?? '',
      route: (medication?.route ?? '') as MedicationRoute | '',
      frequency: medication?.frequency ?? '',
      startDate: medication?.startDate ?? '',
      endDate: medication?.endDate ?? '',
      prescriber: medication?.prescriber ?? '',
      status: (medication?.status ?? 'active') as MedicationStatus,
      notes: medication?.notes ?? ''
    },
    validationSchema,
    onSubmit: (values) => {
      const payload: CreateMedicationPayload = {
        name: values.name,
        dosage: values.dosage,
        route: values.route as MedicationRoute,
        frequency: values.frequency,
        startDate: values.startDate,
        genericName: values.genericName || undefined,
        endDate: values.endDate || undefined,
        prescriber: values.prescriber || undefined,
        status: values.status,
        notes: values.notes || undefined
      };
      onSubmit(payload);
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? t('form.editTitle') : t('form.addTitle')}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label={t('form.name')}
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label={t('form.genericName')}
                {...formik.getFieldProps('genericName')}
                error={formik.touched.genericName && Boolean(formik.errors.genericName)}
                helperText={formik.touched.genericName && formik.errors.genericName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label={t('form.dosage')}
                {...formik.getFieldProps('dosage')}
                error={formik.touched.dosage && Boolean(formik.errors.dosage)}
                helperText={formik.touched.dosage && formik.errors.dosage}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                select
                label={t('form.route')}
                {...formik.getFieldProps('route')}
                error={formik.touched.route && Boolean(formik.errors.route)}
                helperText={formik.touched.route && formik.errors.route}
              >
                <MenuItem value="">{t('form.selectRoute')}</MenuItem>
                {ROUTES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {t(`route.${r}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label={t('form.frequency')}
                {...formik.getFieldProps('frequency')}
                error={formik.touched.frequency && Boolean(formik.errors.frequency)}
                helperText={formik.touched.frequency && formik.errors.frequency}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label={t('form.startDate')}
                placeholder="YYYY-MM-DD"
                {...formik.getFieldProps('startDate')}
                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                helperText={formik.touched.startDate && formik.errors.startDate}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label={t('form.endDate')}
                placeholder="YYYY-MM-DD"
                {...formik.getFieldProps('endDate')}
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                helperText={formik.touched.endDate && formik.errors.endDate}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                select
                label={t('form.status')}
                {...formik.getFieldProps('status')}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {t(`status.${s}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label={t('form.prescriber')}
                {...formik.getFieldProps('prescriber')}
                error={formik.touched.prescriber && Boolean(formik.errors.prescriber)}
                helperText={formik.touched.prescriber && formik.errors.prescriber}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                label={t('form.notes')}
                {...formik.getFieldProps('notes')}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading || formik.isSubmitting}>
            {t('actions.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MedicationForm;
