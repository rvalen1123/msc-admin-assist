/**
 * API client for communicating with the backend
 * Sets up axios with interceptors for authentication and error handling
 */
import axios, { 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { ApiError, AuthTokens } from '@/types';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // In production, assuming the server is on the same domain
  : 'http://localhost:3000'; // In development, pointing to NestJS server

interface ErrorResponseData {
  message: string;
  error?: string;
}

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: ApiError) => void;
}

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: ApiError | null = null) => {
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
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

const createApiError = (
  error: AxiosError<ErrorResponseData>,
  code: string,
  defaultMessage: string
): ApiError => ({
  code,
  message: error.response?.data?.message || defaultMessage,
  response: error.response && {
    status: error.response.status,
    data: {
      message: error.response.data?.message || defaultMessage,
      error: error.response.data?.error
    }
  }
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponseData>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise<string>((resolve, reject) => {
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

        const response = await api.post<{ tokens: AuthTokens }>(
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

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        const apiError = createApiError(
          error,
          'AUTH_REFRESH_FAILED',
          'Token refresh failed'
        );
        processQueue(apiError);
        // Clear auth data and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expiry');
        window.location.href = '/login';
        return Promise.reject(apiError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response?.status === 403) {
      const apiError = createApiError(
        error,
        'FORBIDDEN',
        'Permission denied'
      );
      console.error('Permission denied:', error.response.data);
      return Promise.reject(apiError);
    }
    
    // Handle other errors
    return Promise.reject(
      createApiError(
        error,
        'API_ERROR',
        'An error occurred while processing your request'
      )
    );
  }
);

export default api;

type QueryParams = Record<string, string | number | boolean | undefined>;

// Type-safe API request helpers
export const apiService = {
  /**
   * GET request to the API
   * @param url - API endpoint
   * @param params - Query parameters
   */
  async get<T>(
    url: string, 
    params?: QueryParams
  ): Promise<T> {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  /**
   * POST request to the API
   * @param url - API endpoint
   * @param data - Request payload
   */
  async post<T, D = unknown>(
    url: string, 
    data?: D
  ): Promise<T> {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  /**
   * PUT request to the API
   * @param url - API endpoint
   * @param data - Request payload
   */
  async put<T, D = unknown>(
    url: string, 
    data: D
  ): Promise<T> {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  /**
   * PATCH request to the API
   * @param url - API endpoint
   * @param data - Request payload
   */
  async patch<T, D = unknown>(
    url: string, 
    data: D
  ): Promise<T> {
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