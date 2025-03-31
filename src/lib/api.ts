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

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(localStorage.getItem('auth_token') || '');
    }
  });
  failedQueue = [];
};

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
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post<{ tokens: { accessToken: string; refreshToken: string; expiresIn: number } }>(
          '/auth/refresh',
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.tokens;
        
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        localStorage.setItem('token_expiry', (Date.now() + expiresIn * 1000).toString());

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Clear auth data and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
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