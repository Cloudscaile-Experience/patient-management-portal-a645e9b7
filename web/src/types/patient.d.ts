export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string | null;
  gender: Gender | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientListResponse {
  data: Patient[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreatePatientPayload {
  name: string;
  dateOfBirth: string;
  email: string;
  phone?: string;
  gender?: Gender;
  address?: string;
}

export interface UpdatePatientPayload {
  name?: string;
  dateOfBirth?: string;
  phone?: string;
  gender?: Gender;
  address?: string;
}
