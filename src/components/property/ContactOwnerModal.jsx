import React, { useState } from 'react';
import { X, Phone, MessageSquare, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function ContactOwnerModal({ property, onClose }) {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [message, setMessage] = useState('I am interested in this property. Please contact me with more details and arrange a visit.');
  const [phone, setPhone] = useState(user?.mobile || '+91 98450 12345');
  const [contactMethod, setContactMethod] = useState('both');
  const [isSent, setIsSent] = useState(false);

  const agent = property.agent || {
    name: 'Property Representative',
    type: 'Verified Contact',
    phone: '+91 98765 43210',
    responseTime: 'Responds within 30 minutes',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  };

  const handleSend = (e) => {
    e.preventDefault();
    setIsSent(true);
    showToast(`Inquiry sent to ${agent.name}!`, 'success');
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-navy)' }}>
              Contact Property Lister
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {property.title}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {isSent ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={36} />
            </div>
            <h4 style={{ color: 'var(--color-primary-navy)', fontSize: '1.25rem', marginBottom: '8px' }}>
              Message Delivered!
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              {agent.name} will reach out to you shortly via Phone and WhatsApp at {phone}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Agent / Owner Mini Card */}
              <div className="agent-card" style={{ paddingBottom: '12px' }}>
                <img src={agent.photo} alt={agent.name} className="agent-avatar" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="agent-name">{agent.name}</span>
                    <span className="badge badge-verified" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                      <ShieldCheck size={11} /> Verified
                    </span>
                  </div>
                  <div className="agent-role">{agent.type}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    ⚡ {agent.responseTime}
                  </div>
                </div>
              </div>

              {/* Quick Preset Messages */}
              <div>
                <label className="form-label" style={{ marginBottom: '6px' }}>Quick Message</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {[
                    'Is the price negotiable?',
                    'Can you share the floor plan?',
                    'When is this ready for possession?'
                  ].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => setMessage(quick)}
                      style={{
                        fontSize: '0.76rem',
                        padding: '4px 8px',
                        background: 'var(--color-bg-page)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text-main)'
                      }}
                    >
                      {quick}
                    </button>
                  ))}
                </div>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {/* Contact phone number */}
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="contact-phone">Your Contact Number</label>
                <input 
                  id="contact-phone"
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  required
                />
              </div>

              {/* Mandatory Safety Notice */}
              <div className="safety-notice">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Safety Notice:</strong> Never transfer token money or pay advance fees before inspecting the physical property, verifying ownership title documents, and signing a formal agreement.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              {/* Primary Conversion CTA - TEAL */}
              <button type="submit" className="btn btn-cta-teal">
                Contact Owner
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
