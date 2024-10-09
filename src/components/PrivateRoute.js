// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ role }) => {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('userRole'); // Get the user role from sessionStorage

  if (!token || userRole !== role) {
      return <Navigate to="/login" />;
  }

  return <Outlet />;
};


export default PrivateRoute;
