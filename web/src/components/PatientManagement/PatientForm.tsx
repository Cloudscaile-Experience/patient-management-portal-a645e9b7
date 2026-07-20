import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import type { CreatePatientPayload, Gender, Patient, UpdatePatientPayload } from '@/types/patient';

const GENDERS: Gender[] = ['male', 'female', 'other', 'prefer_not_to_say'];

interface PatientFormProps {
  ns: string;
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSubmit: (payload: CreatePatientPayload | UpdatePatientPayload) => void;
  loading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  ns,
  open,
  patient,
  onClose,
  onSubmit,
  loading = false
}) => {
  const { t } = useTranslation(ns);
  const isEdit = Boolean(patient);

  const emailSchema = isEdit
    ? Yup.string().email(t('errors.email')).max(255, t('errors.emailMax'))
    : Yup.string()
        .email(t('errors.email'))
        .max(255, t('errors.emailMax'))
        .required(t('errors.email'));

  const validationSchema = Yup.object({
    name: Yup.string().required(t('errors.name')).max(255, t('errors.nameMax')),
    dateOfBirth: Yup.string()
      .required(t('errors.dateOfBirth'))
      .matches(/^\d{4}-\d{2}-\d{2}$/, t('errors.dateOfBirthFormat')),
    email: emailSchema,
    phone: Yup.string().max(30, t('errors.phoneMax')),
    address: Yup.string().max(500, t('errors.addressMax'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: patient?.name ?? '',
      dateOfBirth: patient?.dateOfBirth ?? '',
      email: patient?.email ?? '',
      phone: patient?.phone ?? '',
      gender: (patient?.gender ?? '') as Gender | '',
      address: patient?.address ?? ''
    },
    validationSchema,
    onSubmit: (values) => {
      const payload: Record<string, string> = {};
      if (values.name) payload.name = values.name;
      if (values.dateOfBirth) payload.dateOfBirth = values.dateOfBirth;
      if (!isEdit && values.email) payload.email = values.email;
      if (values.phone) payload.phone = values.phone;
      if (values.gender) payload.gender = values.gender;
      if (values.address) payload.address = values.address;
      onSubmit(payload as unknown as CreatePatientPayload);
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? t('form.editTitle') : t('form.addTitle')}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label={t('form.name')}
              {...formik.getFieldProps('name')}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              label={t('form.dateOfBirth')}
              placeholder="YYYY-MM-DD"
              {...formik.getFieldProps('dateOfBirth')}
              error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
              helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
            />
            {!isEdit && (
              <TextField
                fullWidth
                label={t('form.email')}
                type="email"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            )}
            <TextField
              fullWidth
              label={t('form.phone')}
              {...formik.getFieldProps('phone')}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <TextField
              fullWidth
              select
              label={t('form.gender')}
              {...formik.getFieldProps('gender')}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
            >
              <MenuItem value="">{t('form.selectGender')}</MenuItem>
              {GENDERS.map((g) => (
                <MenuItem key={g} value={g}>
                  {t(`gender.${g}`)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={2}
              label={t('form.address')}
              {...formik.getFieldProps('address')}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Stack>
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

export default PatientForm;
