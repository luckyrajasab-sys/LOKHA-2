import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', size = 18 }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      className={`btn-theme-toggle ${className}`}
      onClick={toggleTheme}
      title={isDark ? 'Switch to Bright Architectural Mode' : 'Switch to Deep Luxury Dark Mode'}
      aria-label={isDark ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: '1px solid var(--color-border)',
        borderRadius: '50%',
        width: `${size + 18}px`,
        height: `${size + 18}px`,
        color: isDark ? 'var(--lokha-wood)' : 'var(--lokha-primary)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        flexShrink: 0
      }}
    >
      {isDark ? (
        <Sun size={size} strokeWidth={2.2} />
      ) : (
        <Moon size={size} strokeWidth={2.2} />
      )}
    </button>
  );
}
