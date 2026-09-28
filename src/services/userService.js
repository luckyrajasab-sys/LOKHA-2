/**
 * LOKHA User Profile & Role Management Service
 * Manages user records in Firebase Realtime Database under /users/{uid}
 */

import {
  db,
  ref,
  get,
  set,
  update,
  child,
  serverTimestamp
} from '../firebase/config.js';

export const VALID_ROLES = ['buyer', 'owner', 'agent', 'builder'];

/**
 * Fetch a user profile from /users/{uid}
 */
export async function getUserProfile(uid) {
  if (!uid) return null;
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (err) {
    console.warn(`[LOKHA Users] Error reading profile for ${uid}:`, err);
    return null;
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

  const userRef = ref(db, `users/${uid}`);
  await set(userRef, profile);
  return profile;
}

/**
 * Handle user profile sync on Google Sign-In
 * - If user exists: preserves their existing role, preferences, and account status! Only updates lastLoginAt & updatedAt.
 * - If user is new: initializes their profile with role = 'buyer'.
 */
export async function handleGoogleUserProfile(firebaseUser) {
  if (!firebaseUser?.uid) return null;

  const userRef = ref(db, `users/${firebaseUser.uid}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const existing = snapshot.val();
    const updates = {
      lastLoginAt: Date.now(),
      updatedAt: Date.now(),
      emailVerified: Boolean(firebaseUser.emailVerified)
    };

    // Update photo or display name only if not customized or empty
    if (!existing.fullName && firebaseUser.displayName) {
      updates.fullName = firebaseUser.displayName;
    }
    if (!existing.photoURL && firebaseUser.photoURL) {
      updates.photoURL = firebaseUser.photoURL;
    }

    await update(userRef, updates);
    return { ...existing, ...updates };
  } else {
    // New Google user registration
    const newProfile = {
      uid: firebaseUser.uid,
      fullName: firebaseUser.displayName || 'LOKHA Member',
      email: firebaseUser.email || '',
      phone: firebaseUser.phoneNumber || '',
      photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=12355B&color=fff`,
      provider: 'google.com',
      role: 'buyer', // Default role for first-time Google sign-ins
      accountStatus: 'active',
      emailVerified: Boolean(firebaseUser.emailVerified),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastLoginAt: Date.now()
    };

    await set(userRef, newProfile);
    return newProfile;
  }
}

/**
 * Update user profile fields securely
 * Protected fields like 'uid', 'accountStatus', and 'role' are stripped to prevent unauthorized escalation.
 */
export async function updateUserProfile(uid, allowedFields) {
  if (!uid) throw new Error('UID is required');

  const sanitized = {};
  if (typeof allowedFields.fullName === 'string') sanitized.fullName = allowedFields.fullName.trim();
  if (typeof allowedFields.phone === 'string') sanitized.phone = allowedFields.phone.trim();
  if (typeof allowedFields.photoURL === 'string') sanitized.photoURL = allowedFields.photoURL.trim();
  if (typeof allowedFields.bio === 'string') sanitized.bio = allowedFields.bio.trim();
  if (typeof allowedFields.companyName === 'string') sanitized.companyName = allowedFields.companyName.trim();
  if (typeof allowedFields.reraNumber === 'string') sanitized.reraNumber = allowedFields.reraNumber.trim();
  
  sanitized.updatedAt = Date.now();

  const userRef = ref(db, `users/${uid}`);
  await update(userRef, sanitized);

  return getUserProfile(uid);
}
