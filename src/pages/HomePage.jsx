import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  ShieldCheck,
  TrendingUp,
  Calendar,
  ArrowRight,
  Building,
  Home,
  Map,
  BarChart2,
  Train,
  Sparkles,
  Waves,
  Briefcase,
  CheckCircle2,
  Compass,
  FileCheck,
  Phone,
  Star,
  Users,
  Award,
  Layers,
  Search,
  Radio
} from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';
import ScrollReveal from '../components/common/ScrollReveal';
import StickyScroll from '../components/ui/StickyScroll';
import SearchPanel from '../components/search/SearchPanel';
import ContactLokhaModal from '../components/common/ContactLokhaModal';
import { featuredLocations } from '../data/locationsData';
import { VERIFIED_AGENTS, PREMIER_BUILDERS } from '../data/partnersData';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { getLocalityInsights } from '../services/propertyService';

const PROPERTY_TYPES = [
  { id: 'Apartment', label: 'Apartments', sub: 'High-rise & mid-rise flats', icon: Building, query: 'Apartment' },
  { id: 'Villa', label: 'Luxury Villas', sub: 'Gated enclaves & independent estates', icon: Home, query: 'Villa' },
  { id: 'Plot', label: 'Plots & Land', sub: 'Residential & commercial parcels', icon: Map, query: 'Plot' },
  { id: 'Office', label: 'Commercial Offices', sub: 'Grade-A tech parks & workspaces', icon: Building2, query: 'Office' },
  { id: 'Penthouse', label: 'Penthouses', sub: 'Sky residences with private terraces', icon: Sparkles, query: 'Penthouse' },
  { id: 'PG', label: 'PG & Co-Living', sub: 'Fully-managed designer suites', icon: Layers, query: 'PG' }
];

const WHY_LOKHA = [
  {
    icon: ShieldCheck,
    title: '100% Deed Verification',
    desc: 'Every property on Lokha undergoes title authenticity and RERA verification so you browse with total legal certainty.'
  },
  {
    icon: BarChart2,
    title: 'Direct Rates & Zero Hidden Markup',
    desc: 'Direct prices from property owners, partner brokers, and premier builders with no arbitrary surge charges.'
  },
  {
    icon: Radio,
    title: 'Spatial Commute Radar',
    desc: 'Explore real estate by radius, commute time, metro stations, and micro-market capital appreciation rates.'
  },
  {
    icon: Calendar,
    title: 'Seamless 1-Click Site Visits',
    desc: 'Choose your preferred date and time slot. Meet the verified manager with zero broker pressure or spam calls.'
  }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Search & Radar Filter',
    desc: 'Filter thousands of verified properties by budget, micro-market radius, metro proximity, or property type.',
    icon: Compass
  },
  {
    step: '02',
    title: 'Verified Digital Inspection',
    desc: 'High-resolution photographs, authentic architectural specifications, price-per-sq.ft. history, and RERA numbers.',
    icon: ShieldCheck
  },
  {
    step: '03',
    title: 'Instant 1-Click Site Visit',
    desc: 'Schedule an on-ground tour directly with the owner or certified partner broker at your convenient hour.',
    icon: Calendar
  },
  {
    step: '04',
    title: 'Transparent Paperwork',
    desc: 'Receive digital lease assistance, title documentation assistance, and historical price appreciation trends.',
    icon: FileCheck
  }
];

export default function HomePage() {
  const { properties, loadingProperties } = useSaved();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('General Advisory');

  // Category counts computed dynamically from real database
  const typeCounts = React.useMemo(() => {
    const map = {};
    properties.forEach((p) => {
      const t = (p.propertyType || p.type || 'Apartment').toLowerCase();
      map[t] = (map[t] || 0) + 1;
    });
    return map;
  }, [properties]);

  // Slices for each dedicated section
  const featuredProps = React.useMemo(() => {
    const list = properties.filter((p) => p.featured || p.verified);
    return (list.length > 0 ? list : properties).slice(0, 6);
  }, [properties]);

  const buyProps = React.useMemo(() => {
    return properties.filter((p) => p.purpose === 'sale').slice(0, 6);
  }, [properties]);

  const rentProps = React.useMemo(() => {
    return properties.filter((p) => p.purpose === 'rent').slice(0, 6);
  }, [properties]);

  const premiumProps = React.useMemo(() => {
    return properties
      .filter((p) => (p.price >= 12000000 && p.purpose === 'sale') || p.verified)
      .slice(0, 6);
  }, [properties]);

  const localityInsights = getLocalityInsights(properties);

  const handleOpenAdvisorContact = (subject = 'Property Advisory') => {
    setContactSubject(subject);
    setIsContactOpen(true);
  };

  return (
    <div className="home-page-root">
      {/* ── 1. HERO SECTION & INTEGRATED SEARCH PANEL ─────────────── */}
      <section className="hero-section" aria-label="Find a place you love">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <ScrollReveal direction="down" duration={0.6}>
            <div className="hero-pill-badge">
              <Sparkles size={14} color="var(--lokha-gold)" />
              <span>India’s Intelligent Real Estate Discovery Platform</span>
            </div>
            <h1 className="hero-title">Find a place you'll love</h1>
            <p className="hero-subtitle">
              Explore verified residences, luxury villas, architectural plots, and corporate offices across India.
            </p>
          </ScrollReveal>

          {/* Integrated Multi-Criteria Search Panel */}
          <ScrollReveal direction="up" delay={0.15} duration={0.65}>
            <SearchPanel className="hero-search-box-elevated" />
          </ScrollReveal>

          {/* Quick Shortcuts: Micro-Markets & Live Radar */}
          <div className="hero-bottom-pills-row">
            <span className="hero-pills-label">Popular Micro-Markets:</span>
            {['Whitefield', 'Indiranagar', 'Bandra West', 'Powai', 'Hitec City', 'OMR Chennai'].map((city) => (
              <button
                key={city}
                type="button"
                className="hero-market-quick-chip"
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(city)}`);
                }}
              >
                <MapPin size={12} />
                <span>{city}</span>
              </button>
            ))}
            <Link to="/localities/map" className="hero-radar-shortcut-chip">
              <Radio size={12} className="radar-live-dot-icon" />
              <span>Launch Live Radar Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED PROPERTIES ─────────────────────────────────── */}
      <section className="home-section" style={{ background: 'var(--color-bg-page)' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Handpicked Collection</p>
              <h2 className="home-section-title">Featured Properties</h2>
              <p className="home-section-subtitle">
                Curated prime residences and high-yield commercial investments verified by Lokha.
              </p>
            </div>
            <Link 
              to="/search" 
              className="btn btn-outline btn-sm home-view-all-link"
            >
              <span>View All Listings</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="property-cards-grid">
            {featuredProps.map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BROWSE BY PROPERTY TYPE ─────────────────────────────── */}
      <section className="home-section" style={{ background: 'var(--lokha-surface-warm)' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Architectural Categories</p>
              <h2 className="home-section-title">Browse by Property Type</h2>
              <p className="home-section-subtitle">
                Explore spaces tailored to your family, lifestyle, or business requirements.
              </p>
            </div>
          </div>

          <div className="property-types-grid">
            {PROPERTY_TYPES.map((item, idx) => {
              const count = typeCounts[item.id.toLowerCase()] || typeCounts[item.query.toLowerCase()] || 0;
              return (
                <ScrollReveal key={item.id} delay={idx * 0.06}>
                  <Link
                    to={`/search?type=${encodeURIComponent(item.query)}`}
                    className="property-type-card"
                  >
                    <div className="property-type-icon-box">
                      <item.icon size={26} strokeWidth={2} />
                    </div>
                    <div className="property-type-meta">
                      <h3 className="property-type-name">{item.label}</h3>
                      <p className="property-type-desc">{item.sub}</p>
                      <span className="property-type-count">
                        {count > 0 ? `${count}+ Properties Available` : 'Explore Listings'} &rarr;
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. BUY PROPERTIES ──────────────────────────────────────── */}
      <section className="home-section" style={{ background: 'var(--color-bg-page)' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Ready for Ownership</p>
              <h2 className="home-section-title">Properties for Sale</h2>
              <p className="home-section-subtitle">
                Freehold homes, RERA-approved gated villas, and builder floors with transparent EMI calculations.
              </p>
            </div>
            <Link 
              to="/search?purpose=sale" 
              className="btn btn-outline btn-sm home-view-all-link"
            >
              <span>Explore All Homes for Sale</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="property-cards-grid">
            {buyProps.map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. RENTAL PROPERTIES ───────────────────────────────────── */}
      <section className="home-section" style={{ background: 'var(--lokha-surface-warm)' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Urban Living on Lease</p>
              <h2 className="home-section-title">Rental Properties</h2>
              <p className="home-section-subtitle">
                Furnished and semi-furnished residences in high-connectivity tech corridors and metro belts.
              </p>
            </div>
            <Link 
              to="/search?purpose=rent" 
              className="btn btn-outline btn-sm home-view-all-link"
            >
              <span>Browse All Rentals</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="property-cards-grid">
            {rentProps.map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PREMIUM PROPERTIES (LUXURY CORRIDOR) ────────────────── */}
      <section className="home-section home-section-luxury">
        <div className="container">
          <div className="home-section-header header-luxury">
            <div>
              <div className="luxury-eyebrow-pill">
                <Sparkles size={13} color="var(--lokha-gold)" />
                <span>The Luxury Collection</span>
              </div>
              <h2 className="home-section-title title-luxury">Signature Residences</h2>
              <p className="home-section-subtitle subtitle-luxury">
                Handcrafted estates, sky penthouses, and waterfront sanctuaries defined by architectural grandeur.
              </p>
            </div>
            <Link 
              to="/premium" 
              className="btn btn-premium-gold"
            >
              <span>Explore Premium Showroom</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="property-cards-grid">
            {premiumProps.map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. POPULAR LOCATIONS & METROS ──────────────────────────── */}
      <section className="home-section" style={{ background: 'var(--color-bg-page)' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Geographic Reach</p>
              <h2 className="home-section-title">Popular Locations Across India</h2>
              <p className="home-section-subtitle">
                Discover verified homes in the nation's most vibrant economic capitals.
              </p>
            </div>
            <Link to="/localities" className="btn btn-outline btn-sm home-view-all-link">
              <span>View Locality Insights</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="locations-grid">
            {featuredLocations.map((loc) => (
              <Link
                key={loc.id}
                to={`/search?city=${encodeURIComponent(loc.name)}`}
                className="location-card"
              >
                <img src={loc.image} alt={loc.name} className="location-card-img" />
                <div className="location-card-overlay">
                  <h3 className="location-card-name">{loc.name}</h3>
                  <div className="location-card-footer">
                    <span className="location-card-count">{loc.propertyCount} properties</span>
                    <span className="location-card-badge">Explore &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. VERIFIED AGENTS & BROKERS ───────────────────────────── */}
      <section className="home-section" style={{ background: 'var(--lokha-surface-warm)' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Expert Advisory</p>
              <h2 className="home-section-title">Verified Agents & Advisors</h2>
              <p className="home-section-subtitle">
                Connect directly with RERA-registered real-estate specialists with audited transaction track records.
              </p>
            </div>
            <Link to="/about#agents" className="btn btn-outline btn-sm home-view-all-link">
              <span>Join as an Agent</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="partners-grid">
            {VERIFIED_AGENTS.map((agent, i) => (
              <ScrollReveal key={agent.id} delay={i * 0.08}>
                <div className="partner-card">
                  <div className="partner-card-header">
                    <img src={agent.avatar} alt={agent.name} className="partner-avatar" />
                    <div>
                      <div className="partner-name-row">
                        <h3 className="partner-name">{agent.name}</h3>
                        <span className="badge badge-verified badge-sm">Verified</span>
                      </div>
                      <p className="partner-role">{agent.role}</p>
                      <span className="partner-agency">{agent.agency}</span>
                    </div>
                  </div>

                  <div className="partner-specs-bar">
                    <div className="partner-spec-item">
                      <span className="partner-spec-val">{agent.activeListings}</span>
                      <span className="partner-spec-lbl">Listings</span>
                    </div>
                    <div className="partner-spec-item">
                      <span className="partner-spec-val">{agent.experience}</span>
                      <span className="partner-spec-lbl">Experience</span>
                    </div>
                    <div className="partner-spec-item">
                      <span className="partner-spec-val">★ {agent.rating}</span>
                      <span className="partner-spec-lbl">({agent.reviews})</span>
                    </div>
                  </div>

                  <div className="partner-specialties">
                    {agent.specialties.map((spec) => (
                      <span key={spec} className="partner-specialty-pill">{spec}</span>
                    ))}
                  </div>

                  <div className="partner-footer">
                    <span className="partner-rera" title={`RERA Registration: ${agent.rera}`}>
                      RERA: {agent.rera.substring(0, 18)}…
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm partner-contact-btn"
                      onClick={() => handleOpenAdvisorContact(`Consultation with ${agent.name}`)}
                    >
                      <Phone size={13} />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. PREMIER BUILDERS & DEVELOPERS ───────────────────────── */}
      <section className="home-section" style={{ background: 'var(--color-bg-page)' }}>
        <div className="container">
          <div className="home-section-header">
            <div>
              <p className="home-section-eyebrow">Institutional Developers</p>
              <h2 className="home-section-title">Premier Builders & Developers</h2>
              <p className="home-section-subtitle">
                Explore landmark integrated townships and upcoming launches by India's most trusted developer brands.
              </p>
            </div>
            <Link to="/search?status=Under+Construction" className="btn btn-outline btn-sm home-view-all-link">
              <span>View Developer Projects</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="builders-grid">
            {PREMIER_BUILDERS.map((builder, idx) => (
              <ScrollReveal key={builder.id} delay={idx * 0.08}>
                <div className="builder-card">
                  <div className="builder-card-img-wrap">
                    <img src={builder.logo} alt={builder.name} className="builder-card-img" />
                    <span className="builder-est-badge">Est. {builder.established}</span>
                  </div>
                  <div className="builder-card-body">
                    <h3 className="builder-name">{builder.name}</h3>
                    <p className="builder-tagline">{builder.tagline}</p>

                    <div className="builder-stats-row">
                      <div className="builder-stat">
                        <span className="builder-stat-num">{builder.completedProjects}+</span>
                        <span className="builder-stat-desc">Delivered</span>
                      </div>
                      <div className="builder-stat">
                        <span className="builder-stat-num">{builder.ongoingProjects}</span>
                        <span className="builder-stat-desc">Ongoing</span>
                      </div>
                      <div className="builder-stat">
                        <span className="builder-stat-num">{builder.cities.length}</span>
                        <span className="builder-stat-desc">Metros</span>
                      </div>
                    </div>

                    <div className="builder-card-footer">
                      <span className="builder-featured-project">
                        ★ {builder.featuredProject}
                      </span>
                      <Link
                        to={`/search?q=${encodeURIComponent(builder.name)}`}
                        className="btn-builder-explore"
                      >
                        Explore Projects &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. WHY LOKHA (VALUE PROPOSITIONS) ──────────────────────── */}
      <section className="home-section" style={{ background: 'var(--lokha-surface-warm)' }}>
        <div className="container">
          <div className="home-section-header" style={{ textAlign: 'center', margin: '0 auto 48px auto' }}>
            <p className="home-section-eyebrow">Trust & Architecture</p>
            <h2 className="home-section-title">Why Choose LOKHA</h2>
            <p className="home-section-subtitle" style={{ margin: '8px auto 0 auto' }}>
              Engineered from the ground up to eliminate real-estate friction, uncertainty, and non-transparent pricing.
            </p>
          </div>

          <div className="why-lokha-grid">
            {WHY_LOKHA.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <div className="why-lokha-card">
                  <div className="why-lokha-icon-wrap">
                    <item.icon size={26} strokeWidth={2.2} />
                  </div>
                  <h3 className="why-lokha-card-title">{item.title}</h3>
                  <p className="why-lokha-card-desc">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. HOW LOKHA WORKS (4-STEP TIMELINE) ───────────────────── */}
      <section className="home-section" style={{ background: 'var(--color-bg-page)' }}>
        <div className="container">
          <div className="home-section-header" style={{ textAlign: 'center', margin: '0 auto 52px auto' }}>
            <p className="home-section-eyebrow">Seamless Discovery</p>
            <h2 className="home-section-title">How LOKHA Works</h2>
            <p className="home-section-subtitle" style={{ margin: '8px auto 0 auto' }}>
              From initial commute radius calculation to in-person walkthroughs and transparent deed review.
            </p>
          </div>

          <div className="how-it-works-grid">
            {HOW_IT_WORKS.map((step, idx) => (
              <ScrollReveal key={step.step} delay={idx * 0.1}>
                <div className="how-step-card">
                  <div className="how-step-number">{step.step}</div>
                  <div className="how-step-icon">
                    <step.icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="how-step-title">{step.title}</h3>
                  <p className="how-step-desc">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. CALL TO ACTION (SPLIT PARTNER & BUYER BANNER) ────────── */}
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-grid">
            <div className="cta-split-card cta-seller">
              <span className="cta-badge">For Owners & Developers</span>
              <h3 className="cta-headline">List Your Property Free</h3>
              <p className="cta-desc">
                Connect with serious verified buyers and tenants. Zero listing charges, zero spam, and instant live inventory publication.
              </p>
              <Link to="/sell" className="btn btn-cta-teal btn-lg">
                <span>Publish Listing Free</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="cta-split-card cta-buyer">
              <span className="cta-badge">Need Guided Advisory?</span>
              <h3 className="cta-headline">Speak with a Lokha Specialist</h3>
              <p className="cta-desc">
                Let our architectural real-estate concierge shortlist properties, arrange verified site visits, and coordinate legal review.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ background: 'var(--lokha-gold)', color: '#2F241F' }}
                onClick={() => handleOpenAdvisorContact('Dedicated Property Concierge')}
              >
                <span>Request Advisory Call</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Interactive Contact Modal */}
      <ContactLokhaModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialSubject={contactSubject}
      />
    </div>
  );
}
