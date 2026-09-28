import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLoadingScreen from './AuthLoadingScreen';

/**
 * Route wrapper that restricts access to authenticated users and optionally checks roles.
 * Prevents screen flicker by displaying AuthLoadingScreen while Firebase determines auth state.
 */
export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show branded loading screen while Firebase resolves session
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Redirect unauthenticated visitors to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based authorization check
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRole = (user?.role || 'buyer').toLowerCase();
    const hasRole = allowedRoles.map((r) => r.toLowerCase()).includes(userRole);

    if (!hasRole && userRole !== 'admin') {
      // If user lacks permission for owner/builder/agent area, send to dashboard
      return <Navigate to="/dashboard?unauthorized=true" replace />;
    }
  }

  return children;
}
