import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Chip, Grid, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateMedication,
  useDeleteMedication,
  useUpdateMedication
} from '@/hooks/useMedicationMutations';
import { useMedications } from '@/hooks/useMedications';
import type {
  CreateMedicationPayload,
  Medication,
  MedicationStatus,
  UpdateMedicationPayload
} from '@/types/medication';

import { EmptyState } from '@/components/ui';
import MedicationCard from './MedicationCard';
import MedicationDeleteDialog from './MedicationDeleteDialog';
import MedicationForm from './MedicationForm';

type FilterTab = 'all' | MedicationStatus;

const TABS: FilterTab[] = ['all', 'active', 'on_hold', 'completed', 'discontinued'];

const STATUS_COLOR: Record<MedicationStatus, 'success' | 'warning' | 'default' | 'error'> = {
  active: 'success',
  on_hold: 'warning',
  completed: 'default',
  discontinued: 'error'
};

interface MedicationsProps {
  ns: string;
  patientId: string;
}

const Medications: React.FC<MedicationsProps> = ({ ns, patientId }) => {
  const { t } = useTranslation(ns);

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editMedication, setEditMedication] = useState<Medication | null>(null);
  const [deleteMedication, setDeleteMedication] = useState<Medication | null>(null);

  const { data, isLoading } = useMedications(patientId, {
    page,
    pageSize: 50,
    status: activeTab === 'all' ? undefined : activeTab
  });

  const allData = useMedications(patientId, { pageSize: 100 });
  const allMeds = allData.data?.data ?? [];

  const counts: Record<MedicationStatus, number> = {
    active: allMeds.filter((m) => m.status === 'active').length,
    on_hold: allMeds.filter((m) => m.status === 'on_hold').length,
    completed: allMeds.filter((m) => m.status === 'completed').length,
    discontinued: allMeds.filter((m) => m.status === 'discontinued').length
  };

  const createMutation = useCreateMedication(patientId);
  const updateMutation = useUpdateMedication(patientId);
  const deleteMutation = useDeleteMedication(patientId);

  const handleOpenAdd = () => {
    setEditMedication(null);
    setFormOpen(true);
  };
  const handleOpenEdit = (m: Medication) => {
    setEditMedication(m);
    setFormOpen(true);
  };
  const handleFormClose = () => {
    setFormOpen(false);
    setEditMedication(null);
  };
  const handleFormSubmit = async (payload: CreateMedicationPayload | UpdateMedicationPayload) => {
    if (editMedication) {
      await updateMutation.mutateAsync({
        id: editMedication.id,
        payload: payload as UpdateMedicationPayload
      });
    } else {
      await createMutation.mutateAsync(payload as CreateMedicationPayload);
    }
    handleFormClose();
  };
  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteMedication(null);
  };

  const medications = data?.data ?? [];

  return (
    <Stack spacing={2.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        {/* Status summary chips */}
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {(Object.entries(counts) as [MedicationStatus, number][])
            .filter(([, count]) => count > 0)
            .map(([status, count]) => (
              <Chip
                key={status}
                label={`${t(`summary.${status}`)}: ${count}`}
                size="small"
                color={STATUS_COLOR[status]}
                variant="outlined"
                onClick={() => {
                  setActiveTab(status);
                  setPage(1);
                }}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            ))}
        </Stack>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          {t('actions.addMedication')}
        </Button>
      </Stack>

      {/* Filter tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => {
            setActiveTab(v);
            setPage(1);
          }}
          sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: 13 } }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab}
              value={tab}
              label={
                tab === 'all'
                  ? t('summary.all')
                  : `${t(`summary.${tab}`)}${counts[tab as MedicationStatus] > 0 ? ` (${counts[tab as MedicationStatus]})` : ''}`
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Cards grid */}
      {isLoading ? (
        <Grid container spacing={2}>
          {['sk-a', 'sk-b', 'sk-c', 'sk-d'].map((k) => (
            <Grid key={k} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : medications.length === 0 ? (
        <EmptyState title={t('table.noResults')} description={t('table.noResultsHint')} />
      ) : (
        <Grid container spacing={2}>
          {medications.map((med) => (
            <Grid key={med.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <MedicationCard
                ns={ns}
                medication={med}
                onEdit={handleOpenEdit}
                onDelete={setDeleteMedication}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {data && data.total > 50 && (
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ pt: 1 }}>
          <Button size="small" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: '30px' }}>
            Page {page} of {Math.ceil(data.total / 50)}
          </Typography>
          <Button
            size="small"
            disabled={page >= Math.ceil(data.total / 50)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Stack>
      )}

      <MedicationForm
        ns={ns}
        open={formOpen}
        medication={editMedication}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
      />
      <MedicationDeleteDialog
        ns={ns}
        medication={deleteMedication}
        onClose={() => setDeleteMedication(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
      />
    </Stack>
  );
};

export default Medications;
