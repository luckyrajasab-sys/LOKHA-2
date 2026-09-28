import React, { useState } from 'react';
import {
  X, Phone, MessageSquare, AlertTriangle, ShieldCheck, CheckCircle2,
  Smartphone, Send, ChevronRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { sendPropertyInquiry } from '../../services/inquiryService';

const QUICK_MESSAGES = [
  'I am interested in this property. Please share more details.',
  'Is the price negotiable? Can we schedule a site visit?',
  'Can you share the floor plan and RERA registration details?',
  'When is this ready for possession?'
];

export default function ContactOwnerModal({ property, onClose }) {
  const { showToast } = useToast();
  const { user, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState('call'); // 'call' | 'whatsapp' | 'inquiry'
  const [message, setMessage] = useState(QUICK_MESSAGES[0]);
  const [senderPhone, setSenderPhone] = useState(user?.mobile || user?.phone || '');
  const [senderName, setSenderName] = useState(user?.name || '');
  const [isSent, setIsSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const agent = property?.agent || property?.owner || {
    name: 'Property Representative',
    type: 'Verified Contact',
    phone: '+91 98765 43210',
    responseTime: 'Responds within 30 minutes',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  };

  const agentPhone = agent.phone || '+91 98765 43210';
  const agentPhoneClean = agentPhone.replace(/\s/g, '');
  const waMessage = encodeURIComponent(
    `Hi, I'm interested in: ${property?.title || 'your property'} listed on LOKHA Real Estate. ${message}`
  );
  const waLink = `https://wa.me/${agentPhoneClean.replace('+', '')}?text=${waMessage}`;
  const maskedPhone = showPhone
    ? agentPhone
    : agentPhone.replace(/(\+?\d{3})\d+(\d{2})/, '$1 ••••• $2');

  const handleRevealPhone = () => {
    if (!user) {
      openAuthModal(() => setShowPhone(true));
    } else {
      setShowPhone(true);
    }
  };

  const handleCall = () => {
    if (!user) {
      openAuthModal(() => setShowPhone(true));
      return;
    }
    window.location.href = `tel:${agentPhoneClean}`;
  };

  const handleWhatsApp = () => {
    if (!user) {
      openAuthModal(() => window.open(waLink, '_blank'));
      return;
    }
    window.open(waLink, '_blank');
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!senderPhone.trim() || senderPhone.length < 7) {
      showToast('Please enter a valid contact number.', 'error');
      return;
    }
    setSending(true);
    try {
      await sendPropertyInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyOwnerUid: property.ownerUid || property.createdBy || null,
        senderUid: user?.uid || null,
        senderName: senderName.trim() || user?.name || 'Prospective Buyer',
        senderEmail: user?.email || '',
        senderPhone: senderPhone.trim(),
        message
      });
      setIsSent(true);
      showToast(`Inquiry sent to ${agent.name}!`, 'success');
      setTimeout(() => onClose(), 2200);
    } catch (err) {
      console.error('[LOKHA ContactModal] Inquiry error:', err);
      showToast('Failed to deliver inquiry. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Contact Owner">
      <div className="modal-content contact-owner-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Contact Property Lister</h3>
            <p className="modal-subtitle">{property?.title || 'LOKHA Property'}</p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm modal-close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* ── Agent Mini Card ── */}
        <div className="agent-mini-card">
          <img src={agent.photo} alt={agent.name} className="agent-avatar" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(agent.name) + '&background=8A6346&color=fff'; }} />
          <div className="agent-mini-info">
            <div className="agent-mini-name-row">
              <span className="agent-name">{agent.name}</span>
              <span className="badge badge-verified"><ShieldCheck size={10} /> Verified</span>
            </div>
            <div className="agent-role">{agent.type}</div>
            <div className="agent-response-time">⚡ {agent.responseTime}</div>
          </div>
        </div>

        {/* ── Tab Switcher ── */}
        <div className="contact-tab-bar">
          <button
            type="button"
            className={`contact-tab ${activeTab === 'call' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('call')}
          >
            <Phone size={14} /> Call
          </button>
          <button
            type="button"
            className={`contact-tab ${activeTab === 'whatsapp' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <Smartphone size={14} /> WhatsApp
          </button>
          <button
            type="button"
            className={`contact-tab ${activeTab === 'inquiry' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('inquiry')}
          >
            <MessageSquare size={14} /> Inquiry
          </button>
        </div>

        {/* ── Tab Panels ── */}
        <div className="contact-tab-body">

          {/* CALL TAB */}
          {activeTab === 'call' && (
            <div className="contact-action-panel">
              <div className="phone-reveal-box">
                <div className="phone-reveal-label">Owner / Agent Phone</div>
                <div className="phone-reveal-number">{maskedPhone}</div>
                {!showPhone && (
                  <button type="button" className="btn-reveal-phone" onClick={handleRevealPhone}>
                    Reveal Number <ChevronRight size={14} />
                  </button>
                )}
              </div>
              <button type="button" className="btn-contact-action btn-call" onClick={handleCall}>
                <Phone size={18} />
                {user ? `Call ${agent.name.split(' ')[0]}` : 'Login to Call'}
              </button>
              <p className="contact-action-note">
                A direct phone call to the listed owner or verified partner agent.
              </p>
            </div>
          )}

          {/* WHATSAPP TAB */}
          {activeTab === 'whatsapp' && (
            <div className="contact-action-panel">
              <div className="quick-message-box">
                <div className="quick-msg-label">Your Message</div>
                <div className="quick-msg-chips">
                  {QUICK_MESSAGES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`quick-msg-chip ${message === q ? 'is-selected' : ''}`}
                      onClick={() => setMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className="btn-contact-action btn-whatsapp" onClick={handleWhatsApp}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.099 1.508 5.823L.057 23.2a.75.75 0 0 0 .926.926l5.377-1.451A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.649-.525-5.156-1.435l-.369-.223-3.833 1.034 1.034-3.833-.223-.369A9.975 9.975 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                {user ? 'Open WhatsApp' : 'Login to WhatsApp'}
              </button>
              <p className="contact-action-note">
                Sends a pre-written message to the agent's WhatsApp. Opens in WhatsApp app or web.
              </p>
            </div>
          )}

          {/* INQUIRY TAB */}
          {activeTab === 'inquiry' && (
            isSent ? (
              <div className="inquiry-success-state">
                <div className="inquiry-success-icon">
                  <CheckCircle2 size={40} />
                </div>
                <h4>Inquiry Delivered!</h4>
                <p>{agent.name} will contact you at <strong>{senderPhone}</strong> shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquiry}>
                <div className="inquiry-form-body">
                  {/* Quick message chips */}
                  <div>
                    <label className="form-label">Your Message</label>
                    <div className="quick-msg-chips" style={{ marginBottom: '8px' }}>
                      {QUICK_MESSAGES.slice(0, 3).map((q) => (
                        <button
                          key={q}
                          type="button"
                          className={`quick-msg-chip ${message === q ? 'is-selected' : ''}`}
                          onClick={() => setMessage(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      required
                    />
                  </div>

                  {/* Name */}
                  {!user && (
                    <div className="form-field" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="inq-name">Your Name</label>
                      <input
                        id="inq-name"
                        type="text"
                        className="form-input"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  )}

                  {/* Phone */}
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="inq-phone">Your Contact Number</label>
                    <input
                      id="inq-phone"
                      type="tel"
                      className="form-input"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+91 98450 00000"
                      required
                    />
                  </div>

                  {/* Safety Notice */}
                  <div className="safety-notice">
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>
                      <strong>Safety:</strong> Never transfer token money before inspecting the property, verifying ownership documents, and signing a formal agreement.
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-cta-teal" disabled={sending}>
                    {sending ? (
                      <>
                        <span className="spin-anim" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }} />
                        Sending…
                      </>
                    ) : (
                      <><Send size={14} /> Send Inquiry</>
                    )}
                  </button>
                </div>
              </form>
            )
          )}
        </div>

        {/* Safety footer for Call / WhatsApp tabs */}
        {activeTab !== 'inquiry' && (
          <div className="safety-notice" style={{ margin: '0 0 8px 0' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>
              <strong>Safety:</strong> Never pay advance fees before verifying property ownership and signing a formal agreement.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
