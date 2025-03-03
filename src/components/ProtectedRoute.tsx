
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
  
  // If Firebase is not initialized, show a message and allow access to protected routes
  if (!firebaseInitialized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Firebase Not Initialized</h2>
          <p className="mb-4">
            Firebase authentication is not properly initialized. This could be because you're in development mode 
            or the required environment variables are missing.
          </p>
          <p>
            Please check your .env file and make sure it includes all required Firebase configuration variables.
          </p>
        </div>
        {children}
      </div>
    );
  }
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
