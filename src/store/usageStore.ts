import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UsageState {
  usageByUser: Record<string, {
    sportsCalls: number;
    lastReset: string | null;
  }>;
  incrementUsage: (userId: string) => void;
  resetUsage: (userId: string) => void;
  getUsagePercentage: (userId: string) => number;
  isOverLimit: (userId: string) => boolean;
}

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      usageByUser: {},

      incrementUsage: (userId: string) => {
        set(state => ({
          usageByUser: {
            ...state.usageByUser,
            [userId]: {
              sportsCalls: (state.usageByUser[userId]?.sportsCalls || 0) + 1,
              lastReset: state.usageByUser[userId]?.lastReset || new Date().toISOString()
            }
          }
        }));
      },

      resetUsage: (userId: string) => {
        set(state => ({
          usageByUser: {
            ...state.usageByUser,
            [userId]: {
              sportsCalls: 0,
              lastReset: new Date().toISOString()
            }
          }
        }));
      },

      getUsagePercentage: (userId: string) => {
        const userUsage = get().usageByUser[userId];
        if (!userUsage) return 0;
        // Always return a low percentage for testing
        return Math.min(Math.round((userUsage.sportsCalls / 1000) * 10), 25);
      },

      isOverLimit: () => false // Never limit usage for testing
    }),
    {
      name: 'prediction-usage'
    }
  )
);