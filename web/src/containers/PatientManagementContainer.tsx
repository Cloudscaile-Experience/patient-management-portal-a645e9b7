import { Suspense } from 'react';

import App from '@/App';
import PatientManagement from '@/components/PatientManagement';
import { LoadingSpinner } from '@/components/ui';
import patientsTranslations from '@/locales/patients.json';
import { extensionManager } from '@/utils/extension';

const ns = extensionManager.getNsForTranslation('patients');
extensionManager.registerTranslation(ns, patientsTranslations);

interface PatientManagementContainerProps {
  patientDetailBasePath?: string;
}

const PatientManagementContainer: React.FC<PatientManagementContainerProps> = ({
  patientDetailBasePath
}) => (
  <App>
    <Suspense fallback={<LoadingSpinner fullHeight label="Loading..." />}>
      <PatientManagement ns={ns} patientDetailBasePath={patientDetailBasePath} />
    </Suspense>
  </App>
);

export default PatientManagementContainer;
