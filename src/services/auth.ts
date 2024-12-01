import { create } from 'zustand';
import { supabase } from './supabase';

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showingSignup: boolean;
  initialize: () => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (data: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  showLogin: () => void;
  showSignup: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  showingSignup: false,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ 
          user: { ...session.user, profile },
          isAuthenticated: true,
          isLoading: false 
        });
      } else {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false 
        });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ 
            user: { ...session.user, profile },
            isAuthenticated: true,
            isLoading: false,
            error: null 
          });
        } else if (event === 'SIGNED_OUT') {
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false 
          });
        }
      });

    } catch (error: any) {
      console.error('Init Error:', error);
      set({ 
        error: 'Failed to initialize authentication',
        isLoading: false 
      });
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({ 
          user: { ...data.user, profile },
          isAuthenticated: true,
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Login failed',
        isLoading: false 
      });
    }
  },

  signup: async ({ email, password, name }) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              name,
              email
            }
          ]);

        if (profileError) throw profileError;

        set({ 
          user: data.user,
          isAuthenticated: true,
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Signup failed',
        isLoading: false 
      });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Logout failed',
        isLoading: false 
      });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      set({ 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Password reset failed',
        isLoading: false 
      });
    }
  },

  updateUser: async (data: any) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', useAuth.getState().user?.id);

      if (error) throw error;

      set(state => ({
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            ...data
          }
        },
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update user',
        isLoading: false 
      });
    }
  },

  showLogin: () => set({ showingSignup: false }),
  showSignup: () => set({ showingSignup: true })
}));