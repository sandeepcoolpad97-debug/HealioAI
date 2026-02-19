import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

export interface ClinicDto {
  _id: string;
  clinicName: string;
  doctorName: string;
  specialisation: string[];
  address?: string;
  rating?: number;
  image?: string;
  consultationType?: 'in_person' | 'online' | 'both';
  operatingHours?: any[];
  phone?: {
    countryCode: string;
    number: string;
  };
  emailId?: string;
}

export interface ListClinicsResponse {
  success: boolean;
  data: ClinicDto[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await firebaseAuth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || res.statusText);
  }
  return data as T;
}

export const clinicService = {
  getClinics: async (page = 1, limit = 20): Promise<ClinicDto[]> => {
    try {
      const res = await fetch(`${getApiUrl('/clinics')}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<ListClinicsResponse>(res);
      return body.data || [];
    } catch (error) {
      console.error('Error fetching clinics:', error);
      return [];
    }
  },

  getClinicById: async (id: string): Promise<ClinicDto | null> => {
    try {
      const res = await fetch(getApiUrl(`/clinics/${id}`), {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<{ success: boolean; data: ClinicDto }>(res);
      return body.data;
    } catch (error) {
      console.error(`Error fetching clinic ${id}:`, error);
      return null;
    }
  },
};
