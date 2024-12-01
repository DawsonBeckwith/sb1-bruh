import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { STRIPE_CONFIG } from '../../config/stripe';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'pricing-table-id': string;
        'publishable-key': string;
      };
    }
  }
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  useEffect(() => {
    // Load Stripe Pricing Table script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-50 w-full max-w-4xl bg-zinc-950 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-green-400">Upgrade Your Plan</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-green-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <stripe-pricing-table
            pricing-table-id={STRIPE_CONFIG.PRICING_TABLE_ID}
            publishable-key={STRIPE_CONFIG.PUBLIC_KEY}
          />
        </div>
      </div>
    </div>
  );
}