import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute component that handles authentication and authorization
 * 
 * @param children - The component to render if the user is authenticated and authorized
 * @param allowedRoles - Optional list of roles that can access this route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to unauthorized page if the user doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute; 