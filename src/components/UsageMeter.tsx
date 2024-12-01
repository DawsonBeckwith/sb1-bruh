import React, { useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { useUsageStore } from '../store/usageStore';
import { useSession } from '../hooks/useSession';
import PricingModal from './pricing/PricingModal';

export default function UsageMeter() {
  const { userId } = useSession();
  const { getUsagePercentage } = useUsageStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const usage = userId ? getUsagePercentage(userId) : 0;

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowPricing(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load pricing options');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="#1a2e1a"
                strokeWidth="3"
              />
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="#4ade80"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${usage * 1.88} 188`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-green-400 filter drop-shadow-lg">
                {usage}%
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold text-green-400/70 uppercase tracking-wider">
              Usage
            </span>
            <span className="text-lg font-display text-green-400">
              Active
            </span>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>Upgrade Plan</span>
            </>
          )}
        </button>
      </div>

      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />
    </>
  );
}