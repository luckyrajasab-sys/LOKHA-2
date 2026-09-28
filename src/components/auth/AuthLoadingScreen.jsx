import React from 'react';
import Logo from '../common/Logo';

export default function AuthLoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-page, #FAF8F5)',
        color: 'var(--color-text-main, #1E1B18)'
      }}
    >
      <div style={{ marginBottom: '24px', transform: 'scale(1.1)' }}>
        <Logo />
      </div>

      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '3px solid rgba(18, 53, 91, 0.15)',
          borderTopColor: 'var(--color-cta-teal, #00A69C)',
          animation: 'lokha-spin 0.8s linear infinite',
          marginBottom: '16px'
        }}
      />

      <p
        style={{
          fontSize: '0.88rem',
          color: 'var(--color-text-secondary, #7C6B5E)',
          letterSpacing: '0.02em',
          fontWeight: 500
        }}
      >
        Securing session…
      </p>

      <style>{`
        @keyframes lokha-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
