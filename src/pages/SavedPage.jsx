import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Building2 } from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';
import ComparisonBar from '../components/compare/ComparisonBar';
import EmptyState from '../components/common/EmptyState';
import { useSaved } from '../context/SavedContext';

const TABS = [
  { label: 'All Saved', value: 'all' },
  { label: 'For Sale', value: 'sale' },
  { label: 'For Rent', value: 'rent' },
  { label: 'Commercial', value: 'commercial' },
];

export default function SavedPage() {
  const { properties, savedIds, compareIds } = useSaved();
  const [activeTab, setActiveTab] = useState('all');

  const savedProperties = properties.filter((p) => savedIds.includes(p.id));
  const filtered = activeTab === 'all'
    ? savedProperties
    : savedProperties.filter((p) => p.purpose === activeTab);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Heart size={24} color="var(--color-saved-heart)" fill="var(--color-saved-heart)" />
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Saved Homes</h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            {savedProperties.length} {savedProperties.length === 1 ? 'home' : 'homes'} saved — compare them when you're ready.
          </p>
        </div>
        <Link to="/search" className="btn btn-outline-navy btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Explore More <ArrowRight size={15} />
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', overflowX: 'auto' }}>
        {TABS.map((tab) => {
          const count = tab.value === 'all'
            ? savedProperties.length
            : savedProperties.filter((p) => p.purpose === tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding: '10px 18px',
                fontSize: '0.9rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: 'none',
                borderBottom: `3px solid ${activeTab === tab.value ? 'var(--color-trust-blue)' : 'transparent'}`,
                color: activeTab === tab.value ? 'var(--color-primary-navy)' : 'var(--color-text-secondary)',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab.label}
              {count > 0 && (
                <span style={{ background: activeTab === tab.value ? 'var(--color-navy-tint)' : 'var(--color-bg-page)', color: activeTab === tab.value ? 'var(--color-primary-navy)' : 'var(--color-text-secondary)', padding: '1px 7px', borderRadius: 'var(--radius-full)', fontSize: '0.76rem', border: '1px solid var(--color-border)' }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Compare hint */}
      {compareIds.length > 0 && compareIds.length < 2 && (
        <div style={{ background: 'var(--color-navy-tint)', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '10px 16px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--color-primary-navy)', fontWeight: 600 }}>
          Select one more property to start comparing side-by-side.
        </div>
      )}

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={activeTab === 'all' ? 'No saved homes yet' : `No ${activeTab === 'sale' ? 'for sale' : activeTab === 'rent' ? 'for rent' : 'commercial'} homes saved`}
          description="Save homes you love. Compare them later when you are ready to decide."
          actionText="Explore Properties"
          actionLink="/search"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} showCompare={true} />
          ))}
        </div>
      )}

      <ComparisonBar />
    </div>
  );
}
