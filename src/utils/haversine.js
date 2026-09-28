/**
 * Haversine formula for calculating great-circle distance between two points on Earth
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates distance between two coordinates in kilometers
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in kilometers
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Format distance for user display (e.g. "450 m" or "2.4 km")
 * @param {number} km
 * @returns {string}
 */
export function formatDistance(km) {
  if (km == null || isNaN(km)) return '';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Filter properties within a given radius in km from center
 * @param {Array} properties
 * @param {number} centerLat
 * @param {number} centerLng
 * @param {number} radiusKm
 * @returns {Array} properties with added `distanceKm` and `distanceText` fields, sorted by distance
 */
export function filterPropertiesWithinRadius(properties, centerLat, centerLng, radiusKm) {
  if (!centerLat || !centerLng || !radiusKm) return properties;

  return properties
    .map((prop) => {
      const lat = prop.mapCoords?.lat ?? prop.latitude;
      const lng = prop.mapCoords?.lng ?? prop.longitude;
      if (lat == null || lng == null) return { ...prop, distanceKm: null };

      const dist = calculateDistanceKm(centerLat, centerLng, lat, lng);
      return {
        ...prop,
        distanceKm: dist,
        distanceText: formatDistance(dist)
      };
    })
    .filter((prop) => prop.distanceKm !== null && prop.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
