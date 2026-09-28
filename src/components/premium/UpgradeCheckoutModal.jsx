import React, { useState } from 'react';
import { X, Check, ShieldCheck, CreditCard, Lock, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { subscriptionService } from '../../services/subscriptionService';

export default function UpgradeCheckoutModal({ plan, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  if (!plan) return null;

  const basePrice = plan.price;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gstAmount;

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await subscriptionService.upgradePlan(plan.id);
      showToast(`Congratulations! You are now upgraded to ${plan.name} Plan.`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Payment could not be completed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="premium-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lokha-muted)' }}
        >
          <X size={20} />
        </button>

        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lokha-wood)' }}>
            Confirm Plan Upgrade
          </span>
          <h2 style={{ margin: '4px 0 8px', fontSize: '1.45rem', fontFamily: 'var(--font-serif)', color: 'var(--lokha-primary)' }}>
            {plan.name} Plan Subscription
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--lokha-muted)' }}>
            {plan.tagline}
          </p>
        </div>

        {/* Benefits summary */}
        <div style={{ background: 'var(--lokha-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--lokha-border)', marginBottom: '18px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--lokha-primary)', display: 'block', marginBottom: '8px' }}>
            What you will receive immediately:
          </span>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.84rem', color: 'var(--lokha-muted)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <li><strong>{plan.credits} monthly credits</strong> automatically deposited</li>
            <li>Up to <strong>{plan.ownerContacts} direct owner contacts</strong></li>
            <li><strong>{plan.savedLimit === 9999 ? 'Unlimited' : plan.savedLimit} saved properties</strong> and alerts</li>
            {plan.visits > 0 && <li><strong>{plan.visits} scheduled site visits</strong> coordination</li>}
          </ul>
        </div>

        {/* Price Breakdown */}
        <div style={{ borderTop: '1px solid var(--lokha-border)', borderBottom: '1px solid var(--lokha-border)', padding: '14px 0', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--lokha-muted)' }}>Monthly Membership</span>
            <span style={{ fontWeight: 600 }}>₹{basePrice.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--lokha-muted)' }}>GST (18%)</span>
            <span style={{ fontWeight: 600 }}>₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--lokha-primary)', paddingTop: '6px', borderTop: '1px dashed var(--lokha-border)' }}>
            <span>Total Payable Today</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--lokha-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
            Select Payment Method
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: paymentMethod === 'upi' ? '2px solid var(--lokha-gold)' : '1px solid var(--lokha-border)',
                background: paymentMethod === 'upi' ? 'rgba(184,149,106,0.1)' : 'transparent',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                color: 'var(--lokha-primary)'
              }}
            >
              UPI (GPay / PhonePe)
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: paymentMethod === 'card' ? '2px solid var(--lokha-gold)' : '1px solid var(--lokha-border)',
                background: paymentMethod === 'card' ? 'rgba(184,149,106,0.1)' : 'transparent',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                color: 'var(--lokha-primary)'
              }}
            >
              Credit / Debit Card
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleConfirmPayment}
          disabled={loading}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '0.96rem',
            fontWeight: 700,
            borderRadius: '10px',
            background: 'var(--lokha-gold)',
            color: '#2F241F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Authorizing Payment...' : `Complete Payment of ₹${totalAmount}`}
          {!loading && <ArrowRight size={16} />}
        </button>

        {/* Security & Cancellation note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '0.74rem', color: 'var(--lokha-muted)' }}>
          <Lock size={12} />
          <span>256-Bit SSL Encrypted. Cancel subscription anytime with 1-click.</span>
        </div>
      </div>
    </div>
  );
}
