import { 
  PRODUCTS, 
  PRODUCT_CATEGORIES, 
  CATEGORY_TILES,
  CATEGORY_HERO_INFO,
  RATING_FILTER_OPTIONS, 
  REVIEW_VOLUME_OPTIONS, 
  PRICE_RANGE_OPTIONS, 
  SORT_OPTIONS 
} from '../data/products.js';

/**
 * Product Service Layer
 * 
 * Provides an extensible data access abstraction for Lokha's Home Essentials.
 * Currently backed by the high-quality local dataset; prepared for transparent
 * migration to a backend API or Firebase `products/` node.
 */

export const productService = {
  /**
   * Retrieve all products with optional filters, search, and sorting
   */
  async getProducts(filters = {}) {
    const {
      category = 'All',
      brand = 'All',
      minRating = 0,
      minReviews = 0,
      priceMin = 0,
      priceMax = Infinity,
      search = '',
      sort = 'recommended'
    } = filters;

    // Simulate minor network async latency for smooth UX transitions
    await new Promise((resolve) => setTimeout(resolve, 60));

    let result = [...PRODUCTS];

    // Category filter
    if (category && category !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Brand filter
    if (brand && brand !== 'All') {
      result = result.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    // Min rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Min reviews filter
    if (minReviews > 0) {
      result = result.filter((p) => p.ratingCount >= minReviews);
    }

    // Price range filter
    if (priceMin > 0 || priceMax < Infinity) {
      result = result.filter((p) => p.price >= priceMin && p.price <= priceMax);
    }

    // Search query filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.bestFor && p.bestFor.toLowerCase().includes(q))
        );
      });
    }

    // Sorting
    switch (sort) {
      case 'rating_high':
        result.sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
        break;
      case 'reviews_high':
        result.sort((a, b) => b.ratingCount - a.ratingCount);
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount_high':
        result.sort((a, b) => {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        });
        break;
      case 'recommended':
      default:
        // Score based on rating * log10(reviews) to surface trusted favourites
        result.sort((a, b) => {
          const scoreA = a.rating * Math.log10(Math.max(a.ratingCount, 10));
          const scoreB = b.rating * Math.log10(Math.max(b.ratingCount, 10));
          return scoreB - scoreA;
        });
        break;
    }

    return result;
  },

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  },

  /**
   * Get top highlight collections for the top section
   */
  getTopCollections() {
    const popular = [...PRODUCTS]
      .filter((p) => p.rating >= 4.0 && p.ratingCount >= 10000)
      .sort((a, b) => b.ratingCount - a.ratingCount)
      .slice(0, 4);

    const highlyRated = [...PRODUCTS]
      .filter((p) => p.rating >= 4.4 && p.ratingCount >= 5000)
      .sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount)
      .slice(0, 4);

    const bestValue = [...PRODUCTS]
      .filter((p) => p.originalPrice && p.originalPrice > p.price)
      .sort((a, b) => {
        const discA = (a.originalPrice - a.price) / a.originalPrice;
        const discB = (b.originalPrice - b.price) / b.originalPrice;
        return discB - discA;
      })
      .slice(0, 4);

    return { popular, highlyRated, bestValue };
  },

  getCategories() {
    return PRODUCT_CATEGORIES;
  },

  getRatingOptions() {
    return RATING_FILTER_OPTIONS;
  },

  getReviewOptions() {
    return REVIEW_VOLUME_OPTIONS;
  },

  getPriceOptions() {
    return PRICE_RANGE_OPTIONS;
  },

  getSortOptions() {
    return SORT_OPTIONS;
  },

  getCategoryTiles() {
    return CATEGORY_TILES;
  },

  getCategoryHeroInfo(category = 'All') {
    return CATEGORY_HERO_INFO[category] || CATEGORY_HERO_INFO['All'];
  },

  getBrands(category = 'All') {
    let pool = PRODUCTS;
    if (category && category !== 'All') {
      pool = pool.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    const brandsSet = new Set(pool.map((p) => p.brand).filter(Boolean));
    return ['All Brands', ...Array.from(brandsSet).sort()];
  }
};
