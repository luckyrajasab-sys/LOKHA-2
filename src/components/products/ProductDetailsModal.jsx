import React, { useEffect, useState } from 'react';
import { X, Star, ExternalLink, ShieldCheck, CheckCircle2, Truck, ShoppingCart } from 'lucide-react';

const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80';

export default function ProductDetailsModal({ product, onClose }) {
  const [imgSrc, setImgSrc] = useState(product?.image || DEFAULT_PRODUCT_FALLBACK);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savingsAmount = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  return (
    <div className="product-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="product-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="product-modal-close" 
          onClick={onClose}
          aria-label="Close product details"
        >
          <X size={20} />
        </button>

        <div className="product-modal-content">
          {/* Left Media Column */}
          <div>
            <div className="product-modal-media">
              <img
                src={imgSrc}
                alt={product.name}
                onError={() => setImgSrc(DEFAULT_PRODUCT_FALLBACK)}
              />
              {discountPercent > 0 && (
                <span className="product-discount-badge" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#15803D', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Verified Specs
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--lokha-wood)', fontWeight: 600 }}>
                <ShieldCheck size={14} /> Brand Authenticity
              </span>
            </div>
          </div>

          {/* Right Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="product-brand" style={{ fontSize: '0.84rem' }}>{product.brand}</span>
              <span className="badge badge-featured" style={{ fontSize: '0.7rem' }}>{product.category}</span>
            </div>

            <h2 style={{ fontSize: '1.35rem', margin: '0 0 12px', lineHeight: 1.3, color: 'var(--lokha-primary)', fontFamily: 'var(--font-serif)' }}>
              {product.name}
            </h2>

            {/* Ratings Bar */}
            <div className="product-rating-row" style={{ marginBottom: '14px' }}>
              <div className="product-star-pill" style={{ padding: '3px 8px', fontSize: '0.82rem' }}>
                <Star size={13} fill="#FFFFFF" stroke="none" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lokha-muted)' }}>
                Based on {product.ratingCount.toLocaleString('en-IN')} customer reviews
              </span>
            </div>

            {/* Price Box */}
            <div style={{ padding: '14px 16px', background: 'var(--lokha-bg)', borderRadius: '10px', border: '1px solid var(--lokha-border)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--lokha-primary)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={{ fontSize: '0.95rem', color: 'var(--lokha-muted)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {savingsAmount > 0 && (
                  <span style={{ fontSize: '0.8rem', color: '#15803D', fontWeight: 700 }}>
                    Save ₹{savingsAmount.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--lokha-muted)' }}>
                Inclusive of all taxes. Free prime delivery eligibility on marketplaces.
              </p>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--lokha-muted)', margin: '0 0 16px' }}>
              {product.description}
            </p>

            {/* Best For Box */}
            {product.bestFor && (
              <div style={{ background: 'rgba(184, 149, 106, 0.1)', border: '1px solid rgba(184, 149, 106, 0.25)', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--lokha-wood)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '3px' }}>
                  Recommended Application
                </span>
                <span style={{ fontSize: '0.88rem', color: 'var(--lokha-primary)', fontWeight: 600 }}>
                  {product.bestFor}
                </span>
              </div>
            )}

            {/* Compare Shopping Prices Section */}
            <div className="price-comparison-box">
              <h4 className="price-comparison-title">Compare Shopping Marketplaces</h4>
              
              <div className="store-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#E68A00' }}>Amazon India</span>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px' }}>Search Price</span>
                </div>
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-buy-amazon"
                  style={{ padding: '6px 14px' }}
                >
                  <span>Buy on Amazon</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="store-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#2874F0' }}>Flipkart</span>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px' }}>Search Price</span>
                </div>
                <a
                  href={product.flipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-buy-flipkart"
                  style={{ padding: '6px 14px' }}
                >
                  <span>Buy on Flipkart</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <p style={{ fontSize: '0.72rem', color: 'var(--lokha-muted)', margin: 'auto 0 0', textAlign: 'center' }}>
              * Prices and availability are subject to change on merchant storefronts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
