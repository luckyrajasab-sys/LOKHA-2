import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Database, RefreshCw, Plus, Search, MapPin, CheckCircle2,
  Trash2, Eye, Tag, AlertCircle, Sparkles, Filter, ExternalLink
} from 'lucide-react';
import { useSaved } from '../../context/SavedContext';
import { formatIndianPrice } from '../../utils/formatters';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80';

export default function PropertyManagerPanel() {
  const {
    properties,
    dbStats,
    isSeeding,
    reseedDatabase,
    updatePropertyStatus,
    deletePropertyItem
  } = useSaved();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Extract distinct cities and types
  const cities = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.city).filter(Boolean))).sort();
  }, [properties]);

  const types = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.propertyType).filter(Boolean))).sort();
  }, [properties]);

  // Filter listings
  const filteredListings = useMemo(() => {
    let result = [...properties];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.locality?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q)
      );
    }

    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    }

    if (selectedStatus) {
      result = result.filter((p) => p.status === selectedStatus);
    }

    if (selectedType) {
      result = result.filter((p) => p.propertyType === selectedType);
    }

    return result;
  }, [properties, searchQuery, selectedCity, selectedStatus, selectedType]);

  const handleStatusChange = async (propertyId, newStatus) => {
    await updatePropertyStatus(propertyId, newStatus);
  };

  const handleDelete = async (propertyId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the database?`)) {
      await deletePropertyItem(propertyId);
    }
  };

  return (
    <div className="property-manager-panel" style={{ marginTop: '32px' }}>
      {/* ── HEADER & DATABASE STATUS ─────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '24px',
          background: 'linear-gradient(135deg, #1E1B18 0%, #2A2421 100%)',
          borderRadius: '16px',
          border: '1px solid #3D352E',
          color: '#FBF9F5',
          marginBottom: '24px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(184, 149, 106, 0.2)', border: '1px solid rgba(184, 149, 106, 0.4)', padding: '4px 12px', borderRadius: '20px', color: '#E5C497', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
            <Database size={14} />
            <span>Firebase Realtime Database Architecture</span>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: '1.6rem', fontFamily: 'var(--font-serif)', color: '#FBF9F5' }}>
            Live Property Database & Admin Control
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#B3A89F', maxWidth: '600px' }}>
            Manage {properties.length} live property listings in real-time. Changes to status, prices, and listings immediately propagate to all connected clients without page refresh.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reseedDatabase(true)}
            disabled={isSeeding}
            className="btn"
            style={{
              background: '#B8956A',
              color: '#1E1B18',
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              cursor: isSeeding ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isSeeding ? 0.7 : 1
            }}
          >
            <RefreshCw size={16} className={isSeeding ? 'spin-anim' : ''} />
            <span>{isSeeding ? 'Seeding 150+ Properties…' : 'Seed / Force Reseed 150+ Properties'}</span>
          </button>

          <Link
            to="/sell"
            className="btn"
            style={{
              background: 'transparent',
              color: '#FBF9F5',
              border: '1px solid #B8956A',
              fontWeight: 700,
              padding: '10px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} color="#B8956A" />
            <span>Add New Listing</span>
          </Link>
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#7C6B5E', fontWeight: 700 }}>Total Database Listings</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2F241F', marginTop: '4px' }}>{properties.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#00A69C', marginTop: '2px', fontWeight: 600 }}>● Live Synced</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#7C6B5E', fontWeight: 700 }}>Available / Active</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>{dbStats?.available ?? properties.filter((p) => p.status === 'Available').length}</div>
          <div style={{ fontSize: '0.75rem', color: '#7C6B5E', marginTop: '2px' }}>Open for inquiries</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#7C6B5E', fontWeight: 700 }}>Sold Properties</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626', marginTop: '4px' }}>{dbStats?.sold ?? properties.filter((p) => p.status === 'Sold').length}</div>
          <div style={{ fontSize: '0.75rem', color: '#7C6B5E', marginTop: '2px' }}>Marked as sold out</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#7C6B5E', fontWeight: 700 }}>Rented / Leased</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>{dbStats?.rented ?? properties.filter((p) => p.status === 'Rented').length}</div>
          <div style={{ fontSize: '0.75rem', color: '#7C6B5E', marginTop: '2px' }}>Occupied listings</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#7C6B5E', fontWeight: 700 }}>Cities Represented</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2F241F', marginTop: '4px' }}>{cities.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#7C6B5E', marginTop: '2px' }}>Across India</div>
        </div>
      </div>

      {/* ── FILTER TOOLBAR ───────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '14px 18px',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E8DFD5',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="Search by title, locality, city, ID…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '0.88rem' }}
          />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 600, background: '#fff' }}
        >
          <option value="">All Cities ({cities.length})</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 600, background: '#fff' }}
        >
          <option value="">All Types ({types.length})</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 600, background: '#fff' }}
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Rented">Rented</option>
        </select>

        <span style={{ fontSize: '0.82rem', color: '#7C6B5E', fontWeight: 600, marginLeft: 'auto' }}>
          Showing {filteredListings.length} of {properties.length}
        </span>
      </div>

      {/* ── LISTINGS TABLE ───────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8DFD5', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 16px' }}>Property</th>
                <th style={{ padding: '14px 16px' }}>Type & Purpose</th>
                <th style={{ padding: '14px 16px' }}>Location</th>
                <th style={{ padding: '14px 16px' }}>Price</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Real-time Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.slice(0, 50).map((p) => {
                const isSold = p.status === 'Sold';
                const isRented = p.status === 'Rented';

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.1s' }} className="admin-table-row">
                    {/* Media & Title */}
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.images?.[0] || DEFAULT_FALLBACK_IMAGE}
                        alt={p.title}
                        style={{ width: '60px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                        onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#2F241F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                          <Link to={`/property/${p.id}`} style={{ color: '#2F241F', textDecoration: 'none' }} title={p.title}>
                            {p.title}
                          </Link>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#7C6B5E', marginTop: '2px' }}>
                          ID: <span style={{ fontFamily: 'monospace' }}>{p.id}</span> {p.isSeed ? '· Seed' : '· User Created'}
                        </div>
                      </div>
                    </td>

                    {/* Type & Purpose */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#2F241F' }}>{p.propertyType || p.type}</div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#B8956A',
                          marginTop: '2px'
                        }}
                      >
                        {p.purpose === 'sale' ? 'For Sale' : p.purpose === 'rent' ? 'For Rent' : 'For Lease'}
                      </span>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#2F241F' }}>{p.locality}</div>
                      <div style={{ fontSize: '0.76rem', color: '#7C6B5E' }}>{p.city} · {p.pincode}</div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E1B18' }}>
                      {formatIndianPrice(p.price, p.purpose)}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: isSold ? '#FEE2E2' : isRented ? '#FEF3C7' : '#DCFCE7',
                          color: isSold ? '#B91C1C' : isRented ? '#B45309' : '#15803D'
                        }}
                      >
                        {p.status || 'Available'}
                      </span>
                    </td>

                    {/* Real-time Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {!isSold && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(p.id, 'Sold')}
                            className="btn btn-sm"
                            style={{ fontSize: '0.72rem', padding: '4px 8px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                            title="Mark as Sold"
                          >
                            Mark Sold
                          </button>
                        )}

                        {!isRented && p.purpose !== 'sale' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(p.id, 'Rented')}
                            className="btn btn-sm"
                            style={{ fontSize: '0.72rem', padding: '4px 8px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                            title="Mark as Rented"
                          >
                            Mark Rented
                          </button>
                        )}

                        {(isSold || isRented) && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(p.id, 'Available')}
                            className="btn btn-sm"
                            style={{ fontSize: '0.72rem', padding: '4px 8px', background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                            title="Mark as Available"
                          >
                            Make Available
                          </button>
                        )}

                        <Link
                          to={`/property/${p.id}`}
                          style={{ color: '#00A69C', padding: '4px 6px', display: 'inline-flex', alignItems: 'center' }}
                          title="View on site"
                        >
                          <ExternalLink size={15} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.title)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', padding: '4px 6px', cursor: 'pointer' }}
                          title="Delete Property"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredListings.length > 50 && (
          <div style={{ padding: '14px', textAlign: 'center', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.84rem' }}>
            Showing first 50 results of {filteredListings.length}. Refine search query or city to see specific records.
          </div>
        )}
      </div>

      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .admin-table-row:hover {
          background: #FAF8F5 !important;
        }
      `}</style>
    </div>
  );
}
