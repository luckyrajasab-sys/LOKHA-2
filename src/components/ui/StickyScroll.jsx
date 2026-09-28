import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE DATA – LOKHA Interior Journey
// Each panel represents one aspect of the home discovery experience
// ─────────────────────────────────────────────────────────────────────────────

const JOURNEY_PANELS = [
  {
    id: 'wall',
    category: 'WALL DESIGN',
    title: 'Surfaces That Tell a Story',
    desc: 'From raw concrete to hand-plastered limewash — LOKHA homes feature walls that are as expressive as the people who live in them.',
    cta: 'Browse Wall-Design Homes',
    query: 'interior',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    accent: '#B8956A',
    label: '01',
  },
  {
    id: 'wood',
    category: 'WOODEN INTERIORS',
    title: 'Warmth Built into the Grain',
    desc: 'Solid walnut panelling, teak flooring, and hand-finished joinery craft an atmosphere that no tile can replicate.',
    cta: 'Explore Wooden Interiors',
    query: 'wooden interior',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    accent: '#8A6346',
    label: '02',
  },
  {
    id: 'light',
    category: 'LIGHTING & AMBIENCE',
    title: 'Light as Architecture',
    desc: 'Recessed coves, designer pendants, and layered warm-white LEDs transform every evening into a private retreat.',
    cta: 'See Beautifully Lit Spaces',
    query: 'luxury lighting',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    accent: '#C4A882',
    label: '03',
  },
  {
    id: 'furniture',
    category: 'DESIGNER FURNITURE',
    title: 'Curated. Considered. Comfortable.',
    desc: 'Mid-century lounge chairs, bespoke daybeds, and artisan coffee tables — homes where every piece has a reason.',
    cta: 'Discover Furnished Homes',
    query: 'furnished',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
    accent: '#A0785A',
    label: '04',
  },
  {
    id: 'architecture',
    category: 'ARCHITECTURE',
    title: 'Structure Is the Soul',
    desc: 'Double-height voids, exposed rafters, arched corridors — homes designed by architects who treat space as art.',
    cta: 'Find Architectural Homes',
    query: 'Villa',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80',
    accent: '#7A6050',
    label: '05',
  },
  {
    id: 'ambience',
    category: 'HOME AMBIENCE',
    title: 'Feel It Before You Buy',
    desc: 'Fragrant courtyards, pergola gardens, and textured rugs define an atmosphere you notice the moment you step inside.',
    cta: 'Explore Lifestyle Homes',
    query: 'luxury',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    accent: '#C8A87A',
    label: '06',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hook: detect viewport width for responsive layout
// ─────────────────────────────────────────────────────────────────────────────

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// ─────────────────────────────────────────────────────────────────────────────
// DesktopJourney — native sticky left panel + scrolling right gallery (>=900px)
// ─────────────────────────────────────────────────────────────────────────────

function DesktopJourney() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const panelRefs = useRef([]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }
          const rect = sectionRef.current.getBoundingClientRect();
          const headerOffset = 74; // LOKHA sticky header height
          const totalScrollableHeight = sectionRef.current.offsetHeight - (window.innerHeight - headerOffset);

          if (rect.top <= headerOffset && totalScrollableHeight > 0) {
            const scrolledAmount = headerOffset - rect.top;
            const pct = Math.min(1, Math.max(0, scrolledAmount / totalScrollableHeight));
            setProgress(pct);
          } else if (rect.top > headerOffset) {
            setProgress(0);
          } else {
            setProgress(1);
          }

          // Detect which panel is currently crossing viewport center
          const mid = window.innerHeight / 2;
          let currentVisibleIdx = 0;
          panelRefs.current.forEach((el, i) => {
            if (!el) return;
            const r = el.getBoundingClientRect();
            if (r.top <= mid && r.bottom > mid) {
              currentVisibleIdx = i;
            }
          });
          setActiveIdx(currentVisibleIdx);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const panel = JOURNEY_PANELS[activeIdx];

  return (
    <div ref={sectionRef} style={{ position: 'relative' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          position: 'relative',
          alignItems: 'start',
        }}
      >
        {/* STICKY LEFT */}
        <div
          style={{
            position: 'sticky',
            top: '74px',
            height: 'calc(100vh - 74px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '50px 56px',
            background: 'var(--lokha-surface-warm, #F7F3ED)',
            overflow: 'hidden',
            alignSelf: 'start',
            boxSizing: 'border-box',
          }}
        >
          {/* Decorative background number */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-10px',
              fontSize: '18rem',
              fontWeight: 900,
              lineHeight: 1,
              color: 'rgba(184,149,106,0.06)',
              fontFamily: 'var(--font-serif, Georgia, serif)',
              userSelect: 'none',
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease',
            }}
          >
            {panel.label}
          </div>

          {/* Progress bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '3px',
              height: '100%',
              background: 'rgba(184,149,106,0.15)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: `${progress * 100}%`,
                background: 'var(--lokha-gold, #B8956A)',
                transition: 'height 0.05s linear',
              }}
            />
          </div>

          {/* Panel dots */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              position: 'absolute',
              right: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {JOURNEY_PANELS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activeIdx ? '8px' : '5px',
                  height: i === activeIdx ? '24px' : '5px',
                  borderRadius: '4px',
                  background: i === activeIdx ? 'var(--lokha-gold, #B8956A)' : 'rgba(74,48,36,0.2)',
                  transition: 'all 0.35s ease',
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div
            key={panel.id}
            style={{
              maxWidth: '440px',
              animation: 'lokhaContentFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: panel.accent,
                textTransform: 'uppercase',
                marginBottom: '16px',
                fontFamily: 'var(--font-heading, Inter, sans-serif)',
              }}
            >
              {panel.category}
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-serif, Georgia, serif)',
                fontSize: 'clamp(1.85rem, 2.5vw, 2.45rem)',
                fontWeight: 700,
                color: 'var(--lokha-primary, #2F241F)',
                lineHeight: 1.18,
                marginBottom: '20px',
                letterSpacing: '-0.02em',
              }}
            >
              {panel.title}
            </h3>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--lokha-muted, #7C6B5E)',
                lineHeight: 1.75,
                marginBottom: '32px',
              }}
            >
              {panel.desc}
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'var(--lokha-primary, #2F241F)',
                color: '#F7F1E7',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4A3024';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(47,36,31,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--lokha-primary, #2F241F)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {panel.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* SCROLLING RIGHT */}
        <div>
          {JOURNEY_PANELS.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => (panelRefs.current[i] = el)}
              style={{
                height: 'calc(100vh - 74px)',
                minHeight: '560px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '200px',
                  background: 'linear-gradient(to top, rgba(33,26,23,0.88) 0%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '32px 40px',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: p.accent,
                    textTransform: 'uppercase',
                  }}
                >
                  {p.category}
                </div>
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#F7F1E7',
                    fontFamily: 'var(--font-serif, Georgia, serif)',
                  }}
                >
                  {p.title}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '28px',
                  right: '28px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(6px)',
                  background: 'rgba(0,0,0,0.25)',
                }}
              >
                {p.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MobileJourney — stacked cards for mobile (<900px)
// ─────────────────────────────────────────────────────────────────────────────

function MobileJourney() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {JOURNEY_PANELS.map((p) => (
        <div
          key={p.id}
          style={{ position: 'relative', height: '75vw', minHeight: '300px', overflow: 'hidden' }}
        >
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(33,26,23,0.92) 0%, rgba(33,26,23,0.2) 60%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '24px 20px',
            }}
          >
            <p
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: p.accent,
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              {p.category}
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-serif, Georgia, serif)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#F7F1E7',
                margin: '0 0 10px',
                lineHeight: 1.25,
              }}
            >
              {p.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(247,241,231,0.8)', lineHeight: 1.6, marginBottom: '16px' }}>
              {p.desc}
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: p.accent,
                textDecoration: 'none',
              }}
            >
              {p.cta}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function StickyScroll() {
  const { isAuthenticated } = useAuth();
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 900;

  return (
    <section
      id="interior-journey"
      aria-label="LOKHA Interior Journey"
      style={{ background: 'var(--lokha-surface-warm, #F7F3ED)', position: 'relative' }}
    >
      {/* Section header */}
      <div style={{ padding: '72px 24px 0', textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'var(--lokha-wood, #8A6346)',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          LOKHA · REAL ESTATE · INTERIORS · HOME
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--lokha-primary, #2F241F)',
            lineHeight: 1.15,
            marginBottom: '16px',
            letterSpacing: '-0.025em',
          }}
        >
          Discover Spaces That Feel Like Home
        </h2>
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--lokha-muted, #7C6B5E)',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}
        >
          From raw walls to finished furniture — scroll through the elements that make a house extraordinary.
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '0 24px 36px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'rgba(184,149,106,0.2)' }} />
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'rgba(184,149,106,0.6)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          WALL · WOOD · LIGHT · FURNITURE · ARCHITECTURE · AMBIENCE · HOME
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(184,149,106,0.2)' }} />
      </div>

      {/* Gallery */}
      {isDesktop ? <DesktopJourney /> : <MobileJourney />}

      {/* CTA footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '64px 24px',
          background: 'var(--lokha-primary, #2F241F)',
        }}
      >
        <p
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'var(--lokha-gold, #B8956A)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Begin Your Journey
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
            fontWeight: 700,
            color: '#F7F1E7',
            lineHeight: 1.15,
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          Find Your Perfect Space
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: 'rgba(247,241,231,0.65)',
            maxWidth: '440px',
            margin: '0 auto 36px',
            lineHeight: 1.7,
          }}
        >
          Thousands of verified homes with beautiful interiors, warm architecture, and the neighbourhood context you need.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={isAuthenticated ? '/search' : '/login'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'var(--lokha-gold, #B8956A)',
              color: '#2F241F',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C4A882';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(184,149,106,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--lokha-gold, #B8956A)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Explore All Homes
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to={isAuthenticated ? '/sell' : '/login'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'transparent',
              color: '#F7F1E7',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid rgba(247,241,231,0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(247,241,231,0.6)';
              e.currentTarget.style.background = 'rgba(247,241,231,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(247,241,231,0.25)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            List Your Property
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes lokhaContentFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #interior-journey * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
