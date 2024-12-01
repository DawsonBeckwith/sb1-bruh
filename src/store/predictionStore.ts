import { create } from 'zustand';

interface PredictionState {
  predictions: Record<string, string>;
  loading: boolean;
  error: string | null;
  setPrediction: (key: string, value: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearPredictions: () => void;
}

export const usePredictionStore = create<PredictionState>((set) => ({
  predictions: {},
  loading: false,
  error: null,
  setPrediction: (key, value) => {
    if (!key) return;
    const safeValue = String(value || '').trim() || 'Processing...';
    const safeKey = String(key).trim();
    
    set(state => ({
      predictions: { 
        ...state.predictions, 
        [safeKey]: safeValue 
      },
      loading: false
    }));
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error: error ? String(error).trim() : null, loading: false }),
  clearError: () => set({ error: null }),
  clearPredictions: () => set({ predictions: {} })
}));