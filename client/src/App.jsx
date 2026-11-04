import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/navigation/Navbar';
import Footer from './components/navigation/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import OfflineIndicator from './components/pwa/OfflineIndicator';
import UpdateNotification from './components/pwa/UpdateNotification';

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/public/HomePage'));
const ShopPage = lazy(() => import('./pages/public/ShopPage'));
const CategoriesPage = lazy(() => import('./pages/public/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('./pages/public/CategoryDetailPage'));
const ProductDetailPage = lazy(() => import('./pages/public/ProductDetailPage'));
const ShowroomScene = lazy(() => import('./three/ShowroomScene'));
const CartPage = lazy(() => import('./pages/public/CartPage'));
const CheckoutPage = lazy(() => import('./pages/public/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const AccountPage = lazy(() => import('./pages/customer/AccountPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const FaqPage = lazy(() => import('./pages/public/FaqPage'));
const GuidesPage = lazy(() => import('./pages/public/GuidesPage'));
const GuideDetailPage = lazy(() => import('./pages/public/GuideDetailPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/public/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/public/TermsPage'));
const ShippingPolicyPage = lazy(() => import('./pages/public/ShippingPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/public/ReturnPolicyPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));

// Route Suspense Fallback
const PageLoader = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
    <div className="w-10 h-10 border-2 border-autox-orange border-t-transparent rounded-full animate-spin mb-3 shadow-glow" />
    <span className="text-xs font-mono uppercase tracking-widest text-autox-muted">
      Loading Telemetry Stage...
    </span>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-autox-bg text-autox-text">
      {/* Toast Notification Engine */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1C222A',
            color: '#FFFFFF',
            border: '1px solid #303741',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif'
          },
          success: {
            iconTheme: {
              primary: '#FF5A1F',
              secondary: '#FFFFFF'
            }
          }
        }}
      />

      {/* PWA Telemetry & Offline Management */}
      <OfflineIndicator />
      <UpdateNotification />

      {/* Global Navigation */}
      <Navbar />

      {/* Application Route Views */}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetailPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/showroom" element={<ShowroomScene />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Protected Customer Account Route */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Administrator Route */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />

            {/* Additional Standard Informational Pages & Policy Aliases */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/guides/:slug" element={<GuideDetailPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/shipping" element={<ShippingPolicyPage />} />
            <Route path="/return-policy" element={<ReturnPolicyPage />} />
            <Route path="/returns" element={<ReturnPolicyPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;

