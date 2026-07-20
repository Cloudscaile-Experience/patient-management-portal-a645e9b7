import { Suspense, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import App from '@/App';
import PatientDetail from '@/components/PatientDetail';
import PatientForm from '@/components/PatientManagement/PatientForm';
import { LoadingSpinner } from '@/components/ui';
import { useUpdatePatient } from '@/hooks/usePatientMutations';
import { usePatient } from '@/hooks/usePatients';
import medicationsTranslations from '@/locales/medications.json';
import patientsTranslations from '@/locales/patients.json';
import vitalsTranslations from '@/locales/vitals.json';
import type { UpdatePatientPayload } from '@/types/patient';
import { extensionManager } from '@/utils/extension';

const patientsNs = extensionManager.getNsForTranslation('patients');
const vitalsNs = extensionManager.getNsForTranslation('vitals');
const medicationsNs = extensionManager.getNsForTranslation('medications');

extensionManager.registerTranslation(patientsNs, patientsTranslations);
extensionManager.registerTranslation(vitalsNs, vitalsTranslations);
extensionManager.registerTranslation(medicationsNs, medicationsTranslations);

interface PatientDetailInnerProps {
  patientId: string;
  backRoute?: string;
}

const PatientDetailInner: React.FC<PatientDetailInnerProps> = ({ patientId, backRoute }) => {
  const navigate = useNavigate();
  const { data: patient, isLoading } = usePatient(patientId);
  const updateMutation = useUpdatePatient();
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return <LoadingSpinner fullHeight label="Loading patient..." />;
  if (!patient) return null;

  const handleBack = backRoute ? () => navigate(backRoute) : undefined;

  const handleEditSubmit = async (payload: UpdatePatientPayload) => {
    await updateMutation.mutateAsync({ id: patient.id, payload });
    setEditOpen(false);
  };

  return (
    <>
      <PatientDetail
        patientsNs={patientsNs}
        vitalsNs={vitalsNs}
        medicationsNs={medicationsNs}
        patient={patient}
        onBack={handleBack}
        onEdit={() => setEditOpen(true)}
      />
      <PatientForm
        ns={patientsNs}
        open={editOpen}
        patient={patient}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        loading={updateMutation.isPending}
      />
    </>
  );
};

interface PatientDetailContainerProps {
  patientId?: string;
  backRoute?: string;
}

const PatientDetailContainer: React.FC<PatientDetailContainerProps> = ({
  patientId: patientIdProp,
  backRoute
}) => {
  const params = useParams<{ patientId: string }>();
  const resolvedPatientId = patientIdProp ?? params.patientId ?? '';

  return (
    <App>
      <Suspense fallback={<LoadingSpinner fullHeight label="Loading..." />}>
        <PatientDetailInner patientId={resolvedPatientId} backRoute={backRoute} />
      </Suspense>
    </App>
  );
};

export default PatientDetailContainer;
