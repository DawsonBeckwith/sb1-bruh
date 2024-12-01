import { Context } from '@netlify/functions';

export interface StripeSession {
  productId: string;
  userId: string;
  email: string;
  name?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface NetlifyContext extends Context {
  clientContext?: {
    user?: {
      sub: string;
      email: string;
      user_metadata?: {
        name?: string;
      };
    };
  };
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  metadata: {
    user_id: string;
  };
}