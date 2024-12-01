import React from 'react';
import { useAuth } from '../services/auth';
import { User } from 'lucide-react';

export default function UserInfo() {
  const { user, logout } = useAuth();
  const displayName = user?.profile?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex items-center gap-3 px-4 py-2 glass-panel rounded-lg">
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
        <User className="w-4 h-4 text-green-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-green-400">{displayName}</span>
        <span className="text-xs text-zinc-500">{user?.email}</span>
      </div>
      <button
        onClick={logout}
        className="ml-4 text-sm text-zinc-400 hover:text-green-400 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}