import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ role, userRole, children }) => {
  return userRole === role ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
