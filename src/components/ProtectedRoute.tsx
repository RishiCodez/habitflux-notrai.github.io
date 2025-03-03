
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // All routes are now accessible without authentication
  return <>{children}</>;
};

export default ProtectedRoute;
