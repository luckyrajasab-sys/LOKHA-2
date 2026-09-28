/**
 * Location Service for Indian Cities, Localities, and Nominatim OpenStreetMap Geocoding
 */

// Popular Indian tech hubs, micro-markets, and landmarks for high-speed offline/instant autocomplete
export const POPULAR_INDIAN_LOCATIONS = [
  // Bengaluru
  { id: 'blr-whitefield', title: 'Whitefield', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru', lat: 12.9698, lng: 77.7499, type: 'locality', tags: ['ITPL', 'Metro Line', 'Tech Park'] },
  { id: 'blr-hsr', title: 'HSR Layout', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru', lat: 12.9121, lng: 77.6446, type: 'locality', tags: ['Startups', 'Sector 1-7'] },
  { id: 'blr-indiranagar', title: 'Indiranagar', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru', lat: 12.9784, lng: 77.6408, type: 'locality', tags: ['100ft Road', 'Metro', 'Nightlife'] },
  { id: 'blr-sarjapur', title: 'Sarjapur Road', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru', lat: 12.9112, lng: 77.6833, type: 'locality', tags: ['Wipro HQ', 'Carmelaram'] },
  { id: 'blr-devenahalli', title: 'Devanahalli & Airport Road', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru', lat: 13.2458, lng: 77.7126, type: 'locality', tags: ['KIA Airport', 'KIADB SEZ'] },
  { id: 'blr-koramangala', title: 'Koramangala', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru', lat: 12.9352, lng: 77.6245, type: 'locality', tags: ['Sony World', 'Nexus Mall'] },
  { id: 'blr-manyata', title: 'Manyata Tech Park (Hebbal)', subtitle: 'Bengaluru, Karnataka', city: 'Bengaluru', lat: 13.0489, lng: 77.6200, type: 'landmark', tags: ['Outer Ring Road', 'Airport Link'] },

  // Mumbai
  { id: 'bom-bandra', title: 'Bandra West (Pali Hill)', subtitle: 'Mumbai, Maharashtra', city: 'Mumbai', lat: 19.0596, lng: 72.8295, type: 'locality', tags: ['Sea Facing', 'Bandra-Worli Link'] },
  { id: 'bom-powai', title: 'Powai (Hiranandani)', subtitle: 'Mumbai, Maharashtra', city: 'Mumbai', lat: 19.1176, lng: 72.9060, type: 'locality', tags: ['Powai Lake', 'IIT Bombay'] },
  { id: 'bom-bkc', title: 'Bandra Kurla Complex (BKC)', subtitle: 'Mumbai, Maharashtra', city: 'Mumbai', lat: 19.0657, lng: 72.8687, type: 'landmark', tags: ['Financial Hub', 'Diamond Bourse'] },
  { id: 'bom-andheri', title: 'Andheri West (Lokhandwala)', subtitle: 'Mumbai, Maharashtra', city: 'Mumbai', lat: 19.1363, lng: 72.8277, type: 'locality', tags: ['Metro Line 1/2', 'Infinity Mall'] },
  { id: 'bom-worli', title: 'Worli Sea Face', subtitle: 'Mumbai, Maharashtra', city: 'Mumbai', lat: 19.0176, lng: 72.8152, type: 'locality', tags: ['Sea Link', 'Luxury Towers'] },

  // Delhi NCR
  { id: 'del-cybercity', title: 'DLF Cyber City (DLF Phase 2)', subtitle: 'Gurugram, Haryana', city: 'Gurugram', lat: 28.4905, lng: 77.0911, type: 'landmark', tags: ['Rapid Metro', 'Cyber Hub'] },
  { id: 'del-golfcourse', title: 'Golf Course Road (Sector 54)', subtitle: 'Gurugram, Haryana', city: 'Gurugram', lat: 28.4595, lng: 77.0266, type: 'locality', tags: ['Luxury Living', 'Aravalli Views'] },
  { id: 'del-noida-exp', title: 'Noida Expressway (Sector 128)', subtitle: 'Noida, Uttar Pradesh', city: 'Noida', lat: 28.5147, lng: 77.3712, type: 'locality', tags: ['Expressway', 'Advant Navis'] },
  { id: 'del-greaternoida', title: 'Jaypee Greens Sports City', subtitle: 'Greater Noida, Uttar Pradesh', city: 'Greater Noida', lat: 28.4682, lng: 77.5042, type: 'locality', tags: ['F1 Track', 'Yamuna Expressway'] },

  // Hyderabad
  { id: 'hyd-gachibowli', title: 'Gachibowli (Financial District)', subtitle: 'Hyderabad, Telangana', city: 'Hyderabad', lat: 17.4401, lng: 78.3489, type: 'locality', tags: ['WaveRock', 'ORR Junction'] },
  { id: 'hyd-hitech', title: 'Hitec City (Madhapur)', subtitle: 'Hyderabad, Telangana', city: 'Hyderabad', lat: 17.4474, lng: 78.3762, type: 'locality', tags: ['Cyber Towers', 'Metro Blue Line'] },
  { id: 'hyd-jubilee', title: 'Jubilee Hills & Banjara Hills', subtitle: 'Hyderabad, Telangana', city: 'Hyderabad', lat: 17.4325, lng: 78.4073, type: 'locality', tags: ['Road No 36', 'KBR Park'] },

  // Pune
  { id: 'pun-koregaon', title: 'Koregaon Park', subtitle: 'Pune, Maharashtra', city: 'Pune', lat: 18.5362, lng: 73.8939, type: 'locality', tags: ['North Main Road', 'Osho Garden'] },
  { id: 'pun-hinjewadi', title: 'Hinjewadi Phase 1 & 2', subtitle: 'Pune, Maharashtra', city: 'Pune', lat: 18.5913, lng: 73.7389, type: 'locality', tags: ['Rajiv Gandhi Infotech', 'Metro Line 3'] },
  { id: 'pun-baner', title: 'Baner & Balewadi High Street', subtitle: 'Pune, Maharashtra', city: 'Pune', lat: 18.5590, lng: 73.7792, type: 'locality', tags: ['Smart City', 'Expressway Exit'] },

  // Chennai
  { id: 'che-omr', title: 'OMR - Old Mahabalipuram Road', subtitle: 'Chennai, Tamil Nadu', city: 'Chennai', lat: 12.9716, lng: 80.2437, type: 'locality', tags: ['IT Corridor', 'TIDEL Park'] },
  { id: 'che-adyar', title: 'Adyar & Besant Nagar', subtitle: 'Chennai, Tamil Nadu', city: 'Chennai', lat: 13.0012, lng: 80.2565, type: 'locality', tags: ['Elliot\'s Beach', 'Theosophical'] }
];

// Simple in-memory cache for geocoding queries
const geocodeCache = new Map();

/**
 * Autocomplete location search: checks instant local database first, then optionally hits Nominatim
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();

  // 1. Search local curated Indian locations (instant, zero network latency)
  const localMatches = POPULAR_INDIAN_LOCATIONS.filter((loc) => {
    return (
      loc.title.toLowerCase().includes(cleanQuery) ||
      loc.subtitle.toLowerCase().includes(cleanQuery) ||
      loc.city.toLowerCase().includes(cleanQuery) ||
      loc.tags.some((tag) => tag.toLowerCase().includes(cleanQuery))
    );
  });

  if (localMatches.length >= 3) {
    return localMatches.slice(0, 8);
  }

  // 2. Query Nominatim for fallback or specific addresses/PIN codes
  if (geocodeCache.has(cleanQuery)) {
    return [...localMatches, ...geocodeCache.get(cleanQuery)].slice(0, 8);
  }

  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query + ', India'
    )}&addressdetails=1&limit=5&countrycodes=in`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(nominatimUrl, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'LOKHA-RealEstate-Discovery/1.0'
      }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const nominatimResults = data.map((item) => ({
        id: `nom-${item.place_id}`,
        title: item.name || item.display_name.split(',')[0],
        subtitle: item.display_name,
        city: item.address?.city || item.address?.state_district || item.address?.state || 'India',
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type || 'place',
        tags: [item.address?.postcode, item.address?.state].filter(Boolean)
      }));

      geocodeCache.set(cleanQuery, nominatimResults);
      return [...localMatches, ...nominatimResults].slice(0, 8);
    }
  } catch {
    // Return local matches if offline or rate limited
  }

  return localMatches;
}

/**
 * Reverse geocode user coordinates into city / locality name
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<{ locality: string, city: string, displayName: string }>}
 */
export async function reverseGeocode(lat, lng) {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'LOKHA-RealEstate-Discovery/1.0'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const result = {
        locality: addr.suburb || addr.neighbourhood || addr.residential || addr.road || 'Current Location',
        city: addr.city || addr.town || addr.county || addr.state || 'India',
        state: addr.state || '',
        displayName: data.display_name
      };
      geocodeCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('Reverse geocode failed:', err);
  }

  return { locality: 'Current Location', city: 'Nearby', state: '', displayName: 'Your Current Area' };
}
