import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const { showToast } = useToast();

  const redirectTarget = location.state?.from?.pathname
    ? location.state.from.pathname + (location.state.from.search || '')
    : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  // Forgot Password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  const validate = () => {
    const e = {};
    if (!email.trim()) {
      e.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'Please enter a valid email address';
    }
    if (!password) {
      e.password = 'Password is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      showToast('Welcome back to LOKHA!', 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      setLoading(true);
      await loginWithGoogle();
      showToast('Welcome to LOKHA! Signed in with Google.', 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (!resetEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setResetError('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(resetEmail.trim());
      setResetSuccess(true);
      showToast('Password reset email sent!', 'success');
    } catch (err) {
      setResetError(err.message || 'Could not send reset email. Verify your address.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-page, #FAF8F5)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--color-border)', padding: '16px 24px' }}>
        <Logo />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Main Card */}
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl, 16px)', border: '1px solid var(--color-border)', padding: '40px', boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '6px', fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}>
                Welcome back
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                Sign in to access your saved homes, visits, and listings
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  color: '#DC2626',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  fontSize: '0.86rem',
                  marginBottom: '20px'
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="form-field" style={{ marginBottom: '16px' }}>
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg('');
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    style={{ paddingLeft: '40px' }}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
                {errors.email && <span className="form-field-error">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="form-field" style={{ marginBottom: '16px' }}>
                <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label htmlFor="login-password">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setIsForgotPasswordOpen(true);
                      setResetSuccess(false);
                      setResetError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '0.8rem',
                      color: 'var(--color-trust-blue, #12355B)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <span className="form-field-error">{errors.password}</span>}
              </div>

              {/* Keep signed in */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: 'var(--color-cta-teal, #00A69C)' }}
                />
                <span>Keep me signed in</span>
              </label>

              {/* Sign In CTA */}
              <button
                type="submit"
                id="login-submit-btn"
                className="btn btn-cta-teal"
                disabled={loading}
                style={{ width: '100%', height: '48px', fontSize: '1rem' }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              id="login-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn btn-outline"
              style={{
                width: '100%',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Register link */}
            <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
              New to LOKHA?{' '}
              <Link to="/register" state={location.state} style={{ color: 'var(--color-trust-blue, #12355B)', fontWeight: 700 }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* Security footnote */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-cta-teal, #00A69C)" />
            <span>Secured by Firebase Authentication & 256-bit encryption</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsForgotPasswordOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(0, 166, 156, 0.1)',
                  color: 'var(--color-cta-teal, #00A69C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto'
                }}
              >
                <KeyRound size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Reset your password</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Enter your registered email and we’ll send you a password reset link.
              </p>
            </div>

            {resetSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle2 size={24} />
                  <span style={{ fontWeight: 600 }}>Reset link dispatched!</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                  Please check your inbox (and spam folder) for instructions to set your new password.
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="btn btn-cta-teal"
                  style={{ width: '100%' }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                {resetError && (
                  <div style={{ color: '#DC2626', fontSize: '0.84rem', marginBottom: '14px', background: '#FEF2F2', padding: '8px 12px', borderRadius: '6px' }}>
                    {resetError}
                  </div>
                )}
                <div className="form-field" style={{ marginBottom: '20px' }}>
                  <label className="form-label" htmlFor="reset-email">Email Address</label>
                  <input
                    id="reset-email"
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      setResetError('');
                    }}
                    required
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                    disabled={resetLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-cta-teal"
                    style={{ flex: 1.5 }}
                    disabled={resetLoading}
                  >
                    {resetLoading ? 'Sending…' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
