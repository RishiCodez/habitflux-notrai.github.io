
import React, { useEffect } from 'react';
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

  // Show notification for guest users trying to access restricted pages
  useEffect(() => {
    if (currentUser?.isGuest && !guestAllowed && location.pathname !== '/pomodoro') {
      toast.error('This feature requires signing in. Guest users only have access to the Pomodoro timer.');
    }
  }, [currentUser, guestAllowed, location.pathname]);

  if (loading) {
    // Show loading spinner or skeleton while checking auth status
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if the user is logged in (including as guest)
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Allow access if the user is not a guest or if the route allows guests
  if (!currentUser.isGuest || guestAllowed) {
    return <>{children}</>;
  }
  
  // If user is a guest and the route doesn't allow guests, redirect to pomodoro
  return <Navigate to="/pomodoro" replace />;
};

export default ProtectedRoute;
