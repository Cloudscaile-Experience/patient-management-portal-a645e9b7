import { extensionManager } from '@/utils/extension';

import type {
  CreatePatientPayload,
  Patient,
  PatientListResponse,
  UpdatePatientPayload
} from '@/types/patient';

interface ListPatientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

class PatientsApi {
  private get axios() {
    return extensionManager.getExtAxios();
  }

  async list(params: ListPatientsParams = {}): Promise<PatientListResponse> {
    const { data } = await this.axios.get<PatientListResponse>('/v1/patients/', { params });
    return data;
  }

  async getById(id: string): Promise<Patient> {
    const { data } = await this.axios.get<Patient>(`/v1/patients/${id}`);
    return data;
  }

  async create(payload: CreatePatientPayload): Promise<Patient> {
    const { data } = await this.axios.post<Patient>('/v1/patients/', payload);
    return data;
  }

  async update(id: string, payload: UpdatePatientPayload): Promise<Patient> {
    const { data } = await this.axios.patch<Patient>(`/v1/patients/${id}`, payload);
    return data;
  }

  async remove(id: string): Promise<void> {
    await this.axios.delete(`/v1/patients/${id}`);
  }
}

export const patientsApi = new PatientsApi();
