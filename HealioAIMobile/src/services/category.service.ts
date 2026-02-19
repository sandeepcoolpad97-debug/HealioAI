import { getApiUrl } from '../config/api.config';
import { firebaseAuth } from '../config/firebaseConfig';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await firebaseAuth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface CategoryDto {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

export const categoryService = {
  getCategories: async (isActive: boolean = true, type?: 'reschedule' | 'cancellation'): Promise<CategoryDto[]> => {
    try {
      let url = getApiUrl(`/categories?page=1&limit=100`);
      if (type) {
        url += `&type=${type}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};
