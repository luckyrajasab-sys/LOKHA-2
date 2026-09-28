import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass,
  MapPin,
  Radio,
  Sliders,
  Layers,
  ChevronLeft,
  Navigation,
  Eye,
  CheckCircle2,
  Building,
  Home,
  Briefcase,
  KeyRound,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User
} from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { calculateDistanceKm, formatDistance } from '../utils/haversine';
import { formatIndianPrice } from '../utils/formatters';
import { InstagramVerifiedIcon } from '../components/common/VerifiedBadge';

// Free Google Maps Tile Endpoints
const GOOGLE_TILE_LAYERS = {
  'google-streets': {
    name: 'Google Streets',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  },
  'google-satellite': {
    name: 'Google Satellite',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Satellite'
  },
  'google-terrain': {
    name: 'Google Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Terrain'
  }
};

// Preset Key Localities
const RADAR_PRESETS = [
  { name: 'Whitefield', city: 'Bengaluru', lat: 12.9698, lng: 77.7499, tag: 'IT Hub' },
  { name: 'Indiranagar', city: 'Bengaluru', lat: 12.9784, lng: 77.6408, tag: 'Boutique & Metro' },
  { name: 'HSR Layout', city: 'Bengaluru', lat: 12.9121, lng: 77.6446, tag: 'Tech Hub' },
  { name: 'Sarjapur Road', city: 'Bengaluru', lat: 12.9112, lng: 77.6833, tag: 'ORR Corridor' },
  { name: 'OMR', city: 'Chennai', lat: 12.8258, lng: 80.2245, tag: 'Coastal IT' },
  { name: 'Powai', city: 'Mumbai', lat: 19.1197, lng: 72.9056, tag: 'Lakefront' },
  { name: 'Bandra West', city: 'Mumbai', lat: 19.0596, lng: 72.8295, tag: 'Luxury Coast' },
  { name: 'Gachibowli', city: 'Hyderabad', lat: 17.4401, lng: 78.3489, tag: 'Financial Dist' }
];

export default function LocalitiesMapPage() {
  const [searchParams] = useSearchParams();
  const { properties } = useSaved();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const radarCircleLayerRef = useRef(null);
  const radarRingsLayerRef = useRef([]);
  const markersLayerRef = useRef({});

  // Initial center from URL query params or default
  const initialLat = parseFloat(searchParams.get('lat')) || 12.9716;
  const initialLng = parseFloat(searchParams.get('lng')) || 77.6412;
  const initialRadius = parseInt(searchParams.get('radius')) || 8; // default 8 km

  const [center, setCenter] = useState({ lat: initialLat, lng: initialLng });
  const [radiusKm, setRadiusKm] = useState(initialRadius);
  const [activeLayer, setActiveLayer] = useState('google-streets');
  const [purposeFilter, setPurposeFilter] = useState('all'); // 'all' | 'sale' | 'rent' | 'lease'
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('radar'); // 'radar' | 'filters'

  // Calculate detected properties within the circle radar
  const detectedProperties = useMemo(() => {
    return properties
      .map((p) => {
        const lat = p.mapCoords?.lat ?? p.latitude;
        const lng = p.mapCoords?.lng ?? p.longitude;
        if (!lat || !lng) return null;

        const distance = calculateDistanceKm(center.lat, center.lng, lat, lng);
        return {
          ...p,
          lat,
          lng,
          distanceKm: distance,
          distanceText: formatDistance(distance),
          isInsideRadar: distance <= radiusKm
        };
      })
      .filter(Boolean)
      .filter((p) => p.isInsideRadar)
      .filter((p) => {
        if (purposeFilter === 'all') return true;
        return p.purpose === purposeFilter;
      })
      .filter((p) => {
        if (verifiedOnly) return p.verified;
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [properties, center, radiusKm, purposeFilter, verifiedOnly]);

  // Counts by purpose
  const radarCounts = useMemo(() => {
    const inCircle = properties
      .map((p) => {
        const lat = p.mapCoords?.lat ?? p.latitude;
        const lng = p.mapCoords?.lng ?? p.longitude;
        if (!lat || !lng) return null;
        const d = calculateDistanceKm(center.lat, center.lng, lat, lng);
        return d <= radiusKm ? p : null;
      })
      .filter(Boolean);

    return {
      total: inCircle.length,
      sale: inCircle.filter((p) => p.purpose === 'sale').length,
      rent: inCircle.filter((p) => p.purpose === 'rent').length,
      lease: inCircle.filter((p) => p.purpose === 'lease').length,
      verified: inCircle.filter((p) => p.verified).length
    };
  }, [properties, center, radiusKm]);

  // Initialize Leaflet map with Google Maps Free API
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Google tile layer
      const layerConfig = GOOGLE_TILE_LAYERS[activeLayer];
      const tile = L.tileLayer(layerConfig.url, {
        subdomains: layerConfig.subdomains,
        maxZoom: layerConfig.maxZoom,
        attribution: layerConfig.attribution
      }).addTo(map);

      tileLayerRef.current = tile;
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Click to relocate radar center
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setCenter({ lat, lng });
        setSelectedProperty(null);
      });

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Tile Layer when layer switcher changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const layerConfig = GOOGLE_TILE_LAYERS[activeLayer];
    const newTile = L.tileLayer(layerConfig.url, {
      subdomains: layerConfig.subdomains,
      maxZoom: layerConfig.maxZoom,
      attribution: layerConfig.attribution
    }).addTo(map);
    tileLayerRef.current = newTile;
  }, [activeLayer]);

  // Auto-detect user's live location on initial load
  useEffect(() => {
    if (navigator.geolocation && !searchParams.get('lat')) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const { latitude, longitude } = pos.coords;
          setCenter({ lat: latitude, lng: longitude });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1 });
          }
        },
        (err) => {
          setIsLocating(false);
          console.warn('Location detection failed or permission denied, using default', err);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [searchParams]);

  // Update Circular Exploration Zone & Draggable Handle Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove old circle & rings
    if (radarCircleLayerRef.current) {
      map.removeLayer(radarCircleLayerRef.current);
      radarCircleLayerRef.current = null;
    }
    radarRingsLayerRef.current.forEach((r) => map.removeLayer(r));
    radarRingsLayerRef.current = [];

    const radiusMeters = radiusKm * 1000;

    // Main Outer Exploration Circle (clean, smooth border, NO radar sweep/pulse)
    const radarCircle = L.circle([center.lat, center.lng], {
      radius: radiusMeters,
      color: '#8A6346',
      weight: 2,
      fillColor: '#8A6346',
      fillOpacity: 0.1,
      interactive: false
    }).addTo(map);
    radarCircleLayerRef.current = radarCircle;

    // Draggable Center Handle Marker - tracks smoothly with mouse pointer
    const centerIcon = L.divIcon({
      className: 'radar-center-blip-wrap',
      html: `
        <div class="radar-center-beacon" title="Drag circle with mouse pointer">
          <div class="radar-center-dot">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3">
              <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
              <line x1="12" y1="2" x2="12" y2="7"/>
              <line x1="12" y1="17" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="7" y2="12"/>
              <line x1="17" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const centerMarker = L.marker([center.lat, center.lng], {
      icon: centerIcon,
      draggable: true,
      zIndexOffset: 3000
    }).addTo(map);

    // Track dragging in real time smoothly with mouse pointer
    centerMarker.on('drag', (e) => {
      const pos = e.target.getLatLng();
      if (radarCircleLayerRef.current) {
        radarCircleLayerRef.current.setLatLng(pos);
      }
    });

    // On drag end, commit new center position
    centerMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setCenter({ lat: pos.lat, lng: pos.lng });
    });

    radarRingsLayerRef.current.push(centerMarker);

  }, [center, radiusKm]);

  // Render Detected Property Radar Pins
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersLayerRef.current).forEach((m) => map.removeLayer(m));
    markersLayerRef.current = {};

    detectedProperties.forEach((p) => {
      const isSelected = selectedProperty?.id === p.id;
      
      // Determine badge colors & icon according to purpose: Sell (Gold/Emerald), Rent (Blue), Lease (Purple)
      let purposeBg = '#10B981';
      let purposeLabel = 'SELL';
      let purposeClass = 'pin-purpose-sell';

      if (p.purpose === 'rent') {
        purposeBg = '#0284C7';
        purposeLabel = 'RENT';
        purposeClass = 'pin-purpose-rent';
      } else if (p.purpose === 'lease') {
        purposeBg = '#8B5CF6';
        purposeLabel = 'LEASE';
        purposeClass = 'pin-purpose-lease';
      }

      const formattedPrice = formatIndianPrice(p.price, p.purpose);
      const sellerName = p.agent?.name?.split(' ')[0] || p.postedBy;

      const markerHtml = `
        <div class="radar-property-pin ${purposeClass} ${isSelected ? 'is-selected' : ''} ${p.verified ? 'is-verified' : ''}">
          <div class="pin-radar-blip-ring"></div>
          <div class="pin-capsule">
            <span class="pin-purpose-badge">${purposeLabel}</span>
            <span class="pin-price">${formattedPrice}</span>
            ${p.verified ? `
              <span class="pin-instagram-rosette" title="Verified Badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L14.7 3.5L18.3 3.6L19.5 7L22.6 8.9L22 12.5L23.4 15.9L20.6 18.2L20.2 21.8L16.6 22.3L14.2 24.9L12 23.3L9.8 24.9L7.4 22.3L3.8 21.8L3.4 18.2L0.6 15.9L2 12.5L1.4 8.9L4.5 7L5.7 3.6L9.3 3.5L12 1Z" fill="#0095F6"/>
                  <path d="M10.2 16.2L6.8 12.8L8.2 11.4L10.2 13.4L15.8 7.8L17.2 9.2L10.2 16.2Z" fill="#FFFFFF"/>
                </svg>
              </span>
            ` : ''}
          </div>
          <div class="pin-lister-chip">${sellerName}</div>
          <div class="pin-stem"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'radar-leaflet-pin',
        html: markerHtml,
        iconSize: [110, 48],
        iconAnchor: [55, 46]
      });

      const marker = L.marker([p.lat, p.lng], { icon: customIcon }).addTo(map);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedProperty(p);
      });

      markersLayerRef.current[p.id] = marker;
    });
  }, [detectedProperties, selectedProperty]);

  // Center on preset locality
  const handleSelectPreset = (preset) => {
    setCenter({ lat: preset.lat, lng: preset.lng });
    mapInstanceRef.current?.flyTo([preset.lat, preset.lng], 13, { duration: 1.2 });
    setSelectedProperty(null);
  };

  // GPS Locate User
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });
        mapInstanceRef.current?.flyTo([latitude, longitude], 13, { duration: 1.2 });
      },
      () => {
        setIsLocating(false);
        alert('Could not detect location. Using current radar center.');
      },
      { timeout: 8000 }
    );
  };

  // Focus single property from sidebar
  const handleFocusProperty = (p) => {
    setSelectedProperty(p);
    mapInstanceRef.current?.flyTo([p.lat, p.lng], 15, { duration: 0.9 });
  };

  return (
    <div className="radar-map-page-wrapper">
      {/* ── Top Floating Navigation & Control Header ── */}
      <header className="radar-top-header">
        <div className="radar-top-header-left">
          <Link to="/localities" className="btn-radar-back" title="Back to Localities Overview">
            <ChevronLeft size={18} />
            <span>Localities</span>
          </Link>
          <div className="radar-title-cluster">
            <div className="radar-live-indicator">
              <span className="radar-live-blip"></span>
              <span className="radar-live-text">LIVE RADAR</span>
            </div>
            <h1 className="radar-page-heading">Localities Property Radar</h1>
          </div>
        </div>

        {/* Preset Micro-Market Quick Chips */}
        <div className="radar-preset-chips-scroll">
          {RADAR_PRESETS.map((loc) => {
            const isCurrent =
              Math.abs(center.lat - loc.lat) < 0.03 &&
              Math.abs(center.lng - loc.lng) < 0.03;
            return (
              <button
                key={loc.name}
                type="button"
                className={`radar-locality-chip ${isCurrent ? 'is-active' : ''}`}
                onClick={() => handleSelectPreset(loc)}
              >
                <Compass size={13} className="chip-compass-icon" />
                <span>{loc.name}</span>
                <span className="chip-city-sub">{loc.city}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Layers, GPS, Radius */}
        <div className="radar-top-header-right">
          <button
            type="button"
            className="btn-radar-tool"
            onClick={handleDetectLocation}
            title="Scan around my location"
          >
            <Navigation size={15} className={isLocating ? 'spin-anim' : ''} />
            <span className="hide-mobile">My Location</span>
          </button>

          {/* Google Tile Layer Switcher */}
          <div className="radar-layer-selector">
            <Layers size={14} className="radar-layer-icon" />
            <select
              value={activeLayer}
              onChange={(e) => setActiveLayer(e.target.value)}
              className="radar-layer-select"
              aria-label="Select Google Maps style"
            >
              <option value="google-streets">Google Streets</option>
              <option value="google-satellite">Google Satellite</option>
              <option value="google-terrain">Google Terrain</option>
            </select>
          </div>
        </div>
      </header>

      {/* ── Main Radar Canvas & Interactive Layout ── */}
      <div className="radar-main-layout">
        {/* Interactive Map View */}
        <div className="radar-map-viewport">
          <div ref={mapContainerRef} className="radar-leaflet-container" />

          {/* Live Scanning Conic Radar Sweep Beam Animation */}
          {isSweepActive && (
            <div className="radar-sweep-center-anchor" pointer-events="none">
              <div className="radar-conic-sweep"></div>
            </div>
          )}

          {/* Bottom Floating Radar HUD Controls */}
          <div className="radar-hud-bar">
            {/* Radius Selector */}
            <div className="hud-pill-group">
              <span className="hud-label">
                <Radio size={14} className="hud-icon" />
                Radar Radius:
              </span>
              {[2, 5, 8, 12, 20].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`hud-radius-btn ${radiusKm === r ? 'is-active' : ''}`}
                  onClick={() => setRadiusKm(r)}
                >
                  {r} km
                </button>
              ))}
            </div>

            {/* Radar Sweep Toggle */}
            <button
              type="button"
              className={`hud-sweep-toggle ${isSweepActive ? 'is-active' : ''}`}
              onClick={() => setIsSweepActive(!isSweepActive)}
            >
              <span className="hud-sweep-dot"></span>
              <span>{isSweepActive ? 'Radar Sweep: ON' : 'Radar Sweep: Paused'}</span>
            </button>

            {/* Crosshair Tip */}
            <div className="hud-instruction-badge">
              <Compass size={13} />
              <span>Click map to reposition radar</span>
            </div>
          </div>

          {/* Selected Property Floating Preview Card */}
          {selectedProperty && (
            <div className="radar-property-floating-card">
              <button
                type="button"
                className="radar-card-close-btn"
                onClick={() => setSelectedProperty(null)}
                aria-label="Close preview"
              >
                ✕
              </button>

              <div className="floating-card-body">
                <div className="floating-card-img-wrap">
                  <img
                    src={selectedProperty.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                    alt={selectedProperty.title}
                    className="floating-card-img"
                  />
                  <span className={`floating-purpose-tag purpose-${selectedProperty.purpose}`}>
                    FOR {selectedProperty.purpose.toUpperCase()}
                  </span>
                </div>

                <div className="floating-card-details">
                  <div className="floating-card-header">
                    <div className="floating-lister-row">
                      <User size={13} className="floating-user-icon" />
                      <span className="floating-lister-name">
                        {selectedProperty.agent?.name || selectedProperty.postedBy}
                      </span>
                      {selectedProperty.verified && (
                        <span className="floating-verified-pill" title="Verified with Instagram-style Badge">
                          <InstagramVerifiedIcon size={13} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <span className="floating-distance-tag">
                      📍 {selectedProperty.distanceText} from radar
                    </span>
                  </div>

                  <h3 className="floating-card-title">{selectedProperty.title}</h3>
                  <p className="floating-card-sub">
                    {selectedProperty.locality}, {selectedProperty.city} · {selectedProperty.bhk ? `${selectedProperty.bhk} BHK` : selectedProperty.propertyType} ({selectedProperty.area} sq.ft)
                  </p>

                  <div className="floating-card-footer">
                    <div className="floating-price-block">
                      <span className="floating-price-val">
                        {formatIndianPrice(selectedProperty.price, selectedProperty.purpose)}
                      </span>
                      {selectedProperty.leaseTenure && (
                        <span className="floating-tenure-sub">· {selectedProperty.leaseTenure} Lease</span>
                      )}
                    </div>

                    <Link
                      to={`/property/${selectedProperty.id}`}
                      className="btn-floating-view"
                    >
                      <span>Explore</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Activity Sidebar: Live Detected Listings ── */}
        <aside className="radar-activity-sidebar">
          {/* Sidebar Top: Counts & Purpose Filter Pills */}
          <div className="radar-sidebar-header">
            <div className="radar-stat-headline">
              <span className="radar-stat-count">{detectedProperties.length}</span>
              <div>
                <h2 className="radar-stat-title">Properties on Radar</h2>
                <p className="radar-stat-sub">
                  Within {radiusKm} km radius of ({center.lat.toFixed(3)}, {center.lng.toFixed(3)})
                </p>
              </div>
            </div>

            {/* Quick Purpose Segmented Bar: All, Sell, Rent, Lease */}
            <div className="radar-filter-bar">
              <button
                type="button"
                className={`radar-filter-pill ${purposeFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setPurposeFilter('all')}
              >
                All ({radarCounts.total})
              </button>
              <button
                type="button"
                className={`radar-filter-pill pill-sell ${purposeFilter === 'sale' ? 'is-active' : ''}`}
                onClick={() => setPurposeFilter('sale')}
              >
                🟢 Sell ({radarCounts.sale})
              </button>
              <button
                type="button"
                className={`radar-filter-pill pill-rent ${purposeFilter === 'rent' ? 'is-active' : ''}`}
                onClick={() => setPurposeFilter('rent')}
              >
                🔵 Rent ({radarCounts.rent})
              </button>
              <button
                type="button"
                className={`radar-filter-pill pill-lease ${purposeFilter === 'lease' ? 'is-active' : ''}`}
                onClick={() => setPurposeFilter('lease')}
              >
                🟣 Lease ({radarCounts.lease})
              </button>
            </div>

            {/* Instagram Verification Toggle */}
            <div className="radar-verification-toggle-row">
              <label className="radar-verified-checkbox-label">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="radar-verified-input"
                />
                <InstagramVerifiedIcon size={14} />
                <span>Instagram Verified Users Only ({radarCounts.verified})</span>
              </label>
            </div>
          </div>

          {/* List of Properties in Radar */}
          <div className="radar-listings-scroll">
            {detectedProperties.length === 0 ? (
              <div className="radar-empty-state">
                <Radio size={36} className="radar-empty-icon" />
                <p className="radar-empty-title">No listings detected in this circle</p>
                <p className="radar-empty-desc">
                  Increase the radar radius to 12 km or 20 km, or click a preset locality like Whitefield or Indiranagar.
                </p>
                <button
                  type="button"
                  className="btn-radar-expand"
                  onClick={() => setRadiusKm(15)}
                >
                  Expand Radar to 15 km
                </button>
              </div>
            ) : (
              detectedProperties.map((p) => {
                const isSelected = selectedProperty?.id === p.id;
                return (
                  <div
                    key={p.id}
                    className={`radar-listing-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleFocusProperty(p)}
                  >
                    <div className="radar-card-top-line">
                      <span className={`radar-purpose-pill purpose-${p.purpose}`}>
                        {p.purpose === 'sale' ? 'FOR SALE' : p.purpose === 'rent' ? 'FOR RENT' : 'FOR LEASE'}
                      </span>
                      <span className="radar-item-distance">📍 {p.distanceText}</span>
                    </div>

                    <div className="radar-card-main-content">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'}
                        alt={p.title}
                        className="radar-card-thumb"
                      />
                      <div className="radar-card-text">
                        <div className="radar-card-user-row">
                          <span className="radar-user-name">
                            {p.agent?.name || p.postedBy}
                          </span>
                          {p.verified && (
                            <span title="Instagram-style Verified Property">
                              <InstagramVerifiedIcon size={14} />
                            </span>
                          )}
                        </div>
                        <h4 className="radar-item-title">{p.title}</h4>
                        <p className="radar-item-locality">
                          {p.locality} · {p.bhk ? `${p.bhk} BHK` : p.propertyType}
                        </p>
                      </div>
                    </div>

                    <div className="radar-card-bottom-bar">
                      <div className="radar-price-block">
                        <span className="radar-price-amount">
                          {formatIndianPrice(p.price, p.purpose)}
                        </span>
                        {p.leaseTenure && (
                          <span className="radar-lease-duration">({p.leaseTenure})</span>
                        )}
                      </div>
                      <div className="radar-card-actions">
                        <button
                          type="button"
                          className="btn-locate-pin"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFocusProperty(p);
                          }}
                        >
                          Locate
                        </button>
                        <Link
                          to={`/property/${p.id}`}
                          className="btn-details-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar Footer: Sell / Lease Property Prompt */}
          <div className="radar-sidebar-footer">
            <div className="radar-footer-cta-box">
              <div className="radar-footer-text">
                <Sparkles size={16} className="radar-footer-sparkle" />
                <span>Want your property to appear on this radar?</span>
              </div>
              <Link to="/sell" className="btn-radar-post-property">
                List for Sale, Rent or Lease
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
