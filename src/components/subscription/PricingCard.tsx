import React from 'react';
import { useAuth } from '../../services/auth';
import { useSubscription } from '../../services/subscription';
import { Check, Loader2 } from 'lucide-react';

export default function PricingCard() {
  const { isAuthenticated } = useAuth();
  const { createCheckoutSession, isLoading, error } = useSubscription();

  const features = [
    'VisionAI Access',
    'PropAI Access',
    'Real-time Predictions',
    'Up to 1000 API calls/month',
    'Email Support'
  ];

  return (
    <div className="max-w-sm mx-auto glass-panel rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-green-400">Personal Plan</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-green-400">$25</span>
          <span className="text-zinc-400">/month</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-zinc-400">
            <Check className="w-5 h-5 text-green-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => isAuthenticated ? createCheckoutSession() : useAuth.getState().login()}
        disabled={isLoading}
        className="w-full neo-button bg-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-500/30"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <span>{isAuthenticated ? 'Subscribe Now' : 'Sign in to Subscribe'}</span>
        )}
      </button>
    </div>
  );
}