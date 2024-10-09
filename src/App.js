import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AnalyticsReporting from './admin/AnalyticsReporting';
import ContentManagement from './admin/ContentManagement';
import PurchasersManagement from './admin/PurchasersManagement';
import OrdersManagement from './admin/OrdersManagement';
import VendorsManagement from './admin/VendorsManagement';
import ProductsManagement from './admin/ProductsManagement';
import Messages from './admin/Messages';
import PromotionsDiscount from './admin/PromotionsDiscount';
import Notifications from './admin/Notifications'; 
import CategoriesManagement from './admin/CategoriesManagement';
import VendorSignUpPage from './vendor/VendorSignUpPage';
import VendorAnalytics from './vendor/VendorAnalytics';
import VendorOrders from './vendor/VendorOrders';
import VendorProducts from './vendor/VendorProducts';
import VendorMessages from './vendor/Messages';
import VendorNotifications from './vendor/VendorNotifications';
import VendorProfile from './vendor/Profile';
import Home from './purchaser/Home';
import ProductDetailsPage from './purchaser/ProductDetailsPage';
import Orders from './purchaser/Orders';
import Bookmarks from './purchaser/Bookmarks';
import ShoppingCart from './purchaser/ShoppingCart';
import PurchaserMessages from './purchaser/PurchaserMessages';
import PurchaserNotifications from './purchaser/PurchaserNotifications';
import PurchaserSignUpPage from './purchaser/SignUpPage';
import ProfilePage from './purchaser/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [userRole, setUserRole] = useState(null); // For storing user role
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const role = sessionStorage.getItem('userRole'); // Use 'userRole' here
      setUserRole(role);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userRole', user.role); // Use 'userRole' here
    setUserRole(user.role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole'); // Use 'userRole' here
    setUserRole(null);
    setIsAuthenticated(false);
  };

  const handlePurchaserSignup = () => {
    setIsAuthenticated(true);
    setUserRole('purchaser');
    sessionStorage.setItem('userRole', 'purchaser'); // Use 'userRole' here
  };

  const handleVendorSignup = () => {
    setIsAuthenticated(true);
    setUserRole('vendor');
    sessionStorage.setItem('userRole', 'vendor'); // Use 'userRole' here
  };

  return (
    <Router>
      <Routes>
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/admin" element={<Navigate to="/login" />} />
        <Route path="/vendor" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/home" element={<Home onLogout={handleLogout} />} />
        <Route path="/purchasersignup" element={<PurchaserSignUpPage onSignup={handlePurchaserSignup} />} />
        <Route path="/vendorsignup" element={<VendorSignUpPage onSignup={handleVendorSignup} />} />
        {isAuthenticated && userRole === 'admin' && (
          <Route path="/admin/*" element={<PrivateRoute role="admin" userRole={userRole} />}>
            <Route path="analytics-reporting" element={<AnalyticsReporting onLogout={handleLogout} />} />
            <Route path="content-management" element={<ContentManagement onLogout={handleLogout} />} />
            <Route path="purchasers-management" element={<PurchasersManagement onLogout={handleLogout} />} />
            <Route path="orders-management" element={<OrdersManagement onLogout={handleLogout} />} />
            <Route path="vendors-management" element={<VendorsManagement onLogout={handleLogout} />} />
            <Route path="products-management" element={<ProductsManagement onLogout={handleLogout} />} />
            <Route path="messages" element={<Messages onLogout={handleLogout} />} />
            <Route path="promotions-discount" element={<PromotionsDiscount onLogout={handleLogout} />} />
            <Route path="notifications" element={<Notifications onLogout={handleLogout} />} />
            <Route path="categories-management" element={<CategoriesManagement onLogout={handleLogout} />} />
          </Route>
        )}
        {isAuthenticated && userRole === 'vendor' && (
          <Route path="/vendor/*" element={<PrivateRoute role="vendor" userRole={userRole} />}>
            <Route path="vendor-analytics" element={<VendorAnalytics onLogout={handleLogout} />} />
            <Route path="vendor-orders" element={<VendorOrders onLogout={handleLogout} />} />
            <Route path="vendor-products" element={<VendorProducts onLogout={handleLogout} />} />
            <Route path="messages" element={<VendorMessages onLogout={handleLogout} />} />
            <Route path="vendor-notifications" element={<VendorNotifications onLogout={handleLogout} />} />
            <Route path="profile" element={<VendorProfile onLogout={handleLogout} />} />
          </Route>
        )}
        {isAuthenticated && userRole === 'purchaser' && (
          <Route path="/purchaser/*" element={<PrivateRoute role="purchaser" userRole={userRole} />}>
            <Route path="home" element={<Home onLogout={handleLogout} />} />
            <Route path="orders" element={<Orders onLogout={handleLogout} />} />
            <Route path="bookmarks" element={<Bookmarks onLogout={handleLogout} />} />
            <Route path="shopping-cart" element={<ShoppingCart onLogout={handleLogout} />} />
            <Route path="messages" element={<PurchaserMessages onLogout={handleLogout} />} />
            <Route path="notifications" element={<PurchaserNotifications onLogout={handleLogout} />} />
            <Route path="profile" element={<ProfilePage onLogout={handleLogout} />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
