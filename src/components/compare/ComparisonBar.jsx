import React, { useState } from 'react';
import { Layers, X, ArrowRight } from 'lucide-react';
import { useSaved } from '../../context/SavedContext';
import ComparisonModal from './ComparisonModal';

export default function ComparisonBar() {
  const { compareIds, clearCompare, properties } = useSaved();
  const [modalOpen, setModalOpen] = useState(false);

  if (compareIds.length < 2) return null;

  return (
    <>
      <div className="comparison-floating-bar" role="complementary" aria-label="Comparison dock">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={18} color="var(--color-cta-teal)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {compareIds.length} homes selected for comparison
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            type="button" 
            onClick={clearCompare} 
            className="btn btn-ghost btn-sm"
            style={{ color: '#CBD5E1' }}
          >
            Clear
          </button>

          {/* Primary CTA Teal */}
          <button 
            type="button" 
            onClick={() => setModalOpen(true)} 
            className="btn btn-cta-teal btn-sm"
          >
            <span>Compare Properties</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {modalOpen && (
        <ComparisonModal onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
