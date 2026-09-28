import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
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
    : '/';

  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', password: '', role: 'Buyer/Renter'
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, val) => {
    setFormData((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = 'Full name is required';
    if (!formData.email) e.email = 'Email is required';
    if (!formData.mobile || formData.mobile.length < 10) e.mobile = 'Valid mobile number is required';
    if (!formData.password || formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    register(formData);
    showToast('Welcome to LOKHA! Account created.', 'success');
    setLoading(false);
    navigate(redirectTarget, { replace: true });
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      showToast('Welcome to LOKHA! Account created with Google.', 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      showToast('Google sign up failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--color-border)', padding: '16px 24px' }}>
        <Logo />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.7rem', marginBottom: '6px' }}>Create your account</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                Join thousands of Indians finding their perfect home on LOKHA
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="form-field">
                <label className="form-label" htmlFor="reg-name">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input id="reg-name" type="text" className="form-input" placeholder="Your full name" value={formData.name} onChange={(e) => update('name', e.target.value)} style={{ paddingLeft: '40px' }} />
                </div>
                {errors.name && <span className="form-field-error">{errors.name}</span>}
              </div>

              <div className="form-grid-2">
                {/* Email */}
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="reg-email">Email *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input id="reg-email" type="email" className="form-input" placeholder="you@email.com" value={formData.email} onChange={(e) => update('email', e.target.value)} style={{ paddingLeft: '40px' }} />
                  </div>
                  {errors.email && <span className="form-field-error">{errors.email}</span>}
                </div>

                {/* Mobile */}
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="reg-mobile">Mobile *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input id="reg-mobile" type="tel" className="form-input" placeholder="+91 98450 00000" value={formData.mobile} onChange={(e) => update('mobile', e.target.value)} style={{ paddingLeft: '40px' }} />
                  </div>
                  {errors.mobile && <span className="form-field-error">{errors.mobile}</span>}
                </div>
              </div>

              {/* Password */}
              <div className="form-field">
                <label className="form-label" htmlFor="reg-password">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) => update('password', e.target.value)}
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="form-field-error">{errors.password}</span>}
              </div>



              {/* Create Account CTA - TEAL */}
              <button
                type="submit"
                id="register-submit-btn"
                className="btn btn-cta-teal"
                disabled={loading}
                style={{ width: '100%', height: '48px', fontSize: '1rem', marginTop: '8px' }}
              >
                {loading ? 'Creating account…' : 'Create Account'}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
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
                fontSize: '0.9rem',
                fontWeight: 600,
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-main)',
                transition: 'all 0.2s ease',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span>Sign up with Google</span>
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-trust-blue)', fontWeight: 700 }}>
                Sign In
              </Link>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-cta-teal)" />
            <span>By registering you agree to our Terms of Service and Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
