import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  Train, 
  Navigation, 
  ArrowRight, 
  X, 
  Sparkles,
  Building,
  Home,
  Briefcase
} from 'lucide-react';
import { searchLocations, reverseGeocode } from '../../services/locationService';

const DEFAULT_RECENT_SEARCHES = [
  { id: 'rec-1', text: '3 BHK in Whitefield', purpose: 'sale', type: 'Apartment', q: 'Whitefield' },
  { id: 'rec-2', text: 'Villas near OMR', purpose: 'sale', type: 'Villa', q: 'OMR' },
  { id: 'rec-3', text: 'Apartments under ₹80L', purpose: 'sale', budget: '0-8000000', q: 'Bengaluru' }
];

const POPULAR_LOCALITIES = [
  { id: 'loc-1', name: 'Whitefield', city: 'Bengaluru', count: '140+ properties', q: 'Whitefield' },
  { id: 'loc-2', name: 'HSR Layout', city: 'Bengaluru', count: '95+ properties', q: 'HSR Layout' },
  { id: 'loc-3', name: 'OMR Corridor', city: 'Chennai', count: '80+ properties', q: 'OMR' },
  { id: 'loc-4', name: 'Anna Nagar', city: 'Chennai', count: '65+ properties', q: 'Anna Nagar' }
];

const FEATURED_PROJECTS = [
  { id: 'proj-1', name: 'Prestige Falcon City', locality: 'Kanakapura Road', city: 'Bengaluru' },
  { id: 'proj-2', name: 'Brigade Cornerstone Utopia', locality: 'Varthur', city: 'Bengaluru' },
  { id: 'proj-3', name: 'Sobha Dream Acres', locality: 'Panathur', city: 'Bengaluru' }
];

const LANDMARKS_AND_TRANSIT = [
  { id: 'lm-1', name: 'Indiranagar Metro Station', type: 'Metro', city: 'Bengaluru', icon: Train },
  { id: 'lm-2', name: 'Manyata Tech Park', type: 'IT Park', city: 'Bengaluru', icon: Briefcase },
  { id: 'lm-3', name: 'Kempegowda International Airport', type: 'Airport', city: 'Bengaluru', icon: Building2 }
];

export default function HeaderSearch({ 
  isCompact = false, 
  initialQuery = '',
  className = ''
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [purpose, setPurpose] = useState('sale');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('lokha_recent_header_searches');
      return saved ? JSON.parse(saved) : DEFAULT_RECENT_SEARCHES;
    } catch {
      return DEFAULT_RECENT_SEARCHES;
    }
  });

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to open search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Autocomplete fetch on query change
  useEffect(() => {
    let active = true;
    if (query.trim().length >= 2) {
      const timer = setTimeout(async () => {
        const results = await searchLocations(query);
        if (active) {
          setSuggestions(results);
        }
      }, 150);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Execute Search
  const executeSearch = (paramsObj = {}) => {
    const p = new URLSearchParams();
    const finalPurpose = paramsObj.purpose !== undefined ? paramsObj.purpose : purpose;
    const finalQuery = paramsObj.q !== undefined ? paramsObj.q : query;
    const finalType = paramsObj.type !== undefined ? paramsObj.type : propertyType;
    const finalBudget = paramsObj.budget !== undefined ? paramsObj.budget : budget;

    if (finalPurpose) p.set('purpose', finalPurpose);
    if (finalQuery?.trim()) p.set('q', finalQuery.trim());
    if (finalType) p.set('type', finalType);
    if (finalBudget) p.set('budget', finalBudget);

    // Save to recent searches
    if (finalQuery?.trim()) {
      const newEntry = {
        id: 'rec-' + Date.now(),
        text: finalQuery.trim(),
        purpose: finalPurpose,
        type: finalType,
        q: finalQuery.trim()
      };
      const updated = [newEntry, ...recentSearches.filter((item) => item.text.toLowerCase() !== finalQuery.trim().toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      try {
        localStorage.setItem('lokha_recent_header_searches', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save recent search:', err);
      }
    }

    setIsOpen(false);
    navigate(`/search?${p.toString()}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  // Detect GPS Location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await reverseGeocode(latitude, longitude);
          const locName = res.locality || res.city || 'My Location';
          setQuery(locName);
          executeSearch({ q: locName, lat: latitude, lng: longitude });
        } catch {
          setQuery('Current Location');
          executeSearch({ q: 'Current Location', lat: latitude, lng: longitude });
        } finally {
          setIsLocating(false);
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

  // Keyboard navigation inside dropdown
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => prev + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(-1, prev - 1));
    } else if (e.key === 'Enter') {
      // Form submit handles default
    }
  };

  // Helper: Highlight query matches
  const highlightMatch = (text, term) => {
    if (!term || !term.trim()) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="search-highlight-text">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      className={`header-search-container ${isOpen ? 'is-expanded' : ''} ${isCompact ? 'is-compact' : ''} ${className}`}
      ref={containerRef}
    >
      {/* ── Collapsed Input Pill Bar ── */}
      <form onSubmit={handleFormSubmit} className="header-search-pill" onClick={() => setIsOpen(true)}>
        <Search size={16} className="header-search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search homes, localities, projects..."
          className="header-search-input"
          aria-label="Search properties"
          autoComplete="off"
        />

        {query && (
          <button 
            type="button" 
            className="header-search-clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search input"
          >
            <X size={14} />
          </button>
        )}

        <div className="header-search-kbd-hint" title="Press ⌘K or Ctrl+K to search">
          <span>⌘K</span>
        </div>
      </form>

      {/* ── Expandable Floating Search Panel ── */}
      {isOpen && (
        <div className="header-search-floating-panel" role="dialog" aria-modal="true">
          {/* Quick Criteria Filter Chips */}
          <div className="header-search-criteria-bar">
            {/* Purpose */}
            <div className="header-criteria-group">
              <span className="criteria-label">Looking to:</span>
              <div className="criteria-segmented">
                {[
                  { id: 'sale', label: 'Buy' },
                  { id: 'rent', label: 'Rent' },
                  { id: 'commercial', label: 'Commercial' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`criteria-pill ${purpose === item.id ? 'is-active' : ''}`}
                    onClick={() => setPurpose(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type Dropdown */}
            <div className="header-criteria-dropdown">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="header-criteria-select"
                aria-label="Select property type"
              >
                <option value="">Property Type (All)</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa / Bungalow</option>
                <option value="Plot">Plot / Land</option>
                <option value="Office">Commercial Office</option>
                <option value="PG">Co-Living / PG</option>
              </select>
            </div>

            {/* Budget Dropdown */}
            <div className="header-criteria-dropdown">
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="header-criteria-select"
                aria-label="Select budget"
              >
                <option value="">Budget (Any)</option>
                {purpose === 'rent' ? (
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

            {/* Submit Action */}
            <button
              type="button"
              className="btn btn-header-search-submit"
              onClick={() => executeSearch()}
            >
              <span>Search</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Quick "Use My Location" Row */}
          <div 
            className="header-search-gps-row"
            onClick={handleDetectLocation}
            role="button"
            tabIndex={0}
          >
            <div className="gps-icon-bubble">
              <Navigation size={14} className={isLocating ? 'spin-anim' : ''} />
            </div>
            <div className="gps-text">
              <span className="gps-title">
                {isLocating ? 'Detecting your exact coordinates...' : 'Use current location'}
              </span>
              <span className="gps-desc">Find verified properties and localities near you</span>
            </div>
          </div>

          {/* Dynamic Suggestions (if typed >= 2 chars) */}
          {suggestions.length > 0 && (
            <div className="header-search-section">
              <div className="header-search-section-title">Matching Locations</div>
              <div className="header-search-list">
                {suggestions.map((loc) => (
                  <div
                    key={loc.id}
                    className="header-search-list-item"
                    onClick={() => {
                      setQuery(loc.title);
                      executeSearch({ q: loc.title, lat: loc.lat, lng: loc.lng });
                    }}
                  >
                    <MapPin size={16} className="item-icon-wood" />
                    <div className="item-info">
                      <div className="item-title">{highlightMatch(loc.title, query)}</div>
                      <div className="item-subtitle">{loc.subtitle}</div>
                    </div>
                    {loc.city && <span className="item-badge-pill">{loc.city}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Default Discovery Sections (shown when query is empty or short) */}
          {suggestions.length === 0 && (
            <div className="header-search-grid-sections">
              {/* RECENT SEARCHES */}
              {recentSearches.length > 0 && (
                <div className="header-search-section">
                  <div className="header-search-section-header">
                    <span className="header-search-section-title">
                      <Clock size={13} />
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      className="header-search-clear-link"
                      onClick={() => {
                        setRecentSearches([]);
                        try {
                          localStorage.removeItem('lokha_recent_header_searches');
                        } catch {}
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="header-search-chips">
                    {recentSearches.map((rec) => (
                      <button
                        key={rec.id}
                        type="button"
                        className="header-search-recent-chip"
                        onClick={() => executeSearch({ q: rec.q, purpose: rec.purpose, type: rec.type, budget: rec.budget })}
                      >
                        <Clock size={12} />
                        <span>{rec.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* POPULAR LOCALITIES */}
              <div className="header-search-section">
                <div className="header-search-section-title">
                  <Sparkles size={13} color="var(--header-gold)" />
                  Popular Localities
                </div>
                <div className="header-search-list">
                  {POPULAR_LOCALITIES.map((loc) => (
                    <div
                      key={loc.id}
                      className="header-search-list-item"
                      onClick={() => {
                        setQuery(loc.name);
                        executeSearch({ q: loc.name });
                      }}
                    >
                      <MapPin size={15} className="item-icon-wood" />
                      <div className="item-info">
                        <div className="item-title">{loc.name}</div>
                        <div className="item-subtitle">{loc.city}</div>
                      </div>
                      <span className="item-count-text">{loc.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROJECTS & TRANSIT SPLIT */}
              <div className="header-search-split-row">
                {/* PROJECTS */}
                <div className="header-search-section split-col">
                  <div className="header-search-section-title">
                    <Building size={13} />
                    Featured Projects
                  </div>
                  <div className="header-search-list">
                    {FEATURED_PROJECTS.map((proj) => (
                      <div
                        key={proj.id}
                        className="header-search-list-item compact"
                        onClick={() => {
                          setQuery(proj.name);
                          executeSearch({ q: proj.name });
                        }}
                      >
                        <div className="item-info">
                          <div className="item-title">{proj.name}</div>
                          <div className="item-subtitle">{proj.locality}, {proj.city}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LANDMARKS & TRANSIT */}
                <div className="header-search-section split-col">
                  <div className="header-search-section-title">
                    <Train size={13} />
                    Landmarks & Transit
                  </div>
                  <div className="header-search-list">
                    {LANDMARKS_AND_TRANSIT.map((lm) => (
                      <div
                        key={lm.id}
                        className="header-search-list-item compact"
                        onClick={() => {
                          setQuery(lm.name);
                          executeSearch({ q: lm.name });
                        }}
                      >
                        <lm.icon size={14} className="item-icon-wood" />
                        <div className="item-info">
                          <div className="item-title">{lm.name}</div>
                          <div className="item-subtitle">{lm.type} • {lm.city}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
