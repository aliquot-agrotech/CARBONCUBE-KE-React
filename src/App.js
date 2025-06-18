import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AboutUs from './components/AboutUs';
import ForgotPassword from './components/ForgotPassword';

// Admin Imports
import AnalyticsReporting from './admin/pages/AnalyticsReporting';
import ContentManagement from './admin/pages/ContentManagement';
import PurchasersManagement from './admin/pages/PurchasersManagement';
import RidersManagement from './admin/pages/RidersManagement';
import VendorsManagement from './admin/pages/VendorsManagement';
import AdsManagement from './admin/pages/AdsManagement';
import Messages from './admin/pages/Messages';
import PromotionsDiscount from './admin/pages/PromotionsDiscount';
import Notifications from './admin/pages/Notifications'; 
import CategoriesManagement from './admin/pages/CategoriesManagement';
import TiersManagement from './admin/pages/TiersManagement';

// Vendor Imports
import VendorSignUpPage from './seller/pages/VendorSignUpPage';
import VendorAnalytics from './seller/pages/VendorAnalytics';
import VendorAds from './seller/pages/VendorAds';
import VendorMessages from './seller/pages/Messages';
import VendorNotifications from './seller/pages/VendorNotifications';
import VendorProfile from './seller/pages/Profile';
import TierPage from './seller/pages/Tiers';

// Purchaser Imports
import Home from './buyer/pages/Home';
import AdDetails from './buyer/pages/AdDetails';
import WishList from './buyer/pages/WishLists';
import BuyForMeOrderCart from './buyer/pages/BuyForMeOrderCart';
import ShoppingCart from './buyer/pages/ShoppingCart';
import PurchaserMessages from './buyer/pages/PurchaserMessages';
import PurchaserNotifications from './buyer/pages/PurchaserNotifications';
import PurchaserSignUpPage from './buyer/pages/PurchaserSignUpPage';
import ProfilePage from './buyer/pages/Profile';
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
    setUserRole('buyer');
    sessionStorage.setItem('userRole', 'buyer'); // Use 'userRole' here
  };

  const handleVendorSignup = () => {
    setIsAuthenticated(true);
    setUserRole('seller');
    sessionStorage.setItem('userRole', 'seller'); // Use 'userRole' here
  };

  const handleRiderSignup = () => {
    setIsAuthenticated(true);
    setUserRole('rider');
    sessionStorage.setItem('userRole', 'rider'); // Use 'userRole' here
  }
  return (
    <Router>
      <Routes>
        <Route path="/ads/:adId" element={<AdDetails />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/admin" element={<Navigate to="/login" />} />
        <Route path="/seller" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home onLogout={handleLogout} />} />
        <Route path="/buyer-signup" element={<PurchaserSignUpPage onSignup={handlePurchaserSignup} />} />
        <Route path="/seller-signup" element={<VendorSignUpPage onSignup={handleVendorSignup} />} />
        <Route path="/rider-signup" element={<RiderSignUpPage onSignup={handleRiderSignup} />} />
        <Route path="/seller/tiers" element={<TierPage />} />
        <Route path="/about-us" element={<AboutUs/>} />


        {isAuthenticated && userRole === 'admin' && (
          <Route path="/admin/*" element={<PrivateRoute isAuthenticated={isAuthenticated} role="admin" userRole={userRole} />}>
            <Route path="analytics" element={<AnalyticsReporting onLogout={handleLogout} />} />
            <Route path="content" element={<ContentManagement onLogout={handleLogout} />} />
            <Route path="buyers" element={<PurchasersManagement onLogout={handleLogout} />} />
            <Route path="sellers" element={<VendorsManagement onLogout={handleLogout} />} />
            <Route path="riders" element={<RidersManagement onLogout={handleLogout} />} />
            <Route path="ads" element={<AdsManagement onLogout={handleLogout} />} />
            <Route path="messages" element={<Messages onLogout={handleLogout} />} />
            <Route path="promotions" element={<PromotionsDiscount onLogout={handleLogout} />} />
            <Route path="notifications" element={<Notifications onLogout={handleLogout} />} />
            <Route path="categories" element={<CategoriesManagement onLogout={handleLogout} />} />
            <Route path="tiers" element={<TiersManagement onLogout={handleLogout} />} />
          </Route>
        )}

        {isAuthenticated && userRole === 'seller' && (
          <Route path="/seller/*" element={<PrivateRoute isAuthenticated={isAuthenticated} role="seller" userRole={userRole} />}>
            <Route path="analytics" element={<VendorAnalytics onLogout={handleLogout} />} />
            <Route path="ads" element={<VendorAds onLogout={handleLogout} />} />
            <Route path="messages" element={<VendorMessages onLogout={handleLogout} />} />
            <Route path="notifications" element={<VendorNotifications onLogout={handleLogout} />} />
            <Route path="profile" element={<VendorProfile onLogout={handleLogout} />} />
            <Route path="tiers" element={<TierPage onLogout={handleLogout} />} />
          </Route>
        )}

        {isAuthenticated && userRole === 'buyer' && (
          <Route path="/buyer/*" element={<PrivateRoute isAuthenticated={isAuthenticated} role="buyer" userRole={userRole} />}>
            <Route path="home" element={<Home onLogout={handleLogout} />} />
            <Route path="wish_lists" element={<WishList onLogout={handleLogout} />} />
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