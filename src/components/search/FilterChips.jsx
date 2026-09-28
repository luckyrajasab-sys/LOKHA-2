import React from 'react';
import { X } from 'lucide-react';

export default function FilterChips({ filters, onFilterChange, onReset }) {
  const chips = [];

  if (filters.q) chips.push({ key: 'q', label: `Search: "${filters.q}"` });
  if (filters.city) chips.push({ key: 'city', label: filters.city });
  if (filters.purpose) {
    chips.push({
      key: 'purpose',
      label: filters.purpose === 'sale' ? 'For Sale' : filters.purpose === 'rent' ? 'For Rent' : 'For Lease'
    });
  }
  if (filters.propertyType) chips.push({ key: 'propertyType', label: filters.propertyType });
  if (filters.bhk) chips.push({ key: 'bhk', label: `${filters.bhk} BHK` });
  if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: '✓ Verified' });
  if (filters.budget) chips.push({ key: 'budget', label: 'Custom Budget' });
  if (filters.furnishing) chips.push({ key: 'furnishing', label: filters.furnishing });
  if (filters.possessionStatus) chips.push({ key: 'possessionStatus', label: filters.possessionStatus });
  if (filters.postedBy) chips.push({ key: 'postedBy', label: `By ${filters.postedBy}` });

  if (filters.amenities && Array.isArray(filters.amenities)) {
    filters.amenities.forEach((am) => {
      chips.push({ key: `amenity_${am}`, label: am, isAmenity: true, amenityVal: am });
    });
  }

  if (chips.length === 0) return null;

  const handleRemoveChip = (chip) => {
    if (chip.isAmenity) {
      const remaining = (filters.amenities || []).filter((a) => a !== chip.amenityVal);
      onFilterChange('amenities', remaining);
    } else if (chip.key === 'verifiedOnly') {
      onFilterChange('verifiedOnly', false);
    } else {
      onFilterChange(chip.key, '');
    }
  };

  return (
    <div className="filter-chips-bar" aria-label="Active filters">
      <span className="filter-chips-label">
        Active:
      </span>
      {chips.map((chip) => (
        <span 
          key={chip.key}
          className="filter-chip-item"
        >
          <span>{chip.label}</span>
          <button 
            type="button" 
            onClick={() => handleRemoveChip(chip)}
            className="filter-chip-close"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <button 
        type="button" 
        onClick={onReset}
        className="filter-chips-clear-all"
      >
        Clear All
      </button>
    </div>
  );
}
