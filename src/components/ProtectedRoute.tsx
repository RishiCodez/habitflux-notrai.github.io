
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  guestAllowed?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, guestAllowed = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner or skeleton while checking auth status
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if the user is logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Allow access if the user is not a guest or if the route allows guests
  if (!currentUser.isGuest || guestAllowed) {
    return <>{children}</>;
  }
  
  // If user is a guest and the route doesn't allow guests, redirect to pomodoro
  toast.error("This feature requires signing in with Google. Guest users only have access to the Pomodoro timer.");
  return <Navigate to="/pomodoro" />;
};

export default ProtectedRoute;
