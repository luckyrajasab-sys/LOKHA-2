import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  X, 
  Home, 
  Building2, 
  Building, 
  MapPin, 
  Sparkles, 
  Heart, 
  Bookmark, 
  Bell, 
  Calendar, 
  MessageSquare, 
  PlusCircle, 
  FileText, 
  LayoutDashboard, 
  Info, 
  BookOpen, 
  Phone, 
  HelpCircle, 
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Crown
} from 'lucide-react';
import Logo from './Logo';

export default function MobileNavDrawer({ 
  isOpen, 
  onClose, 
  onOpenContact 
}) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mobile-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="mobile-drawer-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <div>
            <Logo showTagline={false} />
            <p className="mobile-drawer-motto">Discover spaces worth living in.</p>
          </div>
          <button 
            type="button" 
            className="mobile-drawer-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="mobile-drawer-content">
          {/* Primary Action Button */}
          <div className="mobile-drawer-cta-wrap">
            <Link 
              to="/sell" 
              className="btn btn-drawer-list-cta"
              onClick={onClose}
            >
              <PlusCircle size={17} />
              <span>List Property — Free</span>
            </Link>
          </div>

          {/* Section 1: Property Portfolio */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">Property</span>
            <div className="mobile-drawer-nav-list">
              <NavLink 
                to="/search?purpose=sale" 
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Home size={17} className="drawer-icon" />
                <span>Buy</span>
              </NavLink>
              <NavLink 
                to="/search?purpose=rent" 
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Building size={17} className="drawer-icon" />
                <span>Rent</span>
              </NavLink>
              <NavLink 
                to="/sell" 
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <PlusCircle size={17} className="drawer-icon" />
                <span>Sell</span>
              </NavLink>
              <NavLink 
                to="/search?status=Under+Construction" 
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Sparkles size={17} className="drawer-icon" />
                <span>New Projects</span>
              </NavLink>
              <NavLink 
                to="/search?purpose=commercial" 
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Building2 size={17} className="drawer-icon" />
                <span>Commercial</span>
              </NavLink>
            </div>
          </div>

          {/* Section 1b: Discover & Design */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">Discover & Design</span>
            <div className="mobile-drawer-nav-list">
              <NavLink 
                to="/localities" 
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <MapPin size={17} className="drawer-icon" />
                <span>Localities</span>
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Sparkles size={17} className="drawer-icon" />
                <span>Interiors & Architecture</span>
              </NavLink>
              <NavLink 
                to="/premium" 
                className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Crown size={17} className="drawer-icon" style={{ color: '#D4AF37' }} />
                <span>Premium & Credits</span>
              </NavLink>
            </div>
          </div>

          {/* Section 2: My LOKHA */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">My LOKHA</span>
            <div className="mobile-drawer-nav-list">
              <Link to="/saved" className="mobile-drawer-link" onClick={onClose}>
                <Heart size={17} className="drawer-icon" />
                <span>Saved Homes</span>
              </Link>
              <Link to="/search?saved=true" className="mobile-drawer-link" onClick={onClose}>
                <Bookmark size={17} className="drawer-icon" />
                <span>Saved Searches</span>
              </Link>
              <Link to="/dashboard?tab=alerts" className="mobile-drawer-link" onClick={onClose}>
                <Bell size={17} className="drawer-icon" />
                <span>My Alerts</span>
              </Link>
              <Link to="/dashboard?tab=visits" className="mobile-drawer-link" onClick={onClose}>
                <Calendar size={17} className="drawer-icon" />
                <span>My Visits</span>
              </Link>
              <Link to="/dashboard?tab=messages" className="mobile-drawer-link" onClick={onClose}>
                <MessageSquare size={17} className="drawer-icon" />
                <span>Messages</span>
              </Link>
            </div>
          </div>

          {/* Section 3: For Owners & Hosts */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">For Owners</span>
            <div className="mobile-drawer-nav-list">
              <Link to="/sell" className="mobile-drawer-link" onClick={onClose}>
                <PlusCircle size={17} className="drawer-icon" />
                <span>List Property</span>
              </Link>
              <Link to="/dashboard?tab=listings" className="mobile-drawer-link" onClick={onClose}>
                <FileText size={17} className="drawer-icon" />
                <span>My Listings</span>
              </Link>
              <Link to="/dashboard" className="mobile-drawer-link" onClick={onClose}>
                <LayoutDashboard size={17} className="drawer-icon" />
                <span>Owner Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Section 4: Company */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">Company</span>
            <div className="mobile-drawer-nav-list">
              <Link to="/about" className="mobile-drawer-link" onClick={onClose}>
                <Info size={17} className="drawer-icon" />
                <span>About LOKHA</span>
              </Link>
              <Link to="/about" className="mobile-drawer-link" onClick={onClose}>
                <BookOpen size={17} className="drawer-icon" />
                <span>Founder Story & Philosophy</span>
              </Link>
              {onOpenContact && (
                <button
                  type="button"
                  className="mobile-drawer-link"
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <Phone size={17} className="drawer-icon" />
                  <span>Contact Team</span>
                </button>
              )}
              <Link to="/dashboard" className="mobile-drawer-link" onClick={onClose}>
                <HelpCircle size={17} className="drawer-icon" />
                <span>Help Center</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="mobile-drawer-footer">
          <div className="drawer-footer-links">
            <Link to="/dashboard" onClick={onClose}>Privacy</Link>
            <span>•</span>
            <Link to="/dashboard" onClick={onClose}>Terms</Link>
            <span>•</span>
            <Link to="/dashboard" onClick={onClose}>Safety</Link>
          </div>
          <p className="drawer-footer-copy">
            &copy; {new Date().getFullYear()} LOKHA. Founded & developed by Vishwa.
          </p>
        </div>
      </div>
    </div>
  );
}
