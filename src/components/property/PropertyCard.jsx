import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, MapPin, BedDouble, Bath, Maximize, Car, Check, Navigation } from 'lucide-react';
import { formatIndianPrice, calculateEstimatedEMI, formatArea } from '../../utils/formatters';
import { VerifiedBadge, StatusBadge } from '../common/VerifiedBadge';
import { useSaved } from '../../context/SavedContext';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

export default function PropertyCard({
  property,
  showCompare = false,
  onSelectMarker,
  index = 0
}) {
  const navigate = useNavigate();
  const { isSaved, toggleSave, compareIds, toggleCompare } = useSaved();
  const { isAuthenticated } = useAuth();
  const [imgSrc, setImgSrc] = useState(property.images?.[0] || DEFAULT_FALLBACK_IMAGE);

  const saved = isSaved(property.id);
  const isCompared = compareIds.includes(property.id);

  const purpose = property.purpose || property.listingType || 'sale';
  const propertyType = property.propertyType || property.type || 'Apartment';
  const formattedPrice = formatIndianPrice(property.price, purpose);
  const emiText = purpose === 'sale' ? calculateEstimatedEMI(property.price, purpose) : null;

  // Format distance if available
  const distanceDisplay = property.distanceText
    ? property.distanceText
    : property.distanceKm != null && !isNaN(property.distanceKm)
    ? `${property.distanceKm < 1 ? Math.round(property.distanceKm * 1000) + ' m' : property.distanceKm.toFixed(1) + ' km'} away`
    : null;

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleSave(property.id);
  };

  const isSold = property.status === 'Sold';
  const isRented = property.status === 'Rented';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25), ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`property-card ${isSold ? 'property-card-sold' : ''} ${isRented ? 'property-card-rented' : ''}`}
      onMouseEnter={() => onSelectMarker && onSelectMarker(property.id)}
    >
      {/* Media & Badges */}
      <div className="property-card-media">
        <Link to={isAuthenticated ? `/property/${property.id}` : '/login'} aria-label={`View ${property.title}`}>
          <img
            src={imgSrc}
            alt={property.title}
            loading="lazy"
            onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
          />
        </Link>

        {/* Top Badges */}
        <div className="property-badges-top">
          {property.verified && <VerifiedBadge size="sm" />}
          {property.featured && <span className="badge badge-featured">Featured</span>}
          {isSold && <span className="badge badge-sold" style={{ background: '#EF4444', color: '#fff' }}>Sold</span>}
          {isRented && <span className="badge badge-rented" style={{ background: '#F59E0B', color: '#fff' }}>Rented</span>}
          {!isSold && !isRented && property.possessionStatus && (
            <StatusBadge status={property.possessionStatus} />
          )}
        </div>

        {/* Purpose Badge Bottom Left on image */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 2
          }}
        >
          <span
            style={{
              background: 'rgba(33, 26, 23, 0.88)',
              backdropFilter: 'blur(6px)',
              color: '#F7F3ED',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '5px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {purpose === 'sale' ? 'FOR SALE' : purpose === 'rent' ? 'FOR RENT' : 'FOR LEASE'}
          </span>
          <span
            style={{
              background: 'rgba(184, 149, 90, 0.92)',
              backdropFilter: 'blur(6px)',
              color: '#1C1C1A',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '5px',
              letterSpacing: '0.02em'
            }}
          >
            {propertyType}
          </span>
        </div>

        {/* Save Heart Button with Motion */}
        <div className="property-save-top">
          <motion.button
            type="button"
            className={`btn-save-heart ${saved ? 'is-saved' : ''}`}
            onClick={handleHeartClick}
            whileTap={{ scale: 0.8 }}
            animate={{ scale: saved ? [1, 1.35, 1] : 1 }}
            transition={{ duration: 0.3 }}
            aria-label={saved ? 'Remove from saved' : 'Save property'}
            title={saved ? 'Remove from saved' : 'Save property'}
          >
            <Heart size={18} strokeWidth={2.2} fill={saved ? 'var(--color-saved-heart)' : 'none'} />
          </motion.button>
        </div>
      </div>

      {/* Card Body */}
      <div className="property-card-body">
        <div className="property-card-price-row">
          <span className="property-card-price">{formattedPrice}</span>
          {emiText && <span className="property-card-emi">{emiText}</span>}
        </div>

        <h3 className="property-card-title" title={property.title}>
          <Link to={isAuthenticated ? `/property/${property.id}` : '/login'}>{property.title}</Link>
        </h3>

        <div className="property-card-location">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, overflow: 'hidden' }}>
            <MapPin size={13} className="spec-icon" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {property.locality}, {property.city}
            </span>
          </div>
          {distanceDisplay && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#8A6346',
                background: 'rgba(138, 99, 70, 0.1)',
                padding: '2px 7px',
                borderRadius: '12px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Navigation size={10} />
              {distanceDisplay}
            </span>
          )}
        </div>

        {/* Specs Row */}
        <div className="property-card-specs">
          {property.bhk > 0 && (
            <div className="property-card-spec-item" title="Bedrooms">
              <BedDouble size={14} className="spec-icon" />
              <span>{property.bhk} Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="property-card-spec-item" title="Bathrooms">
              <Bath size={14} className="spec-icon" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="property-card-spec-item" title="Super Built-up Area">
            <Maximize size={14} className="spec-icon" />
            <span>{formatArea(property.area)}</span>
          </div>
          {property.parking > 0 && (
            <div className="property-card-spec-item" title="Covered Parking">
              <Car size={14} className="spec-icon" />
              <span>{property.parking} Park</span>
            </div>
          )}
        </div>

        {/* Card Footer: Compare & Details Link */}
        <div className="property-card-footer">
          {showCompare ? (
            <label
              className="compare-checkbox-label"
              onClick={(e) => {
                e.preventDefault();
                toggleCompare(property.id);
              }}
            >
              <input
                type="checkbox"
                checked={isCompared}
                onChange={() => {}}
                aria-label={`Compare ${property.title}`}
              />
              <span className={`custom-checkbox ${isCompared ? 'checked' : ''}`}>
                {isCompared && <Check size={11} strokeWidth={3} />}
              </span>
              <span>Compare</span>
            </label>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {property.postedBy} • {property.postedTime}
            </span>
          )}

          <Link to={isAuthenticated ? `/property/${property.id}` : '/login'} className="btn-view-details">
            <span>View Details</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

