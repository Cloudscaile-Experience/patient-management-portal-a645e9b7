export type MedicationRoute =
  | 'oral'
  | 'iv'
  | 'im'
  | 'subcutaneous'
  | 'topical'
  | 'inhaled'
  | 'sublingual'
  | 'other';

export type MedicationStatus = 'active' | 'discontinued' | 'completed' | 'on_hold';

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName: string | null;
  dosage: string;
  route: MedicationRoute;
  frequency: string;
  startDate: string;
  endDate: string | null;
  prescriber: string | null;
  status: MedicationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationListResponse {
  data: Medication[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateMedicationPayload {
  name: string;
  genericName?: string;
  dosage: string;
  route: MedicationRoute;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescriber?: string;
  status?: MedicationStatus;
  notes?: string;
}

export type UpdateMedicationPayload = Partial<CreateMedicationPayload>;
