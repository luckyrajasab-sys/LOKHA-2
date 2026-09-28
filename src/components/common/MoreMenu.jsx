import React, { useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Map,
  GitCompare,
  TrendingUp,
  Calculator,
  MapPin,
  BarChart2,
  BookOpen,
  Star,
  HelpCircle,
  Calendar,
  PlusCircle,
  LifeBuoy,
  Phone,
  Info,
  Briefcase,
  Newspaper,
  ChevronRight,
  ShoppingBag,
  Crown,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Menu structure — grouped by category
// ─────────────────────────────────────────────────────────────────────────────

const MENU_GROUPS = [
  {
    id: 'explore',
    label: 'Explore',
    items: [
      {
        id: 'premium-plans',
        icon: Crown,
        title: 'Premium & Credits',
        desc: 'Upgrade search limits, direct owner contacts & monthly credits',
        to: '/premium',
        accent: '#D4AF37',
      },
      {
        id: 'new-projects',
        icon: Sparkles,
        title: 'New Projects',
        desc: 'RERA-verified launches & under-construction developments',
        to: '/search?status=Under+Construction',
        accent: '#B8956A',
      },
      {
        id: 'map-search',
        icon: Map,
        title: 'Map Search',
        desc: 'Discover homes visually on an interactive street-level map',
        to: '/search?view=map',
        accent: '#8A6346',
      },
      {
        id: 'compare',
        icon: GitCompare,
        title: 'Compare Homes',
        desc: 'Side-by-side comparison of up to four properties',
        to: '/search?compare=true',
        accent: '#7A6050',
      },
      {
        id: 'price-trends',
        icon: TrendingUp,
        title: 'Price Trends',
        desc: 'Historical appreciation & 5-year growth forecasts by area',
        to: '/dashboard',
        accent: '#C8A87A',
      },
      {
        id: 'emi-calculator',
        icon: Calculator,
        title: 'EMI Calculator',
        desc: 'Estimate home loan repayments with current interest rates',
        to: '/dashboard',
        accent: '#9E7453',
      },
    ],
  },
  {
    id: 'discover',
    label: 'Discover',
    items: [
      {
        id: 'localities',
        icon: MapPin,
        title: 'Localities',
        desc: 'Explore neighbourhoods, micro-markets & infrastructure scores',
        to: '/localities',
        accent: '#B8956A',
      },
      {
        id: 'popular-areas',
        icon: BarChart2,
        title: 'Popular Areas',
        desc: 'Most searched and fastest-appreciating localities right now',
        to: '/search?sort=popular',
        accent: '#8A6346',
      },
      {
        id: 'guides',
        icon: BookOpen,
        title: 'Guides',
        desc: 'Buyer, renter & seller guides with legal & financial clarity',
        to: '/about',
        accent: '#7A6050',
      },
      {
        id: 'reviews',
        icon: Star,
        title: 'Reviews',
        desc: 'Verified resident reviews of apartments, societies & localities',
        to: '/about',
        accent: '#C8A87A',
      },
      {
        id: 'faq',
        icon: HelpCircle,
        title: 'FAQ',
        desc: 'Answers to every property buying, renting & selling question',
        to: '/about',
        accent: '#9E7453',
      },
    ],
  },
  {
    id: 'services',
    label: 'Partners & Services',
    items: [
      {
        id: 'home-essentials',
        icon: ShoppingBag,
        title: 'Home Essentials & Decor',
        desc: 'Curated showroom for furniture, kitchen appliances, and furnishings',
        to: '/products',
        accent: '#D4AF7A',
      },
      {
        id: 'agents-network',
        icon: Star,
        title: 'Agents & Brokers',
        desc: 'Connect with certified RERA partner brokers and advisory specialists',
        to: '/about#agents',
        accent: '#B8956A',
      },
      {
        id: 'builders-network',
        icon: Briefcase,
        title: 'Builders & Developers',
        desc: 'Institutional developer collaborations and flagship township launches',
        to: '/about#builders',
        accent: '#8A6346',
      },
      {
        id: 'schedule-visit',
        icon: Calendar,
        title: 'Schedule a Visit',
        desc: 'Book site visits without broker calls — on your own schedule',
        to: '/saved',
        accent: '#B8956A',
      },
      {
        id: 'post-property',
        icon: PlusCircle,
        title: 'Post Property',
        desc: 'List your home for free — direct to thousands of buyers',
        to: '/sell',
        accent: '#8A6346',
      },
      {
        id: 'contact',
        icon: Phone,
        title: 'Contact Lokha',
        desc: 'Reach our team for personalized property concierge or support',
        to: '/about',
        action: 'contact',
        accent: '#C8A87A',
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    items: [
      {
        id: 'about',
        icon: Info,
        title: 'About LOKHA',
        desc: 'Our mission, technology-driven discovery & architectural standards',
        to: '/about',
        accent: '#B8956A',
      },
      {
        id: 'careers',
        icon: Briefcase,
        title: 'Careers',
        desc: 'Join a team building the future of home discovery in India',
        to: '/about',
        accent: '#8A6346',
      },
      {
        id: 'press',
        icon: Newspaper,
        title: 'Press & Media',
        desc: 'Media coverage, press releases and brand resources',
        to: '/about',
        accent: '#7A6050',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MoreMenu component
// ─────────────────────────────────────────────────────────────────────────────

export default function MoreMenu({ isOpen, onClose, triggerRef }) {
  const menuRef = useRef(null);
  const navigate = useNavigate();

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

  // Trap keyboard within menu
  const handleMenuKeyDown = useCallback(
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
      className="more-menu-panel"
      role="dialog"
      aria-label="More navigation options"
      aria-modal="false"
      onKeyDown={handleMenuKeyDown}
    >
      {/* ── Inner grid of 4 columns ── */}
      <div className="more-menu-grid">
        {MENU_GROUPS.map((group, gi) => (
          <div key={group.id} className="more-menu-col">
            {/* Column heading */}
            <p className="more-menu-col-heading">{group.label}</p>

            {/* Column items */}
            <div className="more-menu-items">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="more-menu-item"
                  onClick={onClose}
                  style={{ '--item-accent': item.accent }}
                >
                  {/* Icon bubble */}
                  <span className="more-menu-item-icon-wrap">
                    <item.icon size={15} className="more-menu-item-icon" />
                  </span>

                  {/* Text */}
                  <span className="more-menu-item-body">
                    <span className="more-menu-item-title">
                      {item.title}
                    </span>
                    <span className="more-menu-item-desc">{item.desc}</span>
                  </span>

                  {/* Arrow — appears on hover */}
                  <ChevronRight size={13} className="more-menu-item-arrow" />
                </Link>
              ))}
            </div>

            {/* Vertical divider after each column except the last */}
            {gi < MENU_GROUPS.length - 1 && (
              <div className="more-menu-col-divider" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      {/* ── Footer bar ── */}
      <div className="more-menu-footer">
        <div className="more-menu-footer-links">
          <Link to="/about" className="more-menu-footer-link" onClick={onClose}>
            About LOKHA
          </Link>
          <span className="more-menu-footer-sep" aria-hidden="true">·</span>
          <Link to="/dashboard" className="more-menu-footer-link" onClick={onClose}>
            Help Center
          </Link>
          <span className="more-menu-footer-sep" aria-hidden="true">·</span>
          <Link to="/about" className="more-menu-footer-link" onClick={onClose}>
            Careers
          </Link>
          <span className="more-menu-footer-sep" aria-hidden="true">·</span>
          <Link to="/about" className="more-menu-footer-link" onClick={onClose}>
            Press
          </Link>
        </div>
        <p className="more-menu-footer-tagline">
          LOKHA · Premium Real Estate Discovery · India
        </p>
      </div>
    </div>
  );
}
