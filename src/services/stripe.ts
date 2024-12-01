import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const STRIPE_PUBLIC_KEY = 'pk_test_51MXap1CJatUH9frbyKsbiGjXUat0OZPuob3irzn4wPR7CmimZUuCFrw3D5RQrUUFcoRGPxdcUSjcufwaKyoVyVfn00nDyiTKzT';
const PRODUCT_ID = 'prod_RGktfdqLIAHg4m';

let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const createCheckoutSession = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Please sign in to upgrade');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error: metadataError } = await supabase
      .from('stripe_customers')
      .upsert([
        {
          user_id: user.id,
          email: user.email,
          name: profile?.name || user.email?.split('@')[0],
          product_id: PRODUCT_ID
        }
      ]);

    if (metadataError) {
      console.error('Failed to save customer metadata:', metadataError);
    }

    const { data: sessionData, error: sessionError } = await supabase
      .functions.invoke('create-checkout-session', {
        body: {
          productId: PRODUCT_ID,
          userId: user.id,
          email: user.email,
          name: profile?.name,
          successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.origin
        }
      });

    if (sessionError || !sessionData?.sessionId) {
      throw new Error(sessionError?.message || 'Failed to create checkout session');
    }

    const result = await stripe.redirectToCheckout({
      sessionId: sessionData.sessionId
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

  } catch (error: any) {
    console.error('Checkout error:', error);
    throw new Error(error.message || 'Failed to start checkout process');
  }
};