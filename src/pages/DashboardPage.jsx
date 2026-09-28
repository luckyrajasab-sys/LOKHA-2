import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Heart, Calendar, MessageSquare, Home, Eye, TrendingUp,
  Search, Bell, Bookmark, Building2, Database, ShieldCheck, Plus,
  User, Phone, Mail, CheckCircle2, AlertCircle, FileText, Send
} from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatIndianPrice } from '../utils/formatters';
import EmptyState from '../components/common/EmptyState';
import PropertyManagerPanel from '../components/admin/PropertyManagerPanel';
import { getUserInquiries, getOwnerInquiries, updateInquiryStatus } from '../services/inquiryService';

const RECENT_SEARCHES = [
  { q: '3 BHK in Whitefield, Bengaluru', count: '1,248 homes', time: '2 hours ago' },
  { q: 'Rental flats under ₹40K in HSR Layout', count: '312 homes', time: '1 day ago' },
  { q: 'Villas in Sarjapur Road', count: '89 homes', time: '3 days ago' },
];

const PRICE_ALERTS = [
  { title: 'Anna Nagar 2 BHK, Chennai', alert: 'Price dropped by ₹3.5 Lakh', type: 'drop' },
  { title: 'Golf Course Road 4 BHK, Gurgaon', alert: 'New verified listing added nearby', type: 'new' },
];

export default function DashboardPage() {
  const location = useLocation();
  const { savedIds, scheduledVisits, properties, dbStats } = useSaved();
  const { user, userProfile, updateProfileData } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Listen to URL ?tab= parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      if (tabParam === 'listings') setActiveTab('my-listings');
      else if (tabParam === 'messages' || tabParam === 'leads') setActiveTab('inquiries');
      else if (tabParam === 'settings') setActiveTab('profile');
      else if (tabParam === 'alerts' || tabParam === 'visits') setActiveTab('overview');
      else setActiveTab(tabParam);
    }
  }, [location.search]);

  // Sync profile form when userProfile changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || user.displayName || '');
      setProfilePhone(user.phone || user.mobile || '');
    }
  }, [user]);

  // Load inquiries when on inquiries tab
  useEffect(() => {
    if (activeTab === 'inquiries' && user?.uid) {
      setLoadingInquiries(true);
      Promise.all([
        getUserInquiries(user.uid),
        getOwnerInquiries(user.uid)
      ])
        .then(([sent, received]) => {
          // Merge unique by inquiryId
          const map = new Map();
          [...sent, ...received].forEach((inq) => map.set(inq.inquiryId, inq));
          setInquiries(Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
        })
        .catch((err) => console.warn('Error loading inquiries:', err))
        .finally(() => setLoadingInquiries(false));
    }
  }, [activeTab, user?.uid]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfileData({
        fullName: profileName.trim(),
        phone: profilePhone.trim()
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const savedProps = properties.filter((p) => savedIds.includes(p.id));
  const myListedProps = properties.filter(
    (p) => user?.uid && (p.ownerUid === user.uid || p.createdBy === user.uid)
  );

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const roleDisplay = (user?.role || 'buyer').toUpperCase();

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header" style={{ marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {greeting}, {user?.name?.split(' ')[0] || 'LOKHA Member'} 👋
            </p>
            <h1 style={{ fontSize: '2rem', margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)' }}>
              Dashboard & Control Center
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4A3024&color=fff`}
              alt={user?.name || 'User'}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
            />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                {user?.name || 'LOKHA Member'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-verified" style={{ fontSize: '0.72rem', padding: '2px 6px' }}>
                  <ShieldCheck size={11} /> {roleDisplay}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', overflowX: 'auto' }}>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '3px solid var(--lokha-wood, #C29B38)' : '3px solid transparent',
              color: activeTab === 'overview' ? 'var(--color-text-main)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Home size={16} color={activeTab === 'overview' ? 'var(--lokha-wood, #C29B38)' : 'currentColor'} />
            <span>Overview & Activity ({savedIds.length} Saved)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-listings')}
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'my-listings' ? '3px solid var(--lokha-wood, #C29B38)' : '3px solid transparent',
              color: activeTab === 'my-listings' ? 'var(--color-text-main)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <FileText size={16} color={activeTab === 'my-listings' ? 'var(--lokha-wood, #C29B38)' : 'currentColor'} />
            <span>My Listed Properties ({myListedProps.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'inquiries' ? '3px solid var(--lokha-wood, #C29B38)' : '3px solid transparent',
              color: activeTab === 'inquiries' ? 'var(--color-text-main)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <MessageSquare size={16} color={activeTab === 'inquiries' ? 'var(--lokha-wood, #C29B38)' : 'currentColor'} />
            <span>Inquiries & Leads</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'database' ? '3px solid var(--lokha-wood, #C29B38)' : '3px solid transparent',
              color: activeTab === 'database' ? 'var(--color-text-main)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Database size={16} color={activeTab === 'database' ? 'var(--lokha-wood, #C29B38)' : 'currentColor'} />
            <span>Marketplace Inventory ({properties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 18px',
              fontSize: '0.92rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '3px solid var(--lokha-wood, #C29B38)' : '3px solid transparent',
              color: activeTab === 'profile' ? 'var(--color-text-main)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <User size={16} color={activeTab === 'profile' ? 'var(--lokha-wood, #C29B38)' : 'currentColor'} />
            <span>Profile & Account</span>
          </button>
        </div>

        {/* ── TAB 1: DATABASE & PROPERTY MANAGER ────────────────── */}
        {activeTab === 'database' && (
          <PropertyManagerPanel />
        )}

        {/* ── TAB 2: USER OVERVIEW & SAVED HOMES ────────────────── */}
        {activeTab === 'overview' && (
          <>
            {/* Metric Cards */}
            <div className="metrics-grid">
              <Link to="/saved" style={{ textDecoration: 'none' }}>
                <div className="metric-card">
                  <div className="metric-icon-wrap metric-icon-heart">
                    <Heart size={24} fill="var(--color-saved-heart)" />
                  </div>
                  <div>
                    <div className="metric-val">{savedIds.length}</div>
                    <div className="metric-label">Saved Homes</div>
                  </div>
                </div>
              </Link>

              <div className="metric-card">
                <div className="metric-icon-wrap metric-icon-navy">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="metric-val">{scheduledVisits.length}</div>
                  <div className="metric-label">Scheduled Visits</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-wrap metric-icon-gold">
                  <Eye size={24} />
                </div>
                <div>
                  <div className="metric-val">12</div>
                  <div className="metric-label">Properties Viewed</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-wrap metric-icon-teal">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="metric-val">{myListedProps.length}</div>
                  <div className="metric-label">My Listings</div>
                </div>
              </div>
            </div>

            {/* Main content grid */}
            <div className="dashboard-grid">
              <div>
                {/* Scheduled Site Visits */}
                <div className="dashboard-panel">
                  <div className="panel-title-bar">
                    <span className="panel-title"><Calendar size={18} color="var(--color-trust-blue)" /> Scheduled Site Visits</span>
                    <span className="panel-count">{scheduledVisits.length}</span>
                  </div>

                  {scheduledVisits.length === 0 ? (
                    <EmptyState
                      icon={Calendar}
                      title="No site visits scheduled"
                      description="Schedule free verified site visits directly from any property page."
                      actionText="Explore Properties"
                      onAction={() => window.location.href = '/search'}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {scheduledVisits.map((vis) => (
                        <div key={vis.id} className="visit-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <Link to={`/property/${vis.propertyId}`} style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '0.95rem', textDecoration: 'none' }}>
                              {vis.propertyTitle}
                            </Link>
                            <span className="badge badge-verified" style={{ flexShrink: 0 }}>{vis.status}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <span>📍 {vis.locality}</span>
                            <span>📅 {vis.date}</span>
                            <span>⏰ {vis.timeSlot}</span>
                            <span>👤 {vis.agentName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile Completion */}
                <div className="dashboard-panel">
                  <div className="panel-title-bar">
                    <span className="panel-title"><TrendingUp size={18} color="var(--color-cta-teal)" /> Profile Trust Score</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-trust-blue)', fontWeight: 700 }}>
                      {user?.emailVerified ? '100% Verified' : '85% Verified'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { label: 'Firebase Account Authentication', current: 1, max: 1, barClass: 'bar-blue' },
                      { label: 'Mobile Number on Profile', current: user?.mobile ? 1 : 0, max: 1, barClass: 'bar-blue' },
                      { label: 'Role Registered as ' + roleDisplay, current: 1, max: 1, barClass: 'bar-teal' },
                    ].map((item) => (
                      <div key={item.label} className="chart-bar-group">
                        <div className="chart-bar-label">
                          <span>{item.label}</span>
                          <span style={{ color: 'var(--color-primary-navy)' }}>{item.current ? 'Done ✓' : 'Pending'}</span>
                        </div>
                        <div className="chart-bar-track">
                          <div className={`chart-bar-fill ${item.barClass}`} style={{ width: `${(item.current / item.max) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {/* Recent Searches */}
                <div className="dashboard-panel">
                  <div className="panel-title-bar">
                    <span className="panel-title"><Search size={18} color="var(--color-trust-blue)" /> Recent Searches</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {RECENT_SEARCHES.map((s, i) => (
                      <Link
                        key={i}
                        to={`/search?q=${encodeURIComponent(s.q)}`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '12px',
                          background: 'var(--color-bg-page)',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          border: '1px solid var(--color-border-subtle)',
                          transition: 'border-color 0.15s'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.88rem' }}>{s.q}</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.76rem', color: 'var(--color-trust-blue)', fontWeight: 600 }}>{s.count}</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{s.time}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Saved homes mini-list */}
                {savedProps.length > 0 && (
                  <div className="dashboard-panel">
                    <div className="panel-title-bar">
                      <span className="panel-title"><Bookmark size={18} color="var(--color-saved-heart)" /> Saved Homes</span>
                      <Link to="/saved" style={{ fontSize: '0.8rem', color: 'var(--color-trust-blue)', fontWeight: 600 }}>View All →</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {savedProps.slice(0, 3).map((p) => (
                        <Link key={p.id} to={`/property/${p.id}`} style={{ display: 'flex', gap: '10px', textDecoration: 'none', padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-page)', border: '1px solid var(--color-border-subtle)' }}>
                          <img src={p.images?.[0]} alt={p.title} style={{ width: '60px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {formatIndianPrice(p.price, p.purpose)}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>{p.bhk ? `${p.bhk} BHK` : p.propertyType} · {p.locality}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── TAB 3: MY LISTED PROPERTIES ───────────────────────── */}
        {activeTab === 'my-listings' && (
          <div className="dashboard-panel">
            <div className="panel-title-bar" style={{ marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px' }}>My Real Estate Listings</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Properties you have published and listed under your Firebase account.
                </p>
              </div>
              <Link to="/sell" className="btn btn-cta-teal" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                <Plus size={16} /> List New Property
              </Link>
            </div>

            {myListedProps.length === 0 ? (
              <EmptyState
                icon={Home}
                title="No properties listed yet"
                description="List your flat, house, villa, or commercial property with verified ownership documentation."
                actionText="Post Your Property"
                onAction={() => window.location.href = '/sell'}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {myListedProps.map((prop) => (
                  <div key={prop.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#FFFFFF' }}>
                    <img src={prop.images?.[0]} alt={prop.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge badge-verified" style={{ fontSize: '0.72rem' }}>{prop.status || 'Available'}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{prop.propertyType}</span>
                      </div>
                      <h4 style={{ fontSize: '1rem', margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prop.title}
                      </h4>
                      <div style={{ fontWeight: 700, color: 'var(--color-cta-teal)', fontSize: '1.1rem', marginBottom: '8px' }}>
                        {formatIndianPrice(prop.price, prop.purpose)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                        📍 {prop.locality}, {prop.city}
                      </div>
                      <Link to={`/property/${prop.id}`} className="btn btn-outline" style={{ width: '100%', display: 'block', textAlign: 'center', fontSize: '0.85rem' }}>
                        View Marketplace Listing
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: INQUIRIES & LEADS ───────────────────────────── */}
        {activeTab === 'inquiries' && (
          <div className="dashboard-panel">
            <div className="panel-title-bar" style={{ marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px' }}>Inquiries & Direct Messages</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Realtime inquiries sent and received for properties on LOKHA.
                </p>
              </div>
            </div>

            {loadingInquiries ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                Loading inquiries from Firebase Realtime Database…
              </div>
            ) : inquiries.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No inquiries found"
                description="When prospective buyers contact you about your properties or you contact a lister, messages appear here in real time."
                actionText="Explore Properties"
                onAction={() => window.location.href = '/search'}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {inquiries.map((inq) => (
                  <div
                    key={inq.inquiryId}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px',
                      background: inq.senderUid === user?.uid ? '#F8FAFC' : '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '1rem' }}>
                          {inq.propertyTitle}
                        </span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                          From: <strong>{inq.senderName}</strong> • Phone: <a href={`tel:${inq.senderPhone}`} style={{ color: 'var(--color-cta-teal)' }}>{inq.senderPhone}</a>
                          {inq.senderEmail && ` • ${inq.senderEmail}`}
                        </div>
                      </div>
                      <span className="badge badge-verified" style={{ textTransform: 'capitalize' }}>
                        {inq.status || 'new'}
                      </span>
                    </div>

                    <div style={{ padding: '12px 14px', background: 'var(--color-bg-page)', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--color-text-main)', marginTop: '8px' }}>
                      "{inq.message}"
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                      <span>Submitted: {new Date(inq.createdAt || Date.now()).toLocaleString()}</span>
                      <Link to={`/property/${inq.propertyId}`} style={{ color: 'var(--color-trust-blue)', fontWeight: 600 }}>
                        View Property →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: PROFILE & ACCOUNT SETTINGS ─────────────────── */}
        {activeTab === 'profile' && (
          <div className="dashboard-panel" style={{ maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Profile & Account Details</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              Manage your verified Firebase user profile information.
            </p>

            <form onSubmit={handleSaveProfile}>
              <div className="form-field" style={{ marginBottom: '16px' }}>
                <label className="form-label">Firebase Account UID</label>
                <input
                  type="text"
                  className="form-input"
                  value={user?.uid || ''}
                  disabled
                  style={{ background: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-field" style={{ marginBottom: '16px' }}>
                <label className="form-label">Email Address (Immutable Identity)</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ background: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-field" style={{ marginBottom: '16px' }}>
                <label className="form-label">Assigned Account Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={roleDisplay}
                  disabled
                  style={{ background: '#F1F5F9', color: '#64748B', cursor: 'not-allowed', fontWeight: 600 }}
                />
              </div>

              <div className="form-field" style={{ marginBottom: '16px' }}>
                <label className="form-label" htmlFor="edit-name">Full Name</label>
                <input
                  id="edit-name"
                  type="text"
                  className="form-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-field" style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="edit-phone">Contact Phone Number</label>
                <input
                  id="edit-phone"
                  type="tel"
                  className="form-input"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98450 00000"
                />
              </div>

              <button
                type="submit"
                className="btn btn-cta-teal"
                disabled={profileSaving}
                style={{ padding: '12px 24px', fontSize: '0.95rem' }}
              >
                {profileSaving ? 'Saving Updates…' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
