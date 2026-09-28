/**
 * Overpass API Service to fetch real-world amenities around any latitude/longitude
 */

const overpassCache = new Map();

/**
 * Fetch nearby points of interest (Schools, Hospitals, Transit, Shopping, Parks)
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusMeters Default 3000m (3km)
 * @returns {Promise<Array<{ name: string, type: string, distance: string, distanceMeters: number }>>}
 */
export async function fetchNearbyAmenities(lat, lng, radiusMeters = 3000) {
  if (!lat || !lng) return [];

  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)},${radiusMeters}`;
  if (overpassCache.has(cacheKey)) {
    return overpassCache.get(cacheKey);
  }

  // Construct Overpass QL query for essential residential POIs
  const query = `
    [out:json][timeout:5];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="school"](around:${radiusMeters},${lat},${lng});
      node["railway"="subway_entrance"](around:${radiusMeters},${lat},${lng});
      node["railway"="station"](around:${radiusMeters},${lat},${lng});
      node["shop"="mall"](around:${radiusMeters},${lat},${lng});
      node["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
    );
    out body 12;
  `;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && data.elements && data.elements.length > 0) {
        const results = data.elements
          .filter((el) => el.tags && (el.tags.name || el.tags['name:en']))
          .map((el) => {
            const name = el.tags.name || el.tags['name:en'];
            let type = 'Landmark';
            if (el.tags.amenity === 'hospital') type = 'Hospital';
            else if (el.tags.amenity === 'school') type = 'School';
            else if (el.tags.railway) type = 'Metro';
            else if (el.tags.shop === 'mall') type = 'Shopping';
            else if (el.tags.shop === 'supermarket') type = 'Grocery';

            // Calculate rough distance
            const dLat = (el.lat - lat) * 111;
            const dLng = (el.lon - lng) * 111 * Math.cos((lat * Math.PI) / 180);
            const distKm = Math.sqrt(dLat * dLat + dLng * dLng);

            return {
              name,
              type,
              distance: distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`,
              distanceKm: distKm
            };
          })
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 6);

        if (results.length > 0) {
          overpassCache.set(cacheKey, results);
          return results;
        }
      }
    }
  } catch {
    // Graceful fallback to default/simulated points
  }

  return [];
}
