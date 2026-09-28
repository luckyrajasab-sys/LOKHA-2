/**
 * LOKHA Realtime Saved Properties Service
 * Path: /savedProperties/{uid}/{propertyId}
 */

import {
  db,
  ref,
  set,
  remove,
  get,
  onValue
} from '../firebase/config.js';

export async function fetchUserSavedProperties(uid) {
  if (!uid) return [];
  try {
    const savedRef = ref(db, `savedProperties/${uid}`);
    const snapshot = await get(savedRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val());
    }
    return [];
  } catch (err) {
    console.warn(`[LOKHA Saved] Error fetching saved properties for ${uid}:`, err);
    return [];
  }
}

export async function saveUserProperty(uid, propertyId) {
  if (!uid || !propertyId) return false;
  try {
    const propRef = ref(db, `savedProperties/${uid}/${propertyId}`);
    await set(propRef, {
      propertyId,
      savedAt: Date.now()
    });
    return true;
  } catch (err) {
    console.error(`[LOKHA Saved] Failed to save property ${propertyId}:`, err);
    throw err;
  }
}

export async function removeUserProperty(uid, propertyId) {
  if (!uid || !propertyId) return false;
  try {
    const propRef = ref(db, `savedProperties/${uid}/${propertyId}`);
    await remove(propRef);
    return true;
  } catch (err) {
    console.error(`[LOKHA Saved] Failed to remove property ${propertyId}:`, err);
    throw err;
  }
}

export function subscribeToUserSavedProperties(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }

  const savedRef = ref(db, `savedProperties/${uid}`);
  return onValue(
    savedRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(Object.keys(snapshot.val()));
      } else {
        callback([]);
      }
    },
    (err) => {
      console.warn(`[LOKHA Saved] Subscription error for ${uid}:`, err);
    }
  );
}
