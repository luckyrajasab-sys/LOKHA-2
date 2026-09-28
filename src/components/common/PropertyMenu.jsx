import React, { useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Building,
  PlusCircle,
  Sparkles,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const PROPERTY_LINKS = [
  {
    id: 'buy',
    title: 'Buy',
    desc: 'Ready-to-move luxury apartments, villas, penthouses & plots',
    to: '/search?purpose=sale',
    icon: Home,
    badge: 'For Sale',
    accent: '#B8956A',
  },
  {
    id: 'rent',
    title: 'Rent',
    desc: 'Verified designer flats, furnished residences & gated homes',
    to: '/search?purpose=rent',
    icon: Building,
    badge: 'For Rent',
    accent: '#8A6346',
  },
  {
    id: 'sell',
    title: 'Sell',
    desc: 'List your property for sale or lease & get verified badge',
    to: '/sell',
    icon: PlusCircle,
    badge: 'List Free',
    accent: '#0095F6',
  },
  {
    id: 'new-projects',
    title: 'New Projects',
    desc: 'RERA-registered upcoming launches & premier townships',
    to: '/search?status=Under+Construction',
    icon: Sparkles,
    badge: 'RERA Verified',
    accent: '#C8A87A',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    desc: 'Executive corporate offices, retail spaces & co-working',
    to: '/search?purpose=commercial',
    icon: Briefcase,
    badge: 'Offices & Retail',
    accent: '#7A6050',
  },
];

export default function PropertyMenu({ isOpen, onClose, triggerRef }) {
  const menuRef = useRef(null);
  const location = useLocation();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, onClose, triggerRef]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        triggerRef?.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, triggerRef]);

  // Keyboard trap
  const handleKeyDown = useCallback(
    (e) => {
      if (!menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll('a[href], button:not([disabled])')
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="property-menu-panel"
      role="menu"
      aria-label="Property categories and options"
      onKeyDown={handleKeyDown}
    >
      {/* Header bar */}
      <div className="property-menu-header">
        <span className="property-menu-header-tag">PROPERTY PORTFOLIO</span>
        <span className="property-menu-header-sub">Curated Indian Real Estate</span>
      </div>

      {/* Main Items List */}
      <div className="property-menu-items">
        {PROPERTY_LINKS.map((item) => {
          const Icon = item.icon;
          const isItemActive = location.pathname + location.search === item.to;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`property-menu-item ${isItemActive ? 'is-current' : ''}`}
              onClick={onClose}
              role="menuitem"
              style={{ '--item-accent': item.accent }}
            >
              {/* Icon wrap */}
              <div className="property-item-icon-wrap">
                <Icon size={18} className="property-item-icon" />
              </div>

              {/* Text content */}
              <div className="property-item-content">
                <div className="property-item-title-row">
                  <span className="property-item-title">{item.title}</span>
                  {item.badge && (
                    <span 
                      className={`property-item-badge ${item.id === 'sell' ? 'badge-verified-blue' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="property-item-desc">{item.desc}</p>
              </div>

              {/* Arrow */}
              <ChevronRight size={15} className="property-item-arrow" />
            </Link>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="property-menu-footer">
        <div className="property-menu-footer-info">
          <ShieldCheck size={14} className="property-menu-shield-icon" />
          <span>All properties pass 40+ architectural & legal quality checks</span>
        </div>
        <Link 
          to="/sell" 
          className="property-menu-footer-cta"
          onClick={onClose}
        >
          <span>List Free</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
