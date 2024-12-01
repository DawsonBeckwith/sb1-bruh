import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
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
      status: 'active'
    });

    if (!subscriptions.data.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No active subscription found' })
      };
    }

    const subscription = subscriptions.data[0];
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Subscription will be canceled at the end of the billing period'
      })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};