/**
 * LOKHA User Profile & Role Management Service
 * Manages user records in Firebase Realtime Database under /users/{uid}
 * Built with timeout protection and localStorage resilience so authentication never hangs!
 */

import {
  db,
  ref,
  get,
  set,
  update
} from '../firebase/config.js';

export const VALID_ROLES = ['buyer', 'owner', 'agent', 'builder'];

function withTimeout(promise, ms = 2000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms))
  ]);
}

function getCachedProfile(uid) {
  if (typeof window === 'undefined' || !uid) return null;
  try {
    const raw = localStorage.getItem(`lokha_user_profile_${uid}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedProfile(uid, profile) {
  if (typeof window === 'undefined' || !uid || !profile) return;
  try {
    localStorage.setItem(`lokha_user_profile_${uid}`, JSON.stringify(profile));
  } catch (err) {
    console.warn('[LOKHA Users] Cache write failed:', err);
  }
}

/**
 * Fetch a user profile from /users/{uid} with fallback to cached profile
 */
export async function getUserProfile(uid) {
  if (!uid) return null;
  const cached = getCachedProfile(uid);

  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await withTimeout(get(userRef), 2000);
    if (snapshot.exists()) {
      const data = snapshot.val();
      setCachedProfile(uid, data);
      return data;
    }
    return cached;
  } catch (err) {
    console.warn(`[LOKHA Users] RTDB read timed out or failed for ${uid}, using cache/fallback:`, err.message);
    return cached;
  }
}

/**
 * Create or initialize a new user profile after Email/Password signup
 */
export async function createUserProfile(uid, data) {
  if (!uid) throw new Error('UID is required to create profile');

  const role = VALID_ROLES.includes(data.role?.toLowerCase())
    ? data.role.toLowerCase()
    : 'buyer';

  const profile = {
    uid,
    fullName: data.fullName || data.name || 'LOKHA Member',
    email: data.email || '',
    phone: data.phone || data.mobile || '',
    photoURL: data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || data.name || 'User')}&background=12355B&color=fff`,
    provider: data.provider || 'password',
    role,
    accountStatus: 'active',
    emailVerified: Boolean(data.emailVerified),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastLoginAt: Date.now()
  };

  // Cache locally first for instant availability
  setCachedProfile(uid, profile);

  // Sync to Realtime Database in background without blocking
  try {
    const userRef = ref(db, `users/${uid}`);
    await withTimeout(set(userRef, profile), 2500);
  } catch (err) {
    console.warn('[LOKHA Users] RTDB write timed out or offline; profile cached locally:', err.message);
  }

  return profile;
}

/**
 * Handle user profile sync on Google Sign-In
 * - If user exists: preserves their existing role, preferences, and account status! Only updates lastLoginAt & updatedAt.
 * - If user is new: initializes their profile with role = 'buyer'.
 */
export async function handleGoogleUserProfile(firebaseUser) {
  if (!firebaseUser?.uid) return null;

  const cached = getCachedProfile(firebaseUser.uid);

  try {
    const userRef = ref(db, `users/${firebaseUser.uid}`);
    const snapshot = await withTimeout(get(userRef), 2000);

    if (snapshot.exists()) {
      const existing = snapshot.val();
      const updates = {
        lastLoginAt: Date.now(),
        updatedAt: Date.now(),
        emailVerified: Boolean(firebaseUser.emailVerified)
      };

      if (!existing.fullName && firebaseUser.displayName) {
        updates.fullName = firebaseUser.displayName;
      }
      if (!existing.photoURL && firebaseUser.photoURL) {
        updates.photoURL = firebaseUser.photoURL;
      }

      const merged = { ...existing, ...updates };
      setCachedProfile(firebaseUser.uid, merged);

      // Async update
      update(userRef, updates).catch((e) => console.warn('Background update err:', e));
      return merged;
    } else {
      // New Google user registration
      const newProfile = {
        uid: firebaseUser.uid,
        fullName: firebaseUser.displayName || 'LOKHA Member',
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || '',
        photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=12355B&color=fff`,
        provider: 'google.com',
        role: cached?.role || 'buyer',
        accountStatus: 'active',
        emailVerified: Boolean(firebaseUser.emailVerified),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastLoginAt: Date.now()
      };

      setCachedProfile(firebaseUser.uid, newProfile);
      set(userRef, newProfile).catch((e) => console.warn('Background set err:', e));
      return newProfile;
    }
  } catch (err) {
    console.warn('[LOKHA Users] RTDB unavailable during Google sync, using fast fallback:', err.message);

    const fallback = cached || {
      uid: firebaseUser.uid,
      fullName: firebaseUser.displayName || 'LOKHA Member',
      email: firebaseUser.email || '',
      phone: firebaseUser.phoneNumber || '',
      photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=12355B&color=fff`,
      provider: 'google.com',
      role: 'buyer',
      accountStatus: 'active',
      emailVerified: Boolean(firebaseUser.emailVerified),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastLoginAt: Date.now()
    };

    setCachedProfile(firebaseUser.uid, fallback);
    return fallback;
  }
}

/**
 * Update user profile fields securely
 */
export async function updateUserProfile(uid, allowedFields) {
  if (!uid) throw new Error('UID is required');

  const cached = getCachedProfile(uid) || {};
  const sanitized = {};
  if (typeof allowedFields.fullName === 'string') sanitized.fullName = allowedFields.fullName.trim();
  if (typeof allowedFields.phone === 'string') sanitized.phone = allowedFields.phone.trim();
  if (typeof allowedFields.photoURL === 'string') sanitized.photoURL = allowedFields.photoURL.trim();
  if (typeof allowedFields.bio === 'string') sanitized.bio = allowedFields.bio.trim();
  
  sanitized.updatedAt = Date.now();

  const merged = { ...cached, ...sanitized };
  setCachedProfile(uid, merged);

  try {
    const userRef = ref(db, `users/${uid}`);
    await withTimeout(update(userRef, sanitized), 2500);
  } catch (err) {
    console.warn('[LOKHA Users] Background profile update warning:', err.message);
  }

  return merged;
}
