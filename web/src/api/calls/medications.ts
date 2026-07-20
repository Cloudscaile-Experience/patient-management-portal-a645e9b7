import { extensionManager } from '@/utils/extension';

import type {
  CreateMedicationPayload,
  Medication,
  MedicationListResponse,
  MedicationStatus,
  UpdateMedicationPayload
} from '@/types/medication';

interface ListMedicationsParams {
  page?: number;
  pageSize?: number;
  status?: MedicationStatus;
}

class MedicationsApi {
  private get axios() {
    return extensionManager.getExtAxios();
  }

  async list(
    patientId: string,
    params: ListMedicationsParams = {}
  ): Promise<MedicationListResponse> {
    const { data } = await this.axios.get<MedicationListResponse>(
      `/v1/patients/${patientId}/medications/`,
      { params }
    );
    return data;
  }

  async getById(patientId: string, id: string): Promise<Medication> {
    const { data } = await this.axios.get<Medication>(
      `/v1/patients/${patientId}/medications/${id}`
    );
    return data;
  }

  async create(patientId: string, payload: CreateMedicationPayload): Promise<Medication> {
    const { data } = await this.axios.post<Medication>(
      `/v1/patients/${patientId}/medications/`,
      payload
    );
    return data;
  }

  async update(
    patientId: string,
    id: string,
    payload: UpdateMedicationPayload
  ): Promise<Medication> {
    const { data } = await this.axios.patch<Medication>(
      `/v1/patients/${patientId}/medications/${id}`,
      payload
    );
    return data;
  }

  async remove(patientId: string, id: string): Promise<void> {
    await this.axios.delete(`/v1/patients/${patientId}/medications/${id}`);
  }
}

export const medicationsApi = new MedicationsApi();
