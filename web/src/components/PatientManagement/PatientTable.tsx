import {
  Box,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/ui';
import type { Patient } from '@/types/patient';

import PatientRow from './PatientRow';

interface ColDef {
  key: string;
  width: string;
  align?: 'right';
}

const COLUMNS: ColDef[] = [
  { key: 'table.name', width: '28%' },
  { key: 'table.dateOfBirth', width: '16%' },
  { key: 'table.gender', width: '12%' },
  { key: 'table.phone', width: '12%' },
  { key: 'table.email', width: '12%' },
  { key: 'table.actions', width: '20%', align: 'right' }
];

const SKELETON_ROWS = ['sk-a', 'sk-b', 'sk-c', 'sk-d', 'sk-e'];

interface PatientTableProps {
  ns: string;
  patients: Patient[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  ns,
  patients,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation(ns);

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              {COLUMNS.map(({ key, width, align }) => (
                <TableCell key={key} align={align ?? 'left'} sx={{ width, py: 1.25, px: 2 }}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                  >
                    {t(key)}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              SKELETON_ROWS.map((key) => (
                <TableRow key={key}>
                  {/* Patient skeleton: avatar + two lines */}
                  <TableCell sx={{ py: 1.5, px: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Skeleton variant="circular" width={36} height={36} />
                      <Box>
                        <Skeleton variant="text" width={120} height={16} />
                        <Skeleton variant="text" width={160} height={13} sx={{ mt: 0.5 }} />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ px: 2 }}>
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="text" width={40} sx={{ mt: 0.25 }} />
                  </TableCell>
                  <TableCell sx={{ px: 2 }}>
                    <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 10 }} />
                  </TableCell>
                  <TableCell sx={{ px: 2 }}>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell sx={{ px: 2 }} />
                </TableRow>
              ))}

            {!loading && patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} sx={{ border: 0, py: 4 }}>
                  <EmptyState title={t('table.noResults')} description={t('table.noResultsHint')} />
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              patients.map((patient) => (
                <PatientRow
                  key={patient.id}
                  ns={ns}
                  patient={patient}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage={t('pagination.rowsPerPage')}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
        />
      </Box>
    </Paper>
  );
};

export default PatientTable;
