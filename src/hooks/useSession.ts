import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THENTY_CONFIG } from '../config/thenty';

interface SessionState {
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  thentyId: string | null;
  authKey: string | null;
  initialized: boolean;
  error: string | null;
  authInitializing: boolean;
  setSession: (userId: string, username: string, thentyId: string, authKey: string) => void;
  clearSession: () => void;
  setError: (error: string | null) => void;
  initializeAuth: () => Promise<void>;
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      userId: null,
      username: null,
      thentyId: null,
      authKey: null,
      isAuthenticated: false,
      initialized: false,
      error: null,
      authInitializing: false,

      setSession: (userId, username, thentyId, authKey) => {
        console.log('Setting session:', { userId, username, thentyId });
        set({ 
          userId, 
          username, 
          thentyId, 
          authKey,
          isAuthenticated: true,
          error: null,
          initialized: true,
          authInitializing: false
        });

        window.parent.postMessage({
          type: 'AUTH_SUCCESS',
          userId,
          username,
          deployUrl: window.location.origin
        }, '*');
      },

      clearSession: () => {
        set({ 
          userId: null, 
          username: null, 
          thentyId: null, 
          authKey: null,
          isAuthenticated: false,
          error: null,
          initialized: true,
          authInitializing: false
        });

        window.parent.postMessage({
          type: 'AUTH_LOGOUT',
          deployUrl: window.location.origin
        }, '*');
      },

      setError: (error) => set({ error }),

      initializeAuth: async () => {
        const state = get();
        
        if (state.authInitializing) {
          return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
              const currentState = get();
              if (currentState.isAuthenticated) {
                clearInterval(checkInterval);
                resolve();
              }
              if (!currentState.authInitializing) {
                clearInterval(checkInterval);
                reject(new Error('Authentication failed'));
              }
            }, 100);

            setTimeout(() => {
              clearInterval(checkInterval);
              reject(new Error('Authentication timeout'));
            }, 5000);
          });
        }

        set({ authInitializing: true });

        try {
          window.parent.postMessage({
            type: 'REQUEST_AUTH',
            deployUrl: window.location.origin
          }, '*');

          const authData = await new Promise((resolve, reject) => {
            const handleMessage = (event: MessageEvent) => {
              const allowedOrigins = [
                'https://framer.com',
                'https://framer.website',
                'https://provisionpicks.com',
                'https://www.provisionpicks.com',
                window.location.origin
              ];

              if (!allowedOrigins.includes(event.origin)) return;

              if (event.data?.type === 'THENTY_AUTH') {
                window.removeEventListener('message', handleMessage);
                console.log('Received auth data:', event.data);
                resolve(event.data);
              }
            };

            window.addEventListener('message', handleMessage);

            setTimeout(() => {
              window.removeEventListener('message', handleMessage);
              reject(new Error('Authentication timeout'));
            }, 5000);
          });

          const { userId, username, thentyId, authKey } = authData as any;
          
          if (!userId || !username || !thentyId || !authKey) {
            throw new Error('Invalid authentication data');
          }

          get().setSession(userId, username, thentyId, authKey);

        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Authentication failed',
            authInitializing: false
          });
          throw error;
        }
      }
    }),
    {
      name: 'prediction-session',
      partialize: (state) => ({
        userId: state.userId,
        username: state.username,
        thentyId: state.thentyId,
        authKey: state.authKey,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);