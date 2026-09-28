import React from 'react';

export function PropertyCardSkeleton() {
  return (
    <div className="property-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '16/10' }} />
      <div className="property-card-body" style={{ gap: '10px' }}>
        <div className="skeleton" style={{ width: '50%', height: '24px' }} />
        <div className="skeleton" style={{ width: '80%', height: '18px' }} />
        <div className="skeleton" style={{ width: '60%', height: '14px' }} />
        <div className="skeleton" style={{ width: '100%', height: '36px', marginTop: '8px' }} />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
