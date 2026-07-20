import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ScaleIcon from '@mui/icons-material/Scale';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateVital, useDeleteVital, useUpdateVital } from '@/hooks/useVitalMutations';
import { useVitals } from '@/hooks/useVitals';
import { useVitalsTrend } from '@/hooks/useVitalsTrend';
import type { CreateVitalSignPayload, UpdateVitalSignPayload, VitalSign } from '@/types/vital';

import VitalSignDeleteDialog from './VitalSignDeleteDialog';
import VitalSignForm from './VitalSignForm';
import VitalSignTable from './VitalSignTable';
import VitalStatCard from './VitalStatCard';
import VitalTrendChart from './VitalTrendChart';

interface VitalSignsProps {
  ns: string;
  patientId: string;
}

const calcTrend = (sorted: VitalSign[], key: keyof VitalSign): 'up' | 'down' | 'stable' | null => {
  const vals = sorted.map((r) => r[key]).filter((v): v is number => typeof v === 'number');
  if (vals.length < 2) return null;
  const diff = vals[vals.length - 1] - vals[vals.length - 2];
  if (Math.abs(diff) < 0.1) return 'stable';
  return diff > 0 ? 'up' : 'down';
};

const VitalSigns: React.FC<VitalSignsProps> = ({ ns, patientId }) => {
  const { t } = useTranslation(ns);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<VitalSign | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<VitalSign | null>(null);
  const [tableOpen, setTableOpen] = useState(false);

  const { data: tableData, isLoading: tableLoading } = useVitals(patientId, { page, pageSize });
  const { data: trendData, isLoading: trendLoading } = useVitalsTrend(patientId);

  const createMutation = useCreateVital(patientId);
  const updateMutation = useUpdateVital(patientId);
  const deleteMutation = useDeleteVital(patientId);

  const handleOpenAdd = () => {
    setEditRecord(null);
    setFormOpen(true);
  };
  const handleOpenEdit = (record: VitalSign) => {
    setEditRecord(record);
    setFormOpen(true);
  };
  const handleFormClose = () => {
    setFormOpen(false);
    setEditRecord(null);
  };
  const handleFormSubmit = async (payload: CreateVitalSignPayload | UpdateVitalSignPayload) => {
    if (editRecord) {
      await updateMutation.mutateAsync({
        id: editRecord.id,
        payload: payload as UpdateVitalSignPayload
      });
    } else {
      await createMutation.mutateAsync(payload as CreateVitalSignPayload);
    }
    handleFormClose();
  };
  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteRecord(null);
  };

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const trendRecords = trendData?.data ?? [];
  const sorted = [...trendRecords].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );
  const latest = sorted[sorted.length - 1];

  const bp =
    latest?.systolicBp != null && latest?.diastolicBp != null
      ? `${latest.systolicBp}/${latest.diastolicBp}`
      : '—';

  const stats = [
    {
      label: t('stats.heartRate'),
      value: latest?.heartRate != null ? String(latest.heartRate) : '—',
      unit: latest?.heartRate != null ? 'bpm' : undefined,
      icon: FavoriteIcon,
      color: 'error' as const,
      trend: calcTrend(sorted, 'heartRate'),
      trendGoodDirection: 'down' as const
    },
    {
      label: t('stats.bloodPressure'),
      value: bp,
      unit: latest?.systolicBp != null ? 'mmHg' : undefined,
      icon: MonitorHeartIcon,
      color: 'primary' as const,
      trend: calcTrend(sorted, 'systolicBp'),
      trendGoodDirection: 'down' as const
    },
    {
      label: t('stats.spo2'),
      value: latest?.spo2 != null ? String(latest.spo2) : '—',
      unit: latest?.spo2 != null ? '%' : undefined,
      icon: WaterDropIcon,
      color: 'info' as const,
      trend: calcTrend(sorted, 'spo2'),
      trendGoodDirection: 'up' as const
    },
    {
      label: t('stats.temperature'),
      value: latest?.temperature != null ? String(latest.temperature) : '—',
      unit: latest?.temperature != null ? '°C' : undefined,
      icon: LocalFireDepartmentIcon,
      color: 'warning' as const,
      trend: calcTrend(sorted, 'temperature'),
      trendGoodDirection: 'neutral' as const
    },
    {
      label: t('stats.weight'),
      value: latest?.weight != null ? String(latest.weight) : '—',
      unit: latest?.weight != null ? 'kg' : undefined,
      icon: ScaleIcon,
      color: 'success' as const,
      trend: calcTrend(sorted, 'weight'),
      trendGoodDirection: 'neutral' as const
    },
    {
      label: t('stats.painScore'),
      value: latest?.painScore != null ? String(latest.painScore) : '—',
      unit: latest?.painScore != null ? '/10' : undefined,
      icon: SentimentNeutralIcon,
      color: 'secondary' as const,
      trend: calcTrend(sorted, 'painScore'),
      trendGoodDirection: 'down' as const
    }
  ];

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          {t('actions.addRecord')}
        </Button>
      </Stack>

      {/* Stat cards */}
      <Stack direction="row" flexWrap="wrap" gap={1.5}>
        {trendLoading
          ? ['hr', 'bp', 'spo2', 'temp', 'wt', 'pain'].map((k) => (
              <Skeleton
                key={k}
                variant="rounded"
                width={160}
                height={80}
                sx={{ borderRadius: 3, flex: 1 }}
              />
            ))
          : stats.map((s) => (
              <VitalStatCard
                key={s.label}
                label={s.label}
                value={s.value}
                unit={s.unit}
                icon={s.icon}
                color={s.color}
                trend={s.trend}
                trendGoodDirection={s.trendGoodDirection}
              />
            ))}
      </Stack>

      {/* Trend charts */}
      {(trendLoading || trendRecords.length > 0) && (
        <Box>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
            {t('chart.title')}
          </Typography>
          {trendLoading ? (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
              <Stack direction="row" spacing={2}>
                <Skeleton variant="rounded" height={190} sx={{ borderRadius: 3, flex: 1 }} />
                <Skeleton variant="rounded" height={190} sx={{ borderRadius: 3, flex: 1 }} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Skeleton variant="rounded" height={190} sx={{ borderRadius: 3, flex: 1 }} />
                <Skeleton variant="rounded" height={190} sx={{ borderRadius: 3, flex: 1 }} />
              </Stack>
            </Stack>
          ) : (
            <VitalTrendChart ns={ns} records={trendRecords} />
          )}
        </Box>
      )}

      {/* Collapsible table */}
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => setTableOpen((o) => !o)}
          sx={{ cursor: 'pointer', userSelect: 'none', py: 0.5 }}
        >
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            {t('allRecords')}
            {tableData?.total != null && (
              <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                ({tableData.total})
              </Typography>
            )}
          </Typography>
          <IconButton size="small">
            <ExpandMoreIcon
              fontSize="small"
              sx={{
                transform: tableOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s'
              }}
            />
          </IconButton>
        </Stack>
        <Divider />
        <Collapse in={tableOpen} unmountOnExit>
          <Box sx={{ mt: 1.5 }}>
            <VitalSignTable
              ns={ns}
              records={tableData?.data ?? []}
              total={tableData?.total ?? 0}
              page={page}
              pageSize={pageSize}
              loading={tableLoading}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onEdit={handleOpenEdit}
              onDelete={setDeleteRecord}
            />
          </Box>
        </Collapse>
      </Box>

      <VitalSignForm
        ns={ns}
        open={formOpen}
        record={editRecord}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        loading={isMutating}
      />
      <VitalSignDeleteDialog
        ns={ns}
        record={deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
      />
    </Stack>
  );
};

export default VitalSigns;
