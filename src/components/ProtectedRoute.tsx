
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading, firebaseInitialized } = useAuth();

  if (loading) {
    // Show loading spinner or skeleton while checking auth status
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Allow access if the user is logged in (including guest users)
  if (currentUser) {
    return <>{children}</>;
  }
  
  // If Firebase is not initialized but we still want to allow access
  if (!firebaseInitialized) {
    // Redirect to login page to use guest access instead
    return <Navigate to="/login" />;
  }
  
  // Redirect to login if not authenticated
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
