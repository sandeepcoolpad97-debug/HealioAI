import axios from 'axios';

/**
 * API client for healioaibackend using Axios.
 * Base URL: VITE_API_BASE_URL or default http://localhost:3000/api
 */
const getBaseUrl = () => {
  const env = typeof import.meta !== 'undefined' && import.meta.env;
  return (env && env.VITE_API_BASE_URL) || 'http://localhost:3000/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Check localStorage first, then sessionStorage
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = new Error(
      error.response?.data?.message || error.message || 'Request failed'
    );
    customError.status = error.response?.status;
    customError.details = error.response?.data;
    return Promise.reject(customError);
  }
);

export { getBaseUrl };
