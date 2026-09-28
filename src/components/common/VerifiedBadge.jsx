import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Instagram-style Verified Badge Icon
 * Authentic 12-point scalloped rosette in signature Instagram blue (#0095F6) with white checkmark
 */
export function InstagramVerifiedIcon({ size = 16, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      aria-label="Verified Badge"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* 12-point scalloped rosette */}
      <path 
        d="M12 1L14.7 3.5L18.3 3.6L19.5 7L22.6 8.9L22 12.5L23.4 15.9L20.6 18.2L20.2 21.8L16.6 22.3L14.2 24.9L12 23.3L9.8 24.9L7.4 22.3L3.8 21.8L3.4 18.2L0.6 15.9L2 12.5L1.4 8.9L4.5 7L5.7 3.6L9.3 3.5L12 1Z" 
        fill="#0095F6" 
      />
      {/* White verification checkmark */}
      <path 
        d="M10.2 16.2L6.8 12.8L8.2 11.4L10.2 13.4L15.8 7.8L17.2 9.2L10.2 16.2Z" 
        fill="#FFFFFF" 
      />
    </svg>
  );
}

export function VerifiedBadge({ size = 'default', showLabel = true, className = '' }) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  return (
    <span 
      className={`badge badge-verified ${size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: 'rgba(0, 149, 246, 0.12)',
        color: '#0077D7',
        border: '1px solid rgba(0, 149, 246, 0.28)',
        fontWeight: 700,
        borderRadius: '999px',
        padding: size === 'sm' ? '2px 8px 2px 6px' : '4px 10px 4px 8px'
      }}
      title="Verified Property — Documents & Ownership Authenticated"
    >
      <InstagramVerifiedIcon size={iconSize} />
      {showLabel && <span>Verified</span>}
    </span>
  );
}

export function StatusBadge({ status, type = 'ready' }) {
  if (status === 'Ready to Move') {
    return (
      <span className="badge badge-status-ready">
        <CheckCircle2 size={12} />
        Ready to Move
      </span>
    );
  }
  if (status === 'Under Construction') {
    return (
      <span className="badge badge-status-under-construction">
        Under Construction
      </span>
    );
  }
  if (status === 'Newly Listed') {
    return (
      <span className="badge badge-new">
        Newly Listed
      </span>
    );
  }
  if (status === 'Price Drop') {
    return (
      <span className="badge badge-price-drop">
        Price Drop
      </span>
    );
  }
  return null;
}
