import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';

export default function SignupForm() {
  const { signup, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.name.trim()) {
      setValidationError('Please enter your name');
      return;
    }

    if (!formData.email.includes('@')) {
      setValidationError('Please enter a valid email');
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    signup(formData);
  };

  return (
    <div className="w-full">
      <div className="glass-panel rounded-xl backdrop-blur-xl p-8 border border-zinc-800/50">
        {(error || validationError) && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-zinc-900/50 border border-zinc-800/50 text-green-400 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-zinc-900/50 border border-zinc-800/50 text-green-400 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-zinc-900/50 border border-zinc-800/50 text-green-400 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full neo-button bg-green-500/20 text-green-400 py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="font-medium">Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => useAuth.getState().showLogin()}
            className="text-zinc-400 hover:text-green-400 text-sm flex items-center gap-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}