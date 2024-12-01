export const STRIPE_CONFIG = {
  CURRENCY: 'usd',
  SUBSCRIPTION_AMOUNT: 2500, // $25.00
  PAYMENT_METHODS: ['card'] as const,
  MODE: 'subscription' as const
};

export const CORS_CONFIG = {
  ALLOWED_ORIGINS: ['*'],
  ALLOWED_HEADERS: [
    'authorization',
    'x-client-info',
    'apikey',
    'content-type'
  ]
};