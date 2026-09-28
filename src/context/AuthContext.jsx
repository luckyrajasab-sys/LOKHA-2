import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, onAuthStateChanged } from '../firebase/config.js';
import { authService, mapAuthError } from '../services/authService.js';
import { getUserProfile, handleGoogleUserProfile, updateUserProfile } from '../services/userService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal support for embedded auth triggers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState(null);

  /**
   * Helper to format Firebase Auth User & DB Profile into standard LOKHA user format
   */
  const formatUser = useCallback((fbUser, profile) => {
    if (!fbUser) return null;
    const displayName = profile?.fullName || fbUser.displayName || 'LOKHA Member';
    const photoURL = profile?.photoURL || fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=12355B&color=fff`;

    return {
      uid: fbUser.uid,
      id: fbUser.uid,
      name: displayName,
      displayName: displayName,
      email: fbUser.email || '',
      mobile: profile?.phone || fbUser.phoneNumber || '',
      phone: profile?.phone || fbUser.phoneNumber || '',
      role: (profile?.role || 'buyer').toLowerCase(),
      avatar: photoURL,
      photoURL: photoURL,
      accountStatus: profile?.accountStatus || 'active',
      emailVerified: Boolean(fbUser.emailVerified),
      isLoggedIn: true
    };
  }, []);

  /**
   * Primary Firebase Auth State Listener
   * Maintains persistent session and avoids UI flashing
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          console.log('[LOKHA Auth] User is signed in:', fbUser.uid, fbUser.email);
          // Immediately set active user state from Firebase Auth token (instant UI response)
          setUser(formatUser(fbUser, null));
          setLoading(false);

          // Asynchronously enrich with database profile in the background
          try {
            let profile = await getUserProfile(fbUser.uid);
            if (!profile) {
              profile = await handleGoogleUserProfile(fbUser);
            }
            if (profile) {
              setUserProfile(profile);
              setUser(formatUser(fbUser, profile));
            }
          } catch (pErr) {
            console.warn('[LOKHA AuthContext] Background profile sync warning:', pErr);
          }
        } else {
          console.log('[LOKHA Auth] No user is signed in.');
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('[LOKHA AuthContext] Error resolving auth state:', err);
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [formatUser]);

  /**
   * Refresh the user profile from Realtime Database
   */
  const refreshUserProfile = useCallback(async () => {
    if (!auth.currentUser) return null;
    try {
      const profile = await getUserProfile(auth.currentUser.uid);
      if (profile) {
        setUserProfile(profile);
        setUser(formatUser(auth.currentUser, profile));
      }
      return profile;
    } catch (err) {
      console.warn('[LOKHA AuthContext] Error refreshing profile:', err);
      return null;
    }
  }, [formatUser]);

  /**
   * Update profile fields (Full Name, Phone, Photo, etc.)
   */
  const updateProfileData = useCallback(async (fields) => {
    if (!user?.uid) throw new Error('Not authenticated');
    const updated = await updateUserProfile(user.uid, fields);
    setUserProfile(updated);
    setUser(formatUser(auth.currentUser, updated));
    return updated;
  }, [user, formatUser]);

  /**
   * Email + Password Login
   */
  const login = useCallback(async (credentials) => {
    const { user: fbUser, profile } = await authService.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    const formatted = formatUser(fbUser, profile);
    setUser(formatted);
    setUserProfile(profile);
    setIsAuthModalOpen(false);

    if (pendingCallback) {
      pendingCallback(formatted);
      setPendingCallback(null);
    }
    return formatted;
  }, [formatUser, pendingCallback]);

  /**
   * Email + Password + Role Registration
   */
  const register = useCallback(async (data) => {
    const { user: fbUser, profile } = await authService.createUserWithEmailAndPassword({
      name: data.name || data.fullName,
      email: data.email,
      password: data.password,
      role: data.role || 'buyer',
      phone: data.mobile || data.phone || ''
    });

    const formatted = formatUser(fbUser, profile);
    setUser(formatted);
    setUserProfile(profile);
    setIsAuthModalOpen(false);

    if (pendingCallback) {
      pendingCallback(formatted);
      setPendingCallback(null);
    }
    return formatted;
  }, [formatUser, pendingCallback]);

  /**
   * Google Sign-In / Sign-Up
   */
  const loginWithGoogle = useCallback(async () => {
    const { user: fbUser, profile } = await authService.signInWithGoogle();
    const formatted = formatUser(fbUser, profile);
    setUser(formatted);
    setUserProfile(profile);
    setIsAuthModalOpen(false);

    if (pendingCallback) {
      pendingCallback(formatted);
      setPendingCallback(null);
    }
    return formatted;
  }, [formatUser, pendingCallback]);

  /**
   * Password Reset
   */
  const resetPassword = useCallback(async (email) => {
    return authService.sendPasswordReset(email);
  }, []);

  /**
   * Sign Out
   */
  const logout = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setUserProfile(null);
  }, []);

  const openAuthModal = useCallback((onSuccessAction = null) => {
    if (typeof onSuccessAction === 'function') {
      setPendingCallback(() => onSuccessAction);
    } else {
      setPendingCallback(null);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAuthenticated: Boolean(user && user.isLoggedIn),
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        refreshUserProfile,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
