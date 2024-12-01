import { useEffect } from 'react';
import { useSession } from './useSession';
import { THENTY_CONFIG } from '../config/thenty';

export function useThenty() {
  const { initializeAuth } = useSession();

  useEffect(() => {
    // Initialize auth on mount and handle parent frame communication
    const initAuth = async () => {
      try {
        await initializeAuth();
        // Notify parent frame we're ready
        window.parent.postMessage({
          type: 'PREDICTION_READY',
          deployUrl: window.location.origin
        }, '*');
      } catch (error) {
        console.error('Failed to initialize Thenty auth:', error);
      }
    };

    initAuth();

    // Re-initialize on visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        initAuth();
      }
    };

    // Listen for parent frame auth updates
    const handleParentMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        'https://framer.com',
        'https://framer.website',
        'https://provisionpicks.com',
        'https://www.provisionpicks.com',
        window.location.origin
      ];

      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data?.type === 'THENTY_AUTH_UPDATE') {
        initAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('message', handleParentMessage);

    // Periodic auth check
    const authCheckInterval = setInterval(initAuth, 300000); // Check every 5 minutes

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('message', handleParentMessage);
      clearInterval(authCheckInterval);
    };
  }, [initializeAuth]);
}