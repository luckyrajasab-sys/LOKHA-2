/**
 * LOKHA Firebase Service
 * Integrates with Firebase Realtime Database & Storage.
 *
 * Architecture:
 * - Uses existing/configured Firebase credentials if present in Vite environment.
 * - Provides seamless real-time pub-sub with BroadcastChannel & storage synchronization
 *   so the application works out-of-the-box in dev/preview while being 100% Firebase-ready.
 * - Stores data cleanly under:
 *     properties/
 *       propertyId/
 *         title, type, listingType, price, location, latitude, longitude,
 *         images, bedrooms, bathrooms, area, amenities, owner, status,
 *         createdAt, updatedAt
 */

import {
  ref,
  onValue,
  set,
  update,
  remove,
  get,
  child
} from 'firebase/database';
import { app as firebaseApp, db as firebaseDb, firebaseConfig } from './firebase.js';
import { SEED_PROPERTIES } from '../data/seedProperties.js';

const STORAGE_KEY = 'lokha_firebase_properties';
const SEED_VERSION_KEY = 'lokha_seed_version';
const CURRENT_SEED_VERSION = '2.2'; // Bumped for 150+ realistic listings

const isRealFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  (firebaseConfig.databaseURL || firebaseConfig.projectId)
);

// Multi-tab real-time event bus
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('lokha_realtime_properties');
  } catch {
    broadcastChannel = null;
  }
}

// In-memory subscribers
const subscribers = new Set();

function notifySubscribers(properties) {
  subscribers.forEach((callback) => {
    try {
      callback(properties);
    } catch (err) {
      console.error('[LOKHA Firebase] Listener notification error:', err);
    }
  });
}

// Read raw properties map from local persistent storage
function getLocalPropertiesMap() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('[LOKHA Firebase] Failed to parse local properties storage:', err);
    return {};
  }
}

// Save raw properties map to local persistent storage
function saveLocalPropertiesMap(map) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('[LOKHA Firebase] Failed to save properties map to storage:', err);
  }
}

// Convert map to sorted array
function mapToArray(map) {
  return Object.values(map || {}).sort((a, b) => {
    // Featured first, then newest
    if ((b.featured ? 1 : 0) !== (a.featured ? 1 : 0)) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

/**
 * Standardize property document into clean schema
 */
export function formatPropertyDoc(input) {
  const lat = input.latitude ?? input.mapCoords?.lat ?? 12.9716;
  const lng = input.longitude ?? input.mapCoords?.lng ?? 77.5946;

  const country = input.location?.country || input.country || 'India';
  const state = input.location?.state || input.state || '';
  const city = input.location?.city || input.city || 'Bengaluru';
  const locality = input.location?.locality || input.locality || '';
  const fullAddress = input.location?.fullAddress || input.fullAddress || `${locality}, ${city}`;
  const pincode = input.location?.pincode || input.pincode || '';

  const propertyType = input.propertyType || input.type || 'Apartment';
  const purpose = input.purpose || input.listingType || 'sale';
  const bhk = input.bhk ?? input.bedrooms ?? 0;
  const bathrooms = input.bathrooms ?? 1;
  const area = input.area || 1000;
  const price = input.price || 0;

  // Safe fallback images matching property type
  const fallbackImg = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
  let images = Array.isArray(input.images) && input.images.length > 0 ? input.images : [fallbackImg];

  return {
    id: input.id || `lokha-custom-${Date.now()}`,
    ownerUid: input.ownerUid || input.createdBy || null,
    createdBy: input.createdBy || input.ownerUid || null,
    creatorEmail: input.creatorEmail || null,
    title: input.title || `${bhk ? bhk + ' BHK ' : ''}${propertyType} in ${locality}`,
    type: propertyType,
    propertyType: propertyType,
    listingType: purpose,
    purpose: purpose,
    price: Number(price),
    maintenance: input.maintenance ? Number(input.maintenance) : Math.round(area * 2),
    bedrooms: Number(bhk),
    bhk: Number(bhk),
    bathrooms: Number(bathrooms),
    parking: input.parking != null ? Number(input.parking) : 1,
    area: Number(area),
    possessionStatus: input.possessionStatus || 'Ready to Move',
    status: input.status || 'Available', // 'Available' | 'Sold' | 'Rented'
    furnishing: input.furnishing || 'Semi-Furnished',
    floor: input.floor || '2nd Floor',
    facing: input.facing || 'East Facing',
    latitude: Number(lat),
    longitude: Number(lng),
    mapCoords: {
      lat: Number(lat),
      lng: Number(lng),
      x: input.mapCoords?.x ?? 50,
      y: input.mapCoords?.y ?? 50
    },
    location: {
      country,
      state,
      city,
      locality,
      fullAddress,
      pincode,
      latitude: Number(lat),
      longitude: Number(lng)
    },
    country,
    state,
    city,
    locality,
    fullAddress,
    pincode,
    images,
    overview: input.overview || input.description || `Exquisite ${propertyType} in ${locality}, ${city}. Verified on LOKHA real estate marketplace.`,
    amenities: Array.isArray(input.amenities) ? input.amenities : ['24/7 Security', 'Power Backup', 'Lift', 'Parking'],
    owner: input.owner || {
      name: input.ownerName || 'Verified Owner',
      type: 'Verified Owner',
      phone: input.ownerPhone || '+91 98450 12890',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      responseTime: 'Responds within 30 minutes'
    },
    agent: input.agent || input.owner || {
      name: 'LOKHA Direct Concierge',
      type: 'Verified Partner',
      phone: '+91 98450 12890',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      responseTime: 'Responds within 15 minutes'
    },
    postedBy: input.postedBy || 'Owner',
    postedTime: input.postedTime || 'Just now',
    verified: input.verified !== undefined ? Boolean(input.verified) : true,
    featured: Boolean(input.featured),
    isSeed: Boolean(input.isSeed),
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Initialize or seed the database with initial 150+ realistic properties
 * Deterministic and safe to run multiple times without duplicating!
 */
export async function seedPropertiesDatabase(force = false) {
  const currentVersion = localStorage.getItem(SEED_VERSION_KEY);
  const existingMap = getLocalPropertiesMap();
  const existingCount = Object.keys(existingMap).length;

  if (!force && currentVersion === CURRENT_SEED_VERSION && existingCount >= 100) {
    return {
      success: true,
      seeded: 0,
      total: existingCount,
      message: 'Database is already up to date.'
    };
  }

  console.log(`[LOKHA Firebase] Seeding ${SEED_PROPERTIES.length} realistic properties...`);

  // Preserve user-created listings, replace/populate seed listings
  const updatedMap = { ...existingMap };

  let seededCount = 0;
  SEED_PROPERTIES.forEach((prop) => {
    // Only insert if missing or if forced reseed of demo properties
    if (force || !updatedMap[prop.id] || updatedMap[prop.id].isSeed) {
      updatedMap[prop.id] = formatPropertyDoc(prop);
      seededCount++;
    }
  });

  saveLocalPropertiesMap(updatedMap);
  localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);

  // If connected to live Firebase Realtime Database, sync to ref('properties')
  if (firebaseDb) {
    try {
      const propertiesRef = ref(firebaseDb, 'properties');
      await set(propertiesRef, updatedMap);
      console.log('[LOKHA Firebase] Synced seed data to live Firebase Realtime Database.');
    } catch (err) {
      console.warn('[LOKHA Firebase] Error syncing seed to live Firebase:', err);
    }
  }

  // Notify listeners and broadcast
  const propertiesArray = mapToArray(updatedMap);
  notifySubscribers(propertiesArray);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'SYNC_PROPERTIES', count: propertiesArray.length });
  }

  return {
    success: true,
    seeded: seededCount,
    total: Object.keys(updatedMap).length,
    message: `Successfully seeded ${seededCount} properties into LOKHA.`
  };
}

/**
 * Subscribe to properties in real time
 * When any property is added, updated, marked as sold/rented, or deleted,
 * the callback is immediately triggered.
 *
 * @param {Function} callback (properties: Array) => void
 * @returns {Function} unsubscribe function
 */
export function subscribeToProperties(callback) {
  subscribers.add(callback);

  // Ensure initial seed if database is empty
  const localMap = getLocalPropertiesMap();
  if (Object.keys(localMap).length === 0) {
    seedPropertiesDatabase(false);
  } else {
    // Immediately emit current data
    callback(mapToArray(localMap));
  }

  // Realtime Database listener if Firebase is live
  let liveFirebaseUnsubscribe = null;
  if (firebaseDb) {
    try {
      const propertiesRef = ref(firebaseDb, 'properties');
      liveFirebaseUnsubscribe = onValue(
        propertiesRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            saveLocalPropertiesMap(val);
            const arr = mapToArray(val);
            callback(arr);
          }
        },
        (error) => {
          console.warn('[LOKHA Firebase] Realtime Database error, using local state:', error);
        }
      );
    } catch (err) {
      console.warn('[LOKHA Firebase] Could not attach live onValue listener:', err);
    }
  }

  // Listen to multi-tab events
  const handleBroadcast = (event) => {
    if (event.data?.type === 'SYNC_PROPERTIES' || event.data?.type === 'PROPERTY_CHANGED') {
      const current = getLocalPropertiesMap();
      callback(mapToArray(current));
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    subscribers.delete(callback);
    if (liveFirebaseUnsubscribe) {
      liveFirebaseUnsubscribe();
    }
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

/**
 * Add a new property to Firebase / local realtime store
 */
export async function addProperty(propertyData) {
  const formatted = formatPropertyDoc(propertyData);
  const map = getLocalPropertiesMap();
  map[formatted.id] = formatted;
  saveLocalPropertiesMap(map);

  if (firebaseDb) {
    try {
      const propRef = ref(firebaseDb, `properties/${formatted.id}`);
      await set(propRef, formatted);
    } catch (err) {
      console.error('[LOKHA Firebase] Failed to write to live Firebase:', err);
    }
  }

  const list = mapToArray(map);
  notifySubscribers(list);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'PROPERTY_CHANGED', action: 'ADD', id: formatted.id });
  }

  return formatted;
}

/**
 * Update an existing property
 */
export async function updateProperty(propertyId, updates) {
  const map = getLocalPropertiesMap();
  if (!map[propertyId]) {
    throw new Error(`Property ${propertyId} not found`);
  }

  const merged = {
    ...map[propertyId],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const formatted = formatPropertyDoc(merged);
  map[propertyId] = formatted;
  saveLocalPropertiesMap(map);

  if (firebaseDb) {
    try {
      const propRef = ref(firebaseDb, `properties/${propertyId}`);
      await update(propRef, formatted);
    } catch (err) {
      console.error('[LOKHA Firebase] Failed to update in live Firebase:', err);
    }
  }

  const list = mapToArray(map);
  notifySubscribers(list);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'PROPERTY_CHANGED', action: 'UPDATE', id: propertyId });
  }

  return formatted;
}

/**
 * Mark a property status: 'Available' | 'Sold' | 'Rented'
 */
export async function markPropertyStatus(propertyId, newStatus) {
  return updateProperty(propertyId, {
    status: newStatus,
    possessionStatus: newStatus === 'Sold' ? 'Sold Out' : newStatus === 'Rented' ? 'Occupied' : 'Ready to Move'
  });
}

/**
 * Delete a property
 */
export async function deleteProperty(propertyId) {
  const map = getLocalPropertiesMap();
  if (!map[propertyId]) return false;

  delete map[propertyId];
  saveLocalPropertiesMap(map);

  if (firebaseDb) {
    try {
      const propRef = ref(firebaseDb, `properties/${propertyId}`);
      await remove(propRef);
    } catch (err) {
      console.error('[LOKHA Firebase] Failed to delete in live Firebase:', err);
    }
  }

  const list = mapToArray(map);
  notifySubscribers(list);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'PROPERTY_CHANGED', action: 'DELETE', id: propertyId });
  }

  return true;
}

/**
 * Get current database statistics
 */
export function getDatabaseStats() {
  const map = getLocalPropertiesMap();
  const list = Object.values(map);

  const cities = new Set(list.map((p) => p.city).filter(Boolean));
  const types = new Set(list.map((p) => p.propertyType).filter(Boolean));
  const soldCount = list.filter((p) => p.status === 'Sold').length;
  const rentedCount = list.filter((p) => p.status === 'Rented').length;
  const availableCount = list.filter((p) => p.status === 'Available' || !p.status).length;
  const userCount = list.filter((p) => !p.isSeed).length;

  return {
    total: list.length,
    available: availableCount,
    sold: soldCount,
    rented: rentedCount,
    userCreated: userCount,
    seedCount: list.length - userCount,
    citiesCount: cities.size,
    typesCount: types.size,
    isRealFirebase: isRealFirebaseConfigured && Boolean(firebaseDb)
  };
}

/**
 * Get active Firebase Database instance (if configured)
 */
export function getDatabaseInstance() {
  return firebaseDb;
}

