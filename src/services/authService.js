/**
 * Frontend Mock Authentication Service
 * Architected to mirror Firebase Auth API so it can be swapped seamlessly in the future.
 * DO NOT add Firebase API keys or initialize real Firebase here.
 */

const STORAGE_KEY = 'lokha_auth_user';

// Mock active sessions in localStorage
function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Failed to persist user session', err);
  }
}

export const authService = {
  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return getStoredUser();
  },

  /**
   * Sign in with Google (Simulated OAuth flow)
   */
  async signInWithGoogle() {
    await new Promise((res) => setTimeout(res, 800)); // simulated latency
    const mockUser = {
      uid: 'user-google-' + Date.now().toString(36),
      displayName: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      provider: 'google.com',
      role: 'buyer',
      phoneNumber: '+91 98765 43210',
      createdAt: new Date().toISOString()
    };
    setStoredUser(mockUser);
    return mockUser;
  },

  /**
   * Sign in with Apple (Simulated OAuth flow)
   */
  async signInWithApple() {
    await new Promise((res) => setTimeout(res, 800));
    const mockUser = {
      uid: 'user-apple-' + Date.now().toString(36),
      displayName: 'Priya Iyer',
      email: 'priya.iyer@icloud.com',
      photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      provider: 'apple.com',
      role: 'buyer',
      phoneNumber: '+91 98111 22334',
      createdAt: new Date().toISOString()
    };
    setStoredUser(mockUser);
    return mockUser;
  },

  /**
   * Request OTP for Email or Mobile
   */
  async sendOTP(identifier) {
    await new Promise((res) => setTimeout(res, 600));
    // Simulated OTP is always 123456 in dev/preview
    return {
      success: true,
      identifier,
      message: `A 6-digit verification code has been sent to ${identifier}. (Use code: 123456)`
    };
  },

  /**
   * Verify OTP
   */
  async verifyOTP(identifier, code, extraData = {}) {
    await new Promise((res) => setTimeout(res, 800));
    if (code !== '123456' && code.length !== 6) {
      throw new Error('Invalid verification code. Please enter 123456 for preview.');
    }

    const isEmail = identifier.includes('@');
    const mockUser = {
      uid: 'user-otp-' + Date.now().toString(36),
      displayName: extraData.name || (isEmail ? identifier.split('@')[0] : 'LOKHA User'),
      email: isEmail ? identifier : (extraData.email || 'user@lokha.in'),
      phoneNumber: !isEmail ? identifier : (extraData.phoneNumber || '+91 98765 00000'),
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      provider: isEmail ? 'passwordless-email' : 'phone-otp',
      role: extraData.role || 'buyer',
      createdAt: new Date().toISOString()
    };
    setStoredUser(mockUser);
    return mockUser;
  },

  /**
   * Standard Email & Password Sign In
   */
  async signInWithEmailAndPassword(email, password) {
    await new Promise((res) => setTimeout(res, 600));
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }
    const mockUser = {
      uid: 'user-email-' + Date.now().toString(36),
      displayName: email.split('@')[0].replace('.', ' '),
      email,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      provider: 'password',
      role: 'buyer',
      phoneNumber: '+91 99887 76655',
      createdAt: new Date().toISOString()
    };
    setStoredUser(mockUser);
    return mockUser;
  },

  /**
   * Standard Sign Up
   */
  async createUserWithEmailAndPassword(name, email, password, role = 'buyer') {
    await new Promise((res) => setTimeout(res, 700));
    const mockUser = {
      uid: 'user-reg-' + Date.now().toString(36),
      displayName: name || email.split('@')[0],
      email,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      provider: 'password',
      role,
      phoneNumber: '+91 99000 11223',
      createdAt: new Date().toISOString()
    };
    setStoredUser(mockUser);
    return mockUser;
  },

  /**
   * Sign out
   */
  async signOut() {
    await new Promise((res) => setTimeout(res, 300));
    setStoredUser(null);
    return true;
  }
};
