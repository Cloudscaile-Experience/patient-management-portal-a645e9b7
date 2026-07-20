import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Medications from '@/components/Medications';
import VitalSigns from '@/components/VitalSigns';
import { useMedications } from '@/hooks/useMedications';
import { useVitalsTrend } from '@/hooks/useVitalsTrend';
import type { Patient } from '@/types/patient';
import { dateTimeView } from '@/utils/dateTime';
import { getPatientAvatarColor, getPatientInitials } from '@/utils/helpers';

interface PatientDetailProps {
  patientsNs: string;
  vitalsNs: string;
  medicationsNs: string;
  patient: Patient;
  onBack?: () => void;
  onEdit?: () => void;
}

interface InfoFieldProps {
  label: string;
  value: string | null | undefined;
  icon: React.ReactNode;
  placeholder?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon, placeholder = '—' }) => (
  <Stack spacing={0.25}>
    <Typography
      variant="caption"
      color="text.disabled"
      fontWeight={600}
      textTransform="uppercase"
      letterSpacing={0.4}
    >
      {label}
    </Typography>
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Box sx={{ color: value ? 'text.secondary' : 'text.disabled', display: 'flex' }}>{icon}</Box>
      <Typography variant="body2" color={value ? 'text.primary' : 'text.disabled'} noWrap>
        {value ?? placeholder}
      </Typography>
    </Stack>
  </Stack>
);

interface StatPillProps {
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  color: 'primary' | 'success' | 'error' | 'warning' | 'info';
  loading?: boolean;
}

const StatPill: React.FC<StatPillProps> = ({ icon, primary, secondary, color, loading }) => (
  <Paper
    variant="outlined"
    sx={{ borderRadius: 2.5, px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 1.5 }}
  >
    <Box
      sx={{
        p: 0.75,
        borderRadius: 1.5,
        bgcolor: `${color}.main`,
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}
    >
      {icon}
    </Box>
    <Box>
      {loading ? (
        <>
          <Skeleton width={60} height={16} />
          <Skeleton width={90} height={12} sx={{ mt: 0.25 }} />
        </>
      ) : (
        <>
          <Typography variant="body2" fontWeight={700} color={`${color}.main`} lineHeight={1.2}>
            {primary}
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
            {secondary}
          </Typography>
        </>
      )}
    </Box>
  </Paper>
);

const PatientDetail: React.FC<PatientDetailProps> = ({
  patientsNs,
  vitalsNs,
  medicationsNs,
  patient,
  onBack,
  onEdit
}) => {
  const { t } = useTranslation(patientsNs);
  const [activeTab, setActiveTab] = useState(0);

  const age = dayjs().diff(dayjs(patient.dateOfBirth), 'year');
  const patientSince = dayjs(patient.createdAt).format('MMM YYYY');

  const { data: medsData, isLoading: medsLoading } = useMedications(patient.id, {
    status: 'active',
    pageSize: 1
  });
  const { data: vitalsData, isLoading: vitalsLoading } = useVitalsTrend(patient.id);

  const activeMedCount = medsData?.total ?? 0;

  const sortedVitals = [...(vitalsData?.data ?? [])].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );
  const lastVital = sortedVitals[0];
  const vitalsTotal = vitalsData?.total ?? 0;
  const medsTotal = medsData?.total ?? 0;

  return (
    <Stack sx={{ height: '100%' }}>
      {/* ── Top bar ── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, pt: 2, pb: 1.5 }}
      >
        {onBack ? (
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            {t('detail.back')}
          </Button>
        ) : (
          <Box />
        )}
        {onEdit && (
          <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
            {t('detail.edit')}
          </Button>
        )}
      </Stack>

      {/* ── Hero header ── */}
      <Box sx={{ px: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="flex-start" spacing={2.5}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: getPatientAvatarColor(patient.name),
              fontSize: 22,
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            {getPatientInitials(patient.name)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom={false}>
              {patient.name}
            </Typography>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={0.75} sx={{ mt: 0.5 }}>
              {!Number.isNaN(age) && age >= 0 && (
                <Typography variant="body2" color="text.secondary">
                  {t('detail.age', { count: age })}
                </Typography>
              )}
              {patient.gender && (
                <>
                  <Box
                    sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }}
                  />
                  <Chip
                    label={t(`gender.${patient.gender}`)}
                    size="small"
                    sx={{ height: 20, fontSize: 11, fontWeight: 600 }}
                  />
                </>
              )}
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">
                {t('detail.patientSince')} {patientSince}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* ── Info card ── */}
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5, mt: 2.5 }}>
          <Grid container spacing={2.5} rowSpacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoField
                label={t('detail.dob')}
                value={patient.dateOfBirth}
                icon={
                  <Box component="span" sx={{ fontSize: 14 }}>
                    🗓
                  </Box>
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoField
                label={t('detail.email')}
                value={patient.email}
                icon={<EmailOutlinedIcon sx={{ fontSize: 15 }} />}
                placeholder={t('detail.email')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoField
                label={t('detail.phone')}
                value={patient.phone}
                icon={<PhoneOutlinedIcon sx={{ fontSize: 15 }} />}
                placeholder={t('detail.nophone')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InfoField
                label={t('detail.address')}
                value={patient.address}
                icon={<HomeOutlinedIcon sx={{ fontSize: 15 }} />}
                placeholder={t('detail.noaddress')}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ── Quick stat pills ── */}
        <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 2 }}>
          <StatPill
            icon={<MedicationOutlinedIcon sx={{ fontSize: 18 }} />}
            primary={
              activeMedCount > 0
                ? t('detail.activeMeds', { count: activeMedCount })
                : t('detail.noMeds')
            }
            secondary={t('detail.medicationsLabel')}
            color="primary"
            loading={medsLoading}
          />
          <StatPill
            icon={<FavoriteOutlinedIcon sx={{ fontSize: 18 }} />}
            primary={lastVital ? dateTimeView(lastVital.recordedAt) : t('detail.noVitals')}
            secondary={t('detail.lastVitals')}
            color={lastVital ? 'success' : 'warning'}
            loading={vitalsLoading}
          />
        </Stack>
      </Box>

      <Divider />

      {/* ── Tabs ── */}
      <Box sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ minHeight: 44 }}>
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <span>{t('detail.tabs.vitals')}</span>
                {vitalsTotal > 0 && (
                  <Chip
                    label={vitalsTotal}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      pointerEvents: 'none',
                      bgcolor: 'text.secondary',
                      '& .MuiChip-label': { color: 'white', px: 0.75 }
                    }}
                  />
                )}
              </Stack>
            }
            sx={{ minHeight: 44 }}
          />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <span>{t('detail.tabs.medications')}</span>
                {medsTotal > 0 && (
                  <Chip
                    label={medsTotal}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      pointerEvents: 'none',
                      bgcolor: 'primary.main',
                      '& .MuiChip-label': { color: 'white', px: 0.75 }
                    }}
                  />
                )}
              </Stack>
            }
            sx={{ minHeight: 44 }}
          />
        </Tabs>
      </Box>

      {/* ── Tab content ── */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {activeTab === 0 && <VitalSigns ns={vitalsNs} patientId={patient.id} />}
        {activeTab === 1 && <Medications ns={medicationsNs} patientId={patient.id} />}
      </Box>
    </Stack>
  );
};

export default PatientDetail;
