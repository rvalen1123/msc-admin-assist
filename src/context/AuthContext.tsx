/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthTokens, LoginResponse, ApiError } from '../types';
import { apiService } from '../lib/api';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
// Types and Interfaces
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosHeaders;
  config: InternalAxiosRequestConfig;
}

// Constants
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'current_user';
const TOKEN_EXPIRY_KEY = 'token_expiry';

const AuthContext = createContext<AuthContextType | null>(null);

// Utility functions
const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

const storeAuthData = (tokens: AuthTokens, user: User) => {
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_EXPIRY_KEY, (Date.now() + tokens.expiresIn * 1000).toString());
};

// Mock responses for testing
const getMockLoginResponse = (email: string): AxiosResponse<LoginResponse> => {
  const headers = new AxiosHeaders();
  headers.set('Content-Type', 'application/json');
  
  const config: InternalAxiosRequestConfig = {
    headers,
    method: 'POST',
    url: '/auth/login',
    data: {}
  };

  return {
    data: {
      tokens: {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600
      },
      user: {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin' as UserRole
      }
    },
    status: 200,
    statusText: 'OK',
    headers,
    config
  };
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        setLoading(true);
        const token = localStorage.getItem(TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        
        if (token && refreshToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as User;
            setCurrentUser(parsedUser);
            setError(null);
            setTokenExpiry(expiry ? parseInt(expiry) : Date.now() + 3600000);
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            clearAuthData();
            setError('Session data corrupted. Please login again.');
          }
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Token expiry check
  useEffect(() => {
    if (!tokenExpiry) return;

    const checkExpiry = () => {
      if (Date.now() >= tokenExpiry) {
        refreshToken().catch(() => {
          logout();
        });
      }
    };

    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tokenExpiry]);

  const refreshToken = async (): Promise<void> => {
    try {
      const tokens = localStorage.getItem('tokens');
      if (!tokens) throw new Error('No refresh token available');

      const response: AxiosResponse<LoginResponse> = await apiService.post('/auth/refresh-token', {
        refreshToken: JSON.parse(tokens).refreshToken
      });
      const { tokens: newTokens, user } = response.data;

      localStorage.setItem('tokens', JSON.stringify(newTokens));
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);

    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      throw new Error('Session expired. Please login again.');
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // For testing when server is unavailable
      if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL) {
        if (email === 'admin@example.com' && password === 'password123') {
          const mockResponse: LoginResponse = {
            tokens: {
              accessToken: 'mock-access-token',
              refreshToken: 'mock-refresh-token',
              expiresIn: 3600
            },
            user: {
              id: '1',
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin' as UserRole
            }
          };
          
          localStorage.setItem('tokens', JSON.stringify(mockResponse.tokens));
          localStorage.setItem('user', JSON.stringify(mockResponse.user));
          setCurrentUser(mockResponse.user);
          return;
        }
        throw new Error('Invalid credentials');
      }

      const response: AxiosResponse<LoginResponse> = await apiService.post('/auth/login', { email, password });
      const { tokens, user } = response.data;

      localStorage.setItem('tokens', JSON.stringify(tokens));
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);

    } catch (error) {
      const apiError = error as AxiosError<ApiError>;
      console.error('Login failed:', error);
      
      if (error instanceof Error && error.message === 'Invalid credentials' || apiError.response?.status === 401) {
        setError('Invalid email or password');
      } else if (apiError.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Using mock data for testing.');
      } else {
        setError('Login failed. Please try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        try {
          await apiService.post('/auth/logout', { refreshToken });
        } catch (error) {
          console.error('Failed to invalidate refresh token:', error);
        }
      }
    } finally {
      clearAuthData();
      setCurrentUser(null);
      setTokenExpiry(null);
    }
  };
  
  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    if (!currentUser) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    try {
      const response: AxiosResponse<User> = await apiService.put('/users/profile', userData);
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    updateUserProfile,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
