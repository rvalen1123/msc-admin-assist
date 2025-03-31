import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../lib/api';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

const AuthContext = createContext<AuthContextType | null>(null);

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

  // Fetch user profile using the token
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await apiService.get<User>('/auth/profile');
      setCurrentUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Session expired. Please login again.');
      
      // Clear invalid auth data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Real login function using the API
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.post<{ token: string; user: User }>('/auth/login', {
        email,
        password
      });
      
      // Store token and user in localStorage
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      // Update state
      setCurrentUser(response.user);
    } catch (err: any) {
      console.error('Login failed:', err);
      
      // Set appropriate error message based on error type
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Please check if the backend server is running.');
      } else {
        setError('Login failed. Please try again.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
    setError(null);
    
    // Optional: Call logout endpoint if server needs to invalidate the token
    // apiService.post('/auth/logout').catch(err => console.error('Logout error:', err));
  };
  
  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    if (!currentUser) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    try {
      setLoading(true);
      const updatedUser = await apiService.patch<User>(`/users/${currentUser.id}`, userData);
      
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

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (token) {
      // If we have a token, fetch the current user profile
      fetchUserProfile();
    } else if (storedUser) {
      // If we have a stored user but no token, clear it (invalid state)
      localStorage.removeItem(USER_KEY);
      setCurrentUser(null);
      setLoading(false);
    } else {
      // No authentication data found
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
