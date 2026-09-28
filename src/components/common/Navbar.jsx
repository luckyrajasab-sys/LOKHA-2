import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  PlusCircle, 
  Menu, 
  ChevronDown
} from 'lucide-react';
import Logo from './Logo';
import NotificationDropdown from './NotificationDropdown';
import UserAccountMenu from './UserAccountMenu';
import MobileNavDrawer from './MobileNavDrawer';
import ContactLokhaModal from './ContactLokhaModal';
import MoreMenu from './MoreMenu';
import PropertyMenu from './PropertyMenu';
import HeaderSearch from './HeaderSearch';
import ThemeToggle from './ThemeToggle';
import { useSaved } from '../../context/SavedContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedIds } = useSaved();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [scrollY, setScrollY] = useState(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(false);
  const moreMenuTriggerRef = useRef(null);
  const propertyMenuTriggerRef = useRef(null);

  const togglePropertyMenu = useCallback(() => {
    setIsPropertyMenuOpen((prev) => !prev);
    setIsMoreMenuOpen(false);
  }, []);

  const closePropertyMenu = useCallback(() => {
    setIsPropertyMenuOpen(false);
  }, []);

  const toggleMoreMenu = useCallback(() => {
    setIsMoreMenuOpen((prev) => !prev);
    setIsPropertyMenuOpen(false);
  }, []);

  const closeMoreMenu = useCallback(() => {
    setIsMoreMenuOpen(false);
  }, []);

  // Auto-close open menus on route changes
  useEffect(() => {
    setIsPropertyMenuOpen(false);
    setIsMoreMenuOpen(false);
  }, [location.pathname, location.search]);

  // Track window scroll for Smart Sticky states
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine header state: 'hero' at top of homepage, 'scrolled' everywhere else
  const isHomepage = location.pathname === '/';
  const headerState = isHomepage && scrollY < 60 ? 'hero' : 'scrolled';

  // Check if current page is within the Property umbrella
  const searchParams = new URLSearchParams(location.search);
  const isPropertyActive =
    location.pathname === '/sell' ||
    (location.pathname === '/search' && !searchParams.get('view'));

  // Handle Saved Homes click with a subtle confirmation toast
  const handleSavedClick = () => {
    if (savedIds.length > 0) {
      showToast(`${savedIds.length} properties saved to your collection.`, 'heart');
    } else {
      showToast('Explore homes and tap the heart icon to save them.', 'info');
    }
  };

  return (
    <>
      <header 
        className="lokha-header"
        data-header-state={headerState}
        role="banner"
      >
        <div className="container lokha-header-inner">
          {/* ── Left: LOKHA Logo (Always mounted, transitions via CSS) ── */}
          <Logo />

          {/* ── Center: Primary Architectural Desktop Navigation ── */}
          <nav className="lokha-desktop-nav" aria-label="Main Navigation">
            <NavLink 
              to="/" 
              className={({ isActive }) => `lokha-nav-link ${isActive && location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </NavLink>

            {/* ── Property ▾ Dropdown Trigger ── */}
            <div className="property-menu-wrapper">
              <button
                ref={propertyMenuTriggerRef}
                type="button"
                className={`property-menu-trigger ${isPropertyMenuOpen ? 'is-open' : ''} ${isPropertyActive ? 'is-active' : ''}`}
                onClick={togglePropertyMenu}
                aria-expanded={isPropertyMenuOpen}
                aria-haspopup="menu"
                aria-label="Property options: Buy, Rent, Sell, New Projects, Commercial"
                id="property-menu-btn"
              >
                <span>Properties</span>
                <ChevronDown
                  size={14}
                  className={`property-menu-trigger-chevron ${isPropertyMenuOpen ? 'is-open' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <PropertyMenu
                isOpen={isPropertyMenuOpen}
                onClose={closePropertyMenu}
                triggerRef={propertyMenuTriggerRef}
              />
            </div>

            <NavLink 
              to="/search?purpose=sale" 
              className={({ isActive }) => `lokha-nav-link ${isActive && searchParams.get('purpose') === 'sale' ? 'active' : ''}`}
            >
              Buy
            </NavLink>
            <NavLink 
              to="/search?purpose=rent" 
              className={({ isActive }) => `lokha-nav-link ${isActive && searchParams.get('purpose') === 'rent' ? 'active' : ''}`}
            >
              Rent
            </NavLink>
            <NavLink 
              to={isAuthenticated ? "/localities" : "/login"} 
              className={({ isActive }) => `lokha-nav-link ${isActive ? 'active' : ''}`}
            >
              Localities
            </NavLink>
            <NavLink 
              to="/products" 
              className={({ isActive }) => `lokha-nav-link ${isActive ? 'active' : ''}`}
            >
              Essentials
            </NavLink>
            <NavLink 
              to={isAuthenticated ? "/about" : "/login"} 
              className={({ isActive }) => `lokha-nav-link ${isActive ? 'active' : ''}`}
            >
              About
            </NavLink>

            {/* ── More ▾ mega-menu trigger ── */}
            <div className="more-menu-wrapper">
              <button
                ref={moreMenuTriggerRef}
                type="button"
                className={`more-menu-trigger ${isMoreMenuOpen ? 'is-open' : ''}`}
                onClick={toggleMoreMenu}
                aria-expanded={isMoreMenuOpen}
                aria-haspopup="dialog"
                aria-label="More navigation options"
                id="more-menu-btn"
              >
                More
                <ChevronDown
                  size={14}
                  className={`more-menu-trigger-chevron ${isMoreMenuOpen ? 'is-open' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <MoreMenu
                isOpen={isMoreMenuOpen}
                onClose={closeMoreMenu}
                triggerRef={moreMenuTriggerRef}
                onOpenContact={() => setIsContactOpen(true)}
              />
            </div>
          </nav>

          {/* ── Right: Header Actions Cluster ── */}
          <div className="lokha-header-actions">
            {/* Theme Toggle (Light / Dark Mode) */}
            <ThemeToggle size={16} />

            {/* Saved Homes Button */}
            <Link 
              to={isAuthenticated ? "/saved" : "/login"} 
              className={`header-saved-btn ${savedIds.length > 0 ? 'is-saved' : ''}`}
              onClick={isAuthenticated ? handleSavedClick : undefined}
              aria-label={`Saved Homes (${savedIds.length})`}
            >
              <Heart 
                size={18} 
                className="header-heart-icon"
              />
              {savedIds.length > 0 && (
                <span className="header-saved-count">{savedIds.length}</span>
              )}
            </Link>

            {/* Notification Center Dropdown */}
            {isAuthenticated && <NotificationDropdown />}

            {/* "List Property" Primary CTA Button */}
            <Link 
              to={isAuthenticated ? "/sell" : "/login"} 
              className="btn-header-list-cta"
              id="header-list-property-cta"
            >
              <PlusCircle size={15} />
              <span>List Property</span>
            </Link>

            {/* User Avatar / Account Menu */}
            <UserAccountMenu />

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              className="mobile-menu-trigger-btn"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Slide-Out Mobile Navigation Drawer ── */}
      <MobileNavDrawer 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* ── Global Contact Modal ── */}
      <ContactLokhaModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </>
  );
}
