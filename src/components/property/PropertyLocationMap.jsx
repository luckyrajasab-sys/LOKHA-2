import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Shield, Eye, Navigation } from 'lucide-react';

export default function PropertyLocationMap({
  lat = 12.9716,
  lng = 77.5946,
  title = 'Property Location',
  locality = '',
  city = ''
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isApproximate, setIsApproximate] = useState(true);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers & Center when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    map.setView([lat, lng], 14);

    // Clear previous markers & circles
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    if (isApproximate) {
      // Draw approximate privacy circle (300m radius)
      L.circle([lat, lng], {
        radius: 350,
        color: '#00A69C',
        fillColor: '#00A69C',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '4, 6'
      }).addTo(map);

      const privacyIcon = L.divIcon({
        className: 'privacy-pin',
        html: `
          <div style="background:#12355B; color:#ffffff; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.2); border:1px solid #ffffff; display:flex; align-items:center; gap:4px;">
            <span>Approximate Location</span>
          </div>
        `,
        iconAnchor: [60, 16]
      });
      L.marker([lat, lng], { icon: privacyIcon }).addTo(map);
    } else {
      // Exact pin
      const exactIcon = L.divIcon({
        className: 'exact-pin',
        html: `
          <div style="background:#00A69C; color:#ffffff; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:700; white-space:nowrap; box-shadow:0 4px 12px rgba(0,166,156,0.4); border:2px solid #ffffff; display:flex; align-items:center; gap:4px;">
            <span>📍 ${title.split(' ')[0]}</span>
          </div>
        `,
        iconAnchor: [45, 18]
      });
      L.marker([lat, lng], { icon: exactIcon }).addTo(map);
    }
  }, [lat, lng, title, isApproximate]);

  return (
    <div style={{ marginTop: '20px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      {/* Header bar */}
      <div
        style={{
          padding: '12px 16px',
          background: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-primary-navy)' }}>
          <MapPin size={16} color="var(--color-cta-teal)" />
          <span>{locality ? `${locality}, ${city}` : city}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsApproximate(!isApproximate)}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#475569'
            }}
          >
            {isApproximate ? (
              <>
                <Shield size={13} color="#00A69C" />
                <span>Privacy Mode Active</span>
              </>
            ) : (
              <>
                <Eye size={13} color="#2F80ED" />
                <span>Showing Exact Pin</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div ref={mapRef} style={{ width: '100%', height: '280px' }} />
    </div>
  );
}
