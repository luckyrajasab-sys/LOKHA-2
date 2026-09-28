import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Heart } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3200) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--color-cta-teal)" />}
            {toast.type === 'heart' && <Heart size={18} color="var(--color-saved-heart)" fill="var(--color-saved-heart)" />}
            {toast.type === 'error' && <AlertCircle size={18} color="var(--color-error)" />}
            {toast.type === 'info' && <Info size={18} color="var(--color-trust-blue)" />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)} 
              style={{ color: '#94A3B8', padding: '2px', fontSize: '1.1rem', lineHeight: 1 }}
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
