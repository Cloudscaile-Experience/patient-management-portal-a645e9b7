import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type { CreateVitalSignPayload, UpdateVitalSignPayload, VitalSign } from '@/types/vital';

interface VitalSignFormProps {
  ns: string;
  open: boolean;
  record: VitalSign | null;
  onClose: () => void;
  onSubmit: (payload: CreateVitalSignPayload | UpdateVitalSignPayload) => void;
  loading?: boolean;
}

const numericField = (min: number, max: number, errKey: string, t: (k: string) => string) =>
  Yup.number().min(min, t(errKey)).max(max, t(errKey)).nullable().optional();

const VitalSignForm: React.FC<VitalSignFormProps> = ({
  ns,
  open,
  record,
  onClose,
  onSubmit,
  loading = false
}) => {
  const { t } = useTranslation(ns);
  const isEdit = Boolean(record);

  const validationSchema = Yup.object({
    recordedAt: Yup.string().required(t('errors.recordedAt')),
    heartRate: numericField(0, 300, 'errors.heartRateRange', t),
    respiratoryRate: numericField(0, 100, 'errors.respiratoryRateRange', t),
    spo2: numericField(0, 100, 'errors.spo2Range', t),
    systolicBp: numericField(0, 400, 'errors.systolicBpRange', t),
    diastolicBp: numericField(0, 300, 'errors.diastolicBpRange', t),
    temperature: numericField(25, 45, 'errors.temperatureRange', t),
    weight: numericField(0, 700, 'errors.weightRange', t),
    height: numericField(0, 300, 'errors.heightRange', t),
    painScore: numericField(0, 10, 'errors.painScoreRange', t)
  });

  const toStr = (v: number | null | undefined) => (v == null ? '' : String(v));

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      recordedAt: record?.recordedAt ?? new Date().toISOString().slice(0, 16),
      heartRate: toStr(record?.heartRate),
      respiratoryRate: toStr(record?.respiratoryRate),
      spo2: toStr(record?.spo2),
      systolicBp: toStr(record?.systolicBp),
      diastolicBp: toStr(record?.diastolicBp),
      temperature: toStr(record?.temperature),
      weight: toStr(record?.weight),
      height: toStr(record?.height),
      painScore: toStr(record?.painScore),
      recordedBy: record?.recordedBy ?? '',
      notes: record?.notes ?? ''
    },
    validationSchema,
    onSubmit: (values) => {
      const parseNum = (v: string) => (v === '' ? undefined : Number(v));
      const payload: CreateVitalSignPayload = {
        recordedAt: values.recordedAt,
        heartRate: parseNum(values.heartRate),
        respiratoryRate: parseNum(values.respiratoryRate),
        spo2: parseNum(values.spo2),
        systolicBp: parseNum(values.systolicBp),
        diastolicBp: parseNum(values.diastolicBp),
        temperature: parseNum(values.temperature),
        weight: parseNum(values.weight),
        height: parseNum(values.height),
        painScore: parseNum(values.painScore),
        recordedBy: values.recordedBy || undefined,
        notes: values.notes || undefined
      };
      onSubmit(payload);
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const field = (name: keyof typeof formik.values, label: string, type = 'number') => ({
    fullWidth: true,
    size: 'small' as const,
    type,
    label,
    ...formik.getFieldProps(name),
    error: formik.touched[name] && Boolean(formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name]
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? t('form.editTitle') : t('form.addTitle')}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...field('recordedAt', t('form.recordedAt'), 'datetime-local')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField {...field('recordedBy', t('form.recordedBy'), 'text')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('heartRate', t('form.heartRate'))}
                inputProps={{ min: 0, max: 300 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('respiratoryRate', t('form.respiratoryRate'))}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('spo2', t('form.spo2'))}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('systolicBp', t('form.systolicBp'))}
                inputProps={{ min: 0, max: 400 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('diastolicBp', t('form.diastolicBp'))}
                inputProps={{ min: 0, max: 300 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('temperature', t('form.temperature'))}
                inputProps={{ min: 25, max: 45, step: 0.1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('weight', t('form.weight'))}
                inputProps={{ min: 0, max: 700, step: 0.1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('height', t('form.height'))}
                inputProps={{ min: 0, max: 300, step: 0.1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                {...field('painScore', t('form.painScore'))}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField {...field('notes', t('form.notes'), 'text')} multiline rows={2} />
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

export default VitalSignForm;
