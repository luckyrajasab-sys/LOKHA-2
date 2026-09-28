import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Heart, 
  Bookmark, 
  Bell, 
  Calendar, 
  MessageSquare, 
  History, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  PlusCircle, 
  FileText, 
  Mail, 
  BarChart3, 
  ChevronDown,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function UserAccountMenu() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showToast('You have been signed out safely.', 'info');
    navigate('/');
  };

  // If logged out: render the Sign In button
  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="header-signin-btn"
      >
        <User size={15} />
        <span>Sign In</span>
      </Link>
    );
  }

  // If logged in: render the Avatar button with rich account dropdown
  const displayName = user?.name || 'Vishwa';
  const displayEmail = user?.email || 'vishwa@lokha.in';
  const avatarUrl = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="header-account-wrapper" ref={menuRef}>
      <button
        type="button"
        className={`header-avatar-btn ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="User Account Menu"
        aria-expanded={isOpen}
      >
        <img src={avatarUrl} alt={displayName} className="header-avatar-img" />
        <span className="header-avatar-name">{displayName.split(' ')[0]}</span>
        <ChevronDown size={14} className={`header-chevron-icon ${isOpen ? 'is-flipped' : ''}`} />
      </button>

      {isOpen && (
        <div className="header-account-dropdown" role="menu">
          {/* User Profile Card */}
          <div className="account-dropdown-profile">
            <img src={avatarUrl} alt="" className="account-dropdown-avatar" />
            <div className="account-dropdown-userinfo">
              <div className="account-user-name-row">
                <span className="account-user-name">{displayName}</span>
                <span className="account-verified-pill" title="Verified LOKHA Member">
                  <ShieldCheck size={11} /> Verified
                </span>
              </div>
              <span className="account-user-email">{displayEmail}</span>
            </div>
          </div>

          <div className="account-dropdown-scrollable">
            {/* Section 1: My LOKHA */}
            <div className="account-dropdown-section">
              <span className="account-section-label">My Homes & Activity</span>
              <Link to="/premium" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <Crown size={15} className="item-icon-gold" style={{ color: '#D4AF37' }} />
                <span style={{ fontWeight: 600 }}>Premium & Credits</span>
              </Link>
              <Link to="/saved" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <Heart size={15} className="item-icon-warm" />
                <span>My Homes & Saved Properties</span>
              </Link>
              <Link to="/search?saved=true" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <Bookmark size={15} className="item-icon-warm" />
                <span>Saved Searches</span>
              </Link>
              <Link to="/dashboard?tab=alerts" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <Bell size={15} className="item-icon-warm" />
                <span>My Alerts</span>
              </Link>
              <Link to="/dashboard?tab=visits" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <Calendar size={15} className="item-icon-warm" />
                <span>My Scheduled Visits</span>
              </Link>
              <Link to="/dashboard?tab=messages" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <MessageSquare size={15} className="item-icon-warm" />
                <span>Messages & Inquiries</span>
              </Link>
              <Link to="/search?recent=true" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <History size={15} className="item-icon-warm" />
                <span>Recently Viewed</span>
              </Link>
            </div>

            {/* Section 2: For Owners & Agents */}
            <div className="account-dropdown-section">
              <span className="account-section-label">For Owners & Hosts</span>
              <Link to="/sell" className="account-menu-item highlight" onClick={() => setIsOpen(false)}>
                <PlusCircle size={15} className="item-icon-gold" />
                <span>List a New Property</span>
              </Link>
              <Link to="/dashboard?tab=listings" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <FileText size={15} className="item-icon-warm" />
                <span>My Listings</span>
              </Link>
              <Link to="/dashboard?tab=leads" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <Mail size={15} className="item-icon-warm" />
                <span>Lead Inbox</span>
              </Link>
              <Link to="/dashboard?tab=analytics" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <BarChart3 size={15} className="item-icon-warm" />
                <span>Listing Analytics</span>
              </Link>
              <Link to="/dashboard" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <LayoutDashboard size={15} className="item-icon-warm" />
                <span>Owner Dashboard</span>
              </Link>
            </div>

            {/* Section 3: Settings & Sign Out */}
            <div className="account-dropdown-section border-top">
              <Link to="/dashboard?tab=settings" className="account-menu-item" onClick={() => setIsOpen(false)}>
                <Settings size={15} className="item-icon-warm" />
                <span>Account Settings</span>
              </Link>
              <button type="button" className="account-menu-item sign-out" onClick={handleLogout}>
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
