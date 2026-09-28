import React from 'react';
import { formatIndianPrice, calculateEstimatedEMI } from '../../utils/formatters';

export default function PriceDisplay({ price, purpose = 'sale', showEMI = true, className = '' }) {
  const formattedPrice = formatIndianPrice(price, purpose);
  const emiText = showEMI && purpose === 'sale' ? calculateEstimatedEMI(price, purpose) : null;

  return (
    <div className={`price-display-wrapper ${className}`}>
      <span className="property-card-price">{formattedPrice}</span>
      {emiText && <span className="property-card-emi">{emiText}</span>}
    </div>
  );
}
