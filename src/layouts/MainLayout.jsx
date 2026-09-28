import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNavigation from '../components/common/BottomNavigation';
import Footer from '../components/common/Footer';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ children, hideFooter = false, hideNavbar = false }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // When unauthenticated on the landing page, clicking any actionable button or link directs to login/signup
  useEffect(() => {
    if (isAuthenticated || location.pathname !== '/') return;

    const handleGlobalClickCapture = (e) => {
      // Find closest interactive element
      const interactive = e.target.closest('button, a, input, [role="button"], .category-chip, .property-card, .btn');
      if (!interactive) return;

      // Allow clicking the logo when it navigates to '/' (home)
      const href = interactive.getAttribute('href') || interactive.closest('a')?.getAttribute('href');
      if (href === '/' && (interactive.closest('.brand-logo') || interactive.closest('.lokha-logo') || interactive.classList.contains('brand-logo'))) {
        return;
      }

      // If user clicked explicit register / signup link/button, send to /register
      const isRegisterTarget =
        (href && href.includes('/register')) ||
        interactive.id === 'landing-signup-button' ||
        interactive.textContent?.toLowerCase().includes('create account') ||
        interactive.textContent?.toLowerCase().includes('sign up');

      e.preventDefault();
      e.stopPropagation();

      if (isRegisterTarget) {
        navigate('/register');
      } else {
        navigate('/login');
      }
    };

    // Attach in capture phase to intercept before internal component handlers
    document.addEventListener('click', handleGlobalClickCapture, true);
    return () => {
      document.removeEventListener('click', handleGlobalClickCapture, true);
    };
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={`main-content ${hideNavbar ? 'main-content-fullscreen' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      <BottomNavigation />
      <AuthModal />
    </>
  );
}

