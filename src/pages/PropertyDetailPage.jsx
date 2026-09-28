import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, MapPin, BedDouble, Bath,
  Maximize, Car, CheckCircle2, ShieldCheck, AlertTriangle,
  IndianRupee, Phone, Calendar, ChevronDown, ChevronUp,
  Star, Building2
} from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import PropertyImageGallery from '../components/property/PropertyImageGallery';
import AmenityGrid from '../components/property/AmenityGrid';
import NearbyPlaces from '../components/property/NearbyPlaces';
import PriceTrendChart from '../components/property/PriceTrendChart';
import PropertyCard from '../components/property/PropertyCard';
import VisitSchedulerModal from '../components/property/VisitSchedulerModal';
import ContactOwnerModal from '../components/property/ContactOwnerModal';
import PropertyLocationMap from '../components/property/PropertyLocationMap';
import { fetchNearbyAmenities } from '../services/nearbyService';
import { formatIndianPrice, calculateEstimatedEMI, formatArea, formatPricePerSqFt } from '../utils/formatters';
import { calculateDistanceKm, formatDistance } from '../utils/haversine';
import { VerifiedBadge, StatusBadge } from '../components/common/VerifiedBadge';
import EmptyState from '../components/common/EmptyState';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, isSaved, toggleSave } = useSaved();
  const { isAuthenticated, openAuthModal } = useAuth();

  const property = properties.find((p) => p.id === id);

  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  if (!property) {
    return (
      <div className="container" style={{ paddingTop: '60px' }}>
        <EmptyState
          icon={Building2}
          title="Property not found"
          description="This property may have been removed or the link is incorrect."
          actionText="Browse Properties"
          actionLink="/search"
        />
      </div>
    );
  }

  const saved = isSaved(property.id);
  const emiText = calculateEstimatedEMI(property.price, property.purpose);
  const ppsf = formatPricePerSqFt(property.price, property.area);

  const currentLat = property.latitude ?? property.mapCoords?.lat ?? 12.9716;
  const currentLng = property.longitude ?? property.mapCoords?.lng ?? 77.5946;

  // Similar properties in same city
  const similar = properties
    .filter((p) => p.id !== property.id && p.city === property.city && p.purpose === property.purpose)
    .slice(0, 3);

  // Nearby properties calculated by distance
  const nearbyProps = properties
    .filter((p) => p.id !== property.id)
    .map((p) => {
      const pLat = p.latitude ?? p.mapCoords?.lat;
      const pLng = p.longitude ?? p.mapCoords?.lng;
      if (pLat && pLng) {
        const dist = calculateDistanceKm(currentLat, currentLng, pLat, pLng);
        return {
          ...p,
          distanceKm: dist,
          distanceText: formatDistance(dist) ? `${formatDistance(dist)} away` : null
        };
      }
      return { ...p, distanceKm: 9999, distanceText: null };
    })
    .filter((p) => p.distanceKm != null && p.distanceKm <= 40)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);

  const SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' },
    { id: 'price-trend', label: 'Price Trend' },
    { id: 'similar', label: 'Similar Homes' },
    { id: 'nearby', label: 'Nearby Homes' },
  ];

  return (
    <div className="property-detail-page">
      <div className="container">
        {/* ── TOP NAV ────────────────────────────────── */}
        <div className="detail-top-nav">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className={`btn-save-heart ${saved ? 'is-saved' : ''}`}
              onClick={() => toggleSave(property.id)}
              aria-label={saved ? 'Remove from saved' : 'Save property'}
              title={saved ? 'Remove from saved' : 'Save'}
              style={{ border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '6px 12px', borderRadius: 'var(--radius-md)', background: '#fff', fontSize: '0.84rem', fontWeight: 600, color: saved ? 'var(--color-saved-heart)' : 'var(--color-text-secondary)' }}
            >
              <Heart size={16} fill={saved ? 'var(--color-saved-heart)' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Share2 size={15} /> Share
            </button>
          </div>
        </div>

        {/* ── GALLERY ───────────────────────────────── */}
        <PropertyImageGallery images={property.images} title={property.title} />

        {/* ── SECTION NAV ───────────────────────────── */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', overflowX: 'auto' }}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setActiveSection(sec.id);
                document.getElementById(`section-${sec.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{
                padding: '12px 16px',
                fontSize: '0.88rem',
                fontWeight: 600,
                borderBottom: `3px solid ${activeSection === sec.id ? 'var(--color-trust-blue)' : 'transparent'}`,
                color: activeSection === sec.id ? 'var(--color-primary-navy)' : 'var(--color-text-secondary)',
                whiteSpace: 'nowrap',
                background: 'none',
                transition: 'all 0.15s'
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* ── MAIN DETAIL LAYOUT ────────────────────── */}
        <div className="detail-layout">
          {/* LEFT — Details Content */}
          <div>
            {/* Title & Badges */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                {property.verified && <VerifiedBadge />}
                <StatusBadge status={property.possessionStatus} />
                {property.featured && <span className="badge badge-featured">Featured</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: 'var(--color-primary-navy)', marginBottom: '8px', lineHeight: 1.25 }}>
                {property.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                <MapPin size={16} color="var(--color-trust-blue)" />
                <span>{property.locality}, {property.city}, {property.state}</span>
              </div>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-primary-navy)' }}>
                {formatIndianPrice(property.price, property.purpose)}
              </span>
              {emiText && (
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg-page)', padding: '3px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
                  {emiText}
                </span>
              )}
            </div>

            {/* Key Facts */}
            <div className="key-facts-grid" id="section-overview">
              {property.bhk > 0 && (
                <div className="fact-item">
                  <div className="fact-icon-wrapper"><BedDouble size={20} /></div>
                  <div className="fact-info">
                    <span className="fact-value">{property.bhk} Beds</span>
                    <span className="fact-label">Bedrooms</span>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="fact-item">
                  <div className="fact-icon-wrapper"><Bath size={20} /></div>
                  <div className="fact-info">
                    <span className="fact-value">{property.bathrooms} Baths</span>
                    <span className="fact-label">Bathrooms</span>
                  </div>
                </div>
              )}
              <div className="fact-item">
                <div className="fact-icon-wrapper"><Maximize size={20} /></div>
                <div className="fact-info">
                  <span className="fact-value">{formatArea(property.area)}</span>
                  <span className="fact-label">Built-up Area</span>
                </div>
              </div>
              {property.parking > 0 && (
                <div className="fact-item">
                  <div className="fact-icon-wrapper"><Car size={20} /></div>
                  <div className="fact-info">
                    <span className="fact-value">{property.parking} Covered</span>
                    <span className="fact-label">Parking</span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Key Info */}
            <div className="detail-section" style={{ marginTop: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { label: 'Price per sq ft', value: ppsf },
                  { label: 'Maintenance', value: property.maintenance ? `₹${property.maintenance.toLocaleString('en-IN')}/month` : 'N/A' },
                  { label: 'Possession', value: property.possessionStatus },
                  { label: 'Furnishing', value: property.furnishing || 'N/A' },
                  { label: 'Floor', value: property.floor || 'N/A' },
                  { label: 'Facing', value: property.facing || 'N/A' },
                  { label: 'Posted By', value: property.postedBy || 'N/A' },
                  { label: 'Posted', value: property.postedTime || 'Recently' },
                ].map((row) => (
                  <div key={row.label}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="detail-section">
              <div className="detail-section-title">Overview</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
                <p style={{ display: descExpanded ? 'block' : '-webkit-box', WebkitLineClamp: descExpanded ? 'unset' : 4, WebkitBoxOrient: 'vertical', overflow: descExpanded ? 'visible' : 'hidden' }}>
                  {property.overview}
                </p>
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  style={{ color: 'var(--color-trust-blue)', fontWeight: 600, fontSize: '0.88rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {descExpanded ? (<><ChevronUp size={15} /> Show less</>) : (<><ChevronDown size={15} /> Read full description</>)}
                </button>
              </div>
            </div>

            {/* Amenities */}
            <div className="detail-section" id="section-amenities">
              <div className="detail-section-title">Amenities</div>
              <AmenityGrid amenities={property.amenities} />
            </div>

            {/* Location & Map Section */}
            <div className="detail-section" id="section-location">
              <div className="detail-section-title">Location & Neighborhood</div>
              <PropertyLocationMap
                lat={currentLat}
                lng={currentLng}
                title={property.title}
                locality={property.locality}
                city={property.city}
              />
              {property.nearby && property.nearby.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary-navy)', marginBottom: '12px' }}>
                    Key Landmarks & Transit
                  </h4>
                  <NearbyPlaces places={property.nearby} />
                </div>
              )}
            </div>

            {/* Price Trend */}
            {property.priceTrend && (
              <div className="detail-section" id="section-price-trend">
                <div className="detail-section-title">Locality Price Trend</div>
                <PriceTrendChart trend={property.priceTrend} />
              </div>
            )}

            {/* Nearby Properties */}
            {nearbyProps.length > 0 && (
              <div id="section-nearby" style={{ marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: 'var(--color-primary-navy)' }}>Nearby Properties Around {property.locality || property.city}</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Calculated by GPS radius</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {nearbyProps.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div id="section-similar" style={{ marginTop: '32px' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--color-primary-navy)' }}>Similar Properties in {property.city}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Sticky Contact Sidebar */}
          <div>
            <div className="sticky-contact-sidebar">
              {/* Agent Card */}
              {property.agent && (
                <div className="agent-card">
                  <img src={property.agent.photo} alt={property.agent.name} className="agent-avatar" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="agent-name">{property.agent.name}</span>
                      {property.verified && <ShieldCheck size={15} color="var(--color-verified-text)" />}
                    </div>
                    <div className="agent-role">{property.agent.type}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      ⚡ {property.agent.responseTime}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-navy)', fontFamily: 'var(--font-heading)' }}>
                  {formatIndianPrice(property.price, property.purpose)}
                </div>
                {emiText && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    {emiText} · {ppsf}
                  </div>
                )}
              </div>

              {/* CTA Buttons — Primary TEAL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-cta-teal btn-lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      openAuthModal(() => setShowContactModal(true));
                    } else {
                      setShowContactModal(true);
                    }
                  }}
                  id="contact-owner-btn"
                  style={{ width: '100%' }}
                >
                  Contact Owner
                </button>
                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={() => {
                    if (!isAuthenticated) {
                      openAuthModal(() => setShowVisitModal(true));
                    } else {
                      setShowVisitModal(true);
                    }
                  }}
                  id="schedule-visit-btn"
                  style={{ width: '100%' }}
                >
                  <Calendar size={16} /> Schedule Visit
                </button>
                {property.agent?.phone && (
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="btn btn-outline"
                    id="call-owner-btn"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                  >
                    <Phone size={15} /> Call {property.agent.phone}
                  </a>
                )}
              </div>

              {/* Safety Notice */}
              <div className="safety-notice">
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>
                  Never pay before verifying ownership and documents. LOKHA does not charge any brokerage.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div style={{
        display: 'none',
        position: 'fixed',
        bottom: '64px',
        left: 0,
        right: 0,
        background: '#FFFFFF',
        borderTop: '1px solid var(--color-border)',
        padding: '10px 16px',
        gap: '10px',
        zIndex: 990
      }}
        className="mobile-detail-sticky-bar"
      >
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setShowContactModal(true)}
          style={{ flex: 1 }}
        >
          <Phone size={16} /> Call
        </button>
        <button
          type="button"
          className="btn btn-cta-teal"
          onClick={() => setShowContactModal(true)}
          style={{ flex: 2 }}
          id="mobile-contact-owner-btn"
        >
          Contact Owner
        </button>
      </div>

      {/* Modals */}
      {showVisitModal && <VisitSchedulerModal property={property} onClose={() => setShowVisitModal(false)} />}
      {showContactModal && <ContactOwnerModal property={property} onClose={() => setShowContactModal(false)} />}

      <style>{`
        @media (max-width: 768px) {
          .mobile-detail-sticky-bar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
