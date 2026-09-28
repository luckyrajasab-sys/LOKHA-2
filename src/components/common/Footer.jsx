import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ContactLokhaModal from './ContactLokhaModal';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            {/* Brand & Tagline Column */}
            <div className="footer-brand-col">
              <Logo inverted={true} />
              <p className="footer-desc">
                India’s modern real-estate technology platform. Helping people discover properties through a simpler, smarter, and location-connected digital experience.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-verified">
                  Verified Discovery
                </span>
                <span className="badge badge-featured">
                  Location Intelligence
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="footer-heading">Navigation</h4>
              <ul className="footer-links-list">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to={isAuthenticated ? "/search" : "/login"} className="footer-link">Properties</Link></li>
                <li><Link to={isAuthenticated ? "/search" : "/login"} className="footer-link">Map Search</Link></li>
                <li><Link to={isAuthenticated ? "/search?purpose=sale" : "/login"} className="footer-link">Buy</Link></li>
                <li><Link to={isAuthenticated ? "/search?purpose=rent" : "/login"} className="footer-link">Rent</Link></li>
                <li><Link to={isAuthenticated ? "/sell" : "/login"} className="footer-link">Sell</Link></li>
                <li><Link to={isAuthenticated ? "/about" : "/login"} className="footer-link">About LOKHA</Link></li>
                <li><Link to="/premium" className="footer-link">Premium & Credits</Link></li>
                <li>
                  <button
                    type="button"
                    onClick={() => isAuthenticated ? setIsContactOpen(true) : navigate('/login')}
                    className="footer-link"
                    style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links-list">
                <li><Link to={isAuthenticated ? "/dashboard" : "/login"} className="footer-link">Help Center</Link></li>
                <li><Link to={isAuthenticated ? "/dashboard" : "/login"} className="footer-link">FAQ</Link></li>
                <li><Link to={isAuthenticated ? "/dashboard" : "/login"} className="footer-link">Safety</Link></li>
                <li><Link to={isAuthenticated ? "/dashboard" : "/login"} className="footer-link">Privacy Policy</Link></li>
                <li><Link to={isAuthenticated ? "/dashboard" : "/login"} className="footer-link">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Founder & Development Column */}
            <div>
              <h4 className="footer-heading">Platform</h4>
              <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '14px' }}>
                Founded and developed by Vishwa. Designed for Indian real-estate discovery.
              </p>
              <Link to={isAuthenticated ? "/about" : "/login"} className="btn btn-outline btn-sm" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)' }}>
                Read Founder Story &rarr;
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} LOKHA. All rights reserved.
            </p>
            <div className="footer-socials">
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1', fontWeight: 500 }}>
                Founded and developed by Vishwa
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Contact Modal */}
      <ContactLokhaModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
