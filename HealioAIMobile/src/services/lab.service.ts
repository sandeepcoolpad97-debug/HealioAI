import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

export interface LabDto {
  _id: string;
  labName: string;
  address?: string;
  rating?: number;
  services?: {
    homeSampleCollection?: boolean;
    testCategories?: string[];
  };
  operatingHours?: any[];
  phone?: {
    countryCode: string;
    number: string;
  };
  emailId?: string;
}

export interface ListLabsResponse {
  success: boolean;
  data: LabDto[];
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

export const labService = {
  getLabs: async (page = 1, limit = 20): Promise<LabDto[]> => {
    try {
      const res = await fetch(`${getApiUrl('/labs')}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<ListLabsResponse>(res);
      return body.data || [];
    } catch (error) {
      console.error('Error fetching labs:', error);
      return [];
    }
  },

  getLabById: async (id: string): Promise<LabDto | null> => {
    try {
      const res = await fetch(getApiUrl(`/labs/${id}`), {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<{ success: boolean; data: LabDto }>(res);
      return body.data;
    } catch (error) {
      console.error(`Error fetching lab ${id}:`, error);
      return null;
    }
  },
};
