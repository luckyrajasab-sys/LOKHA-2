/**
 * LOKHA Real Firebase Authentication Service
 * Built with Firebase Modular SDK (v11/v12)
 */

import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword as fbSignInWithEmail,
  createUserWithEmailAndPassword as fbCreateUserWithEmail,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updateProfile as fbUpdateProfile
} from '../firebase/config.js';
import { createUserProfile, handleGoogleUserProfile, getUserProfile } from './userService.js';

/**
 * Map Firebase Auth error codes into clean, user-friendly messages
 */
export function mapAuthError(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Please choose a stronger password (at least 6 characters).';
    case 'auth/user-not-found':
      return 'No account was found with this email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Access is temporarily disabled; please try again later.';
    case 'auth/requires-recent-login':
      return 'Please re-authenticate to perform this action.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    default:
      return error.message || 'Authentication failed. Please verify your details.';
  }
}

export const authService = {
  /**
   * Get current authenticated user directly from Firebase Auth
   */
  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Official Google Sign-In with automatic profile provisioning
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile = await handleGoogleUserProfile(user);
      return { user, profile };
    } catch (err) {
      console.error('[LOKHA Auth] Google Sign-In Error:', err);
      throw new Error(mapAuthError(err));
    }
  },

  /**
   * Standard Email & Password Sign In
   */
  async signInWithEmailAndPassword(email, password) {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    try {
      const result = await fbSignInWithEmail(auth, email.trim(), password);
      const user = result.user;
      let profile = await getUserProfile(user.uid);
      if (!profile) {
        profile = await createUserProfile(user.uid, {
          name: user.displayName || email.split('@')[0],
          email: user.email,
          role: 'buyer'
        });
      }
      return { user, profile };
    } catch (err) {
      console.error('[LOKHA Auth] Email Sign-In Error:', err);
      throw new Error(mapAuthError(err));
    }
  },

  /**
   * Standard Sign Up with Email, Password & Role
   */
  async createUserWithEmailAndPassword({ name, email, password, role = 'buyer', phone = '' }) {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    try {
      const result = await fbCreateUserWithEmail(auth, email.trim(), password);
      const user = result.user;

      // Update Firebase Auth display name
      try {
        await fbUpdateProfile(user, { displayName: name.trim() });
      } catch (profileErr) {
        console.warn('[LOKHA Auth] Error updating display name:', profileErr);
      }

      // Create rich profile in Realtime Database under /users/{uid}
      const profile = await createUserProfile(user.uid, {
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role.toLowerCase()
      });

      return { user, profile };
    } catch (err) {
      console.error('[LOKHA Auth] Registration Error:', err);
      throw new Error(mapAuthError(err));
    }
  },

  /**
   * Send Password Reset Email
   */
  async sendPasswordReset(email) {
    if (!email) {
      throw new Error('Please enter your email address to reset your password.');
    }

    try {
      await fbSendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: 'Password reset link sent! Please check your email inbox.'
      };
    } catch (err) {
      console.error('[LOKHA Auth] Password Reset Error:', err);
      throw new Error(mapAuthError(err));
    }
  },

  /**
   * Sign Out
   */
  async signOut() {
    try {
      await fbSignOut(auth);
      return true;
    } catch (err) {
      console.error('[LOKHA Auth] Sign Out Error:', err);
      throw new Error(mapAuthError(err));
    }
  }
};

export default authService;
