import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee, Layers, Navigation, X, Building, Train, Sparkles } from 'lucide-react';
import { searchLocations, reverseGeocode, POPULAR_INDIAN_LOCATIONS } from '../../services/locationService';

export default function SearchPanel({
  initialPurpose = 'sale',
  initialCity = '',
  initialType = '',
  initialBudget = '',
  initialBhk = '',
  className = ''
}) {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState(initialPurpose);
  const [query, setQuery] = useState(initialCity);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [propertyType, setPropertyType] = useState(initialType);
  const [budget, setBudget] = useState(initialBudget);
  const [bhk, setBhk] = useState(initialBhk);

  // Autocomplete states
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const inputContainerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    let active = true;
    if (query.trim().length >= 2) {
      const timer = setTimeout(async () => {
        const results = await searchLocations(query);
        if (active) {
          setSuggestions(results);
          setIsOpen(true);
        }
      }, 200);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelectLocation = (loc) => {
    setQuery(loc.title);
    setSelectedCoords({ lat: loc.lat, lng: loc.lng });
    setIsOpen(false);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedCoords({ lat: latitude, lng: longitude });
        try {
          const res = await reverseGeocode(latitude, longitude);
          setQuery(res.locality || res.city || 'My Location');
        } catch {
          setQuery('Current Location');
        } finally {
          setIsLocating(false);
          setIsOpen(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        setIsLocating(false);
        alert('Could not access current location. Please type your city or area manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (query) params.set('q', query);
    if (selectedCoords) {
      params.set('lat', selectedCoords.lat);
      params.set('lng', selectedCoords.lng);
    }
    if (propertyType) params.set('type', propertyType);
    if (budget) params.set('budget', budget);
    if (bhk) params.set('bhk', bhk);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`search-panel-container ${className}`}>
      {/* Purpose Tabs */}
      <div className="search-panel-tabs" role="tablist">
        {[
          { id: 'sale', label: 'Buy' },
          { id: 'rent', label: 'Rent' },
          { id: 'commercial', label: 'Commercial' },
          { id: 'plots', label: 'Plots' },
          { id: 'pg', label: 'PG / Co-Living' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={purpose === tab.id}
            className={`search-tab ${purpose === tab.id ? 'active' : ''}`}
            onClick={() => setPurpose(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <form onSubmit={handleSearch} className="search-panel-fields">
        {/* Locality / City Search with Autocomplete */}
        <div className="search-field-group" ref={inputContainerRef} style={{ position: 'relative' }}>
          <label className="search-field-label" htmlFor="search-location">
            Location
          </label>
          <div className="search-input-wrapper">
            <MapPin size={18} color="var(--color-trust-blue)" />
            <input
              id="search-location"
              type="text"
              placeholder="Search city, locality, landmark, or metro"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedCoords(null);
              }}
              onFocus={() => {
                if (query.trim().length >= 2 || suggestions.length > 0) {
                  setIsOpen(true);
                }
              }}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedCoords(null);
                  setSuggestions([]);
                }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                aria-label="Clear location"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={handleDetectLocation}
              title="Use current location"
              style={{
                background: 'none',
                border: 'none',
                color: isLocating ? '#00A69C' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px 4px'
              }}
              aria-label="Detect current location"
            >
              <Navigation size={15} className={isLocating ? 'spin-anim' : ''} />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '6px',
                background: '#ffffff',
                borderRadius: '0.75rem',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.16)',
                border: '1px solid #e2e8f0',
                zIndex: 9999,
                overflow: 'hidden',
                maxHeight: '320px',
                overflowY: 'auto'
              }}
            >
              {/* Quick "Near me" row */}
              <div
                onClick={handleDetectLocation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderBottom: '1px solid #f1f5f9',
                  background: '#f8fafc',
                  color: '#00A69C',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Navigation size={15} />
                <span>{isLocating ? 'Detecting your location...' : 'Use Current Location (GPS)'}</span>
              </div>

              {suggestions.length > 0 ? (
                suggestions.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #f8fafc',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {loc.type === 'landmark' ? <Building size={14} /> : <MapPin size={14} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>{loc.title}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{loc.subtitle}</div>
                      </div>
                    </div>
                    {loc.city && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#e2e8f0',
                          color: '#475569',
                          fontWeight: 500
                        }}
                      >
                        {loc.city}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '14px', color: '#64748b', fontSize: '0.82rem', textAlign: 'center' }}>
                  No exact matches found. Press enter to search everywhere.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="search-field-group">
          <label className="search-field-label" htmlFor="search-type">
            Property Type
          </label>
          <div className="search-input-wrapper">
            <Home size={18} color="var(--color-trust-blue)" />
            <select id="search-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot / Land</option>
              <option value="Office">Commercial Office</option>
              <option value="PG">Co-Living / PG</option>
            </select>
          </div>
        </div>

        {/* Budget */}
        <div className="search-field-group">
          <label className="search-field-label" htmlFor="search-budget">
            Budget
          </label>
          <div className="search-input-wrapper">
            <IndianRupee size={18} color="var(--color-trust-blue)" />
            <select id="search-budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="">Any Budget</option>
              {purpose === 'rent' || purpose === 'pg' ? (
                <>
                  <option value="0-20000">Under ₹20,000</option>
                  <option value="20000-40000">₹20K - ₹40K</option>
                  <option value="40000-80000">₹40K - ₹80K</option>
                  <option value="80000-99999999">Above ₹80K</option>
                </>
              ) : (
                <>
                  <option value="0-5000000">Under ₹50 Lakh</option>
                  <option value="5000000-10000000">₹50 Lakh - ₹1 Crore</option>
                  <option value="10000000-20000000">₹1 Crore - ₹2 Crore</option>
                  <option value="20000000-999999999">Above ₹2 Crore</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Bedrooms / BHK */}
        <div className="search-field-group">
          <label className="search-field-label" htmlFor="search-bedrooms">
            BHK
          </label>
          <div className="search-input-wrapper">
            <Layers size={18} color="var(--color-trust-blue)" />
            <select id="search-bedrooms" value={bhk} onChange={(e) => setBhk(e.target.value)}>
              <option value="">Any BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          type="submit"
          className="btn btn-cta-teal btn-lg"
          id="hero-search-button"
          style={{ width: '100%', height: '48px', marginTop: 'auto' }}
        >
          <Search size={18} strokeWidth={2.4} />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
