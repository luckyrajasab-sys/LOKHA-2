import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const env = (typeof import.meta !== 'undefined' && import.meta && import.meta.env) ? import.meta.env : {};

// Web app's Firebase configuration with fallback to provided credentials
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyByc8rfSWvzvjE3OZgVrN4LMcM6ad6Tvyk",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "lokha-82898.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "lokha-82898",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "lokha-82898.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "59896059550",
  appId: env.VITE_FIREBASE_APP_ID || "1:59896059550:web:65c2248dff1018282c8d8f",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZCHPL1SEFB",
  databaseURL: env.VITE_FIREBASE_DATABASE_URL || "https://lokha-82898-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics safely
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("[Firebase] Analytics initialization skipped:", err);
    });
}

// Export Auth & Database instances
export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;
