export interface VitalSign {
  id: string;
  patientId: string;
  recordedAt: string;
  heartRate: number | null;
  respiratoryRate: number | null;
  spo2: number | null;
  systolicBp: number | null;
  diastolicBp: number | null;
  temperature: number | null;
  weight: number | null;
  height: number | null;
  painScore: number | null;
  recordedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VitalSignListResponse {
  data: VitalSign[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateVitalSignPayload {
  recordedAt: string;
  heartRate?: number;
  respiratoryRate?: number;
  spo2?: number;
  systolicBp?: number;
  diastolicBp?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  painScore?: number;
  recordedBy?: string;
  notes?: string;
}

export type UpdateVitalSignPayload = Partial<CreateVitalSignPayload>;
