import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';

// Admin Imports
import AnalyticsReporting from './admin/pages/AnalyticsReporting';
import ContentManagement from './admin/pages/ContentManagement';
import PurchasersManagement from './admin/pages/PurchasersManagement';
import OrdersManagement from './admin/pages/OrdersManagement';
import RidersManagement from './admin/pages/RidersManagement';
import VendorsManagement from './admin/pages/VendorsManagement';
import ProductsManagement from './admin/pages/ProductsManagement';
import Messages from './admin/pages/Messages';
import PromotionsDiscount from './admin/pages/PromotionsDiscount';
import Notifications from './admin/pages/Notifications'; 
import CategoriesManagement from './admin/pages/CategoriesManagement';

// Vendor Imports
import VendorSignUpPage from './vendor/pages/VendorSignUpPage';
import VendorAnalytics from './vendor/pages/VendorAnalytics';
import VendorOrders from './vendor/pages/VendorOrders';
import VendorProducts from './vendor/pages/VendorProducts';
import VendorMessages from './vendor/pages/Messages';
import VendorNotifications from './vendor/pages/VendorNotifications';
import VendorProfile from './vendor/pages/Profile';

// Purchaser Imports
import Home from './purchaser/pages/Home';
import ProductDetails from './purchaser/pages/ProductDetails';
import Orders from './purchaser/pages/Orders';
import WishList from './purchaser/pages/WishLists';
import BuyForMeOrderCart from './purchaser/pages/BuyForMeOrderCart';
import ShoppingCart from './purchaser/pages/ShoppingCart';
import PurchaserMessages from './purchaser/pages/PurchaserMessages';
import PurchaserNotifications from './purchaser/pages/PurchaserNotifications';
import PurchaserSignUpPage from './purchaser/pages/SignUpPage';
import ProfilePage from './purchaser/pages/Profile';
import RiderSignUpPage from './rider/pages/RiderSignUpPage';
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
    sessionStorage.setItem('userRole', user.role);
    setUserRole(user.role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
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

  const handleRiderSignup = () => {
    setIsAuthenticated(true);
    setUserRole('rider');
    sessionStorage.setItem('userRole', 'rider'); // Use 'userRole' here
  }
  return (
    <Router>
      <Routes>
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/admin" element={<Navigate to="/login" />} />
        <Route path="/vendor" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/home" element={<Home onLogout={handleLogout} />} />
        <Route path="/purchasersignup" element={<PurchaserSignUpPage onSignup={handlePurchaserSignup} />} />
        <Route path="/vendorsignup" element={<VendorSignUpPage onSignup={handleVendorSignup} />} />
        <Route path="/ridersignup" element={<RiderSignUpPage onSignup={handleRiderSignup} />} />

        {isAuthenticated && userRole === 'admin' && (
          <Route path="/admin/*" element={<PrivateRoute isAuthenticated={isAuthenticated} role="admin" userRole={userRole} />}>
            <Route path="analytics" element={<AnalyticsReporting onLogout={handleLogout} />} />
            <Route path="content" element={<ContentManagement onLogout={handleLogout} />} />
            <Route path="purchasers" element={<PurchasersManagement onLogout={handleLogout} />} />
            <Route path="orders" element={<OrdersManagement onLogout={handleLogout} />} />
            <Route path="vendors" element={<VendorsManagement onLogout={handleLogout} />} />
            <Route path="riders" element={<RidersManagement onLogout={handleLogout} />} />
            <Route path="products" element={<ProductsManagement onLogout={handleLogout} />} />
            <Route path="messages" element={<Messages onLogout={handleLogout} />} />
            <Route path="promotions" element={<PromotionsDiscount onLogout={handleLogout} />} />
            <Route path="notifications" element={<Notifications onLogout={handleLogout} />} />
            <Route path="categories" element={<CategoriesManagement onLogout={handleLogout} />} />
          </Route>
        )}

        {isAuthenticated && userRole === 'vendor' && (
          <Route path="/vendor/*" element={<PrivateRoute isAuthenticated={isAuthenticated} role="vendor" userRole={userRole} />}>
            <Route path="analytics" element={<VendorAnalytics onLogout={handleLogout} />} />
            <Route path="orders" element={<VendorOrders onLogout={handleLogout} />} />
            <Route path="products" element={<VendorProducts onLogout={handleLogout} />} />
            <Route path="messages" element={<VendorMessages onLogout={handleLogout} />} />
            <Route path="notifications" element={<VendorNotifications onLogout={handleLogout} />} />
            <Route path="profile" element={<VendorProfile onLogout={handleLogout} />} />
          </Route>
        )}

        {isAuthenticated && userRole === 'purchaser' && (
          <Route path="/purchaser/*" element={<PrivateRoute isAuthenticated={isAuthenticated} role="purchaser" userRole={userRole} />}>
            <Route path="home" element={<Home onLogout={handleLogout} />} />
            <Route path="orders" element={<Orders onLogout={handleLogout} />} />
            <Route path="wishlists" element={<WishList onLogout={handleLogout} />} />
            <Route path="cart" element={<ShoppingCart onLogout={handleLogout} />} />
            <Route path="buyforme" element={<BuyForMeOrderCart onLogout={handleLogout} />} />
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