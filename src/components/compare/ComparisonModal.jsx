import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { useSaved } from '../../context/SavedContext';
import { formatIndianPrice, calculateEstimatedEMI, formatArea } from '../../utils/formatters';

export default function ComparisonModal({ onClose }) {
  const { compareIds, properties, clearCompare } = useSaved();

  const compareProperties = properties.filter((p) => compareIds.includes(p.id));

  const rows = [
    { label: 'Price', render: (p) => formatIndianPrice(p.price, p.purpose) },
    { label: 'Property Type', render: (p) => p.propertyType },
    { label: 'BHK', render: (p) => p.bhk ? `${p.bhk} BHK` : 'Commercial' },
    { label: 'Area', render: (p) => formatArea(p.area) },
    { label: 'Price per sq ft', render: (p) => p.price && p.area ? `₹${Math.round(p.price / p.area).toLocaleString('en-IN')}` : 'N/A' },
    { label: 'Estimated EMI', render: (p) => p.purpose === 'sale' ? calculateEstimatedEMI(p.price, p.purpose) : 'N/A (Rental)' },
    { label: 'Furnishing', render: (p) => p.furnishing || 'N/A' },
    { label: 'Possession', render: (p) => p.possessionStatus || 'N/A' },
    { label: 'Floor', render: (p) => p.floor || 'N/A' },
    { label: 'Parking', render: (p) => p.parking ? `${p.parking} Covered` : 'None' },
    { label: 'Posted By', render: (p) => p.postedBy || 'N/A' },
    { label: 'Verified', render: (p) => p.verified ? '✓ Verified' : 'Not verified' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Property Comparison">
      <div
        className="modal-content"
        style={{ maxWidth: '900px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-navy)' }}>
            Compare Properties ({compareProperties.length})
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => { clearCompare(); onClose(); }}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Clear All
            </button>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close comparison">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-page)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)', width: '150px', borderBottom: '1px solid var(--color-border)' }}>
                  Feature
                </th>
                {compareProperties.map((p) => (
                  <th key={p.id} style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '6px' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                        {p.bhk ? `${p.bhk} BHK ` : ''}{p.propertyType}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)' }}>
                        {p.locality}, {p.city}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.label}
                  style={{ background: idx % 2 === 0 ? '#FFFFFF' : 'var(--color-bg-page)' }}
                >
                  <td style={{ padding: '10px 16px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    {row.label}
                  </td>
                  {compareProperties.map((p) => (
                    <td key={p.id} style={{ padding: '10px 16px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
