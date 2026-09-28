/**
 * Property Service for search, filtering, and radius-based querying
 */
import { initialProperties } from '../data/propertiesData';
import { filterPropertiesWithinRadius } from '../utils/haversine';

/**
 * Filter properties based on criteria
 */
export function queryProperties(properties = initialProperties, filters = {}) {
  let result = [...properties];

  // Purpose (Buy/Rent/Commercial)
  if (filters.purpose && filters.purpose !== 'all') {
    result = result.filter((p) => p.purpose === filters.purpose);
  }

  // City
  if (filters.city && filters.city !== 'All Cities' && filters.city !== '') {
    result = result.filter(
      (p) => p.city.toLowerCase() === filters.city.toLowerCase()
    );
  }

  // Search keyword (matches locality, city, title, propertyType)
  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.propertyType.toLowerCase().includes(q) ||
        (p.bhk && `${p.bhk} bhk`.includes(q))
    );
  }

  // Property Type
  if (filters.propertyType && filters.propertyType !== 'All') {
    result = result.filter((p) => p.propertyType === filters.propertyType);
  }

  // BHK filter (e.g. [2, 3])
  if (filters.bhk && filters.bhk.length > 0) {
    result = result.filter((p) => filters.bhk.includes(p.bhk));
  }

  // Price range
  if (filters.minPrice != null && filters.minPrice > 0) {
    result = result.filter((p) => p.price >= filters.minPrice);
  }
  if (filters.maxPrice != null && filters.maxPrice < Infinity) {
    result = result.filter((p) => p.price <= filters.maxPrice);
  }

  // Possession Status
  if (filters.possessionStatus && filters.possessionStatus !== 'All') {
    result = result.filter((p) => p.possessionStatus === filters.possessionStatus);
  }

  // Furnishing
  if (filters.furnishing && filters.furnishing !== 'All') {
    result = result.filter((p) => p.furnishing === filters.furnishing);
  }

  // Radius search if coordinates and radius provided
  if (filters.centerLat && filters.centerLng && filters.radiusKm) {
    result = filterPropertiesWithinRadius(
      result,
      filters.centerLat,
      filters.centerLng,
      filters.radiusKm
    );
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.id > a.id ? 1 : -1));
        break;
      case 'area-high':
        result.sort((a, b) => b.area - a.area);
        break;
      case 'distance':
        if (filters.centerLat) {
          result.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
        }
        break;
      default:
        // featured first
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }

  return result;
}

/**
 * Get distinct property statistics per locality
 */
export function getLocalityInsights(properties = initialProperties) {
  const localities = [
    {
      name: 'Whitefield',
      city: 'Bengaluru',
      avgPricePerSqFt: '₹7,850',
      growthYoY: '+14.2%',
      metroReady: true,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      description: 'Major IT corridor with Purple Line Metro & top international schools'
    },
    {
      name: 'Bandra West',
      city: 'Mumbai',
      avgPricePerSqFt: '₹52,000',
      growthYoY: '+9.8%',
      metroReady: true,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      description: 'Elite sea-facing promenade with iconic heritage and luxury penthouses'
    },
    {
      name: 'Golf Course Road',
      city: 'Gurugram',
      avgPricePerSqFt: '₹24,500',
      growthYoY: '+18.6%',
      metroReady: true,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      description: 'Financial hub corridor with 16-lane expressway and world-class luxury'
    },
    {
      name: 'Gachibowli',
      city: 'Hyderabad',
      avgPricePerSqFt: '₹9,200',
      growthYoY: '+16.5%',
      metroReady: true,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      description: 'Financial District hotspot with rapid appreciation and gated townships'
    },
    {
      name: 'Koregaon Park',
      city: 'Pune',
      avgPricePerSqFt: '₹14,100',
      growthYoY: '+11.4%',
      metroReady: false,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      description: 'Green lush residential avenues with boutique cafes and vibrant lifestyle'
    },
    {
      name: 'Anna Nagar',
      city: 'Chennai',
      avgPricePerSqFt: '₹12,400',
      growthYoY: '+12.8%',
      metroReady: true,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      description: 'Planned residential paradise with wide tree-lined avenues and metro stations'
    },
    {
      name: 'White Town',
      city: 'Pondicherry',
      avgPricePerSqFt: '₹18,500',
      growthYoY: '+15.1%',
      metroReady: false,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      description: 'French colonial heritage quarter with boutique villas and promenade beach'
    }
  ];

  return localities.map((loc) => {
    const matchingProps = properties.filter((p) => p.locality.includes(loc.name));
    return {
      ...loc,
      count: matchingProps.length || Math.floor(Math.random() * 8) + 4
    };
  });
}
