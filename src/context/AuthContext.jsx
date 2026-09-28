import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, KEYS } from '../utils/storage';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: null,
  name: '',
  email: '',
  mobile: '',
  role: 'Buyer/Renter',
  avatar: '',
  isLoggedIn: false
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check authService session first
    const serviceUser = authService.getCurrentUser();
    if (serviceUser && serviceUser.uid) {
      return {
        id: serviceUser.uid,
        name: serviceUser.displayName,
        email: serviceUser.email,
        mobile: serviceUser.phoneNumber,
        role: serviceUser.role || 'Buyer/Renter',
        avatar: serviceUser.photoURL,
        isLoggedIn: true
      };
    }

    // Check localStorage, ensuring legacy mock user ('usr-1' / 'Alex Sharma') is purged so default is unsigned
    const stored = getFromStorage(KEYS.USER_PROFILE, null);
    if (stored && stored.isLoggedIn && stored.id !== 'usr-1' && stored.email !== 'alex.sharma@example.com') {
      return stored;
    }

    return DEFAULT_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState(null);

  useEffect(() => {
    saveToStorage(KEYS.USER_PROFILE, user);
  }, [user]);

  const openAuthModal = (onSuccessAction = null) => {
    if (typeof onSuccessAction === 'function') {
      setPendingCallback(() => onSuccessAction);
    } else {
      setPendingCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  const handleAuthSuccess = (authUser) => {
    const formatted = {
      id: authUser.uid || authUser.id || 'usr-' + Date.now(),
      name: authUser.displayName || authUser.name || 'User',
      email: authUser.email,
      mobile: authUser.phoneNumber || authUser.mobile || '+91 98765 43210',
      role: authUser.role || 'Buyer/Renter',
      avatar: authUser.photoURL || authUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isLoggedIn: true
    };
    setUser(formatted);
    setIsAuthModalOpen(false);

    if (pendingCallback) {
      try {
        pendingCallback(formatted);
      } catch (err) {
        console.error('Callback error after auth:', err);
      }
      setPendingCallback(null);
    }
    return formatted;
  };

  const login = async (credentials) => {
    const authUser = await authService.signInWithEmailAndPassword(
      credentials.email,
      credentials.password || 'password123'
    );
    return handleAuthSuccess(authUser);
  };

  const register = async (data) => {
    const authUser = await authService.createUserWithEmailAndPassword(
      data.name,
      data.email,
      data.password || 'password123',
      data.role
    );
    return handleAuthSuccess(authUser);
  };

  const loginWithGoogle = async () => {
    const authUser = await authService.signInWithGoogle();
    return handleAuthSuccess(authUser);
  };

  const loginWithApple = async () => {
    const authUser = await authService.signInWithApple();
    return handleAuthSuccess(authUser);
  };

  const verifyOTP = async (identifier, code, extraData) => {
    const authUser = await authService.verifyOTP(identifier, code, extraData);
    return handleAuthSuccess(authUser);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(DEFAULT_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.isLoggedIn,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        verifyOTP,
        logout
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
