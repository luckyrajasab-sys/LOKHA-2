import React from 'react';
import { 
  Waves, 
  Dumbbell, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Gamepad2, 
  ArrowUpCircle, 
  Car, 
  Trees, 
  BatteryCharging, 
  Activity, 
  Sparkles,
  Wifi
} from 'lucide-react';

const AMENITY_ICONS = {
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'Security': ShieldCheck,
  'Power Backup': Zap,
  'Clubhouse': Building2,
  'Children\'s Play Area': Gamepad2,
  'Lift': ArrowUpCircle,
  'Parking': Car,
  'Covered Parking': Car,
  'Private Garden': Trees,
  'EV Charging': BatteryCharging,
  'EV Charging Point': BatteryCharging,
  'Badminton Court': Activity,
  'Tennis Court': Activity,
  'High Speed Wifi': Wifi
};

export default function AmenityGrid({ amenities = [] }) {
  if (!amenities || amenities.length === 0) {
    return <p style={{ color: 'var(--color-text-secondary)' }}>No amenities specified.</p>;
  }

  return (
    <div className="amenities-grid">
      {amenities.map((amenity, idx) => {
        const IconComponent = AMENITY_ICONS[amenity] || Sparkles;
        return (
          <div key={idx} className="amenity-card">
            <IconComponent size={20} strokeWidth={2.2} />
            <span>{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}
