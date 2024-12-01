import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.email.includes('@')) {
      setValidationError('Please enter a valid email');
      return;
    }

    if (!formData.password) {
      setValidationError('Please enter your password');
      return;
    }

    login(formData);
  };

  return (
    <div className="w-full">
      <div className="glass-panel rounded-xl backdrop-blur-xl p-8 border border-zinc-800/50">
        {(error || validationError) && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full h-12 bg-zinc-900/50 border border-zinc-800/50 text-green-400 pl-12 pr-4 rounded-lg focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full h-12 bg-zinc-900/50 border border-zinc-800/50 text-green-400 pl-12 pr-4 rounded-lg focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 neo-button bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span className="font-medium">Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4 text-center">
          <button
            onClick={() => useAuth.getState().resetPassword(formData.email)}
            className="text-sm text-zinc-400 hover:text-green-400 transition-colors"
            disabled={isLoading}
          >
            Forgot password?
          </button>
          
          <div className="text-sm text-zinc-400">
            Don't have an account?{' '}
            <button
              onClick={() => useAuth.getState().showSignup()}
              className="text-green-400 hover:text-green-300 transition-colors font-medium"
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}