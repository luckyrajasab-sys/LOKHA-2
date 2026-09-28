import React from 'react';
import { Train, GraduationCap, Cross, Briefcase, ShoppingBag, Utensils, Plane } from 'lucide-react';

const CATEGORY_ICONS = {
  Metro: Train,
  Transport: Train,
  School: GraduationCap,
  Education: GraduationCap,
  Hospital: Cross,
  'IT Park': Briefcase,
  SEZ: Briefcase,
  Shopping: ShoppingBag,
  Dining: Utensils,
  Airport: Plane
};

export default function NearbyPlaces({ places = [] }) {
  if (!places || places.length === 0) return null;

  return (
    <div className="nearby-grid">
      {places.map((place, index) => {
        const Icon = CATEGORY_ICONS[place.type] || Briefcase;
        return (
          <div key={index} className="nearby-item">
            <div className="nearby-name">
              <Icon size={16} color="var(--color-trust-blue)" />
              <div>
                <div>{place.name}</div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                  {place.type}
                </span>
              </div>
            </div>
            <span className="nearby-dist">{place.distance}</span>
          </div>
        );
      })}
    </div>
  );
}
