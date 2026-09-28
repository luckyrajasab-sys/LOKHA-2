import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Home,
  Map,
  Heart,
  Scale,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Layers,
  Code,
  Lock,
  Database,
  Radio,
  Cpu,
  Terminal,
  CheckCircle2,
  Compass,
  Train,
  GraduationCap,
  Hospital,
  TreePine,
  Key,
  Lamp,
  Sofa,
  BookOpen,
  Laptop
} from 'lucide-react';
import ScrollReveal from '../components/common/ScrollReveal';
import ContactLokhaModal from '../components/common/ContactLokhaModal';

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const scrollToStory = () => {
    const el = document.getElementById('about-story-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="about-page-immersive">
      {/* ── 1. HERO — “A PLACE YOU’LL LOVE” ────────────────────────── */}
      <section className="about-hero-cinematic" aria-label="A Place You'll Love">
        <div className="about-hero-lighting-overlay" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal direction="down" duration={0.6}>
            <div className="about-hero-tag-badge">
              <Sparkles size={14} color="#FBBF24" />
              <span>Real-Estate Technology • Architectural Living</span>
            </div>
            <h1 className="about-hero-headline">
              Find a place you’ll love.
            </h1>
            <p className="about-hero-lead">
              LOKHA brings property discovery, location intelligence, and modern technology together to help you explore places that feel right.
            </p>
            <div className="about-hero-btn-row">
              <Link to="/search" className="btn btn-cta-teal btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Home size={18} />
                <span>Explore Properties</span>
              </Link>
              <button
                type="button"
                onClick={scrollToStory}
                className="btn btn-outline btn-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(8px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span>Discover LOKHA</span>
                <ArrowDown size={16} />
              </button>
            </div>

            {/* Subtle Floating Location Indicator */}
            <div>
              <div className="about-hero-floating-pin">
                <MapPin size={15} color="#00A69C" />
                <span>📍 Explore this place • Curated Indian Spaces</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 2. VISUAL TRANSITION: HOME TO DISCOVERY ───────────────── */}
      <section className="about-sequence-strip" aria-label="Visual Transition Sequence">
        <div className="container">
          <div className="about-sequence-track">
            <div className="about-sequence-step">
              <div className="about-step-pill">01</div>
              <div>
                <div className="about-step-title">HOME</div>
                <div className="about-step-desc">The living environment</div>
              </div>
            </div>

            <ArrowRight size={18} className="about-step-arrow" />

            <div className="about-sequence-step">
              <div className="about-step-pill">02</div>
              <div>
                <div className="about-step-title">LOCATION</div>
                <div className="about-step-desc">Neighborhood context</div>
              </div>
            </div>

            <ArrowRight size={18} className="about-step-arrow" />

            <div className="about-sequence-step">
              <div className="about-step-pill">03</div>
              <div>
                <div className="about-step-title">PROPERTY</div>
                <div className="about-step-desc">Verified architecture</div>
              </div>
            </div>

            <ArrowRight size={18} className="about-step-arrow" />

            <div className="about-sequence-step">
              <div className="about-step-pill">04</div>
              <div>
                <div className="about-step-title">DISCOVERY</div>
                <div className="about-step-desc">Intelligent navigation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ABOUT LOKHA: EDITORIAL & INTERIOR FRAME ─────────────── */}
      <section className="about-editorial-section" id="about-story-section">
        <div className="container">
          <div className="about-editorial-grid">
            <ScrollReveal direction="left">
              <div>
                <span className="about-wood-panel-heading">
                  Architectural Discovery
                </span>
                <h2 className="about-editorial-title">
                  More than finding a property.
                </h2>
                <p className="about-editorial-lead">
                  LOKHA is a technology-driven real-estate platform designed to make property discovery simpler, smarter, and more connected to the places around it.
                </p>
                <p className="about-editorial-subtext">
                  The platform brings property discovery, location intelligence, interactive maps, property information, and user-focused tools together in one cohesive experience—grounded in the atmosphere of places you can imagine calling home.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <Link to="/search" className="btn btn-primary-navy" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span>Browse Homes</span>
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsContactOpen(true)}
                    className="btn btn-outline"
                    style={{ borderColor: '#D6D3D1', color: '#44403C' }}
                  >
                    Contact LOKHA
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Architectural Frame (Wood + Stone + Glass) */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="about-architectural-frame">
                <div className="about-frame-inner-matting">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="Sunlit modern architectural home with natural wood and travertine stone"
                    className="about-frame-img"
                  />
                  {/* Floating Architectural Badges */}
                  <div className="about-floating-labels-bar">
                    <span className="about-floating-tag">
                      <MapPin size={13} color="#00A69C" /> Location
                    </span>
                    <span className="about-floating-tag">
                      <Home size={13} color="#2F80ED" /> Property
                    </span>
                    <span className="about-floating-tag">
                      <Compass size={13} color="#D97706" /> Discovery
                    </span>
                    <span className="about-floating-tag">
                      <Sparkles size={13} color="#8B5CF6" /> Experience
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 4. WHY LOKHA: THREE ROOM CARDS ─────────────────────────── */}
      <section className="about-rooms-section">
        <div className="container">
          <div className="about-rooms-heading-wrap">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              Spatial Purpose
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Because a home is more than four walls.
            </h2>
          </div>

          <div className="about-room-grid">
            {/* Card 01: Discover (Living Room) */}
            <ScrollReveal delay={0.1}>
              <div
                className="about-room-card"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80')`
                }}
              >
                <div className="about-room-gradient" />
                <div className="about-room-content">
                  <div className="about-room-label">Room 01 • Living Room</div>
                  <h3 className="about-room-title">Discover</h3>
                  <p className="about-room-desc">
                    Explore properties through a simple and intuitive digital experience.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 02: Explore (Hallway / City View) */}
            <ScrollReveal delay={0.2}>
              <div
                className="about-room-card"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80')`
                }}
              >
                <div className="about-room-gradient" />
                <div className="about-room-content">
                  <div className="about-room-label">Room 02 • Architectural View</div>
                  <h3 className="about-room-title">Explore</h3>
                  <p className="about-room-desc">
                    Understand the location, neighborhood, nearby places, and surroundings.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 03: Choose (Warm Bedroom Interior) */}
            <ScrollReveal delay={0.3}>
              <div
                className="about-room-card"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80')`
                }}
              >
                <div className="about-room-gradient" />
                <div className="about-room-content">
                  <div className="about-room-label">Room 03 • Bedroom Suite</div>
                  <h3 className="about-room-title">Choose</h3>
                  <p className="about-room-desc">
                    Compare the details that matter before making your next move.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 5. HOME-INSPIRED FEATURE SECTION (INTERIOR ANCHORS) ────── */}
      <section className="about-anchors-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B5A2B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              Interior Objects as Visual Anchors
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', color: '#1C1917', fontWeight: 800, margin: 0 }}>
              Everything around the place matters.
            </h2>
            <p style={{ color: '#78716C', marginTop: '12px', fontSize: '1rem', lineHeight: 1.6 }}>
              Rooted in tactile home objects, each LOKHA feature is crafted to make real-estate discovery feel tangible and human.
            </p>
          </div>

          <div className="about-anchor-grid">
            {/* Feature 01: Location (Table Lamp) */}
            <ScrollReveal delay={0.06}>
              <div className="about-anchor-card">
                <div className="about-anchor-header">
                  <div className="about-anchor-badge">
                    <Lamp size={14} /> Anchor 01
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>Table Lamp & Map</span>
                </div>
                <div className="about-anchor-img-box">
                  <img
                    src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
                    alt="Elegant table lamp beside location map"
                  />
                </div>
                <div className="about-anchor-body">
                  <h4>📍 Location</h4>
                  <p>
                    Connecting living spaces with transit, schools, and city landmarks.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 02: Properties (Architectural Model) */}
            <ScrollReveal delay={0.12}>
              <div className="about-anchor-card">
                <div className="about-anchor-header">
                  <div className="about-anchor-badge">
                    <Home size={14} /> Anchor 02
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>House Model</span>
                </div>
                <div className="about-anchor-img-box">
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=80"
                    alt="Miniature architectural house model"
                  />
                </div>
                <div className="about-anchor-body">
                  <h4>🏠 Properties</h4>
                  <p>
                    Clear layouts, verified square footage, and architectural details.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 03: Map Search (Framed Map Artwork) */}
            <ScrollReveal delay={0.18}>
              <div className="about-anchor-card">
                <div className="about-anchor-header">
                  <div className="about-anchor-badge">
                    <Map size={14} /> Anchor 03
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>Framed Artwork</span>
                </div>
                <div className="about-anchor-img-box">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=80"
                    alt="Framed map artwork hanging on natural wall"
                  />
                </div>
                <div className="about-anchor-body">
                  <h4>🗺 Map Search</h4>
                  <p>
                    Geographic exploration with movable radius circles and custom price pins.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 04: Saved Homes (Wooden Shelf) */}
            <ScrollReveal delay={0.24}>
              <div className="about-anchor-card">
                <div className="about-anchor-header">
                  <div className="about-anchor-badge">
                    <Heart size={14} /> Anchor 04
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>Oak Shelf</span>
                </div>
                <div className="about-anchor-img-box">
                  <img
                    src="https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=700&q=80"
                    alt="Small wooden shelf with favorite home cards"
                  />
                </div>
                <div className="about-anchor-body">
                  <h4>❤️ Saved Homes</h4>
                  <p>
                    A private sanctuary for keeping your shortlisted residences organized.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 05: Compare (Material Samples) */}
            <ScrollReveal delay={0.3}>
              <div className="about-anchor-card">
                <div className="about-anchor-header">
                  <div className="about-anchor-badge">
                    <Scale size={14} /> Anchor 05
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>Stone & Wood</span>
                </div>
                <div className="about-anchor-img-box">
                  <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80"
                    alt="Architectural material samples side by side"
                  />
                </div>
                <div className="about-anchor-body">
                  <h4>⚖️ Compare</h4>
                  <p>
                    Side-by-side evaluation of pricing, area, amenities, and floor plans.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 06: Visits (Desk & House Key) */}
            <ScrollReveal delay={0.36}>
              <div className="about-anchor-card">
                <div className="about-anchor-header">
                  <div className="about-anchor-badge">
                    <Key size={14} /> Anchor 06
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#78716C', fontWeight: 600 }}>Keys & Calendar</span>
                </div>
                <div className="about-anchor-img-box">
                  <img
                    src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=700&q=80"
                    alt="Modern desk with house key and calendar"
                  />
                </div>
                <div className="about-anchor-body">
                  <h4>📅 Visits</h4>
                  <p>
                    Effortless 1-click scheduling directly with verified owners and managers.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 5B. THE LOKHA ECOSYSTEM: BUYERS, OWNERS, AGENTS & BUILDERS ─ */}
      <section className="about-ecosystem-section" style={{ padding: '80px 0', background: 'var(--color-bg-page, #F7F5F0)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--lokha-wood, #8B5A2B)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              Stakeholder Empowerment
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', color: 'var(--color-text-main, #1C1917)', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
              Built for every side of Indian Real Estate.
            </h2>
            <p style={{ color: 'var(--color-text-secondary, #78716C)', marginTop: '12px', fontSize: '1rem', lineHeight: 1.6 }}>
              Whether you are discovering your dream home, monetizing a portfolio, or marketing a master-planned community, LOKHA provides purpose-built tools.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* 1. Buyer Experience */}
            <div id="buyers" style={{ background: 'var(--color-card, #FFFFFF)', borderRadius: 'var(--radius-xl)', padding: '32px 28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--lokha-surface-warm, #FAF6F0)', color: 'var(--lokha-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Home size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '10px' }}>
                Buyers & Tenants
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                Discover verified properties with direct owner contacts, zero hidden charges, GPS proximity radar, and transparent EMI estimations.
              </p>
              <ul style={{ padding: 0, margin: '0 0 24px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  '100% Zero-brokerage direct options',
                  'Live Haversine transit & amenity radar',
                  '1-click instant site-visit bookings',
                  'Historical price trends & market comparisons'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--color-text-main)' }}>
                    <CheckCircle2 size={15} color="var(--lokha-accent, #00A69C)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/search" className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '0.86rem' }}>
                Browse Available Homes
              </Link>
            </div>

            {/* 2. Owner & Seller Experience */}
            <div id="owners" style={{ background: 'var(--color-card, #FFFFFF)', borderRadius: 'var(--radius-xl)', padding: '32px 28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--lokha-surface-warm, #FAF6F0)', color: 'var(--lokha-wood)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Key size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '10px' }}>
                Property Owners & Sellers
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                List your residential or commercial real estate for free. Connect directly with thousands of verified tenants and serious buyers.
              </p>
              <ul style={{ padding: 0, margin: '0 0 24px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Free zero-commission property listing',
                  'Direct buyer inquiry notifications',
                  'Real-time visit scheduling manager',
                  'Full listing control and edit flexibility'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--color-text-main)' }}>
                    <CheckCircle2 size={15} color="var(--lokha-accent, #00A69C)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/sell" className="btn btn-cta-teal" style={{ justifyContent: 'center', fontSize: '0.86rem' }}>
                List Property for Free
              </Link>
            </div>

            {/* 3. Agent & Broker Support */}
            <div id="agents" style={{ background: 'var(--color-card, #FFFFFF)', borderRadius: 'var(--radius-xl)', padding: '32px 28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--lokha-surface-warm, #FAF6F0)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '10px' }}>
                Agents & Certified Brokers
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                Scale your advisory business. Showcase verified RERA credentials, build micro-market authority, and manage verified buyer inquiries.
              </p>
              <ul style={{ padding: 0, margin: '0 0 24px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Verified RERA partner profile badges',
                  'Locality-focused listing amplification',
                  'Real-time lead alerts & CRM integration',
                  'High-intent buyer connection guarantee'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--color-text-main)' }}>
                    <CheckCircle2 size={15} color="var(--lokha-accent, #00A69C)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/search" className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '0.86rem' }}>
                Explore Partner Listings
              </Link>
            </div>

            {/* 4. Builder & Developer Support */}
            <div id="builders" style={{ background: 'var(--color-card, #FFFFFF)', borderRadius: 'var(--radius-xl)', padding: '32px 28px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--lokha-surface-warm, #FAF6F0)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '10px' }}>
                Builders & Developers
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                Showcase premier townships and master-planned developments. Deliver virtual 3D floor plans and manage project inventory with ease.
              </p>
              <ul style={{ padding: 0, margin: '0 0 24px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Township & high-rise master plan showcase',
                  'Floor plan, specification & brochure uploads',
                  'Direct institutional buyer inquiry routing',
                  'Phase-wise possession & inventory updates'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--color-text-main)' }}>
                    <CheckCircle2 size={15} color="var(--lokha-accent, #00A69C)" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/search" className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '0.86rem' }}>
                View Premier Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FOUNDER SECTION: ARCHITECTURAL STUDIO ───────────────── */}
      <section className="about-founder-studio">
        <div className="container">
          <div style={{ marginBottom: '40px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              The Maker’s Space
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.6rem)', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Meet the Founder
            </h2>
          </div>

          <div className="about-studio-container">
            <div className="about-studio-grid">
              {/* Studio Sidebar: Warm lighting, desk emblem */}
              <div className="about-studio-sidebar">
                <div className="about-studio-avatar-wrap">
                  <Terminal size={52} strokeWidth={2.4} />
                </div>
                <div className="about-studio-name">Vishwa</div>
                <div className="about-studio-role">Founder & Full-Stack Developer</div>

                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '18px 0' }} />

                <div style={{ fontSize: '0.76rem', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  Core Focus
                </div>
                <div className="about-studio-focus-list">
                  <span className="about-studio-pill">Real Estate Technology</span>
                  <span className="about-studio-pill">AI & Data Science</span>
                  <span className="about-studio-pill">Web Development</span>
                </div>
              </div>

              {/* Studio Main Content */}
              <div className="about-studio-main">
                <p className="about-studio-statement">
                  Vishwa is the Founder and Developer of LOKHA, responsible for the concept, design, development, and technical implementation of the platform.
                </p>

                <h4 style={{ fontSize: '0.84rem', color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                  Core Responsibilities
                </h4>

                <div className="about-studio-resp-grid">
                  {[
                    'Defining the product concept and platform features',
                    'Designing the user experience and interface',
                    'Developing the frontend and application functionality',
                    'Implementing Firebase-based backend services',
                    'Integrating authentication, database, and real-time features',
                    'Developing location and property-discovery functionality',
                    'Testing, debugging, and improving the platform',
                    'Managing deployment and ongoing technical development'
                  ].map((resp, i) => (
                    <div key={i} className="about-studio-resp-item">
                      <CheckCircle2 size={16} />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Status Badges */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '22px' }}>
                  <div style={{ fontSize: '0.76rem', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    Platform Architecture Status
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[
                      { name: 'Frontend React 19', status: 'Implemented' },
                      { name: 'Location Radar & GPS', status: 'Implemented' },
                      { name: 'Firebase Authentication', status: 'Connected & Active' },
                      { name: 'Firebase Realtime DB', status: 'Connected & Active' },
                      { name: 'Firebase Storage', status: 'Connected & Active' },
                      { name: 'Inquiries Lead Engine', status: 'Connected & Active' },
                      { name: 'RERA Verification', status: 'Active' },
                      { name: 'AI Valuation Model', status: 'In Development' }
                    ].map((t) => (
                      <span
                        key={t.name}
                        style={{
                          fontSize: '0.74rem',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: t.status !== 'In Development' ? 'rgba(0, 166, 156, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                          color: t.status !== 'In Development' ? '#2DD4BF' : '#CBD5E1',
                          fontWeight: 600,
                          border: `1px solid ${t.status !== 'In Development' ? 'rgba(0, 166, 156, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`
                        }}
                      >
                        {t.name} • {t.status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 7. FOUNDER MESSAGE (QUIET HOME CORNER) ──────────────── */}
          <ScrollReveal delay={0.2}>
            <div className="about-corner-quote-box">
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                A vision behind LOKHA
              </div>
              <div className="about-corner-quote-text">
                “LOKHA began with the idea of creating a more connected and technology-driven way to explore real estate.
                The goal is to bring property discovery, location intelligence, and useful digital tools together in one platform while keeping the experience simple for the people using it.”
              </div>
              <div className="about-corner-author">
                — Vishwa, Founder & Developer
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 8. TECHNOLOGY + HOME (THE WORKSPACE DESK) ──────────────── */}
      <section className="about-desk-section">
        <div className="container">
          <div className="about-desk-scene">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B5A2B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              The Desk Scene
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: '#1C1917', fontWeight: 800, margin: '0 0 14px' }}>
              Technology behind the place.
            </h2>
            <p style={{ color: '#78716C', maxWidth: '640px', lineHeight: 1.6, margin: 0 }}>
              Just as a well-designed home relies on solid foundations, LOKHA is engineered with high-performance web standards, location mathematics, and resilient data structures.
            </p>

            <div className="about-desk-tech-grid">
              {[
                { name: 'Frontend', desc: 'React 19, Vite, responsive CSS, and accessible Motion micro-interactions.', status: 'Implemented' },
                { name: 'Location', desc: 'Leaflet, OpenStreetMap tiles, Nominatim geocoding, and Haversine radius math.', status: 'Implemented' },
                { name: 'Authentication', desc: 'Google/Apple mock OAuth, OTP verification, and protected route architecture.', status: 'Frontend Implemented' },
                { name: 'Database', desc: 'Structured schema for properties, amenities, saved states, and price history.', status: 'Architecture Ready' },
                { name: 'Backend', desc: 'Firebase application services structured for serverless scaling.', status: 'In Development' },
                { name: 'Real-Time', desc: 'Visit scheduling synchronization and instant price alert updates.', status: 'In Development' },
                { name: 'AI & Data Science', desc: 'Locality appreciation insights and smart property matching models.', status: 'In Development' }
              ].map((tech) => (
                <div key={tech.name} className="about-desk-tech-card">
                  <div className="about-desk-tech-top">
                    <span className="about-desk-tech-name">{tech.name}</span>
                    <span className={`about-desk-status ${tech.status.includes('Implemented') ? 'status-active' : 'status-planned'}`}>
                      {tech.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#78716C', lineHeight: 1.5, margin: 0 }}>
                    {tech.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. LOCATION INTELLIGENCE: BRIDGE FROM HOME TO PLACE ─────── */}
      <section className="about-bridge-section">
        <div className="container">
          <div className="about-bridge-box">
            {/* Left: Beautiful Interior Scene */}
            <div className="about-bridge-left">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                alt="Beautiful home interior connected to city location"
              />
            </div>

            {/* Right: Geographic Context & Connection Flow */}
            <div className="about-bridge-right">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                Spatial Context
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: '#FFFFFF', fontWeight: 800, margin: '0 0 16px' }}>
                Where you live matters.
              </h2>
              <p style={{ color: '#D6D3D1', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                LOKHA connects property discovery with the locations around it—helping users explore neighborhoods, nearby places, transportation, and geographic property search.
              </p>

              {/* Visual flow: HOME → LOCATION → NEIGHBORHOOD → DISCOVERY */}
              <div className="about-bridge-flow">
                <span className="about-bridge-node">HOME</span>
                <span style={{ color: '#78716C' }}>&rarr;</span>
                <span className="about-bridge-node">LOCATION</span>
                <span style={{ color: '#78716C' }}>&rarr;</span>
                <span className="about-bridge-node">NEIGHBORHOOD</span>
                <span style={{ color: '#78716C' }}>&rarr;</span>
                <span className="about-bridge-node">DISCOVERY</span>
              </div>

              {/* Nearby Place Indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Train size={16} color="#00A69C" />
                  <span style={{ fontSize: '0.8rem', color: '#E7E5E4' }}>Metro Corridors</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={16} color="#38BDF8" />
                  <span style={{ fontSize: '0.8rem', color: '#E7E5E4' }}>Top Schools</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Hospital size={16} color="#F43F5E" />
                  <span style={{ fontSize: '0.8rem', color: '#E7E5E4' }}>Healthcare Hubs</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TreePine size={16} color="#4ADE80" />
                  <span style={{ fontSize: '0.8rem', color: '#E7E5E4' }}>Lakes & Parks</span>
                </div>
              </div>

              <div>
                <Link to="/search" className="btn btn-cta-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Map size={16} />
                  <span>Explore the Map</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA: OPEN SUNLIT DOORWAY ─────────────────────── */}
      <section className="about-doorway-cta" aria-label="Find Your Place">
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal direction="up">
            <h2 className="about-doorway-title">
              Your next place could be closer than you think.
            </h2>
            <p className="about-doorway-lead">
              Explore properties, discover locations, and find a place you’ll love with LOKHA.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/search" className="btn btn-cta-teal btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Home size={18} />
                <span>Explore Properties</span>
              </Link>
              <Link
                to="/search"
                className="btn btn-outline btn-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.14)',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(8px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Map size={18} />
                <span>Explore the Map</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Inquiry Modal */}
      <ContactLokhaModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
