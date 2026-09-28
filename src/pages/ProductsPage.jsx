import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Flame, 
  BadgePercent, 
  SlidersHorizontal, 
  RotateCcw,
  ShoppingBag,
  Layers,
  ArrowRight
} from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import ScrollReveal from '../components/common/ScrollReveal';
import { productService } from '../services/productService';
import '../styles/products.css';

const PAGE_SIZE = 16;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All Brands');
  const [subcategory, setSubcategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [minReviews, setMinReviews] = useState(0);
  const [priceRangeIndex, setPriceRangeIndex] = useState(0);
  const [sort, setSort] = useState('recommended');
  const [activeCollectionTab, setActiveCollectionTab] = useState('all');

  const productsGridRef = useRef(null);

  const categories = useMemo(() => productService.getCategories(), []);
  const categoryTiles = useMemo(() => productService.getCategoryTiles(), []);
  const ratingOptions = useMemo(() => productService.getRatingOptions(), []);
  const reviewOptions = useMemo(() => productService.getReviewOptions(), []);
  const priceOptions = useMemo(() => productService.getPriceOptions(), []);
  const sortOptions = useMemo(() => productService.getSortOptions(), []);
  const brands = useMemo(() => productService.getBrands(category), [category]);
  const heroInfo = useMemo(() => productService.getCategoryHeroInfo(category), [category]);

  // Extract available subcategories for the current category
  const availableSubcategories = useMemo(() => {
    if (category === 'All') return [];
    // We can query products of this category to get distinct subcategories
    const relevant = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    const subs = Array.from(new Set(relevant.map((p) => p.subcategory).filter(Boolean)));
    return subs.length > 1 ? ['All', ...subs] : [];
  }, [category, products]);

  // Reset brand & subcategory if category changes and the selected brand/subcategory isn't in it
  useEffect(() => {
    setSubcategory('All');
    setBrand('All Brands');
  }, [category]);

  // Fetch products whenever filters or search change
  useEffect(() => {
    let isMounted = true;
    const fetchFilteredProducts = async () => {
      setLoading(true);
      const activePrice = priceOptions[priceRangeIndex] || { min: 0, max: Infinity };
      
      const res = await productService.getProducts({
        category,
        brand: brand === 'All Brands' ? 'All' : brand,
        minRating,
        minReviews,
        priceMin: activePrice.min,
        priceMax: activePrice.max,
        search,
        sort
      });

      // Secondary client filter for subcategory if selected
      let finalRes = res;
      if (subcategory && subcategory !== 'All') {
        finalRes = finalRes.filter(
          (p) => p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase()
        );
      }

      if (isMounted) {
        setProducts(finalRes);
        setVisibleCount(PAGE_SIZE);
        setLoading(false);
      }
    };

    fetchFilteredProducts();
    return () => {
      isMounted = false;
    };
  }, [category, brand, subcategory, minRating, minReviews, priceRangeIndex, search, sort, priceOptions]);

  // Handle Quick Collection Tabs
  const handleCollectionSelect = (tabKey) => {
    setActiveCollectionTab(tabKey);
    switch (tabKey) {
      case 'popular':
        setCategory('All');
        setBrand('All Brands');
        setSubcategory('All');
        setMinRating(4.0);
        setMinReviews(10000);
        setSort('reviews_high');
        break;
      case 'highly_rated':
        setCategory('All');
        setBrand('All Brands');
        setSubcategory('All');
        setMinRating(4.5);
        setMinReviews(1000);
        setSort('rating_high');
        break;
      case 'most_reviewed':
        setCategory('All');
        setBrand('All Brands');
        setSubcategory('All');
        setMinRating(0);
        setMinReviews(5000);
        setSort('reviews_high');
        break;
      case 'best_value':
        setCategory('All');
        setBrand('All Brands');
        setSubcategory('All');
        setMinRating(4.2);
        setMinReviews(0);
        setSort('discount_high');
        break;
      case 'all':
      default:
        resetAllFilters();
        break;
    }
  };

  const handleTileClick = (catName) => {
    setCategory(catName);
    setActiveCollectionTab('all');
    if (productsGridRef.current) {
      productsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetAllFilters = () => {
    setSearch('');
    setCategory('All');
    setBrand('All Brands');
    setSubcategory('All');
    setMinRating(0);
    setMinReviews(0);
    setPriceRangeIndex(0);
    setSort('recommended');
    setActiveCollectionTab('all');
  };

  const hasActiveFilters = 
    search.trim() !== '' || 
    category !== 'All' || 
    brand !== 'All Brands' ||
    subcategory !== 'All' ||
    minRating > 0 || 
    minReviews > 0 || 
    priceRangeIndex > 0 || 
    sort !== 'recommended';

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="products-page">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="products-hero" aria-label="Home Essentials Header">
        <div className="container">
          <ScrollReveal direction="down" duration={0.5}>
            <div className="products-hero-badge">
              <Sparkles size={14} color="var(--lokha-gold)" />
              <span>{heroInfo.badge || 'Lokha Curated Home Essentials'}</span>
            </div>
            <h1 className="products-hero-title">
              {category === 'All' ? 'Recommended Home Products' : heroInfo.title}
            </h1>
            <p className="products-hero-subtitle">
              {category === 'All' 
                ? 'Furnish a home → Equip a home → Decorate a home → Personalize a home.'
                : heroInfo.subtitle}
            </p>

            {/* Quick Collections Filter Tabs */}
            <div className="top-collections-tabs" role="tablist" aria-label="Product highlights">
              <button
                type="button"
                className={`collection-chip-btn ${activeCollectionTab === 'all' && category === 'All' ? 'active' : ''}`}
                onClick={() => handleCollectionSelect('all')}
              >
                <span>All Products</span>
              </button>
              <button
                type="button"
                className={`collection-chip-btn ${activeCollectionTab === 'popular' ? 'active' : ''}`}
                onClick={() => handleCollectionSelect('popular')}
              >
                <Flame size={14} color="#EA580C" />
                <span>Popular Products</span>
              </button>
              <button
                type="button"
                className={`collection-chip-btn ${activeCollectionTab === 'highly_rated' ? 'active' : ''}`}
                onClick={() => handleCollectionSelect('highly_rated')}
              >
                <Star size={14} color="#EAB308" />
                <span>Highly Rated (4.5★+)</span>
              </button>
              <button
                type="button"
                className={`collection-chip-btn ${activeCollectionTab === 'most_reviewed' ? 'active' : ''}`}
                onClick={() => handleCollectionSelect('most_reviewed')}
              >
                <TrendingUp size={14} color="#0284C7" />
                <span>Most Reviewed</span>
              </button>
              <button
                type="button"
                className={`collection-chip-btn ${activeCollectionTab === 'best_value' ? 'active' : ''}`}
                onClick={() => handleCollectionSelect('best_value')}
              >
                <BadgePercent size={14} color="#16A34A" />
                <span>Best Value Discounts</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SECTION 20: CATEGORY VISUAL TILES ────────────────────────── */}
      <section className="category-tiles-section" aria-label="Explore Home Essentials Categories">
        <div className="container">
          <div className="category-tiles-header">
            <div>
              <span className="category-tiles-kicker">Curated Collections</span>
              <h2 className="category-tiles-title">Explore Home Essentials</h2>
            </div>
            <span className="category-tiles-count">{categoryTiles.length} Showroom Categories</span>
          </div>

          <div className="category-tiles-scroll-wrap">
            <div className="category-tiles-grid">
              {categoryTiles.map((tile) => {
                const isSelected = category.toLowerCase() === tile.name.toLowerCase();
                return (
                  <div
                    key={tile.id}
                    className={`category-tile-card ${isSelected ? 'is-active' : ''}`}
                    onClick={() => handleTileClick(tile.name)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleTileClick(tile.name); }}
                    aria-label={`Browse ${tile.name}`}
                  >
                    <div className="category-tile-img-wrap">
                      <img src={tile.image} alt={tile.name} loading="lazy" />
                      <div className="category-tile-overlay" />
                      <span className="category-tile-pill">{tile.itemCount}</span>
                    </div>
                    <div className="category-tile-info">
                      <h3 className="category-tile-name">{tile.name}</h3>
                      <p className="category-tile-tagline">{tile.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 19: DYNAMIC CATEGORY HERO BANNER (when selected) ─ */}
      {category !== 'All' && (
        <section className="selected-category-banner" aria-label="Selected Category Spotlight">
          <div className="container">
            <div className="selected-category-banner-inner">
              <div className="selected-category-banner-text">
                <span className="selected-category-banner-badge">
                  <Sparkles size={13} /> {heroInfo.badge}
                </span>
                <h2 className="selected-category-banner-title">{category.toUpperCase()}</h2>
                <p className="selected-category-banner-desc">{heroInfo.subtitle}</p>
              </div>
              <div className="selected-category-banner-action">
                <button
                  type="button"
                  className="btn btn-showroom-browse"
                  onClick={() => {
                    if (productsGridRef.current) {
                      productsGridRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span>Browse {category}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CONTROLS & FILTER SECTION ──────────────────────────────── */}
      <div className="container" ref={productsGridRef}>
        <div className="products-controls-bar">
          {/* Top Search & Sort Row */}
          <div className="products-search-row">
            <div className="products-search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="products-search-input"
                placeholder="Search refrigerator, coffee table, mattress, blackout curtain, brass idol, aroma diffuser..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search home essentials"
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearch('')}
                  aria-label="Clear search query"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="sort-select-wrap">
              <label htmlFor="product-sort-select" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--lokha-muted)', whiteSpace: 'nowrap' }}>
                Sort By:
              </label>
              <select
                id="product-sort-select"
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 15: Horizontal Category Navigation */}
          <div className="category-pills-row" role="tablist" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${category.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Subcategory Helper Chips (Section 3, 4, 5, 7, 8) */}
          {availableSubcategories.length > 0 && (
            <div className="subcategory-chips-bar" aria-label="Filter by type">
              <span className="subcategory-label">
                <Layers size={13} /> {category} Types:
              </span>
              <div className="subcategory-chips-list">
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    className={`subcategory-chip-btn ${subcategory === sub ? 'is-active' : ''}`}
                    onClick={() => setSubcategory(sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Dropdowns Row (Section 17) */}
          <div className="filter-dropdowns-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--lokha-wood)' }}>
              <SlidersHorizontal size={14} />
              <span>Filters:</span>
            </div>

            {/* Brand Filter (Section 17) */}
            <select
              className="filter-select"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              aria-label="Filter by brand"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Rating Filter (Section 17: 4.0+, 4.2+, 4.5+) */}
            <select
              className="filter-select"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              aria-label="Filter by minimum rating"
            >
              {ratingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Review Count Filter */}
            <select
              className="filter-select"
              value={minReviews}
              onChange={(e) => setMinReviews(Number(e.target.value))}
              aria-label="Filter by review volume"
            >
              {reviewOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Price Range Filter (Section 17) */}
            <select
              className="filter-select"
              value={priceRangeIndex}
              onChange={(e) => setPriceRangeIndex(Number(e.target.value))}
              aria-label="Filter by price range"
            >
              {priceOptions.map((opt, idx) => (
                <option key={opt.label} value={idx}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                type="button"
                className="filter-reset-btn"
                onClick={resetAllFilters}
                aria-label="Reset all filters"
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="products-results-header">
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--lokha-muted)', fontWeight: 600 }}>
            Showing <strong style={{ color: 'var(--lokha-primary)' }}>{visibleProducts.length}</strong> of <strong style={{ color: 'var(--lokha-primary)' }}>{products.length}</strong> verified showroom items
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {category !== 'All' && (
              <span className="badge badge-featured">
                Category: {category}
              </span>
            )}
            {brand !== 'All Brands' && (
              <span className="badge badge-verified">
                Brand: {brand}
              </span>
            )}
            {subcategory !== 'All' && (
              <span className="badge badge-featured" style={{ background: 'rgba(184,149,106,0.15)', color: 'var(--lokha-wood)' }}>
                Type: {subcategory}
              </span>
            )}
          </div>
        </div>

        {/* ── PRODUCTS GRID (Section 18 & 23: Luxury Showroom Cards) ─── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--lokha-muted)', fontSize: '0.92rem' }}>
              Curating recommended home showroom essentials...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="products-empty-card">
            <ShoppingBag size={48} color="var(--lokha-muted)" style={{ opacity: 0.5, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--lokha-primary)' }}>
              No matching products found
            </h3>
            <p style={{ color: 'var(--lokha-muted)', maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.9rem', lineHeight: 1.6 }}>
              We couldn't find items matching your current filters in <strong>{category}</strong>. Try clearing filters or exploring another showroom collection.
            </p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={resetAllFilters}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < products.length && (
              <div className="load-more-container">
                <button
                  type="button"
                  className="btn-load-more"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                >
                  Load More Products ({products.length - visibleCount} remaining)
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--lokha-muted)' }}>
                  Displaying {visibleCount} of {products.length} verified listings
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── PRODUCT DETAILS MODAL ──────────────────────────────────── */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
