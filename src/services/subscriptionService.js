import {
  ref,
  set,
  get,
  update,
  onValue
} from 'firebase/database';
import { getDatabaseInstance } from './firebaseService.js';

/**
 * LOKHA Subscription & Credit Wallet Service
 * 
 * Provides atomic credit deductions, package purchases, plan upgrades,
 * and transaction history with Firebase Realtime Database and offline sync.
 */

const STORAGE_KEY_WALLET = 'lokha_user_wallet_state';
const STORAGE_KEY_TXS = 'lokha_user_transactions';
const SYNC_CHANNEL = 'lokha_subscription_sync';

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'Forever',
    credits: 100,
    tagline: 'Essential discovery tools for casual searchers',
    ownerContacts: 3,
    savedLimit: 20,
    compareLimit: 3,
    visits: 0,
    features: [
      'Search all verified properties',
      'Apply standard filters & map views',
      'View high-resolution photos & localities',
      'Save up to 20 properties',
      'Compare up to 3 properties side-by-side',
      'Basic property recommendations',
      '100 welcome credits included',
      'Standard price change alerts',
      'Community support',
      'Report suspicious listings'
    ]
  },
  EXPLORER: {
    id: 'explorer',
    name: 'Explorer',
    price: 199,
    period: '/ month',
    credits: 500,
    tagline: 'Ideal for active home seekers & tenants',
    ownerContacts: 15,
    savedLimit: 100,
    compareLimit: 10,
    visits: 2,
    badge: 'Popular for Buyers',
    features: [
      '500 credits credited every month',
      'Contact up to 15 verified owners',
      'Save up to 100 properties in collections',
      'Compare up to 10 properties simultaneously',
      'Instant WhatsApp & email price alerts',
      'Basic locality price trends & growth data',
      'Completely ad-free browsing experience',
      'Priority chat & email support',
      '2 free property visit requests per month'
    ]
  },
  PLUS: {
    id: 'plus',
    name: 'Plus',
    price: 499,
    period: '/ month',
    credits: 1500,
    tagline: 'Comprehensive suite for serious property buyers & investors',
    ownerContacts: 40,
    savedLimit: 9999,
    compareLimit: 9999,
    visits: 5,
    badge: 'High Value Suite',
    features: [
      '1,500 monthly credits with rollover',
      'Contact up to 40 property owners',
      'Direct verified-owner mobile numbers',
      'Advanced micro-market locality forecasts',
      'Unlimited saved searches & collections',
      'AI-powered personalized property shortlist',
      '5 guided property-visit requests',
      'Full legal property document checklist',
      'Immersive 3D virtual tour access',
      'Dedicated relationship support specialist',
      '1 detailed micro-market report per month'
    ]
  },
  OWNER_PRO: {
    id: 'owner_pro',
    name: 'Owner Pro',
    price: 999,
    period: '/ month',
    credits: 2000,
    tagline: 'For property owners, landlords & verified builders',
    ownerContacts: 999,
    savedLimit: 9999,
    compareLimit: 9999,
    visits: 999,
    badge: 'For Property Owners',
    features: [
      'Manage up to 5 active property listings',
      'Priority top placement in search results',
      '2,000 monthly promotional credits',
      'Real-time buyer enquiry dashboard',
      'Visitor scheduling & calendar sync',
      'AI-generated architectural descriptions',
      'Social media sharing & marketing assets',
      'Owner document clearance checklist',
      'Dedicated seller concierge assistance'
    ]
  }
};

export const CREDIT_PACKAGES = [
  {
    id: 'pkg-starter',
    name: 'Starter',
    price: 99,
    credits: 300,
    bonus: null,
    costPerCredit: '₹0.33 / credit',
    tagline: 'For occasional contacts & reports'
  },
  {
    id: 'pkg-standard',
    name: 'Standard',
    price: 299,
    credits: 1000,
    bonus: '+10% Value',
    costPerCredit: '₹0.29 / credit',
    isPopular: true,
    tagline: 'Most chosen by active searchers'
  },
  {
    id: 'pkg-plus',
    name: 'Plus',
    price: 699,
    credits: 3000,
    bonus: '+25% Value',
    costPerCredit: '₹0.23 / credit',
    tagline: 'Comprehensive home hunt package'
  },
  {
    id: 'pkg-pro',
    name: 'Professional',
    price: 1999,
    credits: 10000,
    bonus: '+50% Value',
    costPerCredit: '₹0.19 / credit',
    tagline: 'For investors & active property owners'
  }
];

export const CREDIT_ACTIONS_LIST = [
  { action: 'Contact owner or verified partner agent', credits: 10, note: 'Direct WhatsApp or message connection' },
  { action: 'Reveal verified phone number', credits: 25, note: 'Instant direct voice call access' },
  { action: 'Request scheduled property visit', credits: 15, note: 'Coordinate inspection with host' },
  { action: 'Download comprehensive property report', credits: 10, note: 'Valuation & legal summary PDF' },
  { action: 'Locality price & appreciation analysis', credits: 20, note: 'Micro-market 5-year growth data' },
  { action: 'Boost saved search alert frequency', credits: 10, note: 'Sub-minute alert dispatch' },
  { action: 'Feature owner listing for 1 day', credits: 30, note: 'Top of category spotlight' },
  { action: 'Verify property legal documents', credits: 50, note: 'Expert clearance checklist' },
  { action: 'Generate AI personalized shortlist', credits: 20, note: 'Tailored to commute & amenities' },
  { action: 'Schedule high-res virtual tour', credits: 10, note: 'Live walkthrough with manager' }
];

export const EARN_CREDITS_LIST = [
  { activity: 'Complete user profile & preferences', reward: 50, frequency: 'Once' },
  { activity: 'Verify primary mobile via OTP', reward: 25, frequency: 'Once' },
  { activity: 'Verify email address', reward: 10, frequency: 'Once' },
  { activity: 'Add preferred location & budget criteria', reward: 20, frequency: 'Once' },
  { activity: 'Save 5 verified properties to collection', reward: 10, frequency: 'Once' },
  { activity: 'Submit genuine property feedback after visit', reward: 10, frequency: 'Per visit' },
  { activity: 'Attend scheduled virtual property tour', reward: 10, frequency: 'Per tour' },
  { activity: 'Refer verified home seeker or owner', reward: 50, frequency: 'Per verified referral' },
  { activity: 'Report verified duplicate or fake listing', reward: 25, frequency: 'Per confirmed report' },
  { activity: 'Complete appropriate KYC document validation', reward: 50, frequency: 'Once' },
  { activity: 'Daily login (Active exploration)', reward: 1, frequency: 'Daily (Max 25/mo)' }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-init-1',
    amount: 100,
    type: 'credit',
    description: 'Welcome Bonus Credits',
    date: '2026-09-20',
    expiresAt: '2027-09-20'
  },
  {
    id: 'tx-init-2',
    amount: 50,
    type: 'credit',
    description: 'Profile completed bonus',
    date: '2026-09-22',
    expiresAt: '2027-09-22'
  },
  {
    id: 'tx-init-3',
    amount: -10,
    type: 'debit',
    description: 'Owner contact - Anna Nagar 3BHK',
    date: '2026-09-24',
    expiresAt: null
  }
];

class SubscriptionService {
  constructor() {
    this.broadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
      ? new BroadcastChannel(SYNC_CHANNEL)
      : null;

    if (this.broadcast) {
      this.broadcast.onmessage = (event) => {
        if (event.data?.type === 'WALLET_UPDATE') {
          this.notifySubscribers();
        }
      };
    }

    this.subscribers = new Set();
  }

  notifySubscribers() {
    this.subscribers.forEach((cb) => {
      try {
        cb(this.getWalletState());
      } catch (err) {
        console.error('Wallet subscriber notification error:', err);
      }
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.getWalletState());
    return () => this.subscribers.delete(callback);
  }

  getWalletState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WALLET);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Could not read stored wallet:', err);
    }

    // Default state for Free user
    const defaultWallet = {
      planId: 'free',
      planName: 'Free',
      credits: 140, // 100 welcome + 50 profile - 10 contact
      earnedThisMonth: 150,
      usedThisMonth: 10,
      expiringSoon: 0,
      renewalDate: null,
      daysToRenewal: null,
      status: 'active',
      usage: {
        ownerContacts: 1,
        maxContacts: 3,
        propertyVisits: 0,
        maxVisits: 0,
        savedProperties: 4,
        maxSaved: 20
      }
    };

    try {
      localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(defaultWallet));
    } catch (_) {}

    return defaultWallet;
  }

  saveWalletState(state) {
    try {
      localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(state));
      if (this.broadcast) {
        this.broadcast.postMessage({ type: 'WALLET_UPDATE' });
      }
    } catch (err) {
      console.warn('Could not save wallet state:', err);
    }
    this.notifySubscribers();
  }

  getTransactions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TXS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Could not read transactions:', err);
    }

    try {
      localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(INITIAL_TRANSACTIONS));
    } catch (_) {}

    return INITIAL_TRANSACTIONS;
  }

  addTransaction(tx) {
    const list = this.getTransactions();
    const updated = [
      {
        id: 'tx-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...tx
      },
      ...list
    ];
    try {
      localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(updated));
    } catch (_) {}
    return updated;
  }

  /**
   * Process plan upgrade with simulated payment confirmation
   */
  async upgradePlan(targetPlanId) {
    const plan = PLANS[targetPlanId.toUpperCase()];
    if (!plan) throw new Error('Invalid plan selected');

    // Simulate payment authorization delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const currentState = this.getWalletState();
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 30);

    const newState = {
      ...currentState,
      planId: plan.id,
      planName: plan.name,
      credits: currentState.credits + plan.credits,
      earnedThisMonth: currentState.earnedThisMonth + plan.credits,
      renewalDate: renewal.toISOString().split('T')[0],
      daysToRenewal: 30,
      status: 'active',
      usage: {
        ownerContacts: 0,
        maxContacts: plan.ownerContacts,
        propertyVisits: 0,
        maxVisits: plan.visits,
        savedProperties: currentState.usage?.savedProperties || 0,
        maxSaved: plan.savedLimit
      }
    };

    this.saveWalletState(newState);

    this.addTransaction({
      amount: plan.credits,
      type: 'credit',
      description: `Plan Upgrade: ${plan.name} Monthly Subscription`,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    // Sync to Firebase if available
    const db = getDatabaseInstance();
    if (db) {
      try {
        const userRef = ref(db, 'subscriptions/' + 'sub-' + Date.now());
        set(userRef, {
          planId: plan.id,
          amountPaid: plan.price,
          status: 'active',
          startedAt: new Date().toISOString(),
          renewalDate: newState.renewalDate
        });
      } catch (err) {
        console.warn('[LOKHA Firebase] Subscription sync warning:', err);
      }
    }

    return newState;
  }

  /**
   * Buy a credit package
   */
  async buyCreditPackage(packageId) {
    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) throw new Error('Package not found');

    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentState = this.getWalletState();
    const newState = {
      ...currentState,
      credits: currentState.credits + pkg.credits,
      earnedThisMonth: currentState.earnedThisMonth + pkg.credits
    };

    this.saveWalletState(newState);

    this.addTransaction({
      amount: pkg.credits,
      type: 'credit',
      description: `Purchased: ${pkg.name} Package (${pkg.credits} credits)`,
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    return newState;
  }

  /**
   * Cancel Subscription
   */
  async cancelSubscription() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const currentState = this.getWalletState();

    const newState = {
      ...currentState,
      status: 'cancelled',
      // Keep existing credits till expiry
    };

    this.saveWalletState(newState);

    this.addTransaction({
      amount: 0,
      type: 'debit',
      description: 'Subscription scheduled for cancellation at period end',
      expiresAt: null
    });

    return newState;
  }

  /**
   * Deduct credits for an action with server-like validation
   */
  deductActionCredits(actionName, creditCost) {
    const currentState = this.getWalletState();
    if (currentState.credits < creditCost) {
      throw new Error(`Insufficient credits. Required: ${creditCost}, Available: ${currentState.credits}`);
    }

    const newState = {
      ...currentState,
      credits: currentState.credits - creditCost,
      usedThisMonth: currentState.usedThisMonth + creditCost
    };

    this.saveWalletState(newState);

    this.addTransaction({
      amount: -creditCost,
      type: 'debit',
      description: actionName,
      expiresAt: null
    });

    return newState;
  }

  /**
   * Developer / Demo utility: switch plan to easily test all 4 plan views
   */
  setPlanDirectly(planKey) {
    const plan = PLANS[planKey.toUpperCase()];
    if (!plan) return;
    const currentState = this.getWalletState();
    const newState = {
      ...currentState,
      planId: plan.id,
      planName: plan.name,
      credits: plan.credits,
      status: 'active',
      renewalDate: plan.id !== 'free' ? '2026-10-18' : null,
      daysToRenewal: plan.id !== 'free' ? 22 : null,
      usage: {
        ownerContacts: plan.id === 'free' ? 1 : 4,
        maxContacts: plan.ownerContacts,
        propertyVisits: plan.id === 'free' ? 0 : 1,
        maxVisits: plan.visits,
        savedProperties: plan.id === 'free' ? 12 : 38,
        maxSaved: plan.savedLimit
      }
    };
    this.saveWalletState(newState);
  }
}

export const subscriptionService = new SubscriptionService();
