import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

export interface CreateAppointmentPayload {
  doctorId: string;
  userId: string;
  paymentId: string;
  currentStartAt: string;
  consultationType: 'online' | 'in_person';
  consultationDuration: number;
  appointmentInfo: Array<{
    startAt: string;
    action: 'booked';
    notes?: string;
    symptoms?: string[];
  }>;
}

export interface AppointmentDto {
  _id: string;
  doctorId: string;
  userId: string;
  status: string;
  appointmentInfo: Array<{
    startAt: string;
    action: string;
  }>;
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

export const appointmentService = {
  createAppointment: async (payload: CreateAppointmentPayload): Promise<AppointmentDto> => {
    try {
      const res = await fetch(getApiUrl('/appointments'), {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const body = await handleResponse<{ success: boolean; data: AppointmentDto }>(res);
      return body.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  getAppointments: async (): Promise<AppointmentDto[]> => {
    try {
        const res = await fetch(getApiUrl('/appointments'), {
            method: 'GET',
            headers: await getAuthHeaders(),
        });
        const body = await handleResponse<{ success: boolean; data: AppointmentDto[] }>(res);
        return body.data || [];
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
  }
};
