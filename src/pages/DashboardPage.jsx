import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Calendar, MessageSquare, Home, Eye, TrendingUp,
  Search, Bell, Bookmark, Building2, Database, ShieldCheck, Plus
} from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { formatIndianPrice } from '../utils/formatters';
import EmptyState from '../components/common/EmptyState';
import PropertyManagerPanel from '../components/admin/PropertyManagerPanel';

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
  const { savedIds, scheduledVisits, properties, dbStats } = useSaved();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('database'); // Default to database tab so user can immediately see and verify the seeded data!

  const savedProps = properties.filter((p) => savedIds.includes(p.id));

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header" style={{ marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {greeting}, {user?.name?.split(' ')[0] || 'LOKHA Member'} 👋
            </p>
            <h1 style={{ fontSize: '2rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Dashboard & Marketplace Control</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name || 'User'}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
            />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '0.95rem' }}>
                {user?.name || 'LOKHA Administrator'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                {user?.role || 'Marketplace Manager'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            style={{
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'database' ? '3px solid #B8956A' : '3px solid transparent',
              color: activeTab === 'database' ? '#1E1B18' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Database size={17} color={activeTab === 'database' ? '#B8956A' : 'currentColor'} />
            <span>Database & Property Listings ({properties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '3px solid #B8956A' : '3px solid transparent',
              color: activeTab === 'overview' ? '#1E1B18' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Home size={17} color={activeTab === 'overview' ? '#B8956A' : 'currentColor'} />
            <span>My User Activity & Saved</span>
          </button>
        </div>

        {/* ── TAB 1: DATABASE & PROPERTY MANAGER ────────────────── */}
        {activeTab === 'database' && (
          <PropertyManagerPanel />
        )}

        {/* ── TAB 2: USER OVERVIEW & SAVED HOMES ────────────────── */}
        {activeTab === 'overview' && (
          <>
            {!isAuthenticated && (
              <div style={{ padding: '16px 20px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <strong style={{ color: '#92400E', fontSize: '0.92rem' }}>You are viewing in preview mode.</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#B45309' }}>
                    Sign in to sync your personal saved homes and scheduled site visits across devices.
                  </p>
                </div>
                <Link to="/login" className="btn btn-sm" style={{ background: '#B8956A', color: '#1E1B18', fontWeight: 700, textDecoration: 'none', padding: '8px 18px', borderRadius: '8px' }}>
                  Sign In Now
                </Link>
              </div>
            )}

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
                <div className="metric-icon-wrap metric-icon-blue">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <div className="metric-val">4</div>
                  <div className="metric-label">Active Inquiries</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-wrap" style={{ background: 'rgba(184, 149, 106, 0.15)', color: '#B8956A' }}>
                  <Database size={24} />
                </div>
                <div>
                  <div className="metric-val">{properties.length}</div>
                  <div className="metric-label">Live Listings in DB</div>
                </div>
              </div>
            </div>

            {/* Two column layout */}
            <div className="dashboard-grid">
              <div>
                {/* Scheduled Site Visits */}
                <div className="dashboard-panel">
                  <div className="panel-title-bar">
                    <span className="panel-title"><Calendar size={18} color="var(--color-primary-navy)" /> Scheduled Site Visits</span>
                    <span className="badge badge-featured">{scheduledVisits.length} active</span>
                  </div>

                  {scheduledVisits.length === 0 ? (
                    <EmptyState
                      icon={Calendar}
                      title="No site visits scheduled"
                      description="Schedule a physical tour or video walkthrough on any property details page."
                      actionText="Browse Homes"
                      actionLink="/search"
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-trust-blue)', fontWeight: 700 }}>85% Complete</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { label: 'Mobile Number Verified', current: 1, max: 1, barClass: 'bar-blue' },
                      { label: 'Government Photo ID', current: 1, max: 1, barClass: 'bar-blue' },
                      { label: 'EB Bill Property Document', current: 1, max: 1, barClass: 'bar-teal' },
                      { label: 'Buyer Preference Questionnaire', current: 0, max: 1, barClass: 'bar-gray' },
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
                  <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--color-teal-tint)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--color-cta-teal-hover)' }}>
                    💡 <strong>Tip:</strong> Complete verification to earn the LOKHA Blue Trust Seal for your listings.
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

                {/* Price Drop Alerts */}
                <div className="dashboard-panel">
                  <div className="panel-title-bar">
                    <span className="panel-title"><Bell size={18} color="var(--color-saved-heart)" /> Price Drop Alerts</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {PRICE_ALERTS.map((alert, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px', background: alert.type === 'drop' ? '#FEF2F2' : 'var(--color-navy-tint)', borderRadius: 'var(--radius-md)', border: `1px solid ${alert.type === 'drop' ? '#FECACA' : '#C9DCF0'}` }}>
                        <div style={{ fontSize: '1.2rem' }}>{alert.type === 'drop' ? '📉' : '🆕'}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.85rem' }}>{alert.title}</div>
                          <div style={{ fontSize: '0.78rem', color: alert.type === 'drop' ? 'var(--color-error)' : 'var(--color-primary-navy)', fontWeight: 700, marginTop: '3px' }}>{alert.alert}</div>
                        </div>
                      </div>
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
      </div>
    </div>
  );
}
