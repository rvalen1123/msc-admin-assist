/**
 * API client for communicating with the backend
 * Sets up axios with interceptors for authentication and error handling
 */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Use relative URLs for API requests, which will be handled by Vite's proxy
const API_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Type-safe API request helpers
export const apiService = {
  /**
   * GET request to the API
   * @param url - API endpoint
   * @param params - Query parameters
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  /**
   * POST request to the API
   * @param url - API endpoint
   * @param data - Request payload
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  /**
   * PUT request to the API
   * @param url - API endpoint
   * @param data - Request payload
   */
  async put<T>(url: string, data: any): Promise<T> {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  /**
   * PATCH request to the API
   * @param url - API endpoint
   * @param data - Request payload
   */
  async patch<T>(url: string, data: any): Promise<T> {
    const response = await api.patch<T>(url, data);
    return response.data;
  },

  /**
   * DELETE request to the API
   * @param url - API endpoint
   */
  async delete<T>(url: string): Promise<T> {
    const response = await api.delete<T>(url);
    return response.data;
  }
}; 