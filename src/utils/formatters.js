/**
 * Formats numbers into Indian Rupee denomination:
 * - ₹85 Lakh
 * - ₹1.2 Crore
 * - ₹42,000/month (for rental)
 */
export function formatIndianPrice(amount, purpose = 'sale') {
  if (!amount && amount !== 0) return 'Price on Request';
  
  if (purpose === 'rent') {
    return `₹${amount.toLocaleString('en-IN')}/month`;
  }

  if (purpose === 'lease') {
    if (amount >= 10000000) {
      const cr = amount / 10000000;
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr Lease`;
    }
    if (amount >= 100000) {
      const lakh = amount / 100000;
      return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh Lease`;
    }
    return `₹${amount.toLocaleString('en-IN')} Lease`;
  }

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Crore`;
  }
  
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculates estimated monthly EMI for Indian home loans
 * Standard assumptions: 80% LTV, 8.5% p.a., 20 years tenure
 */
export function calculateEstimatedEMI(propertyPrice, purpose = 'sale') {
  if (purpose === 'rent' || purpose === 'lease' || !propertyPrice) return null;

  const loanAmount = propertyPrice * 0.8;
  const annualInterestRate = 8.5;
  const monthlyRate = (annualInterestRate / 12) / 100;
  const tenureMonths = 240; // 20 years

  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  if (emi >= 100000) {
    return `₹${(emi / 100000).toFixed(1)}L estimated EMI`;
  }
  return `₹${Math.round(emi / 1000)}K estimated EMI`;
}

/**
 * Format price per sq ft
 */
export function formatPricePerSqFt(price, sqft) {
  if (!price || !sqft) return 'N/A';
  const pps = Math.round(price / sqft);
  return `₹${pps.toLocaleString('en-IN')} / sq ft`;
}

/**
 * Format Area
 */
export function formatArea(sqft) {
  if (!sqft) return 'N/A';
  return `${sqft.toLocaleString('en-IN')} sq ft`;
}
