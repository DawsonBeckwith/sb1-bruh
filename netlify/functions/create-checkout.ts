import { Handler } from '@netlify/functions';
import { stripe } from './utils/stripe';
import { supabase } from './utils/supabase';
import { STRIPE_CONFIG } from './utils/config';
import { successResponse, errorResponse, corsResponse } from './utils/responses';
import type { StripeSession, NetlifyContext } from './utils/types';

export const handler: Handler = async (event, context: NetlifyContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return corsResponse();
  }

  try {
    if (event.httpMethod !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { productId, userId, email, name, successUrl, cancelUrl } = 
      JSON.parse(event.body || '') as StripeSession;

    // Validate required fields
    if (!productId || !userId || !email || !successUrl || !cancelUrl) {
      throw new Error('Missing required fields');
    }

    // Get or create Stripe customer
    const { data: customers } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', userId)
      .maybeSingle();

    let customerId = customers?.customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { user_id: userId }
      });
      customerId = customer.id;

      await supabase.from('stripe_customers').upsert({
        user_id: userId,
        customer_id: customerId,
        email,
        name,
        product_id: productId
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: STRIPE_CONFIG.MODE,
      payment_method_types: STRIPE_CONFIG.PAYMENT_METHODS,
      line_items: [{
        price_data: {
          currency: STRIPE_CONFIG.CURRENCY,
          product: productId,
          recurring: { interval: 'month' },
          unit_amount: STRIPE_CONFIG.SUBSCRIPTION_AMOUNT
        },
        quantity: 1
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id: userId }
    });

    return successResponse({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return errorResponse(error);
  }
};