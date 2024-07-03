import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  console.log('Current user in PrivateRoute:', currentUser); // Debugging line
  console.log('Is authenticated in PrivateRoute:', isAuthenticated); // Debugging line

  useEffect(() => {
    if (currentUser === null && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 3000); // Wait for 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [currentUser, isAuthenticated]);

  if (shouldRedirect) {
    return <Navigate to="/login" />;
  }

  if (currentUser === null && !isAuthenticated) {
    // Show a loading indicator while checking the session
    return <div>Please login to continue</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
