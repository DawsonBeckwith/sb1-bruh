import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const user = event.context.clientContext?.user;

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.sub,
      status: 'active',
      expand: ['data.default_payment_method']
    });

    if (!subscriptions.data.length) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'inactive',
          plan: null
        })
      };
    }

    const subscription = subscriptions.data[0];

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: subscription.status,
        plan: 'personal',
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};