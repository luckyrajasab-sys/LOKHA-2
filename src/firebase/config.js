/**
 * Centralized Firebase Configuration and Modular SDK Initialization
 * LOKHA Real Estate Platform
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  updateProfile
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
  onValue,
  serverTimestamp,
  push
} from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const env = (typeof import.meta !== 'undefined' && import.meta && import.meta.env) ? import.meta.env : {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyByc8rfSWvzvjE3OZgVrN4LMcM6ad6Tvyk',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'lokha-82898.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'lokha-82898',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'lokha-82898.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '59896059550',
  appId: env.VITE_FIREBASE_APP_ID || '1:59896059550:web:65c2248dff1018282c8d8f',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-ZCHPL1SEFB',
  databaseURL: env.VITE_FIREBASE_DATABASE_URL || 'https://lokha-82898-default-rtdb.firebaseio.com'
};

// Initialize or reuse Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure persistent authentication
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[LOKHA Firebase] Failed to enable browserLocalPersistence:', err);
  });
}

// Google Auth Provider configured for official sign-in
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Realtime Database
export const db = getDatabase(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Analytics safely
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn('[LOKHA Firebase] Analytics skipped:', err);
    });
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  ref,
  set,
  get,
  child,
  update,
  remove,
  onValue,
  serverTimestamp,
  push
};

export default app;
