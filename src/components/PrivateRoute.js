// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ role, userRole }) => {
  const token = localStorage.getItem('token');

  if (!token || userRole !== role) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
