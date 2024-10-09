import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ role }) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('userRole'); // Use the correct key for user role

  // Check if the user is authenticated and has the required role
  if (!token || userRole !== role) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
