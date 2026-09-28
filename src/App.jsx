import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';

import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import SavedPage from './pages/SavedPage';
import SellPage from './pages/SellPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LocalitiesPage from './pages/LocalitiesPage';
import LocalitiesMapPage from './pages/LocalitiesMapPage';
import PremiumPage from './pages/PremiumPage';

import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SavedProvider>
            <Routes>
              {/* Auth routes — no main layout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Public Landing Page */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                }
              />

              {/* Protected App routes — only viewable when logged in */}
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SearchPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/property/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PropertyDetailPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SavedPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sell"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SellPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AboutPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/localities"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <LocalitiesPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/localities/map"
                element={
                  <ProtectedRoute>
                    <MainLayout hideFooter={true}>
                      <LocalitiesMapPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              {/* Aliases for quick navigation */}
              <Route path="/saved-properties" element={<Navigate to="/saved" replace />} />
              <Route path="/my-properties" element={<Navigate to="/dashboard?tab=listings" replace />} />
              <Route path="/inquiries" element={<Navigate to="/dashboard?tab=messages" replace />} />
              <Route path="/profile" element={<Navigate to="/dashboard?tab=settings" replace />} />

              <Route
                path="/premium"
                element={
                  <MainLayout>
                    <PremiumPage />
                  </MainLayout>
                }
              />

              {/* Catch-all: redirect to landing page */}
              <Route path="*" element={<MainLayout><HomePage /></MainLayout>} />
            </Routes>
          </SavedProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
