import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

export interface CreateReviewPayload {
  appointmentId: string;
  userId: string;
  reviewFor: 'Clinic' | 'Lab';
  reviewForId: string;
  rating: number;
  comment?: string;
}

export interface ReviewDto {
  _id: string;
  appointmentId: string;
  userId: string;
  reviewFor: 'Clinic' | 'Lab';
  reviewForId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
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

export const reviewService = {
  createReview: async (payload: CreateReviewPayload): Promise<ReviewDto> => {
    try {
      const res = await fetch(getApiUrl('/reviews'), {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const body = await handleResponse<{ success: boolean; data: ReviewDto }>(res);
      return body.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  getReviews: async (params?: {
    userId?: string;
    reviewFor?: 'Clinic' | 'Lab';
    reviewForId?: string;
    page?: number;
    limit?: number;
  }): Promise<ReviewDto[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.userId) query.append('userId', params.userId);
      if (params?.reviewFor) query.append('reviewFor', params.reviewFor);
      if (params?.reviewForId) query.append('reviewForId', params.reviewForId);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.limit) query.append('limit', params.limit.toString());

      const res = await fetch(`${getApiUrl('/reviews')}?${query.toString()}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<{ success: boolean; data: ReviewDto[] }>(res);
      return body.data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  getReviewById: async (id: string): Promise<ReviewDto> => {
    try {
      const res = await fetch(`${getApiUrl(`/reviews/${id}`)}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const body = await handleResponse<{ success: boolean; data: ReviewDto }>(res);
      return body.data;
    } catch (error) {
      console.error('Error fetching review by ID:', error);
      throw error;
    }
  },
};
