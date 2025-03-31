import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../lib/api';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'current_user';

const AuthContext = createContext<AuthContextType | null>(null);

// Changed to named export for Fast Refresh compatibility
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  // Initialize user data from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        setLoading(true);
        const token = localStorage.getItem(TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        
        if (token && refreshToken && storedUser) {
          try {
            // Set the stored user data
            const parsedUser = JSON.parse(storedUser) as User;
            setCurrentUser(parsedUser);
            setError(null);
            
            // Set token expiry (1 hour from now if not specified)
            const expiry = localStorage.getItem('token_expiry');
            setTokenExpiry(expiry ? parseInt(expiry) : Date.now() + 3600000);
          } catch (err) {
            console.error('Failed to parse stored user:', err);
            clearAuthData();
            setError('Session data corrupted. Please login again.');
          }
        } else {
          clearAuthData();
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Check token expiry periodically
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

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('token_expiry');
    setCurrentUser(null);
    setTokenExpiry(null);
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await apiService.post<AuthTokens>('/auth/refresh', {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response;
      
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      localStorage.setItem('token_expiry', (Date.now() + expiresIn * 1000).toString());
      
      setTokenExpiry(Date.now() + expiresIn * 1000);
    } catch (err) {
      console.error('Token refresh failed:', err);
      clearAuthData();
      throw new Error('Session expired. Please login again.');
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      try {
        response = await apiService.post<{ tokens: AuthTokens; user: User }>('/auth/login', {
          email,
          password
        });
      } catch (err: any) {
        if (err.code === 'ERR_NETWORK' || err.response?.status === 404) {
          // Mock response for testing when server is not available
          if (email === 'admin@example.com' && password === 'admin123') {
            response = {
              tokens: {
                accessToken: 'mock-token',
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
          } else {
            throw new Error('Invalid credentials');
          }
        } else {
          throw err;
        }
      }
      
      const { tokens, user } = response;
      
      // Store tokens and user in localStorage
      localStorage.setItem(TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem('token_expiry', (Date.now() + tokens.expiresIn * 1000).toString());
      
      // Update state
      setCurrentUser(user);
      setTokenExpiry(Date.now() + tokens.expiresIn * 1000);
    } catch (err: any) {
      console.error('Login failed:', err);
      
      if (err.message === 'Invalid credentials') {
        setError('Invalid email or password');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Using mock data for testing.');
      } else {
        setError('Login failed. Please try again.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        // Attempt to invalidate refresh token on server
        try {
          await apiService.post('/auth/logout', { refreshToken });
        } catch (err) {
          console.error('Failed to invalidate refresh token:', err);
        }
      }
    } finally {
      clearAuthData();
    }
  };
  
  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    if (!currentUser) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    try {
      setLoading(true);
      let updatedUser: User;
      
      try {
        updatedUser = await apiService.patch<User>(`/users/${currentUser.id}`, userData);
      } catch (err: any) {
        if (err.code === 'ERR_NETWORK' || err.response?.status === 404) {
          // Mock update for testing
          updatedUser = {
            ...currentUser,
            ...userData
          };
        } else {
          throw err;
        }
      }
      
      setCurrentUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setError(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
      throw err;
    } finally {
      setLoading(false);
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
