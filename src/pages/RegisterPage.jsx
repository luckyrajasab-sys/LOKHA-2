import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Briefcase } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const redirectTarget = location.state?.from?.pathname
    ? location.state.from.pathname + (location.state.from.search || '')
    : '/dashboard';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, val) => {
    setFormData((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
    setErrorMsg('');
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) {
      e.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      e.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      e.email = 'Please enter a valid email address';
    }
    const cleanPhone = formData.mobile.replace(/\D/g, '');
    if (!formData.mobile.trim() || cleanPhone.length < 10) {
      e.mobile = 'Valid 10-digit mobile number is required';
    }
    if (!formData.password) {
      e.password = 'Password is required';
    } else if (formData.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }
    if (!['buyer', 'owner', 'agent', 'builder'].includes(formData.role)) {
      e.role = 'Please select a valid role';
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
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        mobile: formData.mobile.trim()
      });
      showToast('Welcome to LOKHA! Your account has been created.', 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg('');
    try {
      setLoading(true);
      await loginWithGoogle();
      showToast('Welcome to LOKHA! Signed in with Google.', 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Google sign-up was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-page, #FAF8F5)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--color-border)', padding: '16px 24px' }}>
        <Logo />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl, 16px)', border: '1px solid var(--color-border)', padding: '40px', boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '6px', fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}>
                Create your account
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                Join India’s trusted verified real estate marketplace
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
              {/* Full Name */}
              <div className="form-field" style={{ marginBottom: '14px' }}>
                <label className="form-label" htmlFor="reg-name">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Aditya Sharma"
                    value={formData.name}
                    onChange={(e) => update('name', e.target.value)}
                    style={{ paddingLeft: '40px' }}
                    disabled={loading}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <span className="form-field-error">{errors.name}</span>}
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                {/* Email */}
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="reg-email">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      id="reg-email"
                      type="email"
                      className="form-input"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => update('email', e.target.value)}
                      style={{ paddingLeft: '40px' }}
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <span className="form-field-error">{errors.email}</span>}
                </div>

                {/* Mobile */}
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="reg-mobile">Phone Number *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      id="reg-mobile"
                      type="tel"
                      className="form-input"
                      placeholder="+91 98450 00000"
                      value={formData.mobile}
                      onChange={(e) => update('mobile', e.target.value)}
                      style={{ paddingLeft: '40px' }}
                      disabled={loading}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.mobile && <span className="form-field-error">{errors.mobile}</span>}
                </div>
              </div>

              {/* Role Selection */}
              <div className="form-field" style={{ marginBottom: '14px' }}>
                <label className="form-label" htmlFor="reg-role">I am joining as *</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <select
                    id="reg-role"
                    className="form-input"
                    value={formData.role}
                    onChange={(e) => update('role', e.target.value)}
                    style={{ paddingLeft: '40px', background: '#FFFFFF' }}
                    disabled={loading}
                  >
                    <option value="buyer">Buyer / Renter (Searching for properties)</option>
                    <option value="owner">Property Owner (Listing my properties)</option>
                    <option value="agent">Real Estate Agent / Broker</option>
                    <option value="builder">Builder / Developer</option>
                  </select>
                </div>
                {errors.role && <span className="form-field-error">{errors.role}</span>}
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                {/* Password */}
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="reg-password">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      id="reg-password"
                      type={showPass ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Min. 6 chars"
                      value={formData.password}
                      onChange={(e) => update('password', e.target.value)}
                      style={{ paddingLeft: '40px', paddingRight: '36px' }}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <span className="form-field-error">{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="reg-confirm-password">Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPass ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      style={{ paddingLeft: '40px', paddingRight: '36px' }}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((v) => !v)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                      aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="form-field-error">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Create Account CTA */}
              <button
                type="submit"
                id="register-submit-btn"
                className="btn btn-cta-teal"
                disabled={loading}
                style={{ width: '100%', height: '48px', fontSize: '1rem' }}
              >
                {loading ? 'Creating account…' : 'Create Account'}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>or sign up with</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              id="register-google-btn"
              onClick={handleGoogleSignUp}
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
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md, 8px)',
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

            <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" state={location.state} style={{ color: 'var(--color-trust-blue, #12355B)', fontWeight: 700 }}>
                Sign In
              </Link>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-cta-teal, #00A69C)" />
            <span>By registering you agree to our Terms of Service & Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
