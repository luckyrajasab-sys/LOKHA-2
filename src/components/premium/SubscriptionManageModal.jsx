import React, { useState } from 'react';
import { X, Calendar, ShieldCheck, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { subscriptionService, PLANS } from '../../services/subscriptionService';

export default function SubscriptionManageModal({ wallet, onClose, onRefresh, onOpenUpgrade }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const plan = PLANS[wallet.planId?.toUpperCase()] || PLANS.FREE;

  const handleCancel = async () => {
    setLoading(true);
    try {
      await subscriptionService.cancelSubscription();
      showToast('Your subscription will not renew next month. Existing credits remain valid.', 'info');
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      showToast(err.message || 'Could not cancel subscription', 'error');
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
            MEMBERSHIP MANAGEMENT
          </span>
          <h2 style={{ margin: '4px 0 6px', fontSize: '1.45rem', fontFamily: 'var(--font-serif)', color: 'var(--lokha-primary)' }}>
            Manage Your Subscription
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--lokha-muted)' }}>
            Review your renewal timeline, change tier, or manage payment options.
          </p>
        </div>

        {/* Current status card */}
        <div style={{ background: 'var(--lokha-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--lokha-border)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--lokha-muted)', fontWeight: 700 }}>Current Tier</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--lokha-primary)', fontFamily: 'var(--font-serif)' }}>{plan.name} Plan</h3>
            </div>
            <span style={{ background: wallet.status === 'active' ? '#DCFCE7' : '#FEF3C7', color: wallet.status === 'active' ? '#15803D' : '#D97706', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
              {wallet.status === 'active' ? 'Active' : 'Cancelled'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', color: 'var(--lokha-muted)', borderTop: '1px solid var(--lokha-border)', paddingTop: '10px' }}>
            <div>
              <span>Monthly Price:</span>
              <strong style={{ display: 'block', color: 'var(--lokha-primary)' }}>₹{plan.price} / month</strong>
            </div>
            <div>
              <span>Next Renewal Date:</span>
              <strong style={{ display: 'block', color: 'var(--lokha-primary)' }}>{wallet.renewalDate || 'N/A (Free Plan)'}</strong>
            </div>
          </div>
        </div>

        {/* Action options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenUpgrade) onOpenUpgrade();
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--lokha-gold)', color: '#2F241F', fontWeight: 700, fontSize: '0.88rem' }}
          >
            Switch to Another Plan
          </button>

          {wallet.planId !== 'free' && wallet.status === 'active' && (
            confirmCancel ? (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 10px', fontSize: '0.84rem', color: '#991B1B', fontWeight: 600 }}>
                  Are you sure? You will retain your remaining credits until the end of your current cycle.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmCancel(false)}
                    style={{ background: 'transparent', border: '1px solid #D1D5DB', padding: '8px 14px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Keep Subscription
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', padding: '8px' }}
              >
                Cancel Subscription
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
