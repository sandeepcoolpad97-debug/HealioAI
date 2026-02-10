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
  appointmentId: string;
  doctorId: {
    _id: string;
    doctorName: string;
    specialisation: string;
    clinicName: string;
  };
  userId: string;
  bookingStatus: 'confirmed' | 'rescheduled' | 'cancelled';
  currentStartAt: string;
  appointmentInfo: Array<{
    startAt: string;
    action: string;
    notes?: string;
  }>;
}

// Helper functions must be available for both methods
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

  getAppointments: async (params?: { 
    userId?: string; 
    doctorId?: string; 
    timeframe?: 'upcoming' | 'past';
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<AppointmentDto[]> => {
    try {
        const query = new URLSearchParams();
        if (params?.userId) query.append('userId', params.userId);
        if (params?.doctorId) query.append('doctorId', params.doctorId);
        if (params?.timeframe) query.append('timeframe', params.timeframe);
        if (params?.status) query.append('status', params.status);
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());

        const res = await fetch(`${getApiUrl('/appointments')}?${query.toString()}`, {
            method: 'GET',
            headers: await getAuthHeaders(),
        });
        const body = await handleResponse<{ success: boolean; data: AppointmentDto[] }>(res);
        return body.data || [];
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
  },

  getAppointmentById: async (id: string): Promise<AppointmentDto> => {
    try {
      const res = await fetch(getApiUrl(`/appointments/${id}`), {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<{ success: boolean; data: AppointmentDto }>(res);
      return body.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  },

  rescheduleAppointment: async (
    appointmentId: string, 
    newStartAt: string, 
    reason: string,
    categoryId?: string
  ): Promise<any> => {
    const response = await fetch(`${getApiUrl(`/appointments/${appointmentId}/reschedule`)}`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        newStartAt,
        reason,
        rescheduleCategory: categoryId, 
        notifyPatient: true,
        notifyDoctor: true
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to reschedule appointment');
    }
    
    return response.json();
  },

  cancelAppointment: async (
    appointmentId: string, 
    reason: string,
    categoryId?: string
  ): Promise<any> => {
    const response = await fetch(`${getApiUrl(`/appointments/${appointmentId}/cancel`)}`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        reason,
        cancellationCategory: categoryId,
        notifyPatient: true,
        notifyDoctor: true
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to cancel appointment');
    }
    
    return response.json();
  }
};
