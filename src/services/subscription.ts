import { loadStripe } from '@stripe/stripe-js';
import { create } from 'zustand';
import { useAuth } from './auth';

const STRIPE_PUBLIC_KEY = 'pk_live_51MXap1CJatUH9frb7V6eAnooebNcg0POfX3COeXqiAoNRQhrcgLFrEaeCbe9eKNLwYHufpAl0zxxhlcMszRaKa3N00ec6MYywY';
const PRICE_ID = 'price_1QNZEeCJatUH9frb6nVaorz9';

interface SubscriptionState {
  status: 'active' | 'inactive' | 'past_due' | null;
  plan: 'personal' | null;
  usage: number;
  isLoading: boolean;
  error: string | null;
  checkoutSession: any;
  initialize: () => Promise<void>;
  createCheckoutSession: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateUsage: (amount: number) => void;
}

export const useSubscription = create<SubscriptionState>((set, get) => ({
  status: null,
  plan: null,
  usage: 0,
  isLoading: false,
  error: null,
  checkoutSession: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const { user } = useAuth.getState();
      
      if (!user) {
        set({ status: null, plan: null });
        return;
      }

      const response = await fetch('/.netlify/functions/get-subscription', {
        headers: {
          Authorization: `Bearer ${user.token.access_token}`
        }
      });

      const data = await response.json();
      set({
        status: data.status,
        plan: data.plan,
        usage: data.usage || 0,
        isLoading: false
      });
    } catch (error) {
      set({ error: 'Failed to load subscription', isLoading: false });
    }
  },

  createCheckoutSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const { user } = useAuth.getState();
      
      if (!user) {
        throw new Error('Please log in to subscribe');
      }

      const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      if (!stripe) throw new Error('Failed to load payment system');

      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: PRICE_ID,
          successUrl: window.location.origin + '/dashboard',
          cancelUrl: window.location.origin + '/pricing'
        })
      });

      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (error: any) {
      set({ error: error.message || 'Payment setup failed', isLoading: false });
    }
  },

  cancelSubscription: async () => {
    try {
      set({ isLoading: true, error: null });
      const { user } = useAuth.getState();
      
      if (!user) {
        throw new Error('Please log in to manage subscription');
      }

      const response = await fetch('/.netlify/functions/cancel-subscription', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token.access_token}`
        }
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      set({
        status: 'inactive',
        plan: null,
        isLoading: false
      });

    } catch (error: any) {
      set({ error: error.message || 'Failed to cancel subscription', isLoading: false });
    }
  },

  updateUsage: (amount: number) => {
    set(state => ({ usage: state.usage + amount }));
  }
}));