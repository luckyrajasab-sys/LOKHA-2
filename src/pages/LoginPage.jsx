import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const redirectTarget = location.state?.from?.pathname
    ? location.state.from.pathname + (location.state.from.search || '')
    : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email or mobile is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulated delay
    login({ email, password });
    showToast('Welcome back to LOKHA!', 'success');
    setLoading(false);
    navigate(redirectTarget, { replace: true });
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      showToast('Welcome back to LOKHA! Signed in with Google.', 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      showToast('Google sign in failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-page)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--color-border)', padding: '16px 24px' }}>
        <Logo />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Card */}
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.7rem', marginBottom: '6px' }}>Welcome back</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                Sign in to access your saved homes and visits
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="form-field" style={{ marginBottom: '16px' }}>
                <label className="form-label" htmlFor="login-email">Email / Mobile</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    id="login-email"
                    type="text"
                    className="form-input"
                    placeholder="you@example.com or +91 98450…"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                    style={{ paddingLeft: '40px' }}
                    autoComplete="username"
                  />
                </div>
                {errors.email && <span className="form-field-error">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="form-field" style={{ marginBottom: '16px' }}>
                <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label htmlFor="login-password">Password</label>
                  <Link to="/login" style={{ fontSize: '0.8rem', color: 'var(--color-trust-blue)', fontWeight: 600 }}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <span className="form-field-error">{errors.password}</span>}
              </div>

              {/* Remember me */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: 'var(--color-trust-blue)' }} />
                <span>Keep me signed in</span>
              </label>

              {/* Sign In CTA - TEAL */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              id="login-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn btn-outline"
              style={{ width: '100%', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Register link */}
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
              New to LOKHA?{' '}
              <Link to="/register" style={{ color: 'var(--color-trust-blue)', fontWeight: 700 }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* Security note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-cta-teal)" />
            <span>Your data is secure and never shared without consent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
