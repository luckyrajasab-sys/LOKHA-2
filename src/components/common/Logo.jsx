import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ 
  inverted = false, 
  light = false,
  className = '',
  showTagline = true 
}) {
  const isDarkBg = inverted || light;

  return (
    <Link 
      to="/" 
      className={`lokha-brand ${isDarkBg ? 'is-inverted' : ''} ${className}`}
      aria-label="LOKHA - Find a place you'll love"
    >
      <div className="lokha-logo-row">
        {/* Architectural Emblem: Wood Slats, Perspective Doorway, and Wall Panels */}
        <div className="lokha-brand-mark">
          <svg 
            width="34" 
            height="34" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="lokha-mark-svg"
            aria-hidden="true"
          >
            {/* Outer Architectural Double Framing */}
            <rect 
              x="6" 
              y="6" 
              width="88" 
              height="88" 
              rx="3" 
              className="lokha-logo-frame-outer" 
              strokeWidth="2.5"
            />
            <rect 
              x="11" 
              y="11" 
              width="78" 
              height="78" 
              rx="1.5" 
              className="lokha-logo-frame-inner" 
              strokeWidth="1.2"
            />

            {/* Left Vertical Slats (Architectural Louvers) */}
            <g className="lokha-logo-left-slats">
              {/* Slat 1 */}
              <polygon points="16,16 23,20 23,84 16,84" className="lokha-slat" />
              {/* Slat 2 */}
              <polygon points="26,21.5 33,25.5 33,84 26,84" className="lokha-slat" />
              {/* Slat 3 */}
              <polygon points="36,27 42,30.5 42,84 36,84" className="lokha-slat" />
            </g>

            {/* Diagonal Ceiling / Lintel Beam above slats */}
            <polygon 
              points="14,14 44,29 44,27 14,12" 
              className="lokha-logo-beam" 
            />

            {/* Center Doorway Opening (Perspective Entrance) */}
            {/* Door opening background depth */}
            <polygon 
              points="44,28 62,37 62,84 44,84" 
              className="lokha-logo-doorway-opening" 
            />

            {/* Open Door Leaf swinging inward */}
            <polygon 
              points="44,28 58,35 58,80 44,84" 
              className="lokha-logo-door-leaf" 
              strokeWidth="1.2"
            />
            {/* Door inner panel trim */}
            <polygon 
              points="46,33 56,38 56,77 46,81" 
              className="lokha-logo-door-trim" 
            />

            {/* Brass / Oak Floor Sill & Threshold */}
            <line 
              x1="42" 
              y1="84" 
              x2="84" 
              y2="84" 
              className="lokha-logo-threshold" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />

            {/* Right Side: Horizontal Wall Wood Panel Slats */}
            <g className="lokha-logo-right-panels">
              {/* Vertical framing divider between door and wall panels */}
              <line 
                x1="62" 
                y1="16" 
                x2="62" 
                y2="84" 
                className="lokha-logo-divider" 
                strokeWidth="1.8"
              />

              {/* Top header wall panel */}
              <rect x="64" y="16" width="20" height="11" className="lokha-panel" />
              <line x1="64" y1="27" x2="84" y2="27" className="lokha-panel-groove" strokeWidth="1.2" />

              {/* Panel Slat 1 */}
              <rect x="64" y="29" width="20" height="11" className="lokha-panel" />
              <line x1="64" y1="40" x2="84" y2="40" className="lokha-panel-groove" strokeWidth="1.2" />

              {/* Panel Slat 2 */}
              <rect x="64" y="42" width="20" height="11" className="lokha-panel" />
              <line x1="64" y1="53" x2="84" y2="53" className="lokha-panel-groove" strokeWidth="1.2" />

              {/* Panel Slat 3 */}
              <rect x="64" y="55" width="20" height="11" className="lokha-panel" />
              <line x1="64" y1="66" x2="84" y2="66" className="lokha-panel-groove" strokeWidth="1.2" />

              {/* Panel Slat 4 (Bottom) */}
              <rect x="64" y="68" width="20" height="14" className="lokha-panel" />
            </g>
          </svg>
        </div>

        {/* Brand Name & Architectural Wordmark */}
        <div className="lokha-brand-text">
          <span className="lokha-brand-name">LOKHA</span>
          {showTagline && (
            <span className="lokha-brand-tagline">Find a place you’ll love</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export { Logo };
