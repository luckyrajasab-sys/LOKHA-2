import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Coins, 
  Award, 
  ArrowRight, 
  HelpCircle,
  TrendingUp,
  UserCheck,
  Building2,
  PhoneCall,
  Calendar,
  Lock,
  Layers
} from 'lucide-react';
import ScrollReveal from '../components/common/ScrollReveal';
import UpgradeCheckoutModal from '../components/premium/UpgradeCheckoutModal';
import BuyCreditsModal from '../components/premium/BuyCreditsModal';
import SubscriptionManageModal from '../components/premium/SubscriptionManageModal';
import CreditHistoryModal from '../components/premium/CreditHistoryModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  subscriptionService, 
  PLANS, 
  CREDIT_PACKAGES, 
  CREDIT_ACTIONS_LIST, 
  EARN_CREDITS_LIST 
} from '../services/subscriptionService';
import '../styles/premium.css';

export default function PremiumPage() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(subscriptionService.getWalletState());
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [buyPackageId, setBuyPackageId] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Subscribe to real-time wallet & subscription changes
  useEffect(() => {
    const unsubscribe = subscriptionService.subscribe((updatedWallet) => {
      setWallet(updatedWallet);
    });
    return () => unsubscribe();
  }, []);

  const isPaidUser = wallet.planId && wallet.planId !== 'free';
  const currentPlan = PLANS[wallet.planId?.toUpperCase()] || PLANS.FREE;

  // Intercept action if user is not authenticated
  const handleProtectedAction = (actionCallback) => {
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to view and manage plans.', 'info');
      navigate('/login');
      return;
    }
    actionCallback();
  };

  const handleOpenUpgrade = (plan) => {
    handleProtectedAction(() => {
      setSelectedPlanForUpgrade(plan);
    });
  };

  const handleOpenBuyCredits = (packageId = 'pkg-standard') => {
    handleProtectedAction(() => {
      setBuyPackageId(packageId);
    });
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const FAQS = [
    {
      q: 'What are Lokha Credits?',
      a: 'Credits are Lokha\'s internal utility points used for selected premium actions, such as revealing verified owner telephone numbers, downloading detailed micro-market reports, and requesting accompanied site visits.'
    },
    {
      q: 'Can I use Lokha for free?',
      a: 'Yes, absolutely. Free users can search, browse, view property photographs, apply filters, and receive 100 welcome credits to start contacting owners.'
    },
    {
      q: 'Do I need credits to browse properties?',
      a: 'No. Searching properties, viewing locations, saving properties within plan limits, and submitting inquiries do not consume any credits.'
    },
    {
      q: 'Can I buy credits without a subscription?',
      a: 'Yes. Any member can buy credit top-up packages (from ₹99 for 300 credits) whenever needed without an active monthly subscription.'
    },
    {
      q: 'Do premium users receive monthly credits?',
      a: 'Yes. Explorer members receive 500 credits/month, Plus members receive 1,500 credits/month, and Owner Pro members receive 2,000 credits/month.'
    },
    {
      q: 'Do unused credits expire?',
      a: 'Credits purchased or granted via active subscriptions remain valid for 12 months. Free promotional welcome credits expire after 6 months if unused.'
    },
    {
      q: 'Can I cancel my subscription?',
      a: 'Yes, at any time with 1-click in your Subscription Management section. You will retain your remaining credits and membership benefits until the end of your billing cycle.'
    },
    {
      q: 'Do credits guarantee a property deal?',
      a: 'No. Credits facilitate connections, visits, and reports, but do not guarantee property availability, lease agreements, or financial transactions.'
    }
  ];

  return (
    <div className="premium-page">
      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="premium-hero" aria-label="Premium Membership Header">
        <div className="container">
          <ScrollReveal direction="down" duration={0.5}>
            <div className="premium-hero-badge">
              <Crown size={15} color="var(--lokha-gold)" />
              <span>Lokha Membership & Utility Credits</span>
            </div>

            <h1 className="premium-hero-title">
              Find Your Property. Get More With Lokha.
            </h1>

            <p className="premium-hero-subtitle">
              Upgrade your property search with more contacts, smarter recommendations, price insights, alerts, and premium tools.
            </p>

            {/* Quick Persona Switcher for demonstration & verification */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'rgba(184, 149, 106, 0.12)', borderRadius: '20px', border: '1px solid var(--lokha-border)', marginBottom: '16px', fontSize: '0.74rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--lokha-wood)', textTransform: 'uppercase' }}>Preview Tier:</span>
              <button type="button" onClick={() => subscriptionService.setPlanDirectly('free')} style={{ background: wallet.planId === 'free' ? 'var(--lokha-gold)' : 'transparent', color: wallet.planId === 'free' ? '#2F241F' : 'inherit', border: 'none', borderRadius: '12px', padding: '2px 8px', fontWeight: 600, cursor: 'pointer' }}>Free</button>
              <button type="button" onClick={() => subscriptionService.setPlanDirectly('explorer')} style={{ background: wallet.planId === 'explorer' ? 'var(--lokha-gold)' : 'transparent', color: wallet.planId === 'explorer' ? '#2F241F' : 'inherit', border: 'none', borderRadius: '12px', padding: '2px 8px', fontWeight: 600, cursor: 'pointer' }}>Explorer</button>
              <button type="button" onClick={() => subscriptionService.setPlanDirectly('plus')} style={{ background: wallet.planId === 'plus' ? 'var(--lokha-gold)' : 'transparent', color: wallet.planId === 'plus' ? '#2F241F' : 'inherit', border: 'none', borderRadius: '12px', padding: '2px 8px', fontWeight: 600, cursor: 'pointer' }}>Plus</button>
              <button type="button" onClick={() => subscriptionService.setPlanDirectly('owner_pro')} style={{ background: wallet.planId === 'owner_pro' ? 'var(--lokha-gold)' : 'transparent', color: wallet.planId === 'owner_pro' ? '#2F241F' : 'inherit', border: 'none', borderRadius: '12px', padding: '2px 8px', fontWeight: 600, cursor: 'pointer' }}>Owner Pro</button>
            </div>

            {/* User Live Status Card */}
            <div className="user-status-card">
              <div className="status-stat-group">
                <div className="status-stat-item">
                  <span className="status-stat-label">Current Plan</span>
                  <div className="status-stat-val">
                    <span>{currentPlan.name}</span>
                    <span className={`status-pill ${isPaidUser ? 'status-pill-premium' : 'status-pill-free'}`}>
                      {isPaidUser ? 'Premium Active' : 'Basic Tier'}
                    </span>
                  </div>
                </div>

                <div className="status-stat-item">
                  <span className="status-stat-label">Available Credits</span>
                  <div className="status-stat-val" style={{ color: 'var(--lokha-wood)' }}>
                    <Coins size={22} color="var(--lokha-gold)" />
                    <span>{wallet.credits.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {isPaidUser && wallet.daysToRenewal && (
                  <div className="status-stat-item">
                    <span className="status-stat-label">Billing Cycle</span>
                    <div className="status-stat-val" style={{ fontSize: '1.05rem', color: '#15803D' }}>
                      <Clock size={16} />
                      <span>Renews in {wallet.daysToRenewal} days</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="status-actions-group">
                <button
                  type="button"
                  onClick={() => isPaidUser ? setIsManageModalOpen(true) : handleOpenUpgrade(PLANS.EXPLORER)}
                  className="btn btn-primary"
                  style={{
                    background: 'var(--lokha-gold)',
                    color: '#2F241F',
                    fontWeight: 700,
                    padding: '12px 24px',
                    borderRadius: '10px'
                  }}
                >
                  {isPaidUser ? 'Manage Subscription' : 'Upgrade Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenBuyCredits('pkg-standard')}
                  className="btn btn-outline"
                  style={{ padding: '12px 20px', borderRadius: '10px', fontWeight: 600 }}
                >
                  Buy Credits
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PREMIUM USER ACTIVE DASHBOARD (For Paid Subscribers) ───── */}
      {isPaidUser && (
        <section style={{ padding: '36px 0 0' }}>
          <div className="container">
            <div className="dashboard-usage-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lokha-wood)', fontWeight: 700 }}>
                    Member Activity & Limits
                  </span>
                  <h3 style={{ margin: '2px 0 0', fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--lokha-primary)' }}>
                    Welcome back — {currentPlan.name} Membership
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--lokha-muted)' }}>
                    Next renewal on <strong>{wallet.renewalDate || 'Next month'}</strong>. All unused credits roll over.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="btn btn-outline btn-sm"
                  >
                    View Credit History
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsManageModalOpen(true)}
                    className="btn btn-outline btn-sm"
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>

              {/* Progress bars grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Owner Contacts</span>
                    <span>{wallet.usage?.ownerContacts || 0} / {currentPlan.ownerContacts}</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(100, ((wallet.usage?.ownerContacts || 0) / currentPlan.ownerContacts) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Property Visits</span>
                    <span>{wallet.usage?.propertyVisits || 0} / {currentPlan.visits}</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${currentPlan.visits > 0 ? Math.min(100, ((wallet.usage?.propertyVisits || 0) / currentPlan.visits) * 100) : 0}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Saved Properties</span>
                    <span>{wallet.usage?.savedProperties || 0} / {currentPlan.savedLimit === 9999 ? '∞' : currentPlan.savedLimit}</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${currentPlan.savedLimit === 9999 ? 25 : Math.min(100, ((wallet.usage?.savedProperties || 0) / currentPlan.savedLimit) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PLANS & TIERS SECTION ──────────────────────────────────── */}
      <section style={{ padding: '60px 0 40px' }}>
        <div className="container">
          <div className="premium-section-header">
            <span className="premium-section-tag">MEMBERSHIP TIERS</span>
            <h2 className="premium-section-title">Transparent Plans for Every Need</h2>
            <p className="premium-section-desc">
              Choose the right tier for your home hunting journey. Cancel or switch anytime.
            </p>
          </div>

          <div className="plans-grid">
            {/* 1. FREE PLAN */}
            <div className="plan-card">
              <h3 className="plan-name">Free</h3>
              <p className="plan-tagline">{PLANS.FREE.tagline}</p>
              
              <div className="plan-price-row">
                <span className="plan-currency">₹</span>
                <span className="plan-price">0</span>
                <span className="plan-period">/ forever</span>
              </div>

              <ul className="plan-features-list">
                {PLANS.FREE.features.map((feat) => (
                  <li key={feat} className="plan-feature-item">
                    <Check size={16} className="plan-feature-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {wallet.planId === 'free' ? (
                <button type="button" className="btn-plan-action btn-plan-current" disabled>
                  Current Plan
                </button>
              ) : (
                <button type="button" onClick={() => setIsManageModalOpen(true)} className="btn-plan-action btn-plan-outline">
                  Downgrade to Free
                </button>
              )}
            </div>

            {/* 2. EXPLORER PLAN */}
            <div className="plan-card is-popular">
              <span className="plan-badge-top">{PLANS.EXPLORER.badge}</span>
              <h3 className="plan-name">{PLANS.EXPLORER.name}</h3>
              <p className="plan-tagline">{PLANS.EXPLORER.tagline}</p>
              
              <div className="plan-price-row">
                <span className="plan-currency">₹</span>
                <span className="plan-price">{PLANS.EXPLORER.price}</span>
                <span className="plan-period">{PLANS.EXPLORER.period}</span>
              </div>

              <ul className="plan-features-list">
                {PLANS.EXPLORER.features.map((feat) => (
                  <li key={feat} className="plan-feature-item">
                    <Check size={16} className="plan-feature-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {wallet.planId === 'explorer' ? (
                <button type="button" className="btn-plan-action btn-plan-current" disabled>
                  Current Plan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenUpgrade(PLANS.EXPLORER)}
                  className="btn-plan-action btn-plan-primary"
                >
                  Upgrade to Explorer
                </button>
              )}
            </div>

            {/* 3. PLUS PLAN */}
            <div className="plan-card">
              <span className="plan-badge-top" style={{ background: '#2F241F', color: '#F7F3ED', border: '1px solid var(--lokha-gold)' }}>
                {PLANS.PLUS.badge}
              </span>
              <h3 className="plan-name">{PLANS.PLUS.name}</h3>
              <p className="plan-tagline">{PLANS.PLUS.tagline}</p>
              
              <div className="plan-price-row">
                <span className="plan-currency">₹</span>
                <span className="plan-price">{PLANS.PLUS.price}</span>
                <span className="plan-period">{PLANS.PLUS.period}</span>
              </div>

              <ul className="plan-features-list">
                {PLANS.PLUS.features.map((feat) => (
                  <li key={feat} className="plan-feature-item">
                    <Check size={16} className="plan-feature-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {wallet.planId === 'plus' ? (
                <button type="button" className="btn-plan-action btn-plan-current" disabled>
                  Current Plan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenUpgrade(PLANS.PLUS)}
                  className="btn-plan-action btn-plan-primary"
                >
                  Upgrade to Plus
                </button>
              )}
            </div>

            {/* 4. OWNER PRO PLAN */}
            <div className="plan-card" style={{ background: 'var(--lokha-surface-warm)' }}>
              <span className="plan-badge-top" style={{ background: 'var(--lokha-wood)', color: '#FFFFFF' }}>
                {PLANS.OWNER_PRO.badge}
              </span>
              <h3 className="plan-name">{PLANS.OWNER_PRO.name}</h3>
              <p className="plan-tagline">{PLANS.OWNER_PRO.tagline}</p>
              
              <div className="plan-price-row">
                <span className="plan-currency">₹</span>
                <span className="plan-price">{PLANS.OWNER_PRO.price}</span>
                <span className="plan-period">{PLANS.OWNER_PRO.period}</span>
              </div>

              <ul className="plan-features-list">
                {PLANS.OWNER_PRO.features.map((feat) => (
                  <li key={feat} className="plan-feature-item">
                    <Check size={16} className="plan-feature-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {wallet.planId === 'owner_pro' ? (
                <button type="button" className="btn-plan-action btn-plan-current" disabled>
                  Current Plan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenUpgrade(PLANS.OWNER_PRO)}
                  className="btn-plan-action btn-plan-primary"
                  style={{ background: 'var(--lokha-wood)', color: '#FFFFFF' }}
                >
                  Upgrade to Owner Pro
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── LOKHA CREDITS EXPLANATION & ACTION MATRIX ───────────────── */}
      <section style={{ padding: '40px 0', background: 'rgba(184, 149, 106, 0.05)', borderTop: '1px solid var(--lokha-border)', borderBottom: '1px solid var(--lokha-border)' }}>
        <div className="container">
          <div className="premium-section-header">
            <span className="premium-section-tag">UTILITY POINT ECONOMY</span>
            <h2 className="premium-section-title">Use Credits When You Need More</h2>
            <p className="premium-section-desc">
              Credits are Lokha's internal points for selected premium actions. Normal browsing and basic property discovery remain completely free.
            </p>
          </div>

          {/* Action credit costs table */}
          <div className="table-responsive-wrapper">
            <table className="premium-data-table">
              <thead>
                <tr>
                  <th>Platform Action</th>
                  <th>Description / Context</th>
                  <th style={{ textAlign: 'right' }}>Credits Required</th>
                </tr>
              </thead>
              <tbody>
                {CREDIT_ACTIONS_LIST.map((item) => (
                  <tr key={item.action}>
                    <td>
                      <strong>{item.action}</strong>
                    </td>
                    <td style={{ color: 'var(--lokha-muted)' }}>{item.note}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="credit-badge-val">
                        <Coins size={12} />
                        {item.credits} Credits
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Free browsing callout box */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--lokha-border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(47, 36, 31, 0.04)' }}>
            <ShieldCheck size={24} color="#15803D" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--lokha-primary)', lineHeight: 1.5 }}>
              <strong>Zero Hidden Charges:</strong> Browsing properties, applying basic search filters, saving favourite homes, viewing verified photos and maps, and reporting suspicious listings do not consume any credits.
            </p>
          </div>
        </div>
      </section>

      {/* ── BUY CREDITS PACKAGES ───────────────────────────────────── */}
      <section style={{ padding: '60px 0 40px' }}>
        <div className="container">
          <div className="premium-section-header">
            <span className="premium-section-tag">ONE-TIME TOP-UPS</span>
            <h2 className="premium-section-title">Buy Credits Without Subscription</h2>
            <p className="premium-section-desc">
              Recharge your wallet whenever you want. Top-up credits never expire for active members.
            </p>
          </div>

          <div className="packages-grid">
            {CREDIT_PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`package-card ${pkg.isPopular ? 'is-popular' : ''}`}>
                {pkg.bonus && (
                  <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#15803D', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                    {pkg.bonus}
                  </span>
                )}
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--lokha-wood)', textTransform: 'uppercase' }}>
                  {pkg.name} Package
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--lokha-primary)', margin: '6px 0 2px' }}>
                  {pkg.credits.toLocaleString('en-IN')}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lokha-muted)', marginLeft: '6px' }}>credits</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--lokha-muted)', marginBottom: '14px' }}>
                  {pkg.costPerCredit}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--lokha-muted)', margin: '0 0 20px', minHeight: '36px' }}>
                  {pkg.tagline}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--lokha-border)', paddingTop: '14px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lokha-primary)' }}>
                    ₹{pkg.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenBuyCredits(pkg.id)}
                    className="btn btn-outline btn-sm"
                    style={{ fontWeight: 700 }}
                  >
                    Buy Credits
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARN CREDITS SECTION ───────────────────────────────────── */}
      <section style={{ padding: '50px 0', background: 'var(--lokha-surface-warm)', borderTop: '1px solid var(--lokha-border)' }}>
        <div className="container">
          <div className="premium-section-header">
            <span className="premium-section-tag">CONTRIBUTE & EARN</span>
            <h2 className="premium-section-title">Earn Credits Through Genuine Activity</h2>
            <p className="premium-section-desc">
              Help maintain platform safety, complete profile verifications, and earn free credits every week.
            </p>
          </div>

          <div className="table-responsive-wrapper">
            <table className="premium-data-table">
              <thead>
                <tr>
                  <th>Platform Activity</th>
                  <th>Frequency & Eligibility</th>
                  <th style={{ textAlign: 'right' }}>Credit Reward</th>
                </tr>
              </thead>
              <tbody>
                {EARN_CREDITS_LIST.map((item) => (
                  <tr key={item.activity}>
                    <td>
                      <strong>{item.activity}</strong>
                    </td>
                    <td style={{ color: 'var(--lokha-muted)' }}>{item.frequency}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ color: '#15803D', fontWeight: 800, fontSize: '0.92rem' }}>
                        +{item.reward} Credits
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--lokha-muted)', textAlign: 'center', marginTop: '14px' }}>
            * Daily login credits are capped at 25 credits per calendar month. Referral rewards require genuine OTP-verified accounts. Abuse or duplicate account creation leads to immediate wallet forfeiture.
          </div>
        </div>
      </section>

      {/* ── CREDIT WALLET SUMMARY SECTION (Logged-in view) ─────────── */}
      {isAuthenticated && (
        <section style={{ padding: '60px 0 40px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span className="premium-section-tag">YOUR ACCOUNT WALLET</span>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.9rem', color: 'var(--lokha-primary)' }}>
                  Lokha Credit Wallet
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(true)}
                className="btn btn-outline"
                style={{ fontWeight: 600, fontSize: '0.88rem' }}
              >
                View Credit History
              </button>
            </div>

            <div className="wallet-stats-grid">
              <div className="wallet-stat-card">
                <span className="status-stat-label">Available Balance</span>
                <div className="wallet-stat-number" style={{ color: 'var(--lokha-wood)' }}>
                  {wallet.credits.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--lokha-muted)' }}>Ready for immediate actions</span>
              </div>

              <div className="wallet-stat-card">
                <span className="status-stat-label">Earned This Month</span>
                <div className="wallet-stat-number" style={{ color: '#15803D' }}>
                  +{wallet.earnedThisMonth}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--lokha-muted)' }}>From activities & plan quota</span>
              </div>

              <div className="wallet-stat-card">
                <span className="status-stat-label">Used This Month</span>
                <div className="wallet-stat-number" style={{ color: '#DC2626' }}>
                  -{wallet.usedThisMonth}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--lokha-muted)' }}>On owner contacts & reports</span>
              </div>

              <div className="wallet-stat-card">
                <span className="status-stat-label">Expiring Soon</span>
                <div className="wallet-stat-number" style={{ color: '#D97706' }}>
                  {wallet.expiringSoon}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--lokha-muted)' }}>Next 60 days</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── COMPREHENSIVE PLAN COMPARISON TABLE ─────────────────────── */}
      <section style={{ padding: '60px 0', background: '#FFFFFF', borderTop: '1px solid var(--lokha-border)' }}>
        <div className="container">
          <div className="premium-section-header">
            <span className="premium-section-tag">SIDE BY SIDE</span>
            <h2 className="premium-section-title">Complete Plan Feature Comparison</h2>
            <p className="premium-section-desc">
              Detailed breakdown of features across Free, Explorer, Plus, and Owner Pro.
            </p>
          </div>

          <div className="table-responsive-wrapper">
            <table className="premium-data-table" style={{ minWidth: '720px' }}>
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>Feature</th>
                  <th style={{ textAlign: 'center' }}>Free</th>
                  <th style={{ textAlign: 'center' }}>Explorer</th>
                  <th style={{ textAlign: 'center' }}>Plus</th>
                  <th style={{ textAlign: 'center' }}>Owner Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Property search & filters</strong></td>
                  <td style={{ textAlign: 'center' }}>✓ Full</td>
                  <td style={{ textAlign: 'center' }}>✓ Full</td>
                  <td style={{ textAlign: 'center' }}>✓ Full</td>
                  <td style={{ textAlign: 'center' }}>✓ Full</td>
                </tr>
                <tr>
                  <td><strong>Saved properties limit</strong></td>
                  <td style={{ textAlign: 'center' }}>20</td>
                  <td style={{ textAlign: 'center' }}>100</td>
                  <td style={{ textAlign: 'center' }}>Unlimited</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                </tr>
                <tr>
                  <td><strong>Compare homes side-by-side</strong></td>
                  <td style={{ textAlign: 'center' }}>3</td>
                  <td style={{ textAlign: 'center' }}>10</td>
                  <td style={{ textAlign: 'center' }}>Unlimited</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                </tr>
                <tr>
                  <td><strong>Monthly credits quota</strong></td>
                  <td style={{ textAlign: 'center' }}>100 (welcome)</td>
                  <td style={{ textAlign: 'center' }}>500 / mo</td>
                  <td style={{ textAlign: 'center' }}>1,500 / mo</td>
                  <td style={{ textAlign: 'center' }}>2,000 / mo</td>
                </tr>
                <tr>
                  <td><strong>Owner & Agent contacts</strong></td>
                  <td style={{ textAlign: 'center' }}>3</td>
                  <td style={{ textAlign: 'center' }}>15</td>
                  <td style={{ textAlign: 'center' }}>40</td>
                  <td style={{ textAlign: 'center' }}>Lead CRM Tools</td>
                </tr>
                <tr>
                  <td><strong>Price change alerts</strong></td>
                  <td style={{ textAlign: 'center' }}>Basic</td>
                  <td style={{ textAlign: 'center' }}>Instant</td>
                  <td style={{ textAlign: 'center' }}>Advanced WhatsApp</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                </tr>
                <tr>
                  <td><strong>Locality price & trends data</strong></td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>Basic</td>
                  <td style={{ textAlign: 'center' }}>Advanced 5-Year</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                </tr>
                <tr>
                  <td><strong>AI property shortlist generator</strong></td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>✓ Included</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                </tr>
                <tr>
                  <td><strong>Guided property-visit requests</strong></td>
                  <td style={{ textAlign: 'center' }}>Limited</td>
                  <td style={{ textAlign: 'center' }}>2 / month</td>
                  <td style={{ textAlign: 'center' }}>5 / month</td>
                  <td style={{ textAlign: 'center' }}>✓ Host Tools</td>
                </tr>
                <tr>
                  <td><strong>Active listings promotion</strong></td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>✓ 5 Listings</td>
                </tr>
                <tr>
                  <td><strong>Buyer enquiry analytics</strong></td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>—</td>
                  <td style={{ textAlign: 'center' }}>✓ Included</td>
                </tr>
                <tr>
                  <td><strong>Priority support response</strong></td>
                  <td style={{ textAlign: 'center' }}>Community</td>
                  <td style={{ textAlign: 'center' }}>Email & Chat</td>
                  <td style={{ textAlign: 'center' }}>Dedicated Concierge</td>
                  <td style={{ textAlign: 'center' }}>Phone & Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TRUST & SAFETY SECTION ─────────────────────────────────── */}
      <section className="container">
        <div className="trust-safety-banner">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <ShieldCheck size={32} color="var(--lokha-wood)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', color: 'var(--lokha-primary)', fontFamily: 'var(--font-serif)' }}>
                Trust, Transparency & Member Safety
              </h3>
              <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: 'var(--lokha-muted)', lineHeight: 1.6 }}>
                <strong>Your credits are used for platform actions and do not guarantee a successful property transaction, genuine leads, or property ownership.</strong>
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.84rem', color: 'var(--lokha-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Owner contact details are shared strictly in accordance with user consent and platform privacy guidelines.</li>
                <li>If a telephone number is unreachable or reported as invalid within 48 hours, credit restoration is automatically reviewed.</li>
                <li>All applicable GST (18%) and itemized price breakdowns are clearly displayed prior to any payment authorization.</li>
                <li>Subscriptions can be cancelled anytime with zero penalty; credits already earned remain in your wallet.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ────────────────────────────────────────────── */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div className="premium-section-header">
            <span className="premium-section-tag">QUESTIONS & ANSWERS</span>
            <h2 className="premium-section-title">Frequently Asked Questions</h2>
            <p className="premium-section-desc">
              Everything you need to know about Lokha membership tiers and credit usage.
            </p>
          </div>

          <div className="faq-accordion-list">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.q} className="faq-item">
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MODALS ─────────────────────────────────────────────────── */}
      {selectedPlanForUpgrade && (
        <UpgradeCheckoutModal
          plan={selectedPlanForUpgrade}
          onClose={() => setSelectedPlanForUpgrade(null)}
          onSuccess={() => setWallet(subscriptionService.getWalletState())}
        />
      )}

      {buyPackageId && (
        <BuyCreditsModal
          initialPackageId={buyPackageId}
          onClose={() => setBuyPackageId(null)}
          onSuccess={() => setWallet(subscriptionService.getWalletState())}
        />
      )}

      {isManageModalOpen && (
        <SubscriptionManageModal
          wallet={wallet}
          onClose={() => setIsManageModalOpen(false)}
          onRefresh={() => setWallet(subscriptionService.getWalletState())}
          onOpenUpgrade={() => handleOpenUpgrade(PLANS.PLUS)}
        />
      )}

      {isHistoryModalOpen && (
        <CreditHistoryModal
          onClose={() => setIsHistoryModalOpen(false)}
        />
      )}
    </div>
  );
}
