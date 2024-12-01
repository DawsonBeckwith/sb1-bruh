import { useEffect, useRef, useCallback } from 'react';
import { usePredictionStore } from '../store/predictionStore';
import { fetchPredictions } from '../services/api';
import { handleApiError } from '../utils/errorHandling';
import { useWebSocket } from './useWebSocket';
import { useSession } from '../hooks/useSession';

const FALLBACK_INTERVAL = 1000;

export function useLiveData(
  type: 'stock' | 'crypto' | 'vision' | 'prop', 
  symbol?: string,
  onUpdate?: (data: any) => void
) {
  const {
    setLoading,
    setError,
    clearError
  } = usePredictionStore();

  const { isAuthenticated, authInitializing } = useSession();

  const mounted = useRef(true);
  const pollInterval = useRef<NodeJS.Timeout>();
  const onUpdateRef = useRef(onUpdate);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const handleData = useCallback((data: any) => {
    if (!mounted.current) return;
    
    const now = Date.now();
    if (now - lastUpdateRef.current < 100) return;
    
    lastUpdateRef.current = now;
    
    if (onUpdateRef.current) {
      onUpdateRef.current(data);
    }
    clearError();
  }, [clearError]);

  const handleError = useCallback((error: any) => {
    if (mounted.current) {
      setError(handleApiError(error).message);
    }
  }, [setError]);

  const fetchData = useCallback(async () => {
    if (!mounted.current || !isAuthenticated || authInitializing) return;
    
    try {
      const data = await fetchPredictions(type, symbol);
      if (mounted.current && data) {
        handleData(data);
      }
    } catch (error) {
      handleError(error);
    }
  }, [type, symbol, handleData, handleError, isAuthenticated, authInitializing]);

  useWebSocket(`${type}/${symbol || ''}`, handleData);

  useEffect(() => {
    mounted.current = true;
    
    if (isAuthenticated && !authInitializing) {
      fetchData();
      pollInterval.current = setInterval(fetchData, FALLBACK_INTERVAL);
    }

    const handleFetchTrigger = () => {
      if (mounted.current && isAuthenticated && !authInitializing) {
        fetchData();
      }
    };

    window.addEventListener('fetch-prediction', handleFetchTrigger);

    return () => {
      mounted.current = false;
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
      window.removeEventListener('fetch-prediction', handleFetchTrigger);
    };
  }, [fetchData, isAuthenticated, authInitializing]);
}