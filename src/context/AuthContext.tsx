
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  setCurrentUserRole: (role: 'admin' | 'customer' | 'sales') => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

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

  // Mock login function
  const login = async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching email (in a real app, you'd verify the password too)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Store user in state and localStorage
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const setCurrentUserRole = (role: 'admin' | 'customer' | 'sales') => {
    // For demo purposes, this allows switching between user roles
    const userForRole = users.find(u => u.role === role);
    if (userForRole) {
      setCurrentUser(userForRole);
      localStorage.setItem('currentUser', JSON.stringify(userForRole));
    }
  };
  
  const updateUserProfile = (userData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // For demo purposes, set a default user if none exists
    // Remove this in a production app
    if (!storedUser) {
      const defaultUser = users[0]; // Admin user
      setCurrentUser(defaultUser);
      localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    }
    
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
    setCurrentUserRole,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
