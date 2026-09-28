import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  TrendingUp,
  Building,
  Home,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio,
  Search,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';
import { featuredLocations } from '../data/locationsData';
import { useSaved } from '../context/SavedContext';
import { InstagramVerifiedIcon } from '../components/common/VerifiedBadge';

const LOCALITY_SPOTLIGHTS = [
  {
    id: 'spot-1',
    name: 'Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9698,
    lng: 77.7499,
    avgPriceSqFt: '₹8,450',
    appreciation: '+14.2%',
    rentalYield: '4.8%',
    activeListings: 142,
    radarRadius: 8,
    tagline: 'Premier tech corridor, Purple Line metro connectivity & international schools',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    purposes: { sale: 82, rent: 48, lease: 12 }
  },
  {
    id: 'spot-2',
    name: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9784,
    lng: 77.6408,
    avgPriceSqFt: '₹16,200',
    appreciation: '+18.5%',
    rentalYield: '5.2%',
    activeListings: 64,
    radarRadius: 5,
    tagline: 'High-street dining, tree-canopied lanes & luxury boutique penthouses',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    purposes: { sale: 28, rent: 26, lease: 10 }
  },
  {
    id: 'spot-3',
    name: 'HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9121,
    lng: 77.6446,
    avgPriceSqFt: '₹11,800',
    appreciation: '+16.1%',
    rentalYield: '5.5%',
    activeListings: 98,
    radarRadius: 6,
    tagline: 'Startup epicenter, broad avenues, serene parks & top-tier co-working hubs',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    purposes: { sale: 44, rent: 42, lease: 12 }
  },
  {
    id: 'spot-4',
    name: 'OMR Corridor',
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 12.8258,
    lng: 80.2245,
    avgPriceSqFt: '₹6,400',
    appreciation: '+11.8%',
    rentalYield: '4.6%',
    activeListings: 85,
    radarRadius: 10,
    tagline: 'Coastal expressway, world-class IT parks, gated townships & beach proximity',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    purposes: { sale: 52, rent: 24, lease: 9 }
  },
  {
    id: 'spot-5',
    name: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.1197,
    lng: 72.9056,
    avgPriceSqFt: '₹22,400',
    appreciation: '+13.4%',
    rentalYield: '4.1%',
    activeListings: 110,
    radarRadius: 7,
    tagline: 'Neoclassical towers, lakefront promenades, corporate parks & vibrant retail',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80',
    purposes: { sale: 62, rent: 36, lease: 12 }
  },
  {
    id: 'spot-6',
    name: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.4401,
    lng: 78.3489,
    avgPriceSqFt: '₹9,200',
    appreciation: '+21.3%',
    rentalYield: '5.8%',
    activeListings: 135,
    radarRadius: 9,
    tagline: 'Financial district, wide expressways, global tech campuses & high-rise societies',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
    purposes: { sale: 78, rent: 45, lease: 12 }
  }
];

export default function LocalitiesPage() {
  const navigate = useNavigate();
  const { properties } = useSaved();
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Count active properties on web app
  const totalSale = properties.filter((p) => p.purpose === 'sale').length;
  const totalRent = properties.filter((p) => p.purpose === 'rent').length;
  const totalLease = properties.filter((p) => p.purpose === 'lease').length;

  const filteredSpotlights = LOCALITY_SPOTLIGHTS.filter((loc) => {
    if (selectedCity !== 'All' && loc.city !== selectedCity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="localities-page-root">
      {/* ── Sub-Navigation / Breadcrumb Bar ── */}
      <div className="localities-top-nav">
        <div className="container localities-top-nav-inner">
          <div className="localities-tab-group">
            <span className="localities-nav-tab is-active">
              <Compass size={16} />
              <span>Micro-Markets Overview</span>
            </span>
            <Link to="/localities/map" className="localities-nav-tab btn-radar-tab-link">
              <Radio size={16} className="radar-tab-pulse-icon" />
              <span>Live Property Radar Map</span>
              <span className="radar-tab-badge">SCANNER</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container localities-content-container">
        {/* ── Grand Radar Map Hero Banner ── */}
        <div className="radar-hero-banner">
          <div className="radar-hero-left">
            <div className="radar-badge-chip">
              <span className="radar-ping-dot"></span>
              <span>LIVE GEOGRAPHIC RADAR · GOOGLE MAPS API</span>
            </div>
            <h1 className="radar-hero-title">
              Scan Neighborhoods with Circular Radar
            </h1>
            <p className="radar-hero-desc">
              Locate every homeowner and landlord who listed properties on LOKHA for{' '}
              <strong>Sell</strong>, <strong>Rent</strong>, or <strong>Lease</strong>. Real-time concentric distance scanning with Instagram-style verified badges.
            </p>

            <div className="radar-hero-metrics">
              <div className="radar-metric-box">
                <span className="metric-val">{totalSale}</span>
                <span className="metric-label">🟢 For Sale</span>
              </div>
              <div className="radar-metric-box">
                <span className="metric-val">{totalRent}</span>
                <span className="metric-label">🔵 For Rent</span>
              </div>
              <div className="radar-metric-box">
                <span className="metric-val">{totalLease}</span>
                <span className="metric-label">🟣 For Lease</span>
              </div>
              <div className="radar-metric-box">
                <span className="metric-val">100%</span>
                <span className="metric-label">EB / ID Verified</span>
              </div>
            </div>

            <div className="radar-hero-actions">
              <Link to="/localities/map" className="btn-hero-launch-radar">
                <Radio size={18} />
                <span>Launch Interactive Radar Map</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/sell" className="btn-hero-list-radar">
                <span>List Property to Appear on Radar</span>
              </Link>
            </div>
          </div>

          <div className="radar-hero-right">
            {/* Visual Radar Mockup Simulation */}
            <div className="radar-visual-display" onClick={() => navigate('/localities/map')}>
              <div className="radar-mockup-circle">
                <div className="radar-mockup-ring ring-1"></div>
                <div className="radar-mockup-ring ring-2"></div>
                <div className="radar-mockup-ring ring-3"></div>
                <div className="radar-mockup-sweep"></div>
                <div className="radar-mockup-center"></div>

                {/* Floating Blips */}
                <div className="mockup-blip blip-sell" style={{ top: '30%', left: '38%' }}>
                  <span className="blip-label">Sell ₹85L</span>
                </div>
                <div className="mockup-blip blip-rent" style={{ top: '62%', left: '68%' }}>
                  <span className="blip-label">Rent ₹42k</span>
                </div>
                <div className="mockup-blip blip-lease" style={{ top: '38%', left: '72%' }}>
                  <span className="blip-label">Lease 3Yr</span>
                </div>
                <div className="mockup-blip blip-sell" style={{ top: '68%', left: '28%' }}>
                  <span className="blip-label">Sell ₹1.2Cr</span>
                </div>
              </div>
              <div className="radar-mockup-overlay-hint">
                <Radio size={16} />
                <span>Click to Open Live Fullscreen Radar</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter Bar for Micro-Markets ── */}
        <div className="localities-search-filter-row">
          <div className="localities-search-box">
            <Search size={17} className="localities-search-icon" />
            <input
              type="text"
              placeholder="Search localities (e.g. Whitefield, Indiranagar, Powai...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="localities-search-input"
            />
          </div>

          {/* City Segmented Filter */}
          <div className="localities-city-chips">
            {['All', 'Bengaluru', 'Chennai', 'Mumbai', 'Hyderabad'].map((city) => (
              <button
                key={city}
                type="button"
                className={`city-pill ${selectedCity === city ? 'is-active' : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* ── Locality Cards Grid ── */}
        <div className="localities-cards-grid">
          {filteredSpotlights.map((loc) => (
            <div key={loc.id} className="locality-card">
              <div className="locality-card-img-wrap">
                <img src={loc.image} alt={loc.name} className="locality-card-img" />
                <span className="locality-city-badge">{loc.city}</span>
                <span className="locality-appreciation-badge">
                  <TrendingUp size={12} />
                  <span>{loc.appreciation} / yr</span>
                </span>
              </div>

              <div className="locality-card-body">
                <div className="locality-card-title-row">
                  <div>
                    <h3 className="locality-card-name">{loc.name}</h3>
                    <p className="locality-card-state">{loc.state}</p>
                  </div>
                  <div className="locality-price-stat">
                    <span className="price-stat-val">{loc.avgPriceSqFt}</span>
                    <span className="price-stat-label">avg / sq.ft</span>
                  </div>
                </div>

                <p className="locality-card-desc">{loc.tagline}</p>

                {/* Live Radar Distribution */}
                <div className="locality-radar-distribution">
                  <div className="distribution-item">
                    <span className="dist-dot dot-sale"></span>
                    <span className="dist-label">{loc.purposes.sale} For Sale</span>
                  </div>
                  <div className="distribution-item">
                    <span className="dist-dot dot-rent"></span>
                    <span className="dist-label">{loc.purposes.rent} For Rent</span>
                  </div>
                  <div className="distribution-item">
                    <span className="dist-dot dot-lease"></span>
                    <span className="dist-label">{loc.purposes.lease} For Lease</span>
                  </div>
                </div>

                {/* Action Buttons: Scan on Radar & Explore */}
                <div className="locality-card-actions">
                  <Link
                    to={`/localities/map?lat=${loc.lat}&lng=${loc.lng}&name=${encodeURIComponent(loc.name)}&radius=${loc.radarRadius}`}
                    className="btn-scan-radar-card"
                  >
                    <Radio size={14} className="radar-scan-icon" />
                    <span>Scan on Radar</span>
                  </Link>

                  <Link
                    to={`/search?q=${encodeURIComponent(loc.name)}`}
                    className="btn-explore-locality-card"
                  >
                    <span>Listings</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
