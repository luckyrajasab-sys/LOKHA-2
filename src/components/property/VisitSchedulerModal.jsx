import React, { useState } from 'react';
import { Calendar, Clock, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSaved } from '../../context/SavedContext';
import { useAuth } from '../../context/AuthContext';

export default function VisitSchedulerModal({ property, onClose }) {
  const { addScheduledVisit } = useSaved();
  const { user } = useAuth();

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [slot, setSlot] = useState('11:00 AM - 12:30 PM');
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '+91 98450 12345');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = [
    { id: 'morning', label: '10:00 AM - 11:30 AM', time: 'Morning' },
    { id: 'noon', label: '11:00 AM - 12:30 PM', time: 'Afternoon' },
    { id: 'afternoon', label: '03:00 PM - 04:30 PM', time: 'Afternoon' },
    { id: 'evening', label: '05:00 PM - 06:30 PM', time: 'Evening' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !mobile || !date) return;

    addScheduledVisit({
      propertyId: property.id,
      propertyTitle: property.title,
      locality: `${property.locality}, ${property.city}`,
      date,
      timeSlot: slot,
      agentName: property.agent?.name || 'Owner',
      visitorName: name,
      visitorMobile: mobile,
      notes
    });

    setIsSubmitted(true);
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
              Schedule a Site Visit
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {property.title}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-ghost btn-sm"
            aria-label="Close scheduler"
          >
            <X size={20} />
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: '#DCFCE7', 
                color: '#166534', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px auto' 
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h4 style={{ color: 'var(--color-primary-navy)', fontSize: '1.3rem', marginBottom: '8px' }}>
              Site Visit Confirmed!
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              We have notified {property.agent?.name || 'the property owner'}. A calendar invite and WhatsApp confirmation has been dispatched.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Select Date */}
              <div className="form-field">
                <label className="form-label" htmlFor="visit-date">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} color="var(--color-trust-blue)" />
                    Preferred Visit Date
                  </span>
                </label>
                <input 
                  id="visit-date"
                  type="date"
                  className="form-input"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Time Slots */}
              <div className="form-field">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} color="var(--color-trust-blue)" />
                    Choose Time Slot
                  </span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {timeSlots.map((ts) => (
                    <button
                      key={ts.id}
                      type="button"
                      className={`radio-card ${slot === ts.label ? 'active' : ''}`}
                      onClick={() => setSlot(ts.label)}
                      style={{ fontSize: '0.8rem', padding: '8px 10px', textAlign: 'center' }}
                    >
                      {ts.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visitor Details */}
              <div className="form-grid-2">
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="visitor-name">Your Full Name</label>
                  <input 
                    id="visitor-name"
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div className="form-field" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="visitor-mobile">Mobile Number</label>
                  <input 
                    id="visitor-mobile"
                    type="tel" 
                    className="form-input" 
                    value={mobile} 
                    onChange={(e) => setMobile(e.target.value)} 
                    placeholder="+91 98450 00000" 
                    required 
                  />
                </div>
              </div>

              {/* Trust banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--color-navy-tint)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--color-primary-navy)' }}>
                <ShieldCheck size={18} color="var(--color-trust-blue)" />
                <span>Zero brokerage on direct owner listings. Safe & verified visits guaranteed.</span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              {/* Primary Conversion Action - TEAL */}
              <button type="submit" className="btn btn-cta-teal">
                Book Site Visit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
