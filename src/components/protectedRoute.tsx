import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth } from '../utils/auth.helper';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = checkAuth();  // Check if the user is authenticated

  if (isAuthenticated) {
    return element;  // If authenticated, allow access to the route
  } else {
    return <Navigate to="/login" />;  // Redirect to /login if not authenticated
  }
};

export default ProtectedRoute;
