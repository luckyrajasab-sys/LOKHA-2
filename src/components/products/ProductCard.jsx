import React, { useState } from 'react';
import { Star, ExternalLink, Sparkles, Tag } from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({ product, onSelectProduct }) {
  const [imgSrc, setImgSrc] = useState(product.image || DEFAULT_PRODUCT_FALLBACK);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formattedRatingCount = product.ratingCount >= 1000
    ? (product.ratingCount / 1000).toFixed(1).replace('.0', '') + 'k'
    : product.ratingCount.toLocaleString('en-IN');

  const handleCardClick = (e) => {
    // If the click is on an Amazon/Flipkart button, do not open modal
    if (e.target.closest('.btn-buy-amazon, .btn-buy-flipkart')) {
      return;
    }
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <article 
      className="product-card" 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(e); }}
      aria-label={`View details for ${product.name}`}
    >
      {/* Media & Badges */}
      <div className="product-card-media">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImgSrc(DEFAULT_PRODUCT_FALLBACK)}
        />
        {discountPercent > 0 && (
          <span className="product-discount-badge">
            {discountPercent}% OFF
          </span>
        )}
        <span className="product-category-tag">
          {product.category}
        </span>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        {/* Rating Row */}
        <div className="product-rating-row">
          <div className="product-star-pill">
            <Star size={11} fill="#FFFFFF" stroke="none" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="product-rating-count">
            ({product.ratingCount.toLocaleString('en-IN')} ratings)
          </span>
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="product-current-price">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-original-price">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Best For Tagline */}
        {product.bestFor && (
          <div className="product-bestfor" title={product.bestFor}>
            <strong>Best for:</strong> {product.bestFor}
          </div>
        )}

        {/* Action Buy Buttons */}
        <div className="product-actions-row">
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-buy-amazon"
            title={`Buy ${product.name} on Amazon`}
            onClick={(e) => e.stopPropagation()}
          >
            <span>Amazon</span>
            <ExternalLink size={12} />
          </a>
          <a
            href={product.flipkartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-buy-flipkart"
            title={`Buy ${product.name} on Flipkart`}
            onClick={(e) => e.stopPropagation()}
          >
            <span>Flipkart</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}
