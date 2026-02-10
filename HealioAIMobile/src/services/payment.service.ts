import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

export interface CreatePaymentPayload {
  userId: string;
  paymentFor: {
    serviceId: string;
    refId: string;
  };
  provider: 'razorpay' | 'stripe' | 'cash';
  paidVia: 'razorpay' | 'stripe' | 'cash' | 'upi' | 'card';
  paymentSummary: {
    serviceFee: number;
    discount: number;
    sgst: number;
    cgst: number;
    totalPayable: number;
  };
  paymentStatus?: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  paidAt?: string;
}

export interface PaymentDto {
  _id: string;
  userId: string;
  paymentStatus: string;
  amount: number;
  currency: string;
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

export const paymentService = {
  createPayment: async (payload: CreatePaymentPayload): Promise<PaymentDto> => {
    try {
      const res = await fetch(getApiUrl('/payments'), {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const body = await handleResponse<{ success: boolean; data: PaymentDto }>(res);
      return body.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },
};
