import React from 'react';
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
  FileCheck
} from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';
import ScrollReveal from '../components/common/ScrollReveal';
import StickyScroll from '../components/ui/StickyScroll';
import { featuredLocations } from '../data/locationsData';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { getLocalityInsights } from '../services/propertyService';

const QUICK_CATEGORIES = [
  { label: 'Apartment', icon: Building, type: 'Apartment' },
  { label: 'Villa', icon: Home, type: 'Villa' },
  { label: 'Plot', icon: Map, type: 'Plot' },
  { label: 'Office', icon: Building2, type: 'Office' },
  { label: 'PG / Co-Living', icon: Home, type: 'PG' },
  { label: 'New Projects', icon: BarChart2, status: 'Under Construction' }
];

const LIFESTYLE_COLLECTIONS = [
  {
    id: 'metro',
    title: 'Near Metro Corridors',
    tagline: 'Under 10 mins walk from rapid transit stations',
    count: '340+ Homes',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
    query: 'Metro',
    icon: Train
  },
  {
    id: 'tech',
    title: 'Tech-Park Proximity',
    tagline: 'Minutes from ITPL, Cyber City, Hitec & Manyata',
    count: '510+ Homes',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=80',
    query: 'Tech Park',
    icon: Briefcase
  },
  {
    id: 'gated',
    title: 'Gated Luxury Villas',
    tagline: 'Private gardens, clubhouses & 24/7 security',
    count: '180+ Villas',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80',
    query: 'Villa',
    icon: Home
  },
  {
    id: 'lake',
    title: 'Lakeview & Oceanfront',
    tagline: 'Serene water views, fresh air & peaceful balconies',
    count: '95+ Residences',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=700&q=80',
    query: 'Sea Facing',
    icon: Waves
  }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Intelligent Discovery',
    desc: 'Filter properties by commute time, metro stations, verified RERA certificates, or exact radius.',
    icon: Compass
  },
  {
    step: '02',
    title: '100% Verified Information',
    desc: 'Direct owner listings and vetted partner agents with authentic photographs and zero hidden markups.',
    icon: ShieldCheck
  },
  {
    step: '03',
    title: '1-Click Site Visits',
    desc: 'Pick your preferred date and time slot. Meet the owner or verified manager without spam calls.',
    icon: Calendar
  },
  {
    step: '04',
    title: 'Transparent Settlement',
    desc: 'Review historical price appreciation trends and get digital lease or ownership documentation guidance.',
    icon: FileCheck
  }
];

const WHY_LOKHA = [
  {
    icon: ShieldCheck,
    color: 'var(--lokha-accent)',
    bg: '#E8F0EF',
    title: 'Verified Listings',
    desc: 'Every property is reviewed for ownership and legal clearance so you browse with confidence.'
  },
  {
    icon: BarChart2,
    color: 'var(--lokha-wood)',
    bg: 'var(--lokha-surface-warm)',
    title: 'Transparent Pricing',
    desc: 'Clear property valuations, no hidden fees, with accurate maintenance costs and EMI calculators.'
  },
  {
    icon: Calendar,
    color: 'var(--lokha-gold)',
    bg: '#F7EEDB',
    title: 'Easy Visits',
    desc: 'Schedule visits at your preferred time without broker pressure or endless cold calls.'
  },
  {
    icon: TrendingUp,
    color: 'var(--lokha-terracotta)',
    bg: '#F7E8E2',
    title: 'Locality Intelligence',
    desc: 'Track price per sq.ft., 5-year capital appreciation, and infrastructure developments.'
  }
];

export default function HomePage() {
  const { properties } = useSaved();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const featuredProps = properties.filter((p) => p.featured).slice(0, 6);
  const localityInsights = getLocalityInsights(properties);

  return (
    <>
      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <section className="hero-section" aria-label="Search for properties">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <ScrollReveal direction="down" duration={0.6}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(247, 243, 237, 0.18)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: '30px', color: '#F7F3ED', fontSize: '0.85rem', fontWeight: 600, margin: '0 auto 16px auto', border: '1px solid rgba(247, 243, 237, 0.25)' }}>
              <Sparkles size={15} color="var(--lokha-gold)" />
              <span>India’s Intelligent Real Estate Discovery Platform</span>
            </div>
            <h1 className="hero-title">Find a place you'll love</h1>
            <p className="hero-subtitle">
              Explore verified apartments, luxury villas, plots, and commercial hubs across India.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2} duration={0.7}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '32px 0 28px', flexWrap: 'wrap' }}>
              <Link
                to={isAuthenticated ? '/search' : '/login'}
                id="hero-explore-cta"
                className="btn btn-primary"
                style={{
                  padding: '16px 36px',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  background: 'var(--lokha-gold, #B8956A)',
                  color: '#2F241F',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>Explore Properties</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href={isAuthenticated ? '/about' : '#interior-journey'}
                className="btn btn-outline"
                style={{
                  padding: '16px 32px',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  color: '#F7F3ED',
                  borderColor: 'rgba(247,243,237,0.35)',
                  background: 'rgba(247,243,237,0.12)',
                  backdropFilter: 'blur(8px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none'
                }}
              >
                <span>Discover Interiors</span>
              </a>
            </div>
          </ScrollReveal>

          {/* Quick Categories */}
          <div className="hero-quick-categories">
            {QUICK_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                type="button"
                className="category-chip"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    navigate(`/search?type=${encodeURIComponent(cat.type || '')}`);
                  }
                }}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIFESTYLE CURATED COLLECTIONS ─────────────────────────── */}
      <section style={{ padding: '64px 0 40px', background: 'var(--lokha-surface-warm)' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--lokha-wood)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Curated Living
            </p>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--lokha-primary)' }}>
              Explore by Lifestyle
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {LIFESTYLE_COLLECTIONS.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.1}>
                <Link
                  to={isAuthenticated ? `/search?q=${encodeURIComponent(item.query || '')}` : '/login'}
                  style={{
                    display: 'block',
                    position: 'relative',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    height: '240px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(47, 36, 31, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(47, 36, 31, 0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(47, 36, 31, 0.1)';
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(47,36,31,0.2) 0%, rgba(33,26,23,0.88) 100%)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      color: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--lokha-gold)', marginBottom: '4px' }}>
                      <item.icon size={16} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.count}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--lokha-beige)', margin: 0, lineHeight: 1.4 }}>{item.tagline}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERIOR JOURNEY (Sticky Scroll) ─────────────────────── */}
      <StickyScroll />

      {/* ── FEATURED PROPERTIES ──────────────────────────────────── */}
      <section style={{ padding: '64px 0 48px', background: 'var(--lokha-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--lokha-wood)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Handpicked for You
              </p>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--lokha-primary)' }}>
                Featured Properties
              </h2>
            </div>
            <Link 
              to={isAuthenticated ? '/search' : '/login'} 
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {featuredProps.map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCALITY INTELLIGENCE SPOTLIGHT ───────────────────────── */}
      <section style={{ padding: '64px 0', background: 'var(--lokha-surface-warm)' }}>
        <div className="container">
          <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--lokha-wood)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Micro-Market Data
              </p>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--lokha-primary)' }}>
                Locality Intelligence & Growth
              </h2>
              <p style={{ color: 'var(--lokha-muted)', marginTop: '8px', maxWidth: '540px' }}>
                Track average square foot rates and capital appreciation before you buy or invest.
              </p>
            </div>
            <Link to={isAuthenticated ? '/localities' : '/login'} className="btn btn-outline btn-sm">
              Explore Full Market Report &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {localityInsights.map((loc, i) => (
              <ScrollReveal key={loc.name} delay={i * 0.08}>
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(47, 36, 31, 0.06)',
                    border: '1px solid var(--lokha-border)',
                    transition: 'transform 0.2s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '140px', position: 'relative' }}>
                    <img src={loc.image} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(47, 36, 31, 0.88)', backdropFilter: 'blur(4px)', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {loc.city}
                    </div>
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--lokha-primary)', margin: '0 0 6px', fontFamily: 'var(--font-serif)' }}>{loc.name}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--lokha-muted)', margin: '0 0 16px', lineHeight: 1.4 }}>{loc.description}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', background: 'var(--lokha-surface-warm)', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--lokha-border)' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--lokha-muted)' }}>Avg Price / sq.ft</div>
                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--lokha-primary)' }}>{loc.avgPricePerSqFt}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--lokha-muted)' }}>YoY Growth</div>
                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--lokha-accent)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <TrendingUp size={14} />
                          {loc.growthYoY}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--lokha-border)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--lokha-muted)' }}>{loc.count} Verified listings</span>
                      <Link
                        to={isAuthenticated ? `/search?q=${encodeURIComponent(loc.name)}` : '/login'}
                        style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--lokha-accent)' }}
                      >
                        Explore Homes &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW LOKHA WORKS ───────────────────────────────────────── */}
      <section style={{ padding: '72px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--lokha-wood)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Simple & Transparent
            </p>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--lokha-primary)' }}>
              How LOKHA Works
            </h2>
            <p style={{ color: 'var(--lokha-muted)', marginTop: '12px', maxWidth: '520px', margin: '12px auto 0' }}>
              From initial locality search to verified site visits and transparent paperwork.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {HOW_IT_WORKS.map((step, index) => (
              <ScrollReveal key={step.step} delay={index * 0.12}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      fontSize: '3.5rem',
                      fontWeight: 900,
                      color: 'rgba(47, 36, 31, 0.08)',
                      lineHeight: 1,
                      marginBottom: '-16px'
                    }}
                  >
                    {step.step}
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--lokha-surface-warm)',
                      color: 'var(--lokha-accent)',
                      border: '1px solid var(--lokha-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <step.icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--lokha-primary)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--lokha-muted)', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LOCATIONS (CITIES) ───────────────────────────── */}
      <section style={{ background: 'var(--lokha-primary-dark)', padding: '72px 0', borderTop: '1px solid rgba(214, 197, 179, 0.12)' }}>
        <div className="container">
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--lokha-gold)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Top Metros
            </p>
            <h2 style={{ color: '#F7F3ED', margin: 0, fontFamily: 'var(--font-serif)', fontSize: '2.2rem' }}>
              Explore Cities Across India
            </h2>
            <p style={{ color: 'var(--lokha-border)', marginTop: '10px', maxWidth: '520px', margin: '10px auto 0' }}>
              Discover thousands of verified homes in India's prime economic hubs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {featuredLocations.map((loc) => (
              <Link
                key={loc.id}
                to={isAuthenticated ? `/search?city=${encodeURIComponent(loc.name)}` : '/login'}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  display: 'block',
                  aspectRatio: '4/3',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                }}
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, rgba(33,26,23,0.92) 0%, rgba(47,36,31,0.3) 60%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px'
                }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', margin: '0 0 4px', letterSpacing: '-0.01em', fontFamily: 'var(--font-serif)' }}>
                    {loc.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--lokha-border)', fontSize: '0.82rem' }}>
                      {loc.propertyCount} properties
                    </span>
                    <span style={{ background: 'var(--lokha-accent)', color: '#FFFFFF', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.76rem', fontWeight: 700 }}>
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY LOKHA ────────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', background: 'var(--lokha-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--lokha-wood)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Why Choose LOKHA
            </p>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--lokha-primary)' }}>
              Built Around Your Confidence
            </h2>
            <p style={{ color: 'var(--lokha-muted)', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0' }}>
              LOKHA helps you discover the right place to live, work, or invest with peace of mind.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {WHY_LOKHA.map((item) => (
              <div
                key={item.title}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  padding: '28px 24px',
                  border: '1px solid var(--lokha-border)',
                  boxShadow: '0 4px 14px rgba(47, 36, 31, 0.05)',
                  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(47, 36, 31, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(47, 36, 31, 0.05)';
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-lg)',
                  background: item.bg,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <item.icon size={24} strokeWidth={2} />
                </div>
                <h3 style={{ color: 'var(--lokha-primary)', marginBottom: '8px', fontSize: '1.15rem', fontFamily: 'var(--font-serif)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--lokha-muted)', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OWNER & DEVELOPER BANNER ─────────────────────────────── */}
      <section style={{ background: 'var(--lokha-primary)', padding: '64px 0', borderTop: '2px solid var(--lokha-wood)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#F7F3ED', fontSize: '2.2rem', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>
            Are you an owner or developer?
          </h2>
          <p style={{ color: 'var(--lokha-border)', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px', fontSize: '1.05rem' }}>
            Reach verified home seekers with zero upfront brokerage. List your home in under 3 minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to={isAuthenticated ? '/sell' : '/login'} className="btn btn-cta-teal btn-lg" id="homepage-list-property-cta">
              List Your Property — Free
            </Link>
            <Link to={isAuthenticated ? '/search' : '/login'} className="btn btn-outline btn-lg" style={{ background: 'rgba(247,243,237,0.08)', color: '#F7F3ED', borderColor: 'var(--lokha-wood)' }}>
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ── GRAND EXPLORE SECTION (End of Landing Page) ───────────── */}
      <section 
        id="landing-explore-section"
        style={{ 
          background: 'linear-gradient(180deg, #FBF8F4 0%, #FFFFFF 100%)', 
          padding: '88px 0 96px',
          borderTop: '1px solid rgba(184, 149, 106, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <ScrollReveal direction="up" duration={0.6}>
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(184, 149, 106, 0.14)', 
                border: '1px solid rgba(184, 149, 106, 0.3)',
                padding: '7px 20px', 
                borderRadius: '30px', 
                color: 'var(--lokha-wood)', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase', 
                marginBottom: '24px' 
              }}
            >
              <Sparkles size={15} color="var(--lokha-gold)" />
              <span>Full Access Discovery</span>
            </div>
            
            <h2 
              style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)', 
                color: 'var(--lokha-primary)', 
                marginBottom: '20px', 
                lineHeight: 1.15,
                letterSpacing: '-0.02em'
              }}
            >
              Start Exploring LOKHA Homes
            </h2>
            
            <p 
              style={{ 
                fontSize: '1.12rem', 
                color: 'var(--lokha-muted)', 
                lineHeight: 1.75, 
                marginBottom: '40px', 
                maxWidth: '620px', 
                margin: '0 auto 40px' 
              }}
            >
              Unlock verified luxury properties, detailed interior journeys, transparent pricing data, and direct owner connections. Sign in or create an account to begin.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link 
                to={isAuthenticated ? '/search' : '/login'}
                id="landing-explore-button"
                className="btn btn-primary"
                style={{
                  padding: '18px 46px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  borderRadius: '12px',
                  background: 'var(--lokha-gold, #B8956A)',
                  color: '#2F241F',
                  boxShadow: '0 12px 32px rgba(184, 149, 106, 0.42)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#C4A882';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(184, 149, 106, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--lokha-gold, #B8956A)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(184, 149, 106, 0.42)';
                }}
              >
                <span>Explore Now — Sign In</span>
                <ArrowRight size={20} />
              </Link>
              
              <Link
                to="/register"
                id="landing-signup-button"
                className="btn btn-outline"
                style={{
                  padding: '18px 36px',
                  fontSize: '1.02rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  borderColor: 'rgba(47, 36, 31, 0.25)',
                  color: 'var(--lokha-primary)',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(47, 36, 31, 0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--lokha-wood)';
                  e.currentTarget.style.background = 'var(--lokha-surface-warm)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(47, 36, 31, 0.25)';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create Account
              </Link>
            </div>
            
            <p style={{ marginTop: '24px', fontSize: '0.88rem', color: 'var(--lokha-muted)' }}>
              Join thousands discovering extraordinary architecture across India.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
