import React, { useEffect } from 'react';
import { useAuth } from '../../services/auth';
import { useSubscription } from '../../services/subscription';
import { User, CreditCard, Activity, AlertCircle } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const { status, plan, usage, initialize, cancelSubscription, isLoading } = useSubscription();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const usagePercentage = (usage / 1000) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Section */}
        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <User className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-xl font-bold text-green-400">Profile</h2>
              <p className="text-zinc-400">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={() => useAuth.getState().logout()}
            className="neo-button bg-zinc-800/50 text-zinc-400 px-4 py-2 rounded-lg hover:bg-zinc-800/70"
          >
            Sign Out
          </button>
        </div>

        {/* Subscription Section */}
        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <CreditCard className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-xl font-bold text-green-400">Subscription</h2>
              <p className="text-zinc-400">
                {status === 'active' ? 'Personal Plan' : 'No active subscription'}
              </p>
            </div>
          </div>

          {status === 'active' && (
            <button
              onClick={cancelSubscription}
              disabled={isLoading}
              className="neo-button bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30"
            >
              Cancel Subscription
            </button>
          )}
        </div>

        {/* Usage Section */}
        <div className="glass-panel rounded-lg p-6 md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <Activity className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-xl font-bold text-green-400">API Usage</h2>
              <p className="text-zinc-400">{usage} / 1000 calls this month</p>
            </div>
          </div>

          <div className="relative h-4 bg-zinc-800/50 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-green-500/30 transition-all duration-500"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>

          {usagePercentage >= 90 && (
            <div className="mt-4 flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span>Approaching monthly limit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}