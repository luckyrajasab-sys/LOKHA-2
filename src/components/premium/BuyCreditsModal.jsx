import React, { useState } from 'react';
import { X, Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { subscriptionService, CREDIT_PACKAGES } from '../../services/subscriptionService';

export default function BuyCreditsModal({ initialPackageId, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState(initialPackageId || 'pkg-standard');
  const [loading, setLoading] = useState(false);

  const selectedPkg = CREDIT_PACKAGES.find((p) => p.id === selectedId) || CREDIT_PACKAGES[1];
  const gstAmount = Math.round(selectedPkg.price * 0.18);
  const totalAmount = selectedPkg.price + gstAmount;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await subscriptionService.buyCreditPackage(selectedPkg.id);
      showToast(`Success! ${selectedPkg.credits.toLocaleString('en-IN')} credits added to your wallet.`, 'success');
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

        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lokha-wood)' }}>
            LOKHA WALLET RECHARGE
          </span>
          <h2 style={{ margin: '4px 0 6px', fontSize: '1.45rem', fontFamily: 'var(--font-serif)', color: 'var(--lokha-primary)' }}>
            Buy Lokha Credits
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--lokha-muted)' }}>
            Credits never expire for active members and unlock direct owner contacts, reports, and site visits.
          </p>
        </div>

        {/* Packages Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {CREDIT_PACKAGES.map((pkg) => {
            const isSelected = pkg.id === selectedId;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                style={{
                  border: isSelected ? '2px solid var(--lokha-gold)' : '1px solid var(--lokha-border)',
                  background: isSelected ? 'rgba(184, 149, 106, 0.08)' : '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                {pkg.bonus && (
                  <span style={{ position: 'absolute', top: '-8px', right: '10px', background: '#15803D', color: '#FFFFFF', fontSize: '0.64rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                    {pkg.bonus}
                  </span>
                )}
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--lokha-primary)' }}>
                  {pkg.name}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lokha-primary)', margin: '4px 0' }}>
                  {pkg.credits.toLocaleString('en-IN')} <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--lokha-muted)' }}>credits</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lokha-wood)' }}>
                  ₹{pkg.price}
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Breakdown */}
        <div style={{ background: 'var(--lokha-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--lokha-border)', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--lokha-muted)' }}>Package Amount ({selectedPkg.name})</span>
            <span style={{ fontWeight: 600 }}>₹{selectedPkg.price}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--lokha-muted)' }}>GST (18%)</span>
            <span style={{ fontWeight: 600 }}>₹{gstAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: 'var(--lokha-primary)', paddingTop: '6px', borderTop: '1px dashed var(--lokha-border)' }}>
            <span>Total Payable</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handlePurchase}
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
          {loading ? 'Processing Payment...' : `Confirm & Recharge ₹${totalAmount}`}
          {!loading && <ArrowRight size={16} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.74rem', color: 'var(--lokha-muted)' }}>
          <Lock size={12} />
          <span>Instant credit activation. 100% money-back guarantee for failed transactions.</span>
        </div>
      </div>
    </div>
  );
}
