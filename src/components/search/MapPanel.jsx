import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import {
  Navigation,
  RotateCcw,
  X,
  Search,
  MapPin,
  Layers,
  Move,
  CheckCircle2,
  Sliders,
  Filter
} from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';
import { calculateDistanceKm } from '../../utils/haversine';
import { reverseGeocode } from '../../services/locationService';

// Free Google Maps and Open tile endpoints
const MAP_LAYERS = {
  'google-streets': {
    name: 'Google Streets',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20
  },
  'google-satellite': {
    name: 'Google Satellite',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satellite',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20
  },
  'google-terrain': {
    name: 'Google Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20
  },
  'carto-voyager': {
    name: 'Carto Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }
};

export default function MapPanel({
  properties = [],
  selectedId = null,
  onSelectProperty,
  onSearchArea,
  onRadiusFilter,
  centerLocality = 'Bengaluru Metro Area'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const activeTileLayerRef = useRef(null);
  const markersRef = useRef({});
  const radiusCircleRef = useRef(null);
  const circleHandleMarkerRef = useRef(null);

  const [currentLayer, setCurrentLayer] = useState('google-streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [popupProperty, setPopupProperty] = useState(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(5); // Default 5km movable circle
  const [circleCenter, setCircleCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [circleInfo, setCircleInfo] = useState(null);

  // Auto-detect user live location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCircleCenter({ lat: latitude, lng: longitude });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1 });
          }
          if (radiusCircleRef.current) {
            radiusCircleRef.current.setLatLng([latitude, longitude]);
          }
          if (circleHandleMarkerRef.current) {
            circleHandleMarkerRef.current.setLatLng([latitude, longitude]);
          }
          evaluatePropertiesInCircle(latitude, longitude, selectedRadius);
        },
        (err) => {
          console.warn('Geolocation detection failed or permission denied, using default', err);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [evaluatePropertiesInCircle, selectedRadius]);

  // Initialize Map with Google Maps free layer
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = [circleCenter.lat, circleCenter.lng];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Default to Google Maps Streets layer
      const layerConfig = MAP_LAYERS['google-streets'];
      const tileLayer = L.tileLayer(layerConfig.url, {
        maxZoom: layerConfig.maxZoom,
        subdomains: layerConfig.subdomains,
        attribution: layerConfig.attribution
      }).addTo(map);

      activeTileLayerRef.current = tileLayer;

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Track movement for "Search this area"
      map.on('moveend', () => {
        setHasMoved(true);
      });

      // Allow clicking on map to reposition movable radius circle
      map.on('click', (e) => {
        if (selectedRadius > 0 && e.latlng) {
          handleMoveCircle(e.latlng.lat, e.latlng.lng);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Layer Switching (Google Streets / Satellite / Terrain / Carto)
  const switchLayer = (layerKey) => {
    const map = mapInstanceRef.current;
    if (!map || !MAP_LAYERS[layerKey]) return;

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    const config = MAP_LAYERS[layerKey];
    const newTileLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: config.subdomains,
      attribution: config.attribution
    }).addTo(map);

    activeTileLayerRef.current = newTileLayer;
    setCurrentLayer(layerKey);
    setShowLayerMenu(false);
  };

  // Update Property Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old property markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    if (properties.length === 0) return;

    const bounds = L.latLngBounds();

    properties.forEach((prop) => {
      const lat = prop.mapCoords?.lat ?? prop.latitude;
      const lng = prop.mapCoords?.lng ?? prop.longitude;
      if (!lat || !lng) return;

      const isSelected = prop.id === selectedId;
      const shortPrice =
        prop.price >= 10000000
          ? `₹${(prop.price / 10000000).toFixed(1)} Cr`
          : prop.price >= 100000
          ? `₹${Math.round(prop.price / 100000)} L`
          : `₹${prop.price.toLocaleString('en-IN')}`;

      const icon = L.divIcon({
        className: 'lokha-leaflet-div-icon',
        html: `
          <div class="lokha-price-pin ${isSelected ? 'selected' : ''}" data-id="${prop.id}">
            <span>${shortPrice}</span>
          </div>
        `,
        iconSize: [80, 32],
        iconAnchor: [40, 32]
      });

      const marker = L.marker([lat, lng], { icon, zIndexOffset: isSelected ? 1000 : 100 })
        .addTo(map)
        .on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (onSelectProperty) onSelectProperty(prop.id);
          setPopupProperty(prop);
          map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 0.8 });
        });

      markersRef.current[prop.id] = marker;
      bounds.extend([lat, lng]);
    });

    // Auto-fit if first load and no specific selection
    if (!selectedId && bounds.isValid() && properties.length > 0 && selectedRadius === 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [properties, onSelectProperty, selectedId, selectedRadius]);

  // Recalculate properties inside movable circle
  const evaluatePropertiesInCircle = useCallback(
    async (lat, lng, radiusKm) => {
      if (radiusKm <= 0) {
        setCircleInfo(null);
        return;
      }

      // Count matching properties within radius using Haversine
      let insideCount = 0;
      const matchingIds = [];

      properties.forEach((p) => {
        const pLat = p.mapCoords?.lat ?? p.latitude;
        const pLng = p.mapCoords?.lng ?? p.longitude;
        if (pLat && pLng) {
          const dist = calculateDistanceKm(lat, lng, pLat, pLng);
          if (dist !== null && dist <= radiusKm) {
            insideCount++;
            matchingIds.push(p.id);
          }
        }
      });

      // Quick reverse geocode to identify neighborhood
      let localityName = 'Selected City Area';
      try {
        const geo = await reverseGeocode(lat, lng);
        if (geo.locality && geo.locality !== 'Current Location') {
          localityName = `${geo.locality}, ${geo.city}`;
        } else if (geo.city) {
          localityName = geo.city;
        }
      } catch {
        // Fallback
      }

      const info = {
        lat,
        lng,
        radiusKm,
        localityName,
        count: insideCount,
        matchingIds
      };

      setCircleInfo(info);

      if (onRadiusFilter) {
        onRadiusFilter(info);
      }
    },
    [properties, onRadiusFilter]
  );

  // Handle Movable Circle Position Update
  const handleMoveCircle = useCallback(
    (newLat, newLng) => {
      setCircleCenter({ lat: newLat, lng: newLng });

      if (radiusCircleRef.current) {
        radiusCircleRef.current.setLatLng([newLat, newLng]);
      }
      if (circleHandleMarkerRef.current) {
        circleHandleMarkerRef.current.setLatLng([newLat, newLng]);
      }

      evaluatePropertiesInCircle(newLat, newLng, selectedRadius);
    },
    [selectedRadius, evaluatePropertiesInCircle]
  );

  // Manage Movable Circle & Draggable Handle Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up previous circle and handle
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }
    if (circleHandleMarkerRef.current) {
      circleHandleMarkerRef.current.remove();
      circleHandleMarkerRef.current = null;
    }

    if (selectedRadius <= 0) {
      setCircleInfo(null);
      return;
    }

    const center = [circleCenter.lat, circleCenter.lng];

    // 1. Draw Movable Leaflet Circle (smooth, clean solid boundary, no radar pulse)
    const circle = L.circle(center, {
      radius: selectedRadius * 1000,
      color: '#8A6346',
      fillColor: '#8A6346',
      fillOpacity: 0.11,
      weight: 2,
      interactive: false
    }).addTo(map);

    radiusCircleRef.current = circle;

    // 2. Center Draggable Handle Pin (Smooth mouse tracking, no radar pulse)
    const handleIcon = L.divIcon({
      className: 'lokha-draggable-handle-icon',
      html: `
        <div class="lokha-drag-handle-pin" title="Drag to move circle with mouse pointer">
          <div class="lokha-drag-center-dot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="5 9 2 12 5 15"></polyline>
              <polyline points="9 5 12 2 15 5"></polyline>
              <polyline points="15 19 12 22 9 19"></polyline>
              <polyline points="19 9 22 12 19 15"></polyline>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="12" y1="2" x2="12" y2="22"></line>
            </svg>
          </div>
          <div class="lokha-drag-tooltip">
            <span>✛ Drag with mouse</span>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const handleMarker = L.marker(center, {
      draggable: true,
      icon: handleIcon,
      zIndexOffset: 2000
    }).addTo(map);

    // Track dragging in real time
    handleMarker.on('drag', (e) => {
      const pos = e.target.getLatLng();
      if (radiusCircleRef.current) {
        radiusCircleRef.current.setLatLng(pos);
      }
    });

    // On drag end: evaluate properties & reverse geocode
    handleMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      handleMoveCircle(pos.lat, pos.lng);
    });

    circleHandleMarkerRef.current = handleMarker;

    // Evaluate initial position
    evaluatePropertiesInCircle(circleCenter.lat, circleCenter.lng, selectedRadius);
  }, [selectedRadius, handleMoveCircle, evaluatePropertiesInCircle]);

  // Handle selected property changes (pan to card)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedId) return;

    const selectedProp = properties.find((p) => p.id === selectedId);
    if (!selectedProp) return;

    setPopupProperty(selectedProp);

    const lat = selectedProp.mapCoords?.lat ?? selectedProp.latitude;
    const lng = selectedProp.mapCoords?.lng ?? selectedProp.longitude;

    if (lat && lng) {
      map.flyTo([lat, lng], 14, { duration: 0.8 });
    }

    // Refresh marker classes
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (el) {
        const pin = el.querySelector('.lokha-price-pin');
        if (pin) {
          if (id === selectedId) {
            pin.classList.add('selected');
          } else {
            pin.classList.remove('selected');
          }
        }
      }
    });
  }, [selectedId, properties]);

  const handleSearchCurrentArea = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const center = map.getCenter();
    setHasMoved(false);
    if (onSearchArea) {
      onSearchArea({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom()
      });
    }
  };

  const handleResetToCurrentCenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const center = map.getCenter();
    handleMoveCircle(center.lat, center.lng);
  };

  return (
    <div className="map-panel" aria-label="Interactive Map View">
      {/* Top Map Control Bar */}
      <div
        style={{
          padding: '10px 14px',
          background: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
          <Navigation size={14} color="var(--color-trust-blue)" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
            {centerLocality}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Movable Radius Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <select
              className="lokha-radius-selector"
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(Number(e.target.value))}
              title="Filter by radius circle"
            >
              <option value="0">Radius: Off</option>
              <option value="2">Circle: 2 km</option>
              <option value="5">Circle: 5 km</option>
              <option value="10">Circle: 10 km</option>
              <option value="15">Circle: 15 km</option>
              <option value="25">Circle: 25 km</option>
            </select>
          </div>

          {/* Google Maps Layer Switcher */}
          <div className="lokha-layer-menu" style={{ position: 'relative' }}>
            <button
              type="button"
              className="lokha-layer-btn"
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              title="Change Map Style"
            >
              <Layers size={13} />
              <span>{MAP_LAYERS[currentLayer]?.name?.split(' ')[1] || 'Layer'}</span>
            </button>

            {showLayerMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                  border: '1px solid #E2E8F0',
                  padding: '6px',
                  zIndex: 2000,
                  minWidth: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                {Object.entries(MAP_LAYERS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => switchLayer(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background: currentLayer === key ? '#E6F7F5' : 'transparent',
                      color: currentLayer === key ? '#007B74' : '#1E293B',
                      fontSize: '0.78rem',
                      fontWeight: currentLayer === key ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{item.name}</span>
                    {currentLayer === key && <CheckCircle2 size={13} color="#00A69C" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Reset */}
          <button
            type="button"
            onClick={handleResetToCurrentCenter}
            title="Snap circle to map center"
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="lokha-map-wrapper">
        {/* Floating "Search This Area" Pill */}
        {hasMoved && (
          <div className="lokha-map-floating-bar">
            <button type="button" className="lokha-search-area-btn" onClick={handleSearchCurrentArea}>
              <Search size={14} />
              <span>Search this area</span>
            </button>
          </div>
        )}

        {/* Map Container */}
        <div ref={mapContainerRef} className="lokha-leaflet-map" />

        {/* Movable Circle Active Results Banner */}
        {circleInfo && selectedRadius > 0 && (
          <div className="lokha-circle-active-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 166, 156, 0.25)',
                  border: '1.5px solid #00A69C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00A69C',
                  flexShrink: 0
                }}
              >
                <Move size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{circleInfo.localityName}</span>
                  <span style={{ background: '#00A69C', color: '#ffffff', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>
                    {circleInfo.radiusKm} km radius
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#CBD5E1', marginTop: '2px' }}>
                  {circleInfo.count} {circleInfo.count === 1 ? 'property' : 'properties'} found • Drag circle anywhere
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRadius(0)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#CBD5E1',
                padding: '4px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              title="Close circle filter"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Property Preview Popup Card */}
        {popupProperty && (
          <div className="map-popup-card">
            <img
              src={
                popupProperty.images?.[0] ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'
              }
              alt={popupProperty.title}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: 'var(--color-primary-navy)', fontSize: '0.98rem' }}>
                {formatIndianPrice(popupProperty.price, popupProperty.purpose || popupProperty.listingType)}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'var(--color-text-main)'
                }}
              >
                {popupProperty.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {popupProperty.locality} • {popupProperty.bhk ? `${popupProperty.bhk} BHK` : popupProperty.propertyType}
              </div>
              <Link
                to={`/property/${popupProperty.id}`}
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--color-cta-teal)',
                  fontWeight: 700,
                  marginTop: '4px',
                  display: 'inline-block'
                }}
              >
                View Details &rarr;
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setPopupProperty(null)}
              style={{ alignSelf: 'flex-start', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
