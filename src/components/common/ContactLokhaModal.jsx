import React, { useState } from 'react';
import { X, Send, Mail, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Logo } from './Logo';

export default function ContactLokhaModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Thank you! Your message has been received.', 'success');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
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
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '1.25rem',
          maxWidth: '500px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #12355B 0%, #1e4a7a 100%)',
            padding: '1.5rem 1.75rem',
            color: '#ffffff',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
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
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
          <Logo light />
          <p style={{ margin: '8px 0 0 0', fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            Get in touch with the LOKHA team
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '1.75rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ color: '#12355B', marginBottom: '8px' }}>Message Received</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Thank you for reaching out. We will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  Your Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arun Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.92rem',
                    background: '#ffffff'
                  }}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Feedback">Product Feedback & Suggestions</option>
                  <option value="Listing a Property">Listing a Property / Partnership</option>
                  <option value="Technical or Bug Report">Technical or Bug Report</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.92rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '0.625rem',
                  background: 'linear-gradient(135deg, #00A69C 0%, #008f87 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
