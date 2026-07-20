import { extensionManager } from '@/utils/extension';

import type {
  CreateVitalSignPayload,
  UpdateVitalSignPayload,
  VitalSign,
  VitalSignListResponse
} from '@/types/vital';

interface ListVitalsParams {
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
}

class VitalsApi {
  private get axios() {
    return extensionManager.getExtAxios();
  }

  async list(patientId: string, params: ListVitalsParams = {}): Promise<VitalSignListResponse> {
    const { data } = await this.axios.get<VitalSignListResponse>(
      `/v1/patients/${patientId}/vitals/`,
      { params }
    );
    return data;
  }

  async getById(patientId: string, id: string): Promise<VitalSign> {
    const { data } = await this.axios.get<VitalSign>(`/v1/patients/${patientId}/vitals/${id}`);
    return data;
  }

  async create(patientId: string, payload: CreateVitalSignPayload): Promise<VitalSign> {
    const { data } = await this.axios.post<VitalSign>(`/v1/patients/${patientId}/vitals/`, payload);
    return data;
  }

  async update(patientId: string, id: string, payload: UpdateVitalSignPayload): Promise<VitalSign> {
    const { data } = await this.axios.patch<VitalSign>(
      `/v1/patients/${patientId}/vitals/${id}`,
      payload
    );
    return data;
  }

  async remove(patientId: string, id: string): Promise<void> {
    await this.axios.delete(`/v1/patients/${patientId}/vitals/${id}`);
  }
}

export const vitalsApi = new VitalsApi();
