import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Sparkles, 
  TrendingDown, 
  CalendarCheck2, 
  MessageSquare, 
  Check, 
  ArrowRight
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'search_match',
    title: 'New homes matching your search',
    message: '3 newly verified 3 BHK apartments in Whitefield match your saved criteria.',
    timestamp: '12m ago',
    unread: true,
    icon: Sparkles,
    iconColor: 'var(--header-gold)',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80',
    link: '/search?q=Whitefield'
  },
  {
    id: 'notif-2',
    category: 'price_drop',
    title: 'Price changed on saved property',
    message: 'Skyline Terrace Apartment in Indiranagar dropped by ₹8 Lakhs (Now ₹1.72 Cr).',
    timestamp: '2h ago',
    unread: true,
    icon: TrendingDown,
    iconColor: 'var(--lokha-accent)',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=120&q=80',
    link: '/property/lokha-101'
  },
  {
    id: 'notif-3',
    category: 'visit_confirmed',
    title: 'Visit request confirmed',
    message: 'Owner confirmed your private walkthrough for Saturday, Oct 4 at 11:30 AM.',
    timestamp: '5h ago',
    unread: false,
    icon: CalendarCheck2,
    iconColor: 'var(--header-wood)',
    link: '/dashboard'
  },
  {
    id: 'notif-4',
    category: 'owner_message',
    title: 'New message from property owner',
    message: 'Rajesh Sharma: "Yes, the private garden terrace and EV charger are included."',
    timestamp: 'Yesterday',
    unread: false,
    icon: MessageSquare,
    iconColor: 'var(--header-walnut)',
    link: '/dashboard'
  }
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const containerRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <div className="header-notif-wrapper" ref={containerRef}>
      <button
        type="button"
        className={`header-icon-btn ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notif-dot-indicator" title={`${unreadCount} unread notifications`} />
        )}
      </button>

      {isOpen && (
        <div className="header-notif-dropdown" role="region" aria-label="Notifications Panel">
          <div className="notif-dropdown-header">
            <div className="notif-header-title">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="notif-unread-pill">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-mark-read-btn"
                onClick={markAllAsRead}
              >
                <Check size={12} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`notif-item ${item.unread ? 'is-unread' : ''}`}
                  onClick={() => {
                    markAsRead(item.id);
                    setIsOpen(false);
                  }}
                >
                  {item.thumbnail ? (
                    <div className="notif-thumb-wrap">
                      <img src={item.thumbnail} alt="" className="notif-thumb-img" />
                      <div className="notif-badge-subicon" style={{ color: item.iconColor }}>
                        <IconComp size={10} />
                      </div>
                    </div>
                  ) : (
                    <div className="notif-icon-bubble" style={{ color: item.iconColor }}>
                      <IconComp size={15} />
                    </div>
                  )}

                  <div className="notif-content">
                    <div className="notif-title-row">
                      <span className="notif-title">{item.title}</span>
                      <span className="notif-time">{item.timestamp}</span>
                    </div>
                    <p className="notif-snippet">{item.message}</p>
                  </div>

                  {item.unread && <span className="notif-unread-dot" />}
                </Link>
              );
            })}
          </div>

          <div className="notif-dropdown-footer">
            <Link
              to="/dashboard"
              className="notif-footer-link"
              onClick={() => setIsOpen(false)}
            >
              <span>Manage property alerts</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
