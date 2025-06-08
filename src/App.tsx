import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import MerchantList from './pages/MerchantList';
import MerchantDetail from './pages/MerchantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserProfile from './pages/UserProfile';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import MerchantDashboard from './pages/merchant/dashboard';
import MerchantCenter from './pages/merchant/MerchantCenter';
import { useAuth } from './contexts/AuthContext';
import { useMerchantAuth } from './contexts/MerchantAuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!role) {
    return <Navigate to="/login\" replace />;
  }

  return <>{children}</>;
};

const ProtectedMerchantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { merchant, loading } = useMerchantAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!merchant) {
    return <Navigate to="/login?tab=merchant\" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Merchant Routes */}
      <Route path="/merchant/dashboard" element={
        <ProtectedMerchantRoute>
          <MerchantDashboard />
        </ProtectedMerchantRoute>
      } />
      <Route path="/merchant/center" element={
        <ProtectedMerchantRoute>
          <MerchantDashboard />
        </ProtectedMerchantRoute>
      } />
      
      {/* User Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="merchants" element={<MerchantList />} />
        <Route path="merchants/:id" element={<MerchantDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}

export default App;