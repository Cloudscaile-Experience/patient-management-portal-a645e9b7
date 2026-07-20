import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { PageHeader } from '@/components/ui';
import { useCreatePatient, useDeletePatient, useUpdatePatient } from '@/hooks/usePatientMutations';
import { usePatients } from '@/hooks/usePatients';
import type { CreatePatientPayload, Patient, UpdatePatientPayload } from '@/types/patient';

import PatientDeleteDialog from './PatientDeleteDialog';
import PatientForm from './PatientForm';
import PatientTable from './PatientTable';

interface PatientManagementProps {
  ns: string;
  patientDetailBasePath?: string;
}

const PatientManagement: React.FC<PatientManagementProps> = ({ ns, patientDetailBasePath }) => {
  const { t } = useTranslation(ns);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

  const { data, isLoading } = usePatients({ page, pageSize, search: search || undefined });

  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  const handleOpenAdd = () => {
    setEditPatient(null);
    setFormOpen(true);
  };
  const handleOpenEdit = (patient: Patient) => {
    setEditPatient(patient);
    setFormOpen(true);
  };
  const handleFormClose = () => {
    setFormOpen(false);
    setEditPatient(null);
  };
  const handleFormSubmit = async (payload: CreatePatientPayload | UpdatePatientPayload) => {
    if (editPatient) {
      await updateMutation.mutateAsync({
        id: editPatient.id,
        payload: payload as UpdatePatientPayload
      });
    } else {
      await createMutation.mutateAsync(payload as CreatePatientPayload);
    }
    handleFormClose();
  };
  const handleDeleteConfirm = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeletePatient(null);
  };
  const handleViewPatient = (patient: Patient) => {
    if (patientDetailBasePath) {
      navigate(`${patientDetailBasePath}/${patient.id}`);
    }
  };

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const total = data?.total ?? 0;

  return (
    <Stack sx={{ height: '100%' }}>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            {t('actions.addPatient')}
          </Button>
        }
      />

      <Stack spacing={2} sx={{ p: 3, flex: 1 }}>
        {/* Toolbar */}
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder={t('search.placeholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{ flex: 1, maxWidth: 480, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />

          {/* Result count */}
          {!isLoading && (
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">
                {search
                  ? t('search.results', { count: total })
                  : t('search.total', { count: total })}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Table */}
        <Box sx={{ flex: 1 }}>
          <PatientTable
            ns={ns}
            patients={data?.data ?? []}
            total={total}
            page={page}
            pageSize={pageSize}
            loading={isLoading}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onView={handleViewPatient}
            onEdit={handleOpenEdit}
            onDelete={setDeletePatient}
          />
        </Box>
      </Stack>

      <PatientForm
        ns={ns}
        open={formOpen}
        patient={editPatient}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        loading={isMutating}
      />
      <PatientDeleteDialog
        ns={ns}
        patient={deletePatient}
        onClose={() => setDeletePatient(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
      />
    </Stack>
  );
};

export default PatientManagement;
