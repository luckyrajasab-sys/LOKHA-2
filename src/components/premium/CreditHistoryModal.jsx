import React from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';

export default function CreditHistoryModal({ onClose }) {
  const transactions = subscriptionService.getTransactions();

  return (
    <div className="premium-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="premium-modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
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
            TRANSACTION AUDIT
          </span>
          <h2 style={{ margin: '4px 0 6px', fontSize: '1.45rem', fontFamily: 'var(--font-serif)', color: 'var(--lokha-primary)' }}>
            Credit Wallet History
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--lokha-muted)' }}>
            Transparent itemized record of earned bonuses, purchased packages, and redeemed actions.
          </p>
        </div>

        {/* Transactions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
          {transactions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--lokha-muted)', padding: '24px 0' }}>
              No credit transactions recorded yet.
            </p>
          ) : (
            transactions.map((tx) => {
              const isCredit = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--lokha-border)',
                    background: 'var(--lokha-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isCredit ? '#DCFCE7' : '#FEE2E2',
                        color: isCredit ? '#15803D' : '#DC2626'
                      }}
                    >
                      {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--lokha-primary)' }}>
                        {tx.description}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--lokha-muted)', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                        <span>{tx.date}</span>
                        {tx.expiresAt && (
                          <span style={{ color: '#D97706', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={11} /> Expires: {tx.expiresAt}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isCredit ? '#15803D' : '#DC2626' }}>
                    {isCredit ? `+${tx.amount}` : tx.amount}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
