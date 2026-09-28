import React, { useState } from 'react';
import { RotateCcw, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function FilterSidebar({ 
  filters, 
  onFilterChange, 
  onResetFilters,
  totalResults,
  isDrawer = false,
  onCloseDrawer
}) {
  const propertyTypes = [
    'Apartment', 'Villa', 'Independent House', 'Plot / Land',
    'Commercial Property', 'Office', 'Shop', 'PG', 'Hostel', 'Hotel'
  ];

  const popularCities = [
    'Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi',
    'Pune', 'Coimbatore', 'Kochi', 'Vijayawada', 'Visakhapatnam',
    'Tirupati', 'Madurai', 'Pondicherry', 'Gurgaon', 'Noida'
  ];

  const bedroomOptions = ['1', '2', '3', '4'];
  const furnishingOptions = ['Fully-Furnished', 'Semi-Furnished', 'Unfurnished'];
  const statusOptions = ['Ready to Move', 'Under Construction', 'Available'];
  const postedByOptions = ['Owner', 'Agent'];
  const commonAmenities = [
    'Swimming Pool', 'Gym', 'Security', 'Power Backup', 
    'Clubhouse', "Children's Play Area", 'Lift', 'Parking', 'EV Charging'
  ];

  // Auto-expand "More Filters" if user has any secondary filters active
  const hasSecondaryActive = Boolean(
    filters.possessionStatus ||
    filters.furnishing ||
    filters.postedBy ||
    (filters.amenities && filters.amenities.length > 0)
  );

  const [manuallyToggled, setManuallyToggled] = useState(null);
  const showMoreFilters = manuallyToggled !== null ? manuallyToggled : hasSecondaryActive;

  const handleAmenityToggle = (amenity) => {
    const current = filters.amenities || [];
    if (current.includes(amenity)) {
      onFilterChange('amenities', current.filter((a) => a !== amenity));
    } else {
      onFilterChange('amenities', [...current, amenity]);
    }
  };

  return (
    <aside className={`filter-sidebar ${isDrawer ? 'filter-sidebar-in-drawer' : ''}`} aria-label="Search Filters">
      {/* Header */}
      <div className="filter-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--wood-walnut-deep)" />
          <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--lokha-primary)' }}>
            Filters
          </span>
          {totalResults != null && (
            <span style={{ fontSize: '0.78rem', color: 'var(--lokha-muted)', fontWeight: 600 }}>
              ({totalResults})
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button" 
            onClick={onResetFilters} 
            className="btn btn-ghost btn-sm"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              padding: '2px 8px', 
              fontSize: '0.78rem', 
              color: 'var(--wood-natural)',
              fontWeight: 600
            }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
          {isDrawer && onCloseDrawer && (
            <button
              type="button"
              onClick={onCloseDrawer}
              className="btn btn-ghost btn-sm"
              style={{ padding: '2px', color: 'var(--lokha-muted)' }}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Verified Only Quick Toggle */}
      <div className="filter-group" style={{ paddingBottom: '10px', marginBottom: '10px' }}>
        <label className="filter-checkbox-item" style={{ margin: 0, userSelect: 'none' }}>
          <input 
            type="checkbox"
            checked={!!filters.verifiedOnly}
            onChange={(e) => onFilterChange('verifiedOnly', e.target.checked)}
          />
          <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--wood-walnut-deep)' }}>
            ✓ Verified Listings Only
          </span>
        </label>
      </div>

      {/* Listing Purpose (Sale, Rent, Lease) */}
      <div className="filter-group">
        <div className="filter-title">Listing Purpose</div>
        <div className="filter-options-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          {[
            { id: '', label: 'All' },
            { id: 'sale', label: 'Sale' },
            { id: 'rent', label: 'Rent' },
            { id: 'lease', label: 'Lease' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`filter-pill ${(filters.purpose || '') === item.id ? 'active' : ''}`}
              onClick={() => onFilterChange('purpose', item.id)}
              style={{ textAlign: 'center', padding: '5px 4px', fontSize: '0.78rem' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div className="filter-group">
        <div className="filter-title">City</div>
        <select
          className="form-select filter-select-compact"
          value={filters.city || ''}
          onChange={(e) => onFilterChange('city', e.target.value)}
        >
          <option value="">All Cities ({popularCities.length} locations)</option>
          {popularCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className="filter-group">
        <div className="filter-title">Property Type</div>
        <div className="filter-options-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {propertyTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`filter-pill ${filters.propertyType === type ? 'active' : ''}`}
              onClick={() => onFilterChange('propertyType', filters.propertyType === type ? '' : type)}
              style={{ fontSize: '0.74rem', padding: '4px 8px' }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Selector */}
      <div className="filter-group">
        <div className="filter-title">Budget Range</div>
        <select 
          className="form-select filter-select-compact"
          value={filters.budget || ''}
          onChange={(e) => onFilterChange('budget', e.target.value)}
        >
          <option value="">Any Budget</option>
          {filters.purpose === 'rent' ? (
            <>
              <option value="0-15000">Under ₹15,000</option>
              <option value="15000-35000">₹15,000 - ₹35,000</option>
              <option value="35000-75000">₹35,000 - ₹75,000</option>
              <option value="75000-150000">₹75,000 - ₹1.5 Lakh</option>
              <option value="150000-99999999">Above ₹1.5 Lakh</option>
            </>
          ) : filters.purpose === 'lease' ? (
            <>
              <option value="0-100000">Under ₹1 Lakh / month</option>
              <option value="100000-300000">₹1 Lakh - ₹3 Lakh</option>
              <option value="300000-1000000">₹3 Lakh - ₹10 Lakh</option>
              <option value="1000000-99999999">Above ₹10 Lakh</option>
            </>
          ) : (
            <>
              <option value="0-5000000">Under ₹50 Lakh</option>
              <option value="5000000-10000000">₹50 Lakh - ₹1 Crore</option>
              <option value="10000000-25000000">₹1 Crore - ₹2.5 Crore</option>
              <option value="25000000-50000000">₹2.5 Crore - ₹5 Crore</option>
              <option value="50000000-999999999">Above ₹5 Crore</option>
            </>
          )}
        </select>
      </div>

      {/* Bedrooms */}
      <div className="filter-group">
        <div className="filter-title">Bedrooms</div>
        <div className="filter-options-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          {bedroomOptions.map((bhk) => (
            <button
              key={bhk}
              type="button"
              className={`filter-pill ${filters.bhk === bhk ? 'active' : ''}`}
              onClick={() => onFilterChange('bhk', filters.bhk === bhk ? '' : bhk)}
              style={{ textAlign: 'center', padding: '5px 4px', fontSize: '0.78rem' }}
            >
              {bhk} {bhk === '4' ? '+ BHK' : 'BHK'}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Accordion: More Filters */}
      <div style={{ marginTop: '10px' }}>
        <button
          type="button"
          onClick={() => setManuallyToggled((v) => (v === null ? !hasSecondaryActive : !v))}
          className="btn-filter-more-toggle"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            background: 'var(--lokha-surface-warm)',
            border: '1px solid var(--lokha-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--lokha-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <span>More Filters {hasSecondaryActive ? '• Active' : ''}</span>
          {showMoreFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showMoreFilters && (
          <div style={{ paddingTop: '10px' }}>
            {/* Status / Availability Filter */}
            <div className="filter-group">
              <div className="filter-title">Availability / Possession</div>
              <div className="filter-options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {statusOptions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-pill ${filters.possessionStatus === st ? 'active' : ''}`}
                    onClick={() => onFilterChange('possessionStatus', filters.possessionStatus === st ? '' : st)}
                    style={{ textAlign: 'left', fontSize: '0.76rem', padding: '5px 8px' }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div className="filter-group">
              <div className="filter-title">Furnishing</div>
              <div className="filter-options-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {furnishingOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`filter-pill ${filters.furnishing === opt ? 'active' : ''}`}
                    onClick={() => onFilterChange('furnishing', filters.furnishing === opt ? '' : opt)}
                    style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Posted By */}
            <div className="filter-group">
              <div className="filter-title">Posted By</div>
              <div className="filter-options-grid" style={{ display: 'flex', gap: '6px' }}>
                {postedByOptions.map((by) => (
                  <button
                    key={by}
                    type="button"
                    className={`filter-pill ${filters.postedBy === by ? 'active' : ''}`}
                    onClick={() => onFilterChange('postedBy', filters.postedBy === by ? '' : by)}
                    style={{ flex: 1, textAlign: 'center', fontSize: '0.78rem', padding: '4px 6px' }}
                  >
                    {by}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="filter-group">
              <div className="filter-title">Amenities</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {commonAmenities.map((amenity) => {
                  const checked = (filters.amenities || []).includes(amenity);
                  return (
                    <label key={amenity} className="filter-checkbox-item" style={{ fontSize: '0.8rem', margin: 0 }}>
                      <input 
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
