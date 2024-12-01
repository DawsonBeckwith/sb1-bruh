import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient()
});

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

export const handleCors = () => ({
  statusCode: 204,
  headers: corsHeaders
});

export const handleError = (error: any) => ({
  statusCode: 400,
  headers: {
    ...corsHeaders,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    error: error instanceof Error ? error.message : 'An unexpected error occurred'
  })
});

export const handleSuccess = (data: any) => ({
  statusCode: 200,
  headers: {
    ...corsHeaders,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});