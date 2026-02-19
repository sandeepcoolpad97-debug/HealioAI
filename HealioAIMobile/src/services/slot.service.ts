import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

export interface SlotDto {
  _id: string;
  doctorId: string;
  date: string;
  slotStartAt: string;
  slotEndAt: string;
  status: 'available' | 'locked' | 'booked' | 'cancelled';
}

export interface ListSlotsResponse {
  success: boolean;
  data: SlotDto[];
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

export const slotService = {
  getSlots: async (doctorId: string, date: string, status?: string): Promise<SlotDto[]> => {
    try {
      // Query params: doctorId, date, optional status
      const params: Record<string, string> = { doctorId, date };
      if (status) params.status = status;
      
      const query = new URLSearchParams(params).toString();
      
      const res = await fetch(`${getApiUrl('/slots')}?${query}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<ListSlotsResponse>(res);
      return body.data || [];
    } catch (error) {
      console.error('Error fetching slots:', error);
      return [];
    }
  },

  generateSlots: async (payload: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
  }): Promise<SlotDto[]> => {
    try {
      const res = await fetch(getApiUrl('/slots/generate'), {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const body = await handleResponse<{ success: boolean; data: SlotDto[] }>(res);
      return body.data || [];
    } catch (error) {
      console.error('Error generating slots:', error);
      throw error;
    }
  },

  lockSlot: async (slotId: string): Promise<SlotDto | null> => {
    try {
      const res = await fetch(getApiUrl(`/slots/${slotId}/lock`), {
        method: 'POST',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<{ success: boolean; data: SlotDto }>(res);
      return body.data;
    } catch (error) {
      console.error(`Error locking slot ${slotId}:`, error);
      throw error;
    }
  },

  unlockSlot: async (slotId: string): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl(`/slots/${slotId}/unlock`), {
        method: 'POST',
        headers: await getAuthHeaders(),
      });
      await handleResponse(res);
      return true;
    } catch (error) {
      console.error(`Error unlocking slot ${slotId}:`, error);
      return false;
    }
  }
};
