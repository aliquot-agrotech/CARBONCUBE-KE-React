import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AdminDashboard from './admin/AnalyticsReporting';
import VendorDashboard from './vendor/Analytics';
import PurchaserDashboard from './purchaser/HomePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [userRole, setUserRole] = useState(null); // For storing user role

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm setUserRole={setUserRole} />} />
        <Route path="/admin/*" element={<PrivateRoute role="admin" userRole={userRole} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Add more admin routes here */}
        </Route>
        <Route path="/vendor/*" element={<PrivateRoute role="vendor" userRole={userRole} />}>
          <Route path="dashboard" element={<VendorDashboard />} />
          {/* Add more vendor routes here */}
        </Route>
        <Route path="/purchaser/*" element={<PrivateRoute role="purchaser" userRole={userRole} />}>
          <Route path="dashboard" element={<PurchaserDashboard />} />
          {/* Add more purchaser routes here */}
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
