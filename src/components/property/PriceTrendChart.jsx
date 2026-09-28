import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function PriceTrendChart({ trend = [], currentPricePerSqFt }) {
  if (!trend || trend.length === 0) return null;

  const maxVal = Math.max(...trend.map((t) => t.pricePerSqFt));
  const minVal = Math.min(...trend.map((t) => t.pricePerSqFt));
  const growthRate = trend.length > 1 
    ? (((trend[trend.length - 1].pricePerSqFt - trend[0].pricePerSqFt) / trend[0].pricePerSqFt) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ background: 'var(--color-bg-page)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--color-border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            Locality Price Appreciation
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-navy)' }}>
            +{growthRate}% over 4 years
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#DCFCE7', color: '#166534', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
          <TrendingUp size={15} />
          <span>Bullish Trend</span>
        </div>
      </div>

      {/* SVG Bar / Area visualization */}
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '140px', gap: '20px', paddingTop: '20px', borderBottom: '2px solid var(--color-border)' }}>
        {trend.map((item, idx) => {
          const heightPct = Math.max(30, Math.round((item.pricePerSqFt / maxVal) * 100));
          const isLatest = idx === trend.length - 1;

          return (
            <div key={item.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: isLatest ? 'var(--color-cta-teal)' : 'var(--color-text-secondary)', marginBottom: '6px' }}>
                ₹{item.pricePerSqFt.toLocaleString('en-IN')}
              </span>
              <div 
                style={{ 
                  width: '100%', 
                  maxWidth: '44px',
                  height: `${heightPct}%`, 
                  background: isLatest ? 'var(--color-cta-teal)' : idx % 2 === 0 ? 'var(--color-primary-navy)' : 'var(--color-trust-blue)', 
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease'
                }} 
              />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '8px' }}>
                {item.year}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '8px', textAlign: 'right' }}>
        *Historical average rate per sq ft based on registered deeds in the sub-registrar office
      </div>
    </div>
  );
}
