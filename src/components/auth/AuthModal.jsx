import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import { Logo } from '../common/Logo';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, loginWithGoogle, loginWithApple, verifyOTP } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' | 'password'

  // Form states
  const [identifier, setIdentifier] = useState(''); // email or mobile
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Buyer/Renter');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // OTP Countdown
  useEffect(() => {
    let interval;
    if (mode === 'otp' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mode, otpTimer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim()) {
      setError('Please enter your mobile number or email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendOTP(identifier);
      setMode('otp');
      setOtpTimer(30);
      showToast(res.message, 'success');
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyOTP(identifier, fullCode, { name, role });
      showToast('Welcome to LOKHA! Successfully signed in.', 'success');
    } catch (err) {
      setError(err.message || 'Verification failed. Try code: 123456');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email: identifier, password });
        showToast('Welcome back to LOKHA!', 'success');
      } else {
        await register({ name, email: identifier, password, role });
        showToast('Your LOKHA account is created successfully!', 'success');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast('Signed in with Google successfully.', 'success');
    } catch (err) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialApple = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithApple();
      showToast('Signed in with Apple ID successfully.', 'success');
    } catch (err) {
      setError(err.message || 'Apple sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInputChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otpCode];
    updated[idx] = val.slice(-1);
    setOtpCode(updated);

    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-input-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(10, 25, 47, 0.72)',
        backdropFilter: 'blur(6px)',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '1.25rem',
          maxWidth: '480px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #12355B 0%, #1e4a7a 100%)',
            padding: '1.5rem 1.75rem',
            color: '#ffffff',
            position: 'relative'
          }}
        >
          <button
            onClick={closeAuthModal}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Logo light />
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            {mode === 'otp'
              ? 'Enter 6-digit verification code'
              : mode === 'login'
              ? 'Sign in to access saved properties, schedule visits & compare'
              : 'Create your LOKHA account in seconds'}
          </p>
        </div>

        {/* Tab switchers if not in OTP mode */}
        {mode !== 'otp' && (
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}
          >
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              style={{
                flex: 1,
                padding: '0.875rem',
                border: 'none',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                fontWeight: mode === 'login' ? 600 : 500,
                color: mode === 'login' ? '#12355B' : '#64748b',
                borderBottom: mode === 'login' ? '2px solid #00A69C' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              style={{
                flex: 1,
                padding: '0.875rem',
                border: 'none',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                fontWeight: mode === 'register' ? 600 : 500,
                color: mode === 'register' ? '#12355B' : '#64748b',
                borderBottom: mode === 'register' ? '2px solid #00A69C' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        <div style={{ padding: '1.75rem', maxHeight: '78vh', overflowY: 'auto' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#fef2f2',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                border: '1px solid #fee2e2'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Social Logins */}
          {mode !== 'otp' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={handleSocialGoogle}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '0.625rem',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.26 21.37 7.36 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.41l4.02-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.63 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={handleSocialApple}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '0.625rem',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.07-1.85.95-2.94-.92.04-2.07.62-2.73 1.4-.58.67-1.1 1.76-.96 2.82 1.03.08 2.11-.5 2.74-1.28z" />
                  </svg>
                  Apple
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  margin: '1.25rem 0',
                  color: '#94a3b8',
                  fontSize: '0.8125rem'
                }}
              >
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                <span>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              </div>
            </div>
          )}

          {/* OTP Mode Form */}
          {mode === 'otp' ? (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Code sent to <strong>{identifier}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00A69C',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Change number / email
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.5rem'
                }}
              >
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInputChange(index, e.target.value)}
                    style={{
                      width: '46px',
                      height: '52px',
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      borderRadius: '0.5rem',
                      border: '2px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#12355B',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                {otpTimer > 0 ? (
                  <span>Resend code in {otpTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2F80ED',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Resend Code
                  </button>
                )}
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Demo preview code: <strong>123456</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '0.625rem',
                  background: 'linear-gradient(135deg, #00A69C 0%, #008f87 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* Login or Register Form */
            <form onSubmit={authMethod === 'otp' ? handleSendOtp : handlePasswordSubmit}>
              {mode === 'register' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Verma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          outline: 'none',
                          fontSize: '0.9375rem'
                        }}
                      />
                    </div>
                  </div>

                </>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  {authMethod === 'otp' ? 'Mobile Number or Email' : 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  {authMethod === 'otp' ? (
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  ) : (
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  )}
                  <input
                    type={authMethod === 'otp' ? 'text' : 'email'}
                    required
                    placeholder={authMethod === 'otp' ? 'e.g. +91 98450 12345 or email' : 'e.g. name@example.com'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.9375rem'
                    }}
                  />
                </div>
              </div>

              {authMethod === 'password' && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>Password</label>
                    {mode === 'login' && (
                      <span
                        onClick={() => setAuthMethod('otp')}
                        style={{ fontSize: '0.75rem', color: '#00A69C', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Sign in via OTP instead
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        outline: 'none',
                        fontSize: '0.9375rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Toggle between OTP and Password login */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setAuthMethod(authMethod === 'otp' ? 'password' : 'otp')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2F80ED',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {authMethod === 'otp' ? 'Use Password instead' : 'Use instant OTP login'}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <ShieldCheck size={14} color="#00A69C" />
                  <span>256-bit Encrypted</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '0.625rem',
                  background: 'linear-gradient(135deg, #12355B 0%, #1e4a7a 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.1s'
                }}
              >
                {loading
                  ? 'Please wait...'
                  : authMethod === 'otp'
                  ? 'Send Verification Code'
                  : mode === 'login'
                  ? 'Sign In to LOKHA'
                  : 'Complete Registration'}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <p style={{ marginTop: '1.25rem', marginBottom: 0, textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
            By continuing, you agree to LOKHA’s Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
